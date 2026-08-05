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
  CheckCircle2
} from 'lucide-react';
import { OutfitRecommendationResponse } from '@/app/api/outfit-recommendation/route';
import { useCollection } from '@/hooks/useCollection';
import { useRewards } from '@/hooks/useRewards';

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
  onSaveToCollection?: (item: any) => void;
}

export default function OutfitAssistant({ onSaveToCollection }: OutfitAssistantProps) {
  const [occasion, setOccasion] = useState('Casual Day Out');
  const [customOccasion, setCustomOccasion] = useState('');
  const [colorPreference, setColorPreference] = useState('Warm Earth Tones');
  const [customColor, setCustomColor] = useState('');
  const [weather, setWeather] = useState('Mild & Breezy (18°C)');
  const [customWeather, setCustomWeather] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<OutfitRecommendationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

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

      // Award points for using Gemini AI assistant
      rewards.earnPoints('try_suggestion');
    } catch (err: any) {
      console.error(err);
      setError('Failed to generate recommendation. Please try again.');
    } finally {
      setIsLoading(false);
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
      `\n\n💡 Styling Tips:\n` +
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
      tags: [recommendation.mood, occasion, weather],
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
    <div className="w-full max-w-5xl mx-auto space-y-12">
      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
          Powered by Gemini AI
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
          AI Outfit Assistant
        </h1>
        <p className="text-slate-300 text-base md:text-lg leading-relaxed">
          Tell Gemini your event, preferred color palette, and weather. We'll curate a head-to-toe ensemble complete with accessories & expert styling advice.
        </p>
      </div>

      {/* Input Form & Controls */}
      <div className="glass-card rounded-3xl p-6 md:p-8 bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl space-y-8">
        <form onSubmit={handleGenerate} className="space-y-8">
          {/* Section 1: Occasion */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-indigo-200">
              <Calendar className="w-4 h-4 text-indigo-400" />
              1. What's the Occasion?
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
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${
                    occasion === occ && !customOccasion
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 scale-105'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
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
              className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-white/10 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>

          {/* Section 2: Color Preference */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-pink-200">
              <Palette className="w-4 h-4 text-pink-400" />
              2. Preferred Color Palette
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
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${
                    colorPreference === col && !customColor
                      ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/25 scale-105'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
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
              className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-white/10 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all"
            />
          </div>

          {/* Section 3: Weather */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-emerald-200">
              <CloudSun className="w-4 h-4 text-emerald-400" />
              3. Weather & Temperature
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
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${
                    weather === w && !customWeather
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 scale-105'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
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
              className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-white/10 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold text-base shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.01]"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Consulting Gemini AI Stylist...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Outfit Recommendations with Gemini
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
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2">
                    <Compass className="w-3.5 h-3.5" />
                    {recommendation.mood}
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
                  Matching Accessories
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
