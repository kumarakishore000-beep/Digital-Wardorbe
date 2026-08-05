'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Sparkles, ArrowRight, Palette, Zap, ShieldCheck } from 'lucide-react';
import SocialCards, { type CardItem } from '@/components/ui/card-fan-carousel';

// Dynamic import for the 3D gallery since it uses WebGL/Three.js and must be client-only
const InfiniteGallery = dynamic(
  () => import('@/components/ui/3d-gallery-photography'),
  { ssr: false }
);

const HERO_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&auto=format&fit=crop', alt: 'Fashion 1' },
  { src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop', alt: 'Fashion 2' },
  { src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop', alt: 'Fashion 3' },
  { src: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop', alt: 'Fashion 4' },
  { src: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&auto=format&fit=crop', alt: 'Fashion 5' },
  { src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop', alt: 'Fashion 6' },
  { src: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&auto=format&fit=crop', alt: 'Fashion 7' },
  { src: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop', alt: 'Fashion 8' },
];

const FAN_CARDS: CardItem[] = [
  { imgUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=700&fit=crop', alt: 'Mountain landscape' },
  { imgUrl: 'https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb?w=400&h=700&fit=crop', alt: 'City night' },
  { imgUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=700&fit=crop', alt: 'Foggy forest' },
  { imgUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=700&fit=crop', alt: 'Sunlit woods' },
  { imgUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=700&fit=crop', alt: 'Tropical beach' },
  { imgUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=700&fit=crop', alt: 'Starry mountain' },
  { imgUrl: 'https://images.unsplash.com/photo-1476820865390-c52aeebb9891?w=400&h=700&fit=crop', alt: 'Golden sunset' },
  { imgUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&h=700&fit=crop', alt: 'Lake reflection' },
  { imgUrl: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&h=700&fit=crop', alt: 'Green valley' },
  { imgUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=700&fit=crop', alt: 'Sunbeam nature' },
];

const FEATURES = [
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: 'AI Style Analysis',
    description: 'Upload any outfit piece and get AI-powered style suggestions with matching accessories.',
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    icon: <Palette className="w-6 h-6" />,
    title: 'Color Lab',
    description: 'Explore color harmonies and find the perfect palette for your wardrobe.',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Smart Collection',
    description: 'Build and organize your digital wardrobe with intelligent categorization.',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: 'Style Rewards',
    description: 'Earn points and badges as you explore and refine your personal style.',
    gradient: 'from-emerald-500 to-teal-500',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 overflow-x-hidden">
      {/* ===== 3D Gallery Hero ===== */}
      <section className="relative h-screen w-full">
        <InfiniteGallery
          images={HERO_IMAGES}
          speed={1.2}
          zSpacing={3}
          visibleCount={12}
          falloff={{ near: 0.8, far: 14 }}
          className="h-screen w-full"
        />

        {/* Overlay content */}
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-center px-4">
          <div className="pointer-events-auto space-y-8 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-4 py-1.5 text-xs font-medium text-indigo-300">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Fashion Intelligence
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mix-blend-exclusion">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                AuraStyle
              </span>
              <br />
              <span className="italic font-serif text-4xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">
                AI
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/60 max-w-lg mx-auto leading-relaxed">
              Your personal AI stylist. Upload, analyze, and perfect your wardrobe with intelligent fashion recommendations.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3.5 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 hover:border-white/20 text-white font-medium py-3.5 px-8 rounded-xl transition-all duration-300"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom hint */}
        <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none">
          <p className="text-xs text-white/30 font-mono uppercase tracking-wider">
            Scroll to explore • Use mouse wheel or arrow keys
          </p>
        </div>
      </section>

      {/* ===== Features ===== */}
      <section className="relative py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-slate-900 to-slate-900" />
        <div className="relative container mx-auto max-w-6xl">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
              Everything You Need to
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                Elevate Your Style
              </span>
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Powerful tools designed to transform how you approach fashion.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, index) => (
              <div
                key={index}
                className="glass-card rounded-2xl p-6 hover:border-white/15 transition-all duration-500 group hover:-translate-y-1"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Fan Carousel Showcase ===== */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-indigo-950/30 to-slate-900" />
        <div className="relative">
          <div className="text-center mb-8 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Curated Inspiration
            </h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Browse through stunning visual collections to spark your next style evolution.
            </p>
          </div>
          <SocialCards cards={FAN_CARDS} />
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-slate-900 to-slate-900" />
        <div className="relative container mx-auto max-w-2xl text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            Ready to Transform
            <br />
            Your Wardrobe?
          </h2>
          <p className="text-slate-400 text-lg">
            Join thousands of fashion-forward users who trust AuraStyle AI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3.5 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105"
            >
              Start for Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="border-t border-white/5 py-8 px-4">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
              <span className="text-white font-bold text-xs">A</span>
            </div>
            <span>AuraStyle AI</span>
          </div>
          <p>&copy; {new Date().getFullYear()} AuraStyle AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
