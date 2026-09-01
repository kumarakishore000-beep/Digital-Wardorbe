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
  'Royal Blue & Warm Ivory',
  'Midnight Navy & Pure Cream',
  'Sapphire & Soft Ivory',
  'Minimalist Royal Tones',
  'Monochromatic Ivory & Blue',
  'Bold Royal Accent & Gold',
  'Pastel Blue & Ivory Silk',
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
  const [colorPreference, setColorPreference] = useState('Royal Blue & Warm Ivory');
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
        throw new Error('Failed to fetch outfit recommendations.');
      }

      const data: OutfitRecommendationResponse = await response.json();
      setRecommendation(data);
      rewards.earnPoints('try_suggestion');
    } catch {
      setError('Failed to generate outfit recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConsultAiOpinion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recommendation) return;
    if (!userOpinion.trim() && !userAdjustment.trim()) return;

    setIsSubmittingOpinion(true);
    setOpinionError(null);

    try {
      const response = await fetch('/api/ai-opinion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentOutfit: {
            title: recommendation.title,
            gender: selectedGender,
            occasion: customOccasion || occasion,
            upperBody: recommendation.items.upperBody,
            lowerBody: recommendation.items.lowerBody,
            footwear: recommendation.items.footwear,
            outerwear: recommendation.items.outerwear,
            accessories: recommendation.accessories.map((a) => `${a.category}: ${a.name}`),
            walkInVibe: recommendation.walkInAdvice?.entranceVibe,
          },
          userOpinion: userOpinion.trim(),
          userAdjustment: userAdjustment.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to evaluate AI opinion.');
      }

      const data: AiOpinionResponse = await response.json();
      setAiRatingData(data);
      rewards.earnPoints('try_suggestion');
    } catch {
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
    const text = `✦ ${recommendation.title} (${recommendation.mood}) ✦\n\n` +
      `👕 Upper: ${recommendation.items.upperBody}\n` +
      `👖 Lower: ${recommendation.items.lowerBody}\n` +
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
      color: recommendation.colorPalette[0]?.hex || '#1E3A8A',
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
    <div className="w-full max-w-5xl mx-auto space-y-10 text-[#FAF8F5]">
      {/* Header Banner */}
      <div className="text-center space-y-3 max-w-3xl mx-auto relative">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1e3a8a]/40 border border-[#FAF8F5]/20 text-[#FAF8F5] text-xs font-mono uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-[#fffff0]" />
          <span>AuraStyle Atelier AI Stylist</span>
        </div>
        
        <h1 className="text-3xl md:text-5xl font-serif font-black tracking-tight text-[#FAF8F5]">
          AI Outfit &amp; Walk-In Stylist
        </h1>
        <p className="text-[#FAF8F5]/75 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-light">
          Complete head-to-toe styling in Royal Blue &amp; Ivory — covering wardrobe cuts, accessories, entrance presence tips, and live AI design ratings.
        </p>
      </div>

      {/* Input Form & Controls */}
      <div className="rounded-3xl p-6 md:p-8 bg-[#0f254e]/60 backdrop-blur-2xl border border-[#FAF8F5]/15 shadow-2xl space-y-8 relative overflow-hidden">
        <form onSubmit={handleGenerate} className="space-y-8 relative z-10">
          {/* Section 0: Gender Selection */}
          <div className="space-y-2.5">
            <label className="flex items-center gap-2 text-xs font-mono uppercase font-bold tracking-wider text-[#FAF8F5]/80">
              <User className="w-4 h-4 text-[#93c5fd]" />
              1. Target Silhouette &amp; Gender
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setSelectedGender('female')}
                className={`py-3 px-4 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 border ${
                  selectedGender === 'female'
                    ? 'bg-[#FAF8F5] text-[#0a192f] border-[#FAF8F5] shadow-lg scale-[1.02]'
                    : 'bg-[#0a192f]/60 hover:bg-[#16366f]/40 text-[#FAF8F5]/70 border-[#FAF8F5]/10'
                }`}
              >
                <span>👗 Women</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedGender('male')}
                className={`py-3 px-4 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 border ${
                  selectedGender === 'male'
                    ? 'bg-[#FAF8F5] text-[#0a192f] border-[#FAF8F5] shadow-lg scale-[1.02]'
                    : 'bg-[#0a192f]/60 hover:bg-[#16366f]/40 text-[#FAF8F5]/70 border-[#FAF8F5]/10'
                }`}
              >
                <span>👔 Men</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedGender('unisex')}
                className={`py-3 px-4 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 border ${
                  selectedGender === 'unisex'
                    ? 'bg-[#FAF8F5] text-[#0a192f] border-[#FAF8F5] shadow-lg scale-[1.02]'
                    : 'bg-[#0a192f]/60 hover:bg-[#16366f]/40 text-[#FAF8F5]/70 border-[#FAF8F5]/10'
                }`}
              >
                <span>✨ Unisex</span>
              </button>
            </div>
          </div>

          {/* Section 1: Occasion */}
          <div className="space-y-2.5">
            <label className="flex items-center gap-2 text-xs font-mono uppercase font-bold tracking-wider text-[#FAF8F5]/80">
              <Calendar className="w-4 h-4 text-[#93c5fd]" />
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
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    occasion === occ && !customOccasion
                      ? 'bg-[#FAF8F5] text-[#0a192f] border-[#FAF8F5] shadow-md scale-105'
                      : 'bg-[#0a192f]/60 hover:bg-[#16366f]/40 text-[#FAF8F5]/70 border-[#FAF8F5]/10'
                  }`}
                >
                  {occ}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Or type custom occasion (e.g. Royal Gala, Executive Dinner)..."
              value={customOccasion}
              onChange={(e) => setCustomOccasion(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0a192f] border border-[#FAF8F5]/15 text-white text-xs placeholder:text-[#FAF8F5]/30 focus:outline-none focus:border-[#FAF8F5]/40 transition-all"
            />
          </div>

          {/* Section 2: Color Preference */}
          <div className="space-y-2.5">
            <label className="flex items-center gap-2 text-xs font-mono uppercase font-bold tracking-wider text-[#FAF8F5]/80">
              <Palette className="w-4 h-4 text-[#93c5fd]" />
              3. Color Palette Preference
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
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    colorPreference === col && !customColor
                      ? 'bg-[#FAF8F5] text-[#0a192f] border-[#FAF8F5] shadow-md scale-105'
                      : 'bg-[#0a192f]/60 hover:bg-[#16366f]/40 text-[#FAF8F5]/70 border-[#FAF8F5]/10'
                  }`}
                >
                  {col}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Or specify custom colors (e.g. Royal Blue & Pearl Ivory)..."
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0a192f] border border-[#FAF8F5]/15 text-white text-xs placeholder:text-[#FAF8F5]/30 focus:outline-none focus:border-[#FAF8F5]/40 transition-all"
            />
          </div>

          {/* Section 3: Weather */}
          <div className="space-y-2.5">
            <label className="flex items-center gap-2 text-xs font-mono uppercase font-bold tracking-wider text-[#FAF8F5]/80">
              <CloudSun className="w-4 h-4 text-[#93c5fd]" />
              4. Weather &amp; Temperature
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
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    weather === w && !customWeather
                      ? 'bg-[#FAF8F5] text-[#0a192f] border-[#FAF8F5] shadow-md scale-105'
                      : 'bg-[#0a192f]/60 hover:bg-[#16366f]/40 text-[#FAF8F5]/70 border-[#FAF8F5]/10'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Or enter custom weather (e.g. Crisp Evening 15°C)..."
              value={customWeather}
              onChange={(e) => setCustomWeather(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0a192f] border border-[#FAF8F5]/15 text-white text-xs placeholder:text-[#FAF8F5]/30 focus:outline-none focus:border-[#FAF8F5]/40 transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-8 rounded-full bg-[#FAF8F5] hover:bg-white text-[#0a192f] font-serif font-bold text-sm shadow-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin text-[#1e3a8a]" />
                <span>Consulting AuraStyle AI Stylist...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-[#1e3a8a]" />
                <span>Generate Curated Royal Blue &amp; Ivory Look</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/30 text-red-200 text-sm flex items-center gap-3">
          <Info className="w-5 h-5 shrink-0 text-red-400" />
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
            <div className="rounded-3xl p-6 md:p-10 bg-[#0f254e]/60 backdrop-blur-2xl border border-[#FAF8F5]/20 shadow-2xl space-y-8">
              {/* Title & Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#FAF8F5]/10 pb-6 relative z-10">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1e3a8a]/40 border border-[#FAF8F5]/20 text-[#FAF8F5] text-xs font-bold font-mono">
                      <Sparkles className="w-3.5 h-3.5 text-[#fffff0]" />
                      <span>Atelier AI ({recommendation.modelUsed || 'gemini-2.5-flash'})</span>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0a192f] border border-[#FAF8F5]/15 text-[#93c5fd] text-xs font-semibold uppercase tracking-wider">
                      <Compass className="w-3.5 h-3.5" />
                      {recommendation.mood}
                    </div>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#FAF8F5]">
                    {recommendation.title}
                  </h2>
                  <p className="text-[#FAF8F5]/75 text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
                    {recommendation.overview}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={handleCopyOutfit}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0a192f] hover:bg-[#16366f]/40 text-[#FAF8F5] text-xs font-semibold border border-[#FAF8F5]/20 transition-all"
                  >
                    {copiedOutfit ? (
                      <>
                        <Check className="w-4 h-4 text-[#FAF8F5]" />
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
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      savedToCollection
                        ? 'bg-[#1e3a8a] text-white border border-[#FAF8F5]/30'
                        : 'bg-[#FAF8F5] hover:bg-white text-[#0a192f] shadow-lg'
                    }`}
                  >
                    {savedToCollection ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-white" />
                        Saved in Wardrobe!
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-4 h-4 text-[#1e3a8a]" />
                        Save to Wardrobe
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
                    topColor: recommendation.colorPalette[0]?.hex || '#1E3A8A',
                    bottomType: selectedGender === 'male' ? 'chinos' : 'salwar_bottom',
                    bottomColor: recommendation.colorPalette[1]?.hex || '#FAF8F5',
                    outerwearColor: recommendation.colorPalette[2]?.hex,
                    accentColor: recommendation.colorPalette[3]?.hex || '#D4A343',
                    description: recommendation.overview,
                  }}
                  showControls={true}
                />
              </div>

              {/* Walk-In Function & Entrance Styling Card */}
              {recommendation.walkInAdvice && (
                <div className="relative z-10 p-6 rounded-3xl bg-[#0a192f]/70 border border-[#FAF8F5]/15 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#FAF8F5] font-serif font-bold text-base">
                      <Footprints className="w-5 h-5 text-[#93c5fd]" />
                      Walk-In Entrance Function &amp; Presence Guide
                    </div>
                    <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-[#1e3a8a]/40 text-[#FAF8F5] border border-[#FAF8F5]/20">
                      Vibe: {recommendation.walkInAdvice.entranceVibe}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-3.5 rounded-2xl bg-[#050d1a] border border-[#FAF8F5]/10 space-y-1">
                      <p className="text-[#93c5fd] font-mono font-semibold uppercase text-[10px] tracking-wider">
                        Posture &amp; Gait
                      </p>
                      <p className="text-[#FAF8F5]/80 leading-relaxed">
                        {recommendation.walkInAdvice.postureAndGait}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#050d1a] border border-[#FAF8F5]/10 space-y-1">
                      <p className="text-[#93c5fd] font-mono font-semibold uppercase text-[10px] tracking-wider">
                        Bag &amp; Accessory Holding
                      </p>
                      <p className="text-[#FAF8F5]/80 leading-relaxed">
                        {recommendation.walkInAdvice.holdingStyle}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#050d1a] border border-[#FAF8F5]/10 space-y-1">
                      <p className="text-[#93c5fd] font-mono font-semibold uppercase text-[10px] tracking-wider">
                        Lighting Impact
                      </p>
                      <p className="text-[#FAF8F5]/80 leading-relaxed">
                        {recommendation.walkInAdvice.lightingPresence}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Core Outfit Composition Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div className="p-5 rounded-2xl bg-[#0a192f]/60 border border-[#FAF8F5]/15 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#FAF8F5] uppercase tracking-wider">
                    <Shirt className="w-4 h-4 text-[#93c5fd]" />
                    Upper Body / Top
                  </div>
                  <p className="text-[#FAF8F5]/90 text-sm font-medium leading-relaxed">
                    {recommendation.items.upperBody}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#0a192f]/60 border border-[#FAF8F5]/15 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#FAF8F5] uppercase tracking-wider">
                    <Shirt className="w-4 h-4 text-[#93c5fd] rotate-90" />
                    Lower Body / Bottom
                  </div>
                  <p className="text-[#FAF8F5]/90 text-sm font-medium leading-relaxed">
                    {recommendation.items.lowerBody}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#0a192f]/60 border border-[#FAF8F5]/15 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#FAF8F5] uppercase tracking-wider">
                    <Zap className="w-4 h-4 text-[#93c5fd]" />
                    Footwear
                  </div>
                  <p className="text-[#FAF8F5]/90 text-sm font-medium leading-relaxed">
                    {recommendation.items.footwear}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#0a192f]/60 border border-[#FAF8F5]/15 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#FAF8F5] uppercase tracking-wider">
                    <CloudSun className="w-4 h-4 text-[#93c5fd]" />
                    Outerwear &amp; Layering
                  </div>
                  <p className="text-[#FAF8F5]/90 text-sm font-medium leading-relaxed">
                    {recommendation.items.outerwear || 'No extra layer needed — keep it clean and minimal.'}
                  </p>
                </div>
              </div>

              {/* Color Palette Section */}
              <div className="space-y-3 relative z-10">
                <h3 className="text-base font-serif font-bold text-[#FAF8F5] flex items-center gap-2">
                  <Palette className="w-4 h-4 text-[#93c5fd]" />
                  Curated Harmonic Palette
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {recommendation.colorPalette.map((color, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleCopyHex(color.hex)}
                      className="group cursor-pointer p-3 rounded-2xl bg-[#0a192f]/60 border border-[#FAF8F5]/15 hover:border-[#FAF8F5]/40 transition-all flex items-center gap-3"
                    >
                      <div
                        className="w-10 h-10 rounded-xl shadow-md border border-[#FAF8F5]/20 shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[#FAF8F5] text-xs font-semibold truncate">{color.name}</p>
                        <p className="text-[#FAF8F5]/60 text-xs font-mono">{color.hex}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accessories Section */}
              <div className="space-y-3 relative z-10">
                <h3 className="text-base font-serif font-bold text-[#FAF8F5] flex items-center gap-2">
                  <Watch className="w-4 h-4 text-[#93c5fd]" />
                  Coordinated Accessories ({selectedGender.toUpperCase()})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recommendation.accessories.map((acc, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-[#0a192f]/60 border border-[#FAF8F5]/15 space-y-1">
                      <span className="text-[10px] uppercase font-mono font-bold text-[#93c5fd] tracking-wider">
                        {acc.category}
                      </span>
                      <h4 className="text-[#FAF8F5] text-sm font-semibold">{acc.name}</h4>
                      <p className="text-[#FAF8F5]/70 text-xs leading-relaxed">{acc.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Rating & Adjustment Module */}
            <div className="rounded-3xl p-6 md:p-8 bg-[#0f254e]/50 border border-[#FAF8F5]/20 shadow-2xl relative space-y-6">
              <div className="flex items-center gap-3 border-b border-[#FAF8F5]/10 pb-4">
                <div className="p-2.5 rounded-xl bg-[#1e3a8a] text-white">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#FAF8F5]">
                    AI Aesthetic Feedback &amp; Custom Adjustments
                  </h3>
                  <p className="text-xs text-[#FAF8F5]/60">
                    Ask Gemini AI for adjustments or submit your custom choices for harmonic critique!
                  </p>
                </div>
              </div>

              <form onSubmit={handleConsultAiOpinion} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-[#FAF8F5]/70 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-[#93c5fd]" />
                      Request Adjustments
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Add an ivory scarf, change pants to selvedge denim..."
                      value={userAdjustment}
                      onChange={(e) => setUserAdjustment(e.target.value)}
                      className="w-full p-3 rounded-2xl bg-[#0a192f] border border-[#FAF8F5]/15 text-white text-xs placeholder:text-[#FAF8F5]/30 focus:outline-none focus:border-[#FAF8F5]/40 resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-[#FAF8F5]/70 flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-[#93c5fd]" />
                      Your Design Opinion
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. I think pairing Royal Blue blazer with Ivory chinos is best for an evening gala..."
                      value={userOpinion}
                      onChange={(e) => setUserOpinion(e.target.value)}
                      className="w-full p-3 rounded-2xl bg-[#0a192f] border border-[#FAF8F5]/15 text-white text-xs placeholder:text-[#FAF8F5]/30 focus:outline-none focus:border-[#FAF8F5]/40 resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingOpinion || (!userOpinion.trim() && !userAdjustment.trim())}
                  className="w-full py-3 rounded-xl bg-[#FAF8F5] hover:bg-white text-[#0a192f] font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmittingOpinion ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#1e3a8a]" />
                      <span>Evaluating Harmonic Fit...</span>
                    </>
                  ) : (
                    <>
                      <Award className="w-4 h-4 text-[#1e3a8a]" />
                      <span>Rate My Choice &amp; Apply AI Adjustments</span>
                    </>
                  )}
                </button>
              </form>

              {aiRatingData && (
                <div className="p-5 rounded-2xl bg-[#0a192f]/80 border border-[#FAF8F5]/20 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#FAF8F5]/10 pb-3">
                    <h4 className="text-base font-serif font-bold text-[#FAF8F5]">
                      {aiRatingData.rating.verdict}
                    </h4>
                    <div className="flex items-center gap-2 bg-[#1e3a8a]/40 px-3 py-1 rounded-full border border-[#FAF8F5]/20">
                      <Star className="w-4 h-4 text-[#fffff0] fill-[#fffff0]" />
                      <span className="font-mono text-sm font-bold text-white">{aiRatingData.rating.overallScore} / 100</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-[#050d1a] border border-[#FAF8F5]/10 space-y-1">
                      <p className="font-bold text-[#FAF8F5]">Design Strengths</p>
                      <ul className="space-y-0.5 text-[#FAF8F5]/70">
                        {aiRatingData.aiCritique.strengths.map((str, idx) => (
                          <li key={idx}>• {str}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-xl bg-[#050d1a] border border-[#FAF8F5]/10 space-y-1">
                      <p className="font-bold text-[#93c5fd]">Stylist Counter-Suggestions</p>
                      <ul className="space-y-0.5 text-[#FAF8F5]/70">
                        {aiRatingData.aiCritique.suggestions.map((sug, idx) => (
                          <li key={idx}>• {sug}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
