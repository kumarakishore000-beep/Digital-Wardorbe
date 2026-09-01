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
  if (!result) return [224, 64, 33]; // Default Primary (#1E3A8A)
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
  if (!result) return '#FFFFF0';
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#0A192F' : '#FAF8F5';
}

// Harmonic Modes
function getHarmonies(hex: string): ColorHarmony[] {
  const [h, s, l] = hexToHsl(hex);
  return [
    {
      name: 'Complementary',
      trackNumber: '01',
      genre: 'Duet Tone',
      colors: [hex, hslToHex(h + 180, s, l)],
      description: 'High contrast dynamic tone — bold executive & gala presence',
    },
    {
      name: 'Split Complementary',
      trackNumber: '02',
      genre: 'Atelier Trio',
      colors: [hex, hslToHex(h + 150, s, l), hslToHex(h + 210, s, l)],
      description: 'Two adjacent harmonic complements — vibrant yet refined tonal balance',
    },
    {
      name: 'Triadic',
      trackNumber: '03',
      genre: 'Harmonic Chords',
      colors: [hex, hslToHex(h + 120, s, l), hslToHex(h + 240, s, l)],
      description: 'Three equidistant spectrum hues — rich, spirited rhythm',
    },
    {
      name: 'Analogous',
      trackNumber: '04',
      genre: 'Silk Harmony',
      colors: [hslToHex(h - 30, s, l), hex, hslToHex(h + 30, s, l)],
      description: 'Adjacent wavelength family — serene tonal & indigo resonance',
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
      genre: 'Pure Tones',
      colors: [
        hslToHex(h, Math.max(10, s - 30), Math.min(90, l + 25)),
        hex,
        hslToHex(h, Math.min(100, s + 15), Math.max(15, l - 25)),
      ],
      description: 'Single-hue tonal variations — timeless monochromatic elegance',
    },
  ];
}

// Curated Archival Presets
const CURATED_ARCHIVES = [
  { name: 'Signature Master', hex: '#1E3A8A', note: 'Primary Hue' },
  { name: 'Warm Silk Tone', hex: '#FFFFF0', note: 'Heritage Light' },
  { name: 'Imperial Midnight', hex: '#0A192F', note: 'Midnight Blue' },
  { name: 'Cream Silk Shade', hex: '#FAF8F5', note: 'Silk Drape' },
  { name: 'Vibrant Azure', hex: '#2563EB', note: 'Electric Hue' },
  { name: 'Ochre Gold Accent', hex: '#D4A343', note: 'Zari Metallic' },
  { name: 'Soft Linen Tone', hex: '#EAE3D2', note: 'Woven Texture' },
  { name: 'Deep Indigo Navy', hex: '#0F254E', note: 'Tailored Twill' },
];

interface ColorPickerProps {
  onColorSelect?: (hex: string) => void;
  onUseColorPicker?: () => void;
}

export default function ColorPicker({ onColorSelect, onUseColorPicker }: ColorPickerProps) {
  const { user, updateGender } = useAuth();
  const gender: Gender = user?.gender || 'female';

  // Default color: Primary Hue (#1E3A8A)
  const [selectedColor, setSelectedColor] = useState('#1E3A8A');
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

  // Real clothing outfit recommendations mapped to harmonic color theory
  const outfitCombinations: OutfitConfig[] = useMemo(() => {
    const baseColor = selectedColor;
    const accent1 = harmonies[activeHarmony].colors[1] || hslToHex(h + 180, s, l);
    const neutralLight = '#FAF8F5';
    const neutralDark = '#0A192F';

    if (gender === 'male') {
      return [
        {
          title: 'Signature Tailored Suit',
          topType: 'blazer',
          topColor: baseColor,
          bottomType: 'trousers',
          bottomColor: baseColor,
          outerwearColor: neutralLight,
          accentColor: '#D4A343',
          description: `Bespoke ${baseColor} wool-crepe blazer paired with matching trousers and ${neutralLight} silk shirt.`,
        },
        {
          title: 'Structured Bandhgala & Chinos',
          topType: 'kurta',
          topColor: baseColor,
          bottomType: 'trousers',
          bottomColor: neutralLight,
          accentColor: accent1,
          description: `Structured ${baseColor} bandhgala jacket with ${neutralLight} pressed trousers.`,
        },
        {
          title: 'Oxford Shirt with Navy Trousers',
          topType: 'shirt',
          topColor: neutralLight,
          bottomType: 'chinos',
          bottomColor: baseColor,
          outerwearColor: neutralDark,
          accentColor: '#D4A343',
          description: `Crisp ${neutralLight} Oxford shirt over tailored ${baseColor} pleated chinos.`,
        },
        {
          title: 'Indigo Knit Shrug & Dark Denim',
          topType: 'shrug',
          topColor: baseColor,
          bottomType: 'jeans',
          bottomColor: '#0F254E',
          accentColor: accent1,
          description: `Fine-spun ${baseColor} cardigan layered over deep selvedge denim.`,
        },
        {
          title: 'Atelier Utility Zip Jacket',
          topType: 'tshirt',
          topColor: neutralLight,
          bottomType: 'trousers',
          bottomColor: neutralDark,
          outerwearColor: baseColor,
          accentColor: '#D4A343',
          description: `Custom ${baseColor} zip blouson jacket with clean light base and dark trousers.`,
        },
      ];
    } else {
      return [
        {
          title: 'Silk Evening Gown',
          topType: 'gown',
          topColor: baseColor,
          bottomType: 'gown_skirt',
          bottomColor: baseColor,
          accentColor: '#D4A343',
          description: `Floor-length ${baseColor} silk charmeuse gala gown with gold waist accents.`,
        },
        {
          title: 'Crepe Blouse & Pleated Skirt',
          topType: 'shirt',
          topColor: neutralLight,
          bottomType: 'skirt',
          bottomColor: baseColor,
          accentColor: '#D4A343',
          description: `Billowing ${neutralLight} crepe de chine blouse tucked into high-waist ${baseColor} accordion pleats.`,
        },
        {
          title: 'Atelier Cape & Trousers',
          topType: 'shrug',
          topColor: baseColor,
          bottomType: 'jeans',
          bottomColor: '#0A192F',
          accentColor: neutralLight,
          description: `Open-front ${baseColor} sheer cape over neutral silk camisole and tailored pants.`,
        },
        {
          title: 'Heritage Silk Saree',
          topType: 'saree',
          topColor: baseColor,
          bottomType: 'skirt',
          bottomColor: baseColor,
          outerwearColor: neutralLight,
          accentColor: '#D4A343',
          description: `Handwoven ${baseColor} heritage silk saree with contrasting pallu and antique gold zari border.`,
        },
        {
          title: 'Camisole & Structured Blazer',
          topType: 'croptop',
          topColor: neutralLight,
          bottomType: 'jeans',
          bottomColor: baseColor,
          outerwearColor: baseColor,
          accentColor: '#D4A343',
          description: `Tailored ${baseColor} double-breasted blazer over a silk underlayer.`,
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
    <div className="w-full max-w-7xl mx-auto space-y-10 font-sans antialiased text-[#FAF8F5]">
      
      {/* ========================================================= */}
      {/* 1. ATELIER COLOR LAB HEADER                               */}
      {/* ========================================================= */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-[#0f254e]/60 border border-[#FAF8F5]/20 p-8 md:p-12 shadow-2xl backdrop-blur-xl"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#FAF8F5]/15 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1e3a8a] border border-[#FAF8F5]/30 flex items-center justify-center text-[#FAF8F5] shadow-lg shadow-[#1e3a8a]/40">
              <Disc3 className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <span className="font-mono text-[11px] font-bold tracking-[0.25em] uppercase text-[#93c5fd]">
                ATELIER COLOR LAB
              </span>
              <p className="font-serif italic text-xs text-[#FAF8F5]/70">
                Precision Chromatics &bull; Dressing Harmony &bull; Atelier Mannequin
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[#FAF8F5]/70">
            <span className="px-2.5 py-1 rounded-full bg-[#0a192f] border border-[#FAF8F5]/15 text-[#FAF8F5]">
              PALETTE VOL. 01
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[#1e3a8a]/40 text-[#FAF8F5] border border-[#FAF8F5]/30 font-bold">
              HARMONIC DRAPE LAB
            </span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1e3a8a]/30 text-[#FAF8F5] text-xs font-mono tracking-widest uppercase border border-[#FAF8F5]/20">
              <Compass className="w-3.5 h-3.5 text-[#fffff0]" />
              <span>Precision Spectrum Studio</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[#FAF8F5] leading-[1.08]">
              Chromatic <span className="italic font-normal text-[#93c5fd]">&amp;</span> Tonal Harmonies
            </h1>
            <p className="text-[#FAF8F5]/75 text-base sm:text-lg max-w-2xl font-normal leading-relaxed">
              Explore harmonic color theory, tonal garment layering, and luxury fabric balance. Compose seasonal fashion palettes and drape live tailored cuts directly onto the interactive studio mannequin.
            </p>
          </div>

          {/* VU Meter Status */}
          <div className="lg:col-span-4 bg-[#0a192f]/80 border border-[#FAF8F5]/15 rounded-2xl p-4 space-y-3 shadow-inner">
            <div className="flex items-center justify-between text-[11px] font-mono uppercase text-[#FAF8F5]/70">
              <span className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-[#93c5fd]" />
                Signal Spectrum
              </span>
              <span className="text-[#FAF8F5] font-bold">ACTIVE CHROMA</span>
            </div>

            <div className="flex items-end justify-between h-10 gap-2 px-1 pt-1 bg-[#050d1a] rounded-lg">
              {vuLevels.map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col justify-end h-full gap-0.5">
                  <div
                    className="w-full rounded-sm transition-all duration-150"
                    style={{
                      height: `${val}%`,
                      backgroundColor: val > 80 ? '#FAF8F5' : val > 55 ? '#3b82f6' : '#1e3a8a',
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-[#FAF8F5]/70 pt-1">
              <span>HUE: {h}&deg;</span>
              <span>SAT: {s}%</span>
              <span>LUM: {l}%</span>
              <span className="font-bold text-[#FAF8F5]">{selectedColor}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ========================================================= */}
      {/* 2. MAIN CHROMATIC WORKSPACE & MANNEQUIN STUDIO            */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: VINYL DISK TURNTABLE & FADERS */}
        <div className="lg:col-span-7 space-y-8">
          
          <div className="rounded-3xl bg-[#0f254e]/50 border border-[#FAF8F5]/15 p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* Turntable Control Header */}
            <div className="flex items-center justify-between border-b border-[#FAF8F5]/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#1e3a8a] text-[#FAF8F5]">
                  <Disc3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-[#FAF8F5]">Vinyl Color Turntable</h3>
                  <p className="font-mono text-[10px] uppercase text-[#FAF8F5]/60">
                    33⅓ RPM Dynamic Chroma Rotor
                  </p>
                </div>
              </div>

              {/* Play / Pause RPM motor */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-4 py-2 rounded-xl font-mono text-xs font-bold tracking-wider uppercase flex items-center gap-2 transition-all ${
                  isPlaying
                    ? 'bg-[#FAF8F5] text-[#0a192f] shadow-lg'
                    : 'bg-[#1e3a8a] text-[#FAF8F5] hover:bg-[#2563eb]'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>PAUSE ROTOR</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>SPIN VINYL</span>
                  </>
                )}
              </button>
            </div>

            {/* Turntable Deck Center */}
            <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 py-4">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 shrink-0 select-none">
                <div className="absolute inset-0 rounded-full bg-[#050d1a] border-4 border-[#FAF8F5]/30 shadow-2xl p-1">
                  <div
                    onClick={handleRecordWheelClick}
                    className="relative w-full h-full rounded-full cursor-crosshair overflow-hidden transition-transform ease-linear"
                    style={{
                      transform: `rotate(${rotationAngle}deg)`,
                      background: `
                        radial-gradient(circle at 50% 50%, #0a192f 0%, #050d1a 60%, #000000 100%)
                      `,
                      boxShadow: 'inset 0 0 30px rgba(0,0,0,0.9)',
                    }}
                  >
                    <div className="absolute inset-3 rounded-full border border-white/5 pointer-events-none" />
                    <div className="absolute inset-7 rounded-full border border-white/10 pointer-events-none" />
                    <div className="absolute inset-12 rounded-full border border-white/5 pointer-events-none" />
                    <div className="absolute inset-16 rounded-full border border-white/10 pointer-events-none" />
                    <div className="absolute inset-20 rounded-full border border-white/5 pointer-events-none" />

                    <div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border-2 border-[#FAF8F5]/40 flex flex-col items-center justify-center p-2 text-center shadow-2xl"
                      style={{
                        backgroundColor: selectedColor,
                        color: getContrastColor(selectedColor),
                      }}
                    >
                      <span className="font-mono text-[8px] tracking-[0.2em] font-bold uppercase opacity-80">
                        AURA
                      </span>
                      <span className="font-mono text-xs font-black tracking-tight my-0.5">
                        {selectedColor}
                      </span>
                      <span className="font-serif italic text-[9px] opacity-90 leading-tight">
                        {harmonies[activeHarmony].name}
                      </span>
                      <div className="w-3.5 h-3.5 rounded-full bg-[#050d1a] border border-[#FAF8F5]/40 mt-1 shadow-inner" />
                    </div>
                  </div>
                </div>

                <div
                  className="absolute -top-3 -right-2 w-16 h-40 pointer-events-none transition-transform duration-700 origin-top-right"
                  style={{
                    transform: isPlaying ? 'rotate(18deg)' : 'rotate(0deg)',
                  }}
                >
                  <div className="absolute top-0 right-0 w-8 h-8 rounded-full bg-[#1e3a8a] border-2 border-[#FAF8F5]/40 shadow-md flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-[#FAF8F5]" />
                  </div>
                  <div className="absolute top-6 right-3 w-1.5 h-28 bg-gradient-to-b from-[#FAF8F5]/60 via-[#1e3a8a] to-[#0a192f] rounded-full shadow-sm origin-top" />
                  <div className="absolute bottom-2 right-1 w-5 h-7 bg-[#1e3a8a] border border-[#FAF8F5]/30 rounded-sm shadow-lg flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-white animate-ping" />
                  </div>
                </div>
              </div>

              {/* Side Dial & Hex Manual Tuner */}
              <div className="flex-1 w-full space-y-4">
                <div className="bg-[#0a192f]/70 border border-[#FAF8F5]/15 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono uppercase text-[#FAF8F5]/70">
                    <span>Active Master Tint</span>
                    <span className="font-bold text-[#93c5fd]">{harmonies[activeHarmony].genre}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={selectedColor}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="w-12 h-12 rounded-xl cursor-pointer border-2 border-[#FAF8F5]/30 bg-transparent shrink-0"
                    />
                    <div className="flex-1">
                      <input
                        type="text"
                        defaultValue={selectedColor}
                        key={selectedColor}
                        onBlur={handleHexInput}
                        onKeyDown={(e) => e.key === 'Enter' && handleHexInput(e as unknown as React.FocusEvent<HTMLInputElement>)}
                        placeholder="#1E3A8A"
                        className="w-full bg-[#050d1a] border border-[#FAF8F5]/20 rounded-xl px-4 py-2.5 text-[#FAF8F5] font-mono text-base font-bold focus:outline-none focus:border-[#FAF8F5]/50 shadow-inner"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3.5 bg-[#0a192f]/70 border border-[#FAF8F5]/15 rounded-2xl p-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono text-[#FAF8F5]/70">
                      <span className="flex items-center gap-1">
                        <Sliders className="w-3 h-3 text-[#93c5fd]" />
                        Frequency Hue
                      </span>
                      <span className="font-bold text-[#FAF8F5]">{h}&deg;</span>
                    </div>
                    <input
                      type="range" min="0" max="360" value={h}
                      onChange={handleHueChange}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer bg-gradient-to-r from-red-500 via-green-500 via-blue-500 to-red-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono text-[#FAF8F5]/70">
                      <span>Chroma Saturation</span>
                      <span className="font-bold text-[#FAF8F5]">{s}%</span>
                    </div>
                    <input
                      type="range" min="0" max="100" value={s}
                      onChange={handleSatChange}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer bg-[#050d1a] accent-[#1e3a8a]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono text-[#FAF8F5]/70">
                      <span>Luminance Gain</span>
                      <span className="font-bold text-[#FAF8F5]">{l}%</span>
                    </div>
                    <input
                      type="range" min="10" max="90" value={l}
                      onChange={handleLightChange}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer bg-[#050d1a] accent-[#FAF8F5]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Curated Presets */}
            <div className="mt-6 pt-5 border-t border-[#FAF8F5]/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold tracking-wider uppercase text-[#FAF8F5]/80 flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5 text-[#fffff0]" />
                  Curated Color Archives
                </span>
                <span className="font-mono text-[10px] text-[#FAF8F5]/50">ATELIER CAPSULE</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {CURATED_ARCHIVES.map((item) => (
                  <button
                    key={item.hex}
                    onClick={() => handleColorChange(item.hex)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                      selectedColor.toLowerCase() === item.hex.toLowerCase()
                        ? 'bg-[#FAF8F5] text-[#0a192f] border-[#FAF8F5] shadow-sm'
                        : 'bg-[#0a192f]/60 border-[#FAF8F5]/15 hover:bg-[#16366f]/40 text-[#FAF8F5]'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-black/10 shrink-0 shadow-sm"
                      style={{ backgroundColor: item.hex }}
                    />
                    <div className="overflow-hidden">
                      <p className={`font-serif text-xs font-bold truncate ${selectedColor.toLowerCase() === item.hex.toLowerCase() ? 'text-[#0a192f]' : 'text-[#FAF8F5]'}`}>{item.name}</p>
                      <p className={`font-mono text-[9px] ${selectedColor.toLowerCase() === item.hex.toLowerCase() ? 'text-[#1e3a8a]' : 'text-[#FAF8F5]/60'}`}>{item.hex}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* HARMONY TRACKLIST SELECTOR */}
          <div className="rounded-3xl bg-[#0f254e]/50 border border-[#FAF8F5]/15 p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#FAF8F5]/10 pb-4">
              <div>
                <span className="font-mono text-[11px] font-bold tracking-widest uppercase text-[#93c5fd]">
                  ALBUM TRACKS
                </span>
                <h3 className="font-serif text-2xl text-[#FAF8F5]">Harmonic Chord Progressions</h3>
              </div>
              <span className="font-mono text-xs text-[#FAF8F5]/60">ATELIER &bull; STEREO</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {harmonies.map((harmony, idx) => {
                const isActive = activeHarmony === idx;
                return (
                  <button
                    key={harmony.name}
                    onClick={() => setActiveHarmony(idx)}
                    className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between gap-3 ${
                      isActive
                        ? 'bg-[#FAF8F5] text-[#0a192f] border-[#FAF8F5] shadow-lg'
                        : 'bg-[#0a192f]/60 text-[#FAF8F5] border-[#FAF8F5]/15 hover:bg-[#16366f]/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between font-mono text-[10px] uppercase opacity-70 mb-1">
                        <span>TRACK {harmony.trackNumber}</span>
                        <span>{harmony.genre}</span>
                      </div>
                      <h4 className="font-serif text-base font-bold leading-snug">{harmony.name}</h4>
                    </div>

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

            <div className="p-4 rounded-2xl bg-[#0a192f]/60 border border-[#FAF8F5]/15 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#93c5fd] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-serif text-sm font-bold text-[#FAF8F5]">
                  Track {harmonies[activeHarmony].trackNumber}: {harmonies[activeHarmony].name} &mdash;{' '}
                  <span className="font-mono text-xs font-normal text-[#93c5fd]">
                    {harmonies[activeHarmony].genre}
                  </span>
                </p>
                <p className="text-xs text-[#FAF8F5]/70 leading-relaxed">
                  {harmonies[activeHarmony].description}
                </p>
              </div>
            </div>
          </div>

          {/* REAL CLOTHING OUTFIT RECOMMENDATIONS */}
          <div className="rounded-3xl bg-[#0f254e]/50 border border-[#FAF8F5]/15 p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#FAF8F5]/10 pb-4">
              <div>
                <span className="font-mono text-[11px] font-bold tracking-widest uppercase text-[#93c5fd]">
                  STUDIO LINER NOTES
                </span>
                <h3 className="font-serif text-2xl text-[#FAF8F5]">
                  Atelier Wardrobe Compositions
                </h3>
              </div>
              <span className="font-mono text-xs text-[#FAF8F5]/60">
                {gender === 'female' ? 'Women’s Collection' : 'Men’s Collection'}
              </span>
            </div>

            <div className="space-y-3.5">
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
                        ? 'bg-[#FAF8F5] text-[#0a192f] border-[#FAF8F5] shadow-xl'
                        : 'bg-[#0a192f]/60 border-[#FAF8F5]/15 text-[#FAF8F5] hover:bg-[#16366f]/40'
                    }`}
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2.5">
                        <span className={`font-mono text-[11px] font-bold ${isWearing ? 'text-[#1e3a8a]' : 'text-[#93c5fd]'}`}>
                          SIDE A &bull; {String(idx + 1).padStart(2, '0')}
                        </span>
                        <h4 className="font-serif text-lg font-bold leading-snug">{item.title}</h4>
                        {isWearing && (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#1e3a8a] text-white font-mono text-[9px] font-bold tracking-wider uppercase">
                            ON MANNEQUIN
                          </span>
                        )}
                      </div>
                      
                      <p className={`text-xs leading-relaxed ${isWearing ? 'text-[#0a192f]/80' : 'text-[#FAF8F5]/70'}`}>
                        {item.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 pt-1.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-mono border ${
                            isWearing
                              ? 'bg-white border-[#0a192f]/20 text-[#0a192f]'
                              : 'bg-[#0a192f] border-[#FAF8F5]/20 text-[#FAF8F5]'
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
                              ? 'bg-white border-[#0a192f]/20 text-[#0a192f]'
                              : 'bg-[#0a192f] border-[#FAF8F5]/20 text-[#FAF8F5]'
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
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveOutfitIndex(idx)}
                      className={`shrink-0 px-5 py-3 rounded-xl font-mono text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all ${
                        isWearing
                          ? 'bg-[#1e3a8a] text-white shadow-md'
                          : 'bg-[#FAF8F5] hover:bg-white text-[#0a192f] shadow-md'
                      }`}
                    >
                      {isWearing ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>ACTIVE ON MANNEQUIN</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 text-[#1e3a8a]" />
                          <span>DRAPE MANNEQUIN</span>
                        </>
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: MANNEQUIN ATELIER STUDIO */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          <div className="rounded-3xl bg-[#0f254e]/50 border border-[#FAF8F5]/15 p-6 sm:p-7 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#FAF8F5]/10 pb-3.5">
              <div className="space-y-0.5">
                <span className="font-mono text-[10px] font-bold tracking-widest uppercase text-[#93c5fd]">
                  STUDIO FITTING BOOTH
                </span>
                <h3 className="font-serif text-xl text-[#FAF8F5] flex items-center gap-2">
                  <Shirt className="w-5 h-5 text-[#FAF8F5]" />
                  <span>Interactive Mannequin</span>
                </h3>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#FAF8F5] animate-pulse" />
            </div>

            <div className="bg-[#0a192f]/80 border border-[#FAF8F5]/15 rounded-2xl p-4 shadow-inner">
              <MannequinVisualizer
                gender={gender}
                onGenderChange={(newGender) => updateGender(newGender)}
                outfit={outfitCombinations[activeOutfitIndex]}
                showControls={true}
              />
            </div>

            <div className="p-4 rounded-2xl bg-[#0a192f]/60 border border-[#FAF8F5]/15 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono uppercase text-[#FAF8F5]/70">
                <span>Current Draped Outfit</span>
                <span className="font-bold text-[#93c5fd]">
                  {gender === 'female' ? 'Women' : 'Men'} Cut
                </span>
              </div>
              <p className="font-serif text-sm font-bold text-[#FAF8F5]">
                {outfitCombinations[activeOutfitIndex]?.title}
              </p>
              <p className="text-xs text-[#FAF8F5]/70">
                {outfitCombinations[activeOutfitIndex]?.description}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* ARCHIVAL FOOTER */}
      <div className="text-center py-6 border-t border-[#FAF8F5]/10 text-xs font-mono text-[#FAF8F5]/60 space-y-1">
        <p className="uppercase tracking-widest">
          AuraStyle Atelier Chromatique &bull; Studio Edition
        </p>
      </div>

    </div>
  );
}
