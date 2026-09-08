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
  Lightbulb,
  Camera,
  Ruler,
  Gem,
  CircleDot,
  Briefcase,
  Heart
} from 'lucide-react';
import { OutfitRecommendationResponse } from '@/app/api/outfit-recommendation/route';
import { AiOpinionResponse } from '@/app/api/ai-opinion/route';
import { useCollection } from '@/hooks/useCollection';
import { useRewards } from '@/hooks/useRewards';
import { useAuth } from '@/hooks/useAuth';
import MannequinVisualizer from '@/components/MannequinVisualizer';

const OCCASIONS = [
  'Job Interview & Executive Assessment',
  'Luxury Wedding & Reception Gala',
  'Business Formal & Boardroom',
  'Cocktail Soirée & Gala',
  'Romantic Date Night',
  'Traditional Festive & Indo-Western',
  'Smart Casual & Commuter Chic',
  'Casual Day Out',
  'Streetwear & Gallery Walk',
];

const COLOR_PREFERENCES = [
  'Bespoke Midnight Navy & Ivory',
  'Executive Charcoal & Powder Blue',
  'Emerald Silk & Warm Sand',
  'Burgundy Merlot & Soft Cream',
  'Tuscan Camel & Navy Accent',
  'Monochrome Black Tie Noir & Silver',
  'Earth Tones: Terracotta & Olive',
  'Pastel Lavender & Pearl Silk',
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
          Complete head-to-toe styling — covering wardrobe cuts, accessories, entrance presence tips, and live AI design ratings.
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
                <span>Generate Curated Look</span>
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
                {(() => {
                  const combined = `${recommendation.title} ${recommendation.items?.upperBody || ''}`.toLowerCase();
                  let topType: 'shirt' | 'kurti' | 'kurta' | 'saree' | 'gown' | 'blazer' | 'top' = 'gown';
                  let bottomType: 'jeans' | 'trousers' | 'salwar_bottom' | 'skirt' | 'chinos' | 'gown_skirt' = 'gown_skirt';

                  if (selectedGender === 'male') {
                    if (combined.includes('kurta') || combined.includes('bandhgala') || combined.includes('ethnic')) {
                      topType = 'kurta';
                      bottomType = 'salwar_bottom';
                    } else if (combined.includes('suit') || combined.includes('blazer') || combined.includes('tuxedo')) {
                      topType = 'blazer';
                      bottomType = 'trousers';
                    } else {
                      topType = 'shirt';
                      bottomType = 'chinos';
                    }
                  } else {
                    if (combined.includes('saree') || combined.includes('sari')) {
                      topType = 'saree';
                      bottomType = 'skirt';
                    } else if (combined.includes('kurti') || combined.includes('salwar')) {
                      topType = 'kurti';
                      bottomType = 'salwar_bottom';
                    } else if (combined.includes('blazer') || combined.includes('suit')) {
                      topType = 'blazer';
                      bottomType = 'trousers';
                    } else if (combined.includes('skirt') || combined.includes('blouse')) {
                      topType = 'top';
                      bottomType = 'skirt';
                    } else {
                      topType = 'gown';
                      bottomType = 'gown_skirt';
                    }
                  }

                  return (
                    <MannequinVisualizer
                      gender={selectedGender === 'male' ? 'male' : 'female'}
                      outfit={{
                        title: recommendation.title,
                        topType,
                        topColor: recommendation.colorPalette[0]?.hex || '#0F172A',
                        bottomType,
                        bottomColor: recommendation.colorPalette[1]?.hex || '#FAF8F5',
                        outerwearColor: recommendation.colorPalette[2]?.hex,
                        accentColor: recommendation.colorPalette[3]?.hex || '#D4AF37',
                        description: recommendation.overview,
                      }}
                      showControls={true}
                    />
                  );
                })()}
              </div>

              {/* Real Human Model Editorial Reference Showcase */}
              {recommendation.realHumanModel && (
                <div className="relative z-10 p-6 rounded-3xl bg-[#0a192f]/80 border border-[#FAF8F5]/15 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#FAF8F5]/10 pb-3">
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-[#38BDF8]" />
                      <h3 className="font-serif font-bold text-base text-white">
                        Real Human Model Editorial Look
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-[#FAF8F5]/70 bg-[#050d1a] px-3 py-1 rounded-full border border-white/10">
                      Source: {recommendation.realHumanModel.editorialSource}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-4 rounded-2xl overflow-hidden shadow-2xl border border-white/10 aspect-[3/4] relative">
                      <img
                        src={recommendation.realHumanModel.imageUrl}
                        alt={recommendation.realHumanModel.title}
                        className="w-full h-full object-cover object-top"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-transparent to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2 text-center bg-[#0a192f]/80 backdrop-blur-xs py-1 rounded-xl text-[10px] font-mono text-[#93c5fd]">
                        {recommendation.realHumanModel.lookAngle}
                      </div>
                    </div>

                    <div className="md:col-span-8 space-y-3">
                      <div>
                        <span className="text-[10px] uppercase font-mono text-[#93c5fd] font-bold">
                          Dress Wear Style &amp; Cut Model
                        </span>
                        <h4 className="text-base font-serif font-bold text-white">
                          {recommendation.dressWearStyle || recommendation.title}
                        </h4>
                        <p className="text-xs text-[#FAF8F5]/80 leading-relaxed font-light mt-1">
                          Model Cut: {recommendation.dressModel || 'Tailored Regular Silhouette'}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        <div className="p-2.5 rounded-xl bg-[#050d1a] border border-white/10">
                          <span className="text-[10px] text-[#FAF8F5]/60 block uppercase">Model Height</span>
                          <span className="text-white font-bold">{recommendation.realHumanModel.modelHeight}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#050d1a] border border-white/10">
                          <span className="text-[10px] text-[#FAF8F5]/60 block uppercase">Size Tailoring</span>
                          <span className="text-white font-bold">{recommendation.realHumanModel.modelWearing}</span>
                        </div>
                      </div>

                      {/* Occasion Mastery Guidance (Interview / Wedding Advice) */}
                      {recommendation.interviewAdvice && (
                        <div className="p-3.5 rounded-2xl bg-[#050d1a] border border-[#38BDF8]/30 space-y-1">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-[#38BDF8]">
                            <Briefcase className="w-3.5 h-3.5" />
                            <span>Job Interview Mastery Advice</span>
                          </div>
                          <p className="text-[11px] text-[#FAF8F5]/90 leading-relaxed">
                            {recommendation.interviewAdvice}
                          </p>
                        </div>
                      )}

                      {recommendation.weddingAdvice && (
                        <div className="p-3.5 rounded-2xl bg-[#050d1a] border border-rose-400/30 space-y-1">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-300">
                            <Heart className="w-3.5 h-3.5" />
                            <span>Wedding Celebration &amp; Etiquette Guide</span>
                          </div>
                          <p className="text-[11px] text-[#FAF8F5]/90 leading-relaxed">
                            {recommendation.weddingAdvice}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Complete 5-Piece Accessory Suite */}
              {recommendation.accessoriesSuite && (
                <div className="relative z-10 p-6 rounded-3xl bg-[#0a192f]/70 border border-[#FAF8F5]/15 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white font-serif font-bold text-base">
                      <Watch className="w-4 h-4 text-[#93c5fd]" />
                      <span>Complete Coordinated Accessories Suite</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#D4AF37] font-bold">
                      Harmonized Hardware Finishes
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    {/* Shoe */}
                    <div className="p-3 rounded-2xl bg-[#050d1a] border border-[#FAF8F5]/10 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        <Footprints className="w-3.5 h-3.5 text-[#38BDF8]" />
                        <span>Footwear: {recommendation.accessoriesSuite.shoe?.name}</span>
                      </div>
                      <p className="text-[10px] font-mono text-[#93c5fd]">
                        Finish: {recommendation.accessoriesSuite.shoe?.finish}
                      </p>
                      <p className="text-[11px] text-[#FAF8F5]/70 leading-relaxed">
                        {recommendation.accessoriesSuite.shoe?.advice}
                      </p>
                    </div>

                    {/* Watch */}
                    <div className="p-3 rounded-2xl bg-[#050d1a] border border-[#FAF8F5]/10 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        <Watch className="w-3.5 h-3.5 text-amber-400" />
                        <span>Timepiece: {recommendation.accessoriesSuite.watch?.name}</span>
                      </div>
                      <p className="text-[10px] font-mono text-[#D4AF37]">
                        Finish: {recommendation.accessoriesSuite.watch?.finish}
                      </p>
                      <p className="text-[11px] text-[#FAF8F5]/70 leading-relaxed">
                        {recommendation.accessoriesSuite.watch?.advice}
                      </p>
                    </div>

                    {/* Ring */}
                    <div className="p-3 rounded-2xl bg-[#050d1a] border border-[#FAF8F5]/10 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        <Gem className="w-3.5 h-3.5 text-purple-400" />
                        <span>Ring: {recommendation.accessoriesSuite.ring?.name}</span>
                      </div>
                      <p className="text-[10px] font-mono text-purple-300">
                        Finish: {recommendation.accessoriesSuite.ring?.finish}
                      </p>
                      <p className="text-[11px] text-[#FAF8F5]/70 leading-relaxed">
                        {recommendation.accessoriesSuite.ring?.advice}
                      </p>
                    </div>

                    {/* Chain / Necklace */}
                    <div className="p-3 rounded-2xl bg-[#050d1a] border border-[#FAF8F5]/10 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        <CircleDot className="w-3.5 h-3.5 text-rose-400" />
                        <span>Chain: {recommendation.accessoriesSuite.chain?.name}</span>
                      </div>
                      <p className="text-[10px] font-mono text-rose-300">
                        Finish: {recommendation.accessoriesSuite.chain?.finish}
                      </p>
                      <p className="text-[11px] text-[#FAF8F5]/70 leading-relaxed">
                        {recommendation.accessoriesSuite.chain?.advice}
                      </p>
                    </div>

                    {/* Bracelet */}
                    <div className="p-3 rounded-2xl bg-[#050d1a] border border-[#FAF8F5]/10 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Bracelet: {recommendation.accessoriesSuite.bracelet?.name}</span>
                      </div>
                      <p className="text-[10px] font-mono text-emerald-300">
                        Finish: {recommendation.accessoriesSuite.bracelet?.finish}
                      </p>
                      <p className="text-[11px] text-[#FAF8F5]/70 leading-relaxed">
                        {recommendation.accessoriesSuite.bracelet?.advice}
                      </p>
                    </div>

                    {/* Bag / Folio */}
                    {recommendation.accessoriesSuite.bag && (
                      <div className="p-3 rounded-2xl bg-[#050d1a] border border-[#FAF8F5]/10 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-white">
                          <Bookmark className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Bag: {recommendation.accessoriesSuite.bag.name}</span>
                        </div>
                        <p className="text-[10px] font-mono text-indigo-300">
                          Finish: {recommendation.accessoriesSuite.bag.finish}
                        </p>
                        <p className="text-[11px] text-[#FAF8F5]/70 leading-relaxed">
                          {recommendation.accessoriesSuite.bag.advice}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Fabric & Size Opinion Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 text-xs">
                {/* Fabric Intelligence */}
                {recommendation.fabricIntelligence && (
                  <div className="p-5 rounded-3xl bg-[#0a192f]/70 border border-[#FAF8F5]/15 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-sm text-white flex items-center gap-1.5">
                        <Shirt className="w-4 h-4 text-[#93c5fd]" />
                        Fabric &amp; Material Science
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        Breathability: {recommendation.fabricIntelligence.breathability}
                      </span>
                    </div>
                    <h5 className="font-bold text-white">{recommendation.fabricIntelligence.fabricName}</h5>
                    <p className="text-[#FAF8F5]/80 leading-relaxed font-light">
                      {recommendation.fabricIntelligence.texture}
                    </p>
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-[#FAF8F5]/60">
                      <span>Weight: {recommendation.fabricIntelligence.drapeAndWeight}</span>
                      <span>Care: {recommendation.fabricIntelligence.careInstructions}</span>
                    </div>
                  </div>
                )}

                {/* Size & Fit Opinion */}
                {recommendation.sizeAndFitOpinion && (
                  <div className="p-5 rounded-3xl bg-[#0a192f]/70 border border-[#FAF8F5]/15 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-sm text-white flex items-center gap-1.5">
                        <Ruler className="w-4 h-4 text-[#93c5fd]" />
                        Size &amp; Fit Recommendations
                      </span>
                      <span className="text-[10px] font-mono text-[#FAF8F5] bg-[#1e3a8a]/60 px-2 py-0.5 rounded-full border border-white/20 uppercase font-bold">
                        Fit: {recommendation.sizeAndFitOpinion.recommendedFit}
                      </span>
                    </div>
                    <p className="text-[#FAF8F5]/80 leading-relaxed font-light">
                      {recommendation.sizeAndFitOpinion.fitRationale}
                    </p>
                    <div className="pt-1 text-[11px] space-y-1 font-mono text-[#93c5fd]">
                      <p>&bull; Shoulders: {recommendation.sizeAndFitOpinion.shouldersAndCuffs}</p>
                      <p>&bull; Trouser Break: {recommendation.sizeAndFitOpinion.trouserBreak}</p>
                    </div>
                  </div>
                )}
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
