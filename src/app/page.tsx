'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Sparkles, ArrowRight, Palette, Zap, ShieldCheck, ShoppingBag, CheckCircle2 } from 'lucide-react';
import SocialCards, { type CardItem } from '@/components/ui/card-fan-carousel';
import AuraStyleLogo from '@/components/AuraStyleLogo';

// Dynamic import for the 3D gallery since it uses WebGL/Three.js and must be client-only
const InfiniteGallery = dynamic(
  () => import('@/components/ui/3d-gallery-photography'),
  { ssr: false }
);

const HERO_IMAGES = [
  { src: '/images/branding/hero-banner.jpg', alt: 'Campaign Hero Banner' },
  { src: '/images/branding/womens-ethnic-fusion.jpg', alt: 'Royal Festive Fusion' },
  { src: '/images/branding/mens-smart-casual.jpg', alt: 'Men Smart Casual Wear' },
  { src: '/images/branding/urban-western-casual.jpg', alt: 'Urban Casual Collection' },
  { src: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&auto=format&fit=crop', alt: 'Editorial 1' },
  { src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop', alt: 'Editorial 2' },
  { src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop', alt: 'Editorial 3' },
  { src: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop', alt: 'Editorial 4' },
];

const FAN_CARDS: CardItem[] = [
  { imgUrl: '/images/branding/womens-ethnic-fusion.jpg', alt: 'Royal Festive Fusion Look' },
  { imgUrl: '/images/branding/mens-smart-casual.jpg', alt: 'Smart Tailored Ensemble' },
  { imgUrl: '/images/branding/urban-western-casual.jpg', alt: 'Pastel Streetwear Denim & Cargo' },
  { imgUrl: '/images/branding/hero-banner.jpg', alt: 'AuraStyle Signature Look' },
  { imgUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=700&fit=crop', alt: 'Couture Editorial' },
  { imgUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=700&fit=crop', alt: 'Runway Silhouette' },
];

const LOOKBOOK_PREVIEWS = [
  {
    titleSerif: 'Casual',
    titleSans: 'WORKPLACES',
    category: 'Smart Casual',
    image: '/images/branding/mens-smart-casual.jpg',
    tagline: 'Technical commuter backpack, utility zip jacket, indigo denim & gum sole sneakers.',
    tag: 'Trending Workwear',
    color: '#1e3a8a',
  },
  {
    titleSerif: 'Regal',
    titleSans: 'CELEBRATION',
    category: 'Indo-Western',
    image: '/images/branding/womens-ethnic-fusion.jpg',
    tagline: 'Embroidered silk cape, heritage royal blue choker & fluid palazzo trousers.',
    tag: 'Festive Luxury',
    color: '#1e3a8a',
  },
  {
    titleSerif: 'Pastel',
    titleSans: 'STREETWEAR',
    category: 'Urban Chic',
    image: '/images/branding/urban-western-casual.jpg',
    tagline: 'Cropped washed denim trucker with utility cargo trousers & ivory court sneakers.',
    tag: 'Street Capsule',
    color: '#1e3a8a',
  },
  {
    titleSerif: 'Signature',
    titleSans: 'HERO ENSEMBLE',
    category: 'Seasonal Flagship',
    image: '/images/branding/hero-banner.jpg',
    tagline: 'Bespoke textured waistcoat paired with crisp ivory chinos and burnished loafers.',
    tag: 'Atelier Signature',
    color: '#1e3a8a',
  },
];

const FEATURES = [
  {
    icon: <Sparkles className="w-6 h-6 text-[#fffff0]" />,
    title: 'Curated Lookbooks',
    description: 'Explore moodboard collages with model silhouettes, floating product cutouts & 1-click Shop All.',
  },
  {
    icon: <Palette className="w-6 h-6 text-[#fffff0]" />,
    title: 'Harmonic Color Lab',
    description: 'Precision chromatic tools harmonizing primary palettes, complementary tones, and metallic accents.',
  },
  {
    icon: <Zap className="w-6 h-6 text-[#fffff0]" />,
    title: 'Intelligent Wardrobe',
    description: 'Digitize your closet with automated tagging, piece pairing, and occasion styling.',
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-[#fffff0]" />,
    title: 'Atelier AI Stylist',
    description: '24/7 fashion assistant analyzing weather, dress code, and harmonic proportions.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a192f] text-[#FAF8F5] overflow-x-hidden selection:bg-[#1e3a8a] selection:text-[#fffff0]">
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
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-center px-4 bg-gradient-to-b from-[#0a192f]/40 via-[#0a192f]/60 to-[#0a192f]">
          <div className="pointer-events-auto space-y-8 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#FAF8F5]/10 backdrop-blur-xl border border-[#FAF8F5]/20 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wider text-[#FAF8F5] uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#fffff0]" />
              Royal Blue & Ivory Collection
            </div>
            
            <h1 className="text-5xl md:text-8xl font-serif font-black tracking-tight text-[#FAF8F5]">
              AuraStyle
              <span className="block italic text-3xl md:text-5xl font-normal text-[#93c5fd] mt-2 font-sans tracking-wide">
                Fashion Intelligence
              </span>
            </h1>

            <p className="text-base md:text-xl text-[#FAF8F5]/80 max-w-lg mx-auto leading-relaxed font-light">
              Your bespoke AI stylist. Curated editorial moodboards, wardrobe digitizer, and harmonic color intelligence.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/register"
                className="flex items-center gap-2 bg-[#FAF8F5] hover:bg-white text-[#0a192f] font-bold py-3.5 px-8 rounded-full transition-all duration-300 shadow-xl shadow-[#1e3a8a]/40 hover:scale-105 border border-[#FAF8F5]"
              >
                <span>Explore Curated Looks</span>
                <ArrowRight className="w-4 h-4 text-[#1e3a8a]" />
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 bg-[#1e3a8a]/60 hover:bg-[#1e3a8a] backdrop-blur-xl border border-[#FAF8F5]/30 text-[#FAF8F5] font-semibold py-3.5 px-8 rounded-full transition-all duration-300 shadow-md"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom hint */}
        <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none">
          <p className="text-xs text-[#FAF8F5]/50 font-mono uppercase tracking-widest">
            ✦ Scroll or Swipe to explore ✦
          </p>
        </div>
      </section>

      {/* ===== Curated Looks Moodboard Highlight ===== */}
      <section className="relative py-24 px-4 bg-[#0a192f] border-t border-[#FAF8F5]/10">
        <div className="container mx-auto max-w-6xl space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1e3a8a]/40 border border-[#FAF8F5]/20 text-[#FAF8F5] text-xs font-semibold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 text-[#fffff0]" />
                Curated Looks For You
              </div>
              <h2 className="text-3xl md:text-5xl font-serif font-black tracking-tight text-[#FAF8F5]">
                Editorial Moodboard Stories
              </h2>
              <p className="text-[#FAF8F5]/70 text-base max-w-xl">
                Collage lookbooks pairing silhouette models with floating coordinates and one-click wardrobe additions.
              </p>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FAF8F5] hover:bg-white text-[#0a192f] font-bold text-sm shadow-xl transition-all hover:scale-105"
            >
              <ShoppingBag className="w-4 h-4 text-[#1e3a8a]" />
              <span>Open Lookbook Studio</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {LOOKBOOK_PREVIEWS.map((look, index) => (
              <div
                key={index}
                className="group relative rounded-3xl overflow-hidden bg-[#FAF8F5] text-[#0a192f] p-4 shadow-xl border border-[#FAF8F5]/40 hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between"
              >
                {/* Image container */}
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 bg-[#0a192f]/5">
                  <img
                    src={look.image}
                    alt={look.titleSerif}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-[#FAF8F5] text-[#0a192f] border border-[#0a192f]/20 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase shadow">
                    {look.tag}
                  </div>
                  <div className="absolute bottom-3 right-3 text-[#1e3a8a] text-lg select-none">
                    ✦ ✧
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="font-serif text-2xl text-[#0a192f] leading-none">
                      {look.titleSerif}
                    </div>
                    <div className="text-[10px] font-sans font-black tracking-[0.2em] text-[#1e3a8a] uppercase">
                      {look.titleSans}
                    </div>
                    <p className="text-xs text-[#0a192f]/70 mt-2 line-clamp-2 leading-relaxed">
                      {look.tagline}
                    </p>
                  </div>

                  <Link
                    href="/dashboard"
                    className="w-full py-2.5 mt-3 rounded-xl bg-[#0a192f] hover:bg-[#1e3a8a] text-[#FAF8F5] text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md"
                  >
                    <span>Shop Look</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Brand Monogram & Aesthetic Identity Showcase ===== */}
      <section className="relative py-24 px-4 bg-[#071326] border-t border-[#FAF8F5]/10">
        <div className="container mx-auto max-w-5xl space-y-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1e3a8a]/40 border border-[#FAF8F5]/20 text-[#FAF8F5] text-xs font-mono tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#fffff0]" />
              <span>Aesthetic Identity</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-black tracking-tight text-[#FAF8F5]">
              The AuraStyle Hallmark
            </h2>
            <p className="text-[#FAF8F5]/70 text-sm md:text-base max-w-lg mx-auto">
              Our signature floral AS monogram and curated fashion iconography, symbolizing bespoke beauty and wardrobe longevity.
            </p>
          </div>

          <AuraStyleLogo variant="showcase" />
        </div>
      </section>

      {/* ===== Features ===== */}
      <section className="relative py-24 px-4 bg-[#050d1a] border-t border-[#FAF8F5]/10">
        <div className="container mx-auto max-w-6xl space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-serif font-black tracking-tight text-[#FAF8F5]">
              Everything You Need to
              <br />
              <span className="text-[#93c5fd] font-sans text-3xl md:text-4xl font-normal">
                Refine Your Aesthetic
              </span>
            </h2>
            <p className="text-[#FAF8F5]/70 text-base max-w-xl mx-auto">
              Luxury fashion technology designed to curate, organize, and elevate your personal wardrobe.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, index) => (
              <div
                key={index}
                className="bg-[#0f254e]/50 border border-[#FAF8F5]/15 rounded-3xl p-6 hover:border-[#FAF8F5]/40 transition-all duration-500 group hover:-translate-y-1 shadow-lg"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#1e3a8a] border border-[#FAF8F5]/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-serif font-bold text-[#FAF8F5] mb-2">{feature.title}</h3>
                <p className="text-xs text-[#FAF8F5]/70 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Fan Carousel Showcase ===== */}
      <section className="relative py-20 bg-[#0a192f] border-t border-[#FAF8F5]/10">
        <div className="relative">
          <div className="text-center mb-8 space-y-2">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#FAF8F5]">
              Curated Style Inspiration
            </h2>
            <p className="text-[#FAF8F5]/60 text-sm max-w-md mx-auto">
              Explore bespoke silhouettes and couture archives in Royal Blue & Ivory.
            </p>
          </div>
          <SocialCards cards={FAN_CARDS} />
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative py-24 px-4 bg-[#050d1a] border-t border-[#FAF8F5]/15">
        <div className="container mx-auto max-w-2xl text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#FAF8F5]">
            Ready to Perfect
            <br />
            Your Wardrobe?
          </h2>
          <p className="text-[#FAF8F5]/70 text-base">
            Join the digital fashion revolution with bespoke recommendations in Royal Blue & Ivory.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="flex items-center gap-2 bg-[#FAF8F5] hover:bg-white text-[#0a192f] font-bold py-3.5 px-8 rounded-full transition-all duration-300 shadow-xl shadow-[#1e3a8a]/30 hover:scale-105"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4 text-[#1e3a8a]" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="border-t border-[#FAF8F5]/10 py-8 px-4 bg-[#050d1a]">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF8F5]/60">
          <AuraStyleLogo variant="full" />
          <p>&copy; {new Date().getFullYear()} AuraStyle AI. All rights reserved. Dressed for your moments.</p>
        </div>
      </footer>
    </div>
  );
}
