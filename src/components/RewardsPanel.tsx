'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Zap, Award, TrendingUp, X } from 'lucide-react';
import { useRewards, BADGES, Badge } from '@/hooks/useRewards';

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
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-gradient-to-r from-amber-600 to-orange-600 px-8 py-4 rounded-2xl shadow-[0_0_40px_rgba(245,158,11,0.5)] border border-amber-400/30 flex items-center gap-4"
          >
            <div className="text-4xl">{newBadge.icon}</div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-200">Badge Unlocked!</p>
              <p className="text-lg font-bold text-white">{newBadge.name}</p>
            </div>
            <button onClick={dismissBadge} className="ml-4 text-white/60 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-amber-100 to-amber-400">
          Rewards & Achievements
        </h2>
        <p className="text-indigo-200/70 text-lg">
          Earn points and unlock badges by exploring new styles
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Level Card */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-gradient-to-br from-amber-900/60 to-orange-900/60 p-8 rounded-3xl border border-amber-500/20 backdrop-blur-md text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-400/5 rounded-full blur-3xl -mr-10 -mt-10" />
          <Trophy className="w-10 h-10 text-amber-400 mx-auto mb-3" />
          <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-500">
            {level}
          </div>
          <p className="text-amber-200 font-medium mt-1">Style Level</p>
          <div className="mt-4 space-y-2">
            <div className="w-full bg-black/30 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${levelProgress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"
              />
            </div>
            <p className="text-xs text-amber-200/60">{pointsToNextLevel} pts to Level {level + 1}</p>
          </div>
        </motion.div>

        {/* Points Card */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-black/30 p-8 rounded-3xl border border-white/10 backdrop-blur-md text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/5 rounded-full blur-2xl -mr-10 -mt-10" />
          <Zap className="w-10 h-10 text-purple-400 mx-auto mb-3" />
          <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-purple-200">
            {points}
          </div>
          <p className="text-purple-200 font-medium mt-1">Total Points</p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-white/40">
            <div className="bg-white/5 rounded-lg px-2 py-1.5">📸 Upload: +15</div>
            <div className="bg-white/5 rounded-lg px-2 py-1.5">📦 Collect: +10</div>
            <div className="bg-white/5 rounded-lg px-2 py-1.5">🚀 Try New: +25</div>
            <div className="bg-white/5 rounded-lg px-2 py-1.5">🎨 Colors: +5</div>
          </div>
        </motion.div>

        {/* Badges Card */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-black/30 p-8 rounded-3xl border border-white/10 backdrop-blur-md text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/5 rounded-full blur-2xl -mr-10 -mt-10" />
          <Award className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
          <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-emerald-200">
            {unlockedCount}/{totalBadges}
          </div>
          <p className="text-emerald-200 font-medium mt-1">Badges Earned</p>
          <div className="mt-4 flex justify-center gap-1 flex-wrap">
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
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-400" /> All Achievements
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
                    ? 'bg-gradient-to-br from-amber-900/30 to-orange-900/30 border-amber-500/20'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`text-3xl ${progress.isUnlocked ? '' : 'grayscale opacity-40'}`}>
                    {badge.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-bold truncate ${progress.isUnlocked ? 'text-amber-200' : 'text-white/70'}`}>
                        {badge.name}
                      </h4>
                      {progress.isUnlocked && (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/20">
                          ✓
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/40 mt-0.5">{badge.description}</p>
                    <div className="mt-3">
                      <div className="flex justify-between text-[10px] text-white/30 mb-1">
                        <span>{progress.current}/{progress.required}</span>
                        <span>{progress.percentage}%</span>
                      </div>
                      <div className="w-full bg-black/30 rounded-full h-1.5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress.percentage}%` }}
                          transition={{ duration: 0.8, delay: idx * 0.05 }}
                          className={`h-full rounded-full ${
                            progress.isUnlocked
                              ? 'bg-gradient-to-r from-amber-400 to-orange-400'
                              : 'bg-gradient-to-r from-indigo-500 to-purple-500'
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
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" /> Recent Activity
          </h3>
          <div className="bg-black/20 rounded-2xl border border-white/10 divide-y divide-white/5 overflow-hidden">
            {history.slice(0, 10).map((entry, idx) => {
              const actionLabels: Record<string, string> = {
                upload_outfit: '📸 Uploaded outfit',
                add_to_collection: '📦 Added to collection',
                try_suggestion: '🚀 Tried a suggestion',
                use_color_picker: '🎨 Used color picker',
                complete_analysis: '✅ Completed analysis',
                add_to_wishlist: '💖 Added to wishlist',
                favorite_item: '⭐ Favorited item',
              };
              return (
                <div key={idx} className="px-5 py-3 flex items-center justify-between">
                  <span className="text-sm text-white/70">{actionLabels[entry.action] || entry.action}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-emerald-400">+{entry.points}</span>
                    <span className="text-xs text-white/30">
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
