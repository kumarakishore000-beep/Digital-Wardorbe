'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  Wand2,
  Shirt,
  Play,
  Pause,
  RotateCcw,
  Footprints,
  Compass,
  Palette,
  Crown,
  Eye,
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
  fabricType?: 'silk' | 'wool' | 'linen' | 'denim' | 'leather';
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
    base: '#FDE1CE',
    highlight: '#FFF3EB',
    shadow: '#D8AB90',
    icon: '🏻',
  },
  warm_almond: {
    label: 'Warm Almond',
    base: '#F4C29B',
    highlight: '#FDEDE0',
    shadow: '#C5916A',
    icon: '🏼',
  },
  golden_olive: {
    label: 'Golden Olive',
    base: '#D99B69',
    highlight: '#EFC19B',
    shadow: '#A86D3C',
    icon: '🏽',
  },
  bronze_tan: {
    label: 'Deep Bronze',
    base: '#B06F41',
    highlight: '#CB9063',
    shadow: '#82461D',
    icon: '🏽',
  },
  rich_espresso: {
    label: 'Rich Espresso',
    base: '#6E432A',
    highlight: '#8C5A3E',
    shadow: '#462714',
    icon: '🏾',
  },
  deep_ebony: {
    label: 'Deep Ebony',
    base: '#3B2117',
    highlight: '#573627',
    shadow: '#20100A',
    icon: '🏿',
  },
  white: {
    label: 'Fair Sand',
    base: '#FDE1CE',
    highlight: '#FFF3EB',
    shadow: '#D8AB90',
    icon: '🏻',
  },
  brown: {
    label: 'Warm Bronze',
    base: '#B06F41',
    highlight: '#CB9063',
    shadow: '#82461D',
    icon: '🏽',
  },
  black: {
    label: 'Deep Ebony',
    base: '#3B2117',
    highlight: '#573627',
    shadow: '#20100A',
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
  defaultAccentColor: string;
  description: string;
  fabricType: 'silk' | 'wool' | 'linen' | 'denim' | 'leather';
}

export const SILHOUETTES: GarmentSilhouette[] = [
  // WOMEN
  {
    id: 'w-gown',
    key: 'gown',
    title: 'Mulberry Silk Gala Gown',
    category: 'Haute Couture',
    gender: 'female',
    suggestedBottom: 'gown_skirt',
    defaultTopColor: '#0F172A',
    defaultBottomColor: '#0F172A',
    defaultAccentColor: '#D4AF37',
    description: 'Floor-sweeping silk gala gown with sweetheart bodice, liquid drape, and gold waist accents.',
    fabricType: 'silk',
  },
  {
    id: 'w-saree',
    key: 'saree',
    title: 'Heritage Banarasi Silk Saree',
    category: 'Ethnic Festive',
    gender: 'female',
    suggestedBottom: 'skirt',
    defaultTopColor: '#881337',
    defaultBottomColor: '#881337',
    defaultAccentColor: '#F59E0B',
    description: 'Bespoke handwoven silk saree with zari gold border and cascading diagonal shoulder pallu.',
    fabricType: 'silk',
  },
  {
    id: 'w-kurti',
    key: 'kurti',
    title: 'Chanderi Silk Kurti & Palazzos',
    category: 'Ethnic Fusion',
    gender: 'female',
    suggestedBottom: 'salwar_bottom',
    defaultTopColor: '#064E3B',
    defaultBottomColor: '#FAF8F5',
    defaultAccentColor: '#F59E0B',
    description: 'Emerald silk tunic with intricate neckline embroidery and flowing cream palazzo trousers.',
    fabricType: 'silk',
  },
  {
    id: 'w-blazer',
    key: 'blazer',
    title: 'Savile Row Power Suiting',
    category: 'Executive Suiting',
    gender: 'female',
    suggestedBottom: 'trousers',
    defaultTopColor: '#1E293B',
    defaultBottomColor: '#0F172A',
    defaultAccentColor: '#E2E8F0',
    description: 'Tailored wool-crepe blazer with structured peak lapels and fluid high-waist trousers.',
    fabricType: 'wool',
  },
  {
    id: 'w-skirt',
    key: 'top',
    title: 'Silk Blouse & Accordion Skirt',
    category: 'Cocktail Chic',
    gender: 'female',
    suggestedBottom: 'skirt',
    defaultTopColor: '#FAF8F5',
    defaultBottomColor: '#1E3A8A',
    defaultAccentColor: '#D4AF37',
    description: 'Woven silk blouse tucked into accordion pleats that sway dynamically on the runway.',
    fabricType: 'silk',
  },
  {
    id: 'w-jacket',
    key: 'jacket',
    title: 'Cropped Denim & Utility Cargo',
    category: 'Urban Streetwear',
    gender: 'female',
    suggestedBottom: 'jeans',
    defaultTopColor: '#2563EB',
    defaultBottomColor: '#1E293B',
    defaultAccentColor: '#F59E0B',
    description: 'Washed indigo denim trucker jacket paired with dark selvedge trousers.',
    fabricType: 'denim',
  },
  // MEN
  {
    id: 'm-suit',
    key: 'blazer',
    title: 'Bespoke Tailored Tuxedo Suit',
    category: 'Executive Suiting',
    gender: 'male',
    suggestedBottom: 'trousers',
    defaultTopColor: '#0F172A',
    defaultBottomColor: '#0F172A',
    defaultAccentColor: '#D4AF37',
    description: 'Structured wool tuxedo jacket with satin lapels, silk pocket square, and pressed dress trousers.',
    fabricType: 'wool',
  },
  {
    id: 'm-kurta',
    key: 'kurta',
    title: 'Bandhgala Royal Silk Kurta',
    category: 'Royal Ethnic',
    gender: 'male',
    suggestedBottom: 'salwar_bottom',
    defaultTopColor: '#1E3A8A',
    defaultBottomColor: '#FAF8F5',
    defaultAccentColor: '#D4AF37',
    description: 'Mandarin collar silk bandhgala kurta with gold buttons and tapered churidar trousers.',
    fabricType: 'silk',
  },
  {
    id: 'm-shirt',
    key: 'shirt',
    title: 'Crisp Oxford Shirt & Chinos',
    category: 'Smart Casual',
    gender: 'male',
    suggestedBottom: 'chinos',
    defaultTopColor: '#FAF8F5',
    defaultBottomColor: '#1E3A8A',
    defaultAccentColor: '#B45309',
    description: 'Crisp woven cotton shirt with point collar, tailored chinos, and burnished leather belt.',
    fabricType: 'linen',
  },
  {
    id: 'm-shrug',
    key: 'shrug',
    title: 'Cashmere Cardigan & Selvedge Denim',
    category: 'Urban Layered',
    gender: 'male',
    suggestedBottom: 'jeans',
    defaultTopColor: '#334155',
    defaultBottomColor: '#0F172A',
    defaultAccentColor: '#94A3B8',
    description: 'Fine-gauge knit cashmere layered cardigan with dark tapered denim.',
    fabricType: 'wool',
  },
];

// Curated Harmonic Fashion Palettes
const HARMONIC_PRESETS = [
  { name: 'Midnight Navy & Gold', top: '#0F172A', bottom: '#1E293B', accent: '#D4AF37' },
  { name: 'Emerald & Warm Sand', top: '#064E3B', bottom: '#FAF8F5', accent: '#F59E0B' },
  { name: 'Burgundy & Soft Cream', top: '#881337', bottom: '#FAF8F5', accent: '#D97706' },
  { name: 'Slate Blue & Charcoal', top: '#1E3A8A', bottom: '#0F172A', accent: '#93C5FD' },
  { name: 'Terracotta & Olive', top: '#C2410C', bottom: '#3F6212', accent: '#EAB308' },
  { name: 'Minimalist Ivory & Noir', top: '#FAF8F5', bottom: '#0A192F', accent: '#E2E8F0' },
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
  
  // Real runway walk state
  const [isWalkActive, setIsWalkActive] = useState(true);
  const [walkSpeed, setWalkSpeed] = useState<'slow' | 'medium' | 'fast'>('medium');
  const [turntableAngle, setTurntableAngle] = useState<0 | 30 | -30 | 180>(0);
  
  const [fitStyle, setFitStyle] = useState<'slim' | 'regular' | 'oversized'>('regular');
  const [mannequinForm, setMannequinForm] = useState<'human' | 'dress_form'>('human');
  
  // Local outfit override
  const [localOutfit, setLocalOutfit] = useState<OutfitConfig | null>(null);

  const [isAiSuggesting, setIsAiSuggesting] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<ClothSuggestionResponse | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  // Sync parent gender
  useEffect(() => {
    setActiveGender(gender);
    setLocalOutfit(null);
  }, [gender]);

  // Sync parent outfit (only when incoming title or colors differ)
  useEffect(() => {
    if (outfit && (!localOutfit || localOutfit.title !== outfit.title || localOutfit.topColor !== outfit.topColor)) {
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
  const activeOutfit: OutfitConfig = useMemo(() => {
    if (localOutfit) return localOutfit;
    if (outfit) return outfit;
    return activeGender === 'male'
      ? {
        title: 'Bespoke Tailored Tuxedo Suit',
        topType: 'blazer',
        topColor: '#0F172A',
        bottomType: 'trousers',
        bottomColor: '#0F172A',
        outerwearColor: '#FAF8F5',
        accentColor: '#D4AF37',
        description: 'Structured two-piece tailored wool jacket with sharp lapels and trousers.',
        fabricType: 'wool',
      }
      : {
        title: 'Mulberry Silk Gala Gown',
        topType: 'gown',
        topColor: '#0F172A',
        bottomType: 'gown_skirt',
        bottomColor: '#0F172A',
        accentColor: '#D4AF37',
        description: 'Floor-sweeping silk gala gown with sweetheart bodice and gold accents.',
        fabricType: 'silk',
      };
  }, [localOutfit, outfit, activeGender]);

  const availableSilhouettes = SILHOUETTES.filter(
    (g) => g.gender === activeGender || g.gender === 'both'
  );

  const handleSelectSilhouette = (sil: GarmentSilhouette) => {
    const updatedOutfit: OutfitConfig = {
      title: sil.title,
      topType: sil.key,
      topColor: sil.defaultTopColor,
      bottomType: sil.suggestedBottom,
      bottomColor: sil.defaultBottomColor,
      accentColor: sil.defaultAccentColor,
      description: sil.description,
      fabricType: sil.fabricType,
    };
    setLocalOutfit(updatedOutfit);
    onGarmentChange?.(updatedOutfit);
  };

  const handleApplyHarmonicPreset = (preset: typeof HARMONIC_PRESETS[0]) => {
    const updated: OutfitConfig = {
      ...activeOutfit,
      topColor: preset.top,
      bottomColor: preset.bottom,
      accentColor: preset.accent,
    };
    setLocalOutfit(updated);
    onGarmentChange?.(updated);
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
          topColor: data.recommendedTopColor || '#0F172A',
          bottomType: activeGender === 'male' ? 'trousers' : 'skirt',
          bottomColor: data.recommendedBottomColor || '#FAF8F5',
          accentColor: data.recommendedAccentColor || '#D4AF37',
          description: data.aiStylistRationale,
          fabricType: 'silk',
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
    // Save directly to collection (works for both guests and authenticated users!)
    const outfitItem = {
      id: Date.now().toString(),
      name: activeOutfit.title || 'Curated Fashion Ensemble',
      category: 'Other' as const,
      color: activeOutfit.topColor,
      tags: [activeGender, activeOutfit.topType, activeOutfit.bottomType, 'Mannequin Curated'],
      notes: `${activeOutfit.description || 'Draped on interactive studio mannequin'} (Accent: ${activeOutfit.accentColor || 'Gold'})`,
      createdAt: new Date().toISOString(),
    };
    collection.addItem(outfitItem);
    rewards.earnPoints('add_to_collection');
    onSaveOutfit?.(activeOutfit);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3500);
  };

  const topColor = activeOutfit.topColor || '#0F172A';
  const bottomColor = activeOutfit.bottomColor || '#FAF8F5';
  const accentColor = activeOutfit.accentColor || '#D4AF37';

  // Walk animation timing
  const walkCycleDuration = walkSpeed === 'fast' ? 1.0 : walkSpeed === 'slow' ? 2.2 : 1.5;

  return (
    <div className={`w-full flex flex-col items-center select-none text-[#FAF8F5] ${className}`}>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        title="Sync to Cloud Wardrobe"
        message="Your look is saved locally! Sign in to sync your wardrobe across all devices."
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
              className={`px-3 py-1 rounded-xl font-semibold transition-all ${
                mannequinForm === 'human'
                  ? 'bg-[#1e3a8a] text-white shadow-sm font-bold'
                  : 'text-[#FAF8F5]/60 hover:text-white'
              }`}
            >
              Catwalk Model
            </button>
            <button
              onClick={() => setMannequinForm('dress_form')}
              className={`px-3 py-1 rounded-xl font-semibold transition-all ${
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

          {/* Runway View Actions */}
          <div className="flex items-center gap-2">
            {/* Walk toggle */}
            <button
              onClick={() => setIsWalkActive(!isWalkActive)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                isWalkActive
                  ? 'bg-[#FAF8F5] text-[#0a192f] border-white shadow-lg'
                  : 'bg-[#0a192f] text-[#FAF8F5]/70 border-[#FAF8F5]/15 hover:bg-[#16366f]/40'
              }`}
              title={isWalkActive ? 'Pause Runway Catwalk' : 'Start Runway Catwalk'}
            >
              {isWalkActive ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-[#0a192f]" />
                  <span>Walking</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-[#FAF8F5]" />
                  <span>Runway Walk</span>
                </>
              )}
            </button>

            {/* Turntable Rotation */}
            <button
              onClick={() => {
                const nextAngles: Record<number, 0 | 30 | -30 | 180> = { 0: 30, 30: -30, '-30': 0 };
                setTurntableAngle(nextAngles[turntableAngle] ?? 0);
              }}
              className="p-2 rounded-xl bg-[#0a192f] text-[#FAF8F5]/80 hover:text-white transition-colors border border-[#FAF8F5]/15"
              title={`Turntable Angle: ${turntableAngle}°`}
            >
              <Compass className="w-4 h-4" />
            </button>

            {/* Zoom Toggle */}
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="p-2 rounded-xl bg-[#0a192f] text-[#FAF8F5]/80 hover:text-white transition-colors border border-[#FAF8F5]/15"
              title={isZoomed ? 'Zoom Out' : 'Zoom In'}
            >
              {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* QUICK SILHOUETTE SELECTOR STRIP */}
      {showControls && (
        <div className="w-full mb-4 z-10 relative space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#FAF8F5]/70">
            <span className="flex items-center gap-1.5 font-bold uppercase text-[#93c5fd]">
              <Layers className="w-3.5 h-3.5" />
              Real Clothes Silhouettes
            </span>
            <span>Click to drape on runway model</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {availableSilhouettes.map((sil) => {
              const isSelected = activeOutfit.title === sil.title || (!localOutfit && outfit?.title === sil.title);
              return (
                <button
                  key={sil.id}
                  onClick={() => handleSelectSilhouette(sil)}
                  className={`group relative shrink-0 px-3 py-2 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                    isSelected
                      ? 'border-[#FAF8F5] bg-[#FAF8F5] text-[#0a192f] shadow-lg scale-102 font-bold'
                      : 'border-[#FAF8F5]/15 bg-[#0a192f]/70 text-[#FAF8F5] hover:bg-[#16366f]/50'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full border border-black/20 shrink-0 flex items-center justify-center" style={{ backgroundColor: sil.defaultTopColor }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sil.defaultAccentColor }} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs truncate max-w-[140px]">{sil.title}</p>
                    <p className={`text-[9px] uppercase font-mono ${isSelected ? 'text-[#1e3a8a]' : 'text-[#93c5fd]'}`}>
                      {sil.category}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Harmonic Palettes */}
          <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 text-xs">
            <span className="text-[10px] font-mono uppercase text-[#FAF8F5]/60 shrink-0 flex items-center gap-1">
              <Palette className="w-3 h-3 text-[#93c5fd]" />
              Harmonies:
            </span>
            {HARMONIC_PRESETS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleApplyHarmonicPreset(p)}
                className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#050d1a] border border-[#FAF8F5]/15 hover:border-[#FAF8F5]/40 text-[10px] font-mono text-[#FAF8F5]/80 hover:text-white transition-all"
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.top }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.bottom }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.accent }} />
                <span className="ml-1 truncate">{p.name}</span>
              </button>
            ))}
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
                  Gemini Flash 3.6
                </span>
              </h4>
              <p className="text-[11px] text-[#FAF8F5]/70">
                Live harmonic draping and real fabric texture styling
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
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
                savedToast
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#FAF8F5] hover:bg-white text-[#0a192f]'
              }`}
            >
              {savedToast ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  <span>Saved to Wardrobe!</span>
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
            className="w-full mb-4 p-3.5 rounded-2xl bg-[#0a192f] border border-[#FAF8F5]/20 text-xs space-y-1.5 z-10 relative shadow-xl"
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
            <p className="text-[#FAF8F5]/90 leading-relaxed text-[11px]">{aiSuggestion.aiStylistRationale}</p>
            {aiSuggestion.fabricTexture && (
              <p className="text-[10px] font-mono text-[#D4AF37]">
                Fabric Texture: {aiSuggestion.fabricTexture}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* CORE REAL RUNWAY CATWALK CANVAS & MANNEQUIN VISUALIZER   */}
      {/* ========================================================= */}
      <div className="relative w-full flex flex-col items-center justify-center py-2">
        <div
          className="relative w-full max-w-md h-[540px] rounded-3xl overflow-hidden border border-[#FAF8F5]/20 shadow-2xl bg-gradient-to-b from-[#071329] via-[#0a192f] to-[#030812] flex flex-col items-center justify-center p-4 group"
        >
          {/* Runway Catwalk Overhead Spotlights */}
          <div className="absolute top-0 left-0 right-0 h-40 bg-[radial-gradient(ellipse_at_top,_rgba(147,197,253,0.35)_0%,_rgba(30,58,138,0.15)_50%,_transparent_100%)] pointer-events-none" />
          
          {/* Perspective Runway Floor */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#02060f] via-[#0b172a] to-transparent pointer-events-none overflow-hidden">
            {/* Mirror Runway Floor Reflection Grid */}
            <div className="absolute inset-x-8 bottom-0 h-36 bg-gradient-to-t from-[#1e3a8a]/30 to-transparent rounded-t-[80px] border-t border-[#FAF8F5]/20 backdrop-blur-xs">
              <div className="w-full h-full flex justify-between px-6 opacity-30">
                <div className="w-px h-full bg-gradient-to-t from-white/40 to-transparent transform -skew-x-12" />
                <div className="w-px h-full bg-gradient-to-t from-white/60 to-transparent" />
                <div className="w-px h-full bg-gradient-to-t from-white/40 to-transparent transform skew-x-12" />
              </div>
            </div>

            {/* Dynamic Moving Runway Lights (When Walking) */}
            {isWalkActive && (
              <motion.div
                animate={{ y: [0, 60] }}
                transition={{ repeat: Infinity, duration: walkCycleDuration, ease: 'linear' }}
                className="absolute inset-0 flex justify-center opacity-40 pointer-events-none"
              >
                <div className="w-32 h-1 bg-gradient-to-r from-transparent via-[#FAF8F5] to-transparent" />
              </motion.div>
            )}
          </div>

          {/* Dynamic Walking & Posing Model Container */}
          <motion.div
            animate={{
              rotateY: turntableAngle,
              scale: isZoomed ? 1.25 : 1,
              y: isWalkActive ? [0, -8, 0] : 0,
            }}
            transition={{
              y: isWalkActive
                ? { repeat: Infinity, duration: walkCycleDuration / 2, ease: 'easeInOut' }
                : { type: 'spring', stiffness: 200, damping: 20 },
              rotateY: { duration: 0.5, ease: 'easeOut' },
            }}
            className="relative w-72 h-[460px] flex items-center justify-center z-10"
            style={{
              transform: `scale(${fitStyle === 'slim' ? 0.94 : fitStyle === 'oversized' ? 1.06 : 1})`,
            }}
          >
            {/* Dynamic Shadow Beneath Footsteps */}
            <motion.div
              animate={isWalkActive ? { scaleX: [0.85, 1.1, 0.85], opacity: [0.4, 0.7, 0.4] } : {}}
              transition={{ repeat: Infinity, duration: walkCycleDuration / 2, ease: 'easeInOut' }}
              className="absolute bottom-6 w-44 h-5 bg-black/60 blur-md rounded-full pointer-events-none"
            />

            {/* HIGH-FIDELITY VECTOR & FABRIC SHADER SVG */}
            <svg
              className="w-full h-full drop-shadow-2xl overflow-visible"
              viewBox="0 0 240 440"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* 1. REAL FABRIC TEXTURE FILTERS */}
                {/* Silk Sheen Shader */}
                <filter id="silkSheen" x="-20%" y="-20%" width="140%" height="140%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.03 0.08" numOctaves="2" result="noise" />
                  <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.15 0" in="noise" result="softNoise" />
                  <feBlend mode="overlay" in2="SourceGraphic" in="softNoise" />
                </filter>

                {/* Wool Crepe Suiting Texture */}
                <filter id="woolTwill" x="-20%" y="-20%" width="140%" height="140%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.08 0.4" numOctaves="2" result="twillNoise" />
                  <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.22 0" in="twillNoise" result="subtleTwill" />
                  <feBlend mode="multiply" in2="SourceGraphic" in="subtleTwill" />
                </filter>

                {/* Natural Skin Gradient */}
                <linearGradient id={`mannequinSkin-${skinTone}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={skin.highlight} />
                  <stop offset="45%" stopColor={skin.base} />
                  <stop offset="100%" stopColor={skin.shadow} />
                </linearGradient>

                {/* Hair Gradient with Gloss Sheen */}
                <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2D2118" />
                  <stop offset="50%" stopColor="#1A120B" />
                  <stop offset="100%" stopColor="#080503" />
                </linearGradient>

                {/* Metallic Gold Hardware Accent */}
                <linearGradient id="goldHardware" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FDE68A" />
                  <stop offset="50%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="#92400E" />
                </linearGradient>

                {/* Chrome Stand */}
                <linearGradient id="chromeStand" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#475569" />
                  <stop offset="50%" stopColor="#CBD5E1" />
                  <stop offset="100%" stopColor="#334155" />
                </linearGradient>

                {/* Walnut Finial */}
                <linearGradient id="walnutWood" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B4513" />
                  <stop offset="50%" stopColor="#5C2E0B" />
                  <stop offset="100%" stopColor="#2E1705" />
                </linearGradient>

                {/* Fabric Depth Gradient (Top) */}
                <linearGradient id="topFabricGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.22" />
                  <stop offset="40%" stopColor="#000000" stopOpacity="0.0" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0.38" />
                </linearGradient>

                {/* Fabric Depth Gradient (Bottom) */}
                <linearGradient id="bottomFabricGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.16" />
                  <stop offset="50%" stopColor="#000000" stopOpacity="0.0" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0.45" />
                </linearGradient>
              </defs>

              {/* ================================================= */}
              {/* 1. MODEL BODY / DRESS FORM                        */}
              {/* ================================================= */}
              {mannequinForm === 'dress_form' ? (
                <g id="dress-form-base">
                  <rect x="117" y="160" width="6" height="240" rx="2" fill="url(#chromeStand)" />
                  <path d="M120 400 L80 430 L90 432 L120 406 Z" fill="url(#chromeStand)" />
                  <path d="M120 400 L160 430 L150 432 L120 406 Z" fill="url(#chromeStand)" />
                  <circle cx="120" cy="400" r="7" fill="url(#chromeStand)" />
                  <ellipse cx="120" cy="62" rx="14" ry="8" fill="url(#walnutWood)" />
                  <rect x="116" y="52" width="8" height="12" rx="2" fill="url(#walnutWood)" />
                  <circle cx="120" cy="50" r="6" fill="url(#walnutWood)" />
                  <path
                    d="M80 84 Q120 92 160 84 L152 185 Q120 195 88 185 Z"
                    fill="#FAF8F5"
                  />
                  <line x1="120" y1="84" x2="120" y2="190" stroke="#8B7E66" strokeDasharray="3 3" strokeWidth="1.2" />
                  <path d="M88 135 Q120 145 152 135" stroke="#8B7E66" strokeDasharray="3 3" strokeWidth="1.2" fill="none" />
                </g>
              ) : activeGender === 'female' ? (
                <g id="female-model">
                  {/* Chic Chignon Hair */}
                  <path
                    d="M96 38 C96 18, 144 18, 144 38 C158 52, 156 86, 146 112 C134 116, 106 116, 94 112 C84 86, 82 52, 96 38 Z"
                    fill="url(#hairGrad)"
                  />
                  <ellipse cx="120" cy="28" rx="14" ry="12" fill="url(#hairGrad)" />
                  
                  {/* Head & Elegant Jawline */}
                  <ellipse cx="120" cy="48" rx="16" ry="20" fill={`url(#mannequinSkin-${skinTone})`} />
                  <rect x="114" y="66" width="12" height="18" rx="3" fill={`url(#mannequinSkin-${skinTone})`} />
                  
                  {/* Collarbone Definition */}
                  <path d="M106 82 Q114 85 120 84 Q126 85 134 82" stroke={skin.shadow} strokeWidth="1.5" strokeLinecap="round" fill="none" />

                  {/* Shoulders & Torso */}
                  <path d="M82 84 Q120 90 158 84 L150 165 Q120 174 90 165 Z" fill={`url(#mannequinSkin-${skinTone})`} />

                  {/* ARTICULATED LEGS WITH REAL WALKING ANIMATION */}
                  {/* Left Leg */}
                  <motion.g
                    animate={
                      isWalkActive
                        ? { rotate: [-14, 14, -14], originX: '107px', originY: '170px' }
                        : { rotate: -2 }
                    }
                    transition={
                      isWalkActive
                        ? { repeat: Infinity, duration: walkCycleDuration, ease: 'easeInOut' }
                        : {}
                    }
                  >
                    <rect x="98" y="165" width="18" height="215" rx="5" fill={`url(#mannequinSkin-${skinTone})`} />
                    {/* Left Stiletto Shoe */}
                    <path d="M96 380 L112 380 L116 398 L94 398 Z" fill="#0A192F" />
                    <line x1="112" y1="385" x2="114" y2="402" stroke="#FAF8F5" strokeWidth="2" />
                  </motion.g>

                  {/* Right Leg */}
                  <motion.g
                    animate={
                      isWalkActive
                        ? { rotate: [14, -14, 14], originX: '133px', originY: '170px' }
                        : { rotate: 3 }
                    }
                    transition={
                      isWalkActive
                        ? { repeat: Infinity, duration: walkCycleDuration, ease: 'easeInOut' }
                        : {}
                    }
                  >
                    <rect x="124" y="165" width="18" height="215" rx="5" fill={`url(#mannequinSkin-${skinTone})`} />
                    {/* Right Stiletto Shoe */}
                    <path d="M126 380 L142 380 L146 398 L124 398 Z" fill="#0A192F" />
                    <line x1="142" y1="385" x2="144" y2="402" stroke="#FAF8F5" strokeWidth="2" />
                  </motion.g>

                  {/* ARTICULATED ARMS (Swinging with Runway Walk) */}
                  {/* Left Arm */}
                  <motion.g
                    animate={
                      isWalkActive
                        ? { rotate: [12, -12, 12], originX: '82px', originY: '86px' }
                        : { rotate: 2 }
                    }
                    transition={
                      isWalkActive
                        ? { repeat: Infinity, duration: walkCycleDuration, ease: 'easeInOut' }
                        : {}
                    }
                  >
                    <path d="M82 86 L66 182 L76 185 L88 92 Z" fill={`url(#mannequinSkin-${skinTone})`} />
                    {/* Gold Bracelet Accent */}
                    <rect x="67" y="174" width="10" height="3" rx="1" fill="url(#goldHardware)" />
                  </motion.g>

                  {/* Right Arm */}
                  <motion.g
                    animate={
                      isWalkActive
                        ? { rotate: [-12, 12, -12], originX: '158px', originY: '86px' }
                        : { rotate: -3 }
                    }
                    transition={
                      isWalkActive
                        ? { repeat: Infinity, duration: walkCycleDuration, ease: 'easeInOut' }
                        : {}
                    }
                  >
                    <path d="M158 86 L174 182 L164 185 L152 92 Z" fill={`url(#mannequinSkin-${skinTone})`} />
                    {/* Gold Watch / Bracelet Accent */}
                    <rect x="163" y="174" width="10" height="3" rx="1" fill="url(#goldHardware)" />
                  </motion.g>
                </g>
              ) : (
                <g id="male-model">
                  {/* Tailored Male Haircut */}
                  <path
                    d="M96 34 C96 18, 144 18, 144 34 C150 46, 144 54, 120 54 C96 54, 90 46, 96 34 Z"
                    fill="url(#hairGrad)"
                  />
                  {/* Head & Broad Neck */}
                  <ellipse cx="120" cy="46" rx="18" ry="22" fill={`url(#mannequinSkin-${skinTone})`} />
                  <rect x="111" y="66" width="18" height="20" rx="4" fill={`url(#mannequinSkin-${skinTone})`} />
                  {/* Broad Shoulder Frame */}
                  <path d="M72 86 Q120 94 168 86 L156 175 Q120 182 84 175 Z" fill={`url(#mannequinSkin-${skinTone})`} />

                  {/* Male Legs (Articulated Walking) */}
                  <motion.g
                    animate={
                      isWalkActive
                        ? { rotate: [-15, 15, -15], originX: '105px', originY: '175px' }
                        : { rotate: -2 }
                    }
                    transition={
                      isWalkActive
                        ? { repeat: Infinity, duration: walkCycleDuration, ease: 'easeInOut' }
                        : {}
                    }
                  >
                    <rect x="94" y="175" width="22" height="210" rx="5" fill={`url(#mannequinSkin-${skinTone})`} />
                    {/* Italian Oxford Shoe */}
                    <path d="M88 385 L112 385 L116 404 L86 404 Z" fill="#0A192F" />
                    <line x1="86" y1="400" x2="116" y2="400" stroke="#FAF8F5" strokeWidth="1.5" />
                  </motion.g>

                  <motion.g
                    animate={
                      isWalkActive
                        ? { rotate: [15, -15, 15], originX: '135px', originY: '175px' }
                        : { rotate: 2 }
                    }
                    transition={
                      isWalkActive
                        ? { repeat: Infinity, duration: walkCycleDuration, ease: 'easeInOut' }
                        : {}
                    }
                  >
                    <rect x="124" y="175" width="22" height="210" rx="5" fill={`url(#mannequinSkin-${skinTone})`} />
                    <path d="M128 385 L152 385 L156 404 L126 404 Z" fill="#0A192F" />
                    <line x1="126" y1="400" x2="156" y2="400" stroke="#FAF8F5" strokeWidth="1.5" />
                  </motion.g>

                  {/* Male Arms */}
                  <motion.g
                    animate={
                      isWalkActive
                        ? { rotate: [14, -14, 14], originX: '72px', originY: '88px' }
                        : { rotate: 2 }
                    }
                    transition={
                      isWalkActive
                        ? { repeat: Infinity, duration: walkCycleDuration, ease: 'easeInOut' }
                        : {}
                    }
                  >
                    <path d="M72 88 L54 192 L66 195 L80 96 Z" fill={`url(#mannequinSkin-${skinTone})`} />
                    <rect x="56" y="185" width="10" height="4" rx="1" fill="#1E293B" />
                  </motion.g>

                  <motion.g
                    animate={
                      isWalkActive
                        ? { rotate: [-14, 14, -14], originX: '168px', originY: '88px' }
                        : { rotate: -2 }
                    }
                    transition={
                      isWalkActive
                        ? { repeat: Infinity, duration: walkCycleDuration, ease: 'easeInOut' }
                        : {}
                    }
                  >
                    <path d="M168 88 L186 192 L174 195 L160 96 Z" fill={`url(#mannequinSkin-${skinTone})`} />
                  </motion.g>
                </g>
              )}

              {/* ================================================= */}
              {/* 2. REAL BOTTOM GARMENTS LAYER (Tailored Fabrics)   */}
              {/* ================================================= */}
              {activeOutfit.bottomType === 'skirt' || activeOutfit.topType === 'saree' ? (
                <motion.g
                  id="real-skirt"
                  animate={isWalkActive ? { rotate: [-3, 3, -3], originX: '120px', originY: '150px' } : {}}
                  transition={isWalkActive ? { repeat: Infinity, duration: walkCycleDuration, ease: 'easeInOut' } : {}}
                  filter="url(#silkSheen)"
                >
                  {/* Accordion Pleated Silk Skirt */}
                  <path
                    d="M86 150 L154 150 L176 332 Q120 348 64 332 Z"
                    fill={bottomColor}
                  />
                  <path
                    d="M86 150 L154 150 L176 332 Q120 348 64 332 Z"
                    fill="url(#bottomFabricGrad)"
                  />
                  {/* Tailored Pleat Creases */}
                  <line x1="98" y1="152" x2="88" y2="334" stroke="#000" strokeOpacity="0.25" strokeWidth="1.5" />
                  <line x1="110" y1="152" x2="105" y2="338" stroke="#000" strokeOpacity="0.25" strokeWidth="1.5" />
                  <line x1="120" y1="152" x2="120" y2="340" stroke="#000" strokeOpacity="0.25" strokeWidth="1.5" />
                  <line x1="130" y1="152" x2="135" y2="338" stroke="#000" strokeOpacity="0.25" strokeWidth="1.5" />
                  <line x1="142" y1="152" x2="152" y2="334" stroke="#000" strokeOpacity="0.25" strokeWidth="1.5" />
                  {/* Metallic Waistband */}
                  <rect x="86" y="148" width="68" height="6" rx="2" fill="url(#goldHardware)" />
                </motion.g>
              ) : activeOutfit.bottomType === 'gown_skirt' || activeOutfit.topType === 'gown' ? (
                <motion.g
                  id="real-gown-skirt"
                  animate={isWalkActive ? { rotate: [-2, 2, -2], originX: '120px', originY: '140px' } : {}}
                  transition={isWalkActive ? { repeat: Infinity, duration: walkCycleDuration, ease: 'easeInOut' } : {}}
                  filter="url(#silkSheen)"
                >
                  {/* Floor-Length Flute Gown Skirt */}
                  <path
                    d="M88 140 L152 140 L184 395 Q120 412 56 395 Z"
                    fill={bottomColor}
                  />
                  <path
                    d="M88 140 L152 140 L184 395 Q120 412 56 395 Z"
                    fill="url(#bottomFabricGrad)"
                  />
                  {/* Flowing Gown Drapery Folds */}
                  <path d="M106 142 Q100 270 82 398" stroke="#000" strokeOpacity="0.22" strokeWidth="2.5" fill="none" />
                  <path d="M134 142 Q140 270 158 398" stroke="#000" strokeOpacity="0.22" strokeWidth="2.5" fill="none" />
                  <path d="M120 142 Q120 280 120 402" stroke="#FFFFFF" strokeOpacity="0.25" strokeWidth="1.5" fill="none" />
                </motion.g>
              ) : activeOutfit.bottomType === 'salwar_bottom' ? (
                <g id="real-salwar">
                  <path
                    d="M86 160 L154 160 L146 385 L124 385 L120 220 L116 385 L94 385 Z"
                    fill={bottomColor}
                    filter="url(#silkSheen)"
                  />
                  <path
                    d="M86 160 L154 160 L146 385 L124 385 L120 220 L116 385 L94 385 Z"
                    fill="url(#bottomFabricGrad)"
                  />
                  {/* Ankle Gathers & Zari Trims */}
                  <line x1="94" y1="375" x2="116" y2="375" stroke={accentColor} strokeWidth="2" />
                  <line x1="124" y1="375" x2="146" y2="375" stroke={accentColor} strokeWidth="2" />
                </g>
              ) : (
                /* Tailored Wool Trousers / Chinos / Selvedge Denim */
                <g id="real-tailored-trousers">
                  <path
                    d="M86 164 L154 164 L150 388 L126 388 L120 218 L114 388 L90 388 Z"
                    fill={bottomColor}
                    filter="url(#woolTwill)"
                  />
                  <path
                    d="M86 164 L154 164 L150 388 L126 388 L120 218 L114 388 L90 388 Z"
                    fill="url(#bottomFabricGrad)"
                  />
                  {/* Razor Sharp Center Creases */}
                  <line x1="102" y1="170" x2="102" y2="385" stroke="#FFFFFF" strokeOpacity="0.15" strokeWidth="1.2" />
                  <line x1="103" y1="170" x2="103" y2="385" stroke="#000000" strokeOpacity="0.3" strokeWidth="1.2" />
                  <line x1="137" y1="170" x2="137" y2="385" stroke="#FFFFFF" strokeOpacity="0.15" strokeWidth="1.2" />
                  <line x1="138" y1="170" x2="138" y2="385" stroke="#000000" strokeOpacity="0.3" strokeWidth="1.2" />
                  {/* Leather Belt & Metallic Buckle */}
                  <rect x="86" y="164" width="68" height="7" rx="1.5" fill="#3D2314" />
                  <rect x="114" y="163" width="12" height="9" rx="1.5" fill="url(#goldHardware)" />
                </g>
              )}

              {/* ================================================= */}
              {/* 3. REAL TOP GARMENTS LAYER (High-Couture Draping) */}
              {/* ================================================= */}
              {activeOutfit.topType === 'kurti' ? (
                <g id="real-kurti" filter="url(#silkSheen)">
                  {/* Chanderi Silk Kurti with Embroidered Zardozi Neckline */}
                  <path
                    d="M80 86 L160 86 L154 260 L140 260 L140 180 L100 180 L100 260 L86 260 Z"
                    fill={topColor}
                  />
                  <path
                    d="M80 86 L160 86 L154 260 L140 260 L140 180 L100 180 L100 260 L86 260 Z"
                    fill="url(#topFabricGrad)"
                  />
                  {/* Sleeves with Metallic Border */}
                  {mannequinForm === 'human' && (
                    <>
                      <path d="M80 86 L62 165 L76 167 L88 94 Z" fill={topColor} />
                      <line x1="62" y1="162" x2="76" y2="164" stroke="url(#goldHardware)" strokeWidth="3" />
                      <path d="M160 86 L178 165 L164 167 L152 94 Z" fill={topColor} />
                      <line x1="164" y1="164" x2="178" y2="162" stroke="url(#goldHardware)" strokeWidth="3" />
                    </>
                  )}
                  {/* Zardozi Gold Placket & Neckline */}
                  <path d="M106 86 C108 115, 132 115, 134 86" stroke="url(#goldHardware)" strokeWidth="3.5" fill="none" />
                  <line x1="120" y1="115" x2="120" y2="165" stroke="url(#goldHardware)" strokeWidth="2.5" />
                  <circle cx="120" cy="125" r="2" fill="#FAF8F5" />
                  <circle cx="120" cy="140" r="2" fill="#FAF8F5" />
                  <circle cx="120" cy="155" r="2" fill="#FAF8F5" />
                </g>
              ) : activeOutfit.topType === 'saree' ? (
                <g id="real-saree" filter="url(#silkSheen)">
                  {/* Fitted Silk Blouse */}
                  <path d="M82 86 L158 86 L150 145 L90 145 Z" fill={topColor} />
                  {/* Diagonal Draped Pallu Across Chest */}
                  <path
                    d="M82 86 L105 86 L154 172 L138 178 Z"
                    fill={topColor}
                  />
                  <path d="M82 86 L105 86 L154 172 L138 178 Z" fill="#000" fillOpacity="0.2" />
                  {/* Antique Gold Zari Border on Pallu */}
                  <line x1="82" y1="86" x2="154" y2="172" stroke="url(#goldHardware)" strokeWidth="4" />
                  {/* Blouse Sleeve with Gold Trim */}
                  {mannequinForm === 'human' && (
                    <>
                      <path d="M160 86 L174 135 L162 137 L152 94 Z" fill={topColor} />
                      <line x1="162" y1="137" x2="174" y2="135" stroke="url(#goldHardware)" strokeWidth="3" />
                    </>
                  )}
                </g>
              ) : activeOutfit.topType === 'gown' ? (
                <g id="real-gown-top" filter="url(#silkSheen)">
                  {/* Sculpted Sweetheart Bodice */}
                  <path
                    d="M84 94 Q120 108 156 94 L152 148 Q120 158 88 148 Z"
                    fill={topColor}
                  />
                  <path
                    d="M84 94 Q120 108 156 94 L152 148 Q120 158 88 148 Z"
                    fill="url(#topFabricGrad)"
                  />
                  {/* Princess Seams */}
                  <path d="M102 96 Q106 120 108 148" stroke="#000" strokeOpacity="0.2" strokeWidth="1.2" fill="none" />
                  <path d="M138 96 Q134 120 132 148" stroke="#000" strokeOpacity="0.2" strokeWidth="1.2" fill="none" />
                  {/* Gold Waist Cinnabar Belt */}
                  <rect x="88" y="142" width="64" height="6" rx="2" fill="url(#goldHardware)" />
                </g>
              ) : activeOutfit.topType === 'blazer' ? (
                <g id="real-blazer" filter="url(#woolTwill)">
                  {/* Crisp Silk Camisole / Dress Shirt Underneath */}
                  <path d="M104 86 L136 86 L130 170 L110 170 Z" fill="#FAF8F5" />
                  <path d="M112 86 L120 106 L128 86" stroke="#0A192F" strokeWidth="1.5" fill="none" />
                  
                  {/* Tailored Wool Tuxedo Bodice */}
                  <path
                    d="M74 88 L166 88 L158 190 L130 190 L120 135 L110 190 L82 190 Z"
                    fill={topColor}
                  />
                  <path
                    d="M74 88 L166 88 L158 190 L130 190 L120 135 L110 190 L82 190 Z"
                    fill="url(#topFabricGrad)"
                  />
                  
                  {/* Tailored Sleeves */}
                  {mannequinForm === 'human' && (
                    <>
                      <path d="M74 88 L56 185 L70 188 L84 96 Z" fill={topColor} />
                      <path d="M166 88 L184 185 L170 188 L156 96 Z" fill={topColor} />
                    </>
                  )}
                  {/* Peak Lapels */}
                  <path d="M92 88 L114 135 L96 135 Z" fill="#000" fillOpacity="0.3" />
                  <path d="M148 88 L126 135 L144 135 Z" fill="#000" fillOpacity="0.3" />
                  {/* Horn Buttons */}
                  <circle cx="120" cy="148" r="2.2" fill="url(#goldHardware)" />
                  <circle cx="120" cy="162" r="2.2" fill="url(#goldHardware)" />
                  {/* Silk Pocket Square */}
                  <path d="M140 118 L150 118 L148 122 L142 122 Z" fill="#FAF8F5" />
                </g>
              ) : activeOutfit.topType === 'kurta' ? (
                <g id="real-kurta" filter="url(#silkSheen)">
                  {/* Bandhgala Mandarin Kurta */}
                  <path
                    d="M74 88 L166 88 L158 240 L136 240 L136 175 L104 175 L104 240 L82 240 Z"
                    fill={topColor}
                  />
                  <path
                    d="M74 88 L166 88 L158 240 L136 240 L136 175 L104 175 L104 240 L82 240 Z"
                    fill="url(#topFabricGrad)"
                  />
                  {mannequinForm === 'human' && (
                    <>
                      <path d="M74 88 L58 185 L70 188 L84 96 Z" fill={topColor} />
                      <path d="M166 88 L182 185 L170 188 L156 96 Z" fill={topColor} />
                    </>
                  )}
                  {/* Mandarin Collar & Gold Placket Buttons */}
                  <rect x="110" y="80" width="20" height="8" rx="2" fill={topColor} />
                  <line x1="120" y1="88" x2="120" y2="155" stroke="url(#goldHardware)" strokeWidth="2.5" />
                  <circle cx="120" cy="100" r="2" fill="url(#goldHardware)" />
                  <circle cx="120" cy="114" r="2" fill="url(#goldHardware)" />
                  <circle cx="120" cy="128" r="2" fill="url(#goldHardware)" />
                  <circle cx="120" cy="142" r="2" fill="url(#goldHardware)" />
                </g>
              ) : (
                /* Classic Oxford Shirt / Fine Blouse */
                <g id="real-shirt" filter="url(#silkSheen)">
                  <path
                    d="M76 88 L164 88 L154 180 L86 180 Z"
                    fill={topColor}
                  />
                  <path
                    d="M76 88 L164 88 L154 180 L86 180 Z"
                    fill="url(#topFabricGrad)"
                  />
                  {mannequinForm === 'human' && (
                    <>
                      <path d="M76 88 L60 175 L72 178 L86 96 Z" fill={topColor} />
                      <path d="M164 88 L180 175 L168 178 L154 96 Z" fill={topColor} />
                    </>
                  )}
                  {/* Spread Collar & Mother of Pearl Buttons */}
                  <path d="M108 86 L120 104 L132 86" stroke="#000" strokeOpacity="0.3" strokeWidth="2" fill="none" />
                  <line x1="120" y1="104" x2="120" y2="175" stroke="#000" strokeOpacity="0.2" strokeWidth="1.5" />
                  <circle cx="120" cy="118" r="1.8" fill="url(#goldHardware)" />
                  <circle cx="120" cy="136" r="1.8" fill="url(#goldHardware)" />
                  <circle cx="120" cy="154" r="1.8" fill="url(#goldHardware)" />
                </g>
              )}
            </svg>
          </motion.div>

          {/* Bottom Draped Info Strip */}
          <div className="absolute bottom-3 left-3 right-3 bg-[#0a192f]/95 backdrop-blur-md p-3 rounded-2xl border border-[#FAF8F5]/15 z-20 flex items-center justify-between shadow-xl">
            <div>
              <span className="text-[9px] uppercase font-mono font-bold text-[#93c5fd] flex items-center gap-1.5">
                <Footprints className="w-3 h-3 text-[#38BDF8]" />
                <span>
                  {mannequinForm === 'dress_form'
                    ? 'Atelier Form'
                    : `${activeGender === 'female' ? "Women's" : "Men's"} Runway Catwalk`}
                </span>
                {isWalkActive && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                )}
              </span>
              <h5 className="text-xs font-serif font-bold text-white truncate max-w-[180px]">
                {activeOutfit.title}
              </h5>
            </div>
            
            <div className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-full border border-white/40 shadow-sm"
                style={{ backgroundColor: topColor }}
                title={`Top: ${topColor}`}
              />
              <span
                className="w-4 h-4 rounded-full border border-white/40 shadow-sm"
                style={{ backgroundColor: bottomColor }}
                title={`Bottom: ${bottomColor}`}
              />
              <span
                className="w-4 h-4 rounded-full border border-white/40 shadow-sm"
                style={{ backgroundColor: accentColor }}
                title={`Accent: ${accentColor}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* FIT & HARMONY CONTROLS */}
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

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span>Runway Pace:</span>
              {(['slow', 'medium', 'fast'] as const).map((spd) => (
                <button
                  key={spd}
                  onClick={() => setWalkSpeed(spd)}
                  className={`px-2 py-0.5 rounded-md text-[10px] capitalize transition-all ${
                    walkSpeed === spd
                      ? 'bg-[#FAF8F5] text-[#0a192f] font-bold'
                      : 'bg-[#0a192f] text-[#FAF8F5]/60 hover:text-white'
                  }`}
                >
                  {spd}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
