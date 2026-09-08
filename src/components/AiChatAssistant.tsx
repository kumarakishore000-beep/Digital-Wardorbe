'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, Send, Mic, MicOff, Volume2, VolumeX, Sparkles, 
  RotateCcw, ArrowRight, CheckCircle2, User, 
  Briefcase, Heart, Gem, Scissors, Palette, Radio
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  voiceText?: string;
  timestamp: string;
  tags?: string[];
  suggestedQuestions?: string[];
}

const QUICK_PROMPTS = [
  {
    icon: <Briefcase className="w-3.5 h-3.5 text-blue-400" />,
    label: "Job Interview Suiting",
    query: "What should I wear for a prestigious corporate job interview? Include suit fit, shoe style, and accessories."
  },
  {
    icon: <Heart className="w-3.5 h-3.5 text-rose-400" />,
    label: "Wedding & Gala Attire",
    query: "Style an elegant outfit for a luxury evening wedding reception with color palette and 5-piece accessories."
  },
  {
    icon: <Gem className="w-3.5 h-3.5 text-amber-400" />,
    label: "5-Piece Accessories",
    query: "How should I coordinate my shoe, watch, ring, chain, and bracelet for a cohesive look?"
  },
  {
    icon: <Scissors className="w-3.5 h-3.5 text-emerald-400" />,
    label: "Fabric & Fit Guide",
    query: "Explain the difference between Slim, Regular, and Oversized fits, and what fabric GSM weight is best."
  },
  {
    icon: <Palette className="w-3.5 h-3.5 text-purple-400" />,
    label: "Harmonic Colors",
    query: "Suggest high-fashion color combinations that balance neutral elegance with an accent tone."
  }
];

export default function AiChatAssistant() {
  const { user } = useAuth();
  const currentGender = user?.gender || 'female';

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `Hello! I am **AuraStylist**, your bespoke AI fashion designer and editorial personal stylist.\n\nHow may I elevate your wardrobe today? You can **type in chat** or switch to **🎙️ Talk to AI** to speak naturally about upcoming job interviews, weddings, 5-piece accessories, or fabric tailoring.`,
      voiceText: "Hello! I am AuraStylist, your personal AI fashion designer. Ask me anything about job interview suiting, wedding attire, or jewelry styling.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tags: ["AuraStyle AI", "Job Interview", "Wedding", "Jewelry"],
      suggestedQuestions: [
        "What should I wear for a top-tier executive interview?",
        "Style an outfit for an evening wedding reception",
        "How do I match my watch, ring, chain, and shoes?"
      ]
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<'chat' | 'voice'>('chat');
  
  // Voice synthesis & recognition states
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [voiceSynthesisEnabled, setVoiceSynthesisEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState('');
  const [speechError, setSpeechError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<unknown>(null);

  // Check speech recognition & synthesis support on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = 
        (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition || 
        (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;

      if (SpeechRecognition) {
        setSpeechSupported(true);
        try {
          // @ts-expect-error browser speech API constructor
          const recognition = new SpeechRecognition();
          recognition.continuous = false;
          recognition.interimResults = true;
          recognition.lang = 'en-US';

          // @ts-expect-error recognition event
          recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
              // @ts-expect-error recognition event result
              .map((res) => res[0].transcript)
              .join('');
            setSpeechTranscript(transcript);
            setInputMessage(transcript);
          };

          // @ts-expect-error recognition error
          recognition.onerror = (event) => {
            console.warn('Speech recognition error:', event.error);
            if (event.error === 'not-allowed') {
              setSpeechError('Microphone permission denied. Please allow microphone access in your browser.');
            } else {
              setSpeechError(`Voice input error: ${event.error}`);
            }
            setIsListening(false);
          };

          recognition.onend = () => {
            setIsListening(false);
          };

          recognitionRef.current = recognition;
        } catch (e) {
          console.warn('Speech recognition initialization error:', e);
        }
      }
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Auto scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, speechTranscript]);

  // Text to Speech playback function
  const speakText = (text: string) => {
    if (!voiceSynthesisEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    // Clean markdown symbols for smooth reading
    const cleanText = text
      .replace(/[*_#`~]/g, '')
      .replace(/•/g, '')
      .replace(/\n+/g, '. ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    // Pick luxury/natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Victoria')) && 
      v.lang.startsWith('en')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

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

  // Toggle microphone recording
  const toggleListening = () => {
    setSpeechError(null);
    if (isSpeaking) {
      stopSpeaking();
    }

    if (!recognitionRef.current) {
      setSpeechError('Speech recognition is not supported in this browser. You can type in the chat box.');
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
      } catch (e) {
        console.warn('Recognition start failed:', e);
        setIsListening(false);
      }
    }
  };

  // Send message handler
  const handleSendMessage = async (textToSend?: string) => {
    const message = (textToSend || inputMessage).trim();
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
      id: `user-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setSpeechTranscript('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          gender: currentGender,
          isVoice: activeMode === 'voice',
          history: messages.slice(-5).map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get styling advice');
      }

      const data = await response.json();

      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        voiceText: data.voiceText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tags: data.stylingTags,
        suggestedQuestions: data.suggestedQuestions
      };

      setMessages(prev => [...prev, assistantMsg]);

      // If in Voice Mode or Voice Synthesis is enabled, speak response out loud!
      if (activeMode === 'voice' || voiceSynthesisEnabled) {
        speakText(data.voiceText || data.reply);
      }

    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: "I'm having a brief connection pause, but here is my immediate advice: For high-stakes events like interviews and weddings, balance one primary neutral color (e.g. Navy or Charcoal) with one subtle metal accent (Gold or Silver), ensuring leather footwear matches your belt and watch band.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    stopSpeaking();
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `Chat cleared! What shall we style next? I am ready to advise you on interview suiting, wedding ensembles, 5-piece accessories, or color palettes.`,
        voiceText: "Chat cleared. What shall we style next?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedQuestions: [
          "What should I wear to an interview?",
          "How to dress for a summer wedding?",
          "How do I match jewelry with my shoes?"
        ]
      }
    ]);
  };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl bg-[#050d1a]/95 border border-[#FAF8F5]/15 shadow-2xl overflow-hidden backdrop-blur-xl flex flex-col h-[780px]">
      {/* Top Bar / Header */}
      <div className="px-6 py-4 bg-[#0a192f] border-b border-[#FAF8F5]/15 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#1e3a8a] to-[#38BDF8] flex items-center justify-center shadow-md border border-white/20">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-lg text-[#FAF8F5]">AuraStylist AI</h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Stylist
              </span>
            </div>
            <p className="text-xs text-[#FAF8F5]/60 font-sans">
              Personal Designer &bull; {currentGender === 'female' ? "Women's Haute & Executive" : "Men's Sartorial & Tailoring"}
            </p>
          </div>
        </div>

        {/* Mode Selector & Controls */}
        <div className="flex items-center gap-2">
          {/* Mode Pill */}
          <div className="bg-[#050d1a] p-1 rounded-full border border-[#FAF8F5]/15 flex items-center">
            <button
              onClick={() => {
                setActiveMode('chat');
                stopSpeaking();
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeMode === 'chat'
                  ? 'bg-[#FAF8F5] text-[#0a192f] shadow-sm'
                  : 'text-[#FAF8F5]/70 hover:text-white'
              }`}
            >
              <span>💬</span>
              <span>Chat with AI</span>
            </button>

            <button
              onClick={() => setActiveMode('voice')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeMode === 'voice'
                  ? 'bg-gradient-to-r from-[#1e3a8a] to-[#38BDF8] text-white shadow-md'
                  : 'text-[#FAF8F5]/70 hover:text-white'
              }`}
            >
              <Radio className="w-3 h-3 animate-pulse text-amber-300" />
              <span>Talk to AI (Voice)</span>
            </button>
          </div>

          {/* Voice Audio Speaker Toggle */}
          <button
            onClick={() => {
              if (isSpeaking) {
                stopSpeaking();
              }
              setVoiceSynthesisEnabled(!voiceSynthesisEnabled);
            }}
            className={`p-2 rounded-full border text-xs transition-all ${
              voiceSynthesisEnabled
                ? 'bg-[#1e3a8a]/40 border-[#38BDF8]/40 text-[#38BDF8]'
                : 'bg-transparent border-[#FAF8F5]/10 text-[#FAF8F5]/40 hover:text-white'
            }`}
            title={voiceSynthesisEnabled ? "Voice Speech Enabled (Click to Mute)" : "Voice Muted (Click to Unmute)"}
          >
            {voiceSynthesisEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Reset / Clear */}
          <button
            onClick={handleClearChat}
            className="p-2 rounded-full border border-[#FAF8F5]/10 text-[#FAF8F5]/60 hover:text-white hover:bg-white/5 transition-all"
            title="Clear Chat Conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Voice Mode Visualizer Banner (Shown when Talk to AI mode is active) */}
      <AnimatePresence>
        {activeMode === 'voice' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-r from-[#1e3a8a]/40 via-[#0a192f] to-[#1e3a8a]/40 border-b border-[#38BDF8]/30 px-6 py-4 flex items-center justify-between flex-wrap gap-4"
          >
            <div className="flex items-center gap-4">
              {/* Mic pulse button */}
              <button
                onClick={toggleListening}
                className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  isListening
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/50 scale-110 animate-pulse'
                    : 'bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-[#0a192f] shadow-md'
                }`}
                title={isListening ? "Listening... click to stop" : "Click to speak to AuraStylist"}
              >
                {isListening ? <Mic className="w-6 h-6 animate-bounce" /> : <Mic className="w-6 h-6" />}
              </button>

              <div>
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  {isListening ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                      Listening to your voice... Speak now
                    </>
                  ) : isSpeaking ? (
                    <>
                      <Volume2 className="w-4 h-4 text-emerald-400 animate-bounce" />
                      AuraStylist is speaking...
                    </>
                  ) : (
                    <>
                      <span>Tap the microphone to Talk to AI</span>
                    </>
                  )}
                </h4>
                <p className="text-xs text-[#FAF8F5]/70">
                  {isListening 
                    ? (speechTranscript || "Speak your question: interview attire, wedding look, accessories...") 
                    : "Hands-free fashion consultation with real-time spoken voice responses"}
                </p>
              </div>
            </div>

            {/* Speaking Stop Button */}
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="px-3 py-1.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-semibold hover:bg-rose-500/30 transition-all flex items-center gap-1.5"
              >
                <VolumeX className="w-3.5 h-3.5" />
                <span>Stop Voice</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Speech Error Banner */}
      {speechError && (
        <div className="bg-rose-950/60 border-b border-rose-500/30 px-6 py-2.5 text-xs text-rose-200 flex items-center justify-between">
          <span>{speechError}</span>
          <button 
            onClick={() => setSpeechError(null)} 
            className="text-white hover:underline text-[11px] font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-[#1e3a8a]/50 scrollbar-track-transparent">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex gap-3.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-md ${
                isUser 
                  ? 'bg-[#FAF8F5] text-[#0a192f] border border-white' 
                  : 'bg-gradient-to-tr from-[#1e3a8a] to-[#38BDF8] text-white border border-[#38BDF8]/40'
              }`}>
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble Content */}
              <div className={`max-w-2xl space-y-2.5 ${isUser ? 'items-end text-right' : 'items-start text-left'}`}>
                <div className={`rounded-3xl p-5 text-sm leading-relaxed shadow-lg ${
                  isUser
                    ? 'bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] text-white rounded-tr-none border border-blue-400/20'
                    : 'bg-[#0a192f]/90 text-[#FAF8F5] rounded-tl-none border border-[#FAF8F5]/15'
                }`}>
                  {/* Assistant Header inside bubble */}
                  {!isUser && (
                    <div className="flex items-center justify-between border-b border-[#FAF8F5]/10 pb-2.5 mb-3">
                      <span className="text-xs font-serif font-bold text-[#38BDF8] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        AuraStylist Couture AI
                      </span>
                      <div className="flex items-center gap-2">
                        {voiceSynthesisEnabled && (
                          <button
                            onClick={() => speakText(msg.voiceText || msg.content)}
                            className="text-[#FAF8F5]/50 hover:text-white p-1 transition-colors"
                            title="Listen to this response"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <span className="text-[10px] font-mono text-[#FAF8F5]/40">{msg.timestamp}</span>
                      </div>
                    </div>
                  )}

                  {/* Body Text */}
                  <div className="whitespace-pre-line text-xs sm:text-sm font-sans space-y-2">
                    {msg.content.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* Tags */}
                  {msg.tags && msg.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#FAF8F5]/10 mt-3">
                      {msg.tags.map((tag, idx) => (
                        <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1e3a8a]/40 text-[#93c5fd] border border-[#93c5fd]/20">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Suggested Follow-up Prompt Buttons */}
                {!isUser && msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.suggestedQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(q)}
                        className="text-[11px] bg-[#1e3a8a]/20 hover:bg-[#1e3a8a]/50 text-[#FAF8F5]/80 hover:text-white px-3 py-1 rounded-full border border-[#FAF8F5]/10 transition-all text-left flex items-center gap-1.5"
                      >
                        <ArrowRight className="w-2.5 h-2.5 text-[#38BDF8]" />
                        <span>{q}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3.5 items-center"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1e3a8a] to-[#38BDF8] flex items-center justify-center text-white">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-[#0a192f] border border-[#FAF8F5]/15 rounded-3xl rounded-tl-none px-4 py-3 text-xs text-[#FAF8F5]/70 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-ping" />
              <span>AuraStylist is analyzing sartorial harmony, fabrics, and accessories...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Carousel Bar */}
      <div className="px-6 py-2 bg-[#0a192f]/60 border-t border-[#FAF8F5]/10 flex items-center gap-2 overflow-x-auto scrollbar-hide">
        <span className="text-[10px] font-mono uppercase text-[#FAF8F5]/50 whitespace-nowrap">Suggested:</span>
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt.query)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#050d1a] border border-[#FAF8F5]/15 hover:border-[#38BDF8]/40 hover:bg-[#1e3a8a]/30 text-xs text-[#FAF8F5]/80 hover:text-white whitespace-nowrap transition-all shadow-sm"
          >
            {prompt.icon}
            <span>{prompt.label}</span>
          </button>
        ))}
      </div>

      {/* Message Input Bar */}
      <div className="p-4 bg-[#0a192f] border-t border-[#FAF8F5]/15">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          {/* Microphone Quick Toggle */}
          <button
            type="button"
            onClick={toggleListening}
            className={`p-3 rounded-2xl transition-all border ${
              isListening
                ? 'bg-rose-500 text-white border-rose-400 animate-pulse shadow-lg shadow-rose-500/40'
                : 'bg-[#050d1a] border-[#FAF8F5]/15 text-[#FAF8F5]/70 hover:text-[#38BDF8] hover:border-[#38BDF8]/40'
            }`}
            title={isListening ? "Listening... click to stop" : "Voice Input: Tap to speak"}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input */}
          <div className="relative flex-1">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                isListening
                  ? "Listening to your voice..."
                  : "Ask about interview suiting, wedding attire, jewelry coordination, fabric GSM..."
              }
              className="w-full bg-[#050d1a] border border-[#FAF8F5]/15 focus:border-[#38BDF8] rounded-2xl px-5 py-3.5 text-sm text-[#FAF8F5] placeholder-[#FAF8F5]/40 outline-none transition-all shadow-inner"
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="bg-[#FAF8F5] hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed text-[#0a192f] font-bold p-3.5 rounded-2xl transition-all shadow-lg hover:scale-105"
            title="Send Message"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
