'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, Mic, MicOff, Volume2, VolumeX, Send, Sparkles, 
  RotateCcw, Star, ThumbsUp, CheckCircle2, MessageSquare, 
  Radio, Shirt, User, Briefcase, Heart, Gem, Scissors, 
  Layers, Trophy, ArrowRight, Eye, RefreshCw, Check, Sparkle,
  GlassWater, PartyPopper, Compass, GraduationCap, Palette
} from 'lucide-react';
import MannequinVisualizer, { OutfitConfig, SILHOUETTES, GarmentSilhouette } from '@/components/MannequinVisualizer';
import { useAuth, Gender } from '@/hooks/useAuth';
import { useRewards } from '@/hooks/useRewards';
import { ModelDressOption } from '@/app/api/model-dress-options/route';

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

// 6 Target Occasions (Aiuta & Fits benchmark)
const OCCASIONS = [
  { id: 'interview', label: 'Job Interview & Executive', icon: Briefcase, color: '#38BDF8' },
  { id: 'wedding', label: 'Royal Wedding & Sangeet', icon: Heart, color: '#F43F5E' },
  { id: 'cocktail', label: 'Black-Tie Dinner & Cocktail', icon: GlassWater, color: '#F59E0B' },
  { id: 'graduation', label: 'University Convocation', icon: GraduationCap, color: '#A855F7' },
  { id: 'resort', label: 'Destination Resort & Soirée', icon: Compass, color: '#10B981' },
  { id: 'casual', label: 'Smart Casual & Studio', icon: PartyPopper, color: '#3B82F6' },
];

// 5 Unique Dressing Model Archetypes (Aiuta virtual model benchmark)
export const MODEL_ARCHETYPES = [
  { id: 'runway', name: 'Haute Runway', scaleX: 0.95, scaleY: 1.05, desc: 'Tall, high-fashion elongated proportions' },
  { id: 'hourglass', name: 'Sculpted Hourglass', scaleX: 1.04, scaleY: 1.0, desc: 'Defined waist suppression & curved contours' },
  { id: 'athletic', name: 'Athletic Dynamic', scaleX: 1.08, scaleY: 1.02, desc: 'Broad shoulders & athletic posture' },
  { id: 'sartorial', name: 'Savile Row Tailored', scaleX: 1.0, scaleY: 1.0, desc: 'Traditional British balanced drape' },
  { id: 'petite', name: 'Petite Grace', scaleX: 0.93, scaleY: 0.94, desc: 'Slender, delicate high-waisted lines' },
];

// Editorial Style Referrals (Fits benchmark)
const EDITORIAL_REFERRALS = [
  {
    id: 'ref-1',
    title: 'The Modern Executive Power Suit',
    source: 'GQ Business Archive & Vogue Editorial',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop',
    tags: ['Super 140s Wool', '0.5" Cuff Reveal', 'Slight Break'],
    whyItWorks: 'Single-breasted sculpted waist suppression with fluid ivory trousers creates calm intellectual authority.',
    outfit: {
      title: 'Savile Row Power Suiting (Executive Interview)',
      topType: 'blazer' as const,
      topColor: '#0F172A',
      bottomType: 'trousers' as const,
      bottomColor: '#FAF8F5',
      outerwearColor: '#0A192F',
      accentColor: '#D4AF37',
      fabricType: 'wool' as const,
      occasion: 'Job Interview & Executive Assessment',
    }
  },
  {
    id: 'ref-2',
    title: 'Mulberry Liquid Silk Gala Gown',
    source: 'Vogue Runway Haute Couture Lookbook',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop',
    tags: ['19-Momme Silk', 'Bias Cut', 'Gold Hardware'],
    whyItWorks: 'Fluid cowl neckline and floor-sweeping drape capture evening ambient lighting with mesmerizing sheen.',
    outfit: {
      title: 'Mulberry Silk Gala Gown (Luxury Wedding)',
      topType: 'gown' as const,
      topColor: '#881337',
      bottomType: 'gown_skirt' as const,
      bottomColor: '#881337',
      outerwearColor: '#FAF8F5',
      accentColor: '#D4AF37',
      fabricType: 'silk' as const,
      occasion: 'Luxury Wedding & Gala Reception',
    }
  },
  {
    id: 'ref-3',
    title: 'Heritage Banarasi Zari Saree',
    source: 'Pantaloons Lookbook & Grazia India',
    image: '/images/branding/womens-ethnic-fusion.jpg',
    tags: ['Katan Silk', 'Antique Gold Zari', 'Regal Brocade'],
    whyItWorks: 'Substantial 320 GSM heavy silk holds architectural pleats effortlessly during traditional festivities.',
    outfit: {
      title: 'Heritage Banarasi Zari Saree (Festive Wedding)',
      topType: 'saree' as const,
      topColor: '#064E3B',
      bottomType: 'skirt' as const,
      bottomColor: '#064E3B',
      outerwearColor: '#064E3B',
      accentColor: '#F59E0B',
      fabricType: 'silk' as const,
      occasion: 'Royal Festive & Wedding',
    }
  },
  {
    id: 'ref-4',
    title: 'Amalfi Coast Slub Linen Resort Wear',
    source: 'Pitti Uomo Riviera / GQ Cruise',
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&auto=format&fit=crop',
    tags: ['Normandy Linen', 'Camp Collar', 'Penny Loafers'],
    whyItWorks: 'Breathable open-weave slub linen provides optimal airflow while maintaining sophisticated coastal poise.',
    outfit: {
      title: 'Slub Linen Resort Shirt & Chinos (Coastal Soirée)',
      topType: 'shirt' as const,
      topColor: '#C2410C',
      bottomType: 'chinos' as const,
      bottomColor: '#FAF8F5',
      outerwearColor: '#1E293B',
      accentColor: '#EAB308',
      fabricType: 'linen' as const,
      occasion: 'Destination Resort & Summer Gala',
    }
  }
];

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

  // Selected Occasion & Dressing Model Archetype
  const [activeOccasion, setActiveOccasion] = useState('interview');
  const [activeArchetype, setActiveArchetype] = useState(MODEL_ARCHETYPES[0]);

  // Concept B 4 Right-Side Tabs:
  // 1. 'wardrobe' (Acloset rack & 5-piece accessories)
  // 2. 'gemini' (Aiuta Gemini Multi-Model Opinions)
  // 3. 'referrals' (Fits Lookbook Referrals)
  // 4. 'feedback' (Customer Satisfaction)
  const [activeDeskTab, setActiveDeskTab] = useState<'wardrobe' | 'gemini' | 'referrals' | 'feedback'>('wardrobe');

  // Gemini AI Multi-Model States
  const [geminiOptions, setGeminiOptions] = useState<ModelDressOption[]>([]);
  const [isGeneratingGemini, setIsGeneratingGemini] = useState(false);

  // In-page Voice & Talk States
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-msg',
      role: 'assistant',
      content: `Welcome to **Connect with Fashion**! I am your personal AI stylist powered by Google Gemini.\n\nTap **🎙️ Voice Mode** to speak naturally or customize your 3D Catwalk Mannequin with our Acloset wardrobe rack and Gemini multi-model opinions.`,
      voiceText: "Welcome to Connect with Fashion. Speak to me or customize the 3D model with Acloset wardrobe pieces and Gemini opinions.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedQuestions: [
        "What should I wear to an executive job interview?",
        "Style an outfit for an evening wedding reception",
        "How do I coordinate shoes, watch, and jewelry?"
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState('');

  // Customer Feedback States
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    '3D Catwalk Walk Model',
    'AI Spoken Voice & Talking',
    'Gemini AI Multi-Model Opinions'
  ]);
  const [futureSuggestions, setFutureSuggestions] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<unknown>(null);

  // Initialize Speech APIs & load initial Gemini options
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = 
        (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition || 
        (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;

      if (SpeechRecognition) {
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

    // Auto-fetch initial Gemini options
    fetchGeminiModelOptions();

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentGender, activeOccasion]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoadingChat, speechTranscript]);

  // Fetch Gemini AI Multi-Model Opinions
  const fetchGeminiModelOptions = async () => {
    setIsGeneratingGemini(true);
    try {
      const occLabel = OCCASIONS.find(o => o.id === activeOccasion)?.label || 'Job Interview & Executive';
      const res = await fetch('/api/model-dress-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gender: currentGender,
          occasion: occLabel,
          preferredColor: currentOutfit.topColor || '#1E293B',
          bodySilhouette: activeArchetype.id
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.options && data.options.length > 0) {
          setGeminiOptions(data.options);
        }
      }
    } catch (e) {
      console.warn('Gemini options fetch error:', e);
    } finally {
      setIsGeneratingGemini(false);
    }
  };

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
    if (!message || isLoadingChat) return;

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
    setIsLoadingChat(true);

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
    } catch (e) {
      console.warn(e);
    } finally {
      setIsLoadingChat(false);
    }
  };

  // 1-Click Drape Gemini Option onto 3D Model
  const handleApplyGeminiOption = (opt: ModelDressOption) => {
    const updated: OutfitConfig = {
      title: opt.modelStyleName,
      topType: opt.outfit.topType as OutfitConfig['topType'],
      topColor: opt.outfit.topColor,
      bottomType: opt.outfit.bottomType as OutfitConfig['bottomType'],
      bottomColor: opt.outfit.bottomColor,
      outerwearColor: opt.outfit.outerwearColor,
      accentColor: opt.outfit.accentColor,
      fabricType: opt.outfit.fabricType as OutfitConfig['fabricType'],
      occasion: OCCASIONS.find(o => o.id === activeOccasion)?.label || 'Job Interview',
      description: opt.geminiOpinion.whyItWorks,
    };
    setCurrentOutfit(updated);
    rewards.earnPoints('try_suggestion');
  };

  // 1-Click Apply Editorial Style Referral
  const handleApplyReferral = (refItem: typeof EDITORIAL_REFERRALS[0]) => {
    setCurrentOutfit(refItem.outfit);
    rewards.earnPoints('try_suggestion');
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
    setFeedbackSubmitted(true);
    rewards.earnPoints('complete_analysis');
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      {/* Top Banner: Benchmark & Mode Controls */}
      <div className="bg-gradient-to-r from-[#050d1a] via-[#0a192f] to-[#050d1a] border border-[#FAF8F5]/15 rounded-3xl p-6 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1e3a8a]/40 border border-[#38BDF8]/30 text-xs font-mono font-bold text-[#38BDF8] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            ✦ Connect with Fashion &bull; Aiuta &amp; Acloset Architecture ✦
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-black tracking-tight text-[#FAF8F5]">
            3D Mannequin &amp; Intelligent Wardrobe Studio
          </h2>
          <p className="text-xs sm:text-sm text-[#FAF8F5]/70 max-w-xl">
            Live 3D catwalk model with diverse body archetypes, Acloset wardrobe slots, and Gemini AI multi-model opinions.
          </p>
        </div>

        {/* Gender & Occasion Quick Bar */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <button
            onClick={() => updateGender(currentGender === 'female' ? 'male' : 'female')}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#FAF8F5]/20 bg-[#1e3a8a]/40 text-[#FAF8F5] hover:bg-[#1e3a8a] text-xs font-semibold shadow-md transition-all"
          >
            <span className="text-sm">{currentGender === 'female' ? '👗' : '👔'}</span>
            <span className="capitalize font-bold">{currentGender} Model</span>
          </button>
        </div>
      </div>

      {/* Occasion Switcher Strip (Fits Benchmark: 6 Distinct Occasions) */}
      <div className="bg-[#050d1a]/80 p-2.5 rounded-2xl border border-[#FAF8F5]/15 flex items-center gap-2 overflow-x-auto scrollbar-hide">
        <span className="text-[11px] font-mono uppercase font-bold text-[#FAF8F5]/60 pl-2 shrink-0">
          Occasion:
        </span>
        {OCCASIONS.map((occ) => {
          const Icon = occ.icon;
          const isSelected = activeOccasion === occ.id;
          return (
            <button
              key={occ.id}
              onClick={() => setActiveOccasion(occ.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-[#FAF8F5] text-[#0a192f] border-white shadow-lg scale-102'
                  : 'bg-[#0a192f] border-[#FAF8F5]/10 text-[#FAF8F5]/70 hover:text-white hover:bg-[#16366f]/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5" style={{ color: isSelected ? '#0a192f' : occ.color }} />
              <span>{occ.label}</span>
            </button>
          );
        })}
      </div>

      {/* Model Archetype Selector (Aiuta Benchmark: 5 Unique Body Silhouettes) */}
      <div className="bg-[#050d1a]/80 p-2.5 rounded-2xl border border-[#FAF8F5]/15 flex items-center gap-2 overflow-x-auto scrollbar-hide">
        <span className="text-[11px] font-mono uppercase font-bold text-[#93c5fd] pl-2 shrink-0">
          Model Silhouette:
        </span>
        {MODEL_ARCHETYPES.map((arch) => {
          const isSelected = activeArchetype.id === arch.id;
          return (
            <button
              key={arch.id}
              onClick={() => setActiveArchetype(arch)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all border ${
                isSelected
                  ? 'bg-gradient-to-r from-[#1e3a8a] to-[#38BDF8] text-white font-bold border-white/40 shadow-md'
                  : 'bg-[#0a192f] border-[#FAF8F5]/10 text-[#FAF8F5]/70 hover:text-white'
              }`}
              title={arch.desc}
            >
              <User className="w-3 h-3" />
              <span>{arch.name}</span>
            </button>
          );
        })}
      </div>

      {/* ===== SPLIT SCREEN: CONCEPT B (Aiuta + Acloset + Fits Hybrid) ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: 3D RUNWAY MANNEQUIN & VOICE (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <h3 className="font-serif font-bold text-base text-white">Interactive 3D Mannequin</h3>
            </div>
            <span className="text-[11px] font-mono text-[#38BDF8] bg-[#1e3a8a]/30 px-2.5 py-0.5 rounded-full border border-[#38BDF8]/20">
              {activeArchetype.name}
            </span>
          </div>

          <div className="relative">
            <MannequinVisualizer
              gender={currentGender}
              onGenderChange={updateGender}
              outfit={currentOutfit}
              onGarmentChange={(newOutfit) => setCurrentOutfit(newOutfit)}
              showControls={true}
              className="h-[760px] shadow-2xl rounded-3xl overflow-hidden border border-[#FAF8F5]/15"
            />

            {/* In-Canvas Floating Microphone for Voice Talk */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <button
                onClick={toggleMic}
                className={`p-2.5 rounded-full shadow-xl transition-all flex items-center gap-2 border ${
                  isListening
                    ? 'bg-rose-500 text-white border-rose-300 animate-pulse'
                    : 'bg-[#050d1a]/80 backdrop-blur-xl border-white/20 text-white hover:border-[#38BDF8]'
                }`}
                title="Tap to speak to AI Stylist"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-[#38BDF8]" />}
                <span className="text-[11px] font-bold pr-1">
                  {isListening ? "Listening..." : "Talk to AI"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 4-TAB INTELLIGENCE & WARDROBE DESK (7 cols) */}
        <div className="lg:col-span-7 bg-[#050d1a]/95 border border-[#FAF8F5]/15 rounded-3xl shadow-2xl backdrop-blur-xl flex flex-col h-[800px] overflow-hidden">
          {/* Right Panel Tabs Header */}
          <div className="bg-[#0a192f] border-b border-[#FAF8F5]/15 px-4 py-3 flex items-center justify-between gap-2 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveDeskTab('wardrobe')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeDeskTab === 'wardrobe'
                    ? 'bg-[#FAF8F5] text-[#0a192f] shadow-md'
                    : 'text-[#FAF8F5]/70 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-[#1e3a8a]" />
                <span>Acloset Wardrobe Rack</span>
              </button>

              <button
                onClick={() => setActiveDeskTab('gemini')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeDeskTab === 'gemini'
                    ? 'bg-gradient-to-r from-[#1e3a8a] to-[#38BDF8] text-white shadow-md'
                    : 'text-[#FAF8F5]/70 hover:text-white'
                }`}
              >
                <Bot className="w-3.5 h-3.5 text-amber-300" />
                <span>Gemini 3-Model Opinions</span>
              </button>

              <button
                onClick={() => setActiveDeskTab('referrals')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeDeskTab === 'referrals'
                    ? 'bg-[#FAF8F5] text-[#0a192f] shadow-md'
                    : 'text-[#FAF8F5]/70 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-[#1e3a8a]" />
                <span>Fits Lookbooks</span>
              </button>

              <button
                onClick={() => setActiveDeskTab('feedback')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeDeskTab === 'feedback'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-[#FAF8F5]/70 hover:text-white'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>Satisfaction</span>
              </button>
            </div>
          </div>

          {/* TAB 1: ACLOSET WARDROBE RACK & 5-PIECE ACCESSORIES */}
          {activeDeskTab === 'wardrobe' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-[#1e3a8a]/50">
              {/* Active Look Summary */}
              <div className="p-4 bg-[#0a192f] rounded-2xl border border-[#FAF8F5]/15 flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-base text-white">{currentOutfit.title}</h4>
                  <p className="text-xs text-[#38BDF8]">{currentOutfit.occasion} &bull; {currentOutfit.fabricType?.toUpperCase()} Drape</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full border border-white/40 shadow-sm" style={{ backgroundColor: currentOutfit.topColor }} title="Top Color" />
                  <div className="w-5 h-5 rounded-full border border-white/40 shadow-sm" style={{ backgroundColor: currentOutfit.bottomColor }} title="Bottom Color" />
                  <div className="w-5 h-5 rounded-full border border-white/40 shadow-sm" style={{ backgroundColor: currentOutfit.accentColor }} title="Accent Metal" />
                </div>
              </div>

              {/* Upper Body (Tops / Dresses Slot) */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#93c5fd] flex items-center gap-2">
                  <Shirt className="w-3.5 h-3.5" />
                  Upper Body &amp; Dress Garments (Click to Drape)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {SILHOUETTES.filter(s => s.gender === currentGender || s.gender === 'both').map((sil) => {
                    const isSelected = currentOutfit.title === sil.title;
                    return (
                      <button
                        key={sil.id}
                        onClick={() => {
                          const updated: OutfitConfig = {
                            title: sil.title,
                            topType: sil.key,
                            topColor: sil.defaultTopColor,
                            bottomType: sil.suggestedBottom,
                            bottomColor: sil.defaultBottomColor,
                            accentColor: sil.defaultAccentColor,
                            description: sil.description,
                            fabricType: sil.fabricType,
                            occasion: sil.category,
                          };
                          setCurrentOutfit(updated);
                        }}
                        className={`p-3 rounded-2xl border text-left flex flex-col justify-between h-24 transition-all ${
                          isSelected
                            ? 'bg-[#FAF8F5] text-[#0a192f] border-white shadow-lg font-bold scale-[1.02]'
                            : 'bg-[#0a192f] border-[#FAF8F5]/15 text-[#FAF8F5]/80 hover:border-[#38BDF8]/40 hover:bg-[#16366f]/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase text-[#38BDF8]">{sil.category}</span>
                          <div className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: sil.defaultTopColor }} />
                        </div>
                        <p className="text-xs leading-tight line-clamp-2">{sil.title}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5-Piece Coordinated Accessories Slot */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#93c5fd] flex items-center gap-2">
                  <Gem className="w-3.5 h-3.5 text-amber-400" />
                  Coordinated 5-Piece Accessories Suite
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-[#0a192f] rounded-2xl border border-[#FAF8F5]/15 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">1. Footwear (Shoe)</span>
                    <p className="text-xs font-bold text-white">Italian Nappa Pumps / Oxford Brogues</p>
                    <p className="text-[11px] text-[#FAF8F5]/60">Conditioned mirror polish; solid non-slip grip.</p>
                  </div>
                  <div className="p-3.5 bg-[#0a192f] rounded-2xl border border-[#FAF8F5]/15 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">2. Timepiece (Watch)</span>
                    <p className="text-xs font-bold text-white">28mm Rose Gold Mesh / Chronometer</p>
                    <p className="text-[11px] text-[#FAF8F5]/60">Ultra-thin 8mm profile slips beneath shirt cuff.</p>
                  </div>
                  <div className="p-3.5 bg-[#0a192f] rounded-2xl border border-[#FAF8F5]/15 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">3. Hand Accent (Ring)</span>
                    <p className="text-xs font-bold text-white">Solitaire Pavé / Platinum Signet Band</p>
                    <p className="text-[11px] text-[#FAF8F5]/60">Subtle elegance on left pinky or ring finger.</p>
                  </div>
                  <div className="p-3.5 bg-[#0a192f] rounded-2xl border border-[#FAF8F5]/15 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">4. Neckline (Chain)</span>
                    <p className="text-xs font-bold text-white">Freshwater Pearl / 18k Herringbone Link</p>
                    <p className="text-[11px] text-[#FAF8F5]/60">Frames collar spread without distracting.</p>
                  </div>
                  <div className="p-3.5 bg-[#0a192f] rounded-2xl border border-[#FAF8F5]/15 space-y-1 sm:col-span-2">
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">5. Wrist Harmony (Bracelet)</span>
                    <p className="text-xs font-bold text-white">Diamond Tennis Line / 18k Architectural Gold Cuff</p>
                    <p className="text-[11px] text-[#FAF8F5]/60">Worn on wrist opposite watch to maintain aesthetic visual balance.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GEMINI 3-MODEL OPINIONS (Aiuta Benchmark) */}
          {activeDeskTab === 'gemini' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-[#1e3a8a]/50">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-lg text-white">Gemini Multi-Model Opinion Engine</h4>
                  <p className="text-xs text-[#FAF8F5]/60">3 distinct styled model dress options generated by Gemini 3.6 Flash.</p>
                </div>
                <button
                  onClick={fetchGeminiModelOptions}
                  disabled={isGeneratingGemini}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1e3a8a]/40 border border-[#38BDF8]/30 text-xs font-semibold text-[#38BDF8] hover:bg-[#1e3a8a] transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingGemini ? 'animate-spin' : ''}`} />
                  <span>Refresh Options</span>
                </button>
              </div>

              {isGeneratingGemini ? (
                <div className="py-20 text-center space-y-4">
                  <Bot className="w-10 h-10 text-[#38BDF8] animate-bounce mx-auto" />
                  <p className="text-xs text-[#FAF8F5]/70">Gemini is evaluating fabric weave, accessories harmony, and silhouette proportions...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {geminiOptions.map((opt, idx) => (
                    <div
                      key={opt.id || idx}
                      className="bg-[#0a192f] border border-[#FAF8F5]/15 rounded-2xl p-5 space-y-4 hover:border-[#38BDF8]/40 transition-all shadow-lg"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1e3a8a]/40 text-[#38BDF8] text-[10px] font-mono font-bold uppercase mb-1">
                            Option {idx + 1}: {opt.silhouetteType}
                          </div>
                          <h5 className="font-serif font-bold text-base text-white">{opt.modelStyleName}</h5>
                        </div>
                        <div className="flex items-center gap-1 bg-amber-500/20 border border-amber-500/30 text-amber-300 px-3 py-1 rounded-full text-xs font-mono font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{opt.geminiOpinion.score}/100</span>
                        </div>
                      </div>

                      <div className="text-xs space-y-2 text-[#FAF8F5]/80 leading-relaxed bg-[#050d1a] p-3.5 rounded-xl border border-[#FAF8F5]/10">
                        <p><strong className="text-[#38BDF8]">Verdict:</strong> {opt.geminiOpinion.verdict}</p>
                        <p><strong className="text-[#38BDF8]">Why It Works:</strong> {opt.geminiOpinion.whyItWorks}</p>
                        <p><strong className="text-[#38BDF8]">Walking Impact:</strong> {opt.geminiOpinion.walkingImpression}</p>
                        <p><strong className="text-[#38BDF8]">Fabric GSM:</strong> {opt.outfit.fabricGsm}</p>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] font-mono text-[#FAF8F5]/60">Source: {opt.editorialReferral.source}</span>
                        <button
                          onClick={() => handleApplyGeminiOption(opt)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#38BDF8] text-white font-bold text-xs hover:scale-105 transition-all shadow-md flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>Drape on 3D Model</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FITS-STYLE LOOKBOOK REFERRALS (Fits Benchmark) */}
          {activeDeskTab === 'referrals' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-[#1e3a8a]/50">
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-lg text-white">Editorial Lookbook Referrals</h4>
                <p className="text-xs text-[#FAF8F5]/60">High-fashion moodboards and runway photography curated for your occasion.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {EDITORIAL_REFERRALS.map((refItem) => (
                  <div
                    key={refItem.id}
                    className="bg-[#0a192f] border border-[#FAF8F5]/15 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between hover:border-[#38BDF8]/40 transition-all group"
                  >
                    <div className="relative h-44 w-full overflow-hidden">
                      <img
                        src={refItem.image}
                        alt={refItem.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-transparent to-transparent" />
                      <span className="absolute bottom-2 left-3 text-[10px] font-mono font-bold text-[#38BDF8] bg-[#050d1a]/80 px-2.5 py-0.5 rounded-full">
                        {refItem.source}
                      </span>
                    </div>

                    <div className="p-4 space-y-3">
                      <h5 className="font-serif font-bold text-sm text-white">{refItem.title}</h5>
                      <p className="text-[11px] text-[#FAF8F5]/70 leading-relaxed">{refItem.whyItWorks}</p>
                      <div className="flex flex-wrap gap-1">
                        {refItem.tags.map((t, idx) => (
                          <span key={idx} className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#1e3a8a]/30 text-[#93c5fd]">
                            #{t}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => handleApplyReferral(refItem)}
                        className="w-full mt-2 py-2 rounded-xl bg-[#FAF8F5] text-[#0a192f] font-bold text-xs hover:bg-white transition-all shadow-md flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#1e3a8a]" />
                        <span>Apply Look to 3D Model</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOMER SATISFACTION & FUTURE ROADMAP */}
          {activeDeskTab === 'feedback' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-[#1e3a8a]/50">
              <div className="text-center space-y-1">
                <h4 className="font-serif font-bold text-xl text-white">Customer Satisfaction &amp; Roadmap</h4>
                <p className="text-xs text-[#FAF8F5]/60">Shape the future of AuraStyle AI with your review.</p>
              </div>

              {!feedbackSubmitted ? (
                <form onSubmit={handleFeedbackSubmit} className="space-y-5 bg-[#0a192f] p-5 rounded-2xl border border-[#FAF8F5]/15">
                  <div className="text-center space-y-2">
                    <label className="block text-xs font-semibold uppercase text-[#FAF8F5]/80">Rate Your Experience</label>
                    <div className="flex justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          className="p-1 transition-transform hover:scale-125"
                        >
                          <Star className={`w-7 h-7 ${(hoverRating || rating) >= star ? 'text-amber-400 fill-amber-400' : 'text-white/20'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase text-[#FAF8F5]/80">Features You Appreciate</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {['3D Catwalk Walk Model', 'AI Spoken Voice & Talking', 'Gemini AI Multi-Model Opinions', 'Acloset 5-Piece Accessories', 'Fits Style Referrals'].map((f) => (
                        <button
                          type="button"
                          key={f}
                          onClick={() => setSelectedFeatures(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])}
                          className={`p-2.5 rounded-xl border text-left flex items-center justify-between ${
                            selectedFeatures.includes(f) ? 'bg-[#1e3a8a]/50 border-[#38BDF8] text-white font-bold' : 'bg-[#050d1a] border-white/10 text-white/70'
                          }`}
                        >
                          <span>{f}</span>
                          {selectedFeatures.includes(f) && <Check className="w-3.5 h-3.5 text-[#38BDF8]" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase text-[#FAF8F5]/80">What updates should we add next?</label>
                    <textarea
                      rows={3}
                      value={futureSuggestions}
                      onChange={(e) => setFutureSuggestions(e.target.value)}
                      placeholder="E.g., Virtual try-on with webcam, more bridal jewelry sets, custom trouser inseam breaks..."
                      className="w-full bg-[#050d1a] border border-[#FAF8F5]/15 focus:border-[#38BDF8] rounded-xl p-3 text-xs text-white outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#FAF8F5] text-[#0a192f] font-bold text-xs hover:bg-white shadow-lg flex items-center justify-center gap-2"
                  >
                    <Trophy className="w-4 h-4 text-[#1e3a8a]" />
                    <span>Submit &amp; Claim +50 Reward Points</span>
                  </button>
                </form>
              ) : (
                <div className="text-center py-10 space-y-4 bg-[#0a192f] p-6 rounded-2xl border border-emerald-500/30">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h5 className="font-serif font-bold text-lg text-white">Feedback Confirmed!</h5>
                  <p className="text-xs text-[#FAF8F5]/70 max-w-sm mx-auto">
                    Thank you! Your feedback has been saved and +50 points added to your Atelier rewards profile.
                  </p>
                  <button
                    onClick={() => setFeedbackSubmitted(false)}
                    className="px-4 py-2 rounded-xl bg-[#1e3a8a]/40 text-white text-xs border border-white/20"
                  >
                    Submit Another Review
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Bottom Conversation Bar for Voice & Chat */}
          <div className="p-3 bg-[#0a192f] border-t border-[#FAF8F5]/15">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={toggleMic}
                className={`p-2.5 rounded-xl border transition-all ${
                  isListening ? 'bg-rose-500 text-white border-rose-400 animate-pulse' : 'bg-[#050d1a] border-white/10 text-[#38BDF8]'
                }`}
                title="Speak to AI"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask AuraStylist about interview suiting, wedding sarees, jewelry..."
                className="flex-1 bg-[#050d1a] border border-[#FAF8F5]/15 focus:border-[#38BDF8] rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/40 outline-none"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoadingChat}
                className="p-2.5 rounded-xl bg-[#FAF8F5] text-[#0a192f] font-bold disabled:opacity-30"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
