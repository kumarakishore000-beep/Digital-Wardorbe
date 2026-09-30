// agent-notes: { ctx: "curated looks & editorial moodboard with gender segregation and interactive dress opinion", deps: ["src/data/curatedLooksData.ts", "src/utils/dressOpinion.ts", "src/hooks/useCollection.ts", "src/hooks/useAuth.ts", "src/hooks/useRewards.ts"], state: active, last: "sato@2026-09-30" }

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ShoppingBag,
  Plus,
  Heart,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Info,
  MessageSquare,
  Send,
  Star,
  RefreshCw,
  ThumbsUp,
  User,
  Sliders,
  Award,
} from 'lucide-react';
import { useCollection, CollectionItem } from '@/hooks/useCollection';
import { useAuth } from '@/hooks/useAuth';
import { useRewards } from '@/hooks/useRewards';
import LoginModal from '@/components/LoginModal';
import {
  CuratedLookStory,
  LookStoryItem,
  getCuratedLooks,
} from '@/data/curatedLooksData';
import {
  evaluateDressOpinion,
  saveDressOpinion,
  getSavedDressOpinions,
  OPINION_PRESETS,
  DressOpinionResult,
  OpinionPresetId,
} from '@/utils/dressOpinion';

export type { LookStoryItem, CuratedLookStory };

interface SuggestionBoxProps {
  collection: ReturnType<typeof useCollection>;
  onTrySuggestion?: () => void;
  gender?: 'male' | 'female' | 'unisex';
}

export default function SuggestionBox({
  collection,
  onTrySuggestion,
  gender: propGender,
}: SuggestionBoxProps) {
  const { isAuthenticated, user } = useAuth();
  const rewards = useRewards();

  // Gender filtering: default to authenticated user's gender, then prop, then female
  const initialGenderFilter = useMemo<'male' | 'female' | 'all'>(() => {
    if (propGender === 'male') return 'male';
    if (propGender === 'female') return 'female';
    if (user?.gender === 'male') return 'male';
    if (user?.gender === 'female') return 'female';
    return 'all';
  }, [propGender, user?.gender]);

  const [activeGenderFilter, setActiveGenderFilter] = useState<'male' | 'female' | 'all'>(
    initialGenderFilter
  );

  // Sync if user logs in or profile changes
  useEffect(() => {
    if (user?.gender === 'male' || user?.gender === 'female') {
      setActiveGenderFilter(user.gender);
    }
  }, [user?.gender]);

  // Filter looks: man clothes for men, women clothes for women
  const availableLooks = useMemo(() => {
    const list = getCuratedLooks(activeGenderFilter);
    return list.length > 0 ? list : getCuratedLooks('all');
  }, [activeGenderFilter]);

  const [activeLookIndex, setActiveLookIndex] = useState(0);
  const [collectedLookIds, setCollectedLookIds] = useState<string[]>([]);
  const [selectedItemForInspect, setSelectedItemForInspect] = useState<LookStoryItem | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Reset index when filter changes
  useEffect(() => {
    setActiveLookIndex(0);
  }, [activeGenderFilter]);

  const activeLook = availableLooks[activeLookIndex] || availableLooks[0];

  // User Dress Opinion State
  const [selectedPreset, setSelectedPreset] = useState<OpinionPresetId>('love');
  const [userCustomOpinion, setUserCustomOpinion] = useState('');
  const [isSubmittingOpinion, setIsSubmittingOpinion] = useState(false);
  const [savedOpinions, setSavedOpinions] = useState<Record<string, DressOpinionResult>>({});
  const [opinionToast, setOpinionToast] = useState(false);

  // Load opinions on mount
  useEffect(() => {
    setSavedOpinions(getSavedDressOpinions());
  }, []);

  const currentLookOpinion = activeLook ? savedOpinions[activeLook.id] : undefined;

  const { items, addToWishlist, wishlist, addItem } = collection;

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
      category: item.category as CollectionItem['category'],
      color: item.color,
      tags: ['curated-look', activeLook.code.toLowerCase().replace(/\s+/g, '-'), activeLook.gender],
    });
    rewards.earnPoints('add_to_collection');
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
          category: item.category as CollectionItem['category'],
          color: item.color,
          tags: ['curated-look', story.code.toLowerCase().replace(/\s+/g, '-'), story.gender],
        });
      }
    }
    if (!collectedLookIds.includes(story.id)) {
      setCollectedLookIds((prev) => [...prev, story.id]);
    }
    rewards.earnPoints('try_suggestion');
    onTrySuggestion?.();
  };

  const handleAddToWishlist = (item: LookStoryItem) => {
    if (!isInWishlist(item.name)) {
      addToWishlist({
        name: item.name,
        category: item.category as CollectionItem['category'],
        reason: item.reason,
      });
      rewards.earnPoints('add_to_wishlist');
    }
  };

  // Submit opinion on the dress
  const handleSubmitOpinion = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!activeLook) return;

    setIsSubmittingOpinion(true);

    const opinionResult = evaluateDressOpinion({
      dressId: activeLook.id,
      dressTitle: `${activeLook.titleSerif} ${activeLook.titleSans}`,
      gender: activeLook.gender,
      rating: selectedPreset,
      feedback: userCustomOpinion,
    });

    saveDressOpinion(opinionResult);
    setSavedOpinions((prev) => ({
      ...prev,
      [activeLook.id]: opinionResult,
    }));

    rewards.earnPoints('try_suggestion');
    setIsSubmittingOpinion(false);
    setUserCustomOpinion('');
    setOpinionToast(true);
    setTimeout(() => setOpinionToast(false), 3500);
  };

  const nextLook = () => {
    setActiveLookIndex((prev) => (prev + 1) % availableLooks.length);
  };

  const prevLook = () => {
    setActiveLookIndex((prev) => (prev - 1 + availableLooks.length) % availableLooks.length);
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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-[#FAF8F5]/15">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1e3a8a]/30 border border-[#FAF8F5]/20 text-[#FAF8F5] text-xs font-semibold uppercase tracking-widest mb-2 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-[#fffff0]" />
              <span>AuraStyle Bespoke Lookbook</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-[#FAF8F5] tracking-tight font-serif">
              Curated Looks For You
            </h2>
            <p className="text-[#FAF8F5]/70 text-sm md:text-base max-w-xl mt-1">
              Men&apos;s clothes for gentlemen &amp; women&apos;s couture for ladies. Browse tailored editorial ensembles and share your opinion.
            </p>
          </div>

          {/* Gender Segregation Selector (Man clothes for men, women for women) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="inline-flex p-1 rounded-2xl bg-[#0f254e]/80 border border-[#FAF8F5]/20 shadow-inner">
              <button
                onClick={() => setActiveGenderFilter('male')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeGenderFilter === 'male'
                    ? 'bg-[#1e3a8a] text-white shadow-md'
                    : 'text-[#FAF8F5]/70 hover:text-white'
                }`}
              >
                <span>👔 Men&apos;s Collection</span>
              </button>

              <button
                onClick={() => setActiveGenderFilter('female')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeGenderFilter === 'female'
                    ? 'bg-[#881337] text-white shadow-md'
                    : 'text-[#FAF8F5]/70 hover:text-white'
                }`}
              >
                <span>👗 Women&apos;s Collection</span>
              </button>

              <button
                onClick={() => setActiveGenderFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeGenderFilter === 'all'
                    ? 'bg-[#FAF8F5] text-[#0a192f] shadow-md'
                    : 'text-[#FAF8F5]/60 hover:text-white'
                }`}
              >
                <span>All</span>
              </button>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1.5 bg-[#0a192f]/60 border border-[#FAF8F5]/20 rounded-full px-2 py-1">
              <button
                onClick={prevLook}
                className="p-1.5 rounded-full hover:bg-white/10 text-[#FAF8F5] transition-all"
                aria-label="Previous Look"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono text-[#FAF8F5]/80 px-2 font-semibold">
                {activeLookIndex + 1} / {availableLooks.length}
              </span>
              <button
                onClick={nextLook}
                className="p-1.5 rounded-full hover:bg-white/10 text-[#FAF8F5] transition-all"
                aria-label="Next Look"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tab category pills for active gender */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {availableLooks.map((look, idx) => {
            const isActive = activeLookIndex === idx;
            const isCollected = collectedLookIds.includes(look.id);
            const hasOpinion = Boolean(savedOpinions[look.id]);
            return (
              <button
                key={look.id}
                onClick={() => setActiveLookIndex(idx)}
                className={`shrink-0 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-2 border ${
                  isActive
                    ? 'bg-[#FAF8F5] text-[#0a192f] border-[#FAF8F5] shadow-lg shadow-[#1e3a8a]/30 scale-105'
                    : 'bg-[#0f254e]/60 border-[#FAF8F5]/10 text-[#FAF8F5]/70 hover:bg-[#16366f] hover:text-[#FAF8F5]'
                }`}
              >
                <span>{look.gender === 'male' ? '👔' : '👗'}</span>
                <span>{look.titleSerif}</span>
                <span className="opacity-60 text-[10px] uppercase font-mono">{look.titleSans}</span>
                {isCollected && <CheckCircle2 className="w-3.5 h-3.5 text-[#2563eb]" />}
                {hasOpinion && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
              </button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* MOODBOARD EDITORIAL CARD                                  */}
        {/* ========================================================= */}
        {activeLook && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeLook.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35 }}
              className="relative rounded-3xl bg-[#FAF8F5] text-[#0a192f] p-6 md:p-10 shadow-2xl border border-[#FAF8F5]/30 overflow-hidden"
            >
              {/* Background tinted geometric color blocks */}
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

              {/* Content Container */}
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* ======================================================= */}
                {/* LEFT & CENTER: THE MOODBOARD COLLAGE (7 Cols)          */}
                {/* ======================================================= */}
                <div className="lg:col-span-7 relative min-h-[480px] sm:min-h-[540px] md:min-h-[580px] flex items-center justify-center">
                  {/* Look Title */}
                  <div className="absolute top-2 left-2 sm:left-4 z-20">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0a192f] text-white text-[10px] font-mono uppercase tracking-wider mb-1">
                      <span>{activeLook.gender === 'male' ? 'Men’s Wear' : 'Women’s Wear'}</span>
                    </div>
                    <div className="font-serif text-3xl sm:text-4xl text-[#0a192f] font-normal leading-tight">
                      {activeLook.titleSerif}
                    </div>
                    <div className="text-[11px] sm:text-xs font-sans tracking-[0.25em] text-[#1e3a8a] font-black uppercase">
                      {activeLook.titleSans}
                    </div>
                  </div>

                  {/* Floating Item 1 (Top-Left) */}
                  {activeLook.items.find((i) => i.position === 'top-left') && (() => {
                    const item = activeLook.items.find((i) => i.position === 'top-left')!;
                    const inCol = isItemInCollection(item.name);
                    return (
                      <div className="absolute top-16 sm:top-20 left-0 sm:left-4 z-20 flex flex-col items-start gap-1">
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

                  {/* Floating Item 2 (Top-Right) */}
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

                  {/* Central Model Figure */}
                  <div className="relative z-10 w-52 sm:w-64 md:w-72 h-[380px] sm:h-[440px] md:h-[480px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white mx-auto flex items-center justify-center bg-[#0a192f]/5">
                    <img
                      src={activeLook.modelImage}
                      alt={activeLook.titleSerif + ' ' + activeLook.titleSans}
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f]/40 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Floating Item 3 (Bottom-Left) */}
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

                  {/* Floating Item 4 (Bottom-Right) */}
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

                  {/* Shop All Pill Button */}
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
                {/* RIGHT SIDE: DETAILS & USER DRESS OPINION MODULE (5 Cols)*/}
                {/* ======================================================= */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Story Summary Card */}
                  <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-[#1e3a8a]/10 shadow-lg space-y-4">
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

                    {/* Palette */}
                    <div className="space-y-2 pt-2 border-t border-[#0a192f]/10">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#0a192f]/60 font-semibold">
                        Signature Palette Sync
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

                    {/* Included Pieces List */}
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
                  </div>

                  {/* ========================================================= */}
                  {/* INTERACTIVE DRESS OPINION & USER SUGGESTION MODULE        */}
                  {/* ========================================================= */}
                  <div className="bg-[#0a192f] text-[#FAF8F5] rounded-2xl p-6 border border-[#FAF8F5]/20 shadow-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-[#FAF8F5]/10 pb-3">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-[#93c5fd]" />
                        <h4 className="font-serif font-bold text-base text-[#FAF8F5]">
                          Your Opinion on this Dress
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono uppercase bg-[#1e3a8a] px-2 py-0.5 rounded text-white font-bold">
                        Ask Stylist AI
                      </span>
                    </div>

                    <p className="text-xs text-[#FAF8F5]/70">
                      What do you think of this {activeLook.gender === 'male' ? "men's look" : "women's dress"}? Select a sentiment or type your styling suggestions below:
                    </p>

                    {/* Quick Sentiment Options */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {OPINION_PRESETS.map((preset) => {
                        const isSelected = selectedPreset === preset.id;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => setSelectedPreset(preset.id)}
                            className={`p-2 rounded-xl text-left transition-all border flex flex-col justify-between ${
                              isSelected
                                ? 'bg-[#1e3a8a] border-[#FAF8F5] text-white shadow-md scale-[1.02]'
                                : 'bg-[#050d1a] border-[#FAF8F5]/15 text-[#FAF8F5]/75 hover:bg-[#0f254e] hover:text-white'
                            }`}
                          >
                            <span className="text-base">{preset.icon}</span>
                            <span className="text-[11px] font-bold mt-1 line-clamp-1">{preset.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom Opinion Textarea */}
                    <form onSubmit={handleSubmitOpinion} className="space-y-3 pt-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-[#FAF8F5]/60 uppercase tracking-wider flex items-center gap-1">
                          <Sliders className="w-3 h-3 text-[#93c5fd]" />
                          <span>Custom Styling Opinion or Suggestion</span>
                        </label>
                        <textarea
                          rows={2}
                          value={userCustomOpinion}
                          onChange={(e) => setUserCustomOpinion(e.target.value)}
                          placeholder="e.g., I love the color but prefer white court sneakers, or would wear this to an evening gala..."
                          className="w-full p-3 rounded-xl bg-[#050d1a] border border-[#FAF8F5]/15 text-white text-xs placeholder:text-[#FAF8F5]/30 focus:outline-none focus:border-[#FAF8F5]/40 resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingOpinion}
                        className="w-full py-2.5 rounded-xl bg-[#FAF8F5] hover:bg-white text-[#0a192f] font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
                      >
                        {isSubmittingOpinion ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#1e3a8a]" />
                            <span>Stylist Analyzing Feedback...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5 text-[#1e3a8a]" />
                            <span>Submit My Dress Opinion (+25 Pts)</span>
                          </>
                        )}
                      </button>
                    </form>

                    {/* Display Submitted Opinion & Stylist Intelligence */}
                    {currentLookOpinion && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-[#050d1a] border border-[#FAF8F5]/20 space-y-2 mt-3"
                      >
                        <div className="flex items-center justify-between border-b border-[#FAF8F5]/10 pb-2">
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs font-bold text-white">Your Opinion Saved</span>
                          </div>
                          <span className="text-[10px] font-mono text-amber-300 font-bold">
                            Score: {currentLookOpinion.adjustedScore}/100
                          </span>
                        </div>

                        <p className="text-xs text-[#FAF8F5]/80 italic">
                          &ldquo;{currentLookOpinion.feedback}&rdquo;
                        </p>

                        <div className="p-3 rounded-lg bg-[#0a192f] border border-[#FAF8F5]/10 text-xs space-y-1">
                          <p className="font-bold text-[#93c5fd]">Stylist Verdict &amp; Advice:</p>
                          <p className="text-[#FAF8F5]/70 text-[11px] leading-relaxed">
                            {currentLookOpinion.actionableAdvice}
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {opinionToast && (
                      <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Opinion submitted! Stylist recommendations updated.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

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

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {wishlist.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-[#0a192f]/80 border border-[#FAF8F5]/10 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-white line-clamp-1">{item.name}</div>
                    <div className="text-[10px] text-[#FAF8F5]/50">{item.category}</div>
                  </div>
                  <button
                    onClick={() => {
                      addItem({
                        name: item.name,
                        category: (item.category as CollectionItem['category']) || 'Other',
                        color: '#1e3a8a',
                        tags: ['from-wishlist'],
                      });
                      rewards.earnPoints('add_to_collection');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] text-[#0a192f] text-[11px] font-bold hover:bg-white transition-all shrink-0"
                  >
                    Move to Wardrobe
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
