'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart, ExternalLink } from 'lucide-react';
import SocialCards, { type CardItem } from '@/components/ui/card-fan-carousel';
import { useCollection } from '@/hooks/useCollection';

const CURATED_CARDS: CardItem[] = [
  { imgUrl: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=600&fit=crop', alt: 'Elegant blazer' },
  { imgUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=600&fit=crop', alt: 'Denim jacket' },
  { imgUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&h=600&fit=crop', alt: 'Casual wear' },
  { imgUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=600&fit=crop', alt: 'Flowing dress' },
  { imgUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=600&fit=crop', alt: 'Street style' },
  { imgUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop', alt: 'Fashion model' },
  { imgUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=600&fit=crop', alt: 'Runway look' },
  { imgUrl: 'https://images.unsplash.com/photo-1581044777550-4cfa60707998?w=400&h=600&fit=crop', alt: 'Accessories' },
  { imgUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=600&fit=crop', alt: 'Vintage style' },
  { imgUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=600&fit=crop', alt: 'Shopping fashion' },
];

export default function CollectionPage() {
  const collection = useCollection();

  return (
    <div className="min-h-screen bg-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-black text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Link>
            <div className="w-px h-5 bg-white/10" />
            <h1 className="text-lg font-bold text-white">AuraStyle Collection</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Heart className="w-4 h-4 text-pink-400" />
            <span>{collection.totalCount} items saved</span>
          </div>
        </div>
      </header>

      {/* Fan Carousel Hero */}
      <section className="py-8 md:py-16">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-indigo-100 to-indigo-400">
            Trending Styles
          </h2>
          <p className="text-slate-400 text-sm mt-2">Curated looks hand-picked for you</p>
        </div>
        <SocialCards cards={CURATED_CARDS} />
      </section>

      {/* Saved Collection Grid */}
      <section className="container mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Your Saved Items</h2>
            <p className="text-slate-400 text-sm mt-1">Items you&apos;ve saved from your style analyses</p>
          </div>
        </div>

        {collection.totalCount === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4">
              <Heart className="w-7 h-7 text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No saved items yet</h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto mb-6">
              Head to the Style Analyzer to upload an outfit and save pieces you love to your collection.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/25"
            >
              Go to Style Analyzer
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Object.entries(
              collection.items.reduce((acc, item) => {
                if (!acc[item.category]) acc[item.category] = [];
                acc[item.category].push(item);
                return acc;
              }, {} as Record<string, any[]>)
            ).map(([category, items]) =>
              items.map((item: any, index: number) => (
                <div
                  key={`${category}-${index}`}
                  className="group glass-card rounded-xl overflow-hidden hover:border-indigo-500/30 transition-all duration-300"
                >
                  <div className="aspect-[3/4] bg-slate-800 flex items-center justify-center">
                    <div className="text-4xl">{item.emoji || '👕'}</div>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-white truncate">{item.name || item}</p>
                    <p className="text-xs text-slate-400 capitalize">{category}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
}
