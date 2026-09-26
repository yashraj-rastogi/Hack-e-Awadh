import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Sparkles,
  Send,
  Volume2,
  VolumeX,
  Mic,
  Square,
  Loader2,
  PackagePlus,
  CheckCircle2,
  AlertTriangle,
  WifiOff,
  X,
} from 'lucide-react';
import { getProducts, updateProductStock } from '../services/db';
import {
  getVoiceHealth,
  speak,
  stopSpeaking,
  startListening,
  primeVoicePlayback,
} from '../services/voiceService';
import type { ListenErrorCode, ListenPhase, ListenSession, VoiceHealth } from '../services/voiceService';
import { askMerchantCopilot as askCopilot, translateMerchantCopy } from '../services/aiService';
import type { CopilotLanguage, CopilotMessage } from '../types';

type DashboardTab = 'overview' | 'inventory' | 'feedback';

interface MerchantVoiceAgentProps {
  storeId: string;
  onOpenTab: (tab: DashboardTab) => void;
  /** A question queued from elsewhere on the dashboard (e.g. an insight card). */
  queuedQuestion?: { id: number; text: string } | null;
  onQueuedQuestionHandled?: () => void;
  /** Floating panel visibility. The launcher stays on screen either way. */
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type UiLang = 'hi' | 'en';
const UI_LANG_KEY = 'finbuddy_ui_lang';

function readUiLang(): UiLang {
  try {
    return localStorage.getItem(UI_LANG_KEY) === 'en' ? 'en' : 'hi';
  } catch {
    return 'hi';
  }
}

function textMatchesLang(text: string, lang: UiLang): boolean {
  const devanagari = /[\u0900-\u097F]/.test(text);
  if (lang === 'hi') return devanagari || !/[A-Za-z]{3,}/.test(text);
  return !devanagari;
}

const COPY = {
  hi: {
    eyebrow: 'आपका दुकान साथी',
    status: {
      idle: { title: 'तैयार हूँ', hint: 'माइक दबाकर बोलिए — हिंदी या अंग्रेज़ी' },
      listening: { title: 'सुन रहा हूँ', hint: 'बोलिए, मैं सुन रहा हूँ' },
      thinking: { title: 'सोच रहा हूँ', hint: 'दुकान का डेटा देख रहा हूँ' },
      speaking: { title: 'बोल रहा हूँ', hint: 'जवाब सुनिए, या रोकें दबाएँ' },
    },
    chipsLabel: 'पूछकर देखिए',
    prompts: [
      'आज बिक्री कैसी रही?',
      'कौन सा माल कम है?',
      'इस हफ्ते सबसे ज़्यादा क्या बिका?',
      'स्नैक और ड्रिंक का कॉम्बो बताओ',
      'ग्राहक क्या कह रहे हैं?',
      'क्या मुझे 10 लाख का बिज़नेस लोन लेना चाहिए?',
    ],
    welcome:
      'नमस्ते! मैं आपका FinBuddy हूँ। माइक दबाकर बोलिए या लिखिए।\n\nपूछिए: आज की बिक्री, कौन सा माल कम है, सबसे ज़्यादा क्या बिका, कॉम्बो ऑफ़र या ग्राहक फ़ीडबैक।',
    welcomeSpeech: 'नमस्ते! मैं आपका FinBuddy हूँ। आप हिंदी में बोलकर या लिखकर पूछ सकते हैं।',
    placeholder: 'पूछिए… जैसे आज कितनी बिक्री हुई?',
    mic: 'माइक दबाएँ',
    stopMic: 'रुकें',
    listening: 'सुन रहा हूँ… बोलिए',
    understanding: 'समझ रहा हूँ…',
    thinking: 'दुकान का डेटा देख रहा हूँ…',
    voiceOn: 'आवाज़ चालू',
    voiceOff: 'आवाज़ बंद',
    speaking: 'बोल रहा हूँ',
    listen: 'सुनिए',
    stop: 'रोकें',
    cancel: 'रद्द',
    close: 'बंद करें',
    open: 'FinBuddy खोलें',
    send: 'भेजें',
    confirm: 'हाँ, स्टॉक बढ़ाओ',
    notNow: 'अभी नहीं',
    skipped: 'छोड़ दिया · कोई बदलाव नहीं',
    stockUpdated: 'स्टॉक अपडेट हो गया',
    suggestion: 'सुझाव',
    saveDraft: 'ड्राफ्ट सेव करें',
    draftSaved: 'ड्राफ्ट सेव हो गया',
    offlineAnswer: 'ऑफ़लाइन जवाब · दुकान का डेटा',
    aiAnswer: 'एआई जवाब · दुकान का डेटा',
    errors: {
      permission: 'माइक की अनुमति नहीं मिली। एड्रेस बार में लॉक आइकन दबाकर Microphone Allow कीजिए।',
      'no-speech': 'कुछ सुनाई नहीं दिया। माइक दबाकर दोबारा बोलिए।',
      network: 'आवाज़ सेवा तक नहीं पहुँच पाए। आप टाइप करके पूछ सकते हैं।',
      unsupported: 'इस ब्राउज़र में आवाज़ इनपुट नहीं चलता। Chrome या Edge इस्तेमाल कीजिए, या टाइप कीजिए।',
      unknown: 'कुछ गड़बड़ हो गई। दोबारा कोशिश कीजिए।',
      offline: 'इंटरनेट नहीं है। ऑफ़लाइन मोड में दुकान के डेटा से जवाब दे रहा हूँ।',
    } as Record<ListenErrorCode | 'offline', string>,
  },
  en: {
    eyebrow: 'Your shop companion',
    status: {
      idle: { title: 'Ready', hint: 'Tap the mic and speak — Hindi or English' },
      listening: { title: 'Listening', hint: 'Speak, I am listening' },
      thinking: { title: 'Thinking', hint: 'Checking your store data' },
      speaking: { title: 'Speaking', hint: 'Listen to the answer, or tap Stop' },
    },
    chipsLabel: 'Try asking',
    prompts: [
      'How were sales today?',
      'Which items are running low?',
      'What sold the most this week?',
      'Suggest a snack and drink combo',
      'What are customers saying?',
      'Should I take a 10 lakh business loan?',
    ],
    welcome:
      'Namaste! I am FinBuddy. Tap the mic and speak, or type.\n\nAsk about today\'s sales, what is low in stock, what sold most, a combo offer, or customer feedback.',
    welcomeSpeech: 'Namaste! I am FinBuddy. You can speak or type in English.',
    placeholder: 'Ask… e.g. How much did we sell today?',
    mic: 'Tap mic',
    stopMic: 'Stop',
    listening: 'Listening… please speak',
    understanding: 'Understanding…',
    thinking: 'Checking your store data…',
    voiceOn: 'Voice on',
    voiceOff: 'Voice off',
    speaking: 'Speaking',
    listen: 'Listen',
    stop: 'Stop',
    cancel: 'Cancel',
    close: 'Close',
    open: 'Open FinBuddy',
    send: 'Send',
    confirm: 'Confirm restock',
    notNow: 'Not now',
    skipped: 'Skipped · no change made',
    stockUpdated: 'Stock updated to',
    suggestion: 'Suggestion',
    saveDraft: 'Save as draft',
    draftSaved: 'Draft saved',
    offlineAnswer: 'Offline answer · store data',
    aiAnswer: 'AI answer · store data',
    errors: {
      permission: 'Microphone permission was denied. Tap the lock icon in the address bar and allow the microphone.',
      'no-speech': 'We did not catch that. Tap the mic and try again.',
      network: 'Voice service is unreachable. You can type your question instead.',
      unsupported: 'Voice input is not supported in this browser. Use Chrome or Edge, or type instead.',
      unknown: 'Something went wrong. Please try again.',
      offline: 'You are offline. Answers come from local store data.',
    } as Record<ListenErrorCode | 'offline', string>,
  },
} as const;

function welcomeMessage(lang: UiLang): CopilotMessage {
  const copy = COPY[lang];
  return {
    id: 'welcome',
    sender: 'assistant',
    text: copy.welcome,
    speech: copy.welcomeSpeech,
    language: lang,
    timestamp: Date.now(),
  };
}

const VOICE_PREF_KEY = 'finbuddy_voice_replies';

type ActionState = { status: 'done'; newStock: number } | { status: 'dismissed' };
type RobotMode = 'idle' | 'listening' | 'thinking' | 'speaking';

function ShopkeeperRobot({ mode, size = 'panel' }: { mode: RobotMode; size?: 'panel' | 'fab' }) {
  const listening = mode === 'listening';
  const thinking = mode === 'thinking';
  const speaking = mode === 'speaking';
  const box = size === 'fab' ? 'w-16 h-16' : 'w-14 h-14';
  const svg = size === 'fab' ? 'w-11 h-11' : 'w-10 h-10';
  return (
    <div className={`relative shrink-0 ${box}`} aria-hidden>
      {(listening || speaking) && (
        <>
          <span className="absolute inset-0 rounded-full border-2 border-[#00BAF2] robot-ring" />
          <span className="absolute inset-0 rounded-full border-2 border-[#002E6E]/40 robot-ring [animation-delay:500ms]" />
        </>
      )}
      {thinking && <span className="absolute -inset-1 rounded-full border-2 border-dashed border-[#00BAF2] robot-orbit" />}
      <div
        className={`absolute inset-0.5 rounded-full bg-gradient-to-b from-[#00BAF2] to-[#002E6E] shadow-[0_8px_24px_rgba(0,186,242,0.35)] flex items-center justify-center ${
          mode === 'idle' ? 'robot-float' : ''
        }`}
      >
        <svg viewBox="0 0 80 80" className={svg}>
          <line x1="40" y1="13" x2="40" y2="7" stroke="#E8F7FF" strokeWidth="2" strokeLinecap="round" />
          <circle cx="40" cy="5.5" r="3" fill={speaking ? '#7CFFB2' : '#E8F7FF'} />
          <rect x="10" y="30" width="7" height="12" rx="3" fill="#D7F3FC" />
          <rect x="63" y="30" width="7" height="12" rx="3" fill="#D7F3FC" />
          <rect x="18" y="16" width="44" height="44" rx="16" fill="#F7FCFF" />
          <g className={listening ? '' : 'robot-blink'}>
            <ellipse cx="32" cy="34" rx="5.5" ry="6.5" fill="#002E6E" />
            <ellipse cx="48" cy="34" rx="5.5" ry="6.5" fill="#002E6E" />
            <circle cx={thinking ? 34.2 : 33} cy="32.5" r="1.8" fill="white" />
            <circle cx={thinking ? 50.2 : 49} cy="32.5" r="1.8" fill="white" />
          </g>
          {speaking ? (
            <ellipse cx="40" cy="49" rx="7" ry="4.5" fill="#00BAF2" className="robot-talk" />
          ) : (
            <path d="M31 47.5 Q40 54 49 47.5" fill="none" stroke="#00BAF2" strokeWidth="2.4" strokeLinecap="round" />
          )}
        </svg>
      </div>
    </div>
  );
}

function confirmationText(lang: CopilotLanguage, name: string, qty: number, newStock: number) {
  if (lang === 'hi') return `हो गया! ${name} में ${qty} पीस जोड़ दिए। अब स्टॉक ${newStock} है।`;
  if (lang === 'hinglish') return `Ho gaya! ${name} mein ${qty} piece add kar diye. Ab stock ${newStock} hai.`;
  return `Done! Added ${qty} units of ${name}. Stock is now ${newStock}.`;
}

function buildConfirmationMessage(lang: CopilotLanguage, name: string, qty: number, newStock: number): CopilotMessage {
  return {
    id: `copilot_${Date.now()}`,
    sender: 'assistant',
    text: confirmationText(lang, name, qty, newStock),
    language: lang,
    timestamp: Date.now(),
    source: 'local',
  };
}

export const MerchantVoiceAgent: React.FC<MerchantVoiceAgentProps> = ({
  storeId,
  onOpenTab,
  queuedQuestion,
  onQueuedQuestionHandled,
  open,
  onOpenChange,
}) => {
  const [uiLang, setUiLang] = useState<UiLang>(readUiLang);
  const [messages, setMessages] = useState<CopilotMessage[]>(() => [welcomeMessage(readUiLang())]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [voiceReplies, setVoiceReplies] = useState<boolean>(() => localStorage.getItem(VOICE_PREF_KEY) !== 'off');
  const [phase, setPhase] = useState<ListenPhase>('idle');
  const [interim, setInterim] = useState('');
  const [level, setLevel] = useState(0);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [audioLive, setAudioLive] = useState(false);
  const [error, setError] = useState<{ code: ListenErrorCode | 'offline'; detail?: string } | null>(null);
  const [health, setHealth] = useState<VoiceHealth | null>(null);
  const uiLangRef = useRef(uiLang);
  const [actionStates, setActionStates] = useState<Record<string, ActionState>>({});
  const [draftedRecs, setDraftedRecs] = useState<Record<string, boolean>>({});

  const messagesRef = useRef<CopilotMessage[]>(messages);
  const translateGen = useRef(0);
  const sessionRef = useRef<ListenSession | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const voiceRepliesRef = useRef(voiceReplies);

  useEffect(() => {
    messagesRef.current = messages;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    voiceRepliesRef.current = voiceReplies;
    localStorage.setItem(VOICE_PREF_KEY, voiceReplies ? 'on' : 'off');
    if (!voiceReplies) stopSpeaking();
  }, [voiceReplies]);

  useEffect(() => {
    uiLangRef.current = uiLang;
    try {
      localStorage.setItem(UI_LANG_KEY, uiLang);
    } catch {
      // ignore private-mode storage failures
    }
    window.dispatchEvent(new CustomEvent('finbuddy-lang', { detail: uiLang }));
    const gen = ++translateGen.current;
    setMessages((prev) => prev.map((m) => (m.id === 'welcome' ? welcomeMessage(uiLang) : m)));
    const pending = messagesRef.current.filter((m) => m.id !== 'welcome' && !textMatchesLang(m.text, uiLang));
    if (!pending.length) return;
    let cancelled = false;
    translateMerchantCopy(
      pending.map((m) => ({ id: m.id, text: m.text, speech: m.speech })),
      uiLang
    ).then((translated) => {
      if (cancelled || gen !== translateGen.current) return;
      setMessages((prev) =>
        prev.map((m) => {
          const line = translated[m.id];
          if (!line) return m;
          return { ...m, text: line.text, speech: line.speech, language: uiLang };
        })
      );
    });
    return () => {
      cancelled = true;
    };
  }, [uiLang]);

  useEffect(() => {
    let alive = true;
    getVoiceHealth().then((h) => alive && setHealth(h));
    return () => {
      alive = false;
      sessionRef.current?.cancel();
      stopSpeaking();
    };
  }, []);

  const speakMessage = useCallback((msg: CopilotMessage) => {
    primeVoicePlayback();
    setSpeakingId(msg.id);
    setAudioLive(false);
    const spokenLang: CopilotLanguage = uiLangRef.current === 'en' ? 'en' : 'hi';
    speak(msg.speech || msg.text, spokenLang, {
      onStart: () => setAudioLive(true),
      onEnd: () => {
        setAudioLive(false);
        setSpeakingId((cur) => (cur === msg.id ? null : cur));
      },
    });
  }, []);

  const handleStopSpeaking = () => {
    stopSpeaking();
    setSpeakingId(null);
    setAudioLive(false);
  };

  const closePanel = () => {
    sessionRef.current?.cancel();
    onOpenChange(false);
  };

  const askQuestion = useCallback(
    async (raw: string) => {
      const q = raw.trim();
      if (!q) return;
      primeVoicePlayback();
      stopSpeaking();
      const replyLang: CopilotLanguage = uiLangRef.current === 'en' ? 'en' : 'hi';
      setError(typeof navigator !== 'undefined' && !navigator.onLine ? { code: 'offline' } : null);
      const userMsg: CopilotMessage = {
        id: `usr_${Date.now()}`,
        sender: 'user',
        text: q,
        language: replyLang,
        timestamp: Date.now(),
      };
      const history = messagesRef.current;
      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setInterim('');
      setLoading(true);

      try {
        const reply = await askCopilot(q, storeId, [...history, userMsg], replyLang);
        setMessages((prev) => [...prev, reply]);
        if (reply.action?.type === 'open_tab') {
          const tab = reply.action.tab;
          window.setTimeout(() => onOpenTab(tab), 1200);
        }
        if (voiceRepliesRef.current) speakMessage(reply);
      } catch (e) {
        console.warn('Copilot error:', e);
        setError({ code: 'unknown' });
      } finally {
        setLoading(false);
      }
    },
    [storeId, onOpenTab, speakMessage]
  );

  const handledQueueId = useRef<number | null>(null);
  useEffect(() => {
    if (!queuedQuestion || handledQueueId.current === queuedQuestion.id) return;
    handledQueueId.current = queuedQuestion.id;
    askQuestion(queuedQuestion.text);
    onQueuedQuestionHandled?.();
  }, [queuedQuestion, askQuestion, onQueuedQuestionHandled]);

  const toggleMic = async () => {
    if (phase === 'listening') {
      sessionRef.current?.stop();
      return;
    }
    if (phase === 'processing' || loading) return;
    primeVoicePlayback();
    handleStopSpeaking();
    setError(null);
    setInterim('');
    setPhase('listening');
    const replyLang = uiLangRef.current;
    const session = await startListening({
      language: replyLang,
      fallbackLocale: replyLang === 'en' ? 'en-IN' : 'hi-IN',
      onPhase: (p) => {
        setPhase(p);
        if (p === 'idle') {
          setLevel(0);
          sessionRef.current = null;
        }
      },
      onInterim: setInterim,
      onLevel: setLevel,
      onResult: (text) => {
        setInterim(text);
        askQuestion(text);
      },
      onError: (code, detail) => {
        setInterim('');
        setError({ code, detail });
      },
    });
    sessionRef.current = session;
    if (!session) setPhase('idle');
  };

  const confirmRestock = (msg: CopilotMessage) => {
    if (msg.action?.type !== 'restock') return;
    const { productName, quantity } = msg.action;
    const product = getProducts(storeId).find((p) => p.name === productName);
    if (!product) return;
    const newStock = product.stock + quantity;
    updateProductStock(storeId, product.id, newStock);
    setActionStates((s) => ({ ...s, [msg.id]: { status: 'done', newStock } }));
    const confirm = buildConfirmationMessage(uiLangRef.current, productName, quantity, newStock);
    setMessages((prev) => [...prev, confirm]);
    if (voiceRepliesRef.current) speakMessage(confirm);
  };

  const isListening = phase === 'listening';
  const isProcessing = phase === 'processing';
  const copy = COPY[uiLang];
  const voiceEngineLabel =
    health === null ? (uiLang === 'hi' ? 'आवाज़ जाँच रहे हैं…' : 'Checking voice…') : health.tts ? (uiLang === 'hi' ? 'पुरुष आवाज़ · ElevenLabs' : 'Male voice · ElevenLabs') : (uiLang === 'hi' ? 'फ़ोन की आवाज़' : 'Phone voice');
  const robotMode: RobotMode = isListening
    ? 'listening'
    : loading || isProcessing || (!!speakingId && !audioLive)
      ? 'thinking'
      : speakingId
        ? 'speaking'
        : 'idle';
  const status = copy.status[robotMode];

  return (
    <>
    {open && (
    <div
      id="finbuddy-panel"
      role="dialog"
      aria-label="FinBuddy"
      onPointerDown={primeVoicePlayback}
      className="paytm-card fixed z-[60] right-4 bottom-[7.75rem] flex flex-col overflow-hidden w-[min(380px,calc(100vw-2rem))] h-[min(560px,70vh)] p-3 sm:p-4 bg-white shadow-[0_8px_24px_rgba(0,46,110,0.16)]"
    >
      {/* Companion */}
      <div className="border-b border-[#E0E6ED] pb-3 mb-2 shrink-0 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <ShopkeeperRobot mode={robotMode} />
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#00BAF2]">{copy.eyebrow}</p>
            <h3 className="text-base font-black text-[#002E6E] leading-tight">FinBuddy</h3>
            <p className="text-xs font-bold text-[#002E6E] truncate" role="status" title={status.hint}>
              {status.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          {speakingId && (
            <button
              onClick={handleStopSpeaking}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-[#00BAF2] border border-sky-100 text-xs font-semibold hover:bg-sky-100 transition"
              title="Stop speaking"
            >
              <span className="flex items-center gap-0.5 h-4">
                <span className="w-0.5 bg-[#00BAF2] eq-bar-1" />
                <span className="w-0.5 bg-[#00BAF2] eq-bar-2" />
                <span className="w-0.5 bg-[#002E6E] eq-bar-3" />
                <span className="w-0.5 bg-[#00BAF2] eq-bar-4" />
              </span>
              <span>{copy.speaking}</span>
              <Square className="w-3 h-3 fill-current" />
            </button>
          )}

          <button
            onClick={() => setVoiceReplies((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition ${
              voiceReplies
                ? 'bg-[#002E6E] text-white border-[#002E6E]'
                : 'bg-white text-[#6B7A90] border-[#E0E6ED] hover:text-[#002E6E]'
            }`}
            title={voiceEngineLabel}
            aria-pressed={voiceReplies}
          >
            {voiceReplies ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{voiceReplies ? copy.voiceOn : copy.voiceOff}</span>
          </button>

          <div className="flex items-center rounded-full border border-[#E0E6ED] overflow-hidden text-[11px] font-semibold" title={uiLang === 'hi' ? 'भाषा' : 'Language'}>
            {(['hi', 'en'] as UiLang[]).map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setUiLang(loc)}
                className={`px-2.5 py-1 transition ${
                  uiLang === loc ? 'bg-[#00BAF2] text-white' : 'bg-white text-[#6B7A90] hover:text-[#002E6E]'
                }`}
                aria-pressed={uiLang === loc}
              >
                {loc === 'hi' ? 'हिंदी' : 'English'}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={closePanel}
            className="w-8 h-8 rounded-full border border-[#E0E6ED] bg-white text-[#6B7A90] hover:text-[#002E6E] hover:bg-[#F5F7FA] flex items-center justify-center transition"
            aria-label={copy.close}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Suggested chips */}
      <div className="mb-2 shrink-0">
        <span className="text-[10px] font-bold text-[#6B7A90] block mb-1.5 uppercase tracking-wider">
          {copy.chipsLabel}
        </span>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {copy.prompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => askQuestion(prompt)}
              disabled={loading || isListening || isProcessing}
              className="shrink-0 px-3 py-1.5 rounded-full bg-[#F5F7FA] hover:bg-[#EBF3FB] text-[#002E6E] hover:text-[#00BAF2] text-xs font-semibold border border-[#E0E6ED] transition disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat stream */}
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1 mb-2">
        {messages.map((msg) => {
          const isAssistant = msg.sender === 'assistant';
          const actionState = actionStates[msg.id];
          const restock = msg.action?.type === 'restock' ? msg.action : null;
          return (
            <div key={msg.id} className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}>
              <div
                className={`max-w-[92%] rounded-2xl p-3 text-sm leading-relaxed shadow-sm ${
                  isAssistant
                    ? 'bg-[#F9FBFE] border border-[#E0E6ED] text-[#1C2D42] rounded-tl-sm'
                    : 'bg-[#00BAF2] text-white font-semibold rounded-tr-sm'
                }`}
                lang={msg.language === 'hi' ? 'hi' : msg.language === 'en' ? 'en-IN' : undefined}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {msg.metrics && (
                  <div className="mt-3 pt-3 border-t border-[#E0E6ED] grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    {Object.entries(msg.metrics).map(([k, v]) => (
                      <div key={k} className="bg-white p-2 rounded-lg border border-[#E0E6ED]">
                        <span className="text-[10px] text-[#6B7A90] block truncate" title={k}>{k}</span>
                        <span className="font-extrabold text-[#002E6E]">{v}</span>
                      </div>
                    ))}
                  </div>
                )}

                {msg.recommendation && !restock && (
                  <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#FFA800] block">
                        {copy.suggestion}
                      </span>
                      <h5 className="font-bold text-[#002E6E] text-xs">{msg.recommendation.title}</h5>
                      {msg.recommendation.details && (
                        <p className="text-[11px] text-[#4A5568] mt-0.5">{msg.recommendation.details}</p>
                      )}
                    </div>
                    <button
                      onClick={() => setDraftedRecs((d) => ({ ...d, [msg.id]: true }))}
                      disabled={draftedRecs[msg.id]}
                      className="px-3 py-1.5 rounded-md bg-[#FFA800] hover:bg-amber-500 disabled:bg-emerald-500 text-white text-xs font-bold shrink-0 transition"
                    >
                      {draftedRecs[msg.id] ? copy.draftSaved : copy.saveDraft}
                    </button>
                  </div>
                )}

                {restock && (
                  <div className="mt-3 p-3 rounded-lg bg-sky-50 border border-sky-200">
                    <div className="flex items-center gap-2 text-xs text-[#002E6E] font-semibold">
                      <PackagePlus className="w-4 h-4 text-[#00BAF2]" />
                      <span>
                        Restock proposal: +{restock.quantity} × {restock.productName}
                      </span>
                    </div>
                    {!actionState && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button
                          onClick={() => confirmRestock(msg)}
                          className="px-3 py-1.5 rounded-md bg-[#00BAF2] hover:bg-[#00a4d6] text-white text-xs font-bold transition"
                        >
                          {copy.confirm}
                        </button>
                        <button
                          onClick={() => setActionStates((s) => ({ ...s, [msg.id]: { status: 'dismissed' } }))}
                          className="px-3 py-1.5 rounded-md bg-white border border-[#E0E6ED] text-[#6B7A90] hover:text-[#002E6E] text-xs font-semibold transition"
                        >
                          {copy.notNow}
                        </button>
                      </div>
                    )}
                    {actionState?.status === 'done' && (
                      <p className="mt-2 text-xs text-[#21C17A] font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {copy.stockUpdated} {actionState.newStock}
                      </p>
                    )}
                    {actionState?.status === 'dismissed' && (
                      <p className="mt-2 text-xs text-[#6B7A90]">{copy.skipped}</p>
                    )}
                  </div>
                )}

                {isAssistant && (
                  <div className="mt-2.5 flex items-center justify-between gap-3">
                    <span className="text-[10px] text-[#6B7A90]">
                      {msg.source === 'local' ? copy.offlineAnswer : msg.source === 'gemini' ? copy.aiAnswer : ''}
                    </span>
                    {speakingId === msg.id ? (
                      <button
                        onClick={handleStopSpeaking}
                        className="text-[11px] text-[#00BAF2] flex items-center gap-1 font-semibold"
                      >
                        <Square className="w-3 h-3 fill-current" />
                        <span>{copy.stop}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => speakMessage(msg)}
                        className="text-[11px] text-[#6B7A90] hover:text-[#00BAF2] flex items-center gap-1 font-semibold transition"
                        title="Speak answer out loud"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{copy.listen}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-[#00BAF2] font-semibold">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>{copy.thinking}</span>
          </div>
        )}
      </div>

      {/* Error banner */}
      {error && (
        <div
          className={`mb-2 p-2.5 rounded-lg text-xs font-medium flex items-start gap-2 border ${
            error.code === 'offline' || error.code === 'network'
              ? 'bg-amber-50 border-amber-200 text-[#8A5A00]'
              : 'bg-rose-50 border-rose-100 text-[#C23B41]'
          }`}
          role="alert"
        >
          {error.code === 'offline' || error.code === 'network' ? (
            <WifiOff className="w-4 h-4 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0" />
          )}
          <span className="flex-1">{copy.errors[error.code]}</span>
          <button onClick={() => setError(null)} className="opacity-60 hover:opacity-100" aria-label="Dismiss">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Live transcript */}
      {(isListening || isProcessing) && (
        <div className="mb-2 px-3 py-2 rounded-lg bg-[#EBF3FB] border border-sky-100 flex items-center gap-3">
          {isListening ? (
            <span className="flex items-end gap-0.5 h-5" aria-hidden>
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className={`w-1 rounded-full bg-[#00BAF2] eq-bar-${i}`}
                  style={{ opacity: 0.5 + Math.min(0.5, level) }}
                />
              ))}
            </span>
          ) : (
            <Loader2 className="w-4 h-4 text-[#00BAF2] animate-spin" />
          )}
          <span className="text-xs text-[#002E6E] font-medium truncate">
            {isListening ? interim || copy.listening : copy.understanding}
          </span>
          {isListening && (
            <button
              onClick={() => sessionRef.current?.cancel()}
              className="ml-auto text-[11px] text-[#6B7A90] hover:text-[#FD5C63] font-semibold"
            >
              {copy.cancel}
            </button>
          )}
        </div>
      )}

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          askQuestion(input);
        }}
        className="flex items-center gap-2 pt-3 border-t border-[#E0E6ED] shrink-0"
      >
        <div className="flex flex-col items-center shrink-0">
        <button
          type="button"
          onClick={toggleMic}
          disabled={loading || isProcessing}
          className={`relative w-12 h-12 shrink-0 rounded-full flex items-center justify-center text-white shadow-md transition disabled:opacity-50 ${
            isListening ? 'bg-[#FD5C63] hover:bg-rose-500' : 'bg-[#002E6E] hover:bg-[#00408f]'
          }`}
          title={isListening ? copy.stopMic : copy.mic}
          aria-label={isListening ? copy.stopMic : copy.mic}
        >
          {isListening && <span className="absolute inset-0 rounded-full bg-[#FD5C63] opacity-40 animate-ping" />}
          {isProcessing ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : isListening ? (
            <Square className="w-4 h-4 fill-current relative" />
          ) : (
            <Mic className="w-6 h-6" />
          )}
        </button>
        <span className="mt-1 text-[10px] font-bold text-[#002E6E]">{isListening ? copy.stopMic : copy.mic}</span>
        </div>
        <input
          type="text"
          placeholder={copy.placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 min-w-0 px-4 py-3 bg-white border border-[#E0E6ED] rounded-full text-sm text-[#1C2D42] placeholder-[#6B7A90] focus:outline-none focus:border-[#00BAF2]"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="h-12 w-12 shrink-0 rounded-full bg-[#00BAF2] hover:bg-[#00a4d6] disabled:opacity-50 text-white flex items-center justify-center shadow-sm transition"
          aria-label={copy.send}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
    )}

    <div className="fixed z-[70] right-4 bottom-4 flex flex-col items-center gap-1">
      <button
        type="button"
        onPointerDown={primeVoicePlayback}
        onClick={() => (open ? closePanel() : onOpenChange(true))}
        className="relative rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00BAF2] focus-visible:ring-offset-2"
        aria-expanded={open}
        aria-controls="finbuddy-panel"
        aria-label={open ? copy.close : `${copy.open}. ${status.title}`}
        title={status.title}
      >
        <ShopkeeperRobot mode={robotMode} size="fab" />
      </button>
      <span className="px-2 py-0.5 rounded-full bg-white border border-[#E0E6ED] text-[10px] font-black tracking-wide text-[#002E6E] shadow-[0_2px_8px_rgba(0,46,110,0.12)]">
        FinBuddy
      </span>
    </div>
    </>
  );
};
