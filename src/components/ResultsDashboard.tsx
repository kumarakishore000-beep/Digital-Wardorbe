'use client';

import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { Check, Info, ShoppingBag, Shirt, Watch, Link2, CircleDot, Footprints, Plus } from 'lucide-react';
import SuggestionBox from './SuggestionBox';
import { useCollection } from '@/hooks/useCollection';
import { useAuth } from '@/hooks/useAuth';
import LoginModal from '@/components/LoginModal';

export interface AccessoryRecommendationItem {
  styleName: string;
  category: string;
  material: string;
  color: string;
  reasoning: string;
  searchQuery: string;
  inCloset?: boolean;
}

export interface OverallAssessment {
  compatibilityScore?: string | number;
  verdict?: string;
  stylistNotes?: string;
  eventCompatibility?: string;
}

interface ResultsDashboardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export default function ResultsDashboard({ data, collection, onAddToCollection, onTrySuggestion }: ResultsDashboardProps) {
  const { isAuthenticated } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [pendingAcc, setPendingAcc] = useState<AccessoryRecommendationItem | null>(null);

  if (!data) return null;

  const { overallAssessment, colorPalette, accessoryRecommendations = [], context } = data;

  // Group accessories by category
  const grouped: Record<string, AccessoryRecommendationItem[]> = {};
  for (const acc of accessoryRecommendations) {
    if (!grouped[acc.category]) grouped[acc.category] = [];
    grouped[acc.category].push(acc);
  }

  const handleAddToCollection = (acc: AccessoryRecommendationItem) => {
    if (!isAuthenticated) {
      setPendingAcc(acc);
      setIsLoginModalOpen(true);
      return;
    }
    executeCollect(acc);
  };

  const executeCollect = (acc: AccessoryRecommendationItem) => {
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
      category: (categoryMap[acc.category] || 'Other') as unknown as 'Watch' | 'Chain' | 'Bracelet' | 'Shoes' | 'Jewelry' | 'Bag' | 'Other',
      color: colorPalette?.accent || '#1e3a8a',
    });
    onAddToCollection?.();
  };

  return (
    <>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => {
          if (pendingAcc) executeCollect(pendingAcc);
        }}
        title="Sign In to Collect Items"
        message="Sign in to save accessory recommendations directly to your wardrobe collection."
      />
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full max-w-5xl mx-auto space-y-10 pb-20"
      >
      {/* Top Banner: Score & Assessment */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 bg-[#1e3a8a] p-8 rounded-3xl border-2 border-[#FAF8F5]/30 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FAF8F5]/10 rounded-full blur-2xl -mr-10 -mt-10" />
          <h2 className="text-6xl font-serif font-black text-[#FAF8F5]">
            {overallAssessment.compatibilityScore}
          </h2>
          <p className="text-lg font-serif font-bold text-[#FAF8F5] mt-2">{overallAssessment.verdict}</p>
          <div className="mt-4 flex items-center gap-2 bg-[#FAF8F5] text-[#0a192f] px-4 py-1.5 rounded-full text-xs font-bold shadow-md">
            <Check className="w-3.5 h-3.5 text-[#1e3a8a]" /> Harmonic Match
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 bg-[#0f254e]/60 p-8 rounded-3xl border border-[#FAF8F5]/15 backdrop-blur-md space-y-4">
          <h3 className="text-xl font-serif font-bold text-[#FAF8F5] flex items-center gap-2">
            <Info className="w-5 h-5 text-[#93c5fd]" /> Stylist Harmonic Synthesis
          </h3>
          <p className="text-[#FAF8F5]/85 leading-relaxed text-sm">
            {overallAssessment.stylistNotes}
          </p>
          <div className="bg-[#1e3a8a]/40 border border-[#FAF8F5]/20 rounded-2xl p-3.5">
            <p className="text-[#FAF8F5] font-serif text-sm">✦ {overallAssessment.eventCompatibility}</p>
          </div>
          {/* Context Tags */}
          {context && (
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-3 py-1 bg-[#0a192f] border border-[#FAF8F5]/15 rounded-full text-xs font-mono text-[#FAF8F5]/70">
                📍 {context.setting}
              </span>
              <span className="px-3 py-1 bg-[#0a192f] border border-[#FAF8F5]/15 rounded-full text-xs font-mono text-[#FAF8F5]/70">
                👔 {context.formality}
              </span>
              <span className="px-3 py-1 bg-[#0a192f] border border-[#FAF8F5]/15 rounded-full text-xs font-mono text-[#FAF8F5]/70">
                🌤️ {context.weather}
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Color Palette */}
      <motion.div variants={itemVariants} className="bg-[#0f254e]/50 p-6 rounded-3xl border border-[#FAF8F5]/15 backdrop-blur-md">
        <h3 className="text-base font-serif font-bold text-[#FAF8F5] mb-4">Extracted Harmonic Palette</h3>
        <div className="flex gap-4">
          {[
            { name: 'Primary', hex: colorPalette.primary },
            { name: 'Secondary', hex: colorPalette.secondary },
            { name: 'Accent', hex: colorPalette.accent }
          ].map((color, idx) => (
            <div key={idx} className="flex-1 space-y-2">
              <div 
                className="w-full h-20 rounded-2xl shadow-inner border border-[#FAF8F5]/20"
                style={{ backgroundColor: color.hex }}
              />
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-mono text-[#FAF8F5]/60 uppercase tracking-wider">{color.name}</span>
                <span className="text-xs font-mono text-[#FAF8F5] font-semibold">{color.hex}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recommendations by Category */}
      <motion.div variants={itemVariants} className="space-y-6">
        <h3 className="text-2xl font-serif font-bold text-[#FAF8F5] px-2">Curated Harmonic Coordinates</h3>
        
        {Object.entries(grouped).map(([category, items]) => {
          return (
            <div key={category} className="space-y-3">
              <div className="flex items-center gap-2 px-2">
                <div className="p-1.5 rounded-lg bg-[#1e3a8a] text-white">
                  {CATEGORY_ICONS[category] || <ShoppingBag className="w-4 h-4" />}
                </div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#FAF8F5]">{category}</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((acc: AccessoryRecommendationItem, idx: number) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ y: -4 }}
                    className="bg-[#0f254e]/40 border border-[#FAF8F5]/15 p-5 rounded-2xl backdrop-blur-sm relative overflow-hidden group hover:border-[#FAF8F5]/30 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#1e3a8a] text-[#FAF8F5] font-bold">
                          {acc.material}
                        </span>
                        {acc.inCloset ? (
                          <div className="bg-[#FAF8F5] text-[#0a192f] text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <Shirt className="w-3 h-3" /> In Closet
                          </div>
                        ) : (
                          <div className="bg-[#1e3a8a]/60 text-[#FAF8F5] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#FAF8F5]/20 flex items-center gap-1">
                            <ShoppingBag className="w-3 h-3" /> Suggestion
                          </div>
                        )}
                      </div>
                      
                      <h4 className="text-sm font-bold text-[#FAF8F5] mb-2">{acc.styleName}</h4>
                      <p className="text-xs text-[#FAF8F5]/70 mb-4 leading-relaxed">
                        {acc.reasoning}
                      </p>
                    </div>
                    
                    <div className="flex gap-2 pt-2 border-t border-[#FAF8F5]/10">
                      <button
                        onClick={() => handleAddToCollection(acc)}
                        className="w-full py-2 bg-[#FAF8F5] hover:bg-white text-[#0a192f] text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#1e3a8a]" /> Collect to Wardrobe
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
    </>
  );
}
