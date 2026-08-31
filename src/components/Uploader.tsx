import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, Loader2, Sparkles, Shirt, CloudRain, Sun, Snowflake, Cloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UploaderProps {
  onAnalyze: (file: File | null, formality: string, setting: string, weather: string, useCloset: boolean) => void;
  isAnalyzing: boolean;
}

const WEATHER_OPTIONS = [
  { value: 'Hot', icon: Sun, label: 'Hot', color: 'text-orange-400' },
  { value: 'Mild', icon: Cloud, label: 'Mild', color: 'text-blue-300' },
  { value: 'Cold', icon: Snowflake, label: 'Cold', color: 'text-cyan-300' },
  { value: 'Rainy', icon: CloudRain, label: 'Rainy', color: 'text-slate-400' },
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-3xl mx-auto space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Zone */}
        <div 
          className={`relative w-full h-80 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all duration-300 backdrop-blur-sm ${
            dragActive ? 'border-indigo-400 bg-indigo-500/10' : 'border-white/20 bg-black/20 hover:border-white/40 hover:bg-black/30'
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
                className="absolute inset-0 w-full h-full object-cover z-0 opacity-70"
                alt="Upload preview" 
              />
            ) : (
              <motion.div 
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="z-10 flex flex-col items-center gap-4 text-white/70"
              >
                <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                  <UploadCloud className="w-10 h-10 text-indigo-300" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-lg text-white">Drag & drop an outfit photo</p>
                  <p className="text-sm">or click to browse from device</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {preview && (
            <div className="absolute top-4 right-4 z-10 bg-green-500/80 backdrop-blur-md text-white p-2 rounded-full shadow-lg">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          )}
        </div>

        {/* Configuration Panel */}
        <div className="space-y-5 flex flex-col justify-center">
          <div className="space-y-3">
            <label className="text-sm font-medium text-indigo-200">Event Formality</label>
            <div className="flex gap-2">
              {['Casual', 'Cocktail', 'Formal'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFormality(f)}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    formality === f 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] border border-transparent' 
                    : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-indigo-200">Setting</label>
            <div className="flex gap-2">
              {['Indoor', 'Outdoor', 'Beach'].map((s) => (
                <button
                  key={s}
                  onClick={() => setSetting(s)}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    setting === s 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] border border-transparent' 
                    : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Weather Selector (NEW) */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-indigo-200">Weather</label>
            <div className="flex gap-2">
              {WEATHER_OPTIONS.map((w) => {
                const Icon = w.icon;
                return (
                  <button
                    key={w.value}
                    onClick={() => setWeather(w.value)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex flex-col items-center gap-1 ${
                      weather === w.value 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] border border-transparent' 
                      : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${weather === w.value ? 'text-white' : w.color}`} />
                    <span className="text-xs">{w.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${useCloset ? 'bg-indigo-500/20 text-indigo-300' : 'bg-white/5 text-white/40'}`}>
                <Shirt className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-white">Digital Closet</p>
                <p className="text-xs text-white/50">Prioritize items I own</p>
              </div>
            </div>
            <button 
              onClick={() => setUseCloset(!useCloset)}
              className={`w-14 h-7 rounded-full p-1 transition-colors duration-300 ease-in-out ${useCloset ? 'bg-indigo-500' : 'bg-white/20'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ease-in-out ${useCloset ? 'translate-x-7' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          if (file) {
            onAnalyze(file, formality, setting, weather, useCloset);
          } else {
            // Create a sample dummy file from URL for instant demo styling
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
        className="w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-500 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-[0_0_40px_rgba(99,102,241,0.5)] border border-white/20 hover:shadow-[0_0_60px_rgba(99,102,241,0.7)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            Analyzing Style & Color Theory with Gemini...
          </>
        ) : (
          <>
            <Sparkles className="w-6 h-6 text-yellow-300" />
            {file ? 'Style My Uploaded Outfit' : 'Style Sample Outfit with Gemini AI'}
          </>
        )}
      </motion.button>
    </motion.div>
  );
}
