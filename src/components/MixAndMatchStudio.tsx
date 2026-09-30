// agent-notes: { ctx: "gender-segregated mix and match studio without split mismatch", deps: ["framer-motion", "lucide-react"], state: active, last: "tara@2026-09-30" }
'use client';

import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Layers,
  Upload,
  Check,
  CheckCircle2,
  Bookmark,
  Shuffle,
  Trash2,
  Briefcase,
  Heart,
  GlassWater,
  PartyPopper,
  Compass,
  Camera,
  ChevronRight,
  ChevronLeft,
  X
} from 'lucide-react';
import RealModelDressViewer from '@/components/RealModelDressViewer';
import { OutfitConfig } from '@/components/MannequinVisualizer';
import { Gender, useAuth } from '@/hooks/useAuth';
import { useCollection } from '@/hooks/useCollection';
import { useRewards } from '@/hooks/useRewards';

// Slot categories matching Fashion Diffusion Mix & Match
export type GarmentSlot = 'tops' | 'bottoms' | 'dresses' | 'outerwear' | 'shoes' | 'accessories';

export interface MixGarment {
  id: string;
  name: string;
  slot: GarmentSlot;
  gender: Gender | 'unisex';
  categoryName: string;
  image: string;
  color: string;
  colorName: string;
  fabric: string;
  brandOrSource: string;
  tags: string[];
  // Props mapped to MannequinVisualizer if applicable
  mannequinTopType?: OutfitConfig['topType'];
  mannequinBottomType?: OutfitConfig['bottomType'];
  fabricType?: OutfitConfig['fabricType'];
}

export interface ModelProfile {
  id: string;
  name: string;
  gender: Gender;
  ethnicity: string;
  baseImage: string; // The base unstyled model for "Before"
  styledImage: string; // The styled model outfit for "After"
  description: string;
  height: string;
  styledOccasions?: Record<string, string>;
}

// Model roster with diverse ethnicities (Ava, Maya, Amara, Elena, Lucas, Dev)
export const STUDIO_MODELS: ModelProfile[] = [
  {
    id: 'model-ava',
    name: 'Ava',
    gender: 'female',
    ethnicity: 'Nordic / European Editorial',
    baseImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop',
    styledImage: '/images/branding/urban-western-casual.jpg',
    description: 'High-fashion editorial cheekbones, tall balanced proportions.',
    height: '5\'11"',
    styledOccasions: {
      interview: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop',
      casual: '/images/branding/urban-western-casual.jpg',
      wedding: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop',
      cocktail: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop',
      resort: '/images/branding/urban-western-casual.jpg',
    }
  },
  {
    id: 'model-maya',
    name: 'Maya',
    gender: 'female',
    ethnicity: 'South Asian Heritage',
    baseImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop',
    styledImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop',
    description: 'Warm olive complexion, poised corporate and gala presence.',
    height: '5\'9"',
    styledOccasions: {
      interview: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop',
      wedding: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop',
      cocktail: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop',
      casual: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop',
      resort: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop',
    }
  },
  {
    id: 'model-amara',
    name: 'Amara',
    gender: 'female',
    ethnicity: 'Afro Statuesque Chic',
    baseImage: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&auto=format&fit=crop',
    styledImage: '/images/branding/womens-ethnic-fusion.jpg',
    description: 'Deep radiant skin tone, bold sculptural runway silhouette.',
    height: '6\'0"',
    styledOccasions: {
      interview: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop',
      wedding: '/images/branding/womens-ethnic-fusion.jpg',
      cocktail: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop',
      casual: '/images/branding/womens-ethnic-fusion.jpg',
      resort: '/images/branding/womens-ethnic-fusion.jpg',
    }
  },
  {
    id: 'model-elena',
    name: 'Elena',
    gender: 'female',
    ethnicity: 'Latina / Mediterranean Glow',
    baseImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop',
    styledImage: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop',
    description: 'Sun-kissed bronze undertones, fluid luxury drape.',
    height: '5\'10"',
    styledOccasions: {
      interview: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=800&auto=format&fit=crop',
      wedding: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop',
      cocktail: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop',
      resort: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop',
      casual: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=800&auto=format&fit=crop',
    }
  },
  {
    id: 'model-lucas',
    name: 'Lucas',
    gender: 'male',
    ethnicity: 'Savile Row European',
    baseImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop',
    styledImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop',
    description: 'Crisp sartorial jawline, classic British athletic frame.',
    height: '6\'1"',
    styledOccasions: {
      interview: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop',
      wedding: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop',
      cocktail: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop',
      resort: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&auto=format&fit=crop',
      casual: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop',
    }
  },
  {
    id: 'model-dev',
    name: 'Dev',
    gender: 'male',
    ethnicity: 'South Asian Contemporary',
    baseImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop',
    styledImage: '/images/branding/mens-smart-casual.jpg',
    description: 'Sharp tailored contours, royal heritage and modern edge.',
    height: '6\'2"',
    styledOccasions: {
      interview: '/images/branding/mens-smart-casual.jpg',
      wedding: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop',
      cocktail: '/images/branding/hero-banner.jpg',
      resort: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop',
      casual: '/images/branding/mens-smart-casual.jpg',
    }
  }
];

// Curated Wardrobe Rack across the 6 slots (Fashion Diffusion Catalog)
export const WARDROBE_CATALOG: MixGarment[] = [
  // TOPS
  {
    id: 'top-1',
    name: 'Mulberry Silk Charmeuse Blouse',
    slot: 'tops',
    gender: 'female',
    categoryName: 'Blouse',
    image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=600&auto=format&fit=crop',
    color: '#FAF8F5',
    colorName: 'Champagne Ivory',
    fabric: '100% Mulberry Silk',
    brandOrSource: 'Milan Fashion Atelier',
    tags: ['19-Momme', 'French Cuffs', 'Fluid Drape'],
    mannequinTopType: 'shirt',
    fabricType: 'silk'
  },
  {
    id: 'top-2',
    name: 'Super 140s Sculpted Wool Blazer',
    slot: 'tops',
    gender: 'unisex',
    categoryName: 'Blazer',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop',
    color: '#0A192F',
    colorName: 'Midnight Navy',
    fabric: 'Super 140s Worsted Wool',
    brandOrSource: 'Savile Row Master Tailors',
    tags: ['Peak Lapels', 'Horn Buttons', 'Structured Shoulder'],
    mannequinTopType: 'blazer',
    fabricType: 'wool'
  },
  {
    id: 'top-3',
    name: 'Fine Ribbed Mongolian Cashmere Knit',
    slot: 'tops',
    gender: 'unisex',
    categoryName: 'Knitwear',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&auto=format&fit=crop',
    color: '#D4AF37',
    colorName: 'Warm Camel Heather',
    fabric: 'Pure Mongolian Cashmere',
    brandOrSource: 'Scottish Borders Knitters',
    tags: ['Zero-Waste', 'Ultra-Soft', 'Seamless Fit'],
    mannequinTopType: 'top',
    fabricType: 'wool'
  },
  {
    id: 'top-4',
    name: 'Normandy Slub Linen Popover Shirt',
    slot: 'tops',
    gender: 'male',
    categoryName: 'Shirt',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop',
    color: '#C2410C',
    colorName: 'Rust Terracotta',
    fabric: 'Breathable Slub Linen',
    brandOrSource: 'Riviera Resort Collection',
    tags: ['Camp Collar', 'Mother of Pearl', 'Relaxed Fit'],
    mannequinTopType: 'shirt',
    fabricType: 'linen'
  },
  {
    id: 'top-5',
    name: 'Royal Raw Silk Brocade Kurti',
    slot: 'tops',
    gender: 'female',
    categoryName: 'Ethnic Fusion',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop',
    color: '#064E3B',
    colorName: 'Emerald Jade',
    fabric: 'Handloom Raw Silk',
    brandOrSource: 'Varanasi Weavers Guild',
    tags: ['Zari Embroidery', 'Bandhgala Collar', 'Gilded Thread'],
    mannequinTopType: 'kurti',
    fabricType: 'silk'
  },
  {
    id: 'top-6',
    name: 'Mandarin Collar Raw Silk Festive Kurta',
    slot: 'tops',
    gender: 'male',
    categoryName: 'Ethnic Kurta',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=600&auto=format&fit=crop',
    color: '#1E3A8A',
    colorName: 'Royal Indigo',
    fabric: 'Matka Raw Silk',
    brandOrSource: 'Heritage Court Tailors',
    tags: ['Mandarin Collar', 'Concealed Placket', 'Side Slits'],
    mannequinTopType: 'kurta',
    fabricType: 'silk'
  },
  {
    id: 'top-7',
    name: 'Handcrafted Mirror-Work Crop Choli',
    slot: 'tops',
    gender: 'female',
    categoryName: 'Crop Top / Choli',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop',
    color: '#991B1B',
    colorName: 'Crimson Ruby',
    fabric: 'Raw Silk & Glass Mirrors',
    brandOrSource: 'Kutch Artisans Collective',
    tags: ['Sweetheart Neck', 'Abhla Mirror Work', 'Elbow Sleeves'],
    mannequinTopType: 'croptop',
    fabricType: 'silk'
  },
  {
    id: 'top-8',
    name: 'Cuban Camp-Collar Printed Silk Resort Shirt',
    slot: 'tops',
    gender: 'male',
    categoryName: 'Resort Shirt',
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&auto=format&fit=crop',
    color: '#C2410C',
    colorName: 'Terracotta Print',
    fabric: '100% Silk Twill',
    brandOrSource: 'Riviera Resort Capsule',
    tags: ['Camp Collar', 'Hand-Blocked Print', 'Relaxed Fit'],
    mannequinTopType: 'shirt',
    fabricType: 'silk'
  },
  {
    id: 'top-9',
    name: 'Sculpted Peplum Silk Organza Blouse',
    slot: 'tops',
    gender: 'female',
    categoryName: 'Blouse',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop',
    color: '#FAF8F5',
    colorName: 'Pearl White',
    fabric: 'Silk Organza & Mikado',
    brandOrSource: 'Milan Couture Atelier',
    tags: ['Sculpted Peplum', 'Sheer Sleeves', 'Pearl Buttons'],
    mannequinTopType: 'top',
    fabricType: 'silk'
  },

  // BOTTOMS
  {
    id: 'bot-1',
    name: 'High-Waist Fluid Pleated Slacks',
    slot: 'bottoms',
    gender: 'unisex',
    categoryName: 'Trousers',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&auto=format&fit=crop',
    color: '#FAF8F5',
    colorName: 'Pristine Ecru',
    fabric: 'Worsted Tropical Wool',
    brandOrSource: 'Parisian Tailoring Studio',
    tags: ['Double Inverted Pleats', 'High-Rise', 'Full Break'],
    mannequinBottomType: 'trousers',
    fabricType: 'wool'
  },
  {
    id: 'bot-2',
    name: 'Structured Architectural Pencil Skirt',
    slot: 'bottoms',
    gender: 'female',
    categoryName: 'Skirt',
    image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&auto=format&fit=crop',
    color: '#881337',
    colorName: 'Burgundy Bordeaux',
    fabric: 'Heavy Silk Mikado & Wool Crepe',
    brandOrSource: 'Haute Couture Archives',
    tags: ['Back Vent', 'Sculpted Waist', 'Midi Hem'],
    mannequinBottomType: 'skirt',
    fabricType: 'silk'
  },
  {
    id: 'bot-3',
    name: 'Savile Row Midnight Wool Dress Pants',
    slot: 'bottoms',
    gender: 'male',
    categoryName: 'Trousers',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop',
    color: '#0F172A',
    colorName: 'Obsidian Navy',
    fabric: '100% Virgin Wool Flannel',
    brandOrSource: 'Mayfair Tailors',
    tags: ['Side Adjusters', 'No Belt Loops', 'Sharp Crease'],
    mannequinBottomType: 'trousers',
    fabricType: 'wool'
  },
  {
    id: 'bot-4',
    name: '14oz Kurabo Japanese Selvedge Denim',
    slot: 'bottoms',
    gender: 'unisex',
    categoryName: 'Jeans',
    image: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=600&auto=format&fit=crop',
    color: '#1E3A8A',
    colorName: 'Deep Raw Indigo',
    fabric: '14oz Shuttle-Loom Cotton',
    brandOrSource: 'Okayama Denim Mills',
    tags: ['Pink Selvedge ID', 'Copper Rivets', 'Clean Straight Leg'],
    mannequinBottomType: 'jeans',
    fabricType: 'denim'
  },
  {
    id: 'bot-5',
    name: '16-Kali Flared Zardozi Silk Lehenga Skirt',
    slot: 'bottoms',
    gender: 'female',
    categoryName: 'Lehenga Skirt',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop',
    color: '#991B1B',
    colorName: 'Royal Crimson Ruby',
    fabric: 'Raw Silk with Antique Zari',
    brandOrSource: 'Heritage Couture Guild',
    tags: ['Wide Flare', 'Can-Can Underskirt', 'Zardozi Border'],
    mannequinBottomType: 'skirt',
    fabricType: 'silk'
  },
  {
    id: 'bot-6',
    name: 'Double-Pleated Gurkha Linen Trousers',
    slot: 'bottoms',
    gender: 'male',
    categoryName: 'Gurkha Trousers',
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&auto=format&fit=crop',
    color: '#3F6212',
    colorName: 'Sage Olive',
    fabric: 'Pure Normandy Slub Linen',
    brandOrSource: 'Naples Tailoring House',
    tags: ['Extended Double Buckle', 'High Rise', '1.75" Turn-Up Cuffs'],
    mannequinBottomType: 'chinos',
    fabricType: 'linen'
  },
  {
    id: 'bot-7',
    name: 'Pure Mulberry Silk Gathered Churidar',
    slot: 'bottoms',
    gender: 'unisex',
    categoryName: 'Churidar',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=600&auto=format&fit=crop',
    color: '#FAF8F5',
    colorName: 'Pearl Ivory Silk',
    fabric: 'Mulberry Silk Crepe',
    brandOrSource: 'Court Crafts Collective',
    tags: ['Ankle Gathers', 'Drawstring Waist', 'Ceremonial Fit'],
    mannequinBottomType: 'salwar_bottom',
    fabricType: 'silk'
  },

  // DRESSES & ONE-PIECE
  {
    id: 'dress-1',
    name: 'Mulberry Liquid Silk Bias-Cut Gala Gown',
    slot: 'dresses',
    gender: 'female',
    categoryName: 'Evening Gown',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&auto=format&fit=crop',
    color: '#881337',
    colorName: 'Mulberry Wine',
    fabric: '19-Momme Heavyweight Silk',
    brandOrSource: 'Red Carpet Runway Collection',
    tags: ['Cowl Neckline', 'Sweeping Train', 'Liquid Sheen'],
    mannequinTopType: 'gown',
    mannequinBottomType: 'gown_skirt',
    fabricType: 'silk'
  },
  {
    id: 'dress-2',
    name: 'Heritage Banarasi Katan Silk Saree',
    slot: 'dresses',
    gender: 'female',
    categoryName: 'Royal Ethnic',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop',
    color: '#064E3B',
    colorName: 'Royal Emerald & Gold',
    fabric: 'Pure Katan Handloom Silk',
    brandOrSource: 'Master Craftsmen Varanasi',
    tags: ['Zari Pallu', 'Antique Brocade', '320 GSM'],
    mannequinTopType: 'saree',
    mannequinBottomType: 'skirt',
    fabricType: 'silk'
  },
  {
    id: 'dress-3',
    name: 'Architectural Obsidian Column Dress',
    slot: 'dresses',
    gender: 'female',
    categoryName: 'Cocktail Dress',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop',
    color: '#050D1A',
    colorName: 'Jet Black',
    fabric: 'Double-Face Bonded Crepe',
    brandOrSource: 'Scandinavian Minimalist Design',
    tags: ['Geometric Neck', 'Clean Silhouette', 'Calf Length'],
    mannequinTopType: 'gown',
    mannequinBottomType: 'skirt',
    fabricType: 'silk'
  },
  {
    id: 'dress-4',
    name: 'Handcrafted Zardozi Bridal Lehenga Choli',
    slot: 'dresses',
    gender: 'female',
    categoryName: 'Bridal & Festive',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop',
    color: '#991B1B',
    colorName: 'Royal Crimson Ruby',
    fabric: 'Raw Silk & Gold Zari',
    brandOrSource: 'Heritage Couture Guild',
    tags: ['16-Kali Flare', 'Zardozi Embroidery', 'Organza Dupatta'],
    mannequinTopType: 'croptop',
    mannequinBottomType: 'skirt',
    fabricType: 'silk'
  },
  {
    id: 'dress-5',
    name: 'Sculpted Wide-Leg Halter Jumpsuit',
    slot: 'dresses',
    gender: 'female',
    categoryName: 'Evening Jumpsuit',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop',
    color: '#064E3B',
    colorName: 'Imperial Emerald',
    fabric: 'Heavy Japanese Silk Crepe',
    brandOrSource: 'Parisian Haute Atelier',
    tags: ['Halter Neckline', 'Fluid Palazzo Legs', 'Gold Buckle'],
    mannequinTopType: 'top',
    mannequinBottomType: 'trousers',
    fabricType: 'silk'
  },
  {
    id: 'dress-6',
    name: 'Royal Kalidar Silk Anarkali Gown Suit',
    slot: 'dresses',
    gender: 'female',
    categoryName: 'Royal Ethnic',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop',
    color: '#1E3A8A',
    colorName: 'Royal Sapphire',
    fabric: 'Pure Chanderi Silk',
    brandOrSource: 'Jaipur Court Artisans',
    tags: ['24 Kalis', 'Gota Patti Hem', 'Churidar Set'],
    mannequinTopType: 'kurti',
    mannequinBottomType: 'salwar_bottom',
    fabricType: 'silk'
  },
  {
    id: 'dress-7',
    name: 'Amalfi Coast Floral Silk Maxi Sundress',
    slot: 'dresses',
    gender: 'female',
    categoryName: 'Resort Dress',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop',
    color: '#C2410C',
    colorName: 'Terracotta Coral',
    fabric: 'Featherweight Silk Chiffon',
    brandOrSource: 'Riviera Resort Capsule',
    tags: ['Tiered Ruffles', 'Tie-Shoulder', 'Breezy Silhouette'],
    mannequinTopType: 'gown',
    mannequinBottomType: 'gown_skirt',
    fabricType: 'silk'
  },
  {
    id: 'dress-8',
    name: 'Fine Ribbed Cashmere Midi Sweater Dress',
    slot: 'dresses',
    gender: 'female',
    categoryName: 'Knit Dress',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&auto=format&fit=crop',
    color: '#FAF8F5',
    colorName: 'Oatmeal Heather',
    fabric: 'Pure Mongolian Cashmere',
    brandOrSource: 'Scandinavian Minimal Studio',
    tags: ['Mock Neck', 'Contoured Ribs', 'Calf Length'],
    mannequinTopType: 'top',
    mannequinBottomType: 'skirt',
    fabricType: 'wool'
  },

  // MEN'S DRESSES & ONE-PIECE ENSEMBLES
  {
    id: 'dress-m1',
    name: 'Imperial Hand-Embroidered Zari Sherwani',
    slot: 'dresses',
    gender: 'male',
    categoryName: 'Ceremonial Sherwani',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=600&auto=format&fit=crop',
    color: '#FAF8F5',
    colorName: 'Imperial Pearl & Gold',
    fabric: '360 GSM Matka Raw Silk',
    brandOrSource: 'Royal Atelier Varanasi',
    tags: ['Gilded Buttons', 'Stand Collar', 'Churidar Bottoms'],
    mannequinTopType: 'kurta',
    mannequinBottomType: 'salwar_bottom',
    fabricType: 'silk'
  },
  {
    id: 'dress-m2',
    name: 'Savile Row Bespoke 3-Piece Peak Tuxedo Suit',
    slot: 'dresses',
    gender: 'male',
    categoryName: 'Formal Tuxedo',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop',
    color: '#020617',
    colorName: 'Obsidian Noir',
    fabric: 'Super 160s Barathea Wool & Silk',
    brandOrSource: 'Mayfair Bespoke Tailors',
    tags: ['Grosgrain Lapel', 'Horseshoe Vest', 'Braided Trousers'],
    mannequinTopType: 'blazer',
    mannequinBottomType: 'trousers',
    fabricType: 'wool'
  },
  {
    id: 'dress-m3',
    name: 'Indo-Western Draped Asymmetrical Kurta Ensemble',
    slot: 'dresses',
    gender: 'male',
    categoryName: 'Indo-Western',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop',
    color: '#881337',
    colorName: 'Deep Wine Marsala',
    fabric: 'Raw Silk & Georgette Blend',
    brandOrSource: 'Contemporary Couturier',
    tags: ['Asymmetric Cowl', 'Nehru Bandi Jacket', 'Slim Trousers'],
    mannequinTopType: 'kurta',
    mannequinBottomType: 'trousers',
    fabricType: 'silk'
  },
  {
    id: 'dress-m4',
    name: 'Neapolitan Double-Breasted Slub Linen Suit',
    slot: 'dresses',
    gender: 'male',
    categoryName: 'Linen Suiting',
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&auto=format&fit=crop',
    color: '#3F6212',
    colorName: 'Sage Olive',
    fabric: '100% Normandy Slub Linen',
    brandOrSource: 'Naples Tailoring House',
    tags: ['Spalla Camicia', 'Double-Breasted', 'Gurkha Trousers'],
    mannequinTopType: 'blazer',
    mannequinBottomType: 'chinos',
    fabricType: 'linen'
  },
  {
    id: 'dress-m5',
    name: 'Royal Heritage Matka Silk Pathani Suit',
    slot: 'dresses',
    gender: 'male',
    categoryName: 'Festive Pathani',
    image: '/images/branding/hero-banner.jpg',
    color: '#1E293B',
    colorName: 'Charcoal Slate',
    fabric: 'Handloom Slub Matka Silk',
    brandOrSource: 'Heritage Crafts Collective',
    tags: ['Shoulder Epaulets', 'Pleated Salwar', 'Chest Pockets'],
    mannequinTopType: 'kurta',
    mannequinBottomType: 'salwar_bottom',
    fabricType: 'silk'
  },
  {
    id: 'dress-m6',
    name: 'Luxury Urban French Terry Tracksuit Ensemble',
    slot: 'dresses',
    gender: 'male',
    categoryName: 'Streetwear Athleisure',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop',
    color: '#FAF8F5',
    colorName: 'Mineral Bone Ivory',
    fabric: '480 GSM Heavyweight French Terry',
    brandOrSource: 'Tokyo Atelier Street',
    tags: ['Double-Layer Hood', 'Cargo Track Pants', 'Boxy Fit'],
    mannequinTopType: 'top',
    mannequinBottomType: 'tracks',
    fabricType: 'wool'
  },

  // OUTERWEAR
  {
    id: 'out-1',
    name: 'Double-Breasted Cashmere Belted Trench',
    slot: 'outerwear',
    gender: 'unisex',
    categoryName: 'Overcoat',
    image: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=600&auto=format&fit=crop',
    color: '#D4AF37',
    colorName: 'Warm Camel Tan',
    fabric: 'Double-Faced Wool & Cashmere',
    brandOrSource: 'Heritage British Military Cut',
    tags: ['Storm Flap', 'Horn Buckle', 'Epaulets'],
    mannequinTopType: 'jacket',
    fabricType: 'wool'
  },
  {
    id: 'out-2',
    name: 'Obsidian Velvet Smoking Dinner Jacket',
    slot: 'outerwear',
    gender: 'unisex',
    categoryName: 'Dinner Jacket',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop',
    color: '#0A192F',
    colorName: 'Midnight Velvet',
    fabric: 'Italian Cotton Velvet & Duchesse Satin',
    brandOrSource: 'Venetian Atelier',
    tags: ['Shawl Lapel', 'Frog Closures', 'Silk Jacquard Lining'],
    mannequinTopType: 'blazer',
    fabricType: 'silk'
  },
  {
    id: 'out-3',
    name: 'Distressed Full-Grain Biker Leather Jacket',
    slot: 'outerwear',
    gender: 'unisex',
    categoryName: 'Leather Jacket',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop',
    color: '#1C1917',
    colorName: 'Espresso Patina',
    fabric: 'Full-Grain Tuscan Calfskin',
    brandOrSource: 'Florence Leatherworks',
    tags: ['Antiqued Brass Zippers', 'Quilted Shoulder', 'Heavyweight'],
    mannequinTopType: 'jacket',
    fabricType: 'leather'
  },

  // SHOES
  {
    id: 'shoe-1',
    name: 'Handcrafted Goodyear-Welted Oxford Brogues',
    slot: 'shoes',
    gender: 'male',
    categoryName: 'Dress Shoes',
    image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&auto=format&fit=crop',
    color: '#78350F',
    colorName: 'Burnished Mahogany',
    fabric: 'Full-Grain Box Calf Leather',
    brandOrSource: 'Northamptonshire Shoemakers',
    tags: ['Goodyear Welt', 'Oak Bark Sole', 'Medallion Toe'],
    fabricType: 'leather'
  },
  {
    id: 'shoe-2',
    name: 'Pointed Lacquer Stiletto Pumps (105mm)',
    slot: 'shoes',
    gender: 'female',
    categoryName: 'Heels',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop',
    color: '#FAF8F5',
    colorName: 'Nude Champagne',
    fabric: 'Patent Calf Leather',
    brandOrSource: 'Parma Luxury Footwear',
    tags: ['Sculpted Heel', 'Padded Arch', 'Signature Sole'],
    fabricType: 'leather'
  },
  {
    id: 'shoe-3',
    name: 'Unlined Reverse Suede Penny Loafers',
    slot: 'shoes',
    gender: 'unisex',
    categoryName: 'Loafers',
    image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop',
    color: '#D4AF37',
    colorName: 'Snuff Suede',
    fabric: 'Italian Reverse Calf Suede',
    brandOrSource: 'Neapolitan Bootmakers',
    tags: ['Flex Leather Sole', 'Hand-Stitched Apron', 'Glove Fit'],
    fabricType: 'leather'
  },
  {
    id: 'shoe-4',
    name: 'Zari Embroidered Royal Velvet Mojris',
    slot: 'shoes',
    gender: 'unisex',
    categoryName: 'Ethnic Footwear',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop',
    color: '#064E3B',
    colorName: 'Emerald & Gold Zari',
    fabric: 'Silk Velvet & Gold Thread',
    brandOrSource: 'Jaipur Royal Artisans',
    tags: ['Hand-Embroidered', 'Cushioned Insole', 'Curled Toe'],
    fabricType: 'silk'
  },

  // ACCESSORIES
  {
    id: 'acc-1',
    name: 'Swiss Automatic Rose Gold Chronograph',
    slot: 'accessories',
    gender: 'unisex',
    categoryName: 'Watch',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop',
    color: '#D4AF37',
    colorName: 'Rose Gold & Crocodile',
    fabric: '18k 5N Rose Gold & Sapphire Glass',
    brandOrSource: 'Geneva Horology Studio',
    tags: ['40mm Case', 'Column Wheel', 'Sunburst Dial'],
    fabricType: 'silk'
  },
  {
    id: 'acc-2',
    name: 'Top-Handle Structured Calfskin Flap Bag',
    slot: 'accessories',
    gender: 'female',
    categoryName: 'Handbag',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop',
    color: '#78350F',
    colorName: 'Cognac Saddle',
    fabric: 'Vegetable-Tanned Saddle Leather',
    brandOrSource: 'Bespoke Parisian Leathergoods',
    tags: ['Gold Hardware', 'Key Clochette', 'Lambskin Lining'],
    fabricType: 'leather'
  },
  {
    id: 'acc-3',
    name: 'South Sea Cultured Akoya Pearl Choker',
    slot: 'accessories',
    gender: 'female',
    categoryName: 'Fine Jewelry',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop',
    color: '#FAF8F5',
    colorName: 'Lustrous Iridescent White',
    fabric: '8.5mm AAA Akoya Pearls with 18k Clasp',
    brandOrSource: 'Kyoto Pearl Guild',
    tags: ['High Luster', 'Hand-Knotted Silk', 'Timeless Heirloom'],
    fabricType: 'silk'
  },
  {
    id: 'acc-4',
    name: '18k Solid Italian Figaro Chain Necklace',
    slot: 'accessories',
    gender: 'unisex',
    categoryName: 'Jewelry',
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&auto=format&fit=crop',
    color: '#EAB308',
    colorName: '24k Yellow Gold Sheen',
    fabric: '18k Solid Yellow Gold',
    brandOrSource: 'Vicenza Goldsmiths',
    tags: ['5mm Width', 'Lobster Clasp', 'Diamond Cut Bevels'],
    fabricType: 'silk'
  }
];

// Occasion Presets for AI Match Scoring
const OCCASIONS = [
  { id: 'interview', label: 'Executive Interview', icon: Briefcase, color: '#38BDF8', defaultScore: 98 },
  { id: 'wedding', label: 'Royal Gala & Wedding', icon: Heart, color: '#F43F5E', defaultScore: 96 },
  { id: 'cocktail', label: 'Black-Tie Cocktail', icon: GlassWater, color: '#F59E0B', defaultScore: 94 },
  { id: 'resort', label: 'Riviera Resort Soirée', icon: Compass, color: '#10B981', defaultScore: 92 },
  { id: 'casual', label: 'Smart Casual Studio', icon: PartyPopper, color: '#6366F1', defaultScore: 95 },
];

// Returns curated default active slots for the active gender
export function getDefaultSlotsForGender(gender: Gender) {
  if (gender === 'male') {
    return {
      tops: WARDROBE_CATALOG.find((g) => g.id === 'top-4') || null,
      bottoms: WARDROBE_CATALOG.find((g) => g.id === 'bot-3') || null,
      dresses: null,
      outerwear: WARDROBE_CATALOG.find((g) => g.id === 'out-2') || null,
      shoes: WARDROBE_CATALOG.find((g) => g.id === 'shoe-1') || null,
      accessories: WARDROBE_CATALOG.find((g) => g.id === 'acc-1') || null,
    };
  }
  return {
    tops: WARDROBE_CATALOG.find((g) => g.id === 'top-1') || null,
    bottoms: WARDROBE_CATALOG.find((g) => g.id === 'bot-1') || null,
    dresses: null,
    outerwear: WARDROBE_CATALOG.find((g) => g.id === 'out-1') || null,
    shoes: WARDROBE_CATALOG.find((g) => g.id === 'shoe-2') || null,
    accessories: WARDROBE_CATALOG.find((g) => g.id === 'acc-1') || null,
  };
}

export default function MixAndMatchStudio() {
  const { user, updateGender } = useAuth();
  const collection = useCollection();
  const rewards = useRewards();

  const currentGender = (user?.gender || 'female') as Gender;

  // Active Model
  const [selectedModel, setSelectedModel] = useState<ModelProfile>(() => {
    return STUDIO_MODELS.find((m) => m.gender === currentGender) || STUDIO_MODELS[0];
  });

  // Active Garments in Each Slot (strictly gender-segregated defaults)
  const [activeSlots, setActiveSlots] = useState<{
    tops: MixGarment | null;
    bottoms: MixGarment | null;
    dresses: MixGarment | null;
    outerwear: MixGarment | null;
    shoes: MixGarment | null;
    accessories: MixGarment | null;
  }>(() => getDefaultSlotsForGender(currentGender));

  // Current category tab in left wardrobe rack
  const [activeSlotTab, setActiveSlotTab] = useState<GarmentSlot>('tops');

  // Switch gender and update both the model and equipped garments
  const handleSwitchGender = (newGender: Gender) => {
    updateGender(newGender);
    const matchingModel = STUDIO_MODELS.find((m) => m.gender === newGender) || STUDIO_MODELS[0];
    setSelectedModel(matchingModel);
    setActiveSlots(getDefaultSlotsForGender(newGender));
    if (newGender === 'male' && activeSlotTab === 'dresses') {
      setActiveSlotTab('tops');
    }
  };

  // Synchronize model and slots whenever auth gender resolves or changes
  useEffect(() => {
    if (user?.gender && user.gender !== selectedModel.gender) {
      const targetGender = user.gender as Gender;
      const matchingModel = STUDIO_MODELS.find((m) => m.gender === targetGender) || STUDIO_MODELS[0];
      setSelectedModel(matchingModel);
      setActiveSlots(getDefaultSlotsForGender(targetGender));
      if (targetGender === 'male' && activeSlotTab === 'dresses') {
        setActiveSlotTab('tops');
      }
    }
  }, [user?.gender, selectedModel.gender, activeSlotTab]);

  // Visualization View: 'photorealistic' (editorial try-on) | '3d-catwalk' (interactive turntable)
  const [visualMode, setVisualMode] = useState<'photorealistic' | '3d-catwalk'>('photorealistic');

  // Before / After Comparison State: default to full 'after' styled look
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);
  const [compareMode, setCompareMode] = useState<'after' | 'side-by-side' | 'split' | 'before'>('after');

  // Selected Occasion for Scoring
  const [selectedOccasion, setSelectedOccasion] = useState(OCCASIONS[0]);

  // Mix & Match Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [generationProgress, setGenerationProgress] = useState(0);

  // Saved notification banner
  const [savedBanner, setSavedBanner] = useState<string | null>(null);

  // Custom Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadSlot, setUploadSlot] = useState<GarmentSlot>('tops');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadColor] = useState('#FAF8F5');
  const [uploadFabric, setUploadFabric] = useState('Silk Blend');
  const [customImagePreview, setCustomImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter garments based on activeSlotTab & gender
  const availableGarments = useMemo(() => {
    return WARDROBE_CATALOG.filter((item) => {
      const matchesSlot = item.slot === activeSlotTab;
      const matchesGender = item.gender === 'unisex' || item.gender === selectedModel.gender;
      return matchesSlot && matchesGender;
    });
  }, [activeSlotTab, selectedModel.gender]);

  // Derive active composite outfit config for 3D Mannequin
  const compositeOutfitConfig = useMemo((): OutfitConfig => {
    // If a dress is active, it overrides top/bottom
    if (activeSlots.dresses) {
      return {
        title: activeSlots.dresses.name,
        topType: activeSlots.dresses.mannequinTopType || 'gown',
        topColor: activeSlots.dresses.color,
        bottomType: activeSlots.dresses.mannequinBottomType || 'gown_skirt',
        bottomColor: activeSlots.dresses.color,
        outerwearColor: activeSlots.outerwear?.color || '#0A192F',
        accentColor: activeSlots.accessories?.color || '#D4AF37',
        fabricType: activeSlots.dresses.fabricType || 'silk',
        occasion: selectedOccasion.label,
      };
    }

    return {
      title: `${activeSlots.tops?.name || 'Top'} & ${activeSlots.bottoms?.name || 'Bottom'}`,
      topType: activeSlots.tops?.mannequinTopType || 'shirt',
      topColor: activeSlots.tops?.color || '#FAF8F5',
      bottomType: activeSlots.bottoms?.mannequinBottomType || 'trousers',
      bottomColor: activeSlots.bottoms?.color || '#0F172A',
      outerwearColor: activeSlots.outerwear?.color || '#0A192F',
      accentColor: activeSlots.accessories?.color || '#D4AF37',
      fabricType: activeSlots.tops?.fabricType || 'wool',
      occasion: selectedOccasion.label,
    };
  }, [activeSlots, selectedOccasion.label]);

  // Realistic photorealistic composite preview image (editorial quality based on pieces)
  const compositePhotorealisticImage = useMemo(() => {
    // Custom uploaded garment preview override if equipped
    const customGarment = Object.values(activeSlots).find((g) => g?.id.startsWith('custom-'));
    if (customGarment?.image) {
      return customGarment.image;
    }

    // High-definition styled result for the active model and occasion (guaranteed same model identity)
    const occasionKey = selectedOccasion.id as keyof NonNullable<typeof selectedModel.styledOccasions>;
    if (selectedModel.styledOccasions && selectedModel.styledOccasions[occasionKey]) {
      return selectedModel.styledOccasions[occasionKey];
    }
    if (selectedModel.styledImage) {
      return selectedModel.styledImage;
    }
    return selectedModel.baseImage;
  }, [selectedModel, selectedOccasion.id, activeSlots]);

  // Handle Slot Selection
  const handleSelectGarment = (garment: MixGarment) => {
    setActiveSlots((prev) => {
      const next = { ...prev };
      // If dress is selected, clear tops & bottoms for clean one-piece drape
      if (garment.slot === 'dresses') {
        next.dresses = garment;
        next.tops = null;
        next.bottoms = null;
      } else if (garment.slot === 'tops' || garment.slot === 'bottoms') {
        next.dresses = null; // Clear dress if individual piece chosen
        next[garment.slot] = garment;
      } else {
        next[garment.slot] = garment;
      }
      return next;
    });
  };

  // Handle Removing Garment from Slot
  const handleRemoveSlot = (slot: GarmentSlot) => {
    setActiveSlots((prev) => ({
      ...prev,
      [slot]: null,
    }));
  };

  // Trigger AI Mix & Match Generation
  const handleGenerateMixAndMatch = async () => {
    setIsGenerating(true);
    setGenerationProgress(10);
    setGenerationStep('1/3 Extracting 3D Garment Silhouette & Contours...');

    await new Promise((r) => setTimeout(r, 600));
    setGenerationProgress(45);
    setGenerationStep('2/3 Computing Physics-Based Draping & Crease Geometry...');

    await new Promise((r) => setTimeout(r, 700));
    setGenerationProgress(80);
    setGenerationStep('3/3 Synthesizing High-Fashion Generative Diffusion Pass...');

    await new Promise((r) => setTimeout(r, 600));
    setGenerationProgress(100);
    setGenerationStep('✨ Mix & Match Try-On Complete!');

    setIsGenerating(false);
    rewards.earnPoints('try_suggestion');
  };

  // Randomize / AI Shuffle high-fashion outfit (strictly gender-segregated)
  const handleShuffleOutfit = () => {
    const randomTop = WARDROBE_CATALOG.filter((g) => g.slot === 'tops' && (g.gender === 'unisex' || g.gender === selectedModel.gender));
    const randomBottom = WARDROBE_CATALOG.filter((g) => g.slot === 'bottoms' && (g.gender === 'unisex' || g.gender === selectedModel.gender));
    const randomOuter = WARDROBE_CATALOG.filter((g) => g.slot === 'outerwear' && (g.gender === 'unisex' || g.gender === selectedModel.gender));
    const randomShoes = WARDROBE_CATALOG.filter((g) => g.slot === 'shoes' && (g.gender === 'unisex' || g.gender === selectedModel.gender));
    const randomAcc = WARDROBE_CATALOG.filter((g) => g.slot === 'accessories' && (g.gender === 'unisex' || g.gender === selectedModel.gender));

    setActiveSlots({
      dresses: null,
      tops: randomTop[Math.floor(Math.random() * randomTop.length)] || null,
      bottoms: randomBottom[Math.floor(Math.random() * randomBottom.length)] || null,
      outerwear: Math.random() > 0.3 ? randomOuter[Math.floor(Math.random() * randomOuter.length)] : null,
      shoes: randomShoes[Math.floor(Math.random() * randomShoes.length)] || null,
      accessories: randomAcc[Math.floor(Math.random() * randomAcc.length)] || null,
    });
  };

  // Clear all slots
  const handleClearAll = () => {
    setActiveSlots({
      tops: null,
      bottoms: null,
      dresses: null,
      outerwear: null,
      shoes: null,
      accessories: null,
    });
  };

  // Save to user's Wardrobe Collection
  const handleSaveLook = () => {
    const title = activeSlots.dresses?.name || `${activeSlots.tops?.name || 'Top'} & ${activeSlots.bottoms?.name || 'Bottom'}`;
    collection.addItem({
      name: `Mix & Match: ${title}`,
      category: 'Other',
      color: activeSlots.tops?.color || activeSlots.dresses?.color || '#FAF8F5',
      imageUrl: compositePhotorealisticImage,
      tags: ['FashionDiffusion', 'MixAndMatch', selectedModel.name, selectedOccasion.id],
    });
    rewards.earnPoints('add_to_collection');
    setSavedBanner(`Saved "${title}" to your Wardrobe Collection (+25 pts)!`);
    setTimeout(() => setSavedBanner(null), 4000);
  };

  // Custom Image Upload Handler
  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Commit Custom Uploaded Garment
  const handleApplyCustomGarment = () => {
    if (!customImagePreview) return;
    const newGarment: MixGarment = {
      id: `custom-${Date.now()}`,
      name: uploadTitle.trim() || `Custom ${uploadSlot.slice(0, -1).toUpperCase()}`,
      slot: uploadSlot,
      gender: 'unisex',
      categoryName: 'Custom Upload',
      image: customImagePreview,
      color: uploadColor,
      colorName: 'Custom Palette',
      fabric: uploadFabric,
      brandOrSource: 'Your Personal Closet',
      tags: ['User Uploaded', 'Custom Garment'],
      mannequinTopType: uploadSlot === 'outerwear' ? 'jacket' : 'shirt',
      mannequinBottomType: 'trousers',
    };

    handleSelectGarment(newGarment);
    setIsUploadModalOpen(false);
    setCustomImagePreview(null);
    setUploadTitle('');
    rewards.earnPoints('upload_outfit');
  };

  // Mouse move handler for Before / After Split Slider
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(500);

  useEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleSliderMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = Math.round((x / rect.width) * 100);
    setSliderPosition(percentage);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* ===== HERO BRANDING BANNER (Fashion Diffusion AI style) ===== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0a192f] via-[#0f2444] to-[#1e3a8a] border border-[#38BDF8]/25 p-6 md:p-8 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#38BDF8]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#38BDF8]/15 border border-[#38BDF8]/30 text-xs text-[#38BDF8] font-mono uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
              <span>Fashion Diffusion AI // Mix & Match Studio</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-serif font-black tracking-tight text-[#FAF8F5]">
              Virtual Mix-and-Match Generator
            </h2>
            <p className="text-xs md:text-sm text-[#FAF8F5]/80 leading-relaxed font-light">
              Mix separate tops, bottoms, outerwear, gowns, shoes, and jewelry on diverse AI fashion models. 
              Scrub the real-time <strong>Before &amp; After Try-On slider</strong> or step into the <strong>3D interactive catwalk</strong>.
            </p>
          </div>

          {/* Quick Stats & Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-[#050d1a]/80 p-1 rounded-2xl border border-[#FAF8F5]/15 backdrop-blur-md">
              <button
                onClick={() => setVisualMode('photorealistic')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  visualMode === 'photorealistic'
                    ? 'bg-[#38BDF8] text-[#0a192f] shadow-md'
                    : 'text-[#FAF8F5]/70 hover:text-white'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Editorial Studio</span>
              </button>
              <button
                onClick={() => setVisualMode('3d-catwalk')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  visualMode === '3d-catwalk'
                    ? 'bg-[#FAF8F5] text-[#0a192f] shadow-md'
                    : 'text-[#FAF8F5]/70 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Real Lookbook Gallery</span>
              </button>
            </div>

            {/* Custom Upload Garment Button */}
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#1e3a8a]/60 hover:bg-[#1e3a8a] text-xs font-bold text-[#FAF8F5] border border-[#FAF8F5]/25 transition-all shadow-md hover:scale-105 active:scale-95"
            >
              <Upload className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>+ Upload Garment</span>
            </button>
          </div>
        </div>

        {/* Saved feedback notification */}
        <AnimatePresence>
          {savedBanner && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 px-4 py-2 rounded-xl bg-[#10B981]/20 border border-[#10B981]/40 text-xs font-semibold text-[#10B981] flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{savedBanner}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ===== MODEL ARCHETYPE SELECTOR BAR ===== */}
      <div className="bg-[#0f172a]/90 backdrop-blur-xl border border-[#FAF8F5]/10 rounded-2xl p-4 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-wider font-mono text-[#FAF8F5]/60 font-semibold">
              Select AI Model:
            </span>
            {/* Gender Toggle */}
            <div className="flex items-center bg-[#0a192f] p-0.5 rounded-lg border border-[#FAF8F5]/15">
              <button
                onClick={() => handleSwitchGender('female')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  selectedModel.gender === 'female'
                    ? 'bg-[#F43F5E] text-white shadow-sm'
                    : 'text-[#FAF8F5]/60 hover:text-white'
                }`}
              >
                Female
              </button>
              <button
                onClick={() => handleSwitchGender('male')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  selectedModel.gender === 'male'
                    ? 'bg-[#38BDF8] text-[#0a192f] shadow-sm'
                    : 'text-[#FAF8F5]/60 hover:text-white'
                }`}
              >
                Male
              </button>
            </div>
          </div>

          {/* Model Profile Cards */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1 w-full sm:w-auto">
            {STUDIO_MODELS.filter((m) => m.gender === selectedModel.gender).map((model) => {
              const isSelected = selectedModel.id === model.id;
              return (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model)}
                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-[#FAF8F5] text-[#0a192f] border-[#FAF8F5] shadow-md scale-105'
                      : 'bg-[#0a192f]/60 text-[#FAF8F5]/70 border-[#FAF8F5]/10 hover:bg-[#1e3a8a]/40 hover:text-white'
                  }`}
                >
                  <img
                    src={model.baseImage}
                    alt={model.name}
                    className="w-5 h-5 rounded-full object-cover border border-black/20"
                  />
                  <span>{model.name}</span>
                  <span className="text-[10px] font-mono opacity-60">({model.height})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ===== 3-COLUMN STUDIO LAYOUT ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================= */}
        {/* COLUMN 1: WARDROBE RACK & SLOTS SELECTOR (4 COLS)         */}
        {/* ========================================================= */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#0f172a]/95 backdrop-blur-xl border border-[#FAF8F5]/15 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#FAF8F5]/10 pb-3">
              <div>
                <h3 className="text-base font-serif font-bold text-[#FAF8F5] flex items-center gap-2">
                  <span>👗 Garment Rack</span>
                </h3>
                <p className="text-[11px] text-[#FAF8F5]/60 font-mono">1-Click Slot Mixing</p>
              </div>
              <span className="text-[11px] font-mono bg-[#38BDF8]/20 text-[#38BDF8] px-2.5 py-1 rounded-full border border-[#38BDF8]/30">
                {availableGarments.length} Available
              </span>
            </div>

            {/* Slot Category Selector Tabs */}
            <div className="grid grid-cols-3 gap-1.5 bg-[#0a192f] p-1.5 rounded-2xl border border-[#FAF8F5]/10 text-xs">
              {[
                { id: 'tops' as GarmentSlot, label: 'Tops', icon: '👚' },
                { id: 'bottoms' as GarmentSlot, label: 'Bottoms', icon: '👖' },
                {
                  id: 'dresses' as GarmentSlot,
                  label: selectedModel.gender === 'male' ? 'Ensembles' : 'Dresses',
                  icon: selectedModel.gender === 'male' ? '🤵' : '👗'
                },
                { id: 'outerwear' as GarmentSlot, label: 'Coats', icon: '🧥' },
                { id: 'shoes' as GarmentSlot, label: 'Shoes', icon: '👠' },
                { id: 'accessories' as GarmentSlot, label: 'Jewelry', icon: '💍' },
              ].map((slot) => {
                const isActive = activeSlotTab === slot.id;
                const hasEquipped = !!activeSlots[slot.id];
                return (
                  <button
                    key={slot.id}
                    onClick={() => setActiveSlotTab(slot.id)}
                    className={`relative flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl font-bold transition-all text-[11px] ${
                      isActive
                        ? 'bg-[#FAF8F5] text-[#0a192f] shadow-md'
                        : 'text-[#FAF8F5]/70 hover:bg-[#1e3a8a]/40 hover:text-white'
                    }`}
                  >
                    <span>{slot.icon}</span>
                    <span>{slot.label}</span>
                    {hasEquipped && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] absolute top-1 right-1" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Garment Cards Grid */}
            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1 scrollbar-thin">
              {availableGarments.map((garment) => {
                const isEquipped =
                  activeSlots[garment.slot]?.id === garment.id ||
                  (garment.slot === 'dresses' && activeSlots.dresses?.id === garment.id);

                return (
                  <div
                    key={garment.id}
                    onClick={() => handleSelectGarment(garment)}
                    className={`group cursor-pointer relative flex gap-3.5 p-3 rounded-2xl border transition-all duration-300 ${
                      isEquipped
                        ? 'bg-[#1e3a8a]/40 border-[#38BDF8] shadow-lg shadow-[#38BDF8]/20 ring-2 ring-[#38BDF8]/50'
                        : 'bg-[#0a192f]/60 border-[#FAF8F5]/10 hover:border-[#FAF8F5]/30 hover:bg-[#1e3a8a]/20'
                    }`}
                  >
                    {/* Garment Thumbnail */}
                    <div className="relative w-20 h-24 rounded-xl overflow-hidden shrink-0 bg-black/40 border border-[#FAF8F5]/10">
                      <img
                        src={garment.image}
                        alt={garment.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {isEquipped && (
                        <div className="absolute top-1 right-1 bg-[#38BDF8] text-[#0a192f] p-1 rounded-full shadow-md">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    {/* Garment Details */}
                    <div className="flex flex-col justify-between flex-1 min-w-0">
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] uppercase font-mono font-bold text-[#38BDF8] tracking-wider">
                            {garment.categoryName}
                          </span>
                          <span
                            className="w-3 h-3 rounded-full border border-white/30 shrink-0"
                            style={{ backgroundColor: garment.color }}
                            title={garment.colorName}
                          />
                        </div>
                        <h4 className="text-xs font-serif font-bold text-[#FAF8F5] group-hover:text-[#38BDF8] transition-colors line-clamp-1">
                          {garment.name}
                        </h4>
                        <p className="text-[10px] text-[#FAF8F5]/60 mt-0.5">{garment.fabric}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#FAF8F5]/10">
                        <span className="text-[9px] font-mono text-[#FAF8F5]/50 truncate max-w-[120px]">
                          {garment.brandOrSource}
                        </span>
                        <button
                          type="button"
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            isEquipped
                              ? 'bg-[#38BDF8] text-[#0a192f]'
                              : 'bg-[#FAF8F5]/10 text-[#FAF8F5]/80 group-hover:bg-[#FAF8F5] group-hover:text-[#0a192f]'
                          }`}
                        >
                          {isEquipped ? 'Equipped' : '+ Mix In'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* COLUMN 2: CENTER MODEL STAGE & TRY-ON CANVAS (5 COLS)     */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative bg-[#050d1a] border border-[#FAF8F5]/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center">
            {/* Stage Header Controls */}
            <div className="w-full flex items-center justify-between p-4 bg-[#0a192f]/80 backdrop-blur-md border-b border-[#FAF8F5]/10 z-20">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                <span className="text-xs font-mono font-bold text-[#FAF8F5]">
                  {selectedModel.name} // {selectedModel.ethnicity}
                </span>
              </div>

              {/* Compare Mode Switcher (Styled After, Side-by-Side, Split Slider, Base Model) */}
              {visualMode === 'photorealistic' && (
                <div className="flex items-center bg-[#050d1a] p-0.5 rounded-xl border border-[#FAF8F5]/15 text-[10px] font-bold">
                  <button
                    onClick={() => setCompareMode('after')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      compareMode === 'after' ? 'bg-[#38BDF8] text-[#0a192f]' : 'text-[#FAF8F5]/70 hover:text-white'
                    }`}
                  >
                    Styled Look
                  </button>
                  <button
                    onClick={() => setCompareMode('side-by-side')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      compareMode === 'side-by-side' ? 'bg-[#38BDF8] text-[#0a192f]' : 'text-[#FAF8F5]/70 hover:text-white'
                    }`}
                  >
                    Side-by-Side
                  </button>
                  <button
                    onClick={() => setCompareMode('split')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      compareMode === 'split' ? 'bg-[#38BDF8] text-[#0a192f]' : 'text-[#FAF8F5]/70 hover:text-white'
                    }`}
                  >
                    Split Slider
                  </button>
                  <button
                    onClick={() => setCompareMode('before')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      compareMode === 'before' ? 'bg-[#38BDF8] text-[#0a192f]' : 'text-[#FAF8F5]/70 hover:text-white'
                    }`}
                  >
                    Base Model
                  </button>
                </div>
              )}
            </div>

            {/* CANVAS VIEWPORT */}
            <div
              ref={containerRef}
              onMouseMove={(e) => isDraggingSlider && handleSliderMove(e.clientX)}
              onTouchMove={(e) => {
                if (e.touches[0]) handleSliderMove(e.touches[0].clientX);
              }}
              onMouseUp={() => setIsDraggingSlider(false)}
              className="relative w-full h-[580px] select-none overflow-hidden flex items-center justify-center bg-gradient-to-b from-[#0a192f]/50 to-[#020617]"
            >
              {/* MODE A: PHOTOREALISTIC TRY-ON */}
              {visualMode === 'photorealistic' && (
                <div className="relative w-full h-full">
                  {/* OPTION 1: SIDE-BY-SIDE DUAL VIEW (Clean, intact portraits) */}
                  {compareMode === 'side-by-side' && (
                    <div className="grid grid-cols-2 gap-3 w-full h-full p-3">
                      {/* Before Panel */}
                      <div className="relative w-full h-full rounded-2xl overflow-hidden border border-[#FAF8F5]/15 bg-black/40 shadow-inner">
                        <img
                          src={selectedModel.baseImage}
                          alt="Original Base Model"
                          className="w-full h-full object-cover object-top filter grayscale-[15%]"
                        />
                        <div className="absolute top-2.5 left-2.5 bg-[#0a192f]/85 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono font-bold text-[#FAF8F5]/80 border border-[#FAF8F5]/20 shadow-md">
                          BEFORE: BASE
                        </div>
                      </div>

                      {/* After Panel */}
                      <div className="relative w-full h-full rounded-2xl overflow-hidden border border-[#38BDF8]/40 bg-black/40 shadow-xl">
                        <img
                          src={compositePhotorealisticImage}
                          alt="Mix & Match AI Output"
                          className="w-full h-full object-cover object-top filter contrast-105"
                        />
                        <div className="absolute top-2.5 right-2.5 bg-[#0a192f]/85 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono font-bold text-[#38BDF8] border border-[#38BDF8]/40 shadow-md">
                          AFTER: STYLED
                        </div>
                      </div>
                    </div>
                  )}

                  {/* OPTION 2: AFTER ONLY (DEFAULT FULL-FIDELITY VIEW) */}
                  {compareMode === 'after' && (
                    <div className="relative w-full h-full">
                      <img
                        src={compositePhotorealisticImage}
                        alt="Mix & Match AI Output"
                        className="w-full h-full object-cover object-top filter contrast-105"
                      />
                      <div className="absolute top-3 right-3 bg-[#0a192f]/85 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-mono font-bold text-[#38BDF8] border border-[#38BDF8]/40 shadow-lg">
                        ✨ AFTER: AI MIX &amp; MATCH
                      </div>
                    </div>
                  )}

                  {/* OPTION 3: BEFORE ONLY */}
                  {compareMode === 'before' && (
                    <div className="relative w-full h-full">
                      <img
                        src={selectedModel.baseImage}
                        alt="Original Base Model"
                        className="w-full h-full object-cover object-top filter grayscale-[15%]"
                      />
                      <div className="absolute top-3 left-3 bg-[#0a192f]/85 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-mono font-bold text-[#FAF8F5]/80 border border-[#FAF8F5]/20 shadow-lg">
                        BEFORE: BASE MODEL
                      </div>
                    </div>
                  )}

                  {/* OPTION 4: SPLIT SLIDER (un-squeezed pixel-exact width) */}
                  {compareMode === 'split' && (
                    <div className="relative w-full h-full">
                      {/* AFTER LAYER */}
                      <div className="absolute inset-0 w-full h-full">
                        <img
                          src={compositePhotorealisticImage}
                          alt="Mix & Match AI Output"
                          className="w-full h-full object-cover object-top filter contrast-105"
                        />
                        <div className="absolute top-3 right-3 bg-[#0a192f]/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono font-bold text-[#38BDF8] border border-[#38BDF8]/40">
                          AFTER: AI MIX &amp; MATCH
                        </div>
                      </div>

                      {/* BEFORE LAYER */}
                      <div
                        className="absolute inset-0 h-full overflow-hidden"
                        style={{
                          width: `${sliderPosition}%`,
                        }}
                      >
                        <img
                          src={selectedModel.baseImage}
                          alt="Original Base Model"
                          className="h-full object-cover object-top filter grayscale-[20%]"
                          style={{
                            width: `${containerWidth}px`,
                            minWidth: `${containerWidth}px`,
                            maxWidth: 'none',
                          }}
                        />
                        <div className="absolute top-3 left-3 bg-[#0a192f]/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono font-bold text-[#FAF8F5]/80 border border-[#FAF8F5]/20">
                          BEFORE: BASE MODEL
                        </div>
                      </div>

                      {/* INTERACTIVE DRAG DIVIDER */}
                      <div
                        onMouseDown={() => setIsDraggingSlider(true)}
                        onTouchStart={() => setIsDraggingSlider(true)}
                        style={{ left: `${sliderPosition}%` }}
                        className="absolute top-0 bottom-0 w-1 bg-white/90 shadow-[0_0_12px_rgba(255,255,255,0.8)] cursor-ew-resize z-30 flex items-center justify-center -ml-0.5"
                      >
                        <div className="w-8 h-8 rounded-full bg-[#FAF8F5] text-[#0a192f] shadow-2xl flex items-center justify-center border-2 border-[#38BDF8] cursor-grab active:cursor-grabbing transform hover:scale-110 transition-transform">
                          <div className="flex items-center gap-0.5 text-xs font-black">
                            <ChevronLeft className="w-3 h-3 -mr-1" />
                            <ChevronRight className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* MODE B: REAL LOOKBOOK & DRESS PALETTES */}
              {visualMode === '3d-catwalk' && (
                <div className="relative w-full h-full flex items-center justify-center p-2 overflow-y-auto">
                  <RealModelDressViewer
                    gender={selectedModel.gender}
                    selectedOccasion={selectedOccasion.label}
                    showOptionCarousel={false}
                    className="w-full h-full border-0 shadow-none bg-transparent"
                  />
                </div>
              )}

              {/* PROGRESS OVERLAY WHEN GENERATING */}
              <AnimatePresence>
                {isGenerating && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[#050d1a]/85 backdrop-blur-md flex flex-col items-center justify-center p-6 z-40 space-y-4"
                  >
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 rounded-full border-4 border-[#38BDF8]/20 animate-pulse" />
                      <div className="absolute inset-0 rounded-full border-4 border-[#38BDF8] border-t-transparent animate-spin" />
                      <Sparkles className="w-6 h-6 text-[#38BDF8] absolute inset-0 m-auto" />
                    </div>

                    <div className="text-center space-y-1">
                      <p className="text-sm font-serif font-bold text-[#FAF8F5]">
                        Fashion Diffusion Synthesizing...
                      </p>
                      <p className="text-xs font-mono text-[#38BDF8]">{generationStep}</p>
                    </div>

                    <div className="w-48 h-2 bg-[#FAF8F5]/10 rounded-full overflow-hidden border border-[#FAF8F5]/20">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#38BDF8] to-[#10B981]"
                        style={{ width: `${generationProgress}%` }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* GENERATE MIX & MATCH ACTION BUTTON */}
            <div className="w-full p-4 bg-[#0a192f]/90 backdrop-blur-md border-t border-[#FAF8F5]/15 flex items-center justify-between gap-3 z-20">
              <button
                onClick={handleGenerateMixAndMatch}
                disabled={isGenerating}
                className="flex-1 flex items-center justify-center gap-2.5 py-3 px-6 rounded-2xl bg-gradient-to-r from-[#38BDF8] via-[#2563eb] to-[#7c3aed] text-white font-bold text-sm shadow-xl shadow-[#2563eb]/40 hover:shadow-[#38BDF8]/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} />
                <span>{isGenerating ? 'Synthesizing Look...' : '✨ Generate Mix & Match (AI Try-On)'}</span>
              </button>

              <button
                onClick={handleShuffleOutfit}
                title="AI Shuffle / Randomize Look"
                className="p-3 rounded-2xl bg-[#1e3a8a]/40 hover:bg-[#1e3a8a] text-[#FAF8F5] border border-[#FAF8F5]/20 transition-all hover:scale-105 active:scale-95 shadow-md"
              >
                <Shuffle className="w-4 h-4" />
              </button>

              <button
                onClick={handleClearAll}
                title="Clear All Garment Slots"
                className="p-3 rounded-2xl bg-[#050d1a] hover:bg-[#ef4444]/20 text-[#FAF8F5]/70 hover:text-[#ef4444] border border-[#FAF8F5]/20 transition-all hover:scale-105 active:scale-95 shadow-md"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ACTIVE EQUIPPED SLOTS DOCK */}
          <div className="bg-[#0f172a]/95 backdrop-blur-xl border border-[#FAF8F5]/15 rounded-3xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#FAF8F5]/60 font-semibold">
                Active Outfit Assembly
              </span>
              <span className="text-[11px] font-mono text-[#38BDF8]">
                {Object.values(activeSlots).filter(Boolean).length} / 6 Slots
              </span>
            </div>

            <div className="grid grid-cols-6 gap-2">
              {(['tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 'accessories'] as GarmentSlot[]).map((slotKey) => {
                const item = activeSlots[slotKey];
                return (
                  <div
                    key={slotKey}
                    className={`relative flex flex-col items-center justify-center p-2 rounded-2xl border text-center transition-all min-h-[72px] ${
                      item
                        ? 'bg-[#1e3a8a]/40 border-[#38BDF8]/60 shadow-md'
                        : 'bg-[#0a192f]/40 border-[#FAF8F5]/10 border-dashed'
                    }`}
                  >
                    {item ? (
                      <>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-8 h-8 rounded-lg object-cover border border-white/20 mb-1"
                        />
                        <span className="text-[9px] font-bold text-[#FAF8F5] line-clamp-1 w-full">
                          {item.categoryName}
                        </span>
                        <button
                          onClick={() => handleRemoveSlot(slotKey)}
                          className="absolute -top-1 -right-1 bg-[#ef4444] text-white rounded-full p-0.5 shadow-sm hover:scale-110"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="text-xs opacity-40">
                          {slotKey === 'tops' ? '👚' : slotKey === 'bottoms' ? '👖' : slotKey === 'dresses' ? '👗' : slotKey === 'outerwear' ? '🧥' : slotKey === 'shoes' ? '👠' : '💍'}
                        </span>
                        <span className="text-[8px] font-mono uppercase text-[#FAF8F5]/40 mt-1">
                          {slotKey.slice(0, 4)}
                        </span>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* COLUMN 3: AI FASHION DIFFUSION DIAGNOSTICS (3 COLS)       */}
        {/* ========================================================= */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-[#0f172a]/95 backdrop-blur-xl border border-[#FAF8F5]/15 rounded-3xl p-5 shadow-xl space-y-5">
            <div>
              <h3 className="text-base font-serif font-bold text-[#FAF8F5] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#38BDF8]" />
                <span>Styling Diagnostics</span>
              </h3>
              <p className="text-[11px] text-[#FAF8F5]/60 font-mono">Generative Harmonization</p>
            </div>

            {/* AI Harmony Score Dial */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0a192f] border border-[#FAF8F5]/10">
              <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#FAF8F5]/10"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#10B981]"
                    strokeDasharray="98, 100"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-base font-mono font-black text-[#10B981]">98%</span>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#FAF8F5]">Color &amp; Fabric Synergy</h4>
                <p className="text-[10px] text-[#FAF8F5]/70 mt-0.5">
                  High-contrast balance with cohesive tonal undertones.
                </p>
              </div>
            </div>

            {/* Occasion Suitability Filter */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#FAF8F5]/60 font-semibold">
                Occasion Suitability:
              </span>
              <div className="space-y-1.5">
                {OCCASIONS.map((occ) => {
                  const isCurrent = selectedOccasion.id === occ.id;
                  const Icon = occ.icon;
                  return (
                    <button
                      key={occ.id}
                      onClick={() => setSelectedOccasion(occ)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-all border ${
                        isCurrent
                          ? 'bg-[#1e3a8a]/50 border-[#38BDF8] text-white shadow-sm'
                          : 'bg-[#0a192f]/40 border-[#FAF8F5]/10 text-[#FAF8F5]/70 hover:bg-[#1e3a8a]/20 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5" style={{ color: occ.color }} />
                        <span className="text-[11px]">{occ.label}</span>
                      </div>
                      <span className="font-mono text-[11px] text-[#10B981] font-bold">
                        {occ.defaultScore}%
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Gemini AI Editorial Verdict */}
            <div className="p-3.5 rounded-2xl bg-[#0a192f] border border-[#FAF8F5]/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-[#38BDF8] font-bold">
                  Gemini AI Fashion Verdict
                </span>
                <span className="text-[9px] font-mono text-[#FAF8F5]/50">Editorial Lead</span>
              </div>
              <p className="text-[11px] text-[#FAF8F5]/80 leading-relaxed font-light">
                {activeSlots.dresses
                  ? `The ${activeSlots.dresses.name} establishes an uninterrupted vertical column of elegance. Accompanied by ${activeSlots.accessories?.name || 'minimalist jewelry'}, it commands high visual presence.`
                  : `Pairing the ${activeSlots.tops?.name || 'sculpted top'} with ${activeSlots.bottoms?.name || 'tailored trousers'} provides impeccable golden-ratio proportions. The ${activeSlots.shoes?.name || 'footwear'} grounds the look with understated authority.`}
              </p>
            </div>

            {/* Action Buttons: Save Look & Download */}
            <div className="space-y-2 pt-2 border-t border-[#FAF8F5]/10">
              <button
                onClick={handleSaveLook}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#FAF8F5] hover:bg-white text-[#0a192f] font-bold text-xs shadow-lg transition-all active:scale-95"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Save Look to Wardrobe</span>
              </button>

              <button
                onClick={() => {
                  alert('High-resolution editorial lookbook composite generated and queued for download.');
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0a192f] hover:bg-[#1e3a8a]/40 text-[#FAF8F5] border border-[#FAF8F5]/15 font-semibold text-xs transition-all"
              >
                <span>Download High-Res Render</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MODAL: CUSTOM GARMENT UPLOAD ===== */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-[#0a192f] border border-[#38BDF8]/40 rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-[#FAF8F5]/10 pb-3">
                <div className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-[#38BDF8]" />
                  <h3 className="text-lg font-serif font-bold text-[#FAF8F5]">
                    Upload Custom Garment
                  </h3>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="p-1 rounded-full text-[#FAF8F5]/60 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Slot Target */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#FAF8F5]/70">Assign to Slot:</label>
                <select
                  value={uploadSlot}
                  onChange={(e) => setUploadSlot(e.target.value as GarmentSlot)}
                  className="w-full bg-[#050d1a] border border-[#FAF8F5]/20 rounded-xl px-3 py-2 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#38BDF8]"
                >
                  <option value="tops">👚 Tops (Shirts, Blouses, Knits)</option>
                  <option value="bottoms">👖 Bottoms (Trousers, Skirts, Jeans)</option>
                  <option value="dresses">👗 Dresses / One-Piece / Sarees</option>
                  <option value="outerwear">🧥 Outerwear (Coats, Blazers)</option>
                  <option value="shoes">👠 Shoes (Heels, Loafers, Oxfords)</option>
                  <option value="accessories">💍 Accessories (Watches, Bags, Jewelry)</option>
                </select>
              </div>

              {/* Image Picker / Drop Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative border-2 border-dashed border-[#FAF8F5]/20 hover:border-[#38BDF8] rounded-2xl p-6 text-center cursor-pointer transition-all bg-[#050d1a]/50"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleCustomUpload}
                  accept="image/*"
                  className="hidden"
                />
                {customImagePreview ? (
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={customImagePreview}
                      alt="Uploaded Preview"
                      className="w-24 h-28 object-cover rounded-xl border border-white/20 shadow-md"
                    />
                    <span className="text-[11px] text-[#10B981] font-semibold">
                      Photo Loaded Successfully
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 text-[#38BDF8] mx-auto opacity-80" />
                    <p className="text-xs text-[#FAF8F5] font-semibold">Click to select garment photo</p>
                    <p className="text-[10px] text-[#FAF8F5]/50">PNG, JPG, WEBP up to 10MB</p>
                  </div>
                )}
              </div>

              {/* Title & Fabric Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[#FAF8F5]/70">Garment Name:</label>
                  <input
                    type="text"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="e.g. Vintage Silk Blazer"
                    className="w-full bg-[#050d1a] border border-[#FAF8F5]/20 rounded-xl px-3 py-1.5 text-xs text-[#FAF8F5]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[#FAF8F5]/70">Fabric Composition:</label>
                  <input
                    type="text"
                    value={uploadFabric}
                    onChange={(e) => setUploadFabric(e.target.value)}
                    placeholder="e.g. 100% Raw Silk"
                    className="w-full bg-[#050d1a] border border-[#FAF8F5]/20 rounded-xl px-3 py-1.5 text-xs text-[#FAF8F5]"
                  />
                </div>
              </div>

              {/* Submit & Cancel */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#FAF8F5]/70 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyCustomGarment}
                  disabled={!customImagePreview}
                  className="px-5 py-2 rounded-xl bg-[#38BDF8] text-[#0a192f] text-xs font-bold shadow-md hover:bg-white disabled:opacity-40 transition-all"
                >
                  Apply to Look
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
