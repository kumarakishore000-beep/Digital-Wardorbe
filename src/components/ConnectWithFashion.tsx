'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, Mic, MicOff, Volume2, VolumeX, Send, Sparkles, 
  RotateCcw, Star, ThumbsUp, CheckCircle2, MessageSquare, 
  Radio, Shirt, User, Briefcase, Heart, Gem, Scissors, 
  Layers, Trophy, ArrowRight, MessageCircle
} from 'lucide-react';
import MannequinVisualizer, { OutfitConfig } from '@/components/MannequinVisualizer';
import { useAuth, Gender } from '@/hooks/useAuth';
import { useRewards } from '@/hooks/useRewards';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  voiceText?: string;
  timestamp: string;
  suggestedQuestions?: string[];
}

interface FeedbackEntry {
  rating: number;
  likedFeatures: string[];
  futureSuggestions: string;
  date: string;
}

export default function ConnectWithFashion() {
  const { user, updateGender } = useAuth();
  const rewards = useRewards();
  const currentGender = (user?.gender || 'female') as Gender;

  // Active outfit state for the 3D working model
  const [currentOutfit, setCurrentOutfit] = useState<OutfitConfig>({
    title: 'The Boardroom Authority',
    topType: 'blazer',
    topColor: '#1E293B',
    bottomType: 'trousers',
    bottomColor: '#FAF8F5',
    outerwearColor: '#0A192F',
    accentColor: '#D4AF37',
    fabricType: 'wool',
    occasion: 'Job Interview & Executive Assessment',
  });

  // Mode: AI Talking & Chat vs Customer Satisfaction Feedback
  const [activeSubTab, setActiveSubTab] = useState<'talk' | 'feedback'>('talk');

  // AI Chat & Voice States
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-msg',
      role: 'assistant',
      content: `Welcome to **Connect with Fashion**! I am your personal AI styling companion.\n\nTalk with me naturally using **🎙️ Voice Mode** or type your questions below. Watch the **3D Working Model** adjust to your personal style for job interviews, weddings, accessories, and fabric fits!`,
      voiceText: "Welcome to Connect with Fashion. Speak to me or type your questions, and watch the 3D model adapt in real time.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedQuestions: [
        "What should I wear to an executive job interview?",
        "Style an outfit for an evening wedding reception",
        "How do I coordinate shoes, watch, and jewelry?"
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState('');

  // Customer Feedback & Satisfaction States
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    '3D Catwalk Walk Model',
    'AI Spoken Voice & Talking'
  ]);
  const [futureSuggestions, setFutureSuggestions] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [pastFeedback, setPastFeedback] = useState<FeedbackEntry | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<unknown>(null);

  // Initialize speech APIs and feedback from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check saved feedback
      const saved = localStorage.getItem('aurastyle_customer_feedback');
      if (saved) {
        try {
          setPastFeedback(JSON.parse(saved));
        } catch (e) {
          console.warn(e);
        }
      }

      // Check Speech Recognition
      const SpeechRecognition = 
        (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition || 
        (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;

      if (SpeechRecognition) {
        setSpeechSupported(true);
        try {
          // @ts-expect-error browser SpeechRecognition
          const recognition = new SpeechRecognition();
          recognition.continuous = false;
          recognition.interimResults = true;
          recognition.lang = 'en-US';

          // @ts-expect-error onresult event
          recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
              // @ts-expect-error result list
              .map((res) => res[0].transcript)
              .join('');
            setSpeechTranscript(transcript);
            setInputMessage(transcript);
          };

          (recognition as { onend?: () => void }).onend = () => {
            setIsListening(false);
          };

          recognitionRef.current = recognition;
        } catch (e) {
          console.warn('Speech init error:', e);
        }
      }
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, speechTranscript]);

  // Text-to-speech speaker
  const speakVoice = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const clean = text.replace(/[*_#`~•]/g, '').replace(/\n+/g, '. ').trim();
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => (v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Google')) && v.lang.startsWith('en'));
    if (voice) utterance.voice = voice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleMic = () => {
    stopSpeaking();
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. You can type in the chat box.');
      return;
    }

    if (isListening) {
      try {
        // @ts-expect-error stop method
        recognitionRef.current.stop();
      } catch (e) {
        console.warn(e);
      }
      setIsListening(false);
    } else {
      setSpeechTranscript('');
      try {
        // @ts-expect-error start method
        recognitionRef.current.start();
        setIsListening(true);
        setIsVoiceActive(true);
      } catch (e) {
        console.warn(e);
        setIsListening(false);
      }
    }
  };

  const handleSendMessage = async (text?: string) => {
    const message = (text || inputMessage).trim();
    if (!message || isLoading) return;

    if (isListening) {
      try {
        // @ts-expect-error stop method
        recognitionRef.current?.stop();
      } catch (e) {
        console.warn(e);
      }
      setIsListening(false);
    }

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setSpeechTranscript('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          gender: currentGender,
          isVoice: isVoiceActive,
          history: messages.slice(-5).map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await res.json();
      const assistantMsg: Message = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        voiceText: data.voiceText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedQuestions: data.suggestedQuestions
      };

      setMessages(prev => [...prev, assistantMsg]);
      speakVoice(data.voiceText || data.reply);

      // Adapt 3D model occasion dynamically based on user prompt
      const lower = message.toLowerCase();
      if (lower.includes('interview') || lower.includes('job') || lower.includes('corporate')) {
        setCurrentOutfit(prev => ({ ...prev, occasion: 'Job Interview & Executive Assessment' }));
      } else if (lower.includes('wedding') || lower.includes('reception') || lower.includes('gala')) {
        setCurrentOutfit(prev => ({ ...prev, occasion: 'Luxury Wedding & Gala Reception' }));
      }
    } catch (e) {
      console.warn(e);
      const fallbackMsg: Message = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: `I recommend pairing a structured Navy wool blazer with fluid Ivory trousers. Keep metal accents consistent across your watch, ring, and chain.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Feedback Submission
  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: FeedbackEntry = {
      rating,
      likedFeatures: selectedFeatures,
      futureSuggestions,
      date: new Date().toLocaleDateString()
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('aurastyle_customer_feedback', JSON.stringify(entry));
    }
    setPastFeedback(entry);
    setFeedbackSubmitted(true);
    rewards.earnPoints('complete_analysis');
  };

  const toggleFeatureCheckbox = (feat: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feat) ? prev.filter(f => f !== feat) : [...prev, feat]
    );
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      {/* Top Banner: Connect with Fashion */}
      <div className="bg-gradient-to-r from-[#050d1a] via-[#0a192f] to-[#050d1a] border border-[#FAF8F5]/15 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl backdrop-blur-xl">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1e3a8a]/40 border border-[#38BDF8]/30 text-xs font-mono font-bold text-[#38BDF8] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            ✦ Connect with Fashion AI Studio ✦
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-black tracking-tight text-[#FAF8F5]">
            Talk with AI & 3D Interactive Model
          </h2>
          <p className="text-xs sm:text-sm text-[#FAF8F5]/75 max-w-xl">
            Communicate directly with your AI Stylist through live spoken voice or interactive chat while viewing the working 3D Catwalk Mannequin with real fabrics and garment fit.
          </p>
        </div>

        {/* Sub-tab switcher: Talk with AI vs Customer Satisfaction */}
        <div className="bg-[#050d1a] p-1.5 rounded-2xl border border-[#FAF8F5]/15 flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveSubTab('talk')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'talk'
                ? 'bg-gradient-to-r from-[#1e3a8a] to-[#38BDF8] text-white shadow-md'
                : 'text-[#FAF8F5]/70 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5 animate-pulse text-amber-300" />
            <span>AI Talking & 3D Model</span>
          </button>

          <button
            onClick={() => setActiveSubTab('feedback')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'feedback'
                ? 'bg-[#FAF8F5] text-[#0a192f] shadow-md'
                : 'text-[#FAF8F5]/70 hover:text-white'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Customer Satisfaction</span>
          </button>
        </div>
      </div>

      {/* ===== TAB 1: AI TALKING + 3D WORKING MODEL ===== */}
      {activeSubTab === 'talk' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: 3D Working Model (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <h3 className="font-serif font-bold text-lg text-white">3D Working Mannequin</h3>
              </div>
              <span className="text-[11px] font-mono text-[#38BDF8]">
                {currentOutfit.occasion || 'Active Runway Mode'}
              </span>
            </div>

            <MannequinVisualizer
              gender={currentGender}
              onGenderChange={updateGender}
              outfit={currentOutfit}
              onGarmentChange={(newOutfit) => setCurrentOutfit(newOutfit)}
              showControls={true}
              className="h-[750px] shadow-2xl"
            />
          </div>

          {/* Right: Personal Connect & AI Talking Dialogue (6 cols) */}
          <div className="lg:col-span-6 bg-[#050d1a]/95 border border-[#FAF8F5]/15 rounded-3xl p-6 shadow-2xl backdrop-blur-xl flex flex-col h-[750px] justify-between">
            {/* AI Talking Header */}
            <div className="border-b border-[#FAF8F5]/10 pb-4 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#1e3a8a] to-[#38BDF8] flex items-center justify-center text-white shadow-md">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-white flex items-center gap-2">
                    AuraStylist Voice & Chat
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Live Voice
                    </span>
                  </h4>
                  <p className="text-[11px] text-[#FAF8F5]/60">
                    Direct personal connect &bull; Ask anything about fit, fabrics, jewelry & suiting
                  </p>
                </div>
              </div>

              {/* Voice playback controls */}
              <div className="flex items-center gap-2">
                {isSpeaking && (
                  <button
                    onClick={stopSpeaking}
                    className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] font-bold flex items-center gap-1 animate-pulse"
                  >
                    <VolumeX className="w-3 h-3" />
                    <span>Stop Voice</span>
                  </button>
                )}
                <button
                  onClick={() => setIsVoiceActive(!isVoiceActive)}
                  className={`p-2 rounded-full border text-xs transition-all ${
                    isVoiceActive 
                      ? 'bg-[#38BDF8]/20 border-[#38BDF8] text-[#38BDF8]' 
                      : 'border-[#FAF8F5]/10 text-[#FAF8F5]/40 hover:text-white'
                  }`}
                  title={isVoiceActive ? "Voice response enabled" : "Voice muted"}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Spoken Mic Status Banner */}
            {isListening && (
              <div className="bg-rose-950/60 border border-rose-500/40 rounded-2xl p-3 my-2 flex items-center gap-3 animate-pulse">
                <Mic className="w-5 h-5 text-rose-400 animate-bounce" />
                <div className="text-xs">
                  <p className="font-bold text-rose-200">Listening to your voice...</p>
                  <p className="text-rose-300/80">{speechTranscript || "Speak your styling query now..."}</p>
                </div>
              </div>
            )}

            {/* Conversation Log */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 scrollbar-thin scrollbar-thumb-[#1e3a8a]/50 scrollbar-track-transparent pr-1">
              {messages.map((m) => {
                const isUser = m.role === 'user';
                return (
                  <div key={m.id} className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs shadow-md ${
                      isUser ? 'bg-[#FAF8F5] text-[#0a192f]' : 'bg-gradient-to-tr from-[#1e3a8a] to-[#38BDF8] text-white'
                    }`}>
                      {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                    </div>

                    <div className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                      isUser
                        ? 'bg-[#1e3a8a] text-white rounded-tr-none'
                        : 'bg-[#0a192f] text-[#FAF8F5] border border-[#FAF8F5]/15 rounded-tl-none'
                    }`}>
                      {!isUser && (
                        <div className="flex items-center justify-between border-b border-[#FAF8F5]/10 pb-1.5 mb-2">
                          <span className="font-serif font-bold text-[#38BDF8]">AuraStylist</span>
                          <button
                            onClick={() => speakVoice(m.voiceText || m.content)}
                            className="text-[#FAF8F5]/50 hover:text-white"
                            title="Hear voice response"
                          >
                            <Volume2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      <p className="whitespace-pre-line">{m.content}</p>

                      {/* Suggested quick answers */}
                      {!isUser && m.suggestedQuestions && m.suggestedQuestions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3 pt-2 border-t border-[#FAF8F5]/10">
                          {m.suggestedQuestions.map((q, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSendMessage(q)}
                              className="text-[10px] bg-[#1e3a8a]/30 hover:bg-[#1e3a8a]/60 text-[#FAF8F5]/80 hover:text-white px-2 py-0.5 rounded-full border border-[#FAF8F5]/10 transition-all text-left flex items-center gap-1"
                            >
                              <ArrowRight className="w-2.5 h-2.5 text-[#38BDF8]" />
                              <span>{q}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex gap-2 items-center text-xs text-[#FAF8F5]/60">
                  <Bot className="w-4 h-4 animate-spin text-[#38BDF8]" />
                  <span>AuraStylist is analyzing harmony and suiting rules...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Inspiration Chips */}
            <div className="py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-hide border-t border-[#FAF8F5]/10">
              <button
                onClick={() => handleSendMessage("What should I wear for an executive job interview?")}
                className="px-2.5 py-1 rounded-full bg-[#0a192f] border border-[#FAF8F5]/15 hover:border-[#38BDF8] text-[11px] text-[#FAF8F5]/80 hover:text-white whitespace-nowrap"
              >
                💼 Job Interview Suiting
              </button>
              <button
                onClick={() => handleSendMessage("Style an outfit for a luxury wedding reception with jewelry")}
                className="px-2.5 py-1 rounded-full bg-[#0a192f] border border-[#FAF8F5]/15 hover:border-[#38BDF8] text-[11px] text-[#FAF8F5]/80 hover:text-white whitespace-nowrap"
              >
                💍 Wedding & Jewelry
              </button>
              <button
                onClick={() => handleSendMessage("Explain Slim vs Regular fit and fabric GSM weight")}
                className="px-2.5 py-1 rounded-full bg-[#0a192f] border border-[#FAF8F5]/15 hover:border-[#38BDF8] text-[11px] text-[#FAF8F5]/80 hover:text-white whitespace-nowrap"
              >
                🧵 Fabric & Fit
              </button>
            </div>

            {/* Voice & Text Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2 pt-2 border-t border-[#FAF8F5]/15"
            >
              {/* Mic button */}
              <button
                type="button"
                onClick={toggleMic}
                className={`p-3 rounded-2xl transition-all border ${
                  isListening
                    ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                    : 'bg-[#0a192f] border-[#FAF8F5]/15 text-[#FAF8F5]/70 hover:text-[#38BDF8]'
                }`}
                title="Tap to speak to AI"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about interview dress, wedding looks, jewelry..."
                className="flex-1 bg-[#0a192f] border border-[#FAF8F5]/15 focus:border-[#38BDF8] rounded-2xl px-4 py-3 text-xs text-[#FAF8F5] placeholder-[#FAF8F5]/40 outline-none"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="p-3 rounded-2xl bg-[#FAF8F5] text-[#0a192f] font-bold hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ===== TAB 2: CUSTOMER SATISFACTION & FUTURE UPDATES FEEDBACK ===== */}
      {activeSubTab === 'feedback' && (
        <div className="max-w-3xl mx-auto bg-[#050d1a]/95 border border-[#FAF8F5]/15 rounded-3xl p-8 shadow-2xl backdrop-blur-xl space-y-8">
          <div className="border-b border-[#FAF8F5]/10 pb-4 text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              Customer Satisfaction & Future Roadmap
            </div>
            <h3 className="font-serif font-bold text-2xl md:text-3xl text-white">
              Shape the Future of AuraStyle
            </h3>
            <p className="text-xs md:text-sm text-[#FAF8F5]/70 max-w-lg mx-auto">
              Your opinion directly guides our next release! Tell us how well the 3D working model and AI talking served your styling needs.
            </p>
          </div>

          {!feedbackSubmitted ? (
            <form onSubmit={handleFeedbackSubmit} className="space-y-6">
              {/* Star Rating */}
              <div className="text-center space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#FAF8F5]/80">
                  Overall Satisfaction Rating
                </label>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          (hoverRating || rating) >= star
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-[#FAF8F5]/20'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-xs text-[#38BDF8] font-mono">
                  {rating === 5 && "⭐ Exceptional! Master atelier quality"}
                  {rating === 4 && "⭐ Great experience & style opinions"}
                  {rating === 3 && "⭐ Good, with room for improvement"}
                  {rating === 2 && "⭐ Needs refinement"}
                  {rating === 1 && "⭐ Did not meet expectations"}
                </p>
              </div>

              {/* What Features Did You Like? */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#FAF8F5]/80">
                  What did you like most? (Select all that apply)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    '3D Catwalk Walk Model',
                    'AI Spoken Voice & Talking',
                    'Garment Fit (Slim, Regular, Oversized)',
                    '5-Piece Accessories Suite',
                    'Job Interview Suiting Advice',
                    'Wedding & Reception Outfits',
                    'Real Human Model Studio Photos',
                    'Fabric GSM & Drape Science'
                  ].map((feat) => {
                    const isSelected = selectedFeatures.includes(feat);
                    return (
                      <button
                        type="button"
                        key={feat}
                        onClick={() => toggleFeatureCheckbox(feat)}
                        className={`px-3.5 py-2.5 rounded-xl border text-xs text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-[#1e3a8a]/50 border-[#38BDF8] text-white font-semibold'
                            : 'bg-[#0a192f] border-[#FAF8F5]/10 text-[#FAF8F5]/70 hover:border-[#FAF8F5]/30'
                        }`}
                      >
                        <span>{feat}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#38BDF8]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Future Updates Suggestion */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#FAF8F5]/80">
                  What features or updates should we add in the future?
                </label>
                <textarea
                  rows={4}
                  value={futureSuggestions}
                  onChange={(e) => setFutureSuggestions(e.target.value)}
                  placeholder="E.g., Add personalized virtual try-on with custom body measurements, more ethnic wedding fabrics like Benarasi silk, and AR camera mirror mode..."
                  className="w-full bg-[#0a192f] border border-[#FAF8F5]/15 focus:border-[#38BDF8] rounded-2xl p-4 text-xs text-[#FAF8F5] outline-none resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#FAF8F5] hover:bg-white text-[#0a192f] font-bold py-3.5 px-6 rounded-2xl transition-all duration-300 shadow-xl shadow-[#1e3a8a]/30 flex items-center justify-center gap-2 hover:scale-[1.01]"
              >
                <Trophy className="w-4 h-4 text-[#1e3a8a]" />
                <span>Submit Feedback & Earn +50 Reward Points</span>
              </button>
            </form>
          ) : (
            <div className="text-center py-8 space-y-6 animate-in fade-in duration-500">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h4 className="font-serif font-bold text-2xl text-white">
                  Thank You for Your Feedback!
                </h4>
                <p className="text-xs text-[#FAF8F5]/70 max-w-md mx-auto">
                  Your suggestions have been recorded to prioritize our upcoming features. You have been awarded <strong className="text-amber-300">+50 Atelier Reward Points</strong>!
                </p>
              </div>

              <div className="p-4 bg-[#0a192f] rounded-2xl border border-[#FAF8F5]/15 max-w-md mx-auto text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#FAF8F5]/60">Your Rating:</span>
                  <span className="text-amber-300 font-bold">{'★'.repeat(rating)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#FAF8F5]/60">Liked Features:</span>
                  <span className="text-white font-mono">{selectedFeatures.length} items selected</span>
                </div>
                {futureSuggestions && (
                  <div className="pt-2 border-t border-[#FAF8F5]/10">
                    <span className="text-[#FAF8F5]/60 block mb-1">Your Future Request:</span>
                    <p className="italic text-[#38BDF8]">&ldquo;{futureSuggestions}&rdquo;</p>
                  </div>
                )}
              </div>

              <div className="flex justify-center gap-3 pt-4">
                <button
                  onClick={() => setActiveSubTab('talk')}
                  className="px-6 py-2.5 rounded-full bg-[#FAF8F5] text-[#0a192f] font-bold text-xs hover:bg-white transition-all shadow-md"
                >
                  Return to 3D Model & AI Talking
                </button>
                <button
                  onClick={() => setFeedbackSubmitted(false)}
                  className="px-6 py-2.5 rounded-full bg-[#1e3a8a]/40 text-white text-xs hover:bg-[#1e3a8a] transition-all border border-[#FAF8F5]/20"
                >
                  Edit Feedback
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
