'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Check, Info, ShoppingBag, Shirt, Watch, Link2, CircleDot, Footprints, Plus } from 'lucide-react';
import SuggestionBox from './SuggestionBox';
import { useCollection } from '@/hooks/useCollection';

interface ResultsDashboardProps {
  data: any;
  collection: ReturnType<typeof useCollection>;
  onAddToCollection?: () => void;
  onTrySuggestion?: () => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Watch: <Watch className="w-4 h-4" />,
  Chain: <Link2 className="w-4 h-4" />,
  Bracelet: <CircleDot className="w-4 h-4" />,
  Shoes: <Footprints className="w-4 h-4" />,
  Jewelry: <Shirt className="w-3 h-3" />,
  Bag: <ShoppingBag className="w-3 h-3" />,
};

const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  Watch: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-300' },
  Chain: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-300' },
  Bracelet: { bg: 'bg-pink-500/10', border: 'border-pink-500/20', text: 'text-pink-300' },
  Shoes: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-300' },
  Jewelry: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-300' },
  Bag: { bg: 'bg-teal-500/10', border: 'border-teal-500/20', text: 'text-teal-300' },
};

export default function ResultsDashboard({ data, collection, onAddToCollection, onTrySuggestion }: ResultsDashboardProps) {
  if (!data) return null;

  const { overallAssessment, colorPalette, accessoryRecommendations, context } = data;

  // Group accessories by category
  const grouped: Record<string, any[]> = {};
  for (const acc of accessoryRecommendations) {
    if (!grouped[acc.category]) grouped[acc.category] = [];
    grouped[acc.category].push(acc);
  }

  const handleAddToCollection = (acc: any) => {
    const categoryMap: Record<string, string> = {
      Watch: 'Watch',
      Chain: 'Chain',
      Bracelet: 'Bracelet',
      Shoes: 'Shoes',
      Jewelry: 'Jewelry',
      Bag: 'Bag',
    };
    collection.addItem({
      name: acc.styleName,
      category: (categoryMap[acc.category] || 'Other') as any,
      color: colorPalette?.accent || '#8B5CF6',
    });
    onAddToCollection?.();
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full max-w-5xl mx-auto space-y-8 pb-20"
    >
      {/* Top Banner: Score & Assessment */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 bg-gradient-to-br from-indigo-900/80 to-purple-900/80 p-8 rounded-3xl border border-white/20 backdrop-blur-md flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10" />
          <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-indigo-200">
            {overallAssessment.compatibilityScore}
          </h2>
          <p className="text-xl font-bold text-white mt-2">{overallAssessment.verdict}</p>
          <div className="mt-4 flex items-center gap-2 bg-green-500/20 text-green-300 px-4 py-1.5 rounded-full text-sm font-medium border border-green-500/30">
            <Check className="w-4 h-4" /> Score
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 bg-black/30 p-8 rounded-3xl border border-white/10 backdrop-blur-md">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-indigo-400" /> Stylist Notes
          </h3>
          <p className="text-white/80 leading-relaxed text-lg mb-4">
            {overallAssessment.stylistNotes}
          </p>
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 mb-4">
            <p className="text-indigo-200 font-medium">✨ {overallAssessment.eventCompatibility}</p>
          </div>
          {/* Context Tags */}
          {context && (
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-white/60">
                📍 {context.setting}
              </span>
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-white/60">
                👔 {context.formality}
              </span>
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-white/60">
                🌤️ {context.weather}
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Color Palette */}
      <motion.div variants={itemVariants} className="bg-black/30 p-6 rounded-3xl border border-white/10 backdrop-blur-md">
        <h3 className="text-lg font-semibold text-white mb-4">Extracted Color Palette</h3>
        <div className="flex gap-4">
          {[
            { name: 'Primary', hex: colorPalette.primary },
            { name: 'Secondary', hex: colorPalette.secondary },
            { name: 'Accent', hex: colorPalette.accent }
          ].map((color, idx) => (
            <div key={idx} className="flex-1 space-y-2">
              <div 
                className="w-full h-24 rounded-2xl shadow-inner border border-white/10"
                style={{ backgroundColor: color.hex }}
              />
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-medium text-white/50 uppercase tracking-wider">{color.name}</span>
                <span className="text-sm font-mono text-white/90">{color.hex}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recommendations by Category */}
      <motion.div variants={itemVariants} className="space-y-6">
        <h3 className="text-2xl font-bold text-white px-2">Curated Accessories</h3>
        
        {Object.entries(grouped).map(([category, items]) => {
          const colors = CATEGORY_COLORS[category] || { bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', text: 'text-indigo-300' };
          return (
            <div key={category} className="space-y-3">
              <div className="flex items-center gap-2 px-2">
                <div className={`p-1.5 rounded-lg ${colors.bg} ${colors.text}`}>
                  {CATEGORY_ICONS[category] || <ShoppingBag className="w-4 h-4" />}
                </div>
                <h4 className={`text-sm font-bold uppercase tracking-widest ${colors.text}`}>{category}</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((acc: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ y: -5 }}
                    className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors duration-300"
                  >
                    <div className="absolute top-4 right-4">
                      {acc.inCloset ? (
                        <div className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full border border-indigo-500/30 flex items-center gap-1">
                          <Shirt className="w-3 h-3" /> In Closet
                        </div>
                      ) : (
                        <div className="bg-purple-500/20 text-purple-300 text-xs font-bold px-3 py-1 rounded-full border border-purple-500/30 flex items-center gap-1">
                          <ShoppingBag className="w-3 h-3" /> Buy Now
                        </div>
                      )}
                    </div>
                    
                    <h4 className="text-base font-bold text-white mb-2 pr-20">{acc.styleName}</h4>
                    <p className="text-sm text-white/60 mb-5 leading-relaxed">
                      {acc.reasoning}
                    </p>
                    
                    <div className="flex gap-2">
                      {!acc.inCloset && (
                        <button className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-xl transition-colors duration-300 flex items-center justify-center gap-2">
                          <ShoppingBag className="w-4 h-4" /> Shop
                        </button>
                      )}
                      <button
                        onClick={() => handleAddToCollection(acc)}
                        className="flex-1 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-sm font-semibold rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 border border-emerald-500/20"
                      >
                        <Plus className="w-4 h-4" /> Collect
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Suggestion Box */}
      <motion.div variants={itemVariants}>
        <SuggestionBox
          collection={collection}
          onTrySuggestion={onTrySuggestion}
        />
      </motion.div>
    </motion.div>
  );
}
