import type { CopilotLanguage } from '../types';

// -------------------------------------------------------------
// Language detection (English / Devanagari Hindi / Roman Hinglish)
// -------------------------------------------------------------

const DEVANAGARI = /[\u0900-\u097F]/;

const HINGLISH_WORDS = new Set([
  'hai', 'hain', 'ho', 'tha', 'thi', 'the', 'kya', 'kyu', 'kyun', 'kyon', 'kitna', 'kitni', 'kitne', 'kaisa', 'kaisi',
  'kaise', 'kab', 'kahan', 'kaha', 'kaun', 'kon', 'aaj', 'kal', 'abhi', 'bika', 'biki', 'bikri', 'maal',
  'khatam', 'batao', 'bata', 'bataiye', 'dikhao', 'dikha', 'karo', 'karu', 'karna', 'kar', 'do', 'dijiye', 'mein',
  'me', 'nahi', 'nahin', 'na', 'accha', 'acha', 'achha', 'bhai', 'bhaiya', 'ji', 'haan', 'han', 'aur', 'ya', 'ka',
  'ki', 'ke', 'ko', 'se', 'par', 'pe', 'sabse', 'zyada', 'jyada', 'kam', 'thoda', 'bahut', 'bohot', 'mera', 'meri',
  'mere', 'apna', 'hamara', 'rahi', 'raha', 'rahe', 'hua', 'hui', 'hue', 'wala', 'wali', 'dukaan', 'dukan', 'grahak',
  'paisa', 'paise', 'kamai', 'hafte', 'hafta', 'mahina', 'din', 'chahiye', 'chalega', 'lena', 'lu', 'lo', 'badhao',
  'mangwao', 'mangao', 'yeh', 'ye', 'woh', 'wo', 'kuch', 'sab', 'uska', 'uski', 'iska', 'iski', 'bolo',
  'bol', 'rahe', 'hoga', 'hogi', 'sakta', 'sakti', 'sakte', 'lekin', 'magar', 'phir', 'fir', 'toh', 'to', 'bhi',
]);

// Very short tokens that also occur in English; only count them when other Hindi evidence exists.
const AMBIGUOUS = new Set(['do', 'to', 'the', 'me', 'na', 'ho', 'par', 'pe', 'se', 'ya', 'han', 'lo', 'ye', 'bhi']);

export function detectLanguage(text: string): CopilotLanguage {
  if (!text) return 'en';
  if (DEVANAGARI.test(text)) return 'hi';
  const tokens = text.toLowerCase().match(/[a-z]+/g) || [];
  let strong = 0;
  for (const t of tokens) {
    if (HINGLISH_WORDS.has(t) && !AMBIGUOUS.has(t)) strong++;
  }
  if (/stock khatam|kar do|kar dijiye|ho gaya|ho gya/.test(text.toLowerCase())) strong++;
  return strong >= 1 ? 'hinglish' : 'en';
}

// -------------------------------------------------------------
// Text cleanup for listening
// -------------------------------------------------------------

export function cleanTextForSpeech(text: string, lang: CopilotLanguage): string {
  const rupeeWord = lang === 'hi' ? 'रुपये' : lang === 'hinglish' ? 'rupaye' : 'rupees';
  const percentWord = lang === 'hi' ? 'प्रतिशत' : 'percent';
  const unitsWord = lang === 'en' ? 'units' : lang === 'hi' ? 'पीस' : 'piece';

  return text
    .replace(/\p{Extended_Pictographic}|\uFE0F|\u200D/gu, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\*\*|__|\*|#{1,6}\s?/g, '')
    .replace(/^\s*[-•·]\s+/gm, '')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/(?:₹|Rs\.?|INR)\s?([\d,]+(?:\.\d+)?)/gi, `$1 ${rupeeWord}`)
    .replace(/\(\s*x\s?(\d+)\s*\)/gi, ` $1 ${unitsWord}`)
    .replace(/\bx(\d+)\b/gi, ` $1 ${unitsWord}`)
    .replace(/(\d)\s?%/g, `$1 ${percentWord}`)
    .replace(/\s?(?:->|→|⇒)\s?/g, ', ')
    .replace(/\s*[|/]\s*/g, ', ')
    .replace(/\n{2,}/g, '. ')
    .replace(/\n/g, ', ')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([,.!?।])/g, '$1')
    .replace(/([.,!?।])\s*[.,]+/g, '$1')
    .trim();
}

function clipForTts(text: string, max = 950): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastStop = Math.max(cut.lastIndexOf('.'), cut.lastIndexOf('।'), cut.lastIndexOf('?'), cut.lastIndexOf('!'));
  return lastStop > max * 0.5 ? cut.slice(0, lastStop + 1) : cut;
}

// -------------------------------------------------------------
// Voice backend health (ElevenLabs via dev-server proxy)
// -------------------------------------------------------------

export interface VoiceHealth {
  tts: boolean;
  stt: boolean;
}

let healthPromise: Promise<VoiceHealth> | null = null;
let ttsDisabledUntil = 0;
let sttDisabledUntil = 0;
const BACKOFF_MS = 20 * 1000;
const HEALTH_TIMEOUT_MS = 12000;

export function getVoiceHealth(force = false): Promise<VoiceHealth> {
  if (force) healthPromise = null;
  if (!healthPromise) {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), HEALTH_TIMEOUT_MS);
    healthPromise = fetch('/api/voice/health', { cache: 'no-store', signal: controller.signal })
      .then(async (r) => {
        if (!r.ok) return { tts: false, stt: false };
        const data = (await r.json()) as Partial<VoiceHealth>;
        return { tts: !!data.tts, stt: !!data.stt };
      })
      .catch(() => ({ tts: false, stt: false }))
      .finally(() => window.clearTimeout(timer))
      .then((h) => {
        if (!h.tts && !h.stt) healthPromise = null;
        return h;
      });
  }
  return healthPromise.then((h) => ({
    tts: h.tts && Date.now() > ttsDisabledUntil,
    stt: h.stt && Date.now() > sttDisabledUntil,
  }));
}

// A tiny silent wav. Playing it during the click unlocks later ElevenLabs playback.
const SILENT_WAV =
  'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';

function ensureAudio(): HTMLAudioElement {
  if (!currentAudio) currentAudio = new Audio();
  return currentAudio;
}

/** Call synchronously from a click or pointerdown so the browser allows later playback. */
export function primeVoicePlayback(): void {
  if (typeof window === 'undefined') return;
  const audio = ensureAudio();
  audio.muted = true;
  audio.src = SILENT_WAV;
  audio
    .play()
    .then(() => {
      audio.pause();
      audio.muted = false;
    })
    .catch(() => {
      audio.muted = false;
    });
}

// -------------------------------------------------------------
// Speaking (ElevenLabs first, browser speechSynthesis fallback)
// -------------------------------------------------------------

export interface SpeakOptions {
  onStart?: (engine: 'elevenlabs' | 'browser') => void;
  onEnd?: () => void;
}

let speakGeneration = 0;
let currentAudio: HTMLAudioElement | null = null;
let currentAudioUrl: string | null = null;
let currentAbort: AbortController | null = null;
let pendingOnEnd: (() => void) | null = null;

function finishSpeaking(gen: number) {
  if (gen !== speakGeneration) return;
  if (currentAudioUrl) URL.revokeObjectURL(currentAudioUrl);
  currentAudioUrl = null;
  currentAbort = null;
  const cb = pendingOnEnd;
  pendingOnEnd = null;
  cb?.();
}

export function stopSpeaking(): void {
  speakGeneration++;
  currentAbort?.abort();
  if (currentAudio) {
    currentAudio.onended = null;
    currentAudio.onerror = null;
    currentAudio.pause();
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  if (currentAudioUrl) URL.revokeObjectURL(currentAudioUrl);
  currentAudioUrl = null;
  currentAbort = null;
  const cb = pendingOnEnd;
  pendingOnEnd = null;
  cb?.();
}

export async function speak(text: string, lang?: CopilotLanguage, opts: SpeakOptions = {}): Promise<void> {
  stopSpeaking();
  const language = lang || detectLanguage(text);
  const spoken = cleanTextForSpeech(text, language);
  if (!spoken) {
    opts.onEnd?.();
    return;
  }

  const gen = ++speakGeneration;
  pendingOnEnd = opts.onEnd || null;

  const health = await getVoiceHealth();
  if (gen !== speakGeneration) return;

  if (health.tts) {
    const ok = await speakWithElevenLabs(clipForTts(spoken), language, gen, opts);
    if (ok || gen !== speakGeneration) return;
  }
  await speakWithBrowser(spoken, language, gen, opts);
}

async function speakWithElevenLabs(
  text: string,
  language: CopilotLanguage,
  gen: number,
  opts: SpeakOptions
): Promise<boolean> {
  const abort = new AbortController();
  currentAbort = abort;
  try {
    const resp = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, language }),
      signal: abort.signal,
    });
    if (!resp.ok) throw new Error(`TTS HTTP ${resp.status}`);
    const blob = await resp.blob();
    if (gen !== speakGeneration) return true;
    if (blob.size < 500) throw new Error('Empty TTS audio');

    const url = URL.createObjectURL(blob);
    const audio = ensureAudio();
    currentAudioUrl = url;
    audio.muted = false;
    audio.src = url;

    await new Promise<void>((resolve, reject) => {
      audio.onended = () => resolve();
      audio.onerror = () => reject(new Error('Audio playback error'));
      audio
        .play()
        .then(() => opts.onStart?.('elevenlabs'))
        .catch(reject);
    });
    finishSpeaking(gen);
    return true;
  } catch (e) {
    if (gen !== speakGeneration || (e instanceof DOMException && e.name === 'AbortError')) return true;
    console.warn('ElevenLabs TTS playback failed, using browser voice:', e);
    if (currentAudioUrl) URL.revokeObjectURL(currentAudioUrl);
    currentAudioUrl = null;
    return false;
  }
}

function loadBrowserVoices(timeoutMs = 1500): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const synth = window.speechSynthesis;
    const existing = synth.getVoices();
    if (existing.length) return resolve(existing);
    const timer = window.setTimeout(() => {
      synth.removeEventListener('voiceschanged', onChange);
      resolve(synth.getVoices());
    }, timeoutMs);
    function onChange() {
      window.clearTimeout(timer);
      synth.removeEventListener('voiceschanged', onChange);
      resolve(synth.getVoices());
    }
    synth.addEventListener('voiceschanged', onChange);
  });
}

const FEMALE_VOICE = /swara|neerja|heera|kalpana|zira|susan|female/;

function pickBrowserVoice(voices: SpeechSynthesisVoice[], language: CopilotLanguage): SpeechSynthesisVoice | undefined {
  const norm = (v: SpeechSynthesisVoice) => v.lang.replace('_', '-').toLowerCase();
  const score = (v: SpeechSynthesisVoice): number => {
    const l = norm(v);
    const n = v.name.toLowerCase();
    const female = FEMALE_VOICE.test(n);
    let s = 0;
    if (language === 'en') {
      if (l === 'en-in') s += 80;
      else if (l.startsWith('en')) s += 15;
      if (/\bprabhat\b/.test(n)) s += 140;
      else if (/\bravi\b/.test(n)) s += 120;
      else if (/\b(hemant|madhur)\b/.test(n)) s += 40;
      if (female) s -= 100;
    } else {
      if (l === 'hi-in' || l.startsWith('hi')) s += 80;
      else if (l === 'en-in') s += 30;
      if (/\bmadhur\b/.test(n)) s += 150;
      else if (/\bhemant\b/.test(n)) s += 110;
      else if (/\bprabhat\b/.test(n)) s += 50;
      else if (/\bravi\b/.test(n)) s += 45;
      if (female) s -= 100;
    }
    if (/natural|online|neural/.test(n)) s += 12;
    return s;
  };
  const ranked = voices.map((v) => ({ v, s: score(v) })).sort((a, b) => b.s - a.s);
  return ranked.find((x) => x.s >= 40)?.v || ranked[0]?.v;
}

function splitIntoChunks(text: string): string[] {
  const parts = text.match(/[^.!?।]+[.!?।]*/g) || [text];
  const chunks: string[] = [];
  let buf = '';
  for (const p of parts) {
    if ((buf + p).length > 180 && buf) {
      chunks.push(buf.trim());
      buf = p;
    } else {
      buf += p;
    }
  }
  if (buf.trim()) chunks.push(buf.trim());
  return chunks;
}

async function speakWithBrowser(text: string, language: CopilotLanguage, gen: number, opts: SpeakOptions) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    finishSpeaking(gen);
    return;
  }
  const synth = window.speechSynthesis;
  const voices = await loadBrowserVoices();
  if (gen !== speakGeneration) return;
  const voice = pickBrowserVoice(voices, language);
  const fallbackLang = language === 'en' ? 'en-IN' : 'hi-IN';
  const chunks = splitIntoChunks(text);

  synth.cancel();
  chunks.forEach((chunk, idx) => {
    const u = new SpeechSynthesisUtterance(chunk);
    if (voice) u.voice = voice;
    u.lang = voice?.lang || fallbackLang;
    u.rate = 0.95;
    u.pitch = 1;
    if (idx === 0) u.onstart = () => gen === speakGeneration && opts.onStart?.('browser');
    if (idx === chunks.length - 1) {
      u.onend = () => finishSpeaking(gen);
      u.onerror = () => finishSpeaking(gen);
    }
    synth.speak(u);
  });
}

// -------------------------------------------------------------
// Listening (ElevenLabs Scribe via MediaRecorder, Web Speech fallback)
// -------------------------------------------------------------

export type ListenErrorCode = 'permission' | 'no-speech' | 'network' | 'unsupported' | 'unknown';
export type ListenPhase = 'listening' | 'processing' | 'idle';
export type RecognitionLocale = 'hi-IN' | 'en-IN';

export interface ListenOptions {
  /** Locale for the browser Web Speech fallback only; ElevenLabs auto-detects. */
  fallbackLocale?: RecognitionLocale;
  /** Bias ElevenLabs Scribe toward the language the merchant selected. */
  language?: 'hi' | 'en';
  onPhase?: (phase: ListenPhase) => void;
  onInterim?: (text: string) => void;
  onLevel?: (level: number) => void;
  onResult: (text: string, detectedLanguage?: CopilotLanguage) => void;
  onError: (code: ListenErrorCode, detail?: string) => void;
}

export interface ListenSession {
  engine: 'elevenlabs' | 'browser';
  /** Stop recording and transcribe what was captured. */
  stop: () => void;
  /** Abort without producing a result. */
  cancel: () => void;
}

const SILENCE_AFTER_SPEECH_MS = 1500;
const NO_SPEECH_TIMEOUT_MS = 8000;
const MAX_RECORDING_MS = 15000;
const SPEECH_RMS_THRESHOLD = 0.025;

interface SpeechRecognitionAlternativeLike {
  transcript: string;
  confidence: number;
}
interface SpeechRecognitionResultLike {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternativeLike;
}
interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: { length: number; [index: number]: SpeechRecognitionResultLike };
}
interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export function isBrowserRecognitionSupported(): boolean {
  return !!getSpeechRecognitionCtor();
}

function mapLanguageCode(code?: string | null): CopilotLanguage | undefined {
  if (!code) return undefined;
  const c = code.toLowerCase();
  if (c.startsWith('hi')) return 'hi';
  if (c.startsWith('en')) return 'en';
  return undefined;
}

export async function startListening(opts: ListenOptions): Promise<ListenSession | null> {
  const canRecord =
    typeof window !== 'undefined' && typeof MediaRecorder !== 'undefined' && !!navigator.mediaDevices?.getUserMedia;
  // Start the mic prompt in this turn, before awaiting health, so the click gesture is still valid.
  const micPromise = canRecord
    ? navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      })
    : Promise.reject(new Error('no-recorder'));

  const health = await getVoiceHealth();
  if (health.stt && canRecord) {
    try {
      const stream = await micPromise;
      return startElevenLabsListening(opts, stream);
    } catch (e) {
      const name = e instanceof DOMException ? e.name : '';
      opts.onError(name === 'NotAllowedError' || name === 'SecurityError' ? 'permission' : 'unsupported');
      opts.onPhase?.('idle');
      return null;
    }
  }
  micPromise.then((stream) => stream.getTracks().forEach((t) => t.stop())).catch(() => undefined);
  return startBrowserListening(opts);
}

function pickRecorderMime(): string | undefined {
  const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4'];
  return candidates.find((m) => MediaRecorder.isTypeSupported?.(m));
}

async function startElevenLabsListening(opts: ListenOptions, stream: MediaStream): Promise<ListenSession | null> {
  const mimeType = pickRecorderMime();
  const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
  const chunks: Blob[] = [];
  let cancelled = false;
  let finished = false;
  let heardSpeech = false;
  const startedAt = Date.now();
  let lastVoiceAt = 0;

  const AudioCtx =
    window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const audioCtx = new AudioCtx();
  const source = audioCtx.createMediaStreamSource(stream);
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 1024;
  source.connect(analyser);
  const samples = new Float32Array(analyser.fftSize);

  const monitor = window.setInterval(() => {
    analyser.getFloatTimeDomainData(samples);
    let sum = 0;
    for (let i = 0; i < samples.length; i++) sum += samples[i] * samples[i];
    const rms = Math.sqrt(sum / samples.length);
    opts.onLevel?.(Math.min(1, rms / 0.15));
    const now = Date.now();
    if (rms > SPEECH_RMS_THRESHOLD) {
      heardSpeech = true;
      lastVoiceAt = now;
    }
    if (heardSpeech && now - lastVoiceAt > SILENCE_AFTER_SPEECH_MS) stop();
    else if (!heardSpeech && now - startedAt > NO_SPEECH_TIMEOUT_MS) stop();
    else if (now - startedAt > MAX_RECORDING_MS) stop();
  }, 100);

  const cleanup = () => {
    window.clearInterval(monitor);
    stream.getTracks().forEach((t) => t.stop());
    source.disconnect();
    audioCtx.close().catch(() => undefined);
  };

  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  recorder.onstop = async () => {
    cleanup();
    if (cancelled) {
      opts.onPhase?.('idle');
      return;
    }
    if (!heardSpeech || chunks.length === 0) {
      opts.onPhase?.('idle');
      opts.onError('no-speech');
      return;
    }
    opts.onPhase?.('processing');
    const blob = new Blob(chunks, { type: recorder.mimeType || mimeType || 'audio/webm' });
    try {
      const resp = await fetch('/api/stt', {
        method: 'POST',
        headers: {
          'Content-Type': blob.type || 'audio/webm',
          'X-FinBuddy-Lang': opts.language === 'en' ? 'en' : 'hi',
        },
        body: blob,
      });
      if (!resp.ok) {
        const err = (await resp.json().catch(() => ({}))) as { error?: string };
        if (resp.status >= 500) sttDisabledUntil = Date.now() + BACKOFF_MS;
        opts.onPhase?.('idle');
        opts.onError('network', err.error);
        return;
      }
      const data = (await resp.json()) as { text?: string; languageCode?: string };
      const text = (data.text || '').replace(/\s+/g, ' ').trim();
      opts.onPhase?.('idle');
      if (!text) {
        opts.onError('no-speech');
        return;
      }
      opts.onResult(text, DEVANAGARI.test(text) ? 'hi' : detectLanguage(text) === 'hinglish' ? 'hinglish' : mapLanguageCode(data.languageCode));
    } catch (e) {
      opts.onPhase?.('idle');
      opts.onError('network', e instanceof Error ? e.message : undefined);
    }
  };

  function stop() {
    if (finished) return;
    finished = true;
    if (recorder.state !== 'inactive') recorder.stop();
  }

  recorder.start(250);
  opts.onPhase?.('listening');

  return {
    engine: 'elevenlabs',
    stop,
    cancel: () => {
      cancelled = true;
      stop();
    },
  };
}

function startBrowserListening(opts: ListenOptions): ListenSession | null {
  const Ctor = getSpeechRecognitionCtor();
  if (!Ctor) {
    opts.onError('unsupported');
    opts.onPhase?.('idle');
    return null;
  }

  const rec = new Ctor();
  rec.lang = opts.fallbackLocale || 'hi-IN';
  rec.continuous = false;
  rec.interimResults = true;
  rec.maxAlternatives = 3;

  let finalText = '';
  let cancelled = false;
  let errored = false;

  rec.onresult = (e) => {
    let interim = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const result = e.results[i];
      let best = result[0];
      for (let a = 1; a < result.length; a++) {
        if ((result[a]?.confidence || 0) > (best?.confidence || 0)) best = result[a];
      }
      if (result.isFinal) finalText += `${best.transcript} `;
      else interim += best.transcript;
    }
    opts.onInterim?.((finalText + interim).trim());
  };

  rec.onerror = (e) => {
    if (cancelled) return;
    errored = true;
    const code: ListenErrorCode =
      e.error === 'not-allowed' || e.error === 'service-not-allowed'
        ? 'permission'
        : e.error === 'no-speech'
          ? 'no-speech'
          : e.error === 'network'
            ? 'network'
            : e.error === 'aborted'
              ? 'no-speech'
              : 'unknown';
    opts.onError(code, e.error);
  };

  rec.onend = () => {
    opts.onPhase?.('idle');
    if (cancelled || errored) return;
    const text = finalText.trim();
    if (text) opts.onResult(text, detectLanguage(text));
    else opts.onError('no-speech');
  };

  try {
    rec.start();
  } catch {
    opts.onError('unknown');
    opts.onPhase?.('idle');
    return null;
  }
  opts.onPhase?.('listening');

  return {
    engine: 'browser',
    stop: () => rec.stop(),
    cancel: () => {
      cancelled = true;
      rec.abort();
    },
  };
}
