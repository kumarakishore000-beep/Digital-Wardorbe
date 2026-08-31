'use client';

import React from 'react';
import { Sun, Moon, Package, Trophy } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  collectionCount?: number;
  rewardPoints?: number;
  rewardLevel?: number;
}

export default function Header({ collectionCount = 0, rewardPoints = 0, rewardLevel = 1 }: HeaderProps) {
  const { user, updateGender } = useAuth();
  const currentGender = user?.gender || 'female';

  // Mock weather widget logic based on current hour
  const hour = new Date().getHours();
  let WeatherIcon = Sun;
  let weatherText = "72°F Outdoor Event Ready";

  if (hour < 7 || hour > 19) {
    WeatherIcon = Moon;
    weatherText = "64°F Evening Ready";
  }

  return (
    <header className="w-full flex items-center justify-between p-6 bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-xl leading-none">A</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">AuraStyle AI</h1>
          <p className="text-sm text-indigo-200/80">Your Personal Stylist</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Gender / Category Quick Toggle */}
        <button
          onClick={() => updateGender(currentGender === 'female' ? 'male' : 'female')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold shadow-md transition-all duration-300 ${
            currentGender === 'female'
              ? 'bg-pink-500/20 border-pink-400/40 text-pink-200 hover:bg-pink-500/30'
              : 'bg-indigo-500/20 border-indigo-400/40 text-indigo-200 hover:bg-indigo-500/30'
          }`}
          title="Click to switch mannequin & clothing category (Female / Male)"
        >
          <span className="text-sm">{currentGender === 'female' ? '👗' : '👔'}</span>
          <span>Category: <strong className="capitalize">{currentGender}</strong></span>
        </button>

        {/* Collection Badge */}
        {collectionCount > 0 && (
          <div className="hidden sm:flex items-center gap-2 bg-emerald-500/10 px-3 py-2 rounded-full border border-emerald-500/20">
            <Package className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-300">{collectionCount}</span>
          </div>
        )}

        {/* Rewards Badge */}
        {rewardPoints > 0 && (
          <div className="hidden sm:flex items-center gap-2 bg-amber-500/10 px-3 py-2 rounded-full border border-amber-500/20">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-amber-300">Lv.{rewardLevel}</span>
            <span className="text-xs text-amber-400/60">{rewardPoints}pts</span>
          </div>
        )}

        {/* Weather */}
        <div className="hidden sm:flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full border border-white/10 shadow-inner">
          <WeatherIcon className="w-5 h-5 text-yellow-300" />
          <span className="text-sm font-medium text-white/90">{weatherText}</span>
        </div>
      </div>
    </header>
  );
}
