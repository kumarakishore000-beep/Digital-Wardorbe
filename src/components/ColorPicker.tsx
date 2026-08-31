'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Check, Palette, Sparkles, Shirt, Eye } from 'lucide-react';
import MannequinVisualizer, { OutfitConfig } from '@/components/MannequinVisualizer';
import { useAuth, Gender } from '@/hooks/useAuth';

interface ColorHarmony {
  name: string;
  colors: string[];
  description: string;
}

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

function hexToHsl(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [0, 70, 50];
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
  if (!result) return '#FFFFFF';
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#1a1a2e' : '#FFFFFF';
}

function getHarmonies(hex: string): ColorHarmony[] {
  const [h, s, l] = hexToHsl(hex);
  return [
    {
      name: 'Complementary',
      colors: [hex, hslToHex(h + 180, s, l)],
      description: 'High contrast contrast — bold executive impact',
    },
    {
      name: 'Split Complementary',
      colors: [hex, hslToHex(h + 150, s, l), hslToHex(h + 210, s, l)],
      description: 'Two adjacent complement colors — vibrant yet balanced',
    },
    {
      name: 'Triadic',
      colors: [hex, hslToHex(h + 120, s, l), hslToHex(h + 240, s, l)],
      description: 'Three evenly spaced colors — rich and dynamic tone',
    },
    {
      name: 'Analogous',
      colors: [hslToHex(h - 30, s, l), hex, hslToHex(h + 30, s, l)],
      description: 'Adjacent color family — harmonious and serene aesthetic',
    },
    {
      name: 'Tetradic',
      colors: [hex, hslToHex(h + 90, s, l), hslToHex(h + 180, s, l), hslToHex(h + 270, s, l)],
      description: 'Four paired colors — multi-layered outfit styling',
    },
  ];
}

// Generate conic gradient for the color wheel
function getWheelGradient(): string {
  const stops = [];
  for (let i = 0; i <= 360; i += 10) {
    stops.push(`hsl(${i}, 80%, 55%) ${i}deg`);
  }
  return `conic-gradient(${stops.join(', ')})`;
}

interface ColorPickerProps {
  onColorSelect?: (hex: string) => void;
  onUseColorPicker?: () => void;
}

export default function ColorPicker({ onColorSelect, onUseColorPicker }: ColorPickerProps) {
  const { user, updateGender } = useAuth();
  const gender: Gender = user?.gender || 'female';

  const [selectedColor, setSelectedColor] = useState('#2E7D32'); // Default Crisp Green
  const [activeHarmony, setActiveHarmony] = useState(0);

  const harmonies = getHarmonies(selectedColor);
  const [h, s, l] = hexToHsl(selectedColor);

  // Generate real clothing outfit combinations mapped to the current color and gender
  const outfitCombinations: OutfitConfig[] = useMemo(() => {
    const baseColor = selectedColor;
    const accent1 = harmonies[activeHarmony].colors[1] || hslToHex(h + 180, s, l);
    const accent2 = harmonies[activeHarmony].colors[2] || hslToHex(h + 120, s, l);

    if (gender === 'male') {
      return [
        {
          title: 'Green Pant with Crisp White Shirt',
          topType: 'shirt',
          topColor: accent1 || '#FFFFFF',
          bottomType: 'chinos',
          bottomColor: baseColor,
          outerwearColor: '#1E293B',
          accentColor: '#475569',
          description: `Base ${baseColor} pant paired with ${accent1} button shirt and dark jacket.`,
        },
        {
          title: 'Ethnic Kurta with Silk Trousers',
          topType: 'kurta',
          topColor: baseColor,
          bottomType: 'trousers',
          bottomColor: accent1 || '#F8FAFC',
          accentColor: '#F59E0B',
          description: `Royal ${baseColor} ethnic kurta paired with ${accent1} silk trousers and gold accents.`,
        },
        {
          title: 'T-Shirt & Athletic Trackpants',
          topType: 'tshirt',
          topColor: accent1 || '#FFFFFF',
          bottomType: 'tracks',
          bottomColor: baseColor,
          accentColor: '#0F172A',
          description: `Sporty ${baseColor} trackpants with white racing side-stripes and ${accent1} performance tee.`,
        },
        {
          title: 'Open Shrug / Cardigan Layered Look',
          topType: 'shrug',
          topColor: baseColor,
          bottomType: 'chinos',
          bottomColor: '#1E293B',
          accentColor: accent1 || '#FFFFFF',
          description: `Stylish open-front ${baseColor} shrug cardigan draped over neutral tee and chinos.`,
        },
        {
          title: 'Denim Jacket & Casual T-Shirt',
          topType: 'tshirt',
          topColor: baseColor,
          bottomType: 'jeans',
          bottomColor: '#1E3A8A',
          outerwearColor: accent1,
          accentColor: '#0F172A',
          description: `Comfortable ${baseColor} casual tee layered under ${accent1} denim jacket.`,
        },
        {
          title: 'Formal Suit Blazer & Tailored Trousers',
          topType: 'blazer',
          topColor: accent1,
          bottomType: 'trousers',
          bottomColor: baseColor,
          outerwearColor: baseColor,
          accentColor: accent2,
          description: `Tailored ${baseColor} trousers matched with crisp ${accent1} shirt and suit blazer.`,
        },
      ];
    } else {
      return [
        {
          title: 'Luxury Silk Evening Gown',
          topType: 'gown',
          topColor: baseColor,
          bottomType: 'gown_skirt',
          bottomColor: baseColor,
          accentColor: '#F59E0B',
          description: `Elegant floor-length ${baseColor} evening gown dress with gold waist accent & sweetheart neckline.`,
        },
        {
          title: 'Pleated Midi Skirt & Blouse',
          topType: 'skirt',
          topColor: accent1 || '#FFFFFF',
          bottomType: 'skirt',
          bottomColor: baseColor,
          accentColor: accent2,
          description: `Chic ${accent1} blouse tucked into a high-waist pleated ${baseColor} midi skirt.`,
        },
        {
          title: 'Draped Shrug over Crop Top & Jeans',
          topType: 'shrug',
          topColor: baseColor,
          bottomType: 'jeans',
          bottomColor: '#1E3A8A',
          accentColor: accent1 || '#FFFFFF',
          description: `Trendy ${baseColor} lightweight shrug cardigan draped over white crop top and denim jeans.`,
        },
        {
          title: 'Emerald Kurti with Salwar Bottom',
          topType: 'kurti',
          topColor: baseColor,
          bottomType: 'salwar_bottom',
          bottomColor: accent1 || '#F8FAFC',
          accentColor: accent2 || '#F59E0B',
          description: `Vibrant ${baseColor} ethnic kurti with ${accent1} flared salwar and gold accents.`,
        },
        {
          title: 'Royal Draped Saree with Gold Border',
          topType: 'saree',
          topColor: baseColor,
          bottomType: 'skirt',
          bottomColor: baseColor,
          outerwearColor: accent1,
          accentColor: '#F59E0B',
          description: `Draped ${baseColor} traditional saree with contrasting ${accent1} blouse and gold zari border.`,
        },
        {
          title: 'White Crop Top & High-Waist Trousers',
          topType: 'croptop',
          topColor: accent1 || '#FFFFFF',
          bottomType: 'jeans',
          bottomColor: baseColor,
          accentColor: accent2,
          description: `Stylish ${accent1} crop top paired with high-waist ${baseColor} trousers.`,
        },
      ];
    }
  }, [gender, selectedColor, activeHarmony, harmonies, h, s, l]);

  const [activeOutfitIndex, setActiveOutfitIndex] = useState(0);

  const handleColorInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedColor(value);
    onColorSelect?.(value);
    onUseColorPicker?.();
  }, [onColorSelect, onUseColorPicker]);

  const handleHexInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (!value.startsWith('#')) value = '#' + value;
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      setSelectedColor(value.toUpperCase());
      onColorSelect?.(value.toUpperCase());
      onUseColorPicker?.();
    }
  }, [onColorSelect, onUseColorPicker]);

  const handleHueChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newH = parseInt(e.target.value);
    const newColor = hslToHex(newH, s, l);
    setSelectedColor(newColor);
    onColorSelect?.(newColor);
  }, [s, l, onColorSelect]);

  const handleSatChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newS = parseInt(e.target.value);
    const newColor = hslToHex(h, newS, l);
    setSelectedColor(newColor);
    onColorSelect?.(newColor);
  }, [h, l, onColorSelect]);

  const handleLightChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newL = parseInt(e.target.value);
    const newColor = hslToHex(h, s, newL);
    setSelectedColor(newColor);
    onColorSelect?.(newColor);
  }, [h, s, onColorSelect]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-6xl mx-auto space-y-8"
    >
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-sm font-medium">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <span>AI Analyst Color Match & Mannequin Studio</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-pink-100 to-purple-400">
          Color Theory & Mannequin Stylist
        </h2>
        <p className="text-indigo-200/70 text-lg max-w-2xl mx-auto">
          Explore color theory through <strong>real clothing combinations</strong> worn on interactive mannequins.
        </p>
      </div>

      {/* Main Grid: Mannequin Visualizer + Color Theory Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Mannequin Visualizer (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 sticky top-24">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Shirt className="w-5 h-5 text-purple-400" />
              <span>Real Mannequin Draped Outfit</span>
            </h3>
          </div>

          <MannequinVisualizer
            gender={gender}
            onGenderChange={(newGender) => updateGender(newGender)}
            outfit={outfitCombinations[activeOutfitIndex]}
            showControls={true}
          />
        </div>

        {/* Right Column: Color Theory Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Palette className="w-5 h-5 text-pink-400" />
                  Interactive Color Wheel
                </h3>
                <p className="text-xs text-slate-400">
                  Select base color or adjust sliders to see harmonized clothing combos
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border border-white/30" style={{ backgroundColor: selectedColor }} />
                <span className="text-sm font-mono font-bold text-white">{selectedColor}</span>
              </div>
            </div>

            {/* Wheel Display & Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="relative w-44 h-44 mx-auto">
                <div
                  className="w-full h-full rounded-full border border-white/10 shadow-2xl"
                  style={{ background: getWheelGradient() }}
                />
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-4 border-white/30 shadow-xl transition-colors duration-300"
                  style={{ backgroundColor: selectedColor }}
                />
                {harmonies[activeHarmony].colors.map((color, idx) => {
                  if (idx === 0) return null;
                  const harmonyHsl = hexToHsl(color);
                  const angle = (harmonyHsl[0] - 90) * (Math.PI / 180);
                  const radius = 65;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;
                  return (
                    <div
                      key={idx}
                      className="absolute w-4 h-4 rounded-full border-2 border-white shadow-lg transition-all duration-500"
                      style={{
                        backgroundColor: color,
                        top: `calc(50% + ${y}px)`,
                        left: `calc(50% + ${x}px)`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    />
                  );
                })}
              </div>

              {/* Sliders */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={selectedColor}
                    onChange={handleColorInput}
                    className="w-12 h-12 rounded-xl cursor-pointer border-2 border-white/20 bg-transparent shrink-0"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      defaultValue={selectedColor}
                      key={selectedColor}
                      onBlur={handleHexInput}
                      onKeyDown={(e) => e.key === 'Enter' && handleHexInput(e as unknown as React.FocusEvent<HTMLInputElement>)}
                      placeholder="#2E7D32"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono text-base focus:outline-none focus:border-purple-500/50"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-white/60 font-medium">
                      <span>Hue Tone</span><span>{h}°</span>
                    </div>
                    <input
                      type="range" min="0" max="360" value={h}
                      onChange={handleHueChange}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-white/60 font-medium">
                      <span>Saturation</span><span>{s}%</span>
                    </div>
                    <input
                      type="range" min="0" max="100" value={s}
                      onChange={handleSatChange}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-white/60 font-medium">
                      <span>Lightness</span><span>{l}%</span>
                    </div>
                    <input
                      type="range" min="10" max="90" value={l}
                      onChange={handleLightChange}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Harmony Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {harmonies.map((harmony, idx) => (
              <button
                key={harmony.name}
                onClick={() => setActiveHarmony(idx)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
                  activeHarmony === idx
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
                }`}
              >
                {harmony.name}
              </button>
            ))}
          </div>

          {/* REAL CLOTHES OUTFIT COMBINATIONS (Not Color Code Alone!) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  AI Analyst Clothing Recommendations
                </h3>
                <p className="text-xs text-slate-400">
                  Real outfits matched to {harmonies[activeHarmony].name} color rules ({gender === 'female' ? 'Women' : 'Men'} Collection)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {outfitCombinations.map((item, idx) => {
                const isWearing = activeOutfitIndex === idx;
                return (
                  <motion.div
                    key={(item.title || 'outfit') + idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      isWearing
                        ? 'bg-gradient-to-r from-indigo-900/60 to-purple-900/60 border-indigo-400/50 shadow-xl ring-1 ring-indigo-400/30'
                        : 'bg-black/40 border-white/10 hover:bg-white/5'
                    }`}
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{gender === 'female' ? '👗' : '👔'}</span>
                        <h4 className="text-base font-bold text-white">{item.title}</h4>
                        {isWearing && (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                            Worn on Mannequin
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300">{item.description}</p>

                      {/* Clothing Garment Swatches (Cloth Manner) */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] text-white">
                          <span
                            className="w-3 h-3 rounded-full border border-white/30"
                            style={{ backgroundColor: item.topColor }}
                          />
                          <strong className="capitalize">{item.topType}:</strong> {item.topColor}
                        </span>

                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] text-white">
                          <span
                            className="w-3 h-3 rounded-full border border-white/30"
                            style={{ backgroundColor: item.bottomColor }}
                          />
                          <strong className="capitalize">{item.bottomType.replace('_', ' ')}:</strong> {item.bottomColor}
                        </span>

                        {item.outerwearColor && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] text-white">
                            <span
                              className="w-3 h-3 rounded-full border border-white/30"
                              style={{ backgroundColor: item.outerwearColor }}
                            />
                            <strong>Jacket:</strong> {item.outerwearColor}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => setActiveOutfitIndex(idx)}
                      className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                        isWearing
                          ? 'bg-emerald-500 text-white shadow-md'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                      }`}
                    >
                      {isWearing ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Currently Wearing</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          <span>Wear on Mannequin</span>
                        </>
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
