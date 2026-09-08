'use client';

import React from 'react';
import Link from 'next/link';
import { Sun, Moon, Package, Trophy } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import AuraStyleLogo from '@/components/AuraStyleLogo';

interface HeaderProps {
  collectionCount?: number;
  rewardPoints?: number;
  rewardLevel?: number;
  onConnectClick?: () => void;
  onMixMatchClick?: () => void;
}

export default function Header({ collectionCount = 0, rewardPoints = 0, rewardLevel = 1, onConnectClick, onMixMatchClick }: HeaderProps) {
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
    <header className="w-full flex items-center justify-between px-6 py-4 bg-[#0a192f]/90 backdrop-blur-xl border-b border-[#FAF8F5]/15 sticky top-0 z-50 shadow-md">
      <Link href="/dashboard" className="flex items-center gap-3 group">
        <AuraStyleLogo variant="mark" size="md" />
        <div>
          <h1 className="text-xl md:text-2xl font-serif font-black tracking-tight text-[#FAF8F5] group-hover:text-[#93c5fd] transition-colors">
            AuraStyle <span className="font-sans text-xs tracking-widest uppercase text-[#38BDF8] font-bold">AI</span>
          </h1>
          <p className="text-[11px] text-[#93c5fd] font-serif italic font-light">Dressed for your moments</p>
        </div>
      </Link>
      
      <div className="flex items-center gap-3">
        {/* Gender / Category Quick Toggle */}
        <button
          onClick={() => updateGender(currentGender === 'female' ? 'male' : 'female')}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#FAF8F5]/20 bg-[#1e3a8a]/40 text-[#FAF8F5] hover:bg-[#1e3a8a] text-xs font-semibold shadow-sm transition-all duration-300"
          title="Click to switch mannequin & clothing category (Female / Male)"
        >
          <span className="text-sm">{currentGender === 'female' ? '👗' : '👔'}</span>
          <span>Category: <strong className="capitalize text-[#FAF8F5]">{currentGender}</strong></span>
        </button>

        {/* Fashion Diffusion Mix & Match Button */}
        {onMixMatchClick && (
          <button
            onClick={onMixMatchClick}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#38BDF8]/50 bg-gradient-to-r from-[#1e3a8a]/70 to-[#0284c7]/50 hover:bg-[#38BDF8] hover:text-[#0a192f] text-xs font-bold text-[#FAF8F5] transition-all duration-300 shadow-sm"
            title="Fashion Diffusion AI Mix & Match Studio"
          >
            <span className="text-sm">🪞</span>
            <span>Mix &amp; Match</span>
          </button>
        )}

        {/* Collection Badge */}
        {collectionCount > 0 && (
          <div className="hidden sm:flex items-center gap-2 bg-[#1e3a8a]/30 px-3 py-1.5 rounded-full border border-[#FAF8F5]/20">
            <Package className="w-4 h-4 text-[#FAF8F5]" />
            <span className="text-xs font-mono font-bold text-[#FAF8F5]">{collectionCount} Items</span>
          </div>
        )}

        {/* Rewards Badge */}
        {rewardPoints > 0 && (
          <div className="hidden sm:flex items-center gap-2 bg-[#1e3a8a]/50 px-3 py-1.5 rounded-full border border-[#FAF8F5]/20">
            <Trophy className="w-4 h-4 text-[#fffff0]" />
            <span className="text-xs font-bold text-[#FAF8F5]">Lv.{rewardLevel}</span>
            <span className="text-xs font-mono text-[#FAF8F5]/70">{rewardPoints}pts</span>
          </div>
        )}

        {/* Weather */}
        <div className="hidden md:flex items-center gap-2 bg-[#050d1a]/60 px-4 py-1.5 rounded-full border border-[#FAF8F5]/10 shadow-inner">
          <WeatherIcon className="w-4 h-4 text-[#fffff0]" />
          <span className="text-xs font-medium text-[#FAF8F5]/90">{weatherText}</span>
        </div>

        {/* Connect with Fashion Button */}
        {onConnectClick ? (
          <button
            onClick={onConnectClick}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#38BDF8]/40 bg-[#1e3a8a]/40 hover:bg-[#38BDF8] hover:text-[#0a192f] text-xs font-bold text-[#FAF8F5] transition-all duration-300 shadow-sm"
            title="Connect with Fashion AI & 3D Model inside page"
          >
            <span className="text-sm">✨</span>
            <span>Connect with Fashion</span>
          </button>
        ) : (
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#38BDF8]/40 bg-[#1e3a8a]/40 hover:bg-[#38BDF8] hover:text-[#0a192f] text-xs font-bold text-[#FAF8F5] transition-all duration-300 shadow-sm"
            title="Connect with Fashion AI & 3D Model inside page"
          >
            <span className="text-sm">✨</span>
            <span>Connect with Fashion</span>
          </Link>
        )}
      </div>
    </header>
  );
}
