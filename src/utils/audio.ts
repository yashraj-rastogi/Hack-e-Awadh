// Web Audio API sound synthesizer for instant zero-latency feedback without external files

class SoundFX {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Classic POS Barcode Scanner Beep (High crisp short pitch)
  playScanBeep() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1760, this.ctx.currentTime); // A6 note
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Success Payment Chime
  playSuccessChime() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        const startTime = this.ctx.currentTime + idx * 0.08;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.3);
      });
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Voice Model Selector: Google TTS - Hindi 2 (Men voice)
  getHindiMaleVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
    if (!voices || voices.length === 0) return null;

    // 1. Explicit Male Hindi voices (Neural2-B, Wavenet-B, Hemant, Madhur, Male)
    const explicitMaleHindi = voices.find(
      (v) =>
        (v.lang.toLowerCase().startsWith('hi') || v.lang.toLowerCase().includes('in')) &&
        (v.name.toLowerCase().includes('male') ||
          v.name.toLowerCase().includes('men') ||
          v.name.toLowerCase().includes('hemant') ||
          v.name.toLowerCase().includes('madhur') ||
          v.name.toLowerCase().includes('neural2-b') ||
          v.name.toLowerCase().includes('wavenet-b') ||
          v.name.toLowerCase().includes('hindi 2') ||
          v.name.toLowerCase().includes('hid-network'))
    );
    if (explicitMaleHindi) return explicitMaleHindi;

    // 2. Google TTS Hindi Voice ("Google हिन्दी" / "Google Hindi")
    const googleHindi = voices.find(
      (v) =>
        v.name.toLowerCase().includes('google') &&
        (v.name.toLowerCase().includes('hindi') ||
          v.name.includes('हिन्दी') ||
          v.lang.toLowerCase().startsWith('hi'))
    );
    if (googleHindi) return googleHindi;

    // 3. Fallback to any Hindi voice (will be modulated to deep male pitch)
    const anyHindi = voices.find(
      (v) => v.lang.toLowerCase().startsWith('hi') || v.lang.toLowerCase().includes('hi-in')
    );
    if (anyHindi) return anyHindi;

    // 4. Fallback to Indian English male voice
    const indianEnglishMale = voices.find(
      (v) =>
        v.lang.toLowerCase().includes('in') &&
        (v.name.toLowerCase().includes('male') ||
          v.name.toLowerCase().includes('ravi') ||
          v.name.toLowerCase().includes('prabhat'))
    );
    if (indianEnglishMale) return indianEnglishMale;

    return voices.find((v) => v.lang.toLowerCase().includes('in')) || voices[0] || null;
  }

  // Speech TTS Engine: Google TTS - Hindi 2 (Men Voice)
  speakText(text: string, onEnd?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    // Clean markdown, symbols, and emojis for natural human speech
    const cleanText = text
      .replace(/[*_#`~]/g, '')
      .replace(/•/g, '')
      .replace(/₹/g, 'रुपये ')
      .replace(/Why:/gi, 'कारण:')
      .replace(/Recommended Action:/gi, 'सुझाव:')
      .replace(/\n+/g, '। ');

    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Google TTS Hindi 2 (Men Voice) tuning:
    // Natural speaking rate and rich masculine timbre
    utterance.lang = 'hi-IN';
    utterance.rate = 0.94; // slightly grounded, calm pace

    const applyVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const voice = this.getHindiMaleVoice(voices);

      if (voice) {
        utterance.voice = voice;
        const isAlreadyMale =
          voice.name.toLowerCase().includes('male') ||
          voice.name.toLowerCase().includes('hemant') ||
          voice.name.toLowerCase().includes('madhur');

        // Pitch 0.82 lowers vocal frequency to a warm, resonant masculine voice
        utterance.pitch = isAlreadyMale ? 0.94 : 0.82;
      } else {
        utterance.pitch = 0.82; // Deepen default system voice
      }

      if (onEnd) {
        utterance.onend = () => onEnd();
        utterance.onerror = () => onEnd();
      }

      window.speechSynthesis.speak(utterance);
    };

    const currentVoices = window.speechSynthesis.getVoices();
    if (currentVoices.length > 0) {
      applyVoice();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        applyVoice();
      };
    }
  }

  stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const soundFX = new SoundFX();

