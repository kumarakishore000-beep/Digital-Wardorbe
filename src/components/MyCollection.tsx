'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Heart, Trash2, Search, Package, Star } from 'lucide-react';
import { useCollection, CollectionItem } from '@/hooks/useCollection';
import { useAuth } from '@/hooks/useAuth';
import LoginModal from '@/components/LoginModal';

const CATEGORIES: CollectionItem['category'][] = [
  'Jewelry', 'Shoes', 'Watch', 'Chain', 'Bracelet', 'Bag', 'Hat', 'Sunglasses', 'Other',
];

const CATEGORY_ICONS: Record<string, string> = {
  Jewelry: '💍',
  Shoes: '👟',
  Watch: '⌚',
  Chain: '📿',
  Bracelet: '📿',
  Bag: '👜',
  Hat: '🎩',
  Sunglasses: '🕶️',
  Other: '✨',
};

interface MyCollectionProps {
  collection: ReturnType<typeof useCollection>;
  onAddItem?: () => void;
}

export default function MyCollection({ collection, onAddItem }: MyCollectionProps) {
  const { isAuthenticated } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Add form state
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<CollectionItem['category']>('Jewelry');
  const [newColor, setNewColor] = useState('#1e3a8a');
  const [newImageUrl, setNewImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { items, addItem, removeItem, toggleFavorite, totalCount, categoryCounts } = collection;

  const filteredItems = items.filter(item => {
    const matchesFilter = filter === 'All' || item.category === filter;
    const matchesSearch = !searchQuery || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAddItem = () => {
    if (!newName.trim()) return;
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    executeAddItem();
  };

  const executeAddItem = () => {
    if (!newName.trim()) return;
    addItem({
      name: newName.trim(),
      category: newCategory,
      color: newColor,
      imageUrl: newImageUrl || undefined,
      tags: [],
    });
    onAddItem?.();
    setNewName('');
    setNewColor('#1e3a8a');
    setNewImageUrl('');
    setShowAddForm(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setNewImageUrl(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => {
          executeAddItem();
        }}
        title="Sign In to Add to Collection"
        message="Sign in or create an account to save custom wardrobe items to your collection."
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl mx-auto space-y-8"
      >
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-5xl font-serif font-black tracking-tight text-[#FAF8F5]">
          My Digital Wardrobe
        </h2>
        <p className="text-sm md:text-base text-[#FAF8F5]/70">
          {totalCount === 0
            ? 'Start building your curated capsule wardrobe collection'
            : `${totalCount} curated piece${totalCount !== 1 ? 's' : ''} in your wardrobe`}
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {['All', ...CATEGORIES.slice(0, 4)].map(cat => {
          const count = cat === 'All' ? totalCount : (categoryCounts[cat] || 0);
          const isSelected = filter === cat;
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`p-3 rounded-2xl text-center transition-all duration-300 border ${
                isSelected
                  ? 'bg-[#FAF8F5] text-[#0a192f] border-[#FAF8F5] shadow-lg shadow-[#1e3a8a]/30 scale-102'
                  : 'bg-[#0f254e]/50 border-[#FAF8F5]/10 text-[#FAF8F5]/70 hover:bg-[#16366f]'
              }`}
            >
              <div className="text-lg">{cat === 'All' ? '📦' : CATEGORY_ICONS[cat]}</div>
              <div className="text-[11px] font-mono uppercase font-semibold mt-1">{cat}</div>
              <div className="text-lg font-bold">{count}</div>
            </button>
          );
        })}
      </div>

      {/* More categories */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.slice(4).map(cat => {
          const isSelected = filter === cat;
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-300 border ${
                isSelected
                  ? 'bg-[#FAF8F5] text-[#0a192f] border-[#FAF8F5]'
                  : 'bg-[#0f254e]/50 border-[#FAF8F5]/10 text-[#FAF8F5]/70 hover:bg-[#16366f]'
              }`}
            >
              {CATEGORY_ICONS[cat]} {cat} ({categoryCounts[cat] || 0})
            </button>
          );
        })}
      </div>

      {/* Search + Add */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FAF8F5]/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your pieces..."
            className="w-full bg-[#0f254e]/50 border border-[#FAF8F5]/15 rounded-2xl pl-11 pr-4 py-3 text-xs text-[#FAF8F5] placeholder:text-[#FAF8F5]/30 focus:outline-none focus:border-[#FAF8F5]/40"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-5 py-3 bg-[#FAF8F5] text-[#0a192f] rounded-2xl font-bold text-xs flex items-center gap-1.5 shadow-lg hover:bg-white transition-all"
        >
          {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4 text-[#1e3a8a]" />}
          {showAddForm ? 'Cancel' : 'Add Item'}
        </motion.button>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-[#0f254e]/80 p-6 rounded-3xl border border-[#FAF8F5]/20 backdrop-blur-md space-y-4 shadow-xl">
              <h3 className="text-base font-serif font-bold text-[#FAF8F5] flex items-center gap-2">
                <Package className="w-4 h-4 text-[#93c5fd]" />
                Add New Wardrobe Piece
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-[#FAF8F5]/70">Item Name</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g., Royal Blue Silk Blazer"
                    className="w-full bg-[#0a192f] border border-[#FAF8F5]/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-[#FAF8F5]/30 focus:outline-none focus:border-[#FAF8F5]/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-[#FAF8F5]/70">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as CollectionItem['category'])}
                    className="w-full bg-[#0a192f] border border-[#FAF8F5]/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FAF8F5]/40"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat} className="bg-[#0a192f]">{CATEGORY_ICONS[cat]} {cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-[#FAF8F5]/70">Color Accent</label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="color"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      className="w-10 h-10 rounded-xl cursor-pointer border border-[#FAF8F5]/20 bg-transparent"
                    />
                    <span className="text-xs font-mono text-[#FAF8F5]/80">{newColor}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-[#FAF8F5]/70">Photo (optional)</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-[#0a192f] border border-dashed border-[#FAF8F5]/20 rounded-xl px-3.5 py-2.5 text-[#FAF8F5]/60 text-xs hover:bg-[#16366f]/30 transition-colors"
                  >
                    {newImageUrl ? '✓ Photo selected' : '📷 Click to upload photo'}
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleAddItem}
                disabled={!newName.trim()}
                className={`w-full py-3 rounded-xl font-bold text-xs transition-all duration-300 ${
                  newName.trim()
                    ? 'bg-[#FAF8F5] text-[#0a192f] hover:bg-white shadow-lg'
                    : 'bg-[#FAF8F5]/20 text-[#FAF8F5]/40 cursor-not-allowed'
                }`}
              >
                Save to Wardrobe
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20 space-y-3 bg-[#0f254e]/30 rounded-3xl border border-[#FAF8F5]/10">
          <div className="text-5xl">👗</div>
          <p className="text-lg font-serif text-[#FAF8F5]">
            {totalCount === 0 ? 'Your digital wardrobe is empty' : 'No items match your search'}
          </p>
          <p className="text-xs text-[#FAF8F5]/50 font-mono">
            {totalCount === 0 ? 'Collect curated pieces from lookbooks above or add custom ones!' : 'Try clearing filters'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredItems.map(item => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -4 }}
                className="bg-[#0f254e]/50 border border-[#FAF8F5]/15 rounded-3xl overflow-hidden group hover:border-[#FAF8F5]/30 transition-all duration-300 shadow-md"
              >
                {/* Color/Image Preview */}
                <div
                  className="h-32 relative flex items-center justify-center"
                  style={{
                    backgroundColor: item.color,
                    backgroundImage: item.imageUrl ? `url(${item.imageUrl})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f]/80 to-transparent" />
                  <div className="absolute top-2.5 left-2.5 bg-[#FAF8F5] text-[#0a192f] w-7 h-7 rounded-lg flex items-center justify-center shadow">
                    <span className="text-sm">{CATEGORY_ICONS[item.category]}</span>
                  </div>
                  <div className="absolute top-2.5 right-2.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => toggleFavorite(item.id)}
                      className={`p-1.5 rounded-lg backdrop-blur-md border transition-colors ${
                        item.isFavorite
                          ? 'bg-[#FAF8F5] text-[#0a192f] border-[#FAF8F5]'
                          : 'bg-[#0a192f]/70 border-[#FAF8F5]/20 text-[#FAF8F5]'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${item.isFavorite ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 rounded-lg bg-[#0a192f]/70 backdrop-blur-md border border-[#FAF8F5]/20 text-[#FAF8F5] hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {item.isFavorite && (
                    <div className="absolute bottom-2 right-2">
                      <Star className="w-4 h-4 text-[#fffff0] fill-[#fffff0]" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3.5 space-y-1 bg-[#0a192f]">
                  <p className="text-xs font-bold text-[#FAF8F5] truncate">{item.name}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#FAF8F5]/60">{item.category}</span>
                    <div
                      className="w-3.5 h-3.5 rounded-full border border-[#FAF8F5]/30"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
    </>
  );
}
