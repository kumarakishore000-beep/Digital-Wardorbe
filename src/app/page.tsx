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
  { src: '/images/branding/hero-banner.jpg', alt: 'Pantaloons Campaign Hero Banner' },
  { src: '/images/branding/womens-ethnic-fusion.jpg', alt: 'Women Indo-Western Festive Fusion' },
  { src: '/images/branding/mens-smart-casual.jpg', alt: 'Men Smart Casual Festive Wear' },
  { src: '/images/branding/urban-western-casual.jpg', alt: 'Urban Western Casual Collection' },
  { src: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&auto=format&fit=crop', alt: 'Fashion Editorial 1' },
  { src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop', alt: 'Fashion Editorial 2' },
  { src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop', alt: 'Fashion Editorial 3' },
  { src: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop', alt: 'Fashion Editorial 4' },
];

const FAN_CARDS: CardItem[] = [
  { imgUrl: '/images/branding/womens-ethnic-fusion.jpg', alt: 'Indo-Western Festive Fusion Look' },
  { imgUrl: '/images/branding/mens-smart-casual.jpg', alt: 'Smart Ethnic Nehru Waistcoat Ensemble' },
  { imgUrl: '/images/branding/urban-western-casual.jpg', alt: 'Pastel Streetwear Denim & Cargo' },
  { imgUrl: '/images/branding/hero-banner.jpg', alt: 'Pantaloons Festive Brand Campaign' },
  { imgUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=700&fit=crop', alt: 'Couture Editorial' },
  { imgUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=700&fit=crop', alt: 'Runway Silhouette' },
  { imgUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=700&fit=crop', alt: 'Modern Chic' },
  { imgUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&h=700&fit=crop', alt: 'Urban Street Fashion' },
];

const BRAND_LOOKBOOKS = [
  {
    title: 'Festive Indo-Western Fusion',
    category: "Women's Collection",
    image: '/images/branding/womens-ethnic-fusion.jpg',
    description: 'Coral-peach embellished crop top with floral flared palazzos and sheer cape jacket.',
    tag: 'Trending Festive',
  },
  {
    title: "Men's Smart Ethnic Casual",
    category: "Men's Collection",
    image: '/images/branding/mens-smart-casual.jpg',
    description: 'Printed teal linen short kurta with a textured beige Nehru waistcoat and slim trousers.',
    tag: 'Festive Classic',
  },
  {
    title: 'Urban Pastel Streetwear',
    category: 'Western Chic',
    image: '/images/branding/urban-western-casual.jpg',
    description: 'Lavender cropped denim jacket paired with olive high-waist utility cargo pants.',
    tag: 'Street Style',
  },
  {
    title: 'Brand Campaign Hero Ensemble',
    category: 'Seasonal Campaign',
    image: '/images/branding/hero-banner.jpg',
    description: 'Joyful group showcase featuring coordinated contemporary ethnic and modern western styles.',
    tag: 'Signature Campaign',
  },
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

      {/* ===== Brand Campaign Lookbook Showcase (Pantaloons Collection) ===== */}
      <section className="relative py-20 px-4 bg-slate-950/60 border-y border-white/5">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Featured Editorial Collections
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
                Pantaloons Inspired Lookbooks
              </h2>
              <p className="text-slate-400 text-base max-w-xl">
                Explore vibrant contemporary ethnic fusion, modern festive cuts, and effortless western casuals styled by AuraStyle AI.
              </p>
            </div>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold border border-white/10 transition-all self-start md:self-auto"
            >
              <span>Explore Wardrobe AI</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BRAND_LOOKBOOKS.map((look, index) => (
              <div
                key={index}
                className="group relative rounded-3xl overflow-hidden bg-slate-900/80 border border-white/10 hover:border-indigo-500/50 transition-all duration-500 shadow-xl hover:-translate-y-2 flex flex-col"
              >
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={look.image}
                    alt={look.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  
                  {/* Floating Tag */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-md">
                      {look.tag}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3 bg-slate-900/90">
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono text-indigo-300 uppercase tracking-wider">
                      {look.category}
                    </span>
                    <h3 className="text-lg font-bold text-white leading-snug group-hover:text-indigo-300 transition-colors">
                      {look.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {look.description}
                    </p>
                  </div>

                  <Link
                    href="/dashboard"
                    className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-indigo-600/80 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-300 border border-white/10"
                  >
                    <span>Style This Look</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
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
