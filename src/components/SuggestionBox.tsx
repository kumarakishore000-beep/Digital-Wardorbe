'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ShoppingBag,
  Plus,
  Heart,
  Check,
  Shirt,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import { useCollection, CollectionItem } from '@/hooks/useCollection';
import { useAuth } from '@/hooks/useAuth';
import LoginModal from '@/components/LoginModal';

export interface LookStoryItem {
  name: string;
  category: CollectionItem['category'];
  color: string;
  icon: string;
  reason: string;
}

export interface CuratedLookStory {
  id: string;
  code: string;
  title: string;
  category: string;
  tagline: string;
  styleImpact: 'High' | 'Medium' | 'Low';
  image?: string;
  items: LookStoryItem[];
  palette: string[];
}

export const CURATED_LOOKS_DATA: CuratedLookStory[] = [
  {
    id: 'hp-stl-6',
    code: 'HP STL 6',
    title: 'Signature Brand Campaign Look',
    category: 'Festive Luxury',
    tagline: 'Flagship contemporary lehenga skirt & crop jacket ensemble with opulent accents',
    styleImpact: 'High',
    image: '/images/branding/hero-banner.jpg',
    palette: ['#3EA094', '#E36339', '#D4A343', '#E5D8CA'],
    items: [
      { name: 'Royal Sage Embellished Lehenga Skirt', category: 'Jewelry', color: '#3EA094', icon: '👗', reason: 'Flowing silhouette with delicate mirror and zari work.' },
      { name: 'Embroidered Crop Jacket & Blouse', category: 'Other', color: '#E5D8CA', icon: '🧥', reason: 'Modern structured layering over festive silk.' },
      { name: 'Polki Statement Choker & Jhumkas', category: 'Jewelry', color: '#D4A343', icon: '💍', reason: 'High-luxury heritage gold jewelry that anchors the look.' },
      { name: 'Zari Embroidered Box Clutch', category: 'Bag', color: '#E36339', icon: '👜', reason: 'Handcrafted evening clutch with metallic motifs.' },
      { name: 'Gold Metallic Block Heels', category: 'Shoes', color: '#D4A343', icon: '👠', reason: 'All-day comfort with festive shine.' },
    ],
  },
  {
    id: 'hp-stl-7',
    code: 'HP STL 7',
    title: 'Retro Denim & Street Casuals',
    category: 'Casual Street',
    tagline: 'Vintage washed denim trucker with straight-leg denim & retro sneakers',
    styleImpact: 'Medium',
    palette: ['#2A4365', '#E2E8F0', '#94A3B8', '#1E293B'],
    items: [
      { name: 'Vintage Washed Denim Trucker Jacket', category: 'Other', color: '#2A4365', icon: '🧥', reason: 'Timeless oversized layer for casual styling.' },
      { name: '90s Relaxed High-Rise Straight Jeans', category: 'Other', color: '#334155', icon: '👖', reason: 'Flattering classic cut that pairs with any tee.' },
      { name: 'Classic Aviator Sunglasses', category: 'Sunglasses', color: '#1E293B', icon: '🕶️', reason: 'UV protection with retro pilot flair.' },
      { name: 'White Platform Canvas Sneakers', category: 'Shoes', color: '#FFFFFF', icon: '👟', reason: 'Clean urban staple bridging casual and street wear.' },
      { name: 'Woven Leather Belt', category: 'Bracelet', color: '#78350F', icon: '📿', reason: 'Vintage brass buckle detail.' },
    ],
  },
  {
    id: 'hp-stl-8',
    code: 'HP STL 8',
    title: 'Minimalist Monochrome Evening',
    category: 'Evening Glam',
    tagline: 'Sleek midnight satin slip with tailored tuxedo blazer & sculptural silver',
    styleImpact: 'High',
    palette: ['#0F172A', '#334155', '#C0C0C0', '#F8FAFC'],
    items: [
      { name: 'Midnight Satin Floor Slip Gown', category: 'Other', color: '#0F172A', icon: '👗', reason: 'Liquid satin drape for evening cocktail impact.' },
      { name: 'Draped Tailored Tuxedo Jacket', category: 'Other', color: '#1E293B', icon: '🧥', reason: 'Sharp contrast over fluid satin.' },
      { name: 'Sculptural Silver Cuff Bracelet', category: 'Bracelet', color: '#C0C0C0', icon: '📿', reason: 'Architectural metalwork for minimal luxury.' },
      { name: 'Minimalist Ankle-Strap Stiletto Heels', category: 'Shoes', color: '#0F172A', icon: '👠', reason: 'Clean lines that elongate the silhouette.' },
      { name: 'Micro Velvet Minaudière Clutch', category: 'Bag', color: '#1E293B', icon: '👜', reason: 'Compact luxury for gala and evening events.' },
    ],
  },
  {
    id: 'hp-stl-9',
    code: 'HP STL 9',
    title: 'Active Weekend Athleisure',
    category: 'Sport & Active',
    tagline: 'Seamless ribbed compression set with oversized fleece zip hoodie',
    styleImpact: 'Low',
    palette: ['#475569', '#38BDF8', '#F1F5F9', '#0284C7'],
    items: [
      { name: 'Seamless Ribbed Compression Crop Tank', category: 'Other', color: '#38BDF8', icon: '🎽', reason: 'Moisture-wicking athletic support.' },
      { name: 'High-Waist Sculpting Yoga Trackpants', category: 'Other', color: '#475569', icon: '🩳', reason: '4-way stretch fabric for active movement.' },
      { name: 'Oversized French Terry Zip Hoodie', category: 'Other', color: '#E2E8F0', icon: '🧥', reason: 'Cozy post-workout layering.' },
      { name: 'Cushioned Performance Runners', category: 'Shoes', color: '#FFFFFF', icon: '👟', reason: 'Impact absorption and modern running silhouette.' },
      { name: 'Sport Smartwatch Band', category: 'Watch', color: '#0284C7', icon: '⌚', reason: 'Lightweight silicone strap for fitness tracking.' },
    ],
  },
  {
    id: 'hp-stl-10',
    code: 'HP STL 10',
    title: 'Royal Heritage Celebration',
    category: 'Grand Festive',
    tagline: 'Handcrafted zari silk ensemble with antique brooch & royal mojaris',
    styleImpact: 'High',
    palette: ['#7C2D12', '#D97706', '#FEF3C7', '#451A03'],
    items: [
      { name: 'Handcrafted Zari Silk Kurta Ensemble', category: 'Other', color: '#7C2D12', icon: '👘', reason: 'Rich brocade weaving for celebratory weddings.' },
      { name: 'Pure Silk Draped Dupatta Trousers', category: 'Other', color: '#FEF3C7', icon: '🧣', reason: 'Lustrous drape with antique gold border.' },
      { name: 'Antique Royal Brooch Pin', category: 'Jewelry', color: '#D97706', icon: '👑', reason: 'Vintage regal accent for chest lapel.' },
      { name: 'Velvet Hand-Embroidered Mojaris', category: 'Shoes', color: '#451A03', icon: '👞', reason: 'Traditional artisanal footwear.' },
      { name: 'Classic Gold Cuban Chain', category: 'Chain', color: '#F59E0B', icon: '📿', reason: 'Timeless warmth and festive celebration.' },
    ],
  },
  {
    id: 'hp-stl-1',
    code: 'HP STL 1',
    title: 'Modern Festive Fusion',
    category: 'Indo-Western',
    tagline: 'Coral embellished crop top with floral flared palazzos & sheer cape',
    styleImpact: 'High',
    image: '/images/branding/womens-ethnic-fusion.jpg',
    palette: ['#FB923C', '#FDE047', '#F472B6', '#FFF7ED'],
    items: [
      { name: 'Coral Peach Embellished Crop Top', category: 'Jewelry', color: '#FB923C', icon: '👚', reason: 'Intricate golden embroidery on festive silk.' },
      { name: 'High-Waist Flared Floral Palazzos', category: 'Other', color: '#FFF7ED', icon: '👖', reason: 'Vibrant printed crepe with fluid flare.' },
      { name: 'Sheer Organza Matching Cape Jacket', category: 'Other', color: '#FB923C', icon: '🧥', reason: 'Airy bohemian layering with embroidered border.' },
      { name: 'Kundan Drop Chandelier Earrings', category: 'Jewelry', color: '#FDE047', icon: '💍', reason: 'Festive statement ear jewelry.' },
      { name: 'Metallic Rose-Gold Stiletto Sandals', category: 'Shoes', color: '#F472B6', icon: '👡', reason: 'Glamorous height and celebratory shine.' },
    ],
  },
  {
    id: 'stl-hp2',
    code: 'STL HP2',
    title: 'Urban Pastel Streetwear',
    category: 'Western Chic',
    tagline: 'Lavender cropped denim jacket with olive utility cargo joggers',
    styleImpact: 'Medium',
    image: '/images/branding/urban-western-casual.jpg',
    palette: ['#C084FC', '#65A30D', '#F8FAFC', '#1E293B'],
    items: [
      { name: 'Pastel Lavender Cropped Denim Jacket', category: 'Other', color: '#C084FC', icon: '🧥', reason: 'Frayed hem detail in trendsetting pastel wash.' },
      { name: 'High-Waisted Olive Utility Cargo Pants', category: 'Other', color: '#65A30D', icon: '👖', reason: 'Functional cargo pockets with elastic cuff hem.' },
      { name: 'Graphic Minimalist White Crewneck Tee', category: 'Other', color: '#FFFFFF', icon: '👕', reason: 'Crisp organic cotton layering base.' },
      { name: 'Chunky White Platform Sneakers', category: 'Shoes', color: '#FFFFFF', icon: '👟', reason: 'Comfortable street-smart silhouette.' },
      { name: 'Minimalist Silver Hoop Earrings', category: 'Jewelry', color: '#E2E8F0', icon: '💍', reason: 'Sleek metallic daily accessory.' },
    ],
  },
  {
    id: 'stl-hp3',
    code: 'STLHP3',
    title: "Men's Smart Ethnic Casual",
    category: 'Smart Ethnic',
    tagline: 'Printed teal linen short kurta with textured beige Nehru waistcoat',
    styleImpact: 'High',
    image: '/images/branding/mens-smart-casual.jpg',
    palette: ['#0D9488', '#D97706', '#F8FAFC', '#78350F'],
    items: [
      { name: 'Printed Teal-Green Linen Short Kurta', category: 'Other', color: '#0D9488', icon: '👔', reason: 'Breathable linen with subtle geometric ethnic print.' },
      { name: 'Textured Beige Nehru Waistcoat Jacket', category: 'Other', color: '#D97706', icon: '🧥', reason: 'Structured mandarin collar waistcoat.' },
      { name: 'Slim-Fit Tailored Ivory Chinos', category: 'Other', color: '#F8FAFC', icon: '👖', reason: 'Sharp tapered cut for clean contrast.' },
      { name: 'Tan Leather Penny Loafers', category: 'Shoes', color: '#78350F', icon: '👞', reason: 'Hand-burnished leather for smart casual poise.' },
      { name: 'Minimalist Chronograph Watch', category: 'Watch', color: '#1E293B', icon: '⌚', reason: 'Polished steel dial with leather strap.' },
    ],
  },
  {
    id: 'hp-stl-4',
    code: 'HP STL 4',
    title: 'Contemporary Office Chic',
    category: 'Workwear',
    tagline: 'Tailored double-breasted blazer with pleated high-waist trousers',
    styleImpact: 'High',
    palette: ['#1E3A8A', '#E0E7FF', '#94A3B8', '#0F172A'],
    items: [
      { name: 'Tailored Navy Double-Breasted Blazer', category: 'Other', color: '#1E3A8A', icon: '🧥', reason: 'Sharp shoulder line for confident boardroom presence.' },
      { name: 'Ivory Crepe Silk V-Neck Camisole', category: 'Other', color: '#FFFFFF', icon: '👚', reason: 'Soft luxury underlayer for business styling.' },
      { name: 'Pleated High-Waist Navy Trousers', category: 'Other', color: '#1E3A8A', icon: '👖', reason: 'Elongating wide-leg cut with structured pleats.' },
      { name: 'Structured Leather Work Laptop Tote', category: 'Bag', color: '#0F172A', icon: '👜', reason: 'Dedicated laptop compartment with gold hardware.' },
      { name: 'Pointed-Toe Leather Pumps', category: 'Shoes', color: '#0F172A', icon: '👠', reason: 'Timeless professional height and comfort.' },
    ],
  },
  {
    id: 'hp-stl-5',
    code: 'HP STL 5',
    title: 'Sunset Bohemian Resort',
    category: 'Resort Vacation',
    tagline: 'Tiered floral maxi sundress with woven straw tote & layered beads',
    styleImpact: 'Medium',
    palette: ['#E11D48', '#FB923C', '#FEF08A', '#78350F'],
    items: [
      { name: 'Tiered Sunset Floral Maxi Sundress', category: 'Other', color: '#E11D48', icon: '👗', reason: 'Fluid tiered skirt in radiant sunset tones.' },
      { name: 'Lightweight Linen Draped Shrug', category: 'Other', color: '#FEF08A', icon: '🧥', reason: 'Breezy sun protection for outdoor strolling.' },
      { name: 'Handwoven Jute Crossbody Tote', category: 'Bag', color: '#78350F', icon: '👜', reason: 'Artisanal woven texture for vacation essentials.' },
      { name: 'Layered Bohemian Beaded Necklaces', category: 'Chain', color: '#FB923C', icon: '📿', reason: 'Playful multi-strand beads with golden charms.' },
      { name: 'Strappy Espadrille Wedge Sandals', category: 'Shoes', color: '#78350F', icon: '👡', reason: 'Natural rope sole for beachside style.' },
    ],
  },
];

interface SuggestionBoxProps {
  collection: ReturnType<typeof useCollection>;
  onTrySuggestion?: () => void;
}

export default function SuggestionBox({ collection, onTrySuggestion }: SuggestionBoxProps) {
  const { isAuthenticated } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [activeLookIndex, setActiveLookIndex] = useState(0);
  const [collectedLookIds, setCollectedLookIds] = useState<string[]>([]);

  const { items, addToWishlist, wishlist, addItem } = collection;
  const activeLook = CURATED_LOOKS_DATA[activeLookIndex];

  const isInWishlist = (name: string) =>
    wishlist.some((w) => w.name.toLowerCase() === name.toLowerCase());

  const isItemInCollection = (name: string) =>
    items.some((i) => i.name.toLowerCase() === name.toLowerCase());

  const handleAddItem = (item: LookStoryItem) => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    addItem({
      name: item.name,
      category: item.category,
      color: item.color,
      tags: ['curated-look', activeLook.code.toLowerCase().replace(/\s+/g, '-')],
    });
    onTrySuggestion?.();
  };

  const handleShopAll = (story: CuratedLookStory) => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    for (const item of story.items) {
      if (!isItemInCollection(item.name)) {
        addItem({
          name: item.name,
          category: item.category,
          color: item.color,
          tags: ['curated-look', story.code.toLowerCase().replace(/\s+/g, '-')],
        });
      }
    }
    setCollectedLookIds((prev) => [...prev, story.id]);
    onTrySuggestion?.();
  };

  const handleAddToWishlist = (item: LookStoryItem) => {
    if (!isInWishlist(item.name)) {
      addToWishlist({
        name: item.name,
        category: item.category,
        reason: item.reason,
      });
    }
  };

  return (
    <>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        title="Sign In to Save Curated Looks"
        message="Sign in to save curated Pantaloons lookbook items directly into your personal digital wardrobe."
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full space-y-8"
      >
        {/* ========================================================= */}
        {/* 1. CURATED LOOKS FOR YOU — HEADER & TAB SELECTOR          */}
        {/* ========================================================= */}
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-white/10 p-6 md:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span>Pantaloons Fashion Intelligence</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                Curated Looks For You
              </h2>
              <p className="text-slate-400 text-sm md:text-base max-w-xl">
                Explore hand-styled outfit stories from <strong>HP STL 1</strong> to{' '}
                <strong>HP STL 10</strong>. One-click collect or test individual style pieces.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleShopAll(activeLook)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-indigo-500/30 hover:scale-105 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Shop All &bull; {activeLook.code}</span>
              </button>
            </div>
          </div>

          {/* LOOK STORY TABS (HP STL 6, HP STL 7, HP STL 8, etc.) */}
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
            {CURATED_LOOKS_DATA.map((look, idx) => {
              const isActive = activeLookIndex === idx;
              const isCollected = collectedLookIds.includes(look.id);
              return (
                <button
                  key={look.id}
                  onClick={() => setActiveLookIndex(idx)}
                  className={`shrink-0 px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all duration-300 flex items-center gap-2.5 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-400/50 shadow-lg shadow-indigo-500/30 ring-1 ring-white/20'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="font-mono tracking-wider">{look.code}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  <span className="font-normal text-white/80">{look.category}</span>
                  {isCollected && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. ACTIVE CURATED LOOK DETAIL SHOWCASE                    */}
        {/* ========================================================= */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeLook.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Left Card: Look Hero & Palette (5 Cols) */}
            <div className="lg:col-span-5 rounded-3xl bg-slate-900/80 border border-white/10 p-6 space-y-6 shadow-xl backdrop-blur-xl sticky top-24">
              {/* Image Preview if available */}
              {activeLook.image && (
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                  <img
                    src={activeLook.image}
                    alt={activeLook.title}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-black/60 backdrop-blur-md text-white border border-white/20">
                      {activeLook.code} &bull; {activeLook.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                      {activeLook.styleImpact} Impact
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-indigo-400 font-bold uppercase tracking-wider">
                    {activeLook.code}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{activeLook.category}</span>
                </div>
                <h3 className="text-2xl font-bold text-white leading-snug">{activeLook.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{activeLook.tagline}</p>
              </div>

              {/* Curated Color Harmonized Swatches */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <span className="text-xs font-mono uppercase text-slate-400">
                  Look Harmonized Palette
                </span>
                <div className="flex items-center gap-2">
                  {activeLook.palette.map((hex, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-1.5">
                      <span
                        className="w-7 h-7 rounded-xl border border-white/20 shadow-md"
                        style={{ backgroundColor: hex }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Shop All Trigger */}
              <button
                onClick={() => handleShopAll(activeLook)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Shop All {activeLook.items.length} Items ({activeLook.code})</span>
              </button>
            </div>

            {/* Right Card: Individual Items in this Look Story (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    <Shirt className="w-5 h-5 text-indigo-400" />
                    <span>Included Style Pieces in {activeLook.code}</span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Add individual items to your collection or wishlist
                  </p>
                </div>
                <span className="text-xs font-mono text-indigo-300 font-semibold">
                  {activeLook.items.length} Curated Pieces
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3.5">
                {activeLook.items.map((item, iIdx) => {
                  const inCol = isItemInCollection(item.name);
                  const inWish = isInWishlist(item.name);

                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: iIdx * 0.05 }}
                      className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        inCol
                          ? 'bg-emerald-950/30 border-emerald-500/30 shadow-md'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-start sm:items-center gap-3.5 flex-1">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border border-white/10 shrink-0 shadow-inner"
                          style={{ backgroundColor: item.color + '25' }}
                        >
                          {item.icon}
                        </div>
                        <div className="space-y-1 overflow-hidden">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/10 text-indigo-300 font-mono">
                              {item.category}
                            </span>
                            <h5 className="text-base font-bold text-white">{item.name}</h5>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">{item.reason}</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => handleAddItem(item)}
                          disabled={inCol}
                          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                            inCol
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                          }`}
                        >
                          {inCol ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>In Collection</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add to Wardrobe</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleAddToWishlist(item)}
                          disabled={inWish}
                          className={`p-2 rounded-xl border transition-all ${
                            inWish
                              ? 'bg-pink-500/20 border-pink-500/30 text-pink-300'
                              : 'bg-white/5 border-white/10 text-white/60 hover:bg-pink-500/10 hover:text-pink-300 hover:border-pink-500/20'
                          }`}
                          title={inWish ? 'In Wishlist' : 'Add to Wishlist'}
                        >
                          <Heart className={`w-4 h-4 ${inWish ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ========================================================= */}
        {/* 3. ACTIVE WISHLIST OVERVIEW                                */}
        {/* ========================================================= */}
        {wishlist.length > 0 && (
          <div className="rounded-3xl bg-pink-500/5 border border-pink-500/15 p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-pink-300 flex items-center gap-2">
                <Heart className="w-4 h-4 fill-current text-pink-400" />
                <span>Your Saved Wishlist ({wishlist.length} items)</span>
              </h4>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {wishlist.map((wItem) => (
                <span
                  key={wItem.id}
                  className="px-3.5 py-1.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-200 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Tag className="w-3 h-3 text-pink-400" />
                  {wItem.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
}
