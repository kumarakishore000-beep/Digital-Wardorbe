'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Plus, Heart, ShoppingBag } from 'lucide-react';
import { useCollection } from '@/hooks/useCollection';

interface Suggestion {
  name: string;
  category: string;
  reason: string;
  styleImpact: 'High' | 'Medium' | 'Low';
  color: string;
  icon: string;
}

const ALL_SUGGESTIONS: Suggestion[] = [
  { name: 'Minimalist Silver Watch', category: 'Watch', reason: 'A versatile timepiece that elevates any outfit from casual to formal', styleImpact: 'High', color: '#C0C0C0', icon: '⌚' },
  { name: 'Gold Cuban Link Chain', category: 'Chain', reason: 'Adds warmth and luxury to basic tees and open-collar shirts', styleImpact: 'High', color: '#FFD700', icon: '📿' },
  { name: 'Leather Wrap Bracelet', category: 'Bracelet', reason: 'A textured accessory that works across seasons and settings', styleImpact: 'Medium', color: '#8B4513', icon: '📿' },
  { name: 'Classic Aviator Sunglasses', category: 'Sunglasses', reason: 'Timeless eye protection that suits almost every face shape', styleImpact: 'Medium', color: '#333333', icon: '🕶️' },
  { name: 'Beaded Bracelet Set', category: 'Bracelet', reason: 'Stackable bracelets for a bohemian or casual layered look', styleImpact: 'Low', color: '#E8D5B7', icon: '📿' },
  { name: 'Statement Ring', category: 'Jewelry', reason: 'A bold piece that becomes a conversation starter', styleImpact: 'Medium', color: '#B8860B', icon: '💍' },
  { name: 'Crossbody Mini Bag', category: 'Bag', reason: 'Hands-free convenience meets modern style for outdoor events', styleImpact: 'Medium', color: '#2F2F2F', icon: '👜' },
  { name: 'Canvas Sneakers', category: 'Shoes', reason: 'Clean, minimal sneakers that bridge casual and smart-casual', styleImpact: 'High', color: '#FFFFFF', icon: '👟' },
  { name: 'Dress Loafers', category: 'Shoes', reason: 'Versatile footwear for cocktail events and business settings', styleImpact: 'High', color: '#5C4033', icon: '👞' },
  { name: 'Fedora Hat', category: 'Hat', reason: 'A sophisticated topper for outdoor and semi-formal occasions', styleImpact: 'Medium', color: '#4A4A4A', icon: '🎩' },
  { name: 'Pearl Necklace', category: 'Jewelry', reason: 'Classic elegance that pairs with both casual and formal wear', styleImpact: 'High', color: '#F5F5DC', icon: '📿' },
  { name: 'Smart Watch Band', category: 'Watch', reason: 'Swap tech for style with premium interchangeable bands', styleImpact: 'Low', color: '#1C1C1C', icon: '⌚' },
  { name: 'Ankle Boots', category: 'Shoes', reason: 'Cold weather essential that works with jeans, skirts, and dresses', styleImpact: 'High', color: '#3D2B1F', icon: '🥾' },
  { name: 'Chain Link Bracelet', category: 'Bracelet', reason: 'Metallic texture adds edge to any outfit', styleImpact: 'Medium', color: '#C0C0C0', icon: '📿' },
  { name: 'Bucket Hat', category: 'Hat', reason: 'Casual outdoor essential with a trendy streetwear vibe', styleImpact: 'Low', color: '#556B2F', icon: '🧢' },
];

const IMPACT_COLORS = {
  High: 'from-amber-500 to-orange-500',
  Medium: 'from-blue-500 to-cyan-500',
  Low: 'from-slate-400 to-slate-500',
};

interface SuggestionBoxProps {
  collection: ReturnType<typeof useCollection>;
  onTrySuggestion?: () => void;
}

export default function SuggestionBox({ collection, onTrySuggestion }: SuggestionBoxProps) {
  const { items, addToWishlist, wishlist, addItem } = collection;

  // Filter to suggestions the user doesn't own yet
  const ownedCategories = new Set(items.map(i => i.category));
  const ownedNames = new Set(items.map(i => i.name.toLowerCase()));

  const suggestions = ALL_SUGGESTIONS.filter(
    s => !ownedNames.has(s.name.toLowerCase())
  ).sort((a, b) => {
    // Prioritize categories the user doesn't have
    const aHas = ownedCategories.has(a.category as any) ? 1 : 0;
    const bHas = ownedCategories.has(b.category as any) ? 1 : 0;
    if (aHas !== bHas) return aHas - bHas;
    // Then by impact
    const impactOrder = { High: 0, Medium: 1, Low: 2 };
    return impactOrder[a.styleImpact] - impactOrder[b.styleImpact];
  }).slice(0, 6);

  const isInWishlist = (name: string) =>
    wishlist.some(w => w.name.toLowerCase() === name.toLowerCase());

  const handleAddToWishlist = (suggestion: Suggestion) => {
    if (!isInWishlist(suggestion.name)) {
      addToWishlist({
        name: suggestion.name,
        category: suggestion.category,
        reason: suggestion.reason,
      });
    }
  };

  const handleTrySuggestion = (suggestion: Suggestion) => {
    addItem({
      name: suggestion.name,
      category: suggestion.category as any,
      color: suggestion.color,
      tags: ['suggested'],
    });
    onTrySuggestion?.();
  };

  if (suggestions.length === 0) {
    return (
      <div className="text-center py-12 space-y-3">
        <div className="text-5xl">🎉</div>
        <p className="text-xl font-semibold text-white">You've got everything!</p>
        <p className="text-sm text-white/50">Your collection is comprehensive. Keep exploring new styles!</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-6"
    >
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-amber-500/20 rounded-xl">
          <Lightbulb className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Try Something New</h3>
          <p className="text-sm text-white/50">Handpicked suggestions to elevate your wardrobe</p>
        </div>
      </div>

      {/* Suggestion Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suggestions.map((suggestion, idx) => (
          <motion.div
            key={suggestion.name}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            whileHover={{ y: -3 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group relative overflow-hidden"
          >
            {/* Style Impact Badge */}
            <div className="absolute top-3 right-3">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-gradient-to-r ${IMPACT_COLORS[suggestion.styleImpact]} text-white`}>
                {suggestion.styleImpact} Impact
              </span>
            </div>

            {/* Icon + Category */}
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border border-white/10"
                style={{ backgroundColor: suggestion.color + '20' }}
              >
                {suggestion.icon}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                  {suggestion.category}
                </p>
                <h4 className="text-base font-bold text-white pr-16">{suggestion.name}</h4>
              </div>
            </div>

            {/* Reason */}
            <p className="text-sm text-white/55 leading-relaxed mb-4">{suggestion.reason}</p>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => handleTrySuggestion(suggestion)}
                className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 text-sm font-semibold rounded-xl border border-emerald-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add to Collection
              </button>
              <button
                onClick={() => handleAddToWishlist(suggestion)}
                disabled={isInWishlist(suggestion.name)}
                className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isInWishlist(suggestion.name)
                    ? 'bg-pink-500/20 border-pink-500/30 text-pink-300'
                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-pink-500/10 hover:text-pink-300 hover:border-pink-500/20'
                }`}
              >
                <Heart className={`w-4 h-4 ${isInWishlist(suggestion.name) ? 'fill-current' : ''}`} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Wishlist Preview */}
      {wishlist.length > 0 && (
        <div className="bg-pink-500/5 border border-pink-500/10 rounded-2xl p-5 mt-4">
          <h4 className="text-sm font-semibold text-pink-300 mb-3 flex items-center gap-2">
            <Heart className="w-4 h-4 fill-current" /> Wishlist ({wishlist.length} items)
          </h4>
          <div className="flex flex-wrap gap-2">
            {wishlist.map(item => (
              <span
                key={item.id}
                className="px-3 py-1.5 bg-pink-500/10 border border-pink-500/20 text-pink-200 text-xs font-medium rounded-full"
              >
                {item.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
