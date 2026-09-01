import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, Loader2, Sparkles, Shirt, CloudRain, Sun, Snowflake, Cloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UploaderProps {
  onAnalyze: (file: File | null, formality: string, setting: string, weather: string, useCloset: boolean) => void;
  isAnalyzing: boolean;
}

const WEATHER_OPTIONS = [
  { value: 'Hot', icon: Sun, label: 'Hot' },
  { value: 'Mild', icon: Cloud, label: 'Mild' },
  { value: 'Cold', icon: Snowflake, label: 'Cold' },
  { value: 'Rainy', icon: CloudRain, label: 'Rainy' },
];

const LOOKBOOK_PRESETS = [
  {
    name: 'Casual Workplaces',
    src: '/images/branding/mens-smart-casual.jpg',
    tag: 'Look 01',
  },
  {
    name: 'Regal Celebration',
    src: '/images/branding/womens-ethnic-fusion.jpg',
    tag: 'Look 02',
  },
  {
    name: 'Pastel Streetwear',
    src: '/images/branding/urban-western-casual.jpg',
    tag: 'Look 03',
  },
  {
    name: 'Signature Ensemble',
    src: '/images/branding/hero-banner.jpg',
    tag: 'Look 04',
  },
];

export default function Uploader({ onAnalyze, isAnalyzing }: UploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  
  const [formality, setFormality] = useState('Cocktail');
  const [setting, setSetting] = useState('Indoor');
  const [weather, setWeather] = useState('Mild');
  const [useCloset, setUseCloset] = useState(true);
  
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  };

  const selectLookbookPreset = async (src: string, name: string) => {
    setPreview(src);
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const presetFile = new File([blob], `${name.toLowerCase().replace(/\s+/g, '-')}.jpg`, {
        type: 'image/jpeg',
      });
      setFile(presetFile);
    } catch {
      // Fallback
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl mx-auto space-y-8"
    >
      {/* Quick Lookbook Presets */}
      <div className="space-y-3 bg-[#0f254e]/50 border border-[#FAF8F5]/15 rounded-3xl p-5 backdrop-blur-md shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-serif font-bold uppercase tracking-wider text-[#FAF8F5]">
            <Sparkles className="w-3.5 h-3.5 text-[#fffff0]" />
            <span>Select From Editorial Lookbook Archives</span>
          </div>
          <span className="text-[11px] text-[#FAF8F5]/60 font-mono">1-Click Harmonic Input</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {LOOKBOOK_PRESETS.map((preset) => {
            const isSelected = preview === preset.src;
            return (
              <button
                key={preset.src}
                type="button"
                onClick={() => selectLookbookPreset(preset.src, preset.name)}
                className={`flex items-center gap-2.5 p-2 rounded-2xl border text-left transition-all group ${
                  isSelected
                    ? 'bg-[#FAF8F5] text-[#0a192f] border-[#FAF8F5] shadow-lg shadow-[#1e3a8a]/40 scale-102'
                    : 'bg-[#0a192f]/60 border-[#FAF8F5]/10 hover:bg-[#16366f]/40 hover:border-[#FAF8F5]/30'
                }`}
              >
                <img
                  src={preset.src}
                  alt={preset.name}
                  className="w-11 h-11 rounded-xl object-cover object-top border border-[#FAF8F5]/20 shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="overflow-hidden">
                  <p className={`text-xs font-bold truncate ${isSelected ? 'text-[#0a192f]' : 'text-[#FAF8F5]'}`}>
                    {preset.name}
                  </p>
                  <span className={`text-[10px] font-mono block ${isSelected ? 'text-[#1e3a8a]' : 'text-[#93c5fd]'}`}>
                    {preset.tag}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* Upload Zone */}
        <div 
          className={`relative w-full min-h-[320px] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all duration-300 backdrop-blur-sm cursor-pointer ${
            dragActive ? 'border-[#FAF8F5] bg-[#1e3a8a]/30' : 'border-[#FAF8F5]/20 bg-[#0a192f]/60 hover:border-[#FAF8F5]/50 hover:bg-[#0f254e]/60'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input 
            ref={inputRef}
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={handleChange}
          />
          
          <AnimatePresence>
            {preview ? (
              <motion.img 
                key="preview"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                src={preview} 
                className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
                alt="Upload preview" 
              />
            ) : (
              <motion.div 
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="z-10 flex flex-col items-center gap-4 text-[#FAF8F5]/80 p-6 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-[#1e3a8a]/50 border border-[#FAF8F5]/30 flex items-center justify-center shadow-lg shadow-[#1e3a8a]/40">
                  <UploadCloud className="w-8 h-8 text-[#FAF8F5]" />
                </div>
                <div>
                  <p className="font-serif font-bold text-base text-[#FAF8F5]">Drop an Outfit Photo</p>
                  <p className="text-xs text-[#FAF8F5]/60 mt-1">or click to browse your look</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {preview && (
            <div className="absolute top-4 right-4 z-10 bg-[#FAF8F5] text-[#0a192f] p-2 rounded-full shadow-lg border border-[#0a192f]/20">
              <CheckCircle2 className="w-5 h-5 text-[#1e3a8a]" />
            </div>
          )}
        </div>

        {/* Configuration Panel */}
        <div className="space-y-4 flex flex-col justify-between bg-[#0f254e]/50 border border-[#FAF8F5]/15 rounded-3xl p-6 shadow-xl">
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-[#FAF8F5]/70 font-semibold">Event Formality</label>
            <div className="flex gap-2">
              {['Casual', 'Cocktail', 'Formal'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFormality(f)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 border ${
                    formality === f 
                    ? 'bg-[#FAF8F5] text-[#0a192f] border-[#FAF8F5] shadow-md' 
                    : 'bg-[#0a192f]/60 border-[#FAF8F5]/10 text-[#FAF8F5]/70 hover:bg-[#16366f]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-[#FAF8F5]/70 font-semibold">Setting</label>
            <div className="flex gap-2">
              {['Indoor', 'Outdoor', 'Beach'].map((s) => (
                <button
                  key={s}
                  onClick={() => setSetting(s)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 border ${
                    setting === s 
                    ? 'bg-[#FAF8F5] text-[#0a192f] border-[#FAF8F5] shadow-md' 
                    : 'bg-[#0a192f]/60 border-[#FAF8F5]/10 text-[#FAF8F5]/70 hover:bg-[#16366f]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Weather Selector */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-[#FAF8F5]/70 font-semibold">Weather Adaptation</label>
            <div className="flex gap-2">
              {WEATHER_OPTIONS.map((w) => {
                const Icon = w.icon;
                const isSelected = weather === w.value;
                return (
                  <button
                    key={w.value}
                    onClick={() => setWeather(w.value)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all duration-300 flex flex-col items-center gap-1 border ${
                      isSelected 
                      ? 'bg-[#FAF8F5] text-[#0a192f] border-[#FAF8F5] shadow-md' 
                      : 'bg-[#0a192f]/60 border-[#FAF8F5]/10 text-[#FAF8F5]/70 hover:bg-[#16366f]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#1e3a8a]' : 'text-[#FAF8F5]'}`} />
                    <span className="text-[11px]">{w.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between border-t border-[#FAF8F5]/10">
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl border ${useCloset ? 'bg-[#1e3a8a] text-white border-[#FAF8F5]/30' : 'bg-[#0a192f] text-white/40 border-[#FAF8F5]/10'}`}>
                <Shirt className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-[#FAF8F5]">Digital Wardrobe Priority</p>
                <p className="text-[10px] text-[#FAF8F5]/60 font-mono">Mix with my owned items</p>
              </div>
            </div>
            <button 
              onClick={() => setUseCloset(!useCloset)}
              className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-300 ${useCloset ? 'bg-[#FAF8F5]' : 'bg-[#0a192f] border border-[#FAF8F5]/20'}`}
            >
              <div className={`w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${useCloset ? 'translate-x-6 bg-[#0a192f]' : 'translate-x-0 bg-[#FAF8F5]'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Big Action CTA in Royal Blue & Ivory */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => {
          if (file) {
            onAnalyze(file, formality, setting, weather, useCloset);
          } else {
            fetch('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop')
              .then(r => r.blob())
              .then(blob => {
                const sampleFile = new File([blob], 'sample-outfit.jpg', { type: 'image/jpeg' });
                onAnalyze(sampleFile, formality, setting, weather, useCloset);
              })
              .catch(() => {
                onAnalyze(null, formality, setting, weather, useCloset);
              });
          }
        }}
        disabled={isAnalyzing}
        className="w-full py-4.5 rounded-full font-serif font-bold text-base flex items-center justify-center gap-3 transition-all duration-300 bg-[#FAF8F5] hover:bg-white text-[#0a192f] shadow-2xl shadow-[#1e3a8a]/40 border-2 border-[#FAF8F5] disabled:opacity-50"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin text-[#1e3a8a]" />
            <span>Harmonizing Color & Aesthetics with Gemini...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 text-[#1e3a8a]" />
            <span>{file ? 'Harmonize Uploaded Outfit with AuraStyle AI' : 'Harmonize Sample Lookbook Outfit'}</span>
          </>
        )}
      </motion.button>
    </motion.div>
  );
}
