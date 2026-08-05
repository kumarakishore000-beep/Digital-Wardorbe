'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Heart, Trash2, Search, Package, Star } from 'lucide-react';
import { useCollection, CollectionItem } from '@/hooks/useCollection';

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
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Add form state
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<CollectionItem['category']>('Jewelry');
  const [newColor, setNewColor] = useState('#8B5CF6');
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
    addItem({
      name: newName.trim(),
      category: newCategory,
      color: newColor,
      imageUrl: newImageUrl || undefined,
      tags: [],
    });
    onAddItem?.();
    setNewName('');
    setNewColor('#8B5CF6');
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-5xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-emerald-100 to-emerald-400">
          My Collection
        </h2>
        <p className="text-indigo-200/70 text-lg">
          {totalCount === 0
            ? 'Start building your digital wardrobe'
            : `${totalCount} item${totalCount !== 1 ? 's' : ''} in your collection`}
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {['All', ...CATEGORIES.slice(0, 4)].map(cat => {
          const count = cat === 'All' ? totalCount : (categoryCounts[cat] || 0);
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`p-3 rounded-2xl text-center transition-all duration-300 ${
                filter === cat
                  ? 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-transparent'
                  : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
              }`}
            >
              <div className="text-lg">{cat === 'All' ? '📦' : CATEGORY_ICONS[cat]}</div>
              <div className="text-xs font-medium mt-1">{cat}</div>
              <div className="text-lg font-bold">{count}</div>
            </button>
          );
        })}
      </div>

      {/* More categories */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.slice(4).map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              filter === cat
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border border-transparent'
                : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
            }`}
          >
            {CATEGORY_ICONS[cat]} {cat} ({categoryCounts[cat] || 0})
          </button>
        ))}
      </div>

      {/* Search + Add */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your collection..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-shadow"
        >
          {showAddForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
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
            <div className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 p-6 rounded-3xl border border-emerald-500/20 backdrop-blur-md space-y-5">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-400" />
                Add New Item
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-emerald-200">Item Name</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g., Silver Chain Necklace"
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-emerald-200">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as CollectionItem['category'])}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat} className="bg-slate-900">{CATEGORY_ICONS[cat]} {cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-emerald-200">Color</label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="color"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      className="w-12 h-12 rounded-xl cursor-pointer border border-white/20 bg-transparent"
                    />
                    <span className="text-sm font-mono text-white/70">{newColor}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-emerald-200">Image (optional)</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-black/30 border border-dashed border-white/20 rounded-xl px-4 py-3 text-white/50 text-sm hover:bg-white/5 hover:border-white/30 transition-colors"
                  >
                    {newImageUrl ? '✅ Image selected' : '📷 Click to upload image'}
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddItem}
                disabled={!newName.trim()}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  newName.trim()
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                    : 'bg-white/10 text-white/40 cursor-not-allowed'
                }`}
              >
                Add to Collection
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <div className="text-6xl">👗</div>
          <p className="text-xl text-white/50">
            {totalCount === 0 ? 'Your collection is empty' : 'No items match your filters'}
          </p>
          <p className="text-sm text-white/30">
            {totalCount === 0 ? 'Add items to start building your wardrobe!' : 'Try a different search or filter'}
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
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group hover:bg-white/10 transition-colors duration-300"
              >
                {/* Color/Image Preview */}
                <div
                  className="h-32 relative"
                  style={{
                    backgroundColor: item.color,
                    backgroundImage: item.imageUrl ? `url(${item.imageUrl})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-2 left-2">
                    <span className="text-lg">{CATEGORY_ICONS[item.category]}</span>
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => toggleFavorite(item.id)}
                      className={`p-1.5 rounded-lg backdrop-blur-md border transition-colors ${
                        item.isFavorite
                          ? 'bg-red-500/30 border-red-500/30 text-red-300'
                          : 'bg-black/30 border-white/20 text-white/70 hover:text-red-300'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${item.isFavorite ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 rounded-lg bg-black/30 backdrop-blur-md border border-white/20 text-white/70 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {item.isFavorite && (
                    <div className="absolute bottom-2 right-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3 space-y-1">
                  <p className="text-sm font-semibold text-white truncate">{item.name}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40">{item.category}</span>
                    <div
                      className="w-4 h-4 rounded-full border border-white/20"
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
  );
}
