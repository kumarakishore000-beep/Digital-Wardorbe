'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Shirt,
  Eye,
  Check,
  Disc3,
  Play,
  Pause,
  Sliders,
  Radio,
  Compass,
  Bookmark,
} from 'lucide-react';
import MannequinVisualizer, { OutfitConfig } from '@/components/MannequinVisualizer';
import { useAuth, Gender } from '@/hooks/useAuth';

export interface ColorHarmony {
  name: string;
  trackNumber: string;
  colors: string[];
  description: string;
  genre: string;
}

// Convert HSL to Hex
function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s));
  l = Math.max(0, Math.min(100, l));
  const sNorm = s / 100;
  const lNorm = l / 100;
  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lNorm - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  const toHex = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

// Convert Hex to HSL
function hexToHsl(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [172, 44, 44]; // Fallback Lo-Flo Teal
  const r = parseInt(result[1], 16) / 255;
  const g = parseInt(result[2], 16) / 255;
  const b = parseInt(result[3], 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) * 60; break;
      case g: h = ((b - r) / d + 2) * 60; break;
      case b: h = ((r - g) / d + 4) * 60; break;
    }
  }
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}

export function getContrastColor(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '#FBF8F2';
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#18181B' : '#FBF8F2';
}

// Lo-Flo Records Curated Harmonic Modes
function getHarmonies(hex: string): ColorHarmony[] {
  const [h, s, l] = hexToHsl(hex);
  return [
    {
      name: 'Complementary',
      trackNumber: '01',
      genre: 'A-Side Duet',
      colors: [hex, hslToHex(h + 180, s, l)],
      description: 'High contrast dynamic tone — bold executive & stage statement',
    },
    {
      name: 'Split Complementary',
      trackNumber: '02',
      genre: 'Acoustic Trio',
      colors: [hex, hslToHex(h + 150, s, l), hslToHex(h + 210, s, l)],
      description: 'Two adjacent harmonic complements — vibrant yet refined balance',
    },
    {
      name: 'Triadic',
      trackNumber: '03',
      genre: 'Chamber Chords',
      colors: [hex, hslToHex(h + 120, s, l), hslToHex(h + 240, s, l)],
      description: 'Three equidistant spectrum hues — rich, spirited rhythm',
    },
    {
      name: 'Analogous',
      trackNumber: '04',
      genre: 'Velvet Harmony',
      colors: [hslToHex(h - 30, s, l), hex, hslToHex(h + 30, s, l)],
      description: 'Adjacent wavelength family — serene and organic resonance',
    },
    {
      name: 'Tetradic',
      trackNumber: '05',
      genre: 'Full Ensemble',
      colors: [hex, hslToHex(h + 90, s, l), hslToHex(h + 180, s, l), hslToHex(h + 270, s, l)],
      description: 'Four-point chromatic quartet — layered couture styling',
    },
    {
      name: 'Monochromatic',
      trackNumber: '06',
      genre: 'Solo Acoustic',
      colors: [
        hslToHex(h, Math.max(10, s - 30), Math.min(90, l + 25)),
        hex,
        hslToHex(h, Math.min(100, s + 15), Math.max(15, l - 25)),
      ],
      description: 'Single-hue tonal variations — timeless vintage elegance',
    },
  ];
}

// Lo-Flo Records Signature Archival Palette Presets
const LO_FLO_ARCHIVES = [
  { name: 'Studio Teal', hex: '#3EA094', note: 'Lo-Flo Signature' },
  { name: 'Jane Terracotta', hex: '#E36339', note: 'Warm Analog' },
  { name: 'Ochre Brass', hex: '#D4A343', note: 'Brass Section' },
  { name: 'Vinyl Noir', hex: '#232220', note: '33⅓ RPM Groove' },
  { name: 'Parchment Silk', hex: '#E5D8CA', note: 'Sleeve Liner' },
  { name: 'Lavender Haze', hex: '#9B86C8', note: 'Jazz Ballad' },
  { name: 'Sage Botanique', hex: '#5A8D76', note: 'French Studio' },
  { name: 'Crimson Velvet', hex: '#9E2A2B', note: 'Stage Curtain' },
];

interface ColorPickerProps {
  onColorSelect?: (hex: string) => void;
  onUseColorPicker?: () => void;
}

export default function ColorPicker({ onColorSelect, onUseColorPicker }: ColorPickerProps) {
  const { user, updateGender } = useAuth();
  const gender: Gender = user?.gender || 'female';

  // Default color inspired by Lo-Flo Records (#3EA094)
  const [selectedColor, setSelectedColor] = useState('#3EA094');
  const [activeHarmony, setActiveHarmony] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [vuLevels, setVuLevels] = useState([65, 82, 45, 90, 70]);

  const harmonies = getHarmonies(selectedColor);
  const [h, s, l] = hexToHsl(selectedColor);

  // Animate VU meter bars and vinyl rotation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setRotationAngle((prev) => (prev + 1.2) % 360);
        setVuLevels([
          Math.floor(40 + Math.random() * 55),
          Math.floor(50 + Math.random() * 45),
          Math.floor(30 + Math.random() * 60),
          Math.floor(60 + Math.random() * 35),
          Math.floor(45 + Math.random() * 50),
        ]);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Real clothing outfit recommendations mapped to the vintage aesthetic and mannequin
  const outfitCombinations: OutfitConfig[] = useMemo(() => {
    const baseColor = selectedColor;
    const accent1 = harmonies[activeHarmony].colors[1] || hslToHex(h + 180, s, l);
    const accent2 = harmonies[activeHarmony].colors[2] || hslToHex(h + 120, s, l);
    const neutralLight = '#FBF8F2';
    const neutralDark = '#232220';

    if (gender === 'male') {
      return [
        {
          title: 'Lo-Flo Tailored Studio Suit',
          topType: 'blazer',
          topColor: baseColor,
          bottomType: 'trousers',
          bottomColor: baseColor,
          outerwearColor: accent1 || neutralLight,
          accentColor: '#D4A343',
          description: `Archival ${baseColor} wool-crepe blazer paired with matching trousers and ${accent1} silk shirt.`,
        },
        {
          title: 'Jazz Lounge Silk Kurta & Trousers',
          topType: 'kurta',
          topColor: baseColor,
          bottomType: 'trousers',
          bottomColor: neutralLight,
          accentColor: accent1,
          description: `Flowing ${baseColor} artisanal textured kurta with ${neutralLight} pressed linen trousers.`,
        },
        {
          title: 'Oxford Button-Down with Chinos',
          topType: 'shirt',
          topColor: accent1 || neutralLight,
          bottomType: 'chinos',
          bottomColor: baseColor,
          outerwearColor: neutralDark,
          accentColor: '#E36339',
          description: `Crisp ${accent1} studio collar shirt over tailored ${baseColor} pleated chinos.`,
        },
        {
          title: 'Analog Knit Shrug & Dark Denim',
          topType: 'shrug',
          topColor: baseColor,
          bottomType: 'jeans',
          bottomColor: '#1E293B',
          accentColor: accent1,
          description: `Relaxed ${baseColor} ribbed cardigan layered over washed indigo denim and vintage accents.`,
        },
        {
          title: 'Vinyl Session Jacket & Minimal Tee',
          topType: 'tshirt',
          topColor: neutralLight,
          bottomType: 'trousers',
          bottomColor: neutralDark,
          outerwearColor: baseColor,
          accentColor: accent2 || '#D4A343',
          description: `Custom ${baseColor} zip studio blouson jacket with clean ivory base and dark slacks.`,
        },
      ];
    } else {
      return [
        {
          title: 'Jane McNealy Silk Evening Gown',
          topType: 'gown',
          topColor: baseColor,
          bottomType: 'gown_skirt',
          bottomColor: baseColor,
          accentColor: '#D4A343',
          description: `Floor-length ${baseColor} silk charmeuse concert gown with brass-toned vintage waist accent.`,
        },
        {
          title: 'Archival Pleated Midi & French Blouse',
          topType: 'skirt',
          topColor: accent1 || neutralLight,
          bottomType: 'skirt',
          bottomColor: baseColor,
          accentColor: accent2 || '#E36339',
          description: `Billowing ${accent1} crepe de chine blouse tucked into high-waist ${baseColor} accordion pleats.`,
        },
        {
          title: 'Draped Atelier Shrug & Raw Denim',
          topType: 'shrug',
          topColor: baseColor,
          bottomType: 'jeans',
          bottomColor: '#1E3A8A',
          accentColor: accent1 || neutralLight,
          description: `Open-front ${baseColor} fine-spun knit cardigan over neutral silk camisole and vintage denim.`,
        },
        {
          title: 'Emerald & Ochre Draped Saree',
          topType: 'saree',
          topColor: baseColor,
          bottomType: 'skirt',
          bottomColor: baseColor,
          outerwearColor: accent1 || '#D4A343',
          accentColor: '#E36339',
          description: `Handwoven ${baseColor} heritage saree with antique gold zari border and contrasting ${accent1} blouse.`,
        },
        {
          title: 'Studio Slip Dress & Structured Blazer',
          topType: 'croptop',
          topColor: accent1 || neutralLight,
          bottomType: 'jeans',
          bottomColor: baseColor,
          outerwearColor: baseColor,
          accentColor: accent2,
          description: `Monochromatic ${baseColor} tailored styling with contrasting ${accent1} underlayer.`,
        },
      ];
    }
  }, [gender, selectedColor, activeHarmony, harmonies, h, s, l]);

  const [activeOutfitIndex, setActiveOutfitIndex] = useState(0);

  const handleColorChange = useCallback((newColor: string) => {
    setSelectedColor(newColor);
    onColorSelect?.(newColor);
    onUseColorPicker?.();
  }, [onColorSelect, onUseColorPicker]);

  const handleHexInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (!value.startsWith('#')) value = '#' + value;
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      handleColorChange(value.toUpperCase());
    }
  }, [handleColorChange]);

  const handleHueChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newH = parseInt(e.target.value);
    const newColor = hslToHex(newH, s, l);
    handleColorChange(newColor);
  }, [s, l, handleColorChange]);

  const handleSatChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newS = parseInt(e.target.value);
    const newColor = hslToHex(h, newS, l);
    handleColorChange(newColor);
  }, [h, l, handleColorChange]);

  const handleLightChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newL = parseInt(e.target.value);
    const newColor = hslToHex(h, s, newL);
    handleColorChange(newColor);
  }, [h, s, handleColorChange]);

  // Click on vinyl record wheel to sample angle / hue
  const handleRecordWheelClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const clickX = e.clientX - centerX;
    const clickY = e.clientY - centerY;
    let deg = Math.atan2(clickY, clickX) * (180 / Math.PI) + 90;
    if (deg < 0) deg += 360;
    const newColor = hslToHex(Math.round(deg), s, l);
    handleColorChange(newColor);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-10 font-sans antialiased text-[#232220]">
      
      {/* ========================================================= */}
      {/* 1. VINTAGE FRENCH EDITORIAL HEADER (Julie Flogeac / Lo-Flo) */}
      {/* ========================================================= */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-3xl bg-[#FBF8F2] border border-[#E5D8CA] p-8 md:p-12 shadow-2xl"
        style={{
          backgroundImage: `
            radial-gradient(circle at 10% 20%, rgba(62, 160, 148, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 90% 80%, rgba(227, 99, 57, 0.08) 0%, transparent 40%),
            linear-gradient(to right, rgba(229, 216, 202, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(229, 216, 202, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 40px 40px, 40px 40px',
        }}
      >
        {/* Top Archival Header Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5D8CA] pb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#3EA094] flex items-center justify-center text-[#FBF8F2] shadow-md">
              <Disc3 className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <span className="font-mono text-[11px] font-bold tracking-[0.25em] uppercase text-[#E36339]">
                AURA ATELIER CHROMATIQUE
              </span>
              <p className="font-serif italic text-xs text-[#7A756D]">
                Haute Couture &amp; Dressing Palette Lab &bull; Paris &mdash; Milan &mdash; New York
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[#7A756D]">
            <span className="px-2.5 py-1 rounded-full bg-[#EFE8DE] border border-[#E5D8CA]">
              COUTURE PALETTE VOL. 02
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[#3EA094]/10 text-[#2E7D73] border border-[#3EA094]/30 font-bold">
              GARMENT DRAPE LAB
            </span>
            <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-[#E36339]/10 text-[#E36339] border border-[#E36339]/30">
              REF #AT-1974
            </span>
          </div>
        </div>

        {/* Main Title Banner */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#E5D8CA]/60 text-[#232220] text-xs font-mono tracking-widest uppercase">
              <Compass className="w-3.5 h-3.5 text-[#3EA094]" />
              <span>Dressing Chroma &amp; Silhouette Harmony Selector</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[#232220] leading-[1.08]">
              Color Harmonies <span className="italic font-normal text-[#3EA094]">&amp;</span> Couture Drapes
            </h1>
            <p className="text-[#5C564E] text-base sm:text-lg max-w-2xl font-normal leading-relaxed">
              Explore precision couture color theory, tonal garment layering, and luxury fabric harmonies. Compose seasonal fashion palettes and drape live tailored cuts directly onto the interactive studio mannequin.
            </p>
          </div>

          {/* Analog VU Meter and Status */}
          <div className="lg:col-span-4 bg-[#F5EFEB] border border-[#E5D8CA] rounded-2xl p-4 space-y-3 shadow-inner">
            <div className="flex items-center justify-between text-[11px] font-mono uppercase text-[#7A756D]">
              <span className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-[#E36339]" />
                Signal Spectrum
              </span>
              <span className="text-[#3EA094] font-bold">ACTIVE CHROMA</span>
            </div>

            {/* VU Bars */}
            <div className="flex items-end justify-between h-10 gap-2 px-1 pt-1 bg-[#EFE8DE]/80 rounded-lg">
              {vuLevels.map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col justify-end h-full gap-0.5">
                  <div
                    className="w-full rounded-sm transition-all duration-150"
                    style={{
                      height: `${val}%`,
                      backgroundColor:
                        val > 80 ? '#E36339' : val > 55 ? '#D4A343' : '#3EA094',
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-[#7A756D] pt-1">
              <span>HUE: {h}&deg;</span>
              <span>SAT: {s}%</span>
              <span>LUM: {l}%</span>
              <span className="font-bold text-[#232220]">{selectedColor}</span>
            </div>
          </div>
        </div>
      </motion.div>


      {/* ========================================================= */}
      {/* 2. MAIN STUDIO GRID (Turntable + Controls + Mannequin)    */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* ------------------------------------------------------- */}
        {/* LEFT COLUMN: TURNTABLE DISC & SOUNDBOARD CONTROLS (7 C)  */}
        {/* ------------------------------------------------------- */}
        <div className="lg:col-span-7 space-y-8">

          {/* TURNTABLE VINYL DISC UNIT */}
          <div className="relative rounded-3xl bg-[#FBF8F2] border border-[#E5D8CA] p-6 sm:p-8 shadow-xl overflow-hidden">
            
            {/* Header / Playback Switch */}
            <div className="flex items-center justify-between border-b border-[#E5D8CA] pb-4 mb-6">
              <div className="space-y-0.5">
                <h3 className="font-serif text-xl text-[#232220] flex items-center gap-2">
                  <Disc3 className="w-5 h-5 text-[#3EA094]" />
                  <span>Vinyl Wheel Synthesizer</span>
                </h3>
                <p className="font-mono text-xs text-[#7A756D]">
                  Click or drag around the concentric microgrooves to tune hue
                </p>
              </div>

              {/* Turntable Power Switch */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider transition-all duration-300 ${
                  isPlaying
                    ? 'bg-[#3EA094] text-[#FBF8F2] shadow-md shadow-[#3EA094]/20'
                    : 'bg-[#EFE8DE] text-[#7A756D] hover:bg-[#E5D8CA]'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>33⅓ RPM ON</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>TURNTABLE OFF</span>
                  </>
                )}
              </button>
            </div>

            {/* Turntable Deck Center */}
            <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 py-4">
              
              {/* Vinyl Disc Container */}
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 shrink-0 select-none">
                
                {/* Turntable Platter Outer Ring */}
                <div className="absolute inset-0 rounded-full bg-[#18181B] border-4 border-[#D4A343]/60 shadow-2xl p-1">
                  
                  {/* Rotating Vinyl Record */}
                  <div
                    onClick={handleRecordWheelClick}
                    className="relative w-full h-full rounded-full cursor-crosshair overflow-hidden transition-transform ease-linear"
                    style={{
                      transform: `rotate(${rotationAngle}deg)`,
                      background: `
                        radial-gradient(circle at 50% 50%, #232220 0%, #121214 30%, #1A1918 60%, #0F0E0E 100%)
                      `,
                      boxShadow: 'inset 0 0 30px rgba(0,0,0,0.9)',
                    }}
                  >
                    {/* Microgroove Rings */}
                    <div className="absolute inset-3 rounded-full border border-white/5 pointer-events-none" />
                    <div className="absolute inset-7 rounded-full border border-white/10 pointer-events-none" />
                    <div className="absolute inset-12 rounded-full border border-white/5 pointer-events-none" />
                    <div className="absolute inset-16 rounded-full border border-white/10 pointer-events-none" />
                    <div className="absolute inset-20 rounded-full border border-white/5 pointer-events-none" />
                    
                    {/* Specular Vinyl Sheen Gradient */}
                    <div
                      className="absolute inset-0 rounded-full pointer-events-none opacity-30"
                      style={{
                        background:
                          'conic-gradient(from 45deg, transparent 0deg, rgba(255,255,255,0.4) 60deg, transparent 120deg, transparent 180deg, rgba(255,255,255,0.4) 240deg, transparent 300deg)',
                      }}
                    />

                    {/* Center Album Label */}
                    <div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border-2 border-[#D4A343] flex flex-col items-center justify-center p-2 text-center shadow-2xl"
                      style={{
                        backgroundColor: selectedColor,
                        color: getContrastColor(selectedColor),
                      }}
                    >
                      <span className="font-mono text-[8px] tracking-[0.2em] font-bold uppercase opacity-80">
                        LO-FLO
                      </span>
                      <span className="font-mono text-xs font-black tracking-tight my-0.5">
                        {selectedColor}
                      </span>
                      <span className="font-serif italic text-[9px] opacity-90 leading-tight">
                        {harmonies[activeHarmony].name}
                      </span>
                      {/* Center Spindle Hole */}
                      <div className="w-3.5 h-3.5 rounded-full bg-[#18181B] border border-[#D4A343] mt-1 shadow-inner" />
                    </div>
                  </div>
                </div>

                {/* Turntable Stylus Tonearm Needle */}
                <div
                  className="absolute -top-3 -right-2 w-16 h-40 pointer-events-none transition-transform duration-700 origin-top-right"
                  style={{
                    transform: isPlaying ? 'rotate(18deg)' : 'rotate(0deg)',
                  }}
                >
                  {/* Tonearm Base */}
                  <div className="absolute top-0 right-0 w-8 h-8 rounded-full bg-[#E5D8CA] border-2 border-[#7A756D] shadow-md flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-[#D4A343]" />
                  </div>
                  {/* Metallic Arm */}
                  <div className="absolute top-6 right-3 w-1.5 h-28 bg-gradient-to-b from-[#7A756D] via-[#D4A343] to-[#232220] rounded-full shadow-sm origin-top" />
                  {/* Cartridge & Needle Head */}
                  <div className="absolute bottom-2 right-1 w-5 h-7 bg-[#E36339] border border-[#232220] rounded-sm shadow-lg flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-white animate-ping" />
                  </div>
                </div>

                {/* Harmonic Spectrum Pins on Vinyl Perimeter */}
                {harmonies[activeHarmony].colors.map((color, idx) => {
                  if (idx === 0) return null;
                  const [pinH] = hexToHsl(color);
                  const rad = (pinH - 90) * (Math.PI / 180);
                  const radius = 120;
                  const x = Math.cos(rad) * radius;
                  const y = Math.sin(rad) * radius;
                  return (
                    <div
                      key={idx}
                      className="absolute w-5 h-5 rounded-full border-2 border-white shadow-xl flex items-center justify-center transition-all duration-500 pointer-events-none"
                      style={{
                        backgroundColor: color,
                        top: `calc(50% + ${y}px)`,
                        left: `calc(50% + ${x}px)`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                    </div>
                  );
                })}
              </div>

              {/* Side Dial & Hex Manual Tuner */}
              <div className="flex-1 w-full space-y-4">
                
                {/* Direct Swatch & Hex */}
                <div className="bg-[#F5EFEB] border border-[#E5D8CA] rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono uppercase text-[#7A756D]">
                    <span>Active Master Tint</span>
                    <span className="font-bold text-[#E36339]">{harmonies[activeHarmony].genre}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={selectedColor}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="w-12 h-12 rounded-xl cursor-pointer border-2 border-[#E5D8CA] bg-transparent shrink-0"
                    />
                    <div className="flex-1">
                      <input
                        type="text"
                        defaultValue={selectedColor}
                        key={selectedColor}
                        onBlur={handleHexInput}
                        onKeyDown={(e) => e.key === 'Enter' && handleHexInput(e as unknown as React.FocusEvent<HTMLInputElement>)}
                        placeholder="#3EA094"
                        className="w-full bg-[#FBF8F2] border border-[#E5D8CA] rounded-xl px-4 py-2.5 text-[#232220] font-mono text-base font-bold focus:outline-none focus:border-[#3EA094] shadow-inner"
                      />
                    </div>
                  </div>
                </div>

                {/* Studio Analog Fader Sliders */}
                <div className="space-y-3.5 bg-[#F5EFEB] border border-[#E5D8CA] rounded-2xl p-4">
                  
                  {/* Hue Degree Fader */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono text-[#5C564E]">
                      <span className="flex items-center gap-1">
                        <Sliders className="w-3 h-3 text-[#3EA094]" />
                        Frequency Hue
                      </span>
                      <span className="font-bold text-[#232220]">{h}&deg;</span>
                    </div>
                    <input
                      type="range" min="0" max="360" value={h}
                      onChange={handleHueChange}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer bg-gradient-to-r from-red-500 via-green-500 via-blue-500 to-red-500"
                    />
                  </div>

                  {/* Saturation Fader */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono text-[#5C564E]">
                      <span>Chroma Saturation</span>
                      <span className="font-bold text-[#232220]">{s}%</span>
                    </div>
                    <input
                      type="range" min="0" max="100" value={s}
                      onChange={handleSatChange}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer bg-[#E5D8CA] accent-[#E36339]"
                    />
                  </div>

                  {/* Lightness Fader */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono text-[#5C564E]">
                      <span>Luminance Gain</span>
                      <span className="font-bold text-[#232220]">{l}%</span>
                    </div>
                    <input
                      type="range" min="10" max="90" value={l}
                      onChange={handleLightChange}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer bg-[#E5D8CA] accent-[#D4A343]"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Curated Lo-Flo Archival Quick Presets */}
            <div className="mt-6 pt-5 border-t border-[#E5D8CA] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold tracking-wider uppercase text-[#7A756D] flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5 text-[#D4A343]" />
                  Lo-Flo Archives Presets
                </span>
                <span className="font-mono text-[10px] text-[#7A756D]">PARIS VAULT 1974</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {LO_FLO_ARCHIVES.map((item) => (
                  <button
                    key={item.hex}
                    onClick={() => handleColorChange(item.hex)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                      selectedColor.toLowerCase() === item.hex.toLowerCase()
                        ? 'bg-[#EFE8DE] border-[#3EA094] ring-1 ring-[#3EA094]/40 shadow-sm'
                        : 'bg-[#F5EFEB] border-[#E5D8CA] hover:bg-[#EFE8DE]'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-black/10 shrink-0 shadow-sm"
                      style={{ backgroundColor: item.hex }}
                    />
                    <div className="overflow-hidden">
                      <p className="font-serif text-xs font-bold text-[#232220] truncate">{item.name}</p>
                      <p className="font-mono text-[9px] text-[#7A756D]">{item.hex}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* HARMONY TRACKLIST SELECTOR (Styled as Vinyl Track Selector) */}
          <div className="rounded-3xl bg-[#FBF8F2] border border-[#E5D8CA] p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#E5D8CA] pb-4">
              <div>
                <span className="font-mono text-[11px] font-bold tracking-widest uppercase text-[#E36339]">
                  ALBUM TRACKS
                </span>
                <h3 className="font-serif text-2xl text-[#232220]">Harmonic Chord Progressions</h3>
              </div>
              <span className="font-mono text-xs text-[#7A756D]">SIDE A &bull; STEREO</span>
            </div>

            {/* Tracklist Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {harmonies.map((harmony, idx) => {
                const isActive = activeHarmony === idx;
                return (
                  <button
                    key={harmony.name}
                    onClick={() => setActiveHarmony(idx)}
                    className={`p-4 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden flex flex-col justify-between gap-3 ${
                      isActive
                        ? 'bg-[#232220] text-[#FBF8F2] border-[#232220] shadow-lg ring-2 ring-[#D4A343]/50'
                        : 'bg-[#F5EFEB] text-[#232220] border-[#E5D8CA] hover:bg-[#EFE8DE]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between font-mono text-[10px] uppercase opacity-70 mb-1">
                        <span>TRACK {harmony.trackNumber}</span>
                        <span>{harmony.genre}</span>
                      </div>
                      <h4 className="font-serif text-base font-bold leading-snug">{harmony.name}</h4>
                    </div>

                    {/* Mini Swatches Preview */}
                    <div className="flex items-center gap-1.5 pt-1">
                      {harmony.colors.map((c, cIdx) => (
                        <span
                          key={cIdx}
                          className="w-5 h-5 rounded-md border border-black/10 shadow-sm"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Trackliner Note */}
            <div className="p-4 rounded-2xl bg-[#F5EFEB] border border-[#E5D8CA] flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#3EA094] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-serif text-sm font-bold text-[#232220]">
                  Track {harmonies[activeHarmony].trackNumber}: {harmonies[activeHarmony].name} &mdash;{' '}
                  <span className="font-mono text-xs font-normal text-[#E36339]">
                    {harmonies[activeHarmony].genre}
                  </span>
                </p>
                <p className="text-xs text-[#5C564E] leading-relaxed">
                  {harmonies[activeHarmony].description}
                </p>
              </div>
            </div>
          </div>

          {/* REAL CLOTHING OUTFIT RECOMMENDATIONS (Vinyl Liner Notes) */}
          <div className="rounded-3xl bg-[#FBF8F2] border border-[#E5D8CA] p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#E5D8CA] pb-4">
              <div>
                <span className="font-mono text-[11px] font-bold tracking-widest uppercase text-[#3EA094]">
                  STUDIO LINER NOTES
                </span>
                <h3 className="font-serif text-2xl text-[#232220]">
                  Atelier Wardrobe Compositions
                </h3>
              </div>
              <span className="font-mono text-xs text-[#7A756D]">
                {gender === 'female' ? 'Women’s Collection' : 'Men’s Collection'}
              </span>
            </div>

            {/* Outfit Cards */}
            <div className="space-y-4">
              {outfitCombinations.map((item, idx) => {
                const isWearing = activeOutfitIndex === idx;
                return (
                  <motion.div
                    key={(item.title || 'outfit') + idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-5 ${
                      isWearing
                        ? 'bg-[#232220] text-[#FBF8F2] border-[#232220] shadow-xl ring-2 ring-[#3EA094]'
                        : 'bg-[#F5EFEB] border-[#E5D8CA] text-[#232220] hover:bg-[#EFE8DE]'
                    }`}
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-[11px] font-bold text-[#E36339]">
                          SIDE A &bull; {String(idx + 1).padStart(2, '0')}
                        </span>
                        <h4 className="font-serif text-lg font-bold leading-snug">{item.title}</h4>
                        {isWearing && (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#3EA094] text-white font-mono text-[9px] font-bold tracking-wider uppercase">
                            LIVE ON MANNEQUIN
                          </span>
                        )}
                      </div>
                      
                      <p className={`text-xs leading-relaxed ${isWearing ? 'text-[#E5D8CA]' : 'text-[#5C564E]'}`}>
                        {item.description}
                      </p>

                      {/* Garment Swatch Tags */}
                      <div className="flex flex-wrap items-center gap-2 pt-1.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-mono border ${
                            isWearing
                              ? 'bg-white/10 border-white/20 text-white'
                              : 'bg-[#FBF8F2] border-[#E5D8CA] text-[#232220]'
                          }`}
                        >
                          <span
                            className="w-3 h-3 rounded-full border border-black/20"
                            style={{ backgroundColor: item.topColor }}
                          />
                          <strong className="capitalize font-medium">{item.topType}:</strong> {item.topColor}
                        </span>

                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-mono border ${
                            isWearing
                              ? 'bg-white/10 border-white/20 text-white'
                              : 'bg-[#FBF8F2] border-[#E5D8CA] text-[#232220]'
                          }`}
                        >
                          <span
                            className="w-3 h-3 rounded-full border border-black/20"
                            style={{ backgroundColor: item.bottomColor }}
                          />
                          <strong className="capitalize font-medium">
                            {item.bottomType.replace('_', ' ')}:
                          </strong>{' '}
                          {item.bottomColor}
                        </span>

                        {item.outerwearColor && (
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-mono border ${
                              isWearing
                                ? 'bg-white/10 border-white/20 text-white'
                                : 'bg-[#FBF8F2] border-[#E5D8CA] text-[#232220]'
                            }`}
                          >
                            <span
                              className="w-3 h-3 rounded-full border border-black/20"
                              style={{ backgroundColor: item.outerwearColor }}
                            />
                            <strong className="font-medium">Jacket:</strong> {item.outerwearColor}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Cue Button */}
                    <button
                      onClick={() => setActiveOutfitIndex(idx)}
                      className={`shrink-0 px-5 py-3 rounded-xl font-mono text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all ${
                        isWearing
                          ? 'bg-[#3EA094] text-white shadow-md'
                          : 'bg-[#E36339] hover:bg-[#cc522a] text-white shadow-md'
                      }`}
                    >
                      {isWearing ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>WORN ON MANNEQUIN</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          <span>CUE ON MANNEQUIN</span>
                        </>
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>


        {/* ------------------------------------------------------- */}
        {/* RIGHT COLUMN: MANNEQUIN ATELIER STUDIO (5 Columns)       */}
        {/* ------------------------------------------------------- */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          
          <div className="rounded-3xl bg-[#FBF8F2] border border-[#E5D8CA] p-6 sm:p-7 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#E5D8CA] pb-3.5">
              <div className="space-y-0.5">
                <span className="font-mono text-[10px] font-bold tracking-widest uppercase text-[#3EA094]">
                  STUDIO FITTING BOOTH
                </span>
                <h3 className="font-serif text-xl text-[#232220] flex items-center gap-2">
                  <Shirt className="w-5 h-5 text-[#E36339]" />
                  <span>Interactive Mannequin</span>
                </h3>
              </div>

              <div className="w-2.5 h-2.5 rounded-full bg-[#3EA094] animate-pulse" />
            </div>

            {/* Mannequin Component Render */}
            <div className="bg-[#F5EFEB] border border-[#E5D8CA] rounded-2xl p-4 shadow-inner">
              <MannequinVisualizer
                gender={gender}
                onGenderChange={(newGender) => updateGender(newGender)}
                outfit={outfitCombinations[activeOutfitIndex]}
                showControls={true}
              />
            </div>

            {/* Liner Footer Spec */}
            <div className="p-4 rounded-2xl bg-[#EFE8DE] border border-[#E5D8CA] space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono uppercase text-[#7A756D]">
                <span>Current Track Outfit</span>
                <span className="font-bold text-[#E36339]">
                  {gender === 'female' ? 'Women' : 'Men'} Cut
                </span>
              </div>
              <p className="font-serif text-sm font-bold text-[#232220]">
                {outfitCombinations[activeOutfitIndex]?.title}
              </p>
              <p className="text-xs text-[#5C564E]">
                {outfitCombinations[activeOutfitIndex]?.description}
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================= */}
      {/* 3. ARCHIVAL FOOTER                                        */}
      {/* ========================================================= */}
      <div className="text-center py-6 border-t border-[#E5D8CA] text-xs font-mono text-[#7A756D] space-y-1">
        <p className="uppercase tracking-widest">
          Aura Atelier Chromatique &bull; Haute Couture Dressing &amp; Color Harmony Laboratory
        </p>
        <p className="italic font-serif text-[11px] text-[#A8A196]">
          Archived &amp; preserved for StyleMatch AI Digital Wardrobe
        </p>
      </div>

    </div>
  );
}
