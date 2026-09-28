import React, { useEffect, useState, useRef } from 'react';
import { Mic, MicOff, X, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Volume2 } from 'lucide-react';
import { parseVoiceCommand } from '../services/aiService';
import { VoiceIntentResult } from '../types';
import { soundFX } from '../utils/audio';
import { speak, stopSpeaking, primeVoicePlayback, getVoiceHealth, VoiceHealth } from '../services/voiceService';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteIntent: (intent: VoiceIntentResult) => void;
  storeId?: string;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  onExecuteIntent,
  storeId = 'store-awadh-01',
}) => {
  const [speechLang, setSpeechLang] = useState<'hi-IN' | 'en-IN'>('hi-IN');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceHealth, setVoiceHealth] = useState<VoiceHealth | null>(null);
  const [statusMessage, setStatusMessage] = useState(
    'सुन रहे हैं... हिंदी में बोलें (उदा: "२ पेप्सी जोड़ो")'
  );
  const [lastResult, setLastResult] = useState<VoiceIntentResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);

  const samplePromptsHindi = [
    '२ और पेप्सी जोड़ो',
    'एक मैगी हटाओ',
    'टोटल कितना हुआ?',
    'पेमेंट करो',
  ];

  const samplePromptsEnglish = [
    'Add 2 Pepsi',
    'Ek Maggi hata do',
    'Total kitna hua?',
    'Payment generate karo',
  ];

  const activePrompts = speechLang === 'hi-IN' ? samplePromptsHindi : samplePromptsEnglish;

  useEffect(() => {
    getVoiceHealth().then((h) => setVoiceHealth(h));
  }, []);

  useEffect(() => {
    if (!isOpen) {
      stopListening();
      stopSpeaking();
      soundFX.stopSpeaking();
      setTranscript('');
      setLastResult(null);
      return;
    }

    primeVoicePlayback();
    startListening(speechLang);

    return () => {
      stopListening();
      stopSpeaking();
      soundFX.stopSpeaking();
    };
  }, [isOpen, speechLang]);

  const startListening = (lang: string = speechLang) => {
    stopListening();

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatusMessage('Speech recognition not supported in this browser. Try manual chip buttons.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = lang;
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setStatusMessage(
          lang === 'hi-IN'
            ? 'सुन रहे हैं... हिंदी में बोलें (उदा: "२ पेप्सी जोड़ो")'
            : 'Listening... Speak in English or Hinglish (e.g. "Add 2 Pepsi")'
        );
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);

        if (event.results[0].isFinal) {
          handleProcessUtterance(currentTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech error:', event.error);
        setIsListening(false);
        if (event.error === 'no-speech') {
          setStatusMessage(
            lang === 'hi-IN'
              ? 'आवाज़ नहीं सुनाई दी। माइक दबाकर दोबारा बोलें।'
              : 'No speech detected. Tap mic to retry.'
          );
        } else {
          setStatusMessage(
            lang === 'hi-IN'
              ? 'स्पष्ट नहीं सुना जा सका। कृपया दोबारा बोलें।'
              : 'Could not hear clearly. Try again or tap a suggestion.'
          );
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.warn('Failed to start speech recognition:', e);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const handleProcessUtterance = async (text: string) => {
    if (!text.trim()) return;
    setIsProcessing(true);
    setStatusMessage(
      speechLang === 'hi-IN' ? 'कमांड को समझा जा रहा है...' : 'Understanding command with AI...'
    );

    try {
      const result = await parseVoiceCommand(text, storeId);
      setLastResult(result);
      setIsProcessing(false);

      if (result.intent !== 'unknown') {
        soundFX.playScanBeep();
        primeVoicePlayback();
        speak(result.reply, speechLang === 'hi-IN' ? 'hi' : 'en');
        onExecuteIntent(result);
        setStatusMessage(result.reply);

        // Auto close after 2.8 seconds on success so voice finishes
        setTimeout(() => {
          onClose();
        }, 2800);
      } else {
        primeVoicePlayback();
        speak(result.reply, speechLang === 'hi-IN' ? 'hi' : 'en');
        setStatusMessage(result.reply);
      }
    } catch (e) {
      setIsProcessing(false);
      setStatusMessage('Sorry, something went wrong. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#002E6E]/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white border border-[#E0E6ED] rounded-2xl shadow-[0_8px_30px_rgba(0,46,110,0.18)] p-6 relative flex flex-col items-center text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F5F7FA] hover:bg-[#EBF3FB] text-[#6B7A90] hover:text-[#002E6E] flex items-center justify-center transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* AI Voice Badge with ElevenLabs Indicator */}
        <div className="flex flex-col items-center gap-1 mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-[#002E6E] border border-sky-100 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#00BAF2]" />
            <span>FinBuddy Voice Assistant</span>
          </div>
          <span className="text-[10px] font-bold text-[#00BAF2] flex items-center gap-1">
            <Volume2 className="w-3 h-3" />
            <span>Voice Engine: {voiceHealth?.tts ? 'ElevenLabs Multilingual V2' : 'Neural Speech'} (Hindi & English)</span>
          </span>
        </div>

        {/* Language Selector Switch (Hindi vs Hinglish) */}
        <div className="flex items-center bg-[#F5F7FA] p-1 rounded-lg border border-[#E0E6ED] mb-3 text-xs">
          <button
            onClick={() => setSpeechLang('hi-IN')}
            className={`px-3 py-1 rounded-md font-semibold transition ${
              speechLang === 'hi-IN'
                ? 'bg-[#002E6E] text-white shadow-xs'
                : 'text-[#6B7A90] hover:text-[#002E6E]'
            }`}
          >
            हिंदी (Devanagari)
          </button>
          <button
            onClick={() => setSpeechLang('en-IN')}
            className={`px-3 py-1 rounded-md font-semibold transition ${
              speechLang === 'en-IN'
                ? 'bg-[#002E6E] text-white shadow-xs'
                : 'text-[#6B7A90] hover:text-[#002E6E]'
            }`}
          >
            English / Hinglish
          </button>
        </div>

        {/* Circular Paytm Blue Microphone Button (Section 15: #00BAF2) */}
        <div className="relative my-4 flex items-center justify-center">
          {isListening && (
            <>
              <div className="absolute w-24 h-24 rounded-full bg-[#00BAF2]/20 animate-ping opacity-75" />
              <div className="absolute w-32 h-32 rounded-full bg-[#00BAF2]/10 animate-pulse" />
            </>
          )}

          <button
            onClick={isListening ? stopListening : () => startListening(speechLang)}
            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition transform active:scale-95 ${
              isListening
                ? 'bg-[#FD5C63] text-white shadow-rose-200'
                : 'bg-[#00BAF2] hover:bg-[#00a4d6] text-white shadow-[0_4px_16px_rgba(0,186,242,0.35)]'
            }`}
          >
            {isListening ? <Mic className="w-8 h-8" /> : <MicOff className="w-8 h-8 opacity-90" />}
          </button>
        </div>

        {/* Paytm Equalizer Waveform Animation (Section 30 & 47) */}
        {isListening && (
          <div className="flex items-center gap-1 h-6 my-2">
            <div className="w-1 bg-[#00BAF2] rounded-full eq-bar-1" />
            <div className="w-1 bg-[#00BAF2] rounded-full eq-bar-2" />
            <div className="w-1 bg-[#002E6E] rounded-full eq-bar-3" />
            <div className="w-1 bg-[#00BAF2] rounded-full eq-bar-4" />
            <div className="w-1 bg-[#00BAF2] rounded-full eq-bar-5" />
          </div>
        )}

        {/* Live Transcript / Feedback */}
        <div className="min-h-[60px] flex flex-col items-center justify-center my-2">
          {transcript ? (
            <p className="text-[#002E6E] font-bold text-base italic px-4">"{transcript}"</p>
          ) : (
            <p className="text-[#6B7A90] text-xs">{statusMessage}</p>
          )}

          {lastResult && (
            <div
              className={`mt-2 flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-lg ${
                lastResult.intent !== 'unknown'
                  ? 'bg-emerald-50 text-[#21C17A] border border-emerald-100'
                  : 'bg-amber-50 text-amber-700 border border-amber-100'
              }`}
            >
              {lastResult.intent !== 'unknown' ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#21C17A]" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              )}
              <span>{lastResult.reply}</span>
            </div>
          )}
        </div>

        {/* Suggested Voice Commands (Section 16) */}
        <div className="w-full mt-4 pt-4 border-t border-[#E0E6ED]">
          <p className="text-[11px] font-bold text-[#6B7A90] mb-2 uppercase tracking-wider text-left">
            {speechLang === 'hi-IN'
              ? 'सुझाए गए कमांड (क्लिक करके आज़माएं):'
              : 'Suggested commands (tap to try):'}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {activePrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => {
                  setTranscript(prompt);
                  handleProcessUtterance(prompt);
                }}
                disabled={isProcessing}
                className="px-2.5 py-2 rounded-lg bg-[#F5F7FA] hover:bg-[#EBF3FB] text-[#002E6E] hover:text-[#00BAF2] text-xs font-semibold border border-[#E0E6ED] flex items-center justify-between transition text-left"
              >
                <span className="truncate">{prompt}</span>
                <ArrowRight className="w-3 h-3 text-[#00BAF2] shrink-0 ml-1" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
