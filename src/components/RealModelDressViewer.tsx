// agent-notes: { ctx: "photorealistic real model & clothes viewer with color combinations", deps: ["src/data/realClothesOptions.ts"], state: active, last: "tara@2026-09-09" }

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Bookmark,
  Check,
  Copy,
  ChevronRight,
  ChevronLeft,
  Shirt,
  Scissors,
  Palette,
  Eye,
  Shuffle,
  Tag,
  User,
  Info,
  CheckCircle2,
  Layers,
  ArrowRight,
  MessageSquare,
  Send,
  Star,
} from 'lucide-react';
import {
  RealClothesOption,
  REAL_CLOTHES_OPTIONS,
  getRealClothesOptions,
  ColorSwatch
} from '@/data/realClothesOptions';
import {
  evaluateDressOpinion,
  saveDressOpinion,
  getSavedDressOpinions,
  OPINION_PRESETS,
  DressOpinionResult,
  OpinionPresetId,
} from '@/utils/dressOpinion';

interface RealModelDressViewerProps {
  gender?: 'female' | 'male' | 'unisex';
  initialOptionId?: string;
  selectedOccasion?: string;
  preferredColor?: string;
  onSelectOption?: (option: RealClothesOption) => void;
  onSaveToWardrobe?: (option: RealClothesOption) => void;
  showOptionCarousel?: boolean;
  className?: string;
  compact?: boolean;
}

export default function RealModelDressViewer({
  gender = 'female',
  initialOptionId,
  selectedOccasion,
  preferredColor,
  onSelectOption,
  onSaveToWardrobe,
  showOptionCarousel = true,
  className = '',
  compact = false,
}: RealModelDressViewerProps) {
  const [currentGender, setCurrentGender] = useState<'female' | 'male'>(
    gender === 'male' ? 'male' : 'female'
  );

  // Filter real options for current gender & filters
  const options = useMemo(() => {
    const list = getRealClothesOptions(currentGender, selectedOccasion, preferredColor);
    return list.length > 0 ? list : REAL_CLOTHES_OPTIONS.filter((o) => o.gender === currentGender);
  }, [currentGender, selectedOccasion, preferredColor]);

  // Selected real clothes option
  const [selectedOptionId, setSelectedOptionId] = useState<string>(() => {
    if (initialOptionId) return initialOptionId;
    return options[0]?.id || REAL_CLOTHES_OPTIONS[0].id;
  });

  const selectedOption: RealClothesOption = useMemo(() => {
    return options.find((o) => o.id === selectedOptionId) || options[0] || REAL_CLOTHES_OPTIONS[0];
  }, [options, selectedOptionId]);

  // Active view tab for detailed breakdown
  const [activeTab, setActiveTab] = useState<'palette' | 'pieces' | 'style' | 'opinion'>('palette');
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [savedToast, setSavedToast] = useState(false);

  // User Dress Opinion State
  const [selectedOpinionPreset, setSelectedOpinionPreset] = useState<OpinionPresetId>('love');
  const [userOpinionText, setUserOpinionText] = useState('');
  const [opinionsMap, setOpinionsMap] = useState<Record<string, DressOpinionResult>>({});
  const [opinionToast, setOpinionToast] = useState(false);

  useEffect(() => {
    setOpinionsMap(getSavedDressOpinions());
  }, []);

  // Sync prop changes
  useEffect(() => {
    if (gender === 'male' || gender === 'female') {
      setCurrentGender(gender);
    }
  }, [gender]);

  useEffect(() => {
    if (options.length > 0 && !options.some((o) => o.id === selectedOptionId)) {
      setSelectedOptionId(options[0].id);
    }
  }, [options, selectedOptionId]);

  const handleSelectOption = (option: RealClothesOption) => {
    setSelectedOptionId(option.id);
    onSelectOption?.(option);
  };

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleSave = () => {
    onSaveToWardrobe?.(selectedOption);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const handleSubmitRealOptionOpinion = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const result = evaluateDressOpinion({
      dressId: selectedOption.id,
      dressTitle: selectedOption.title,
      gender: selectedOption.gender,
      rating: selectedOpinionPreset,
      feedback: userOpinionText,
    });
    saveDressOpinion(result);
    setOpinionsMap((prev) => ({ ...prev, [selectedOption.id]: result }));
    setUserOpinionText('');
    setOpinionToast(true);
    setTimeout(() => setOpinionToast(false), 3000);
  };

  const handleShuffle = () => {
    const remaining = options.filter((o) => o.id !== selectedOption.id);
    if (remaining.length > 0) {
      const random = remaining[Math.floor(Math.random() * remaining.length)];
      handleSelectOption(random);
    }
  };

  return (
    <div
      className={`w-full rounded-3xl bg-[#050d1a] border border-[#FAF8F5]/15 shadow-2xl overflow-hidden backdrop-blur-xl ${className}`}
    >
      {/* ===== TOP BAR: REAL MODEL & GENDER CONTROLS ===== */}
      <div className="bg-[#0a192f] border-b border-[#FAF8F5]/15 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <div className="flex items-center gap-1.5">
            <h3 className="font-serif font-bold text-sm sm:text-base text-white tracking-wide">
              Real Model &amp; Authentic Clothes
            </h3>
            <span className="text-[10px] font-mono font-bold bg-[#1e3a8a]/60 text-[#38BDF8] px-2.5 py-0.5 rounded-full border border-[#38BDF8]/30">
              HD Photography
            </span>
          </div>
        </div>

        {/* Gender Toggle + Shuffle Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#050d1a] p-1 rounded-xl border border-[#FAF8F5]/15">
            <button
              onClick={() => setCurrentGender('female')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                currentGender === 'female'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-[#FAF8F5]/60 hover:text-white'
              }`}
            >
              Women
            </button>
            <button
              onClick={() => setCurrentGender('male')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                currentGender === 'male'
                  ? 'bg-[#1e3a8a] text-white shadow-sm'
                  : 'text-[#FAF8F5]/60 hover:text-white'
              }`}
            >
              Men
            </button>
          </div>

          <button
            onClick={handleShuffle}
            title="Try Random Real Clothes Look"
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FAF8F5]/10 hover:bg-[#FAF8F5]/20 text-[#FAF8F5] text-xs font-semibold border border-white/10 transition-all hover:scale-105 active:scale-95"
          >
            <Shuffle className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span className="hidden sm:inline">Next Look</span>
          </button>
        </div>
      </div>

      {/* ===== MAIN STAGE: REAL MODEL PHOTO & COLOR COMBINATIONS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch min-h-[540px]">
        {/* LEFT / CENTER: HIGH-RES REAL MODEL PHOTOGRAPHY (6-7 COLS) */}
        <div className="lg:col-span-6 xl:col-span-7 relative bg-gradient-to-b from-[#0a192f] via-[#050d1a] to-[#020617] overflow-hidden flex items-center justify-center p-3 sm:p-5">
          {/* Subtle Ambient Studio Lighting */}
          <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-[#38BDF8]/10 to-transparent pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#1e3a8a]/20 rounded-full blur-3xl pointer-events-none" />

          {/* Model Card Container */}
          <div className="relative w-full max-w-md aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden border border-white/20 shadow-2xl group">
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedOption.id}
                src={selectedOption.imageUrl}
                alt={selectedOption.title}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
            </AnimatePresence>

            {/* Gradient Overlay for Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050d1a] via-transparent to-black/30 pointer-events-none" />

            {/* Floating Top Badge: Occasion & Harmony */}
            <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10">
              <span className="bg-[#050d1a]/85 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-mono text-[#38BDF8] border border-[#38BDF8]/30 font-semibold shadow-lg">
                {selectedOption.occasion}
              </span>
              <span className="bg-[#050d1a]/85 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono text-[#FDE68A] border border-[#FDE68A]/30 font-semibold shadow-lg">
                {selectedOption.harmonyType}
              </span>
            </div>

            {/* Floating Bottom Card: Real Model Details */}
            <div className="absolute bottom-3 inset-x-3 bg-[#050d1a]/90 backdrop-blur-md p-3.5 rounded-xl border border-white/15 space-y-1.5 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <User className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>{selectedOption.model.name}</span>
                </div>
                <span className="text-[10px] font-mono text-[#FAF8F5]/60">
                  {selectedOption.model.height} • {selectedOption.model.wearingSize}
                </span>
              </div>
              <p className="text-[11px] font-serif text-[#FAF8F5]/90 line-clamp-1 italic">
                &ldquo;{selectedOption.tagline}&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT: REAL COLOR COMBINATIONS & GARMENTS BREAKDOWN (5-6 COLS) */}
        <div className="lg:col-span-6 xl:col-span-5 bg-[#0a192f]/60 p-4 sm:p-6 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#FAF8F5]/15 space-y-4">
          <div className="space-y-4">
            {/* Title & Tagline */}
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#38BDF8] font-bold">
                  Authentic Garment Pairing
                </span>
                <span className="text-[10px] font-mono text-[#FAF8F5]/60">
                  {options.findIndex((o) => o.id === selectedOption.id) + 1} of {options.length} Options
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-[#FAF8F5] tracking-tight mt-0.5">
                {selectedOption.title}
              </h2>
              <p className="text-xs text-[#FAF8F5]/75 mt-1 font-light leading-relaxed">
                {selectedOption.whyItWorks}
              </p>
            </div>

            {/* TAB SELECTOR: PALETTE // PIECES // ADVICE */}
            <div className="flex items-center bg-[#050d1a] p-1 rounded-2xl border border-[#FAF8F5]/15 text-xs">
              <button
                onClick={() => setActiveTab('palette')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl font-bold transition-all text-xs ${
                  activeTab === 'palette'
                    ? 'bg-gradient-to-r from-[#1e3a8a] to-[#38BDF8] text-white shadow-md'
                    : 'text-[#FAF8F5]/70 hover:text-white'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Color Palette</span>
              </button>
              <button
                onClick={() => setActiveTab('pieces')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl font-bold transition-all text-xs ${
                  activeTab === 'pieces'
                    ? 'bg-gradient-to-r from-[#1e3a8a] to-[#38BDF8] text-white shadow-md'
                    : 'text-[#FAF8F5]/70 hover:text-white'
                }`}
              >
                <Shirt className="w-3.5 h-3.5" />
                <span>Real Clothes ({selectedOption.pieces.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('style')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl font-bold transition-all text-xs ${
                  activeTab === 'style'
                    ? 'bg-gradient-to-r from-[#1e3a8a] to-[#38BDF8] text-white shadow-md'
                    : 'text-[#FAF8F5]/70 hover:text-white'
                }`}
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>Fabric &amp; Cut</span>
              </button>
              <button
                onClick={() => setActiveTab('opinion')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl font-bold transition-all text-xs ${
                  activeTab === 'opinion'
                    ? 'bg-gradient-to-r from-[#1e3a8a] to-[#38BDF8] text-white shadow-md'
                    : 'text-[#FAF8F5]/70 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Opinion</span>
              </button>
            </div>

            {/* TAB CONTENT A: COLOR COMBINATION SWATCHES */}
            {activeTab === 'palette' && (
              <div className="space-y-2.5 animate-in fade-in duration-300">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#FAF8F5]/70 px-1">
                  <span>Color Harmony Swatches:</span>
                  <span className="text-[10px] text-[#38BDF8]">Tap swatch to copy hex</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedOption.colorPalette.map((swatch, idx) => {
                    const isCopied = copiedHex === swatch.hex;
                    return (
                      <div
                        key={idx}
                        onClick={() => handleCopyHex(swatch.hex)}
                        className="group cursor-pointer flex items-center gap-3 p-2.5 rounded-xl bg-[#050d1a] border border-[#FAF8F5]/10 hover:border-[#38BDF8]/50 transition-all hover:bg-[#1e3a8a]/20"
                      >
                        {/* Swatch Circle */}
                        <div
                          className="w-8 h-8 rounded-lg border border-white/25 shadow-md shrink-0 flex items-center justify-center"
                          style={{ backgroundColor: swatch.hex }}
                        >
                          {isCopied && <Check className="w-3.5 h-3.5 text-white drop-shadow" />}
                        </div>

                        {/* Details */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white truncate">
                              {swatch.name}
                            </span>
                            <span className="text-[10px] font-mono text-[#38BDF8] group-hover:underline">
                              {isCopied ? 'Copied!' : swatch.hex}
                            </span>
                          </div>
                          <p className="text-[10px] text-[#FAF8F5]/60 truncate">
                            {swatch.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 rounded-xl bg-[#050d1a]/80 border border-white/10 text-[11px] text-[#FAF8F5]/80 space-y-1">
                  <div className="font-bold text-[#FDE68A] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Why This Color Harmony Works</span>
                  </div>
                  <p className="font-light leading-relaxed">
                    {selectedOption.whyItWorks}
                  </p>
                </div>
              </div>
            )}

            {/* TAB CONTENT B: REAL GARMENT PIECES BREAKDOWN */}
            {activeTab === 'pieces' && (
              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin animate-in fade-in duration-300">
                {selectedOption.pieces.map((piece, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-[#050d1a] border border-[#FAF8F5]/10 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full border border-white/30 shrink-0"
                          style={{ backgroundColor: piece.colorHex }}
                          title={piece.colorName}
                        />
                        <h4 className="text-xs font-bold text-white">{piece.name}</h4>
                      </div>
                      <span className="text-[9px] uppercase font-mono bg-[#FAF8F5]/10 px-2 py-0.5 rounded text-[#FAF8F5]/80">
                        {piece.slot}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#FAF8F5]/60 flex items-center justify-between pl-5">
                      <span>{piece.fabric}</span>
                      <span className="font-mono text-[#38BDF8]">{piece.colorName}</span>
                    </div>
                    <p className="text-[10px] text-[#FAF8F5]/70 pl-5 italic">
                      {piece.details}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* TAB CONTENT C: FABRIC & TAILORING ADVICE */}
            {activeTab === 'style' && (
              <div className="space-y-3 p-3 rounded-xl bg-[#050d1a] border border-[#FAF8F5]/10 text-xs text-[#FAF8F5]/80 animate-in fade-in duration-300">
                <div>
                  <span className="text-[10px] font-mono text-[#38BDF8] uppercase font-bold">
                    Fabric Composition &amp; Weight
                  </span>
                  <p className="font-semibold text-white mt-0.5">
                    {selectedOption.fabricSummary}
                  </p>
                </div>

                <div className="border-t border-[#FAF8F5]/10 pt-2">
                  <span className="text-[10px] font-mono text-[#FDE68A] uppercase font-bold">
                    Stylist Tailoring Advice
                  </span>
                  <p className="font-light mt-0.5 leading-relaxed">
                    {selectedOption.stylingAdvice}
                  </p>
                </div>
              </div>
            )}

            {/* TAB CONTENT D: USER DRESS OPINION & FEEDBACK */}
            {activeTab === 'opinion' && (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin animate-in fade-in duration-300">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#FAF8F5]/70">
                  <span className="flex items-center gap-1 text-[#38BDF8]">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Your Opinion on this Dress:</span>
                  </span>
                  <span className="text-[10px] text-amber-300 font-bold">Instant AI Stylist</span>
                </div>

                {/* Preset sentiment selector */}
                <div className="grid grid-cols-2 gap-1.5">
                  {OPINION_PRESETS.map((preset) => {
                    const isSelected = selectedOpinionPreset === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setSelectedOpinionPreset(preset.id)}
                        className={`p-2 rounded-xl text-left transition-all border flex items-center gap-2 ${
                          isSelected
                            ? 'bg-[#1e3a8a] border-[#38BDF8] text-white shadow-sm'
                            : 'bg-[#050d1a] border-[#FAF8F5]/10 text-[#FAF8F5]/70 hover:bg-[#050d1a]/80'
                        }`}
                      >
                        <span className="text-base">{preset.icon}</span>
                        <span className="text-[10px] font-bold line-clamp-1">{preset.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Opinion input */}
                <form onSubmit={handleSubmitRealOptionOpinion} className="space-y-2">
                  <textarea
                    rows={2}
                    value={userOpinionText}
                    onChange={(e) => setUserOpinionText(e.target.value)}
                    placeholder="What do you think of this dress? e.g. Prefer lighter tones, would pair with boots..."
                    className="w-full p-2.5 rounded-xl bg-[#050d1a] border border-[#FAF8F5]/15 text-white text-[11px] placeholder:text-[#FAF8F5]/30 focus:outline-none focus:border-[#38BDF8] resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#38BDF8] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.01] transition-all"
                  >
                    <Send className="w-3 h-3" />
                    <span>Submit Dress Opinion</span>
                  </button>
                </form>

                {opinionToast && (
                  <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-500/30 text-emerald-200 text-[10px] flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Opinion evaluated and saved!</span>
                  </div>
                )}

                {/* Saved opinion feedback */}
                {opinionsMap[selectedOption.id] && (
                  <div className="p-3 rounded-xl bg-[#050d1a] border border-[#38BDF8]/30 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-white flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span>Stylist Evaluation</span>
                      </span>
                      <span className="font-mono text-amber-300 font-bold">
                        Score: {opinionsMap[selectedOption.id].adjustedScore}/100
                      </span>
                    </div>
                    <p className="text-[11px] text-[#FAF8F5]/80 italic">
                      &ldquo;{opinionsMap[selectedOption.id].feedback}&rdquo;
                    </p>
                    <p className="text-[10px] text-[#93c5fd] leading-relaxed">
                      {opinionsMap[selectedOption.id].actionableAdvice}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ACTION BUTTONS: SAVE LOOK & CONFIRMATION */}
          <div className="space-y-2 pt-2 border-t border-[#FAF8F5]/15">
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#38BDF8] text-white font-bold text-xs shadow-lg hover:shadow-[#38BDF8]/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                {savedToast ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Saved to Wardrobe!</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    <span>Save This Real Look</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleCopyHex(selectedOption.colorPalette.map((c) => c.hex).join(', '))}
                className="p-3 rounded-xl bg-[#FAF8F5]/10 hover:bg-[#FAF8F5]/20 text-[#FAF8F5] border border-[#FAF8F5]/15 text-xs font-semibold transition-all"
                title="Copy Full Color Palette Hex Codes"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== BOTTOM STRIP: MORE REAL CLOTHES OPTIONS (CAROUSEL) ===== */}
      {showOptionCarousel && (
        <div className="bg-[#0a192f] border-t border-[#FAF8F5]/15 p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#38BDF8]" />
              <h4 className="text-xs font-serif font-bold text-white tracking-wide">
                More Real Clothes &amp; Color Combinations ({options.length} Outfits Available)
              </h4>
            </div>
            <span className="text-[10px] font-mono text-[#FAF8F5]/60">
              Click any look to view on model
            </span>
          </div>

          {/* Horizontal Scrollable Real Clothes Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {options.map((option) => {
              const isSelected = option.id === selectedOption.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option)}
                  className={`group relative text-left rounded-2xl p-2 border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#1e3a8a]/50 border-[#38BDF8] shadow-lg shadow-[#38BDF8]/20 ring-2 ring-[#38BDF8]/60 scale-[1.02]'
                      : 'bg-[#050d1a] border-[#FAF8F5]/10 hover:border-[#FAF8F5]/30 hover:bg-[#1e3a8a]/20'
                  }`}
                >
                  {/* Miniature Thumbnail */}
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2 bg-black/40">
                    <img
                      src={option.imageUrl}
                      alt={option.title}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    {/* Palette Dots on Thumbnail */}
                    <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center gap-1">
                      {option.colorPalette.slice(0, 3).map((swatch, sIdx) => (
                        <span
                          key={sIdx}
                          className="w-2.5 h-2.5 rounded-full border border-white/40"
                          style={{ backgroundColor: swatch.hex }}
                          title={swatch.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Title & Occasion */}
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-bold text-white line-clamp-1 group-hover:text-[#38BDF8] transition-colors">
                      {option.title}
                    </p>
                    <p className="text-[9px] font-mono text-[#FAF8F5]/60 truncate">
                      {option.occasion}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
