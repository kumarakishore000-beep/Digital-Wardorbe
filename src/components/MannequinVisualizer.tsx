'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ZoomIn,
  ZoomOut,
  Check,
  Layers,
  Sliders,
  Bookmark,
  RefreshCw,
  CheckCircle2,
  Lock,
  Wand2,
  Shirt,
} from 'lucide-react';
import { Gender, useAuth } from '@/hooks/useAuth';
import { useCollection } from '@/hooks/useCollection';
import { useRewards } from '@/hooks/useRewards';
import LoginModal from '@/components/LoginModal';
import { ClothSuggestionResponse } from '@/app/api/cloth-suggestion/route';

export type SkinTone =
  | 'soft_ivory'
  | 'warm_almond'
  | 'golden_olive'
  | 'bronze_tan'
  | 'rich_espresso'
  | 'deep_ebony'
  | 'black'
  | 'brown'
  | 'white';

export interface OutfitConfig {
  title?: string;
  topType:
  | 'shirt'
  | 'tshirt'
  | 'kurti'
  | 'kurta'
  | 'saree'
  | 'salwar'
  | 'top'
  | 'croptop'
  | 'gown'
  | 'shrug'
  | 'blazer'
  | 'jacket'
  | 'skirt';
  topColor: string;
  bottomType:
  | 'jeans'
  | 'trousers'
  | 'salwar_bottom'
  | 'skirt'
  | 'chinos'
  | 'tracks'
  | 'gown_skirt';
  bottomColor: string;
  outerwearColor?: string;
  accentColor?: string;
  description?: string;
}

interface MannequinVisualizerProps {
  gender?: Gender;
  onGenderChange?: (gender: Gender) => void;
  outfit?: OutfitConfig;
  className?: string;
  showControls?: boolean;
  onGarmentChange?: (newOutfit: OutfitConfig) => void;
  onSaveOutfit?: (outfit: OutfitConfig) => void;
}

interface SkinToneDetails {
  label: string;
  base: string;
  highlight: string;
  shadow: string;
  icon: string;
}

export const SKIN_TONES: Record<SkinTone, SkinToneDetails> = {
  soft_ivory: {
    label: 'Soft Ivory',
    base: '#FFE0BD',
    highlight: '#FFF2E4',
    shadow: '#D9AA85',
    icon: '🏻',
  },
  warm_almond: {
    label: 'Warm Almond',
    base: '#F3C096',
    highlight: '#FCEAD8',
    shadow: '#CA9165',
    icon: '🏼',
  },
  golden_olive: {
    label: 'Golden Olive',
    base: '#D89C67',
    highlight: '#ECC299',
    shadow: '#AD7140',
    icon: '🏽',
  },
  bronze_tan: {
    label: 'Deep Bronze',
    base: '#B27344',
    highlight: '#CE9466',
    shadow: '#884C23',
    icon: '🏽',
  },
  rich_espresso: {
    label: 'Rich Espresso',
    base: '#6B4126',
    highlight: '#895A3B',
    shadow: '#492914',
    icon: '🏾',
  },
  deep_ebony: {
    label: 'Deep Ebony',
    base: '#3B2219',
    highlight: '#563629',
    shadow: '#21110A',
    icon: '🏿',
  },
  white: {
    label: 'Fair Sand',
    base: '#FFE0BD',
    highlight: '#FFF2E4',
    shadow: '#D9AA85',
    icon: '🏻',
  },
  brown: {
    label: 'Warm Bronze',
    base: '#B27344',
    highlight: '#CE9466',
    shadow: '#884C23',
    icon: '🏽',
  },
  black: {
    label: 'Deep Ebony',
    base: '#3B2219',
    highlight: '#563629',
    shadow: '#21110A',
    icon: '🏿',
  },
};

export interface GarmentSilhouette {
  id: string;
  key: OutfitConfig['topType'];
  title: string;
  category: string;
  gender: 'female' | 'male' | 'both';
  suggestedBottom: OutfitConfig['bottomType'];
  defaultTopColor: string;
  defaultBottomColor: string;
  description: string;
}

export const SILHOUETTES: GarmentSilhouette[] = [
  {
    id: 'w-gown',
    key: 'gown',
    title: 'Silk Gala Evening Gown',
    category: 'Haute Couture',
    gender: 'female',
    suggestedBottom: 'gown_skirt',
    defaultTopColor: '#1E3A8A',
    defaultBottomColor: '#1E3A8A',
    description: 'Floor-length sculpted gala gown with gold waist cinnabar belt.',
  },
  {
    id: 'w-saree',
    key: 'saree',
    title: 'Heritage Silk Saree',
    category: 'Ethnic Festive',
    gender: 'female',
    suggestedBottom: 'skirt',
    defaultTopColor: '#1E3A8A',
    defaultBottomColor: '#FAF8F5',
    description: 'Mulberry silk saree with gold zari border flowing across shoulder.',
  },
  {
    id: 'w-kurti',
    key: 'kurti',
    title: 'Chanderi Silk Kurti',
    category: 'Ethnic Fusion',
    gender: 'female',
    suggestedBottom: 'salwar_bottom',
    defaultTopColor: '#1E3A8A',
    defaultBottomColor: '#FAF8F5',
    description: 'Side-slit silk tunic paired with tailored fluid bottoms.',
  },
  {
    id: 'w-blazer',
    key: 'blazer',
    title: 'Tailored Power Blazer',
    category: 'Executive Suiting',
    gender: 'female',
    suggestedBottom: 'trousers',
    defaultTopColor: '#1E3A8A',
    defaultBottomColor: '#0A192F',
    description: 'Structured sharp blazer with tailored contour and pocket accents.',
  },
  {
    id: 'w-skirt',
    key: 'top',
    title: 'Silk Blouse & Pleated Skirt',
    category: 'Cocktail Chic',
    gender: 'female',
    suggestedBottom: 'skirt',
    defaultTopColor: '#FAF8F5',
    defaultBottomColor: '#1E3A8A',
    description: 'Woven silk blouse paired with high-waist accordion pleated skirt.',
  },
  {
    id: 'm-suit',
    key: 'blazer',
    title: 'Bespoke Tailored Suit',
    category: 'Executive Suiting',
    gender: 'male',
    suggestedBottom: 'trousers',
    defaultTopColor: '#1E3A8A',
    defaultBottomColor: '#1E3A8A',
    description: 'Structured two-piece tailored jacket with sharp peak lapels and trousers.',
  },
  {
    id: 'm-kurta',
    key: 'kurta',
    title: 'Bandhgala Ethnic Kurta',
    category: 'Royal Ethnic',
    gender: 'male',
    suggestedBottom: 'salwar_bottom',
    defaultTopColor: '#1E3A8A',
    defaultBottomColor: '#FAF8F5',
    description: 'Bandhgala raw silk kurta with gold button placket and churidar bottom.',
  },
  {
    id: 'm-shirt',
    key: 'shirt',
    title: 'Oxford Shirt & Chinos',
    category: 'Smart Casual',
    gender: 'male',
    suggestedBottom: 'chinos',
    defaultTopColor: '#FAF8F5',
    defaultBottomColor: '#1E3A8A',
    description: 'Crisp woven cotton shirt with point collar and tailored chinos.',
  },
  {
    id: 'm-shrug',
    key: 'shrug',
    title: 'Knit Cardigan & Denim',
    category: 'Urban Layered',
    gender: 'male',
    suggestedBottom: 'jeans',
    defaultTopColor: '#1E3A8A',
    defaultBottomColor: '#0F254E',
    description: 'Fine-spun knit cardigan layered over dark selvedge denim.',
  },
];

export default function MannequinVisualizer({
  gender = 'female',
  onGenderChange,
  outfit,
  className = '',
  showControls = true,
  onGarmentChange,
  onSaveOutfit,
}: MannequinVisualizerProps) {
  const { isAuthenticated } = useAuth();
  const collection = useCollection();
  const rewards = useRewards();

  const [skinTone, setSkinTone] = useState<SkinTone>('golden_olive');
  const [activeGender, setActiveGender] = useState<Gender>(gender);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isWalkInActive, setIsWalkInActive] = useState(false);
  const [fitStyle, setFitStyle] = useState<'slim' | 'regular' | 'oversized'>('regular');
  const [mannequinForm, setMannequinForm] = useState<'human' | 'dress_form'>('human');
  
  // Local outfit override when user clicks silhouettes
  const [localOutfit, setLocalOutfit] = useState<OutfitConfig | null>(null);

  const [isAiSuggesting, setIsAiSuggesting] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<ClothSuggestionResponse | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync parent gender
  useEffect(() => {
    setActiveGender(gender);
    setLocalOutfit(null);
  }, [gender]);

  // Sync parent outfit
  useEffect(() => {
    if (outfit) {
      setLocalOutfit(null);
    }
  }, [outfit]);

  const handleGenderToggle = (newGender: Gender) => {
    setActiveGender(newGender);
    setLocalOutfit(null);
    onGenderChange?.(newGender);
    setAiSuggestion(null);
  };

  const skin = SKIN_TONES[skinTone] || SKIN_TONES.golden_olive;

  // Active outfit configuration (Local override > prop outfit > default)
  const activeOutfit: OutfitConfig = localOutfit || outfit || (activeGender === 'male'
    ? {
      title: 'Signature Tailored Suit',
      topType: 'blazer',
      topColor: '#1E3A8A',
      bottomType: 'trousers',
      bottomColor: '#1E3A8A',
      outerwearColor: '#FAF8F5',
      accentColor: '#D4A343',
      description: 'Structured two-piece tailored jacket with sharp lapels.',
    }
    : {
      title: 'Silk Gala Evening Gown',
      topType: 'gown',
      topColor: '#1E3A8A',
      bottomType: 'gown_skirt',
      bottomColor: '#1E3A8A',
      accentColor: '#D4A343',
      description: 'Sculpted floor-length silk gala gown with gold waist accents.',
    });

  const availableSilhouettes = SILHOUETTES.filter(
    (g) => g.gender === activeGender || g.gender === 'both'
  );

  const handleSelectSilhouette = (sil: GarmentSilhouette) => {
    const updatedOutfit: OutfitConfig = {
      title: sil.title,
      topType: sil.key,
      topColor: activeOutfit.topColor || sil.defaultTopColor,
      bottomType: sil.suggestedBottom,
      bottomColor: activeOutfit.bottomColor || sil.defaultBottomColor,
      accentColor: activeOutfit.accentColor || '#D4A343',
      description: sil.description,
    };
    setLocalOutfit(updatedOutfit);
    onGarmentChange?.(updatedOutfit);
  };

  const handleFetchAiSuggestion = async () => {
    setIsAiSuggesting(true);
    setAiSuggestion(null);

    try {
      const response = await fetch('/api/cloth-suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gender: activeGender,
          occasion: 'Formal Gala & Evening Event',
          weather: 'Mild Breezy',
          colorPreference: activeOutfit.topColor,
          skinTone: skin.label,
        }),
      });

      if (response.ok) {
        const data: ClothSuggestionResponse = await response.json();
        setAiSuggestion(data);

        const newOutfitConfig: OutfitConfig = {
          title: data.title,
          topType: (data.suggestedClothKey || 'blazer') as OutfitConfig['topType'],
          topColor: data.recommendedTopColor || '#1E3A8A',
          bottomType: 'trousers',
          bottomColor: data.recommendedBottomColor || '#FAF8F5',
          accentColor: data.recommendedAccentColor || '#D4A343',
          description: data.aiStylistRationale,
        };
        setLocalOutfit(newOutfitConfig);
        onGarmentChange?.(newOutfitConfig);
        rewards.earnPoints('try_suggestion');
      }
    } catch (err) {
      console.error('AI suggestion failed:', err);
    } finally {
      setIsAiSuggesting(false);
    }
  };

  const handleSaveOutfitClick = () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    const outfitItem = {
      id: Date.now().toString(),
      name: activeOutfit.title || 'Curated Outfit Look',
      category: 'Other' as const,
      color: activeOutfit.topColor,
      tags: [activeGender, activeOutfit.topType, activeOutfit.bottomType],
      notes: activeOutfit.description || 'Draped on interactive studio mannequin',
      createdAt: new Date().toISOString(),
    };
    collection.addItem(outfitItem);
    rewards.earnPoints('add_to_collection');
    onSaveOutfit?.(activeOutfit);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const topColor = activeOutfit.topColor || '#1E3A8A';
  const bottomColor = activeOutfit.bottomColor || '#FAF8F5';
  const accentColor = activeOutfit.accentColor || '#D4A343';
  const outerwearColor = activeOutfit.outerwearColor || '#0A192F';

  return (
    <div className={`w-full flex flex-col items-center select-none text-[#FAF8F5] ${className}`}>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        title="Sign In to Save Look"
        message="Sign in to save this complete curated outfit to your digital wardrobe collection."
      />

      {/* TOP CONTROLS & SKIN TONE BAR */}
      {showControls && (
        <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-4 z-10 relative">
          {/* Gender Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#050d1a] rounded-2xl border border-[#FAF8F5]/15">
            <button
              onClick={() => handleGenderToggle('female')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeGender === 'female'
                  ? 'bg-[#FAF8F5] text-[#0a192f] shadow-md font-bold'
                  : 'text-[#FAF8F5]/60 hover:text-white'
              }`}
            >
              <span>👗</span>
              <span>Women</span>
            </button>
            <button
              onClick={() => handleGenderToggle('male')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeGender === 'male'
                  ? 'bg-[#FAF8F5] text-[#0a192f] shadow-md font-bold'
                  : 'text-[#FAF8F5]/60 hover:text-white'
              }`}
            >
              <span>👔</span>
              <span>Men</span>
            </button>
          </div>

          {/* Model Form Selector: Human vs Dress Form */}
          <div className="flex items-center bg-[#050d1a] p-1 rounded-2xl border border-[#FAF8F5]/15 text-xs">
            <button
              onClick={() => setMannequinForm('human')}
              className={`px-2.5 py-1 rounded-xl font-semibold transition-all ${
                mannequinForm === 'human'
                  ? 'bg-[#1e3a8a] text-white shadow-sm font-bold'
                  : 'text-[#FAF8F5]/60 hover:text-white'
              }`}
            >
              Human Model
            </button>
            <button
              onClick={() => setMannequinForm('dress_form')}
              className={`px-2.5 py-1 rounded-xl font-semibold transition-all ${
                mannequinForm === 'dress_form'
                  ? 'bg-[#1e3a8a] text-white shadow-sm font-bold'
                  : 'text-[#FAF8F5]/60 hover:text-white'
              }`}
            >
              Atelier Form
            </button>
          </div>

          {/* Skin Tone Selector (only for Human Model) */}
          {mannequinForm === 'human' && (
            <div className="flex items-center gap-1.5 bg-[#050d1a] p-1 rounded-2xl border border-[#FAF8F5]/15">
              {(['soft_ivory', 'warm_almond', 'golden_olive', 'bronze_tan', 'rich_espresso', 'deep_ebony'] as SkinTone[]).map((toneKey) => (
                <button
                  key={toneKey}
                  onClick={() => setSkinTone(toneKey)}
                  title={SKIN_TONES[toneKey].label}
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                    skinTone === toneKey
                      ? 'ring-2 ring-[#FAF8F5] scale-110 shadow-md'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: SKIN_TONES[toneKey].base }}
                >
                  {skinTone === toneKey && <Check className="w-3 h-3 text-[#0a192f] stroke-[3]" />}
                </button>
              ))}
            </div>
          )}

          {/* View Toggles & Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsWalkInActive(!isWalkInActive)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                isWalkInActive
                  ? 'bg-[#FAF8F5] text-[#0a192f] border-white shadow-lg animate-pulse'
                  : 'bg-[#0a192f] text-[#FAF8F5]/70 border-[#FAF8F5]/15 hover:bg-[#16366f]/40'
              }`}
            >
              <span>🏃‍♂️</span>
              <span>{isWalkInActive ? 'Active Walk' : 'Runway Walk'}</span>
            </button>

            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="p-2 rounded-xl bg-[#0a192f] text-[#FAF8F5]/70 hover:text-white transition-colors border border-[#FAF8F5]/15"
              title={isZoomed ? 'Zoom Out' : 'Zoom In'}
            >
              {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* QUICK SILHOUETTE SELECTOR STRIP */}
      {showControls && (
        <div className="w-full mb-4 z-10 relative space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-[#FAF8F5]/70">
            <span className="flex items-center gap-1.5 font-bold uppercase text-[#93c5fd]">
              <Layers className="w-3.5 h-3.5" />
              Interactive Silhouette Draping
            </span>
            <span>Click any style to dress mannequin</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {availableSilhouettes.map((sil) => {
              const isSelected = activeOutfit.topType === sil.key && (activeOutfit.title === sil.title || !localOutfit);
              return (
                <button
                  key={sil.id}
                  onClick={() => handleSelectSilhouette(sil)}
                  className={`group relative shrink-0 px-3 py-2 rounded-xl border transition-all text-left flex items-center gap-2 ${
                    isSelected
                      ? 'border-[#FAF8F5] bg-[#FAF8F5] text-[#0a192f] shadow-md scale-105 font-bold'
                      : 'border-[#FAF8F5]/15 bg-[#0a192f]/70 text-[#FAF8F5] hover:bg-[#16366f]/40'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-black/20 shrink-0"
                    style={{ backgroundColor: isSelected ? topColor : sil.defaultTopColor }}
                  />
                  <div className="overflow-hidden">
                    <p className="text-xs truncate max-w-[120px]">{sil.title}</p>
                    <p className={`text-[9px] uppercase font-mono ${isSelected ? 'text-[#1e3a8a]' : 'text-[#FAF8F5]/60'}`}>{sil.category}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* GEMINI AI ASSISTANT BANNER */}
      {showControls && (
        <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-4 p-3 rounded-2xl bg-[#0f254e]/60 border border-[#FAF8F5]/15 z-10 relative">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#1e3a8a] text-white">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                AI Mannequin Stylist
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#1e3a8a]/40 text-[#93c5fd] font-mono border border-[#FAF8F5]/20">
                  Gemini Flash
                </span>
              </h4>
              <p className="text-[11px] text-[#FAF8F5]/70">
                Auto-generate harmonic draping and color proportions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleFetchAiSuggestion}
              disabled={isAiSuggesting}
              className="px-3.5 py-1.5 rounded-xl bg-[#1e3a8a] hover:bg-[#2563eb] text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {isAiSuggesting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Draping...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#fffff0]" />
                  <span>AI Styling Suggestion</span>
                </>
              )}
            </button>

            <button
              onClick={handleSaveOutfitClick}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                savedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#FAF8F5] hover:bg-white text-[#0a192f] shadow-md'
              }`}
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5 text-[#1e3a8a]" />
                  <span>Save Look</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* AI SUGGESTION FEEDBACK CARD */}
      <AnimatePresence>
        {aiSuggestion && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full mb-4 p-3.5 rounded-2xl bg-[#0a192f] border border-[#FAF8F5]/20 text-xs space-y-1.5 z-10 relative"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#93c5fd] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
                Gemini Style Advice: {aiSuggestion.title}
              </span>
              <span className="text-[10px] text-[#fffff0] font-mono px-2 py-0.5 rounded-full bg-[#1e3a8a]/50">
                Fit: {aiSuggestion.fitRecommendation.toUpperCase()}
              </span>
            </div>
            <p className="text-[#FAF8F5]/80 leading-relaxed text-[11px]">{aiSuggestion.aiStylistRationale}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* CORE INTERACTIVE MANNEQUIN VISUALIZATION CANVAS           */}
      {/* ========================================================= */}
      <div className="relative w-full flex items-center justify-center py-2">
        <motion.div
          key="vector_mannequin"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={
            isWalkInActive
              ? { scale: [1, 1.02, 1], y: [0, -6, 0] }
              : { scale: isZoomed ? 1.15 : 1 }
          }
          transition={
            isWalkInActive
              ? { repeat: Infinity, duration: 2, ease: 'easeInOut' }
              : { type: 'spring', stiffness: 200, damping: 20 }
          }
          className="relative w-80 h-[500px] rounded-3xl overflow-hidden border border-[#FAF8F5]/20 shadow-2xl bg-gradient-to-b from-[#0f254e] via-[#0a192f] to-[#050d1a] flex flex-col items-center justify-center p-4 group"
        >
          {/* Spotlight Ambient Radial Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,_rgba(30,58,138,0.4)_0%,_rgba(10,25,47,0.95)_100%)] pointer-events-none" />

          {/* DYNAMIC VECTOR MANNEQUIN & CLOTHING DRAPING SVG */}
          <div
            className="relative w-full h-full flex flex-col items-center justify-center transition-all duration-300 z-10"
            style={{
              transform: `scale(${fitStyle === 'slim' ? 0.94 : fitStyle === 'oversized' ? 1.06 : 1})`,
            }}
          >
            <svg
              className="w-64 h-[440px] drop-shadow-2xl"
              viewBox="0 0 240 440"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Skin Gradient */}
                <linearGradient id={`mannequinSkin-${skinTone}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={skin.highlight} />
                  <stop offset="50%" stopColor={skin.base} />
                  <stop offset="100%" stopColor={skin.shadow} />
                </linearGradient>

                {/* Dress Form Tailor Linen Texture */}
                <linearGradient id="dressFormLinen" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FAF8F5" />
                  <stop offset="60%" stopColor="#EAE3D2" />
                  <stop offset="100%" stopColor="#C8BC9F" />
                </linearGradient>

                {/* Polished Walnut Wooden Finial */}
                <linearGradient id="walnutWood" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B4513" />
                  <stop offset="50%" stopColor="#5C2E0B" />
                  <stop offset="100%" stopColor="#2E1705" />
                </linearGradient>

                {/* Brushed Metal Chrome Stand */}
                <linearGradient id="chromeStand" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#475569" />
                  <stop offset="50%" stopColor="#CBD5E1" />
                  <stop offset="100%" stopColor="#334155" />
                </linearGradient>

                {/* Hair Gradient */}
                <linearGradient id="hairShineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1E293B" />
                  <stop offset="60%" stopColor="#0F172A" />
                  <stop offset="100%" stopColor="#020617" />
                </linearGradient>

                {/* Dynamic Fabric Shading Overlays */}
                <linearGradient id="topFabricGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.25" />
                  <stop offset="50%" stopColor="#000000" stopOpacity="0.0" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
                </linearGradient>

                <linearGradient id="bottomFabricGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.15" />
                  <stop offset="50%" stopColor="#000000" stopOpacity="0.0" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {/* ================================================= */}
              {/* 1. DRESS FORM STAND OR HUMAN BASE                 */}
              {/* ================================================= */}
              {mannequinForm === 'dress_form' ? (
                <g id="dress-form-base">
                  {/* Chrome Central Pole */}
                  <rect x="117" y="160" width="6" height="240" rx="2" fill="url(#chromeStand)" />
                  {/* Tripod Cast Iron Feet */}
                  <path d="M120 400 L80 430 L90 432 L120 406 Z" fill="url(#chromeStand)" />
                  <path d="M120 400 L160 430 L150 432 L120 406 Z" fill="url(#chromeStand)" />
                  <circle cx="120" cy="400" r="7" fill="url(#chromeStand)" />
                  {/* Wooden Neck Finial Cap */}
                  <ellipse cx="120" cy="62" rx="14" ry="8" fill="url(#walnutWood)" />
                  <rect x="116" y="52" width="8" height="12" rx="2" fill="url(#walnutWood)" />
                  <circle cx="120" cy="50" r="6" fill="url(#walnutWood)" />
                  {/* Torso Linen Form */}
                  <path
                    d="M80 84 Q120 92 160 84 L152 185 Q120 195 88 185 Z"
                    fill="url(#dressFormLinen)"
                  />
                  {/* Form Tailor Stitch Lines */}
                  <line x1="120" y1="84" x2="120" y2="190" stroke="#8B7E66" strokeDasharray="3 3" strokeWidth="1.2" />
                  <path d="M88 135 Q120 145 152 135" stroke="#8B7E66" strokeDasharray="3 3" strokeWidth="1.2" fill="none" />
                </g>
              ) : activeGender === 'female' ? (
                <g id="female-body">
                  {/* Hair Silhouette */}
                  <path
                    d="M94 42 C94 20, 146 20, 146 42 C158 60, 158 90, 148 115 C136 120, 104 120, 92 115 C82 90, 82 60, 94 42 Z"
                    fill="url(#hairShineGrad)"
                  />
                  {/* Head & Neck */}
                  <ellipse cx="120" cy="48" rx="17" ry="21" fill={`url(#mannequinSkin-${skinTone})`} />
                  <rect x="113" y="66" width="14" height="20" rx="3" fill={`url(#mannequinSkin-${skinTone})`} />
                  {/* Shoulders & Arms */}
                  <path d="M82 86 Q120 94 158 86 L150 170 Q120 178 90 170 Z" fill={`url(#mannequinSkin-${skinTone})`} />
                  <path d="M80 88 L64 185 L74 188 L87 94 Z" fill={`url(#mannequinSkin-${skinTone})`} />
                  <path d="M160 88 L176 185 L166 188 L153 94 Z" fill={`url(#mannequinSkin-${skinTone})`} />
                  {/* Legs */}
                  <rect x="98" y="170" width="18" height="215" rx="5" fill={`url(#mannequinSkin-${skinTone})`} />
                  <rect x="124" y="170" width="18" height="215" rx="5" fill={`url(#mannequinSkin-${skinTone})`} />
                </g>
              ) : (
                <g id="male-body">
                  {/* Male Hair */}
                  <path
                    d="M96 36 C96 22, 144 22, 144 36 C148 48, 140 54, 120 54 C100 54, 92 48, 96 36 Z"
                    fill="url(#hairShineGrad)"
                  />
                  {/* Head & Neck */}
                  <ellipse cx="120" cy="46" rx="19" ry="23" fill={`url(#mannequinSkin-${skinTone})`} />
                  <rect x="111" y="66" width="18" height="22" rx="4" fill={`url(#mannequinSkin-${skinTone})`} />
                  {/* Broad Torso & Arms */}
                  <path d="M72 88 Q120 96 168 88 L156 180 Q120 186 84 180 Z" fill={`url(#mannequinSkin-${skinTone})`} />
                  <path d="M70 90 L54 195 L66 198 L80 98 Z" fill={`url(#mannequinSkin-${skinTone})`} />
                  <path d="M170 90 L186 195 L174 198 L160 98 Z" fill={`url(#mannequinSkin-${skinTone})`} />
                  {/* Legs */}
                  <rect x="94" y="180" width="22" height="210" rx="5" fill={`url(#mannequinSkin-${skinTone})`} />
                  <rect x="124" y="180" width="22" height="210" rx="5" fill={`url(#mannequinSkin-${skinTone})`} />
                </g>
              )}

              {/* ================================================= */}
              {/* 2. DYNAMIC BOTTOM GARMENTS LAYER                  */}
              {/* ================================================= */}
              {activeOutfit.bottomType === 'skirt' || activeOutfit.topType === 'saree' ? (
                <g id="draped-skirt">
                  {/* Accordion / Flared Skirt */}
                  <path
                    d="M86 150 L154 150 L174 330 Q120 345 66 330 Z"
                    fill={bottomColor}
                  />
                  <path
                    d="M86 150 L154 150 L174 330 Q120 345 66 330 Z"
                    fill="url(#bottomFabricGrad)"
                  />
                  {/* Skirt Pleat Lines */}
                  <line x1="102" y1="152" x2="92" y2="332" stroke="#000" strokeOpacity="0.25" strokeWidth="1.5" />
                  <line x1="120" y1="152" x2="120" y2="336" stroke="#000" strokeOpacity="0.25" strokeWidth="1.5" />
                  <line x1="138" y1="152" x2="148" y2="332" stroke="#000" strokeOpacity="0.25" strokeWidth="1.5" />
                  {/* Waistband */}
                  <rect x="86" y="148" width="68" height="6" rx="2" fill={accentColor} />
                </g>
              ) : activeOutfit.bottomType === 'gown_skirt' || activeOutfit.topType === 'gown' ? (
                <g id="draped-gown-skirt">
                  {/* Floor Length Gown Skirt */}
                  <path
                    d="M88 140 L152 140 L180 395 Q120 410 60 395 Z"
                    fill={bottomColor}
                  />
                  <path
                    d="M88 140 L152 140 L180 395 Q120 410 60 395 Z"
                    fill="url(#bottomFabricGrad)"
                  />
                  {/* Flowing Gown Drapes */}
                  <path d="M110 142 Q105 270 90 398" stroke="#000" strokeOpacity="0.2" strokeWidth="2" fill="none" />
                  <path d="M130 142 Q135 270 150 398" stroke="#000" strokeOpacity="0.2" strokeWidth="2" fill="none" />
                </g>
              ) : activeOutfit.bottomType === 'salwar_bottom' ? (
                <g id="draped-salwar">
                  {/* Gathered Salwar / Churidar Pants */}
                  <path
                    d="M86 160 L154 160 L146 385 L124 385 L120 220 L116 385 L94 385 Z"
                    fill={bottomColor}
                  />
                  <path
                    d="M86 160 L154 160 L146 385 L124 385 L120 220 L116 385 L94 385 Z"
                    fill="url(#bottomFabricGrad)"
                  />
                  {/* Gather pleats */}
                  <path d="M96 340 Q106 345 116 340" stroke="#000" strokeOpacity="0.2" strokeWidth="1.5" fill="none" />
                  <path d="M124 340 Q134 345 144 340" stroke="#000" strokeOpacity="0.2" strokeWidth="1.5" fill="none" />
                </g>
              ) : (
                /* Tailored Trousers / Chinos / Jeans */
                <g id="draped-trousers">
                  {/* Left & Right Pant Legs */}
                  <path
                    d="M86 165 L154 165 L150 388 L126 388 L120 220 L114 388 L90 388 Z"
                    fill={bottomColor}
                  />
                  <path
                    d="M86 165 L154 165 L150 388 L126 388 L120 220 L114 388 L90 388 Z"
                    fill="url(#bottomFabricGrad)"
                  />
                  {/* Pressed Center Creases */}
                  <line x1="102" y1="170" x2="102" y2="385" stroke="#000" strokeOpacity="0.2" strokeWidth="1.5" />
                  <line x1="138" y1="170" x2="138" y2="385" stroke="#000" strokeOpacity="0.2" strokeWidth="1.5" />
                  {/* Waistband */}
                  <rect x="86" y="165" width="68" height="8" rx="2" fill={bottomColor} />
                  <rect x="86" y="165" width="68" height="8" rx="2" fill="#000" fillOpacity="0.15" />
                </g>
              )}

              {/* Shoes (for human model) */}
              {mannequinForm === 'human' && (
                <g id="shoes">
                  <path d="M88 388 L104 388 L108 402 L84 402 Z" fill="#0A192F" />
                  <path d="M136 388 L152 388 L156 402 L132 402 Z" fill="#0A192F" />
                  <line x1="84" y1="400" x2="108" y2="400" stroke="#FAF8F5" strokeWidth="1.5" />
                  <line x1="132" y1="400" x2="156" y2="400" stroke="#FAF8F5" strokeWidth="1.5" />
                </g>
              )}

              {/* ================================================= */}
              {/* 3. DYNAMIC TOP GARMENTS LAYER                     */}
              {/* ================================================= */}
              {activeOutfit.topType === 'kurti' ? (
                <g id="draped-kurti">
                  {/* Ethnic Kurti with Side Slits */}
                  <path
                    d="M80 86 L160 86 L154 260 L140 260 L140 180 L100 180 L100 260 L86 260 Z"
                    fill={topColor}
                  />
                  <path
                    d="M80 86 L160 86 L154 260 L140 260 L140 180 L100 180 L100 260 L86 260 Z"
                    fill="url(#topFabricGrad)"
                  />
                  {/* Sleeves */}
                  {mannequinForm === 'human' && (
                    <>
                      <path d="M80 86 L62 165 L76 167 L88 94 Z" fill={topColor} />
                      <path d="M160 86 L178 165 L164 167 L152 94 Z" fill={topColor} />
                    </>
                  )}
                  {/* Neckline Embroidery */}
                  <path d="M106 86 C108 115, 132 115, 134 86" stroke={accentColor} strokeWidth="3.5" fill="none" />
                  <circle cx="120" cy="120" r="2.5" fill={accentColor} />
                  <circle cx="120" cy="132" r="2.5" fill={accentColor} />
                </g>
              ) : activeOutfit.topType === 'saree' ? (
                <g id="draped-saree">
                  {/* Fitted Blouse */}
                  <path d="M82 86 L158 86 L150 145 L90 145 Z" fill={topColor} />
                  {/* Diagonal Pleated Pallu Drape across chest */}
                  <path
                    d="M82 86 L105 86 L152 170 L140 175 Z"
                    fill={topColor}
                  />
                  <path d="M82 86 L105 86 L152 170 L140 175 Z" fill="#000" fillOpacity="0.15" />
                  {/* Zari Gold Border Accent */}
                  <line x1="82" y1="86" x2="152" y2="170" stroke={accentColor} strokeWidth="3" />
                  {/* Saree Sleeve */}
                  {mannequinForm === 'human' && (
                    <path d="M160 86 L174 135 L162 137 L152 94 Z" fill={topColor} />
                  )}
                </g>
              ) : activeOutfit.topType === 'gown' ? (
                <g id="draped-gown-top">
                  {/* Fitted Sweetheart Bodice */}
                  <path
                    d="M84 94 Q120 106 156 94 L152 150 Q120 160 88 150 Z"
                    fill={topColor}
                  />
                  <path
                    d="M84 94 Q120 106 156 94 L152 150 Q120 160 88 150 Z"
                    fill="url(#topFabricGrad)"
                  />
                  {/* Metallic Gold Waist Belt Accent */}
                  <rect x="88" y="142" width="64" height="6" rx="2" fill={accentColor} />
                </g>
              ) : activeOutfit.topType === 'blazer' ? (
                <g id="draped-blazer">
                  {/* Underlayer Shirt / Camisole */}
                  <path d="M106 86 L134 86 L128 170 L112 170 Z" fill="#FAF8F5" />
                  <path d="M112 86 L120 108 L128 86" stroke="#0A192F" strokeWidth="1.5" fill="none" />
                  
                  {/* Tailored Jacket Bodice */}
                  <path
                    d="M74 88 L166 88 L158 190 L130 190 L120 135 L110 190 L82 190 Z"
                    fill={topColor}
                  />
                  <path
                    d="M74 88 L166 88 L158 190 L130 190 L120 135 L110 190 L82 190 Z"
                    fill="url(#topFabricGrad)"
                  />
                  {/* Jacket Sleeves */}
                  {mannequinForm === 'human' && (
                    <>
                      <path d="M74 88 L56 185 L70 188 L84 96 Z" fill={topColor} />
                      <path d="M166 88 L184 185 L170 188 L156 96 Z" fill={topColor} />
                    </>
                  )}
                  {/* Lapels */}
                  <path d="M92 88 L114 135 L96 135 Z" fill="#000" fillOpacity="0.25" />
                  <path d="M148 88 L126 135 L144 135 Z" fill="#000" fillOpacity="0.25" />
                  {/* Buttons */}
                  <circle cx="120" cy="148" r="2" fill={accentColor} />
                  <circle cx="120" cy="162" r="2" fill={accentColor} />
                  {/* Pocket Square */}
                  <path d="M142 120 L152 120 L150 124 L144 124 Z" fill={accentColor} />
                </g>
              ) : activeOutfit.topType === 'kurta' ? (
                <g id="draped-kurta">
                  {/* Bandhgala / Mandarin Kurta */}
                  <path
                    d="M74 88 L166 88 L158 240 L136 240 L136 175 L104 175 L104 240 L82 240 Z"
                    fill={topColor}
                  />
                  <path
                    d="M74 88 L166 88 L158 240 L136 240 L136 175 L104 175 L104 240 L82 240 Z"
                    fill="url(#topFabricGrad)"
                  />
                  {/* Sleeves */}
                  {mannequinForm === 'human' && (
                    <>
                      <path d="M74 88 L58 185 L70 188 L84 96 Z" fill={topColor} />
                      <path d="M166 88 L182 185 L170 188 L156 96 Z" fill={topColor} />
                    </>
                  )}
                  {/* Bandhgala Collar & Placket */}
                  <rect x="110" y="80" width="20" height="8" rx="2" fill={topColor} />
                  <line x1="120" y1="88" x2="120" y2="155" stroke={accentColor} strokeWidth="2" />
                  <circle cx="120" cy="100" r="1.5" fill={accentColor} />
                  <circle cx="120" cy="112" r="1.5" fill={accentColor} />
                  <circle cx="120" cy="124" r="1.5" fill={accentColor} />
                </g>
              ) : (
                /* Classic Shirt / Blouse / Top */
                <g id="draped-shirt">
                  <path
                    d="M76 88 L164 88 L154 180 L86 180 Z"
                    fill={topColor}
                  />
                  <path
                    d="M76 88 L164 88 L154 180 L86 180 Z"
                    fill="url(#topFabricGrad)"
                  />
                  {/* Sleeves */}
                  {mannequinForm === 'human' && (
                    <>
                      <path d="M76 88 L60 175 L72 178 L86 96 Z" fill={topColor} />
                      <path d="M164 88 L180 175 L168 178 L154 96 Z" fill={topColor} />
                    </>
                  )}
                  {/* Collar & Buttons */}
                  <path d="M108 86 L120 104 L132 86" stroke="#000" strokeOpacity="0.3" strokeWidth="2" fill="none" />
                  <line x1="120" y1="104" x2="120" y2="175" stroke="#000" strokeOpacity="0.2" strokeWidth="1.5" />
                  <circle cx="120" cy="118" r="1.5" fill="#000" fillOpacity="0.4" />
                  <circle cx="120" cy="136" r="1.5" fill="#000" fillOpacity="0.4" />
                  <circle cx="120" cy="154" r="1.5" fill="#000" fillOpacity="0.4" />
                </g>
              )}

              {/* Outerwear Shrug Layer (if specified) */}
              {activeOutfit.topType === 'shrug' && (
                <g id="shrug-outerwear">
                  <path d="M70 88 L96 88 L90 180 L76 185 Z" fill={outerwearColor} />
                  <path d="M170 88 L144 88 L150 180 L164 185 Z" fill={outerwearColor} />
                  {mannequinForm === 'human' && (
                    <>
                      <path d="M70 88 L52 185 L66 188 L78 96 Z" fill={outerwearColor} />
                      <path d="M170 88 L188 185 L174 188 L162 96 Z" fill={outerwearColor} />
                    </>
                  )}
                </g>
              )}
            </svg>
          </div>

          {/* Bottom Draped Info Strip */}
          <div className="absolute bottom-3 left-3 right-3 bg-[#0a192f]/90 backdrop-blur-md p-2.5 rounded-2xl border border-[#FAF8F5]/15 z-20 flex items-center justify-between">
            <div>
              <span className="text-[9px] uppercase font-mono font-bold text-[#93c5fd] flex items-center gap-1">
                <Shirt className="w-3 h-3 text-[#38BDF8]" />
                <span>{mannequinForm === 'dress_form' ? 'Atelier Form' : `${activeGender === 'female' ? 'Women' : 'Men'} Silhouette`}</span>
              </span>
              <h5 className="text-xs font-serif font-bold text-white truncate max-w-[170px]">
                {activeOutfit.title}
              </h5>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm"
                style={{ backgroundColor: topColor }}
                title={`Top: ${topColor}`}
              />
              <span
                className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm"
                style={{ backgroundColor: bottomColor }}
                title={`Bottom: ${bottomColor}`}
              />
              <span
                className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm"
                style={{ backgroundColor: accentColor }}
                title={`Accent: ${accentColor}`}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* FIT CONTROLS */}
      {showControls && (
        <div className="w-full mt-3 pt-3 border-t border-[#FAF8F5]/10 z-10 relative flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#FAF8F5]/70">
          <div className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-[#93c5fd]" />
            <span>Garment Fit:</span>
            <div className="flex bg-[#050d1a] p-0.5 rounded-xl border border-[#FAF8F5]/15">
              {(['slim', 'regular', 'oversized'] as const).map((fit) => (
                <button
                  key={fit}
                  onClick={() => setFitStyle(fit)}
                  className={`px-2.5 py-1 rounded-lg font-medium capitalize transition-all ${
                    fitStyle === fit
                      ? 'bg-[#1e3a8a] text-white shadow-sm font-bold'
                      : 'text-[#FAF8F5]/60 hover:text-white'
                  }`}
                >
                  {fit}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span>Draped Palette:</span>
            <span className="text-white font-bold">{topColor}</span>
            <span>&bull;</span>
            <span className="text-white font-bold">{bottomColor}</span>
          </div>
        </div>
      )}
    </div>
  );
}
