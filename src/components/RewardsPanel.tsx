'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Zap, Award, TrendingUp, X } from 'lucide-react';
import { useRewards, BADGES } from '@/hooks/useRewards';

interface RewardsPanelProps {
  rewards: ReturnType<typeof useRewards>;
}

export default function RewardsPanel({ rewards }: RewardsPanelProps) {
  const {
    points,
    level,
    levelProgress,
    pointsToNextLevel,
    unlockedBadges,
    history,
    getBadgeProgress,
    newBadge,
    dismissBadge,
  } = rewards;

  const unlockedCount = unlockedBadges.length;
  const totalBadges = BADGES.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-5xl mx-auto space-y-8"
    >
      {/* Badge Unlock Notification */}
      <AnimatePresence>
        {newBadge && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.8 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-[#FAF8F5] text-[#0a192f] px-8 py-4 rounded-2xl shadow-2xl border-2 border-[#1e3a8a] flex items-center gap-4"
          >
            <div className="text-4xl">{newBadge.icon}</div>
            <div>
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#1e3a8a]">Atelier Badge Unlocked!</p>
              <p className="text-lg font-serif font-bold text-[#0a192f]">{newBadge.name}</p>
            </div>
            <button onClick={dismissBadge} className="ml-4 text-[#0a192f]/60 hover:text-[#0a192f]">
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-5xl font-serif font-black tracking-tight text-[#FAF8F5]">
          Atelier Privileges & Milestones
        </h2>
        <p className="text-sm md:text-base text-[#FAF8F5]/70">
          Earn recognition points and bespoke achievements as you curate and refine your personal style.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Level Card */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-[#1e3a8a]/60 p-8 rounded-3xl border-2 border-[#FAF8F5]/20 backdrop-blur-md text-center relative overflow-hidden shadow-xl"
        >
          <Trophy className="w-10 h-10 text-[#fffff0] mx-auto mb-3" />
          <div className="text-5xl font-serif font-black text-[#FAF8F5]">
            Lv.{level}
          </div>
          <p className="text-[#FAF8F5] font-serif text-sm mt-1">Connoisseur Tier</p>
          <div className="mt-4 space-y-2">
            <div className="w-full bg-[#0a192f]/60 rounded-full h-2.5 overflow-hidden border border-[#FAF8F5]/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${levelProgress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-[#FAF8F5] rounded-full"
              />
            </div>
            <p className="text-xs font-mono text-[#FAF8F5]/70">{pointsToNextLevel} pts to Tier {level + 1}</p>
          </div>
        </motion.div>

        {/* Points Card */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-[#0f254e]/50 p-8 rounded-3xl border border-[#FAF8F5]/15 backdrop-blur-md text-center relative overflow-hidden shadow-xl"
        >
          <Zap className="w-10 h-10 text-[#FAF8F5] mx-auto mb-3" />
          <div className="text-5xl font-serif font-black text-[#FAF8F5]">
            {points}
          </div>
          <p className="text-[#FAF8F5] font-serif text-sm mt-1">Atelier Points</p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-mono text-[#FAF8F5]/70">
            <div className="bg-[#0a192f] rounded-xl px-2 py-1.5 border border-[#FAF8F5]/10">📸 Upload: +15</div>
            <div className="bg-[#0a192f] rounded-xl px-2 py-1.5 border border-[#FAF8F5]/10">📦 Collect: +10</div>
            <div className="bg-[#0a192f] rounded-xl px-2 py-1.5 border border-[#FAF8F5]/10">🚀 Try New: +25</div>
            <div className="bg-[#0a192f] rounded-xl px-2 py-1.5 border border-[#FAF8F5]/10">🎨 Colors: +5</div>
          </div>
        </motion.div>

        {/* Badges Card */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-[#0f254e]/50 p-8 rounded-3xl border border-[#FAF8F5]/15 backdrop-blur-md text-center relative overflow-hidden shadow-xl"
        >
          <Award className="w-10 h-10 text-[#FAF8F5] mx-auto mb-3" />
          <div className="text-5xl font-serif font-black text-[#FAF8F5]">
            {unlockedCount}/{totalBadges}
          </div>
          <p className="text-[#FAF8F5] font-serif text-sm mt-1">Badges Earned</p>
          <div className="mt-4 flex justify-center gap-1.5 flex-wrap">
            {BADGES.map(badge => (
              <span
                key={badge.id}
                className={`text-lg transition-all ${
                  unlockedBadges.includes(badge.id) ? '' : 'grayscale opacity-30'
                }`}
                title={badge.name}
              >
                {badge.icon}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* All Badges Grid */}
      <div className="space-y-4">
        <h3 className="text-xl font-serif font-bold text-[#FAF8F5] flex items-center gap-2">
          <Star className="w-5 h-5 text-[#fffff0]" /> All Atelier Achievements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {BADGES.map((badge, idx) => {
            const progress = getBadgeProgress(badge);
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-5 rounded-2xl border backdrop-blur-sm transition-all duration-300 ${
                  progress.isUnlocked
                    ? 'bg-[#FAF8F5] text-[#0a192f] border-[#FAF8F5] shadow-lg'
                    : 'bg-[#0f254e]/40 border-[#FAF8F5]/15 text-[#FAF8F5]'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`text-3xl ${progress.isUnlocked ? '' : 'grayscale opacity-40'}`}>
                    {badge.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-bold truncate ${progress.isUnlocked ? 'text-[#0a192f]' : 'text-[#FAF8F5]'}`}>
                        {badge.name}
                      </h4>
                      {progress.isUnlocked && (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-[#1e3a8a] text-white rounded-full">
                          ✓
                        </span>
                      )}
                    </div>
                    <p className={`text-xs mt-0.5 ${progress.isUnlocked ? 'text-[#0a192f]/70' : 'text-[#FAF8F5]/60'}`}>
                      {badge.description}
                    </p>
                    <div className="mt-3">
                      <div className="flex justify-between text-[10px] font-mono opacity-60 mb-1">
                        <span>{progress.current}/{progress.required}</span>
                        <span>{progress.percentage}%</span>
                      </div>
                      <div className="w-full bg-[#0a192f]/20 rounded-full h-1.5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress.percentage}%` }}
                          transition={{ duration: 0.8, delay: idx * 0.05 }}
                          className={`h-full rounded-full ${
                            progress.isUnlocked
                              ? 'bg-[#1e3a8a]'
                              : 'bg-[#FAF8F5]'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      {history.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-serif font-bold text-[#FAF8F5] flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#93c5fd]" /> Recent Fashion Milestones
          </h3>
          <div className="bg-[#0f254e]/50 rounded-2xl border border-[#FAF8F5]/15 divide-y divide-[#FAF8F5]/10 overflow-hidden">
            {history.slice(0, 10).map((entry, idx) => {
              const actionLabels: Record<string, string> = {
                upload_outfit: '📸 Uploaded outfit for styling',
                add_to_collection: '📦 Collected piece into wardrobe',
                try_suggestion: '🚀 Explored curated lookbook ensemble',
                use_color_picker: '🎨 Harmonized chromatic palette in Color Lab',
                complete_analysis: '✅ Completed AI aesthetic breakdown',
                add_to_wishlist: '💖 Added item to wishlist',
                favorite_item: '⭐ Favorited wardrobe piece',
              };
              return (
                <div key={idx} className="px-5 py-3.5 flex items-center justify-between text-xs">
                  <span className="text-[#FAF8F5]/80">{actionLabels[entry.action] || entry.action}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-[#93c5fd]">+{entry.points} pts</span>
                    <span className="font-mono text-[#FAF8F5]/40">
                      {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}
