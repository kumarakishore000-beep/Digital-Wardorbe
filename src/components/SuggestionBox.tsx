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
  ChevronLeft,
  ChevronRight,
  Eye,
  Layers,
  ArrowUpRight,
  Info,
} from 'lucide-react';
import { useCollection, CollectionItem } from '@/hooks/useCollection';
import { useAuth } from '@/hooks/useAuth';
import LoginModal from '@/components/LoginModal';

export interface LookStoryItem {
  id: string;
  name: string;
  category: CollectionItem['category'];
  color: string;
  icon: string;
  image?: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  reason: string;
  swatchLabel?: string;
  price?: string;
}

export interface CuratedLookStory {
  id: string;
  code: string;
  titleSerif: string;
  titleSans: string;
  category: string;
  tagline: string;
  styleImpact: 'High' | 'Medium' | 'Low';
  modelImage: string;
  themeColor: string;
  tintPanel1: string;
  tintPanel2: string;
  items: LookStoryItem[];
  palette: string[];
}

export const CURATED_LOOKS_DATA: CuratedLookStory[] = [
  {
    id: 'look-casual-work',
    code: 'LOOK 01',
    titleSerif: 'Casual',
    titleSans: 'WORKPLACES',
    category: 'Smart Casual',
    tagline: 'Modern utility jacket layered over organic white tee with relaxed indigo denim and commuter backpack.',
    styleImpact: 'High',
    modelImage: '/images/branding/mens-smart-casual.jpg',
    themeColor: '#1e3a8a',
    tintPanel1: 'bg-[#dbeafe]/70',
    tintPanel2: 'bg-[#f4efeb]',
    palette: ['#1e3a8a', '#fffff0', '#4b5563', '#1e293b'],
    items: [
      {
        id: 'c-bag',
        name: 'Technical Commuter Backpack',
        category: 'Bag',
        color: '#0f172a',
        icon: '🎒',
        position: 'top-left',
        swatchLabel: 'DETAIL DECODED',
        reason: 'Water-resistant matte ballistic nylon with padded laptop sleeve.',
        price: '$89',
      },
      {
        id: 'c-jacket',
        name: 'Structured Utility Zip Overshirt',
        category: 'Other',
        color: '#475569',
        icon: '🧥',
        position: 'top-right',
        reason: 'Tailored collar with dual chest pockets in heavyweight cotton twill.',
        price: '$119',
      },
      {
        id: 'c-pants',
        name: 'Deep Indigo Straight-Leg Jeans',
        category: 'Other',
        color: '#1e293b',
        icon: '👖',
        position: 'bottom-left',
        reason: 'Clean selvedge rinse without distressing for elevated office polish.',
        price: '$95',
      },
      {
        id: 'c-shoes',
        name: 'Low-Top Suede City Sneakers',
        category: 'Shoes',
        color: '#334155',
        icon: '👟',
        position: 'bottom-right',
        reason: 'Ergonomic gum sole with hand-stitched leather-lined heel.',
        price: '$110',
      },
    ],
  },
  {
    id: 'look-regal-evening',
    code: 'LOOK 02',
    titleSerif: 'Regal',
    titleSans: 'CELEBRATION',
    category: 'Indo-Western Fusion',
    tagline: 'Opulent embroidered cropped bandhgala paired with layered ivory palazzo trousers and handcrafted jewelry.',
    styleImpact: 'High',
    modelImage: '/images/branding/womens-ethnic-fusion.jpg',
    themeColor: '#1e3a8a',
    tintPanel1: 'bg-[#fdfbf7]',
    tintPanel2: 'bg-[#1e3a8a]/10',
    palette: ['#1e3a8a', '#fffff0', '#c2a649', '#0a192f'],
    items: [
      {
        id: 'r-jewelry',
        name: 'Heritage Royal Blue Choker',
        category: 'Jewelry',
        color: '#1e3a8a',
        icon: '💍',
        position: 'top-left',
        swatchLabel: 'FINE ATELIER',
        reason: 'Polki and sapphire-toned enamel accents framed in 18k gold plating.',
        price: '$145',
      },
      {
        id: 'r-jacket',
        name: 'Ivory Zari Embroidered Cape',
        category: 'Other',
        color: '#fffff0',
        icon: '🧥',
        position: 'top-right',
        reason: 'Weightless sheer organza with delicate metallic threadwork.',
        price: '$175',
      },
      {
        id: 'r-pants',
        name: 'Pleated Silk Crepe Palazzos',
        category: 'Other',
        color: '#FAF8F5',
        icon: '👖',
        position: 'bottom-left',
        reason: 'Fluid drape with subtle flare that moves with regal grace.',
        price: '$120',
      },
      {
        id: 'r-shoes',
        name: 'Metallic Ankle-Strap Stilettos',
        category: 'Shoes',
        color: '#eae3d2',
        icon: '👡',
        position: 'bottom-right',
        reason: 'Mirrored gold finish with cushioned insole for festive soirées.',
        price: '$135',
      },
    ],
  },
  {
    id: 'look-urban-street',
    code: 'LOOK 03',
    titleSerif: 'Pastel',
    titleSans: 'STREETWEAR',
    category: 'Urban Casual',
    tagline: 'Cropped vintage trucker jacket with relaxed cargo utility trousers and clean ivory platform sneakers.',
    styleImpact: 'Medium',
    modelImage: '/images/branding/urban-western-casual.jpg',
    themeColor: '#1e3a8a',
    tintPanel1: 'bg-[#faf8f5]',
    tintPanel2: 'bg-[#93c5fd]/20',
    palette: ['#1e3a8a', '#fffff0', '#64748b', '#0f2042'],
    items: [
      {
        id: 'u-bag',
        name: 'Crossbody Mini Sling Bag',
        category: 'Bag',
        color: '#1e3a8a',
        icon: '👜',
        position: 'top-left',
        swatchLabel: 'STREET CAPSULE',
        reason: 'Compact cordura sling with matte royal blue hardware clips.',
        price: '$65',
      },
      {
        id: 'u-jacket',
        name: 'Boxy Cropped Denim Trucker',
        category: 'Other',
        color: '#93c5fd',
        icon: '🧥',
        position: 'top-right',
        reason: 'Soft stone-washed denim with dropped shoulders and raw hem.',
        price: '$105',
      },
      {
        id: 'u-pants',
        name: 'Utility Cargo Joggers',
        category: 'Other',
        color: '#334155',
        icon: '👖',
        position: 'bottom-left',
        reason: 'Articulated knee seams and magnetic snap cargo pockets.',
        price: '$88',
      },
      {
        id: 'u-shoes',
        name: 'Ivory Platform Court Sneakers',
        category: 'Shoes',
        color: '#fffff0',
        icon: '👟',
        position: 'bottom-right',
        reason: 'Chunky ivory vulcanized rubber sole with premium calf leather.',
        price: '$125',
      },
    ],
  },
  {
    id: 'look-brand-hero',
    code: 'LOOK 04',
    titleSerif: 'Signature',
    titleSans: 'HERO ENSEMBLE',
    category: 'Grand Festive',
    tagline: 'Pantaloons flagship coordinated festive silhouette with ivory brocade and royal blue accents.',
    styleImpact: 'High',
    modelImage: '/images/branding/hero-banner.jpg',
    themeColor: '#1e3a8a',
    tintPanel1: 'bg-[#dbeafe]/50',
    tintPanel2: 'bg-[#fdfbf7]',
    palette: ['#0a192f', '#1e3a8a', '#fffff0', '#eae3d2'],
    items: [
      {
        id: 'h-chain',
        name: 'Sculpted Golden Link Chain',
        category: 'Chain',
        color: '#eae3d2',
        icon: '📿',
        position: 'top-left',
        swatchLabel: 'ICONIC PIECE',
        reason: 'Architectural links bringing radiant warmth to royal blue silk.',
        price: '$95',
      },
      {
        id: 'h-kurta',
        name: 'Brocade Structured Nehru Jacket',
        category: 'Other',
        color: '#1e3a8a',
        icon: '🧥',
        position: 'top-right',
        reason: 'Tailored mandarin collar with self-textured zari weave.',
        price: '$160',
      },
      {
        id: 'h-chinos',
        name: 'Tapered Tailored Ivory Trousers',
        category: 'Other',
        color: '#FAF8F5',
        icon: '👖',
        position: 'bottom-left',
        reason: 'Crisp front crease and comfortable stretch cotton twill.',
        price: '$90',
      },
      {
        id: 'h-shoes',
        name: 'Burnished Royal Leather Loafers',
        category: 'Shoes',
        color: '#0f172a',
        icon: '👞',
        position: 'bottom-right',
        reason: 'Hand-finished edge with tonal saddle strap.',
        price: '$140',
      },
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
  const [selectedItemForInspect, setSelectedItemForInspect] = useState<LookStoryItem | null>(null);

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
    if (!collectedLookIds.includes(story.id)) {
      setCollectedLookIds((prev) => [...prev, story.id]);
    }
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

  const nextLook = () => {
    setActiveLookIndex((prev) => (prev + 1) % CURATED_LOOKS_DATA.length);
  };

  const prevLook = () => {
    setActiveLookIndex((prev) => (prev - 1 + CURATED_LOOKS_DATA.length) % CURATED_LOOKS_DATA.length);
  };

  return (
    <>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        title="Sign In to Save Curated Looks"
        message="Sign in to save curated moodboard looks and pieces directly into your personal digital wardrobe."
      />

      <div className="w-full space-y-8">
        {/* ========================================================= */}
        {/* TOP SECTION HEADER: Curated Looks For You                */}
        {/* ========================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#FAF8F5]/15">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1e3a8a]/20 border border-[#FAF8F5]/20 text-[#FAF8F5] text-xs font-semibold uppercase tracking-widest mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#fffff0]" />
              <span>AuraStyle Lookbook Capsule</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-[#FAF8F5] tracking-tight font-serif">
              Curated Looks For You
            </h2>
            <p className="text-[#FAF8F5]/70 text-sm md:text-base max-w-xl mt-1">
              Hand-styled magazine moodboards in <strong>Royal Blue & Ivory</strong>. One-click collect full ensembles or curate individual pieces.
            </p>
          </div>

          {/* Quick Look Selector Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevLook}
              className="p-2.5 rounded-full bg-[#1e3a8a]/40 border border-[#FAF8F5]/20 text-[#FAF8F5] hover:bg-[#1e3a8a] transition-all"
              aria-label="Previous Look"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-mono text-[#FAF8F5]/80 px-2 font-semibold">
              {activeLookIndex + 1} / {CURATED_LOOKS_DATA.length}
            </span>
            <button
              onClick={nextLook}
              className="p-2.5 rounded-full bg-[#1e3a8a]/40 border border-[#FAF8F5]/20 text-[#FAF8F5] hover:bg-[#1e3a8a] transition-all"
              aria-label="Next Look"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab category pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CURATED_LOOKS_DATA.map((look, idx) => {
            const isActive = activeLookIndex === idx;
            const isCollected = collectedLookIds.includes(look.id);
            return (
              <button
                key={look.id}
                onClick={() => setActiveLookIndex(idx)}
                className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 border ${
                  isActive
                    ? 'bg-[#FAF8F5] text-[#0a192f] border-[#FAF8F5] shadow-lg shadow-[#1e3a8a]/30 scale-105'
                    : 'bg-[#0f254e]/60 border-[#FAF8F5]/10 text-[#FAF8F5]/70 hover:bg-[#16366f] hover:text-[#FAF8F5]'
                }`}
              >
                <span>{look.titleSerif}</span>
                <span className="opacity-60 text-[10px] uppercase font-mono">{look.titleSans}</span>
                {isCollected && <CheckCircle2 className="w-3.5 h-3.5 text-[#2563eb]" />}
              </button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* MOODBOARD EDITORIAL CARD (MATCHING USER REFERENCE IMAGE)  */}
        {/* ========================================================= */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeLook.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35 }}
            className="relative rounded-3xl bg-[#FAF8F5] text-[#0a192f] p-6 md:p-10 shadow-2xl border border-[#FAF8F5]/30 overflow-hidden"
          >
            {/* Background tinted geometric color blocks (like reference photo) */}
            <div className="absolute inset-0 pointer-events-none grid grid-cols-12 grid-rows-12 opacity-60">
              <div className="col-span-7 row-span-6 bg-[#dbeafe]/60 rounded-3xl m-2" />
              <div className="col-span-5 row-span-8 bg-[#eae3d2]/70 rounded-3xl m-2" />
              <div className="col-span-6 row-span-6 bg-[#f4efeb] rounded-3xl m-2" />
              <div className="col-span-6 row-span-6 bg-[#bfdbfe]/40 rounded-3xl m-2" />
            </div>

            {/* Sparkle & Starburst Decorative Elements */}
            <div className="absolute top-8 left-8 text-[#1e3a8a]/30 pointer-events-none select-none text-xl">
              ✦ ✧
            </div>
            <div className="absolute top-20 right-12 text-[#1e3a8a]/30 pointer-events-none select-none text-2xl">
              ✧ ✦
            </div>
            <div className="absolute bottom-16 left-12 text-[#1e3a8a]/20 pointer-events-none select-none text-lg">
              ✦
            </div>

            {/* Content Container */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* ======================================================= */}
              {/* LEFT & CENTER: THE MOODBOARD COLLAGE (7 Cols)          */}
              {/* ======================================================= */}
              <div className="lg:col-span-7 relative min-h-[480px] sm:min-h-[540px] md:min-h-[580px] flex items-center justify-center">
                
                {/* Look Title (Top/Left of Moodboard Card) */}
                <div className="absolute top-2 left-2 sm:left-4 z-20">
                  <div className="font-serif text-3xl sm:text-4xl text-[#0a192f] font-normal leading-tight">
                    {activeLook.titleSerif}
                  </div>
                  <div className="text-[11px] sm:text-xs font-sans tracking-[0.25em] text-[#1e3a8a] font-black uppercase">
                    {activeLook.titleSans}
                  </div>
                </div>

                {/* Floating Item 1 (Top-Left): Backpack / Bag + Swatch Label */}
                {activeLook.items.find((i) => i.position === 'top-left') && (() => {
                  const item = activeLook.items.find((i) => i.position === 'top-left')!;
                  const inCol = isItemInCollection(item.name);
                  return (
                    <div className="absolute top-14 sm:top-16 left-0 sm:left-4 z-20 flex flex-col items-start gap-1">
                      <button
                        onClick={() => setSelectedItemForInspect(item)}
                        className="group relative bg-[#0a192f] text-[#FAF8F5] p-3.5 sm:p-4 rounded-2xl shadow-xl border-2 border-[#FAF8F5] hover:scale-105 transition-all flex flex-col items-center justify-center cursor-pointer"
                        title="Click to inspect item"
                      >
                        <span className="text-3xl sm:text-4xl">{item.icon}</span>
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#1e3a8a] text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow">
                          {inCol ? '✓' : '+'}
                        </span>
                      </button>
                      {item.swatchLabel && (
                        <div className="bg-[#FAF8F5] text-[#0a192f] border border-[#0a192f]/20 px-2 py-0.5 rounded shadow-sm text-[9px] font-mono font-black tracking-wider uppercase">
                          {item.swatchLabel}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Floating Item 2 (Top-Right): Jacket / Overshirt */}
                {activeLook.items.find((i) => i.position === 'top-right') && (() => {
                  const item = activeLook.items.find((i) => i.position === 'top-right')!;
                  const inCol = isItemInCollection(item.name);
                  return (
                    <div className="absolute top-2 sm:top-4 right-0 sm:right-4 z-20">
                      <button
                        onClick={() => setSelectedItemForInspect(item)}
                        className="group relative bg-white text-[#0a192f] p-4 sm:p-5 rounded-2xl shadow-xl border-2 border-[#1e3a8a]/20 hover:scale-105 transition-all flex flex-col items-center justify-center cursor-pointer"
                        title="Click to inspect item"
                      >
                        <span className="text-3xl sm:text-4xl">{item.icon}</span>
                        <div className="text-[10px] font-bold text-[#1e3a8a] mt-1 line-clamp-1 max-w-[80px] text-center">
                          {item.name.split(' ')[0]}
                        </div>
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#1e3a8a] text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow">
                          {inCol ? '✓' : '+'}
                        </span>
                      </button>
                    </div>
                  );
                })()}

                {/* Central Model Figure (Cutout Style) */}
                <div className="relative z-10 w-52 sm:w-64 md:w-72 h-[380px] sm:h-[440px] md:h-[480px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white mx-auto flex items-center justify-center bg-[#0a192f]/5">
                  <img
                    src={activeLook.modelImage}
                    alt={activeLook.titleSerif + ' ' + activeLook.titleSans}
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                  />
                  {/* Subtle vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f]/40 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Floating Item 3 (Bottom-Left): Trousers / Jeans */}
                {activeLook.items.find((i) => i.position === 'bottom-left') && (() => {
                  const item = activeLook.items.find((i) => i.position === 'bottom-left')!;
                  const inCol = isItemInCollection(item.name);
                  return (
                    <div className="absolute bottom-4 sm:bottom-8 left-2 sm:left-6 z-20">
                      <button
                        onClick={() => setSelectedItemForInspect(item)}
                        className="group relative bg-white text-[#0a192f] p-3.5 sm:p-4 rounded-2xl shadow-xl border-2 border-[#1e3a8a]/20 hover:scale-105 transition-all flex flex-col items-center justify-center cursor-pointer"
                        title="Click to inspect item"
                      >
                        <span className="text-3xl sm:text-4xl">{item.icon}</span>
                        <div className="text-[10px] font-bold text-[#0a192f] mt-1">
                          {item.name.split(' ').slice(-1)[0]}
                        </div>
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#1e3a8a] text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow">
                          {inCol ? '✓' : '+'}
                        </span>
                      </button>
                    </div>
                  );
                })()}

                {/* Floating Item 4 (Bottom-Right): Shoes / Footwear */}
                {activeLook.items.find((i) => i.position === 'bottom-right') && (() => {
                  const item = activeLook.items.find((i) => i.position === 'bottom-right')!;
                  const inCol = isItemInCollection(item.name);
                  return (
                    <div className="absolute bottom-16 sm:bottom-20 right-2 sm:right-6 z-20">
                      <button
                        onClick={() => setSelectedItemForInspect(item)}
                        className="group relative bg-[#0a192f] text-white p-3.5 sm:p-4 rounded-2xl shadow-xl border-2 border-[#FAF8F5] hover:scale-105 transition-all flex flex-col items-center justify-center cursor-pointer"
                        title="Click to inspect item"
                      >
                        <span className="text-2xl sm:text-3xl">{item.icon}</span>
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#2563eb] text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow">
                          {inCol ? '✓' : '+'}
                        </span>
                      </button>
                    </div>
                  );
                })()}

                {/* Shop All Pill Button (Bottom Center of Look Collage) */}
                <div className="absolute bottom-2 right-4 sm:right-8 z-30">
                  <button
                    onClick={() => handleShopAll(activeLook)}
                    className="px-5 py-2.5 rounded-full bg-[#FAF8F5] hover:bg-white text-[#0a192f] border-2 border-[#0a192f] font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#1e3a8a]" />
                    <span>Shop All</span>
                  </button>
                </div>
              </div>

              {/* ======================================================= */}
              {/* RIGHT SIDE: LOOK STORY DETAILS & BREAKDOWN (5 Cols)     */}
              {/* ======================================================= */}
              <div className="lg:col-span-5 space-y-6 bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-[#1e3a8a]/10 shadow-lg">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#1e3a8a] uppercase tracking-wider">
                      {activeLook.code} &bull; {activeLook.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#1e3a8a]/10 text-[#1e3a8a] text-[11px] font-bold">
                      {activeLook.styleImpact} Impact
                    </span>
                  </div>
                  <h3 className="text-2xl font-serif font-black text-[#0a192f]">
                    {activeLook.titleSerif} {activeLook.titleSans}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#0a192f]/80 leading-relaxed">
                    {activeLook.tagline}
                  </p>
                </div>

                {/* Color Harmony Palette */}
                <div className="space-y-2 pt-2 border-t border-[#0a192f]/10">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#0a192f]/60 font-semibold">
                    Royal Blue & Ivory Palette Sync
                  </span>
                  <div className="flex items-center gap-2">
                    {activeLook.palette.map((hex, pIdx) => (
                      <div
                        key={pIdx}
                        className="w-7 h-7 rounded-xl border border-[#0a192f]/20 shadow-sm"
                        style={{ backgroundColor: hex }}
                        title={hex}
                      />
                    ))}
                  </div>
                </div>

                {/* Included Pieces List with 1-click add */}
                <div className="space-y-2.5 pt-2 border-t border-[#0a192f]/10">
                  <div className="flex items-center justify-between text-xs text-[#0a192f]/70 font-semibold">
                    <span>Curated Pieces ({activeLook.items.length})</span>
                    <span>Click to collect</span>
                  </div>

                  <div className="space-y-2">
                    {activeLook.items.map((item) => {
                      const inCol = isItemInCollection(item.name);
                      const inWish = isInWishlist(item.name);

                      return (
                        <div
                          key={item.id}
                          className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                            inCol
                              ? 'bg-[#1e3a8a]/10 border-[#1e3a8a]/30'
                              : 'bg-[#FAF8F5] border-[#0a192f]/10 hover:border-[#1e3a8a]/40'
                          }`}
                        >
                          <div
                            onClick={() => setSelectedItemForInspect(item)}
                            className="flex items-center gap-3 flex-1 cursor-pointer"
                          >
                            <span className="text-xl">{item.icon}</span>
                            <div>
                              <div className="text-xs font-bold text-[#0a192f] line-clamp-1">
                                {item.name}
                              </div>
                              <div className="text-[10px] text-[#0a192f]/60">
                                {item.category} &bull; {item.price || '$99'}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleAddItem(item)}
                              disabled={inCol}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                                inCol
                                  ? 'bg-[#1e3a8a] text-white'
                                  : 'bg-[#0a192f] hover:bg-[#1e3a8a] text-white'
                              }`}
                            >
                              {inCol ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  <span>Added</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3 h-3" />
                                  <span>Collect</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => handleAddToWishlist(item)}
                              className={`p-1.5 rounded-lg border transition-all ${
                                inWish
                                  ? 'bg-[#1e3a8a]/20 border-[#1e3a8a] text-[#1e3a8a]'
                                  : 'border-[#0a192f]/20 text-[#0a192f]/60 hover:text-[#1e3a8a]'
                              }`}
                              title={inWish ? 'In Wishlist' : 'Add to Wishlist'}
                            >
                              <Heart className={`w-3.5 h-3.5 ${inWish ? 'fill-current' : ''}`} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Big Shop All Button */}
                <button
                  onClick={() => handleShopAll(activeLook)}
                  className="w-full py-3.5 rounded-xl bg-[#1e3a8a] hover:bg-[#16366f] text-[#FAF8F5] font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#1e3a8a]/25 transition-all hover:scale-[1.01]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Collect Entire Look &bull; {activeLook.code}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ========================================================= */}
        {/* ITEM INSPECTION MODAL                                     */}
        {/* ========================================================= */}
        <AnimatePresence>
          {selectedItemForInspect && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md bg-[#FAF8F5] text-[#0a192f] rounded-3xl p-6 border-2 border-[#1e3a8a]/20 shadow-2xl space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-[#1e3a8a]/10 flex items-center justify-center text-3xl border border-[#1e3a8a]/20">
                      {selectedItemForInspect.icon}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#1e3a8a] text-white font-bold">
                        {selectedItemForInspect.category}
                      </span>
                      <h4 className="text-lg font-bold text-[#0a192f] mt-0.5">
                        {selectedItemForInspect.name}
                      </h4>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedItemForInspect(null)}
                    className="w-8 h-8 rounded-full bg-[#0a192f]/10 flex items-center justify-center text-[#0a192f] font-bold hover:bg-[#0a192f]/20"
                  >
                    ✕
                  </button>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#0a192f]/10 space-y-2">
                  <div className="text-xs font-bold text-[#1e3a8a] flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" />
                    <span>Stylist Harmonization Note</span>
                  </div>
                  <p className="text-xs text-[#0a192f]/80 leading-relaxed">
                    {selectedItemForInspect.reason}
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      handleAddItem(selectedItemForInspect);
                      setSelectedItemForInspect(null);
                    }}
                    className="flex-1 py-3 rounded-xl bg-[#1e3a8a] hover:bg-[#16366f] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add to Digital Wardrobe</span>
                  </button>
                  <button
                    onClick={() => {
                      handleAddToWishlist(selectedItemForInspect);
                      setSelectedItemForInspect(null);
                    }}
                    className="p-3 rounded-xl border border-[#1e3a8a]/30 text-[#1e3a8a] hover:bg-[#1e3a8a]/10"
                    title="Save to Wishlist"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ========================================================= */}
        {/* SAVED WISHLIST OVERVIEW                                    */}
        {/* ========================================================= */}
        {wishlist.length > 0 && (
          <div className="rounded-2xl bg-[#0f254e]/50 border border-[#FAF8F5]/15 p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-[#FAF8F5] flex items-center gap-2">
                <Heart className="w-4 h-4 fill-current text-[#fffff0]" />
                <span>Your Saved Wishlist ({wishlist.length} items)</span>
              </h4>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {wishlist.map((wItem) => (
                <span
                  key={wItem.id}
                  className="px-3.5 py-1.5 rounded-xl bg-[#FAF8F5]/10 border border-[#FAF8F5]/20 text-[#FAF8F5] text-xs font-semibold flex items-center gap-1.5"
                >
                  <Tag className="w-3 h-3 text-[#FAF8F5]" />
                  {wItem.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
