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
  const [itemColor, setItemColor] = useState('#1E3A8A');

  const { items, addItem, removeItem, toggleFavorite } = collection;

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
    <div className="min-h-screen bg-[#FDFBF7] text-[#0A192F] font-sans antialiased selection:bg-[#1E3A8A] selection:text-[#FAF8F5]">
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        title="Sign In to Manage Wardrobe"
        message="Sign in to save, organize, and curate custom clothing items in your cloud digital wardrobe."
      />

      {/* 1. TOP EDITORIAL ANNOUNCEMENT & NAVIGATION BAR */}
      <div className="bg-[#0A192F] text-[#FAF8F5] text-[11px] font-mono py-2 text-center tracking-widest uppercase border-b border-[#1E3A8A]/20">
        <span>Royal Blue &amp; Ivory Capsule Collection &bull; Complimentary AI Wardrobe Styling</span>
      </div>

      <header className="sticky top-0 z-40 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#EAE3D2]">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#0A192F]/70 hover:text-[#0A192F] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Studio</span>
            </Link>

            <div className="hidden sm:block w-px h-4 bg-[#EAE3D2]" />
            <nav className="hidden md:flex items-center gap-6 text-xs font-mono tracking-wider uppercase text-[#0A192F]/70">
              <Link href="/dashboard" className="hover:text-[#0A192F] transition-colors">Lookbook</Link>
              <Link href="/collection" className="text-[#1E3A8A] font-bold border-b-2 border-[#1E3A8A] pb-0.5">Collection</Link>
              <Link href="/dashboard" className="hover:text-[#0A192F] transition-colors">Color Lab</Link>
              <Link href="/dashboard" className="hover:text-[#0A192F] transition-colors">AI Stylist</Link>
            </nav>
          </div>

          <div className="text-center">
            <Link href="/" className="font-serif text-2xl font-black tracking-tight text-[#0A192F]">
              AuraStyle <span className="italic font-normal text-[#1E3A8A]">Atelier</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#EAE3D2] font-mono text-xs text-[#0A192F]">
              <Heart className="w-3.5 h-3.5 text-[#1E3A8A] fill-[#1E3A8A]" />
              <span>{items.filter((i) => i.isFavorite).length} Saved</span>
            </span>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-full bg-[#1E3A8A] hover:bg-[#0A192F] text-white text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Item</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO EDITORIAL SHOWCASE */}
      <section className="relative overflow-hidden py-16 md:py-24 max-w-7xl mx-auto px-6">
        <div className="text-center space-y-6 max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1E3A8A]/10 text-[#1E3A8A] font-mono text-xs tracking-widest uppercase border border-[#1E3A8A]/20">
            <Sparkles className="w-3 h-3 text-[#1E3A8A]" />
            <span>Royal Blue &amp; Ivory Digital Wardrobe</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#0A192F] tracking-tight leading-[1.12]">
            Build your wardrobe <br className="hidden sm:block" />
            <span className="italic font-normal text-[#1E3A8A]">with harmonic grace.</span>
          </h1>

          <p className="text-[#0A192F]/75 text-base md:text-lg leading-relaxed font-normal">
            Effortlessly organize and pair your curated garments. Seamlessly sync lookbook pieces, seasonal capsules, and bespoke harmonic colors.
          </p>

          <div className="pt-4 flex items-center justify-center gap-4">
            <div className="font-serif italic text-3xl md:text-4xl text-[#1E3A8A] tracking-wider transform -rotate-2 select-none">
              AuraStyle
            </div>
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#0A192F]/60">
              EST. 2026 &bull; DIGITAL COUTURE
            </span>
          </div>
        </div>

        {/* Hero Editorial Banner Image */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#EAE3D2]">
          <div className="aspect-[16/9] md:aspect-[21/9] w-full">
            <img
              src="/images/branding/hero-banner.jpg"
              alt="Atelier Wardrobe Hero Banner"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/80 via-transparent to-transparent flex items-end p-8 md:p-12">
            <div className="text-white space-y-2 max-w-xl">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white font-mono text-xs uppercase tracking-wider">
                Lookbook Capsule Vol. 01
              </span>
              <h3 className="font-serif text-2xl md:text-4xl font-bold">
                The Royal Blue &amp; Ivory Harmony
              </h3>
              <p className="text-white/80 text-xs md:text-sm font-light">
                Discover pieces styled with architectural precision, fluid silks, and bespoke tailoring.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DIGITAL WARDROBE & INVENTORY COLLECTION GRID */}
      <section className="py-16 max-w-7xl mx-auto px-6 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#EAE3D2] pb-8">
          <div className="space-y-2">
            <span className="font-mono text-xs font-bold tracking-widest text-[#1E3A8A] uppercase">
              PERSONAL ATELIER VAULT
            </span>
            <h2 className="font-serif text-3xl md:text-5xl text-[#0A192F] tracking-tight">
              Your Curated Wardrobe
            </h2>
            <p className="text-[#0A192F]/70 text-sm md:text-base max-w-xl">
              Organize, filter, and review every saved piece, accessory, and bespoke drape in your digital collection.
            </p>
          </div>

          {/* Search & Action Bar */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-60">
              <Search className="w-4 h-4 text-[#0A192F]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search collection..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-full bg-[#FAF8F5] border border-[#EAE3D2] text-xs font-mono focus:outline-none focus:border-[#1E3A8A]"
              />
            </div>

            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`px-4 py-2.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-1.5 transition-all border ${
                onlyFavorites
                  ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-sm'
                  : 'bg-[#FAF8F5] text-[#0A192F]/70 border-[#EAE3D2] hover:text-[#0A192F]'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-white' : ''}`} />
              <span>Favorites</span>
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'name' | 'category')}
              className="px-3 py-2.5 rounded-full bg-[#FAF8F5] border border-[#EAE3D2] text-xs font-mono uppercase text-[#0A192F]/70 focus:outline-none"
            >
              <option value="newest">Sort: Default</option>
              <option value="name">Sort: Name A-Z</option>
              <option value="category">Sort: Category</option>
            </select>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 rounded-full bg-[#1E3A8A] hover:bg-[#0A192F] text-white text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-sm transition-all shrink-0"
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
                    ? 'bg-[#1E3A8A] text-white shadow-sm'
                    : 'bg-[#FAF8F5] text-[#0A192F]/70 hover:bg-[#EAE3D2] hover:text-[#0A192F]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Wardrobe Items Display */}
        {filteredItems.length === 0 ? (
          <div className="p-16 rounded-3xl bg-[#FAF8F5] border border-[#EAE3D2] text-center space-y-4 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#EAE3D2] flex items-center justify-center text-3xl mx-auto">
              👗
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-2xl font-bold text-[#0A192F]">No Items Found</h3>
              <p className="text-xs text-[#0A192F]/60 leading-relaxed">
                Try adjusting your search or category filter, or add new pieces to your digital wardrobe vault.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setOnlyFavorites(false);
                setSearchQuery('');
              }}
              className="px-6 py-3 rounded-full bg-[#1E3A8A] text-white text-xs font-mono uppercase tracking-wider font-bold"
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
                className="group rounded-3xl bg-[#FDFBF7] border border-[#EAE3D2] hover:border-[#1E3A8A] p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FAF8F5] text-[#0A192F]/70 font-mono text-[10px] uppercase font-bold tracking-wider border border-[#EAE3D2]">
                      {item.category}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(item.id);
                      }}
                      className="p-1.5 rounded-full hover:bg-[#FAF8F5] transition-colors"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          item.isFavorite ? 'text-[#1E3A8A] fill-[#1E3A8A]' : 'text-[#0A192F]/40'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className="w-8 h-8 rounded-full border border-black/10 shadow-sm shrink-0"
                      style={{ backgroundColor: item.color || '#1E3A8A' }}
                    />
                    <div className="overflow-hidden">
                      <h4 className="font-serif text-base font-bold text-[#0A192F] truncate group-hover:text-[#1E3A8A] transition-colors">
                        {item.name}
                      </h4>
                      <p className="font-mono text-[10px] text-[#0A192F]/60 uppercase">
                        CHROMA &bull; {item.color || '#1E3A8A'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EAE3D2] flex items-center justify-between text-xs font-mono">
                  <span className="text-[#0A192F]/60">VAULT #0{item.id.slice(0, 3)}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(item.id);
                    }}
                    className="text-[#1E3A8A] hover:underline text-[11px] font-bold"
                  >
                    Archive
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. EDITORIAL TEAM */}
      <section className="py-20 bg-[#FAF8F5] border-t border-[#EAE3D2]">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="font-mono text-xs font-bold tracking-widest text-[#1E3A8A] uppercase">
              EDITORIAL CURATORS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#0A192F] tracking-tight">
              Meet Our Atelier Team
            </h2>
            <p className="text-[#0A192F]/70 text-sm md:text-base leading-relaxed">
              Dedicated fashion directors, visual merchandisers, and digital color theorists crafting your bespoke style.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {ATELIER_TEAM.map((member, idx) => (
              <div key={idx} className="group space-y-4 text-center">
                <div className="relative rounded-3xl overflow-hidden shadow-lg border border-[#EAE3D2] aspect-[3/4] bg-[#EAE3D2]">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6 text-white text-xs font-mono">
                    <span>{member.specialty}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif text-xl font-bold text-[#0A192F]">{member.name}</h4>
                  <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#0A192F]/60">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. BRANDS WE PARTNERED WITH */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-[#EAE3D2] pb-16">
          <div className="lg:col-span-4 space-y-2">
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#0A192F]">
              Partnered Ateliers
            </h3>
            <p className="text-xs text-[#0A192F]/60 leading-relaxed">
              Collaborating with prestigious heritage fashion houses, sustainable fabric mills, and contemporary footwear ateliers globally.
            </p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-6 text-center">
            {PARTNER_BRANDS.map((brand, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D2] flex items-center justify-center font-serif text-base md:text-lg font-bold text-[#0A192F]/80 tracking-widest hover:text-[#1E3A8A] transition-colors"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. NEWSLETTER & FOOTER */}
      <footer className="border-t border-[#EAE3D2] bg-[#FAF8F5] pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-[#EAE3D2] pb-12">
            <div className="md:col-span-6 space-y-2">
              <h4 className="font-serif text-2xl md:text-3xl font-bold text-[#0A192F]">
                Sign up for Atelier Gazette
              </h4>
              <p className="text-xs text-[#0A192F]/70">
                Receive seasonal trend forecasting, chromatic lookbooks, and private atelier invitations.
              </p>
            </div>

            <div className="md:col-span-6">
              {emailSubscribed ? (
                <div className="p-4 rounded-2xl bg-[#1E3A8A]/10 border border-[#1E3A8A]/30 text-[#1E3A8A] font-mono text-xs flex items-center gap-2">
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
                    className="flex-1 px-5 py-3.5 rounded-full bg-white border border-[#EAE3D2] text-xs font-mono focus:outline-none focus:border-[#1E3A8A]"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3.5 rounded-full bg-[#1E3A8A] hover:bg-[#0A192F] text-white text-xs font-mono font-bold tracking-wider uppercase shrink-0 transition-all"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="border-t border-[#EAE3D2] pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#0A192F]/60 gap-4">
            <p>&copy; {new Date().getFullYear()} AuraStyle AI Atelier. Royal Blue &amp; Ivory Edition.</p>
            <div className="flex items-center gap-4">
              <span>VISA</span>
              <span>MASTERCARD</span>
              <span>AMEX</span>
              <span>APPLE PAY</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ADD ITEM MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FDFBF7] border border-[#EAE3D2] rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-2xl font-bold text-[#0A192F]">Add Wardrobe Piece</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#0A192F]/60 hover:text-[#0A192F] font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-[#0A192F]/70">Garment / Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Silk Royal Blue Blazer"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D2] text-xs font-mono focus:outline-none focus:border-[#1E3A8A]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-[#0A192F]/70">Category</label>
                <select
                  value={itemCategory}
                  onChange={(e) => setItemCategory(e.target.value as CollectionItem['category'])}
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D2] text-xs font-mono focus:outline-none focus:border-[#1E3A8A]"
                >
                  {CATEGORY_TABS.filter((c) => c !== 'All').map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-[#0A192F]/70">Primary Hue</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={itemColor}
                    onChange={(e) => setItemColor(e.target.value)}
                    className="w-12 h-10 rounded-xl cursor-pointer border border-[#EAE3D2] bg-transparent"
                  />
                  <input
                    type="text"
                    value={itemColor}
                    onChange={(e) => setItemColor(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D2] text-xs font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-[#1E3A8A] hover:bg-[#0A192F] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md mt-4"
              >
                Save to Wardrobe
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ITEM INSPECTION PREVIEW MODAL */}
      {selectedItemPreview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FDFBF7] border border-[#EAE3D2] rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#EAE3D2] pb-4">
              <span className="px-3 py-1 rounded-full bg-[#FAF8F5] text-[#1E3A8A] font-mono text-xs uppercase tracking-wider font-bold border border-[#EAE3D2]">
                {selectedItemPreview.category} &bull; ATELIER ARCHIVE
              </span>
              <button
                onClick={() => setSelectedItemPreview(null)}
                className="text-[#0A192F]/60 hover:text-[#0A192F] font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-2xl border border-black/10 shadow-md flex items-center justify-center text-2xl"
                  style={{ backgroundColor: selectedItemPreview.color || '#1E3A8A' }}
                />
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#0A192F]">
                    {selectedItemPreview.name}
                  </h3>
                  <p className="font-mono text-xs text-[#0A192F]/60">
                    Primary Tone: {selectedItemPreview.color || '#1E3A8A'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D2] space-y-2 text-xs font-mono text-[#0A192F]/75">
                <p><strong>Item ID:</strong> {selectedItemPreview.id}</p>
                <p><strong>Status:</strong> {selectedItemPreview.isFavorite ? '⭐️ Favorited Piece' : 'Standard Wardrobe Vault'}</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    toggleFavorite(selectedItemPreview.id);
                    setSelectedItemPreview(null);
                  }}
                  className="flex-1 py-3 rounded-2xl bg-[#FAF8F5] hover:bg-[#EAE3D2] text-[#0A192F] font-mono text-xs font-bold uppercase tracking-wider border border-[#EAE3D2]"
                >
                  {selectedItemPreview.isFavorite ? 'Remove Favorite' : 'Mark Favorite'}
                </button>
                <Link
                  href="/dashboard"
                  className="flex-1 py-3 rounded-2xl bg-[#1E3A8A] hover:bg-[#0A192F] text-white font-mono text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-1.5"
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
