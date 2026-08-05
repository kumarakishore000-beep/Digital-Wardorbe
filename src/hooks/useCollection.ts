'use client';

import { useState, useEffect, useCallback } from 'react';

export interface CollectionItem {
  id: string;
  name: string;
  category: 'Jewelry' | 'Shoes' | 'Watch' | 'Chain' | 'Bracelet' | 'Bag' | 'Hat' | 'Sunglasses' | 'Other';
  color: string;
  imageUrl?: string;
  isFavorite: boolean;
  addedAt: number;
  tags?: string[];
}

export interface WishlistItem {
  id: string;
  name: string;
  category: string;
  reason: string;
  addedAt: number;
}

const COLLECTION_KEY = 'stylematch-collection';
const WISHLIST_KEY = 'stylematch-wishlist';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.warn('Failed to save to localStorage');
  }
}

export function useCollection() {
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setItems(loadFromStorage<CollectionItem[]>(COLLECTION_KEY, []));
    setWishlist(loadFromStorage<WishlistItem[]>(WISHLIST_KEY, []));
    setIsLoaded(true);
  }, []);

  // Persist on change
  useEffect(() => {
    if (isLoaded) saveToStorage(COLLECTION_KEY, items);
  }, [items, isLoaded]);

  useEffect(() => {
    if (isLoaded) saveToStorage(WISHLIST_KEY, wishlist);
  }, [wishlist, isLoaded]);

  const addItem = useCallback((item: Omit<CollectionItem, 'id' | 'addedAt' | 'isFavorite'>): CollectionItem => {
    const newItem: CollectionItem = {
      ...item,
      id: generateId(),
      addedAt: Date.now(),
      isFavorite: false,
    };
    setItems(prev => [newItem, ...prev]);
    return newItem;
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  }, []);

  const getByCategory = useCallback(
    (category: CollectionItem['category']) => items.filter(item => item.category === category),
    [items]
  );

  const hasItem = useCallback(
    (name: string, category: string) =>
      items.some(
        item =>
          item.name.toLowerCase() === name.toLowerCase() &&
          item.category.toLowerCase() === category.toLowerCase()
      ),
    [items]
  );

  const addToWishlist = useCallback((item: Omit<WishlistItem, 'id' | 'addedAt'>): WishlistItem => {
    const newItem: WishlistItem = {
      ...item,
      id: generateId(),
      addedAt: Date.now(),
    };
    setWishlist(prev => [newItem, ...prev]);
    return newItem;
  }, []);

  const removeFromWishlist = useCallback((id: string) => {
    setWishlist(prev => prev.filter(item => item.id !== id));
  }, []);

  const categoryCounts = items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    items,
    wishlist,
    isLoaded,
    addItem,
    removeItem,
    toggleFavorite,
    getByCategory,
    hasItem,
    addToWishlist,
    removeFromWishlist,
    categoryCounts,
    totalCount: items.length,
    favoriteCount: items.filter(i => i.isFavorite).length,
  };
}
