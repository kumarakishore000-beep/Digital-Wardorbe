'use client';

import { useState, useEffect, useCallback } from 'react';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  trackingKey: string;
  unlockedAt?: number;
}

export interface RewardState {
  points: number;
  level: number;
  counters: Record<string, number>;
  unlockedBadges: string[];
  history: { action: string; points: number; timestamp: number }[];
}

const REWARDS_KEY = 'stylematch-rewards';

const POINTS_PER_LEVEL = 100;

const POINT_VALUES: Record<string, number> = {
  upload_outfit: 15,
  add_to_collection: 10,
  try_suggestion: 25,
  use_color_picker: 5,
  complete_analysis: 20,
  add_to_wishlist: 5,
  favorite_item: 3,
};

export const BADGES: Badge[] = [
  {
    id: 'first_upload',
    name: 'First Impression',
    description: 'Upload your first outfit',
    icon: '📸',
    requirement: 1,
    trackingKey: 'upload_outfit',
  },
  {
    id: 'style_explorer',
    name: 'Style Explorer',
    description: 'Analyze 5 outfits',
    icon: '🔍',
    requirement: 5,
    trackingKey: 'complete_analysis',
  },
  {
    id: 'color_theorist',
    name: 'Color Theorist',
    description: 'Use the color picker 10 times',
    icon: '🎨',
    requirement: 10,
    trackingKey: 'use_color_picker',
  },
  {
    id: 'collector_starter',
    name: 'Collector',
    description: 'Add 5 items to your collection',
    icon: '👜',
    requirement: 5,
    trackingKey: 'add_to_collection',
  },
  {
    id: 'accessory_maven',
    name: 'Accessory Maven',
    description: 'Own 10+ accessories in your collection',
    icon: '💎',
    requirement: 10,
    trackingKey: 'add_to_collection',
  },
  {
    id: 'style_pioneer',
    name: 'Style Pioneer',
    description: 'Try 3 new suggestions',
    icon: '🚀',
    requirement: 3,
    trackingKey: 'try_suggestion',
  },
  {
    id: 'trendsetter',
    name: 'Trendsetter',
    description: 'Try 10 new suggestions',
    icon: '⭐',
    requirement: 10,
    trackingKey: 'try_suggestion',
  },
  {
    id: 'wardrobe_master',
    name: 'Wardrobe Master',
    description: 'Add 25 items to your collection',
    icon: '👑',
    requirement: 25,
    trackingKey: 'add_to_collection',
  },
  {
    id: 'wishlist_dreamer',
    name: 'Wishlist Dreamer',
    description: 'Add 5 items to your wishlist',
    icon: '✨',
    requirement: 5,
    trackingKey: 'add_to_wishlist',
  },
];

const DEFAULT_STATE: RewardState = {
  points: 0,
  level: 1,
  counters: {},
  unlockedBadges: [],
  history: [],
};

function loadRewards(): RewardState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(REWARDS_KEY);
    return raw ? { ...DEFAULT_STATE, ...JSON.parse(raw) } : DEFAULT_STATE;
  } catch {
    return DEFAULT_STATE;
  }
}

function saveRewards(state: RewardState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(REWARDS_KEY, JSON.stringify(state));
  } catch {
    console.warn('Failed to save rewards');
  }
}

export function useRewards() {
  const [state, setState] = useState<RewardState>(() => loadRewards());
  const [isLoaded] = useState(true);
  const [newBadge, setNewBadge] = useState<Badge | null>(null);

  useEffect(() => {
    if (isLoaded) saveRewards(state);
  }, [state, isLoaded]);

  const earnPoints = useCallback((action: string) => {
    const pts = POINT_VALUES[action] || 0;
    if (pts === 0) return;

    setState(prev => {
      const newCounters = { ...prev.counters };
      newCounters[action] = (newCounters[action] || 0) + 1;

      const newPoints = prev.points + pts;
      const newLevel = Math.floor(newPoints / POINTS_PER_LEVEL) + 1;

      // Check for newly unlocked badges
      const newUnlocked = [...prev.unlockedBadges];
      for (const badge of BADGES) {
        if (
          !newUnlocked.includes(badge.id) &&
          (newCounters[badge.trackingKey] || 0) >= badge.requirement
        ) {
          newUnlocked.push(badge.id);
          // Show notification for the latest badge
          const foundBadge = BADGES.find(b => b.id === badge.id);
          if (foundBadge) {
            setTimeout(() => setNewBadge(foundBadge), 300);
            setTimeout(() => setNewBadge(null), 4000);
          }
        }
      }

      return {
        points: newPoints,
        level: newLevel,
        counters: newCounters,
        unlockedBadges: newUnlocked,
        history: [
          { action, points: pts, timestamp: Date.now() },
          ...prev.history.slice(0, 49), // keep last 50
        ],
      };
    });
  }, []);

  const getBadgeProgress = useCallback(
    (badge: Badge) => {
      const current = state.counters[badge.trackingKey] || 0;
      return {
        current,
        required: badge.requirement,
        percentage: Math.min(100, Math.round((current / badge.requirement) * 100)),
        isUnlocked: state.unlockedBadges.includes(badge.id),
      };
    },
    [state]
  );

  const pointsToNextLevel = POINTS_PER_LEVEL - (state.points % POINTS_PER_LEVEL);
  const levelProgress = Math.round(((state.points % POINTS_PER_LEVEL) / POINTS_PER_LEVEL) * 100);

  return {
    ...state,
    isLoaded,
    newBadge,
    earnPoints,
    getBadgeProgress,
    pointsToNextLevel,
    levelProgress,
    dismissBadge: () => setNewBadge(null),
  };
}
