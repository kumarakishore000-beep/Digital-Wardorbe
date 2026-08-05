'use client';

import React from 'react';
import Header from '@/components/Header';
import OutfitAssistant from '@/components/OutfitAssistant';
import { useCollection } from '@/hooks/useCollection';
import { useRewards } from '@/hooks/useRewards';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function OutfitAssistantPage() {
  const collection = useCollection();
  const rewards = useRewards();

  return (
    <div className="min-h-screen bg-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950 via-slate-900 to-black text-slate-100 font-sans selection:bg-indigo-500/30">
      <Header
        collectionCount={collection.totalCount}
        rewardPoints={rewards.points}
        rewardLevel={rewards.level}
      />

      <div className="container mx-auto px-4 py-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      <main className="container mx-auto px-4 pb-16">
        <OutfitAssistant />
      </main>
    </div>
  );
}
