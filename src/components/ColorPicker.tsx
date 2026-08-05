'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Palette } from 'lucide-react';

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
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;
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

function getContrastColor(hex: string): string {
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
      description: 'Opposite on the color wheel — high contrast, bold impact',
    },
    {
      name: 'Split Complementary',
      colors: [hex, hslToHex(h + 150, s, l), hslToHex(h + 210, s, l)],
      description: 'Two colors adjacent to the complement — vibrant yet balanced',
    },
    {
      name: 'Triadic',
      colors: [hex, hslToHex(h + 120, s, l), hslToHex(h + 240, s, l)],
      description: 'Three evenly spaced colors — rich and dynamic',
    },
    {
      name: 'Analogous',
      colors: [hslToHex(h - 30, s, l), hex, hslToHex(h + 30, s, l)],
      description: 'Adjacent colors — harmonious and serene',
    },
    {
      name: 'Tetradic',
      colors: [hex, hslToHex(h + 90, s, l), hslToHex(h + 180, s, l), hslToHex(h + 270, s, l)],
      description: 'Four colors in two complementary pairs — bold and complex',
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
  const [selectedColor, setSelectedColor] = useState('#1E3A8A');
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [activeHarmony, setActiveHarmony] = useState(0);

  const harmonies = getHarmonies(selectedColor);
  const [h, s, l] = hexToHsl(selectedColor);

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

  const copyToClipboard = useCallback((color: string) => {
    navigator.clipboard.writeText(color).then(() => {
      setCopiedColor(color);
      setTimeout(() => setCopiedColor(null), 1500);
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-5xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-pink-100 to-purple-400">
          Color Harmony Lab
        </h2>
        <p className="text-indigo-200/70 text-lg">
          Pick a color and explore its perfect harmonies
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Color Picker */}
        <div className="lg:col-span-1 space-y-6">
          {/* Color Wheel Preview */}
          <div className="bg-black/30 p-6 rounded-3xl border border-white/10 backdrop-blur-md space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <Palette className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Pick Your Color</h3>
            </div>

            {/* Visual Color Wheel */}
            <div className="relative w-48 h-48 mx-auto">
              <div
                className="w-full h-full rounded-full border-4 border-white/10 shadow-[0_0_30px_rgba(139,92,246,0.2)]"
                style={{ background: getWheelGradient() }}
              />
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-4 border-white/30 shadow-xl transition-colors duration-300"
                style={{ backgroundColor: selectedColor }}
              />
              {/* Harmony dots on wheel */}
              {harmonies[activeHarmony].colors.map((color, idx) => {
                if (idx === 0) return null;
                const harmonyHsl = hexToHsl(color);
                const angle = (harmonyHsl[0] - 90) * (Math.PI / 180);
                const radius = 80;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                return (
                  <div
                    key={idx}
                    className="absolute w-5 h-5 rounded-full border-2 border-white shadow-lg transition-all duration-500"
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

            {/* Native Color Input */}
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={selectedColor}
                onChange={handleColorInput}
                className="w-14 h-14 rounded-xl cursor-pointer border-2 border-white/20 bg-transparent"
              />
              <div className="flex-1">
                <input
                  type="text"
                  defaultValue={selectedColor}
                  key={selectedColor}
                  onBlur={handleHexInput}
                  onKeyDown={(e) => e.key === 'Enter' && handleHexInput(e as any)}
                  placeholder="#1E3A8A"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-lg focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
            </div>

            {/* HSL Sliders */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-white/50">
                  <span>Hue</span><span>{h}°</span>
                </div>
                <input
                  type="range" min="0" max="360" value={h}
                  onChange={handleHueChange}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, 
                      hsl(0,${s}%,${l}%), hsl(60,${s}%,${l}%), hsl(120,${s}%,${l}%), 
                      hsl(180,${s}%,${l}%), hsl(240,${s}%,${l}%), hsl(300,${s}%,${l}%), hsl(360,${s}%,${l}%))`
                  }}
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-white/50">
                  <span>Saturation</span><span>{s}%</span>
                </div>
                <input
                  type="range" min="0" max="100" value={s}
                  onChange={handleSatChange}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, hsl(${h},0%,${l}%), hsl(${h},100%,${l}%))`
                  }}
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-white/50">
                  <span>Lightness</span><span>{l}%</span>
                </div>
                <input
                  type="range" min="0" max="100" value={l}
                  onChange={handleLightChange}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, hsl(${h},${s}%,0%), hsl(${h},${s}%,50%), hsl(${h},${s}%,100%))`
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Harmonies */}
        <div className="lg:col-span-2 space-y-4">
          {/* Harmony Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {harmonies.map((harmony, idx) => (
              <button
                key={harmony.name}
                onClick={() => setActiveHarmony(idx)}
                className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeHarmony === idx
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] border border-transparent'
                    : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
                }`}
              >
                {harmony.name}
              </button>
            ))}
          </div>

          {/* Active Harmony Display */}
          <motion.div
            key={activeHarmony}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-black/30 p-6 rounded-3xl border border-white/10 backdrop-blur-md"
          >
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white">{harmonies[activeHarmony].name}</h3>
              <p className="text-sm text-white/50 mt-1">{harmonies[activeHarmony].description}</p>
            </div>

            {/* Color Swatches */}
            <div className="flex gap-3 mb-6">
              {harmonies[activeHarmony].colors.map((color, idx) => (
                <motion.div
                  key={`${color}-${idx}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex-1 space-y-2"
                >
                  <button
                    onClick={() => copyToClipboard(color)}
                    className="w-full h-28 rounded-2xl border border-white/10 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl relative group"
                    style={{ backgroundColor: color }}
                  >
                    <div className="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      {copiedColor === color ? (
                        <Check className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: getContrastColor(color) }} />
                      ) : (
                        <Copy className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: getContrastColor(color) }} />
                      )}
                    </div>
                    {idx === 0 && (
                      <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">BASE</div>
                    )}
                  </button>
                  <div className="text-center">
                    <p className="text-xs font-mono text-white/80">{color}</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider">
                      {idx === 0 ? 'Base' : `Harmony ${idx}`}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Full palette preview bar */}
            <div className="flex h-12 rounded-2xl overflow-hidden border border-white/10 shadow-inner">
              {harmonies[activeHarmony].colors.map((color, idx) => (
                <div
                  key={idx}
                  className="flex-1 transition-all duration-500"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </motion.div>

          {/* All Harmonies Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {harmonies.filter((_, idx) => idx !== activeHarmony).map((harmony, idx) => (
              <button
                key={harmony.name}
                onClick={() => setActiveHarmony(harmonies.indexOf(harmony))}
                className="bg-white/5 border border-white/10 p-4 rounded-2xl text-left hover:bg-white/10 transition-all duration-300 group"
              >
                <p className="text-sm font-semibold text-white/80 mb-2 group-hover:text-white transition-colors">{harmony.name}</p>
                <div className="flex gap-2">
                  {harmony.colors.map((color, cIdx) => (
                    <div
                      key={cIdx}
                      className="w-8 h-8 rounded-lg border border-white/10"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
