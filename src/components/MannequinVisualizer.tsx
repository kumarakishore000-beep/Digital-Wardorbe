'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  User,
  ZoomIn,
  ZoomOut,
  Check,
  Layers,
  Tag,
  Sliders,
  Bookmark,
  RefreshCw,
  CheckCircle2,
  Lock,
  Wand2,
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
    | 'skirt'
    | 'shrug'
    | 'blazer'
    | 'jacket';
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
  // Backward compatibility keys
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

export interface RealGarmentData {
  id: string;
  key: OutfitConfig['topType'];
  title: string;
  category: string;
  gender: 'female' | 'male' | 'both';
  image: string;
  texture: string;
  suggestedBottom: OutfitConfig['bottomType'];
  defaultTopColor: string;
  defaultBottomColor: string;
  description: string;
}

export const REAL_GARMENT_COLLECTION: RealGarmentData[] = [
  // Women's Real Clothes Options
  {
    id: 'w-gown',
    key: 'gown',
    title: 'Velvet Evening Gown',
    category: 'Formal Evening',
    gender: 'female',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop',
    texture: 'Plush Velvet with Satin Sheen',
    suggestedBottom: 'gown_skirt',
    defaultTopColor: '#4C1D95',
    defaultBottomColor: '#312E81',
    description: 'Floor-length plush velvet evening gown with structured waist silhouette.',
  },
  {
    id: 'w-kurti',
    key: 'kurti',
    title: 'Chanderi Silk Ethnic Kurti',
    category: 'Ethnic Fusion',
    gender: 'female',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop',
    texture: 'Chanderi Silk with Zardozi Gold Embroidery',
    suggestedBottom: 'salwar_bottom',
    defaultTopColor: '#059669',
    defaultBottomColor: '#F8FAFC',
    description: 'Traditional hand-embroidered silk kurti paired with fluid off-white bottom.',
  },
  {
    id: 'w-saree',
    key: 'saree',
    title: 'Kanjivaram Royal Silk Saree',
    category: 'Heritage Ethnic',
    gender: 'female',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop',
    texture: 'Pure Mulberry Silk with Gold Zari Border',
    suggestedBottom: 'skirt',
    defaultTopColor: '#DC2626',
    defaultBottomColor: '#B91C1C',
    description: 'Rich royal Kanjivaram silk saree with woven zari borders and elegant drape.',
  },
  {
    id: 'w-skirt',
    key: 'skirt',
    title: 'Pleated Accordion Chiffon Skirt',
    category: 'Casual Chic',
    gender: 'female',
    image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0afe1?w=800&auto=format&fit=crop',
    texture: 'Fine Accordion Pleated Chiffon',
    suggestedBottom: 'skirt',
    defaultTopColor: '#F43F5E',
    defaultBottomColor: '#BE123C',
    description: 'High-waisted pleated skirt creating a fluid movement drape.',
  },
  {
    id: 'w-blazer',
    key: 'blazer',
    title: 'Tailored Women Executive Blazer',
    category: 'Corporate Power',
    gender: 'female',
    image: 'https://images.unsplash.com/photo-1548624149-f1b96a4a0f44?w=800&auto=format&fit=crop',
    texture: 'Italian Wool Blend',
    suggestedBottom: 'trousers',
    defaultTopColor: '#0F172A',
    defaultBottomColor: '#1E293B',
    description: 'Sharp-lapel tailored blazer for executive business attire.',
  },

  // Men's Real Clothes Options
  {
    id: 'm-kurta',
    key: 'kurta',
    title: 'Raw Silk Festive Kurta',
    category: 'Festive Ethnic',
    gender: 'male',
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&auto=format&fit=crop',
    texture: 'Textured Raw Silk with Gold Buttons',
    suggestedBottom: 'salwar_bottom',
    defaultTopColor: '#B45309',
    defaultBottomColor: '#FEF3C7',
    description: 'Traditional royal raw silk kurta paired with churidar bottom.',
  },
  {
    id: 'm-suit',
    key: 'blazer',
    title: 'Tuxedo Formal Blazer & Suit',
    category: 'Gala Formal',
    gender: 'male',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop',
    texture: 'Super 120s Fine Wool Satin Lapel',
    suggestedBottom: 'trousers',
    defaultTopColor: '#0F172A',
    defaultBottomColor: '#020617',
    description: 'Classic double-breasted formal tuxedo suit jacket with satin lapels.',
  },
  {
    id: 'm-shirt',
    key: 'shirt',
    title: 'Crisp Egyptian Linen Shirt',
    category: 'Smart Casual',
    gender: 'male',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop',
    texture: 'Breathable Egyptian Linen',
    suggestedBottom: 'chinos',
    defaultTopColor: '#F8FAFC',
    defaultBottomColor: '#15803D',
    description: 'Breathable linen shirt paired with tailored chinos.',
  },
  {
    id: 'm-jacket',
    key: 'jacket',
    title: 'Vintage Biker Leather Jacket',
    category: 'Streetwear',
    gender: 'male',
    image: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=800&auto=format&fit=crop',
    texture: 'Full-Grain Burnished Leather',
    suggestedBottom: 'jeans',
    defaultTopColor: '#18181B',
    defaultBottomColor: '#1E293B',
    description: 'Heavyweight full-grain leather motorcycle jacket with metallic zips.',
  },
  {
    id: 'm-tshirt',
    key: 'tshirt',
    title: 'Heavyweight Cotton Tee & Tracks',
    category: 'Athleisure',
    gender: 'male',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop',
    texture: '240 GSM Organic Combed Cotton',
    suggestedBottom: 'tracks',
    defaultTopColor: '#3B82F6',
    defaultBottomColor: '#0F172A',
    description: 'Ultra-soft crewneck t-shirt paired with tapered athletic track trousers.',
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
  const [activeGender, setActiveGender] = useState<Gender>(() => gender);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isWalkInActive, setIsWalkInActive] = useState(false);

  // View Mode: 'human_tryon' (Real Human Model Virtual Try-On), 'real_draped' (Studio Draped Model), 'model_photo' (Photorealistic Model)
  const [viewMode, setViewMode] = useState<'human_tryon' | 'real_draped' | 'model_photo'>('human_tryon');

  // Drape & Fit State
  const [fitStyle, setFitStyle] = useState<'slim' | 'regular' | 'oversized'>('regular');
  const [clothOpacity, setClothOpacity] = useState<number>(0.92);
  const [toneAdjustment, setToneAdjustment] = useState<number>(0);

  // Gemini AI Suggestion State
  const [isAiSuggesting, setIsAiSuggesting] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<ClothSuggestionResponse | null>(null);

  // Auth Gate Modal State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleGenderToggle = (newGender: Gender) => {
    setActiveGender(newGender);
    onGenderChange?.(newGender);
    setAiSuggestion(null);
  };

  const skin = SKIN_TONES[skinTone] || SKIN_TONES.golden_olive;

  // Compute fine-tuned skin colors
  const adjustColorHex = (hex: string, amount: number) => {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  const activeSkinBase = adjustColorHex(skin.base, toneAdjustment);
  const activeSkinHighlight = adjustColorHex(skin.highlight, toneAdjustment);
  const activeSkinShadow = adjustColorHex(skin.shadow, toneAdjustment);

  // Selected current outfit config
  const currentOutfit: OutfitConfig = outfit || (activeGender === 'male'
    ? {
        title: 'Tailored Linen & Chinos Combo',
        topType: 'shirt',
        topColor: '#FFFFFF',
        bottomType: 'chinos',
        bottomColor: '#15803D',
        outerwearColor: '#1E293B',
        accentColor: '#8B5CF6',
        description: 'Crisp White Linen Shirt with Green Chinos on Real Male Model.',
      }
    : {
        title: 'Chanderi Silk Ethnic Kurti Look',
        topType: 'kurti',
        topColor: '#059669',
        bottomType: 'salwar_bottom',
        bottomColor: '#F8FAFC',
        accentColor: '#F59E0B',
        description: 'Emerald Green Silk Kurti on Real Female Model.',
      });

  // Real Garments filtered by gender
  const availableRealClothes = REAL_GARMENT_COLLECTION.filter(
    (g) => g.gender === activeGender || g.gender === 'both'
  );

  const activeRealGarment =
    availableRealClothes.find((g) => g.key === currentOutfit.topType) ||
    availableRealClothes[0] ||
    REAL_GARMENT_COLLECTION[0];

  const handleSelectRealGarment = (garment: RealGarmentData) => {
    const updatedOutfit: OutfitConfig = {
      title: garment.title,
      topType: garment.key,
      topColor: garment.defaultTopColor,
      bottomType: garment.suggestedBottom,
      bottomColor: garment.defaultBottomColor,
      description: garment.description,
    };
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
          occasion: 'Formal Event & Evening Wear',
          weather: 'Mild Breezy',
          colorPreference: currentOutfit.topColor,
          skinTone: skin.label,
        }),
      });

      if (response.ok) {
        const data: ClothSuggestionResponse = await response.json();
        setAiSuggestion(data);

        const newOutfitConfig: OutfitConfig = {
          title: data.title,
          topType: (data.suggestedClothKey || 'shirt') as OutfitConfig['topType'],
          topColor: data.recommendedTopColor || '#FFFFFF',
          bottomType: 'chinos',
          bottomColor: data.recommendedBottomColor || '#1E293B',
          accentColor: data.recommendedAccentColor,
          description: data.aiStylistRationale,
        };
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
    performSaveAction(`${activeRealGarment.id}-${currentOutfit.topType}`);
  };

  const performSaveAction = (outfitId = 'outfit-saved') => {
    const itemToSave = {
      id: outfitId,
      name: currentOutfit.title || activeRealGarment.title,
      category: 'Other' as const,
      color: currentOutfit.topColor,
      imageUrl: activeRealGarment.image,
      tags: ['Draped Mannequin', activeGender, skin.label],
    };

    collection.addItem(itemToSave);
    onSaveOutfit?.(currentOutfit);
    rewards.earnPoints('save_outfit');

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className={`relative w-full flex flex-col items-center select-none ${className}`}>
      {/* Auth Gate Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={performSaveAction}
        title="Sign In to Save Your Outfit"
        message="Create an account or sign in to save your customized outfit to your personal wardrobe collection."
      />

      {/* TOP HEADER CONTROLS BAR */}
      {showControls && (
        <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-6 p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl z-10 relative">
          {/* Gender Selector */}
          <div className="flex items-center gap-1 bg-black/50 p-1 rounded-2xl border border-white/10">
            <button
              onClick={() => handleGenderToggle('female')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeGender === 'female'
                  ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>👗 Female Model</span>
            </button>

            <button
              onClick={() => handleGenderToggle('male')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeGender === 'male'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>👔 Male Model</span>
            </button>
          </div>

          {/* Skin Tone Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-300 hidden sm:inline-flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-indigo-400" /> Skin Tone:
            </span>
            <div className="flex items-center gap-1 bg-black/50 p-1 rounded-2xl border border-white/10">
              {(['soft_ivory', 'warm_almond', 'golden_olive', 'bronze_tan', 'rich_espresso', 'deep_ebony'] as SkinTone[]).map((toneKey) => (
                <button
                  key={toneKey}
                  onClick={() => setSkinTone(toneKey)}
                  className={`px-2 py-1 rounded-xl text-xs font-medium flex items-center gap-1 transition-all ${
                    skinTone === toneKey
                      ? 'bg-white/20 text-white border border-white/30 shadow-inner'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title={SKIN_TONES[toneKey].label}
                >
                  <span>{SKIN_TONES[toneKey].icon}</span>
                </button>
              ))}
            </div>
          </div>

          {/* View Mode & Zoom */}
          <div className="flex items-center gap-2 ml-auto sm:ml-0">
            <div className="flex items-center gap-1 bg-black/50 p-1 rounded-2xl border border-white/10 text-xs">
              <button
                onClick={() => setViewMode('human_tryon')}
                className={`px-2.5 py-1 rounded-xl font-semibold transition-all ${
                  viewMode === 'human_tryon'
                    ? 'bg-indigo-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Human Model
              </button>
              <button
                onClick={() => setViewMode('real_draped')}
                className={`px-2.5 py-1 rounded-xl font-semibold transition-all ${
                  viewMode === 'real_draped'
                    ? 'bg-indigo-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Studio Contour
              </button>
              <button
                onClick={() => setViewMode('model_photo')}
                className={`px-2.5 py-1 rounded-xl font-semibold transition-all ${
                  viewMode === 'model_photo'
                    ? 'bg-indigo-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Editorial
              </button>
            </div>

            <button
              onClick={() => setIsWalkInActive(!isWalkInActive)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                isWalkInActive
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white border-amber-400 shadow-lg animate-pulse'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
              }`}
            >
              <span>🏃‍♂️</span>
              <span>{isWalkInActive ? 'Runway Active' : 'Runway Walk'}</span>
            </button>

            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors border border-white/10"
              title={isZoomed ? 'Zoom Out' : 'Zoom In'}
            >
              {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* REAL CLOTH OPTION SELECTOR STRIP */}
      {showControls && (
        <div className="w-full mb-6 z-10 relative space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-pink-400" />
              Real Garment Selection ({activeGender === 'female' ? "Women's Collection" : "Men's Collection"}):
            </p>
            <span className="text-[11px] text-slate-400">
              Select clothing item to wear on real model
            </span>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-3 scrollbar-hide">
            {availableRealClothes.map((garment) => {
              const isSelected = currentOutfit.topType === garment.key;
              return (
                <button
                  key={garment.id}
                  onClick={() => handleSelectRealGarment(garment)}
                  className={`group relative shrink-0 w-36 rounded-2xl overflow-hidden border transition-all text-left ${
                    isSelected
                      ? 'border-pink-500 ring-2 ring-pink-500/50 shadow-xl scale-105 bg-gradient-to-b from-pink-950/40 to-slate-900'
                      : 'border-white/10 hover:border-white/30 bg-black/40 hover:bg-white/5'
                  }`}
                >
                  <div className="h-24 w-full overflow-hidden relative">
                    <img
                      src={garment.image}
                      alt={garment.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    {isSelected && (
                      <span className="absolute top-2 right-2 p-1 rounded-full bg-pink-500 text-white shadow-md">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <div className="p-2 space-y-0.5">
                    <span className="text-[9px] uppercase font-bold text-pink-300 tracking-wider block truncate">
                      {garment.category}
                    </span>
                    <p className="text-xs font-bold text-white truncate leading-tight">{garment.title}</p>
                    <p className="text-[10px] text-slate-400 truncate">{garment.texture}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* GEMINI AI CLOTH SUGGESTION & ACTIONS BAR */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-6 p-4 rounded-2xl bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-slate-900 border border-purple-500/30 z-10 relative">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <Wand2 className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              Gemini AI Real Model Stylist
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Gemini 3.6 Flash
              </span>
            </h4>
            <p className="text-xs text-slate-300">
              Get AI outfit suggestions draped directly on the real human model
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto sm:ml-0">
          <button
            onClick={handleFetchAiSuggestion}
            disabled={isAiSuggesting}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-purple-500/25 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isAiSuggesting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Asking Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Ask Gemini AI Suggestion</span>
              </>
            )}
          </button>

          <button
            onClick={handleSaveOutfitClick}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
              savedSuccess
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-transparent shadow-lg shadow-emerald-500/20'
            }`}
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Saved to Wardrobe!</span>
              </>
            ) : (
              <>
                {!isAuthenticated ? <Lock className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                <span>{isAuthenticated ? 'Save Outfit' : 'Sign In to Save'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* GEMINI AI SUGGESTION CARD */}
      <AnimatePresence>
        {aiSuggestion && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full mb-6 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-xs space-y-2 z-10 relative"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Gemini AI Recommendation: {aiSuggestion.title}
              </span>
              <span className="text-[10px] text-amber-300 font-medium px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20">
                Fit: {aiSuggestion.fitRecommendation.toUpperCase()}
              </span>
            </div>
            <p className="text-slate-200 leading-relaxed">{aiSuggestion.aiStylistRationale}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN VISUALIZATION DISPLAY ENGINE */}
      <div className="relative w-full flex items-center justify-center py-4">
        <AnimatePresence mode="wait">
          {viewMode === 'human_tryon' ? (
            /* REAL HUMAN MODEL VIRTUAL TRY-ON ENGINE */
            <motion.div
              key="human_tryon"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={
                isWalkInActive
                  ? { scale: [1, 1.03, 1], y: [0, -8, 0] }
                  : { scale: isZoomed ? 1.15 : 1 }
              }
              exit={{ opacity: 0, scale: 0.95 }}
              transition={
                isWalkInActive
                  ? { repeat: Infinity, duration: 2.2, ease: 'easeInOut' }
                  : { type: 'spring', stiffness: 200, damping: 20 }
              }
              className="relative w-80 h-[500px] rounded-3xl overflow-hidden border-2 border-indigo-500/40 shadow-2xl bg-gradient-to-b from-slate-900 via-indigo-950/40 to-slate-950 flex flex-col items-center justify-center p-4 group"
            >
              {/* Ambient Spotlight & Runway Backdrop */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/15 via-purple-900/10 to-black pointer-events-none" />

              {/* REAL HUMAN AVATAR & CLOTH DRAPE LAYER */}
              <div
                className="relative w-full h-full flex flex-col items-center justify-center transition-all duration-300"
                style={{
                  transform: `scale(${
                    fitStyle === 'slim' ? 0.92 : fitStyle === 'oversized' ? 1.08 : 1
                  })`,
                }}
              >
                {/* SVG REAL HUMAN MODEL FIGURE */}
                <svg
                  className="absolute w-60 h-[440px] drop-shadow-2xl z-0"
                  viewBox="0 0 240 440"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id={`humanSkinGrad-${skinTone}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={activeSkinHighlight} />
                      <stop offset="50%" stopColor={activeSkinBase} />
                      <stop offset="100%" stopColor={activeSkinShadow} />
                    </linearGradient>
                    <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1E293B" />
                      <stop offset="100%" stopColor="#020617" />
                    </linearGradient>
                  </defs>

                  {/* Female vs Male Real Human Body Shapes */}
                  {activeGender === 'female' ? (
                    <g>
                      {/* Female Hair (Stylized Wavy Flow) */}
                      <path
                        d="M95 40 C95 20, 145 20, 145 40 C155 55, 155 85, 145 105 C135 110, 105 110, 95 105 C85 85, 85 55, 95 40 Z"
                        fill="url(#hairGrad)"
                      />
                      {/* Head & Neck */}
                      <ellipse cx="120" cy="48" rx="18" ry="22" fill={`url(#humanSkinGrad-${skinTone})`} />
                      <rect x="112" y="66" width="16" height="22" rx="4" fill={`url(#humanSkinGrad-${skinTone})`} />
                      {/* Shoulders & Bust */}
                      <path
                        d="M80 88 Q120 98 160 88 L152 170 Q120 180 88 170 Z"
                        fill={`url(#humanSkinGrad-${skinTone})`}
                      />
                      {/* Arms */}
                      <path d="M78 90 L62 185 L72 188 L85 96 Z" fill={`url(#humanSkinGrad-${skinTone})`} />
                      <path d="M162 90 L178 185 L168 188 L155 96 Z" fill={`url(#humanSkinGrad-${skinTone})`} />
                      {/* Legs */}
                      <rect x="96" y="170" width="20" height="210" rx="6" fill={`url(#humanSkinGrad-${skinTone})`} />
                      <rect x="124" y="170" width="20" height="210" rx="6" fill={`url(#humanSkinGrad-${skinTone})`} />
                    </g>
                  ) : (
                    <g>
                      {/* Male Hair (Short Tapered Style) */}
                      <path
                        d="M98 38 C98 25, 142 25, 142 38 C145 48, 138 52, 120 52 C102 52, 95 48, 98 38 Z"
                        fill="url(#hairGrad)"
                      />
                      {/* Male Head & Neck */}
                      <ellipse cx="120" cy="48" rx="20" ry="24" fill={`url(#humanSkinGrad-${skinTone})`} />
                      <rect x="110" y="68" width="20" height="24" rx="4" fill={`url(#humanSkinGrad-${skinTone})`} />
                      {/* Broad Shoulders & Torso */}
                      <path
                        d="M72 90 Q120 96 168 90 L156 180 Q120 185 84 180 Z"
                        fill={`url(#humanSkinGrad-${skinTone})`}
                      />
                      {/* Masculine Arms */}
                      <path d="M70 92 L54 195 L66 198 L80 100 Z" fill={`url(#humanSkinGrad-${skinTone})`} />
                      <path d="M170 92 L186 195 L174 198 L160 100 Z" fill={`url(#humanSkinGrad-${skinTone})`} />
                      {/* Legs */}
                      <rect x="94" y="180" width="23" height="205" rx="6" fill={`url(#humanSkinGrad-${skinTone})`} />
                      <rect x="123" y="180" width="23" height="205" rx="6" fill={`url(#humanSkinGrad-${skinTone})`} />
                    </g>
                  )}
                </svg>

                {/* REAL CLOTHING GARMENT OVERLAY */}
                <div
                  className="relative z-10 w-64 h-[380px] rounded-2xl overflow-hidden border border-white/20 shadow-2xl group-hover:scale-[1.02] transition-transform duration-500"
                  style={{ opacity: clothOpacity }}
                >
                  <img
                    src={activeRealGarment.image}
                    alt={activeRealGarment.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 mix-blend-multiply pointer-events-none" />
                  <div className="absolute inset-0 bg-indigo-500/10 mix-blend-overlay pointer-events-none" />

                  {/* Fabric Texture Badge */}
                  <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 text-[10px] font-bold text-amber-300 flex items-center gap-1 shadow-lg">
                    <Tag className="w-3 h-3 text-amber-400" />
                    <span>{activeRealGarment.texture}</span>
                  </div>
                </div>
              </div>

              {/* Garment Details Card */}
              <div className="absolute bottom-3 left-3 right-3 bg-black/85 backdrop-blur-md p-3 rounded-2xl border border-white/10 z-20 flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase font-bold text-pink-300 tracking-wider flex items-center gap-1">
                    <span>{activeGender === 'female' ? '👗 Female' : '👔 Male'} Model Virtual Try-On</span>
                  </span>
                  <h5 className="text-xs font-bold text-white truncate max-w-[180px]">
                    {activeRealGarment.title}
                  </h5>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm"
                    style={{ backgroundColor: currentOutfit.topColor }}
                  />
                  <span className="text-[10px] text-slate-300 font-mono">
                    {currentOutfit.topColor}
                  </span>
                </div>
              </div>
            </motion.div>
          ) : viewMode === 'real_draped' ? (
            /* STUDIO DRAPED CONTOUR VIEW */
            <motion.div
              key="real_draped"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: isZoomed ? 1.15 : 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-80 h-[480px] rounded-3xl overflow-hidden border-2 border-indigo-500/40 shadow-2xl bg-gradient-to-b from-slate-900 via-indigo-950/40 to-slate-950 flex flex-col items-center justify-center p-4 group"
            >
              <div className="relative z-10 w-64 h-[360px] rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
                <img
                  src={activeRealGarment.image}
                  alt={activeRealGarment.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          ) : (
            /* EDITORIAL FASHION MODEL VIEW */
            <motion.div
              key="model_photo"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: isZoomed ? 1.15 : 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-72 h-[420px] rounded-3xl overflow-hidden border-2 border-indigo-500/40 shadow-2xl"
            >
              <img
                src={activeRealGarment.image}
                alt={activeRealGarment.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider">
                  Photorealistic Editorial Model
                </span>
                <h5 className="text-sm font-extrabold">{activeRealGarment.title}</h5>
                <p className="text-xs text-slate-300">{activeRealGarment.description}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* DRAPE & FIT ADJUSTMENT CONTROLS */}
      {showControls && (
        <div className="w-full mt-4 pt-4 border-t border-white/10 z-10 relative flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-400" />
            <span className="font-bold text-slate-300">Garment Fit:</span>
            <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
              {(['slim', 'regular', 'oversized'] as const).map((fit) => (
                <button
                  key={fit}
                  onClick={() => setFitStyle(fit)}
                  className={`px-2.5 py-1 rounded-lg font-medium capitalize transition-all ${
                    fitStyle === fit
                      ? 'bg-purple-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {fit}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Drape Opacity:</span>
              <input
                type="range"
                min="0.5"
                max="1"
                step="0.05"
                value={clothOpacity}
                onChange={(e) => setClothOpacity(parseFloat(e.target.value))}
                className="w-20 accent-pink-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Skin Tone Shade:</span>
              <input
                type="range"
                min="-30"
                max="30"
                step="2"
                value={toneAdjustment}
                onChange={(e) => setToneAdjustment(parseInt(e.target.value))}
                className="w-20 accent-indigo-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
