'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Heart,
  Plus,
  Search,
  Sparkles,
  CheckCircle2,
  Sliders,
  Feather,
  Sun,
  ShieldCheck,
  Truck,
  RefreshCw,
  Headphones,
  ArrowRight,
} from 'lucide-react';
import { useCollection, CollectionItem } from '@/hooks/useCollection';
import { useAuth } from '@/hooks/useAuth';
import LoginModal from '@/components/LoginModal';

const ATELIER_TEAM = [
  {
    name: 'Lynn Clarke',
    role: 'HEAD OF HAUTE COUTURE',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    specialty: 'Evening Silhouettes & Drapes',
  },
  {
    name: 'Sara Simpson',
    role: 'COLOR THEORIST & STYLIST',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
    specialty: 'Harmonic Chromatics & Palettes',
  },
  {
    name: 'Harley Mason',
    role: 'MEN’S TAILORING DIRECTOR',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    specialty: 'Bespoke Suiting & Ethnic Fusion',
  },
  {
    name: 'Mathilda West',
    role: 'STREETWEAR & CASUALS LEAD',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80',
    specialty: 'Contemporary Urban Capsule',
  },
];

const PARTNER_BRANDS = [
  'MIHOKO',
  'NAYLA',
  'BRODY',
  'AKXE',
  'NEEDLE',
  'MONA',
  'ABIGAIL',
  'BAILEYS',
  'TRXK ATELIER',
];

const CATEGORY_TABS: Array<CollectionItem['category'] | 'All'> = [
  'All',
  'Jewelry',
  'Shoes',
  'Watch',
  'Chain',
  'Bracelet',
  'Bag',
  'Hat',
  'Sunglasses',
  'Other',
];

export default function CollectionPage() {
  const collection = useCollection();
  const { isAuthenticated } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CollectionItem['category'] | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'name' | 'category'>('newest');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItemPreview, setSelectedItemPreview] = useState<CollectionItem | null>(null);
  const [emailSubscribed, setEmailSubscribed] = useState(false);

  // Add Item form state
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState<CollectionItem['category']>('Jewelry');
  const [itemColor, setItemColor] = useState('#3EA094');

  const { items, addItem, removeItem, toggleFavorite, totalCount } = collection;

  const filteredItems = items
    .filter((item) => {
      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesFavorites = !onlyFavorites || item.isFavorite;
      const matchesSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesFavorites && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'category') return a.category.localeCompare(b.category);
      return 0;
    });

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return;
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    addItem({
      name: itemName.trim(),
      category: itemCategory,
      color: itemColor,
    });
    setItemName('');
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#232220] font-sans antialiased selection:bg-[#E36339] selection:text-white">
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        title="Sign In to Manage Wardrobe"
        message="Sign in to save, organize, and curate custom clothing items in your cloud digital wardrobe."
      />

      {/* ========================================================= */}
      {/* 1. TOP EDITORIAL ANNOUNCEMENT & NAVIGATION BAR            */}
      {/* ========================================================= */}
      <div className="bg-[#18181B] text-[#FDFBF7] text-[11px] font-mono py-2 text-center tracking-widest uppercase border-b border-black/10">
        <span>Complimentary AI Wardrobe Styling on All Curated Collections &bull; Free Global Shipping Over $150</span>
      </div>

      <header className="sticky top-0 z-40 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#EAE3D9]">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#7A756D] hover:text-[#232220] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Studio</span>
            </Link>
            <div className="hidden sm:block w-px h-4 bg-[#EAE3D9]" />
            <nav className="hidden md:flex items-center gap-6 text-xs font-mono tracking-wider uppercase text-[#7A756D]">
              <Link href="/dashboard" className="hover:text-[#232220] transition-colors">Atelier</Link>
              <Link href="/collection" className="text-[#232220] font-bold border-b border-[#232220]">Collection</Link>
              <Link href="/dashboard" className="hover:text-[#232220] transition-colors">Color Lab</Link>
              <Link href="/dashboard" className="hover:text-[#232220] transition-colors">AI Vision</Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-center">
              <Link href="/" className="font-serif text-2xl font-black tracking-tight text-[#232220]">
                AuraStyle <span className="italic font-normal text-[#E36339]">Atelier</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAE3D9]/60 font-mono text-xs text-[#232220]">
              <Heart className="w-3.5 h-3.5 text-[#E36339] fill-[#E36339]" />
              <strong>{totalCount}</strong> Pieces Saved
            </span>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-full bg-[#232220] hover:bg-[#3F3E3B] text-white text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Piece</span>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. BOUTIQUE HERO BANNER ("About Us / Wear without worries") */}
      {/* ========================================================= */}
      <section className="py-16 md:py-24 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EAE3D9]/60 text-[#7A756D] font-mono text-xs tracking-widest uppercase">
            <Sparkles className="w-3 h-3 text-[#E36339]" />
            <span>About Us &bull; AuraStyle Atelier Since 2024</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#232220] tracking-tight leading-[1.12]">
            Wear the favorite outfit <br />
            <span className="italic font-normal text-[#3EA094]">without worries.</span>
          </h1>
          <p className="text-[#5C564E] text-base md:text-lg leading-relaxed font-normal">
            Our atelier brings you bespoke, handpicked apparel and digitized wardrobe intelligence. 
            Every stitch, weave, and silhouette is crafted to celebrate effortless individuality 
            across seasons, colors, and celebratory occasions.
          </p>

          {/* Cursive Signature Block */}
          <div className="pt-4 flex flex-col items-center justify-center space-y-1">
            <div className="font-serif italic text-3xl md:text-4xl text-[#232220] tracking-wider transform -rotate-2 select-none">
              Valerie Charles
            </div>
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#7A756D]">
              VALERIE CHARLES &bull; HEAD OF STYLING &amp; ATELIER CREATIVE DIRECTOR
            </span>
          </div>
        </div>

        {/* Flagship Store Interior Image Frame */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#EAE3D9]">
          <img
            src="/images/atelier/boutique-store.jpg"
            alt="AuraStyle Atelier Flagship Boutique"
            className="w-full aspect-[16/9] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between text-white gap-4">
            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-mono uppercase tracking-wider border border-white/30">
                PARIS &bull; MILAN &bull; TOKYO FLAGSHIP
              </span>
              <h3 className="font-serif text-2xl md:text-3xl font-bold">The Modern Dressing Suite</h3>
            </div>
            <p className="text-xs font-mono text-white/80 max-w-sm hidden sm:block">
              Architecturally designed Japandi salon featuring seasonal capsule collections and AI color drape analysis.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. SPLIT HERO STORY ("We're unique no matter how you put it") */}
      {/* ========================================================= */}
      <section className="py-16 md:py-24 bg-[#F5EFEB] border-y border-[#EAE3D9]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Editorial Couple Portrait in Knitwear */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#E5D8CA] group">
              <img
                src="/images/atelier/knitwear-duo.jpg"
                alt="Editorial Knitwear Duo Lookbook"
                className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-mono uppercase tracking-wider border border-white/20">
                  FALL / WINTER CAPSULE
                </span>
              </div>
            </div>
          </div>

          {/* Right: Editorial Craft Value Props Grid */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-3">
              <span className="font-mono text-xs font-bold tracking-widest text-[#E36339] uppercase">
                THE ATELIER PHILOSOPHY
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#232220] tracking-tight leading-tight">
                We&apos;re unique no matter <br />
                <span className="italic text-[#3EA094]">how you put it.</span>
              </h2>
              <p className="text-[#5C564E] text-base leading-relaxed">
                Meticulously sourced organic fibers, timeless silhouettes, and intelligent wardrobe 
                coordination harmonize to deliver foundational garments designed for longevity.
              </p>
            </div>

            {/* 4-Item Icon Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2 p-4 rounded-2xl bg-[#FDFBF7] border border-[#EAE3D9] shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#3EA094]/10 text-[#3EA094] flex items-center justify-center">
                  <Feather className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-base font-bold text-[#232220]">100% Organic &amp; Pure Silk</h4>
                <p className="text-xs text-[#7A756D] leading-relaxed">
                  Cruelty-free, natural fibers sourced directly from certified ethical mills.
                </p>
              </div>

              <div className="space-y-2 p-4 rounded-2xl bg-[#FDFBF7] border border-[#EAE3D9] shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#E36339]/10 text-[#E36339] flex items-center justify-center">
                  <Sliders className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-base font-bold text-[#232220]">Hand-Crafted Weaves</h4>
                <p className="text-xs text-[#7A756D] leading-relaxed">
                  Artisanal draping and precision tailored seams crafted by master ateliers.
                </p>
              </div>

              <div className="space-y-2 p-4 rounded-2xl bg-[#FDFBF7] border border-[#EAE3D9] shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#D4A343]/10 text-[#D4A343] flex items-center justify-center">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-base font-bold text-[#232220]">Breathable Matrix</h4>
                <p className="text-xs text-[#7A756D] leading-relaxed">
                  Micro-porous natural weaves offering fluid movement and day-long thermal comfort.
                </p>
              </div>

              <div className="space-y-2 p-4 rounded-2xl bg-[#FDFBF7] border border-[#EAE3D9] shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#232220]/10 text-[#232220] flex items-center justify-center">
                  <Sun className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-base font-bold text-[#232220]">Perfect for All Weather</h4>
                <p className="text-xs text-[#7A756D] leading-relaxed">
                  Versatile modular layering pieces designed for seamless seasonal transitions.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#232220] hover:bg-[#3F3E3B] text-white font-mono text-xs font-bold tracking-widest uppercase transition-all shadow-md"
              >
                <span>EXPLORE ATELIER STUDIO</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. DIGITAL WARDROBE & INVENTORY COLLECTION GRID           */}
      {/* ========================================================= */}
      <section className="py-20 max-w-7xl mx-auto px-6 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#EAE3D9] pb-8">
          <div className="space-y-2">
            <span className="font-mono text-xs font-bold tracking-widest text-[#3EA094] uppercase">
              PERSONAL ATELIER VAULT
            </span>
            <h2 className="font-serif text-3xl md:text-5xl text-[#232220] tracking-tight">
              Your Curated Wardrobe
            </h2>
            <p className="text-[#7A756D] text-sm md:text-base max-w-xl">
              Organize, filter, and review every saved piece, accessory, and bespoke drape in your digital collection.
            </p>
          </div>

          {/* Search & Action Bar */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-60">
              <Search className="w-4 h-4 text-[#7A756D] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search collection..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-full bg-[#F5EFEB] border border-[#EAE3D9] text-xs font-mono focus:outline-none focus:border-[#232220]"
              />
            </div>

            {/* Favorite Filter Toggle */}
            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`px-4 py-2.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-1.5 transition-all border ${
                onlyFavorites
                  ? 'bg-[#E36339] text-white border-[#E36339] shadow-sm'
                  : 'bg-[#F5EFEB] text-[#7A756D] border-[#EAE3D9] hover:text-[#232220]'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-white' : ''}`} />
              <span>Favorites</span>
            </button>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'name' | 'category')}
              className="px-3 py-2.5 rounded-full bg-[#F5EFEB] border border-[#EAE3D9] text-xs font-mono uppercase text-[#7A756D] focus:outline-none"
            >
              <option value="newest">Sort: Default</option>
              <option value="name">Sort: Name A-Z</option>
              <option value="category">Sort: Category</option>
            </select>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 rounded-full bg-[#232220] hover:bg-[#3F3E3B] text-white text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-sm transition-all shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Item</span>
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORY_TABS.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition-all shrink-0 ${
                  isActive
                    ? 'bg-[#232220] text-white shadow-sm'
                    : 'bg-[#F5EFEB] text-[#7A756D] hover:bg-[#EAE3D9] hover:text-[#232220]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Wardrobe Items Display */}
        {filteredItems.length === 0 ? (
          <div className="p-16 rounded-3xl bg-[#F5EFEB] border border-[#EAE3D9] text-center space-y-4 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#EAE3D9] flex items-center justify-center text-3xl mx-auto">
              👗
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-2xl font-bold text-[#232220]">No Items Found</h3>
              <p className="text-xs text-[#7A756D] leading-relaxed">
                Try adjusting your search or category filter, or add new pieces to your digital wardrobe vault.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setOnlyFavorites(false);
                setSearchQuery('');
              }}
              className="px-6 py-3 rounded-full bg-[#232220] text-white text-xs font-mono uppercase tracking-wider font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItemPreview(item)}
                className="group rounded-3xl bg-[#FDFBF7] border border-[#EAE3D9] hover:border-[#232220] p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F5EFEB] text-[#7A756D] font-mono text-[10px] uppercase font-bold tracking-wider">
                      {item.category}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(item.id);
                      }}
                      className="p-1.5 rounded-full hover:bg-[#F5EFEB] transition-colors"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          item.isFavorite ? 'text-[#E36339] fill-[#E36339]' : 'text-[#7A756D]'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Swatch & Title */}
                  <div className="flex items-center gap-3">
                    <span
                      className="w-8 h-8 rounded-full border border-black/10 shadow-sm shrink-0"
                      style={{ backgroundColor: item.color || '#3EA094' }}
                    />
                    <div className="overflow-hidden">
                      <h4 className="font-serif text-base font-bold text-[#232220] truncate group-hover:text-[#E36339] transition-colors">
                        {item.name}
                      </h4>
                      <p className="font-mono text-[10px] text-[#7A756D] uppercase">
                        CHROMA &bull; {item.color || '#3EA094'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EAE3D9] flex items-center justify-between text-xs font-mono">
                  <span className="text-[#7A756D]">VAULT #0{item.id.slice(0, 3)}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(item.id);
                    }}
                    className="text-[#E36339] hover:underline text-[11px]"
                  >
                    Archive
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ========================================================= */}
      {/* 5. "MEET OUR TEAM" (Stylist & Curator Editorial Roster)   */}
      {/* ========================================================= */}
      <section className="py-20 bg-[#F5EFEB] border-t border-[#EAE3D9]">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="font-mono text-xs font-bold tracking-widest text-[#E36339] uppercase">
              EDITORIAL CURATORS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#232220] tracking-tight">
              Meet Our Team
            </h2>
            <p className="text-[#5C564E] text-sm md:text-base leading-relaxed">
              Dedicated fashion directors, visual merchandisers, and digital color theorists crafting your bespoke style.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {ATELIER_TEAM.map((member, idx) => (
              <div key={idx} className="group space-y-4 text-center">
                <div className="relative rounded-3xl overflow-hidden shadow-lg border border-[#E5D8CA] aspect-[3/4] bg-[#EAE3D9]">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6 text-white text-xs font-mono">
                    <span>{member.specialty}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif text-xl font-bold text-[#232220]">{member.name}</h4>
                  <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#7A756D]">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. "BRANDS WE PARTNERED WITH"                             */}
      {/* ========================================================= */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-[#EAE3D9] pb-16">
          <div className="lg:col-span-4 space-y-2">
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#232220]">
              Brands we Partnered with
            </h3>
            <p className="text-xs text-[#7A756D] leading-relaxed">
              Collaborating with prestigious heritage fashion houses, sustainable fabric mills, and contemporary footwear ateliers globally.
            </p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-6 text-center">
            {PARTNER_BRANDS.map((brand, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#F5EFEB] border border-[#EAE3D9] flex items-center justify-center font-serif text-base md:text-lg font-bold text-[#232220]/80 tracking-widest hover:text-[#232220] transition-colors"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. VALUE PROPS / GUARANTEE BAR                            */}
      {/* ========================================================= */}
      <section className="py-12 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-[#F5EFEB] text-[#232220] border border-[#EAE3D9]">
              <Truck className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h5 className="font-serif text-sm font-bold text-[#232220]">Free Global Shipping</h5>
              <p className="text-xs text-[#7A756D]">Fast courier delivery on orders over $150</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-[#F5EFEB] text-[#232220] border border-[#EAE3D9]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h5 className="font-serif text-sm font-bold text-[#232220]">Bespoke AI Fit Guarantee</h5>
              <p className="text-xs text-[#7A756D]">Virtual sizing &amp; tailor accurate styling</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-[#F5EFEB] text-[#232220] border border-[#EAE3D9]">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h5 className="font-serif text-sm font-bold text-[#232220]">Sustainable Capsule Care</h5>
              <p className="text-xs text-[#7A756D]">Recycling guides &amp; wardrobe longevity</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-[#F5EFEB] text-[#232220] border border-[#EAE3D9]">
              <Headphones className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h5 className="font-serif text-sm font-bold text-[#232220]">24/7 Atelier Concierge</h5>
              <p className="text-xs text-[#7A756D]">Direct assistance from our master stylists</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 8. NEWSLETTER & MINIMALIST ATELIER FOOTER                 */}
      {/* ========================================================= */}
      <footer className="border-t border-[#EAE3D9] bg-[#F5EFEB] pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-[#EAE3D9] pb-12">
            <div className="md:col-span-6 space-y-2">
              <h4 className="font-serif text-2xl md:text-3xl font-bold text-[#232220]">
                Sign up for Atelier Newsletter
              </h4>
              <p className="text-xs text-[#7A756D]">
                Receive seasonal trend forecasting, chromatic lookbooks, and private atelier invitations.
              </p>
            </div>

            <div className="md:col-span-6">
              {emailSubscribed ? (
                <div className="p-4 rounded-2xl bg-[#3EA094]/10 border border-[#3EA094]/30 text-[#3EA094] font-mono text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Thank you for subscribing to AuraStyle Atelier Gazette.</span>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setEmailSubscribed(true);
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    className="flex-1 px-5 py-3.5 rounded-full bg-[#FDFBF7] border border-[#EAE3D9] text-xs font-mono focus:outline-none focus:border-[#232220]"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3.5 rounded-full bg-[#232220] hover:bg-[#3F3E3B] text-white text-xs font-mono font-bold tracking-wider uppercase shrink-0 transition-all"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs font-mono text-[#7A756D]">
            <div className="space-y-3">
              <span className="text-[#232220] font-bold uppercase tracking-wider">Information</span>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-[#232220]">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-[#232220]">Shipping &amp; Delivery</Link></li>
                <li><Link href="#" className="hover:text-[#232220]">Terms &amp; Conditions</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <span className="text-[#232220] font-bold uppercase tracking-wider">About</span>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-[#232220]">Our Story</Link></li>
                <li><Link href="#" className="hover:text-[#232220]">Atelier Locations</Link></li>
                <li><Link href="#" className="hover:text-[#232220]">Sustainability</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <span className="text-[#232220] font-bold uppercase tracking-wider">Shop By</span>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-[#232220]">New Arrivals</Link></li>
                <li><Link href="#" className="hover:text-[#232220]">Capsule Wardrobe</Link></li>
                <li><Link href="#" className="hover:text-[#232220]">Curated Looks</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <span className="text-[#232220] font-bold uppercase tracking-wider">Atelier HQ</span>
              <p className="text-[#7A756D] leading-relaxed">
                74 Rue du Faubourg Saint-Honoré, Paris &bull; Beverly Hills, CA
              </p>
            </div>
          </div>

          <div className="border-t border-[#EAE3D9] pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#7A756D] gap-4">
            <p>&copy; {new Date().getFullYear()} AuraStyle Atelier. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>VISA</span>
              <span>MASTERCARD</span>
              <span>AMEX</span>
              <span>APPLE PAY</span>
            </div>
          </div>

        </div>
      </footer>

      {/* ========================================================= */}
      {/* 9. ADD ITEM MODAL                                         */}
      {/* ========================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FDFBF7] border border-[#EAE3D9] rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-2xl font-bold text-[#232220]">Add Wardrobe Piece</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#7A756D] hover:text-[#232220] font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-[#7A756D]">Garment / Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Silk Cashmere Turtleneck"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F5EFEB] border border-[#EAE3D9] text-xs font-mono focus:outline-none focus:border-[#232220]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-[#7A756D]">Category</label>
                <select
                  value={itemCategory}
                  onChange={(e) => setItemCategory(e.target.value as CollectionItem['category'])}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F5EFEB] border border-[#EAE3D9] text-xs font-mono focus:outline-none focus:border-[#232220]"
                >
                  {CATEGORY_TABS.filter((c) => c !== 'All').map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-[#7A756D]">Primary Hue</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={itemColor}
                    onChange={(e) => setItemColor(e.target.value)}
                    className="w-12 h-10 rounded-xl cursor-pointer border border-[#EAE3D9] bg-transparent"
                  />
                  <input
                    type="text"
                    value={itemColor}
                    onChange={(e) => setItemColor(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-2xl bg-[#F5EFEB] border border-[#EAE3D9] text-xs font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-[#232220] hover:bg-[#3F3E3B] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md mt-4"
              >
                Save to Wardrobe
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 10. ITEM INSPECTION PREVIEW MODAL                         */}
      {/* ========================================================= */}
      {selectedItemPreview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FDFBF7] border border-[#EAE3D9] rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#EAE3D9] pb-4">
              <span className="px-3 py-1 rounded-full bg-[#F5EFEB] text-[#7A756D] font-mono text-xs uppercase tracking-wider font-bold">
                {selectedItemPreview.category} &bull; ATELIER ARCHIVE
              </span>
              <button
                onClick={() => setSelectedItemPreview(null)}
                className="text-[#7A756D] hover:text-[#232220] font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-2xl border border-black/10 shadow-md flex items-center justify-center text-2xl"
                  style={{ backgroundColor: selectedItemPreview.color || '#3EA094' }}
                />
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#232220]">
                    {selectedItemPreview.name}
                  </h3>
                  <p className="font-mono text-xs text-[#7A756D]">
                    Primary Tone: {selectedItemPreview.color || '#3EA094'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F5EFEB] border border-[#EAE3D9] space-y-2 text-xs font-mono text-[#5C564E]">
                <p><strong>Item ID:</strong> {selectedItemPreview.id}</p>
                <p><strong>Cataloged:</strong> {selectedItemPreview.addedAt ? new Date(selectedItemPreview.addedAt).toLocaleDateString() : 'Atelier Archive'}</p>
                <p><strong>Status:</strong> {selectedItemPreview.isFavorite ? '⭐️ Favorited Piece' : 'Standard Wardrobe Vault'}</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    toggleFavorite(selectedItemPreview.id);
                    setSelectedItemPreview(null);
                  }}
                  className="flex-1 py-3 rounded-2xl bg-[#F5EFEB] hover:bg-[#EAE3D9] text-[#232220] font-mono text-xs font-bold uppercase tracking-wider border border-[#EAE3D9]"
                >
                  {selectedItemPreview.isFavorite ? 'Remove Favorite' : 'Mark Favorite'}
                </button>
                <Link
                  href="/dashboard"
                  className="flex-1 py-3 rounded-2xl bg-[#232220] hover:bg-[#3F3E3B] text-white font-mono text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-1.5"
                >
                  <span>Style in Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
