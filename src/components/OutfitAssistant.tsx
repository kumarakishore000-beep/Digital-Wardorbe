'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Palette, 
  CloudSun, 
  Calendar, 
  Shirt, 
  Watch, 
  Check, 
  Copy, 
  RefreshCw, 
  Bookmark, 
  ArrowRight,
  Zap,
  Info,
  Compass,
  CheckCircle2,
  User,
  Footprints,
  Star,
  MessageSquare,
  Sliders,
  Award,
  ThumbsUp,
  Lightbulb
} from 'lucide-react';
import { OutfitRecommendationResponse } from '@/app/api/outfit-recommendation/route';
import { AiOpinionResponse } from '@/app/api/ai-opinion/route';
import { useCollection } from '@/hooks/useCollection';
import { useRewards } from '@/hooks/useRewards';
import { useAuth } from '@/hooks/useAuth';
import MannequinVisualizer from '@/components/MannequinVisualizer';

const OCCASIONS = [
  'Casual Day Out',
  'Business Formal',
  'Romantic Date Night',
  'Summer Beach Party',
  'Wedding Guest',
  'Cocktail Party',
  'Streetwear & Athleisure',
  'Outdoor Adventure',
];

const COLOR_PREFERENCES = [
  'Monochromatic Black & White',
  'Warm Earth Tones',
  'Pastel Aesthetics',
  'Bold & Vibrant',
  'Navy & Gold',
  'Minimalist Neutral',
  'Emerald & Sage',
];

const WEATHERS = [
  'Sunny & Warm (25°C+)',
  'Mild & Breezy (18°C)',
  'Cold & Chilly (8°C)',
  'Rainy & Damp',
  'Hot & Humid (30°C+)',
];

interface OutfitAssistantProps {
  onSaveToCollection?: (item: unknown) => void;
}

export default function OutfitAssistant({ onSaveToCollection }: OutfitAssistantProps) {
  const { user } = useAuth();
  
  const [selectedGender, setSelectedGender] = useState<'female' | 'male' | 'unisex'>(
    user?.gender === 'male' ? 'male' : 'female'
  );
  const [occasion, setOccasion] = useState('Casual Day Out');
  const [customOccasion, setCustomOccasion] = useState('');
  const [colorPreference, setColorPreference] = useState('Warm Earth Tones');
  const [customColor, setCustomColor] = useState('');
  const [weather, setWeather] = useState('Mild & Breezy (18°C)');
  const [customWeather, setCustomWeather] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<OutfitRecommendationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // AI Opinion & Rating States
  const [userOpinion, setUserOpinion] = useState('');
  const [userAdjustment, setUserAdjustment] = useState('');
  const [isSubmittingOpinion, setIsSubmittingOpinion] = useState(false);
  const [aiRatingData, setAiRatingData] = useState<AiOpinionResponse | null>(null);
  const [opinionError, setOpinionError] = useState<string | null>(null);

  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [copiedOutfit, setCopiedOutfit] = useState(false);
  const [savedToCollection, setSavedToCollection] = useState(false);

  const collection = useCollection();
  const rewards = useRewards();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setRecommendation(null);
    setAiRatingData(null);
    setSavedToCollection(false);

    const finalOccasion = customOccasion.trim() || occasion;
    const finalColor = customColor.trim() || colorPreference;
    const finalWeather = customWeather.trim() || weather;

    try {
      const response = await fetch('/api/outfit-recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gender: selectedGender,
          occasion: finalOccasion,
          colorPreference: finalColor,
          weather: finalWeather,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get outfit recommendation');
      }

      const data: OutfitRecommendationResponse = await response.json();
      setRecommendation(data);
      rewards.earnPoints('try_suggestion');
    } catch (err: unknown) {
      console.error(err);
      setError('Failed to generate recommendation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConsultAiOpinion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userOpinion.trim() && !userAdjustment.trim()) return;

    setIsSubmittingOpinion(true);
    setOpinionError(null);

    const finalOccasion = customOccasion.trim() || occasion;
    const finalWeather = customWeather.trim() || weather;

    try {
      const response = await fetch('/api/ai-opinion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userOpinion: userOpinion.trim(),
          userAdjustment: userAdjustment.trim(),
          currentOutfit: recommendation,
          gender: selectedGender,
          occasion: finalOccasion,
          weather: finalWeather,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to evaluate opinion');
      }

      const data: AiOpinionResponse = await response.json();
      setAiRatingData(data);

      // If AI provided an adjusted outfit, update recommendation live!
      if (data.adjustedOutfit) {
        setRecommendation((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            title: data.adjustedOutfit?.title || prev.title,
            overview: data.adjustedOutfit?.overview || prev.overview,
            mood: data.adjustedOutfit?.mood || prev.mood,
            items: {
              ...prev.items,
              ...data.adjustedOutfit?.items,
            },
            accessories: data.adjustedOutfit?.accessories.length ? data.adjustedOutfit.accessories : prev.accessories,
            colorPalette: data.adjustedOutfit?.colorPalette.length ? data.adjustedOutfit.colorPalette : prev.colorPalette,
            stylingTips: data.adjustedOutfit?.stylingTips.length ? data.adjustedOutfit.stylingTips : prev.stylingTips,
            walkInAdvice: data.adjustedOutfit?.walkInAdvice || prev.walkInAdvice,
            source: data.source || prev.source,
          };
        });
      }

      rewards.earnPoints('complete_analysis');
    } catch (err: unknown) {
      console.error(err);
      setOpinionError('Failed to process AI opinion. Please try again.');
    } finally {
      setIsSubmittingOpinion(false);
    }
  };

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleCopyOutfit = () => {
    if (!recommendation) return;
    const text = `✨ ${recommendation.title} (${recommendation.mood}) ✨\n\n` +
      `👕 Upper Body: ${recommendation.items.upperBody}\n` +
      `👖 Lower Body: ${recommendation.items.lowerBody}\n` +
      `👟 Footwear: ${recommendation.items.footwear}\n` +
      (recommendation.items.outerwear ? `🧥 Outerwear: ${recommendation.items.outerwear}\n` : '') +
      `\n💎 Accessories:\n` +
      recommendation.accessories.map(a => `- ${a.category}: ${a.name} (${a.description})`).join('\n') +
      `\n\n🚶‍♂️ Walk-In Advice:\n` +
      `- Vibe: ${recommendation.walkInAdvice?.entranceVibe}\n` +
      `- Posture & Gait: ${recommendation.walkInAdvice?.postureAndGait}\n` +
      `\n💡 Styling Tips:\n` +
      recommendation.stylingTips.map(t => `- ${t}`).join('\n');

    navigator.clipboard.writeText(text);
    setCopiedOutfit(true);
    setTimeout(() => setCopiedOutfit(false), 2000);
  };

  const handleSaveCollection = () => {
    if (!recommendation) return;
    const newItem = {
      id: Date.now().toString(),
      name: recommendation.title,
      category: 'Other' as const,
      color: recommendation.colorPalette[0]?.hex || '#6366F1',
      tags: [recommendation.mood, occasion, weather, selectedGender],
      imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop',
      notes: recommendation.overview,
      createdAt: new Date().toISOString(),
    };

    if (onSaveToCollection) {
      onSaveToCollection(newItem);
    } else {
      collection.addItem(newItem);
    }

    rewards.earnPoints('add_to_collection');
    setSavedToCollection(true);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10">
      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto relative">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-96 h-32 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-indigo-500/40 text-indigo-200 text-xs font-bold uppercase tracking-wider shadow-lg shadow-indigo-500/10">
          <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
          <span>Powered by Gemini AI Engine</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-200">
          AI Outfit & Walk-In Stylist
        </h1>
        <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-medium">
          Get complete head-to-toe styling for Men & Women — covering outfits, accessories, entrance presence tips, and live AI design ratings on your choices.
        </p>
      </div>

      {/* Input Form & Controls */}
      <div className="glass-card rounded-3xl p-6 md:p-8 bg-slate-900/80 backdrop-blur-2xl border border-white/15 shadow-2xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <form onSubmit={handleGenerate} className="space-y-8 relative z-10">
          {/* Section 0: Gender Selection */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-300">
              <User className="w-4 h-4 text-cyan-400" />
              1. Target Gender & Style Spectrum
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setSelectedGender('female')}
                className={`py-3.5 px-4 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 border ${
                  selectedGender === 'female'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border-pink-400 shadow-lg shadow-pink-500/25 scale-[1.02] ring-1 ring-pink-400/50'
                    : 'bg-slate-950/60 hover:bg-white/10 text-slate-300 border-white/10'
                }`}
              >
                <span className="text-base">👗</span>
                <span>Women&apos;s Fashion</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedGender('male')}
                className={`py-3.5 px-4 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 border ${
                  selectedGender === 'male'
                    ? 'bg-gradient-to-r from-indigo-500 to-cyan-600 text-white border-indigo-400 shadow-lg shadow-indigo-500/25 scale-[1.02] ring-1 ring-indigo-400/50'
                    : 'bg-slate-950/60 hover:bg-white/10 text-slate-300 border-white/10'
                }`}
              >
                <span className="text-base">👔</span>
                <span>Men&apos;s Fashion</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedGender('unisex')}
                className={`py-3.5 px-4 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 border ${
                  selectedGender === 'unisex'
                    ? 'bg-gradient-to-r from-purple-500 to-amber-600 text-white border-purple-400 shadow-lg shadow-purple-500/25 scale-[1.02] ring-1 ring-purple-400/50'
                    : 'bg-slate-950/60 hover:bg-white/10 text-slate-300 border-white/10'
                }`}
              >
                <span className="text-base">✨</span>
                <span>Unisex / Genderless</span>
              </button>
            </div>
          </div>

          {/* Section 1: Occasion */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-300">
              <Calendar className="w-4 h-4 text-indigo-400" />
              2. What&apos;s the Occasion?
            </label>
            <div className="flex flex-wrap gap-2">
              {OCCASIONS.map((occ) => (
                <button
                  type="button"
                  key={occ}
                  onClick={() => {
                    setOccasion(occ);
                    setCustomOccasion('');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
                    occasion === occ && !customOccasion
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 scale-105 border border-indigo-400'
                      : 'bg-slate-950/60 hover:bg-white/10 text-slate-300 border border-white/10'
                  }`}
                >
                  {occ}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Or type custom occasion (e.g. Gallery Opening, Rooftop Dinner)..."
              value={customOccasion}
              onChange={(e) => setCustomOccasion(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950/70 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all"
            />
          </div>

          {/* Section 2: Color Preference */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pink-300">
              <Palette className="w-4 h-4 text-pink-400" />
              3. Preferred Color Palette
            </label>
            <div className="flex flex-wrap gap-2">
              {COLOR_PREFERENCES.map((col) => (
                <button
                  type="button"
                  key={col}
                  onClick={() => {
                    setColorPreference(col);
                    setCustomColor('');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
                    colorPreference === col && !customColor
                      ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/25 scale-105 border border-pink-400'
                      : 'bg-slate-950/60 hover:bg-white/10 text-slate-300 border border-white/10'
                  }`}
                >
                  {col}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Or specify custom colors (e.g. Olive Green & Beige, Cobalt Blue)..."
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950/70 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-400 transition-all"
            />
          </div>

          {/* Section 3: Weather */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
              <CloudSun className="w-4 h-4 text-emerald-400" />
              4. Weather & Temperature
            </label>
            <div className="flex flex-wrap gap-2">
              {WEATHERS.map((w) => (
                <button
                  type="button"
                  key={w}
                  onClick={() => {
                    setWeather(w);
                    setCustomWeather('');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
                    weather === w && !customWeather
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 scale-105 border border-emerald-400'
                      : 'bg-slate-950/60 hover:bg-white/10 text-slate-300 border border-white/10'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Or enter custom weather (e.g. Snowy 2°C, Windy Afternoon)..."
              value={customWeather}
              onChange={(e) => setCustomWeather(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950/70 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400 transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.99]"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Consulting Gemini AI Stylist...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Outfit & Walk-In Recommendations with Gemini</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
          <Info className="w-5 h-5 shrink-0 text-rose-400" />
          {error}
        </div>
      )}

      {/* Results View */}
      <AnimatePresence mode="wait">
        {recommendation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Recommendation Card */}
            <div className="glass-card rounded-3xl p-6 md:p-10 bg-slate-900/80 backdrop-blur-2xl border border-indigo-500/30 shadow-2xl relative overflow-hidden space-y-8">
              {/* Top ambient glow */}
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

              {/* Title & Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6 relative z-10">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-200 text-xs font-bold shadow-sm">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-300 animate-pulse" />
                      <span>🤖 Powered by Gemini AI ({recommendation.modelUsed || 'gemini-2.5-flash'})</span>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider">
                      <Compass className="w-3.5 h-3.5" />
                      {recommendation.mood}
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold uppercase">
                      <User className="w-3.5 h-3.5" />
                      {selectedGender}
                    </div>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                    {recommendation.title}
                  </h2>
                  <p className="text-slate-300 text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
                    {recommendation.overview}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={handleCopyOutfit}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/10 transition-all"
                  >
                    {copiedOutfit ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Look
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleSaveCollection}
                    disabled={savedToCollection}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                      savedToCollection
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-transparent shadow-lg shadow-emerald-500/20'
                    }`}
                  >
                    {savedToCollection ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Saved in Collection!
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-4 h-4" />
                        Save to Collection
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Interactive AI Mannequin Preview */}
              <div className="relative z-10 my-4">
                <MannequinVisualizer
                  gender={selectedGender === 'male' ? 'male' : 'female'}
                  outfit={{
                    title: recommendation.title,
                    topType: selectedGender === 'male' ? 'shirt' : 'kurti',
                    topColor: recommendation.colorPalette[0]?.hex || '#059669',
                    bottomType: selectedGender === 'male' ? 'chinos' : 'salwar_bottom',
                    bottomColor: recommendation.colorPalette[1]?.hex || '#2E7D32',
                    outerwearColor: recommendation.colorPalette[2]?.hex,
                    accentColor: recommendation.colorPalette[3]?.hex || '#F59E0B',
                    description: recommendation.overview,
                  }}
                  showControls={true}
                />
              </div>

              {/* Walk-In Function & Entrance Styling Card */}
              {recommendation.walkInAdvice && (
                <div className="relative z-10 p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-purple-500/10 to-indigo-500/10 border border-amber-500/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-300 font-bold text-base">
                      <Footprints className="w-5 h-5 text-amber-400" />
                      Walk-In Entrance Function & Presence Guide
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/30">
                      Vibe: {recommendation.walkInAdvice.entranceVibe}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                      <p className="text-indigo-300 font-semibold uppercase text-[10px] tracking-wider">
                        Posture & Gait
                      </p>
                      <p className="text-slate-200 leading-relaxed">
                        {recommendation.walkInAdvice.postureAndGait}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                      <p className="text-purple-300 font-semibold uppercase text-[10px] tracking-wider">
                        Bag & Accessory Holding
                      </p>
                      <p className="text-slate-200 leading-relaxed">
                        {recommendation.walkInAdvice.holdingStyle}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                      <p className="text-pink-300 font-semibold uppercase text-[10px] tracking-wider">
                        Spotlight Lighting Impact
                      </p>
                      <p className="text-slate-200 leading-relaxed">
                        {recommendation.walkInAdvice.lightingPresence}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Core Outfit Composition Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {/* Upper Body */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:border-indigo-500/40 transition-all">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider">
                    <Shirt className="w-4 h-4 text-indigo-400" />
                    Upper Body / Top
                  </div>
                  <p className="text-white text-sm font-medium leading-relaxed">
                    {recommendation.items.upperBody}
                  </p>
                </div>

                {/* Lower Body */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:border-purple-500/40 transition-all">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-300 uppercase tracking-wider">
                    <Shirt className="w-4 h-4 text-purple-400 rotate-90" />
                    Lower Body / Bottom
                  </div>
                  <p className="text-white text-sm font-medium leading-relaxed">
                    {recommendation.items.lowerBody}
                  </p>
                </div>

                {/* Footwear */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:border-pink-500/40 transition-all">
                  <div className="flex items-center gap-2 text-xs font-bold text-pink-300 uppercase tracking-wider">
                    <Zap className="w-4 h-4 text-pink-400" />
                    Footwear
                  </div>
                  <p className="text-white text-sm font-medium leading-relaxed">
                    {recommendation.items.footwear}
                  </p>
                </div>

                {/* Outerwear */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:border-amber-500/40 transition-all">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                    <CloudSun className="w-4 h-4 text-amber-400" />
                    Outerwear & Layering
                  </div>
                  <p className="text-white text-sm font-medium leading-relaxed">
                    {recommendation.items.outerwear || 'No extra layer needed — keep it light and breathable.'}
                  </p>
                </div>
              </div>

              {/* Color Palette Section */}
              <div className="space-y-4 relative z-10">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Palette className="w-5 h-5 text-pink-400" />
                  Curated Color Palette
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {recommendation.colorPalette.map((color, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleCopyHex(color.hex)}
                      className="group cursor-pointer p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex items-center gap-3"
                    >
                      <div
                        className="w-10 h-10 rounded-xl shadow-md border border-white/20 transition-transform group-hover:scale-110"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-semibold truncate">{color.name}</p>
                        <p className="text-slate-400 text-xs font-mono">{color.hex}</p>
                      </div>
                      <span className="text-[10px] text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity">
                        {copiedHex === color.hex ? 'Copied' : 'Copy'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accessories Section */}
              <div className="space-y-4 relative z-10">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Watch className="w-5 h-5 text-indigo-400" />
                  Matching Accessories ({selectedGender.toUpperCase()})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recommendation.accessories.map((acc, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider">
                        {acc.category}
                      </span>
                      <h4 className="text-white text-sm font-semibold">{acc.name}</h4>
                      <p className="text-slate-400 text-xs leading-relaxed">{acc.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Styling Tips & Weather Suitability */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/10 relative z-10">
                <div className="md:col-span-2 space-y-3">
                  <h4 className="text-sm font-bold text-indigo-200 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    Stylist Advice & Pro Tips
                  </h4>
                  <ul className="space-y-2">
                    {recommendation.stylingTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                        <ArrowRight className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                    <CloudSun className="w-4 h-4 text-emerald-400" />
                    Weather Comfort
                  </h4>
                  <p className="text-xs text-emerald-200/90 leading-relaxed">
                    {recommendation.weatherSuitability}
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive AI Consultation, Rating & Adjustment Module */}
            <div className="glass-card rounded-3xl p-6 md:p-8 bg-slate-950/80 backdrop-blur-2xl border border-purple-500/30 shadow-2xl relative space-y-8">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    Interactive AI Design Rating & Adjustment Consultation
                  </h3>
                  <p className="text-xs text-slate-400">
                    Ask Gemini AI for customized adjustments or submit your own outfit choice & opinion for instant AI rating!
                  </p>
                </div>
              </div>

              <form onSubmit={handleConsultAiOpinion} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Adjustment Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-purple-300 flex items-center gap-1.5 uppercase tracking-wider">
                      <Sliders className="w-3.5 h-3.5 text-purple-400" />
                      Ask AI for Adjustments
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Swap jeans for tailored trousers, change accessories to gold, or make it warmer..."
                      value={userAdjustment}
                      onChange={(e) => setUserAdjustment(e.target.value)}
                      className="w-full p-3.5 rounded-2xl bg-slate-950/80 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all resize-none"
                    />
                  </div>

                  {/* Design Opinion Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-pink-300 flex items-center gap-1.5 uppercase tracking-wider">
                      <Star className="w-3.5 h-3.5 text-pink-400" />
                      Submit Choice & Design Opinion for AI Rating
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. I think pairing an emerald silk kurti with off-white palazzo pants, gold jhumka earrings, and metallic heels creates a better walk-in presence than dark denim..."
                      value={userOpinion}
                      onChange={(e) => setUserOpinion(e.target.value)}
                      className="w-full p-3.5 rounded-2xl bg-slate-950/80 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-400 transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Quick Prompts:</span>
                  <button
                    type="button"
                    onClick={() => setUserAdjustment('Make this look more casual and relaxed')}
                    className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-200 text-xs border border-white/10 transition-all hover:scale-105"
                  >
                    ✨ Make Casual
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserAdjustment('Switch to gold metallic accents and accessories')}
                    className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-200 text-xs border border-white/10 transition-all hover:scale-105"
                  >
                    👑 Gold Accents
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserAdjustment('Elevate walk-in presence for red-carpet entry')}
                    className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-200 text-xs border border-white/10 transition-all hover:scale-105"
                  >
                    🚶‍♂️ Red-Carpet Walk-In
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserOpinion('I prefer pairing tailored black trousers with leather jacket and silver accessories')}
                    className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-200 text-xs border border-white/10 transition-all hover:scale-105"
                  >
                    🖤 Dark Chic Choice
                  </button>
                </div>

                {/* Submit Opinion Button */}
                <button
                  type="submit"
                  disabled={isSubmittingOpinion || (!userOpinion.trim() && !userAdjustment.trim())}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-700 hover:via-pink-700 hover:to-rose-700 text-white font-bold text-xs shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingOpinion ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Gemini AI is Rating Your Taste & Adjusting Outfit...
                    </>
                  ) : (
                    <>
                      <Award className="w-4 h-4" />
                      Rate My Design Choice & Apply AI Adjustments
                    </>
                  )}
                </button>
              </form>

              {opinionError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {opinionError}
                </div>
              )}

              {/* AI Scorecard & Opinion Result Output */}
              {aiRatingData && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-purple-950/40 to-slate-900 border border-purple-500/40 space-y-6"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-purple-300 tracking-wider">
                        Gemini AI Design Rating Result
                      </span>
                      <h4 className="text-xl font-extrabold text-white flex items-center gap-2">
                        {aiRatingData.rating.verdict}
                      </h4>
                    </div>

                    {/* Score Badge */}
                    <div className="flex items-center gap-3 bg-black/60 px-5 py-2.5 rounded-2xl border border-purple-500/40 shrink-0">
                      <Star className="w-6 h-6 text-amber-400 fill-amber-400 animate-bounce" />
                      <div>
                        <span className="text-2xl font-black text-white">{aiRatingData.rating.overallScore}</span>
                        <span className="text-xs text-slate-400"> / 100</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating Breakdown Progress Bars */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="space-y-1.5 bg-black/30 p-3 rounded-xl border border-white/5">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-300">
                        <span>Color Harmony</span>
                        <span className="text-pink-300">{aiRatingData.rating.metrics.colorHarmony}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-pink-500 rounded-full transition-all duration-1000"
                          style={{ width: `${aiRatingData.rating.metrics.colorHarmony}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 bg-black/30 p-3 rounded-xl border border-white/5">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-300">
                        <span>Event Fit</span>
                        <span className="text-indigo-300">{aiRatingData.rating.metrics.eventFit}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                          style={{ width: `${aiRatingData.rating.metrics.eventFit}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 bg-black/30 p-3 rounded-xl border border-white/5">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-300">
                        <span>Walk-In Impact</span>
                        <span className="text-amber-300">{aiRatingData.rating.metrics.walkInImpact}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-all duration-1000"
                          style={{ width: `${aiRatingData.rating.metrics.walkInImpact}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 bg-black/30 p-3 rounded-xl border border-white/5">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-300">
                        <span>Trend Factor</span>
                        <span className="text-emerald-300">{aiRatingData.rating.metrics.trendFactor}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                          style={{ width: `${aiRatingData.rating.metrics.trendFactor}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* AI Critique Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                      <h5 className="font-bold text-emerald-300 flex items-center gap-1.5">
                        <ThumbsUp className="w-4 h-4 text-emerald-400" />
                        Design Strengths (What AI Loves)
                      </h5>
                      <ul className="space-y-1 text-slate-200">
                        {aiRatingData.aiCritique.strengths.map((str, idx) => (
                          <li key={idx}>• {str}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-2">
                      <h5 className="font-bold text-purple-300 flex items-center gap-1.5">
                        <Lightbulb className="w-4 h-4 text-purple-400" />
                        Stylist Counter-Suggestions
                      </h5>
                      <ul className="space-y-1 text-slate-200">
                        {aiRatingData.aiCritique.suggestions.map((sug, idx) => (
                          <li key={idx}>• {sug}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Overall AI Opinion Review */}
                  <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-300 leading-relaxed">
                    <p className="font-semibold text-white mb-1">Stylist Overall Review:</p>
                    <p>{aiRatingData.aiCritique.overallOpinion}</p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
