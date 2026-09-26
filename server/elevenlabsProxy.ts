import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Connect, Plugin } from 'vite';

const ELEVEN_BASE = 'https://api.elevenlabs.io/v1';
// Daniel — Steady Broadcaster. Premade male voice; free-tier keys can synthesize him.
const PREMADE_MALE_VOICE_ID = 'onwK4e9ZLuTAKqWW03F9';
const DEFAULT_VOICE_ID = PREMADE_MALE_VOICE_ID;
const DEFAULT_TTS_MODEL = 'eleven_multilingual_v2';
const STT_MODEL = 'scribe_v1';
const MAX_TTS_CHARS = 1000;
const MAX_AUDIO_BYTES = 10 * 1024 * 1024;
const MAX_JSON_BYTES = 16 * 1024;
const HEALTH_TTL_MS = 5 * 60 * 1000;

interface ProxyOptions {
  apiKey?: string;
  voiceId?: string;
  ttsModel?: string;
}

class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function readBody(req: IncomingMessage, limit: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    let aborted = false;
    req.on('data', (chunk: Buffer) => {
      if (aborted) return;
      size += chunk.length;
      if (size > limit) {
        aborted = true;
        reject(new HttpError(413, `Request body too large (max ${Math.round(limit / 1024)} KB)`));
        req.resume();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      if (!aborted) resolve(Buffer.concat(chunks));
    });
    req.on('error', (err) => {
      if (!aborted) reject(err);
    });
  });
}

async function upstreamError(resp: Response): Promise<HttpError> {
  let detail = `ElevenLabs request failed (${resp.status})`;
  try {
    const data = (await resp.json()) as { detail?: { message?: string; code?: string } | string };
    if (typeof data.detail === 'string') detail = data.detail;
    else if (data.detail?.message) detail = data.detail.message;
  } catch {
    // non-JSON upstream error body
  }
  const status = resp.status === 401 || resp.status === 402 || resp.status === 403 ? 502 : resp.status >= 500 ? 502 : resp.status;
  return new HttpError(status, detail);
}

function createHandlers(opts: ProxyOptions) {
  const apiKey = opts.apiKey?.trim() || '';
  const preferredVoiceId = opts.voiceId?.trim() || DEFAULT_VOICE_ID;
  const ttsModel = opts.ttsModel?.trim() || DEFAULT_TTS_MODEL;
  let activeVoiceId = preferredVoiceId;
  let healthCache: { at: number; value: { tts: boolean; stt: boolean } } | null = null;

  const voiceSettings = {
    stability: 0.65,
    similarity_boost: 0.82,
    style: 0,
    use_speaker_boost: true,
    speed: 0.94,
  };

  async function voiceExists(id: string): Promise<boolean> {
    try {
      const r = await fetch(`${ELEVEN_BASE}/voices/${id}`, { headers: { 'xi-api-key': apiKey } });
      return r.ok;
    } catch {
      return false;
    }
  }

  function requestTts(text: string, voice: string): Promise<Response> {
    return fetch(`${ELEVEN_BASE}/text-to-speech/${voice}/stream?output_format=mp3_44100_128`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: ttsModel,
        apply_text_normalization: 'on',
        voice_settings: voiceSettings,
      }),
    });
  }

  async function checkHealth(): Promise<{ tts: boolean; stt: boolean }> {
    if (!apiKey) return { tts: false, stt: false };
    if (healthCache && Date.now() - healthCache.at < HEALTH_TTL_MS) return healthCache.value;

    // A valid key can always see the premade male voice. Library voices 402 at synthesis time
    // on free plans; TTS then falls back to that premade voice.
    const tts = (await voiceExists(PREMADE_MALE_VOICE_ID)) || (await voiceExists(preferredVoiceId));

    // An empty multipart request returns 400 (validation) when the key has STT access,
    // and 401/403 when it does not.
    let stt = false;
    try {
      const form = new FormData();
      form.append('model_id', STT_MODEL);
      const r = await fetch(`${ELEVEN_BASE}/speech-to-text`, {
        method: 'POST',
        headers: { 'xi-api-key': apiKey },
        body: form,
      });
      stt = r.ok || r.status === 400 || r.status === 422;
    } catch {
      stt = false;
    }

    const value = { tts, stt };
    healthCache = { at: Date.now(), value };
    return value;
  }

  async function handleTts(req: IncomingMessage, res: ServerResponse) {
    if (!apiKey) throw new HttpError(503, 'Voice service not configured');
    const raw = await readBody(req, MAX_JSON_BYTES);
    let payload: { text?: unknown; language?: unknown };
    try {
      payload = JSON.parse(raw.toString('utf8'));
    } catch {
      throw new HttpError(400, 'Body must be JSON: { text, language? }');
    }
    const text = typeof payload.text === 'string' ? payload.text.trim() : '';
    if (!text) throw new HttpError(400, '`text` is required');
    if (text.length > MAX_TTS_CHARS) throw new HttpError(400, `\`text\` too long (max ${MAX_TTS_CHARS} characters)`);

    let upstream = await requestTts(text, activeVoiceId);
    if (!upstream.ok && upstream.status === 402 && activeVoiceId !== PREMADE_MALE_VOICE_ID) {
      await upstream.body?.cancel().catch(() => undefined);
      activeVoiceId = PREMADE_MALE_VOICE_ID;
      upstream = await requestTts(text, activeVoiceId);
    }
    if (!upstream.ok || !upstream.body) throw await upstreamError(upstream);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-store');
    const reader = upstream.body.getReader();
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!res.write(Buffer.from(value))) {
        await new Promise<void>((resolve) => res.once('drain', () => resolve()));
      }
    }
    res.end();
  }

  async function handleStt(req: IncomingMessage, res: ServerResponse) {
    if (!apiKey) throw new HttpError(503, 'Voice service not configured');
    const audio = await readBody(req, MAX_AUDIO_BYTES);
    if (audio.length < 512) throw new HttpError(400, 'Audio is empty or too short');

    const contentType = (req.headers['content-type'] || 'audio/webm').split(';')[0].trim();
    const ext = contentType.includes('ogg') ? 'ogg' : contentType.includes('mp4') ? 'm4a' : contentType.includes('wav') ? 'wav' : contentType.includes('mpeg') ? 'mp3' : 'webm';

    const form = new FormData();
    form.append('file', new Blob([new Uint8Array(audio)], { type: contentType }), `speech.${ext}`);
    form.append('model_id', STT_MODEL);
    form.append('tag_audio_events', 'false');

    const upstream = await fetch(`${ELEVEN_BASE}/speech-to-text`, {
      method: 'POST',
      headers: { 'xi-api-key': apiKey },
      body: form,
    });
    if (!upstream.ok) throw await upstreamError(upstream);
    const data = (await upstream.json()) as { text?: string; language_code?: string; language_probability?: number };
    sendJson(res, 200, {
      text: (data.text || '').trim(),
      languageCode: data.language_code || null,
      languageProbability: data.language_probability ?? null,
    });
  }

  const middleware: Connect.NextHandleFunction = (req, res, next) => {
    const url = (req.url || '').split('?')[0];
    const route =
      url === '/api/tts' ? 'tts' : url === '/api/stt' ? 'stt' : url === '/api/voice/health' ? 'health' : null;
    if (!route) return next();

    const expectedMethod = route === 'health' ? 'GET' : 'POST';
    if (req.method !== expectedMethod) {
      sendJson(res, 405, { error: `Use ${expectedMethod}` });
      return;
    }

    const run = async () => {
      if (route === 'health') sendJson(res, 200, await checkHealth());
      else if (route === 'tts') await handleTts(req, res);
      else await handleStt(req, res);
    };

    run().catch((err: unknown) => {
      const status = err instanceof HttpError ? err.status : 500;
      const message = err instanceof HttpError ? err.message : 'Voice proxy error';
      if (!(err instanceof HttpError)) console.warn('[voice-proxy]', err instanceof Error ? err.message : err);
      if (res.headersSent) {
        res.end();
      } else {
        sendJson(res, status, { error: message });
      }
    });
  };

  return middleware;
}

export function elevenLabsProxy(opts: ProxyOptions): Plugin {
  const middleware = createHandlers(opts);
  return {
    name: 'finbuddy-elevenlabs-proxy',
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}
