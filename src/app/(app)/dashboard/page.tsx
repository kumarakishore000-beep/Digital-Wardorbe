'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Palette, Package, Trophy, LogOut, Bot } from 'lucide-react';
import Header from '@/components/Header';
import Uploader from '@/components/Uploader';
import ResultsDashboard from '@/components/ResultsDashboard';
import ColorPicker from '@/components/ColorPicker';
import MyCollection from '@/components/MyCollection';
import RewardsPanel from '@/components/RewardsPanel';
import OutfitAssistant from '@/components/OutfitAssistant';
import { useCollection } from '@/hooks/useCollection';
import { useRewards } from '@/hooks/useRewards';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

type Tab = 'analyzer' | 'assistant' | 'colors' | 'collection' | 'rewards';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'analyzer', label: 'Curated Lookbook & Style AI', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'assistant', label: 'AI Outfit Assistant', icon: <Bot className="w-4 h-4" /> },
  { id: 'colors', label: 'Harmonic Color Lab', icon: <Palette className="w-4 h-4" /> },
  { id: 'collection', label: 'My Wardrobe Collection', icon: <Package className="w-4 h-4" /> },
  { id: 'rewards', label: 'Atelier Rewards', icon: <Trophy className="w-4 h-4" /> },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('analyzer');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<Record<string, unknown> | null>(null);

  const collection = useCollection();
  const rewards = useRewards();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleAnalyze = async (file: File | null, formality: string, setting: string, weather: string, useCloset: boolean) => {
    if (!file) return;
    
    setIsAnalyzing(true);
    setResults(null);
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('formality', formality);
      formData.append('setting', setting);
      formData.append('weather', weather);
      formData.append('useCloset', useCloset.toString());

      const response = await fetch('/api/style', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze style');
      }

      const data = await response.json();
      setResults(data);
      rewards.earnPoints('upload_outfit');
      rewards.earnPoints('complete_analysis');
    } catch (error) {
      console.error(error);
      alert('Error analyzing image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a192f] text-[#FAF8F5] font-sans selection:bg-[#1e3a8a] selection:text-[#fffff0]">
      <Header
        collectionCount={collection.totalCount}
        rewardPoints={rewards.points}
        rewardLevel={rewards.level}
      />
      
      {/* Tab Navigation in Royal Blue & Ivory */}
      <nav className="sticky top-[73px] z-40 bg-[#0a192f]/95 backdrop-blur-xl border-b border-[#FAF8F5]/15">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1.5 py-3 overflow-x-auto scrollbar-hide">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 border ${
                    isActive
                      ? 'bg-[#FAF8F5] text-[#0a192f] border-[#FAF8F5] shadow-lg shadow-[#1e3a8a]/30 scale-105'
                      : 'bg-[#1e3a8a]/30 border-[#FAF8F5]/15 text-[#FAF8F5]/70 hover:bg-[#1e3a8a]/60 hover:text-[#FAF8F5]'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {/* Notification dots */}
                  {tab.id === 'collection' && collection.totalCount > 0 && activeTab !== 'collection' && (
                    <span className="ml-1 w-4 h-4 bg-[#1e3a8a] text-[9px] font-bold text-white rounded-full flex items-center justify-center border border-white">
                      {collection.totalCount}
                    </span>
                  )}
                  {tab.id === 'rewards' && rewards.points > 0 && activeTab !== 'rewards' && (
                    <span className="ml-1 w-4 h-4 bg-[#FAF8F5] text-[9px] font-bold text-[#0a192f] rounded-full flex items-center justify-center">
                      {rewards.level}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Spacer + Logout */}
            <div className="ml-auto shrink-0 flex items-center gap-3 pl-4">
              {user && (
                <span className="text-xs text-[#FAF8F5]/70 font-mono hidden md:block">
                  {user.name}
                </span>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-[#FAF8F5]/70 hover:text-white hover:bg-[#FAF8F5]/10 transition-all border border-[#FAF8F5]/10"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 flex flex-col items-center max-w-6xl">
        <AnimatePresence mode="wait">
          {/* ===== STYLE ANALYZER & LOOKBOOK TAB ===== */}
          {activeTab === 'analyzer' && (
            <motion.div
              key="analyzer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full space-y-12"
            >
              {!results && (
                <div className="text-center max-w-2xl mx-auto space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1e3a8a]/30 border border-[#FAF8F5]/20 text-xs text-[#FAF8F5] uppercase tracking-widest font-mono">
                    ✦ AuraStyle Curated Lookbook & AI ✦
                  </div>
                  <h2 className="text-3xl md:text-5xl font-serif font-black tracking-tight text-[#FAF8F5]">
                    Curate Your Aesthetic
                  </h2>
                  <p className="text-sm md:text-base text-[#FAF8F5]/75">
                    Explore high-fashion moodboards or upload any item to receive bespoke AI harmonic styling.
                  </p>
                </div>
              )}

              {!results && (
                <Uploader onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
              )}

              {results && (
                <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <div className="flex justify-between items-center max-w-5xl mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#FAF8F5]">
                      Harmonic Style Analysis
                    </h2>
                    <button 
                      onClick={() => setResults(null)}
                      className="text-xs font-semibold text-[#0a192f] bg-[#FAF8F5] hover:bg-white px-4 py-2 rounded-full transition-all shadow-md"
                    >
                      Style Another Item
                    </button>
                  </div>
                  <ResultsDashboard
                    data={results}
                    collection={collection}
                    onAddToCollection={() => rewards.earnPoints('add_to_collection')}
                    onTrySuggestion={() => rewards.earnPoints('try_suggestion')}
                  />
                </div>
              )}
            </motion.div>
          )}

          {/* ===== AI OUTFIT ASSISTANT TAB ===== */}
          {activeTab === 'assistant' && (
            <motion.div
              key="assistant"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <OutfitAssistant
                onSaveToCollection={() => rewards.earnPoints('add_to_collection')}
              />
            </motion.div>
          )}

          {/* ===== COLOR LAB TAB ===== */}
          {activeTab === 'colors' && (
            <motion.div
              key="colors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <ColorPicker
                onUseColorPicker={() => rewards.earnPoints('use_color_picker')}
              />
            </motion.div>
          )}

          {/* ===== MY COLLECTION TAB ===== */}
          {activeTab === 'collection' && (
            <motion.div
              key="collection"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <MyCollection
                collection={collection}
                onAddItem={() => rewards.earnPoints('add_to_collection')}
              />
            </motion.div>
          )}

          {/* ===== REWARDS TAB ===== */}
          {activeTab === 'rewards' && (
            <motion.div
              key="rewards"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <RewardsPanel rewards={rewards} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
