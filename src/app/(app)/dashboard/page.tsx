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

const TABS: { id: Tab; label: string; icon: React.ReactNode; gradient: string }[] = [
  { id: 'analyzer', label: 'Style Analyzer', icon: <Sparkles className="w-4 h-4" />, gradient: 'from-indigo-500 to-purple-600' },
  { id: 'assistant', label: 'AI Outfit Assistant', icon: <Bot className="w-4 h-4" />, gradient: 'from-purple-500 to-pink-600' },
  { id: 'colors', label: 'Color Lab', icon: <Palette className="w-4 h-4" />, gradient: 'from-pink-500 to-rose-600' },
  { id: 'collection', label: 'My Collection', icon: <Package className="w-4 h-4" />, gradient: 'from-emerald-500 to-teal-600' },
  { id: 'rewards', label: 'Rewards', icon: <Trophy className="w-4 h-4" />, gradient: 'from-amber-500 to-orange-600' },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('analyzer');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

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
    <div className="min-h-screen bg-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black text-slate-100 font-sans selection:bg-indigo-500/30">
      <Header
        collectionCount={collection.totalCount}
        rewardPoints={rewards.points}
        rewardLevel={rewards.level}
      />
      
      {/* Tab Navigation */}
      <nav className="sticky top-[88px] z-40 bg-slate-900/80 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 py-3 overflow-x-auto scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'analyzer') setResults(null);
                }}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg`
                    : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                {tab.icon}
                {tab.label}
                {/* Notification dots */}
                {tab.id === 'collection' && collection.totalCount > 0 && activeTab !== 'collection' && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center">
                    {collection.totalCount}
                  </span>
                )}
                {tab.id === 'rewards' && rewards.points > 0 && activeTab !== 'rewards' && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center">
                    {rewards.level}
                  </span>
                )}
              </button>
            ))}
            {/* Spacer + Logout */}
            <div className="ml-auto shrink-0 flex items-center gap-3">
              {user && (
                <span className="text-xs text-slate-400 hidden md:block">
                  {user.name}
                </span>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12 flex flex-col items-center">
        <AnimatePresence mode="wait">
          {/* ===== STYLE ANALYZER TAB ===== */}
          {activeTab === 'analyzer' && (
            <motion.div
              key="analyzer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {!results && (
                <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
                  <h2 className="text-4xl md:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-indigo-100 to-indigo-400">
                    Discover Your Perfect Match
                  </h2>
                  <p className="text-lg text-indigo-200/80">
                    Upload an item from your wardrobe, and our AI stylist will build the perfect outfit around it — including matching watches, chains, bracelets, and footwear adapted to your weather and setting.
                  </p>
                </div>
              )}

              {!results && (
                <Uploader onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
              )}

              {results && (
                <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <div className="flex justify-between items-center max-w-5xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-white">Your Style Analysis</h2>
                    <button 
                      onClick={() => setResults(null)}
                      className="text-sm font-medium text-indigo-300 hover:text-white transition-colors border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 rounded-lg"
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
