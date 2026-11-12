// agent-notes: { ctx: "3D mannequin visualizer with realistic garment silhouettes", deps: ["framer-motion", "lucide-react"], state: active, last: "tara@2026-09-23" }
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ZoomIn,
  ZoomOut,
  Check,
  Layers,
  Sliders,
  Bookmark,
  RefreshCw,
  CheckCircle2,
  Wand2,
  Shirt,
  Play,
  Pause,
  Compass,
  GraduationCap,
  Palette,
  Briefcase,
  Heart,
  GlassWater,
  PartyPopper,
  Camera,
  Ruler,
  Watch,
  Gem,
  CircleDot,
  Info,
  Footprints,
} from 'lucide-react';
import { Gender, useAuth } from '@/hooks/useAuth';
import { useCollection } from '@/hooks/useCollection';
import { useRewards } from '@/hooks/useRewards';
import LoginModal from '@/components/LoginModal';
import { ClothSuggestionResponse } from '@/app/api/cloth-suggestion/route';

export type SkinTone =
  | 'soft_ivory'
  | 'warm_almond'
  | 'golden_olive'
  | 'bronze_tan'
  | 'rich_espresso'
  | 'deep_ebony'
  | 'black'
  | 'brown'
  | 'white';

export interface OutfitConfig {
  title?: string;
  topType:
  | 'shirt'
  | 'tshirt'
  | 'kurti'
  | 'kurta'
  | 'saree'
  | 'salwar'
  | 'top'
  | 'croptop'
  | 'gown'
  | 'shrug'
  | 'blazer'
  | 'jacket'
  | 'skirt';
  topColor: string;
  bottomType:
  | 'jeans'
  | 'trousers'
  | 'salwar_bottom'
  | 'skirt'
  | 'chinos'
  | 'tracks'
  | 'gown_skirt';
  bottomColor: string;
  outerwearColor?: string;
  accentColor?: string;
  description?: string;
  fabricType?: 'silk' | 'wool' | 'linen' | 'denim' | 'leather';
  occasion?: string;
}

interface MannequinVisualizerProps {
  gender?: Gender;
  onGenderChange?: (gender: Gender) => void;
  outfit?: OutfitConfig;
  className?: string;
  showControls?: boolean;
  onGarmentChange?: (newOutfit: OutfitConfig) => void;
  onSaveOutfit?: (outfit: OutfitConfig) => void;
}

interface SkinToneDetails {
  label: string;
  base: string;
  highlight: string;
  shadow: string;
  icon: string;
}

export const SKIN_TONES: Record<SkinTone, SkinToneDetails> = {
  soft_ivory: {
    label: 'Soft Ivory',
    base: '#FDE1CE',
    highlight: '#FFF3EB',
    shadow: '#D8AB90',
    icon: '🏻',
  },
  warm_almond: {
    label: 'Warm Almond',
    base: '#F4C29B',
    highlight: '#FDEDE0',
    shadow: '#C5916A',
    icon: '🏼',
  },
  golden_olive: {
    label: 'Golden Olive',
    base: '#D99B69',
    highlight: '#EFC19B',
    shadow: '#A86D3C',
    icon: '🏽',
  },
  bronze_tan: {
    label: 'Deep Bronze',
    base: '#B06F41',
    highlight: '#CB9063',
    shadow: '#82461D',
    icon: '🏽',
  },
  rich_espresso: {
    label: 'Rich Espresso',
    base: '#6E432A',
    highlight: '#8C5A3E',
    shadow: '#462714',
    icon: '🏾',
  },
  deep_ebony: {
    label: 'Deep Ebony',
    base: '#3B2117',
    highlight: '#573627',
    shadow: '#20100A',
    icon: '🏿',
  },
  white: {
    label: 'Fair Sand',
    base: '#FDE1CE',
    highlight: '#FFF3EB',
    shadow: '#D8AB90',
    icon: '🏻',
  },
  brown: {
    label: 'Warm Bronze',
    base: '#B06F41',
    highlight: '#CB9063',
    shadow: '#82461D',
    icon: '🏽',
  },
  black: {
    label: 'Deep Ebony',
    base: '#3B2117',
    highlight: '#573627',
    shadow: '#20100A',
    icon: '🏿',
  },
};

export interface AccessoryItemDetail {
  name: string;
  style: string;
  finish: string;
  tip: string;
}

export interface GarmentSilhouette {
  id: string;
  key: OutfitConfig['topType'];
  title: string;
  category: string;
  gender: 'female' | 'male' | 'both';
  suggestedBottom: OutfitConfig['bottomType'];
  defaultTopColor: string;
  defaultBottomColor: string;
  defaultAccentColor: string;
  description: string;
  fabricType: 'silk' | 'wool' | 'linen' | 'denim' | 'leather';
  occasion: 'interview' | 'wedding' | 'cocktail' | 'casual' | 'graduation' | 'resort';
  realModelImage: string;
  modelSource: string;
  fabricInfo: {
    name: string;
    texture: string;
    gsm: string;
    breathability: 'High' | 'Medium' | 'Low';
    care: string;
  };
  sizeAdvice: {
    slim: string;
    regular: string;
    oversized: string;
    tailoringBreak: string;
  };
  accessories: {
    shoe: AccessoryItemDetail;
    watch: AccessoryItemDetail;
    ring: AccessoryItemDetail;
    chain: AccessoryItemDetail;
    bracelet: AccessoryItemDetail;
  };
}

export const SILHOUETTES: GarmentSilhouette[] = [
  // WOMEN - INTERVIEW / POWER SUIT
  {
    id: 'w-blazer-interview',
    key: 'blazer',
    title: 'Savile Row Power Suiting (Executive Interview)',
    category: 'Job Interview & Executive',
    gender: 'female',
    suggestedBottom: 'trousers',
    defaultTopColor: '#0F172A',
    defaultBottomColor: '#0F172A',
    defaultAccentColor: '#FAF8F5',
    description: 'Sculpted wool-crepe blazer over an ivory silk blouse with fluid pressed trousers. Projects competence and boardroom authority.',
    fabricType: 'wool',
    occasion: 'interview',
    realModelImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop',
    modelSource: 'Vogue Business / Pinterest Executive Board',
    fabricInfo: {
      name: 'Super 140s Tasmanian Wool-Crepe & Mulberry Silk',
      texture: 'Refined diagonal twill weave with natural wrinkle resistance and matte luxury luster',
      gsm: '260 GSM Four-Season Drape',
      breathability: 'High',
      care: 'Steam press between wears; store on contoured cedar wooden hangers',
    },
    sizeAdvice: {
      slim: 'Tapered waist suppression creates an athletic, sharp profile. Hem breaks neatly above shoe vamp.',
      regular: 'Balanced ease across bust and shoulders; allows 2 inches of movement for comfortable seated interviews.',
      oversized: 'Drop-shoulder architectural cut. Wear with high-waist belt for contemporary creative interviews.',
      tailoringBreak: 'Slight trouser break resting gently on the shoe vamp; sleeve exposes 0.5" shirt cuff.',
    },
    accessories: {
      shoe: { name: 'Pointed-Toe 75mm Italian Nappa Pumps', style: 'Executive Pump', finish: 'Midnight Calf Leather', tip: 'Grounds professional posture with steady arch support.' },
      watch: { name: 'Rose Gold Slim Mesh Dial Timepiece', style: 'Minimalist Dress Watch', finish: 'Rose Gold / White Enamel', tip: 'Clean 28mm face slides under blazer cuffs effortlessly.' },
      ring: { name: 'Brushed Platinum Signet Ring', style: 'Understated Band', finish: 'Satin Platinum', tip: 'Subtle hand accent during handshake and interview gestures.' },
      chain: { name: 'Freshwater Pearl Droplet Pendant', style: 'Collarbone Length Chain', finish: '18k Yellow Gold', tip: 'Rests neatly in the blouse V-neck without distracting.' },
      bracelet: { name: 'Solid Minimalist Gold Bar Cuff', style: 'Architectural Cuff', finish: '18k Polished Gold', tip: 'Placed on opposite wrist of the watch for visual balance.' },
    },
  },
  // WOMEN - WEDDING GALA GOWN
  {
    id: 'w-gown-wedding',
    key: 'gown',
    title: 'Mulberry Silk Gala Gown (Luxury Wedding)',
    category: 'Wedding & Red Carpet Gala',
    gender: 'female',
    suggestedBottom: 'gown_skirt',
    defaultTopColor: '#881337',
    defaultBottomColor: '#881337',
    defaultAccentColor: '#D4AF37',
    description: 'Floor-sweeping mulberry silk gown with sweetheart bodice, liquid drape folds, and antique gold waist cinnabar.',
    fabricType: 'silk',
    occasion: 'wedding',
    realModelImage: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop',
    modelSource: 'Haute Couture Runway Archive / Pinterest Bridal & Gala',
    fabricInfo: {
      name: 'Pure 19-Momme Mulberry Silk Charmeuse',
      texture: 'Liquid, luminous silk surface with fluid cascading drapery and high light reflectance',
      gsm: '110 GSM Liquid Silk',
      breathability: 'High',
      care: 'Specialist dry clean only; protect from direct perfume sprays',
    },
    sizeAdvice: {
      slim: 'Sculpted sweetheart contour hugging torso down to hip flute; provides red-carpet hourglass silhouette.',
      regular: 'Classic couture drape with comfortable interior corset boning for evening-long festivities.',
      oversized: 'Flowing Grecian cape overlay for dramatic cathedral and ballroom entrances.',
      tailoringBreak: 'Floor-skimming hem calculated precisely for 85mm stiletto heels.',
    },
    accessories: {
      shoe: { name: 'Metallic Champagne Ankle-Strap Stilettos', style: 'Evening Heel', finish: 'Mirrored Champagne Gold', tip: 'Elongates legs beneath flowing silk slit.' },
      watch: { name: 'Cartier-Inspired Diamond Bezel Bracelet Watch', style: 'Cocktail Timepiece', finish: '18k Yellow Gold', tip: 'Blends seamlessly as high jewelry on the wrist.' },
      ring: { name: 'Solitaire Emerald-Cut Diamond Pave Band', style: 'Cocktail Gemstone', finish: '18k Yellow Gold / Diamond', tip: 'Catches candlelight and ballroom chandeliers.' },
      chain: { name: 'Layered Gold Choker with Crystal Pendant', style: 'Décolletage Necklace', finish: '18k Solid Gold', tip: 'Accents the sweetheart neckline with luminous sparkle.' },
      bracelet: { name: 'Diamond Tennis Line Bracelet', style: 'Classic Tennis Line', finish: 'Platinum / Crystal', tip: 'Rings delicate light with each graceful arm movement.' },
    },
  },
  // WOMEN - HERITAGE BANARASI SILK SAREE
  {
    id: 'w-saree-festive',
    key: 'saree',
    title: 'Heritage Banarasi Zari Saree (Festive Wedding)',
    category: 'Royal Festive & Wedding',
    gender: 'female',
    suggestedBottom: 'skirt',
    defaultTopColor: '#064E3B',
    defaultBottomColor: '#064E3B',
    defaultAccentColor: '#F59E0B',
    description: 'Handwoven pure silk saree with antique gold zari brocade border and diagonal shoulder pallu drape.',
    fabricType: 'silk',
    occasion: 'wedding',
    realModelImage: '/images/branding/womens-ethnic-fusion.jpg',
    modelSource: 'Pantaloons Flagship Lookbook / Grazia India',
    fabricInfo: {
      name: 'Katan Mulberry Silk with Hand-Spun Zari Brocade',
      texture: 'Substantial, regal silk weave with intricate metallic gold motifs across border and pallu',
      gsm: '320 GSM Heavy Silk',
      breathability: 'Medium',
      care: 'Wrap in pure muslin cloth; avoid moisture; dry clean only',
    },
    sizeAdvice: {
      slim: 'Fitted tailored choli blouse with narrow pleated pallu for a statuesque, tall look.',
      regular: 'Traditional 6-yard saree with 7 pleats tucked at the navel for comfortable movement.',
      oversized: 'Flowing floating pallu drape over forearm for regal reception presence.',
      tailoringBreak: 'Skirt pleats hover exactly 0.5 inches above floor over traditional footwear.',
    },
    accessories: {
      shoe: { name: 'Embroidered Zardozi Silk Mojri Heels', style: 'Traditional Heel', finish: 'Antique Gold Threadwork', tip: 'Matches brocade border while providing all-day ballroom comfort.' },
      watch: { name: 'Heritage Gold Bangle Dress Watch', style: 'Filigree Watch', finish: 'Antique Yellow Gold', tip: 'Pairs harmoniously with bridal chooda or gold bangles.' },
      ring: { name: 'Kundan Cocktail Statement Ring', style: 'Royal Ring', finish: 'Gold Foil / Uncut Stones', tip: 'Commands attention during greeting and tea ceremonies.' },
      chain: { name: 'Heritage Royal Blue Choker & Haar', style: 'Bridal Choker', finish: 'Gold & Emerald Beads', tip: 'Frames the neck with royal Indo-Western grandeur.' },
      bracelet: { name: 'Gold Filigree Temple Kadas', style: 'Heirloom Bangles', finish: '22k Gold Finish', tip: 'Adds rhythmic chiming and traditional elegance.' },
    },
  },
  // MEN - BESPOKE SAVILE ROW SUIT (INTERVIEW / EXECUTIVE)
  {
    id: 'm-suit-interview',
    key: 'blazer',
    title: 'Savile Row Tailored Suiting (Executive Interview)',
    category: 'Job Interview & Executive',
    gender: 'male',
    suggestedBottom: 'trousers',
    defaultTopColor: '#0F172A',
    defaultBottomColor: '#0F172A',
    defaultAccentColor: '#FAF8F5',
    description: 'Two-piece navy bespoke wool suit with peak lapels, sea-island cotton shirt, and pressed dress trousers. The gold standard for interviews.',
    fabricType: 'wool',
    occasion: 'interview',
    realModelImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop',
    modelSource: 'GQ Gentleman / Pinterest Executive Suiting',
    fabricInfo: {
      name: 'Super 150s Merino Wool & Cashmere Blend',
      texture: 'Fine worsted twill with high natural elasticity, flawless drape, and subtle matte sheen',
      gsm: '270 GSM Four-Season Suiting',
      breathability: 'High',
      care: 'Brush with boar-bristle garment brush after wear; steam press periodically',
    },
    sizeAdvice: {
      slim: 'Tailored chest suppression with high armholes and tapered 14.5" trouser leg opening.',
      regular: 'Timeless British cut with natural shoulders and 16" trouser opening for comfortable stride.',
      oversized: 'Relaxed Milanese drape with wider lapels and pleat-front trousers.',
      tailoringBreak: 'Slight trouser break resting softly on shoe vamp; jacket exposes exactly 0.5" shirt cuff.',
    },
    accessories: {
      shoe: { name: 'Hand-Burnished Cap-Toe Oxford Shoes', style: 'Formal Oxford', finish: 'Dark Cognac Calf Leather', tip: 'Pristine mirror-shine toe cap signals attention to detail.' },
      watch: { name: 'Swiss Chronograph on Alligator Strap', style: 'Executive Timepiece', finish: 'Brushed Steel / White Dial', tip: 'Understated 39mm profile slips effortlessly under French cuffs.' },
      ring: { name: 'Brushed Titanium Signet Band', style: 'Minimalist Signet', finish: 'Satin Titanium', tip: 'Subtle elegance on left pinky or ring finger.' },
      chain: { name: 'Sterling Silver 20-Inch Box Chain', style: 'Hidden Collar Chain', finish: 'Rhodium Plated Silver', tip: 'Worn concealed beneath collar for personal style.' },
      bracelet: { name: 'Braided Italian Leather & Steel Clasp', style: 'Subtle Wrist Wrap', finish: 'Dark Navy Leather', tip: 'Worn on right wrist to balance the watch on the left.' },
    },
  },
  // MEN - WEDDING TUXEDO & BANDHGALA
  {
    id: 'm-kurta-wedding',
    key: 'kurta',
    title: 'Bandhgala Raw Silk Kurta (Luxury Wedding)',
    category: 'Wedding & Royal Celebration',
    gender: 'male',
    suggestedBottom: 'salwar_bottom',
    defaultTopColor: '#1E3A8A',
    defaultBottomColor: '#FAF8F5',
    defaultAccentColor: '#D4AF37',
    description: 'Structured raw silk bandhgala with mandarin stand collar, engraved gold buttons, and ivory churidar bottoms.',
    fabricType: 'silk',
    occasion: 'wedding',
    realModelImage: '/images/branding/hero-banner.jpg',
    modelSource: 'Atelier Royal Lookbook / Grazia Men',
    fabricInfo: {
      name: 'Matka Raw Silk with Gold Zari Threading',
      texture: 'Substantial textured weave with rich slub character and regal architectural structure',
      gsm: '310 GSM Structured Silk',
      breathability: 'High',
      care: 'Dry clean only with specialist silk care; store with cedar moth blocks',
    },
    sizeAdvice: {
      slim: 'Fitted military waist suppression creating an imposing, tall silhouette.',
      regular: 'Classic royal court fit allowing full mobility for dancing, dining, and ceremonies.',
      oversized: 'Open front achkan style layered over kurta for dramatic banquet entrance.',
      tailoringBreak: 'Churidar gathers neatly at ankle with 4-5 natural folds above mojris.',
    },
    accessories: {
      shoe: { name: 'Embroidered Velvet Formal Mojris', style: 'Royal Footwear', finish: 'Black Velvet & Gold Thread', tip: 'Provides regal comfort during hours of traditional ceremonies.' },
      watch: { name: 'Yellow Gold Vintage Dress Chronograph', style: 'Heirloom Watch', finish: '18k Yellow Gold', tip: 'Echoes the gold placket buttons with harmonious metal warmth.' },
      ring: { name: 'Solid Gold Lion Crest Signet Ring', style: 'Signet Crest', finish: '22k Yellow Gold', tip: 'Timeless royal statement on the right hand.' },
      chain: { name: 'Layered Basra Pearl & Emerald Mala', style: 'Royal Wedding Mala', finish: 'Natural Pearls & Emerald Beads', tip: 'Drapes across bandhgala chest with Maharaja elegance.' },
      bracelet: { name: 'Heavy Gold Kada with Engraved Finials', style: 'Traditional Kada', finish: 'Pure Brass / Gold Polish', tip: 'Commands respect and masculine presence.' },
    },
  },
  // MEN - CRISP OXFORD SHIRT & CHINOS (SMART CASUAL / INTERVIEW)
  {
    id: 'm-shirt-casual',
    key: 'shirt',
    title: 'Crisp Oxford Shirt & Chinos (Smart Casual)',
    category: 'Smart Casual & Commute',
    gender: 'male',
    suggestedBottom: 'chinos',
    defaultTopColor: '#FAF8F5',
    defaultBottomColor: '#1E3A8A',
    defaultAccentColor: '#B45309',
    description: 'Crisp woven cotton oxford shirt with point collar, tailored flat-front chinos, and full-grain leather belt.',
    fabricType: 'linen',
    occasion: 'casual',
    realModelImage: '/images/branding/mens-smart-casual.jpg',
    modelSource: 'Atelier Commuter Capsule / GQ Urban',
    fabricInfo: {
      name: '100% Egyptian Giza 45 Long-Staple Cotton',
      texture: 'Breathable royal oxford basketweave with soft brushed finish and natural stretch',
      gsm: '160 GSM All-Day Comfort',
      breathability: 'High',
      care: 'Warm machine wash, line dry, medium steam iron for crisp collar points',
    },
    sizeAdvice: {
      slim: 'Tapered sleeves and curved hem designed to stay neatly tucked all day.',
      regular: 'Versatile fit that can be worn tucked for meetings or untucked for after-work social hours.',
      oversized: 'Relaxed camp-collar aesthetic for weekend gallery and coffee runs.',
      tailoringBreak: 'No-break cropped hem exposing ankles slightly over white court sneakers or loafers.',
    },
    accessories: {
      shoe: { name: 'Pristine White Calf-Leather Court Sneakers', style: 'Minimalist Sneaker', finish: 'Italian White Leather', tip: 'Elevates casual denim or chinos with immaculate clean lines.' },
      watch: { name: 'Field Watch on Tan Horween Leather Strap', style: 'Casual Sports Watch', finish: 'Brushed Steel / Tan Leather', tip: 'Develops rich patina over time with everyday wear.' },
      ring: { name: 'Hammered Silver Band Ring', style: 'Artisan Band', finish: 'Sterling Silver', tip: 'Relaxed tactile touch for modern casual styling.' },
      chain: { name: 'Slim 22-Inch Silver Figaro Chain', style: 'Everyday Chain', finish: 'Sterling Silver', tip: 'Rests cleanly at the chest when the top 2 buttons are undone.' },
      bracelet: { name: 'Woven Nautical Cord with Brass Shackle', style: 'Casual Cord', finish: 'Navy Cord & Brass', tip: 'Pairs with watches for effortless weekend texture.' },
    },
  },
  // WOMEN - UNIVERSITY CONVOCATION & HONORS
  {
    id: 'w-grad-academic',
    key: 'blazer',
    title: 'Academic Honors Suiting (Convocation Ceremony)',
    category: 'University Convocation & Honors',
    gender: 'female',
    suggestedBottom: 'skirt',
    defaultTopColor: '#1E3A8A',
    defaultBottomColor: '#FAF8F5',
    defaultAccentColor: '#D4AF37',
    description: 'Double-faced midnight navy wool blazer paired with an ivory pleated midi skirt and gold honor cords. Tailored for graduation stage walks.',
    fabricType: 'wool',
    occasion: 'graduation',
    realModelImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop',
    modelSource: 'Oxford & Ivy Lookbook / Vogue Campus Style',
    fabricInfo: {
      name: 'Super 130s Pure Wool Crepe & Silk Twill',
      texture: 'Crisp, structured drape with sharp pressed pleats that flow gracefully as you walk across the stage',
      gsm: '250 GSM Academic Suiting',
      breathability: 'High',
      care: 'Steam press pleats; store on clipped skirt hanger',
    },
    sizeAdvice: {
      slim: 'Tailored waist contour with sharp peak lapels framing academic hoods and graduation stoles.',
      regular: 'Comfortable structured drape allowing effortless sitting and standing during 3-hour ceremonies.',
      oversized: 'Relaxed academic drape reminiscent of classic collegiate blazer silhouettes.',
      tailoringBreak: 'Midi skirt hem rests exactly 2 inches below the knee for regal academic dignity.',
    },
    accessories: {
      shoe: { name: 'Block-Heel 65mm Nappa Leather Pumps', style: 'Commencement Heel', finish: 'Midnight Navy Calfskin', tip: 'Sturdy block heel prevents wobbling on wooden stage ramps.' },
      watch: { name: 'Roman Numeral Academic Dress Watch', style: 'Commencement Timepiece', finish: '18k Yellow Gold / White Dial', tip: 'Classic dial proportions honoring academic milestones.' },
      ring: { name: 'Signet Class Ring Band', style: 'Honors Ring', finish: 'Solid Gold Finish', tip: 'Worn on right hand during diploma acceptance handshakes.' },
      chain: { name: 'Gold Laurel Leaf Honors Pendant', style: 'Collarbone Pendant', finish: '18k Polished Gold', tip: 'Subtle intellectual symbolism resting cleanly against blouse.' },
      bracelet: { name: 'Minimalist Gold Cable Bangle', style: 'Academic Bangle', finish: '18k Gold Finish', tip: 'Lightweight wrist accent that does not snag on graduation gown sleeves.' },
    },
  },
  // WOMEN - AMALFI COAST RESORT SILK MAXI
  {
    id: 'w-resort-maxi',
    key: 'gown',
    title: 'Amalfi Coast Liquid Silk Maxi (Resort Soirée)',
    category: 'Destination Resort & Summer Gala',
    gender: 'female',
    suggestedBottom: 'gown_skirt',
    defaultTopColor: '#C2410C',
    defaultBottomColor: '#C2410C',
    defaultAccentColor: '#EAB308',
    description: 'Breezy terracotta liquid silk maxi with cowl neckline, side slit, and open back designed for Mediterranean sunset galas.',
    fabricType: 'silk',
    occasion: 'resort',
    realModelImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop',
    modelSource: 'Vogue Resort Cruise Lookbook / Pinterest Summer Gala',
    fabricInfo: {
      name: 'Organic Mulberry Silk & Slub Linen Weave',
      texture: 'Airy, featherweight weave that floats with sea breezes while maintaining luxurious silk luster',
      gsm: '130 GSM Breathable Resort Silk',
      breathability: 'High',
      care: 'Delicate hand wash cold; dry flat in shade away from direct tropical sun',
    },
    sizeAdvice: {
      slim: 'Bias-cut drape clinging gently to torso before flaring into a fluid mermaid hem.',
      regular: 'Relaxed slip silhouette designed for warm evening dining and effortless movement.',
      oversized: 'Bohemian resort caftan drape with wide flowing batwing sleeves.',
      tailoringBreak: 'Floor-grazing hem calculated for flat woven leather sandals or espadrille wedges.',
    },
    accessories: {
      shoe: { name: 'Strappy Metallic Gold Espadrille Wedges', style: 'Resort Wedge', finish: 'Woven Jute & Gold Leather', tip: 'Effortless stability on coastal cobblestones and sandy boardwalks.' },
      watch: { name: 'Mother-of-Pearl Dial Bangle Timepiece', style: 'Resort Watch', finish: 'Warm Yellow Gold', tip: 'Iridescent dial reflects coastal sunsets beautifully.' },
      ring: { name: 'Raw Hammered Citrine Gemstone Ring', style: 'Resort Gemstone', finish: '22k Gold Wire-Wrapped', tip: 'Sun-drenched warmth on the hand.' },
      chain: { name: 'Layered Scallop Shell & Gold Coin Pendant', style: 'Oceanic Layered Chain', finish: '18k Gold Dipped', tip: 'Tumbles across the open décolletage.' },
      bracelet: { name: 'Stack of Hammered Brass Bangles', style: 'Boho Luxe Stack', finish: 'Organic Brushed Brass', tip: 'Adds rhythmic movement and golden sheen.' },
    },
  },
  // MEN - BLACK-TIE GROSGRAIN TUXEDO
  {
    id: 'm-tuxedo-blacktie',
    key: 'blazer',
    title: 'Midnight Peak-Lapel Tuxedo (Black-Tie Gala)',
    category: 'Black-Tie Dinner & Cocktail Gala',
    gender: 'male',
    suggestedBottom: 'trousers',
    defaultTopColor: '#0A192F',
    defaultBottomColor: '#0A192F',
    defaultAccentColor: '#FAF8F5',
    description: 'Black-tie midnight navy wool-silk tuxedo with grosgrain silk peak lapels, braided side-stripe trousers, and Marcella bib shirt.',
    fabricType: 'wool',
    occasion: 'cocktail',
    realModelImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop',
    modelSource: 'GQ Black Tie Guide / Met Gala Menswear',
    fabricInfo: {
      name: 'Super 160s Worsted Wool with Mulberry Grosgrain Silk',
      texture: 'Flawless formal finish with deep light-absorbing midnight tone and silk lapel sheen',
      gsm: '280 GSM Formal Evening Suiting',
      breathability: 'High',
      care: 'Specialist formal garment dry clean; store in breathable canvas garment bag',
    },
    sizeAdvice: {
      slim: 'Sculpted chest suppression with high armholes and no-break trouser hem.',
      regular: 'Savile Row formal proportions with room for waist-cummerbund or evening waistcoat.',
      oversized: 'Double-breasted Hollywood vintage tuxedo drape with wider sweeping lapels.',
      tailoringBreak: 'Clean no-break trouser hem resting perfectly flush with patent leather footwear.',
    },
    accessories: {
      shoe: { name: 'Patent Leather Evening Court Pumps', style: 'Formal Tuxedo Shoe', finish: 'Mirror-Gloss Patent Leather', tip: 'The black-tie gold standard for formal balls and galas.' },
      watch: { name: 'Ultra-Thin Onyx Dial Evening Watch', style: 'Black-Tie Watch', finish: '18k White Gold / Black Alligator', tip: 'Ultra-slim 6.5mm case slips under pleated tuxedo cuffs.' },
      ring: { name: 'Black Onyx & Platinum Signet Ring', style: 'Formal Signet', finish: 'Satin Platinum / Natural Onyx', tip: 'Subtle masculine elegance for evening wear.' },
      chain: { name: 'Concealed Platinum Collar Link', style: 'Sub-Collar Chain', finish: '950 Solid Platinum', tip: 'Hidden beneath formal bowtie collar.' },
      bracelet: { name: 'Black Titanium & Steel Clasp Cable', style: 'Formal Wrist Accent', finish: 'Brushed DLC Black Steel', tip: 'Understated accent matching tuxedo satin trim.' },
    },
  },
  // MEN - AMALFI SLUB LINEN RESORT SHIRT & CHINOS
  {
    id: 'm-resort-linen',
    key: 'shirt',
    title: 'Slub Linen Resort Shirt & Chinos (Coastal Soirée)',
    category: 'Destination Resort & Summer Gala',
    gender: 'male',
    suggestedBottom: 'chinos',
    defaultTopColor: '#C2410C',
    defaultBottomColor: '#FAF8F5',
    defaultAccentColor: '#EAB308',
    description: 'Garment-washed Italian slub linen shirt with camp collar, stone ivory relaxed chinos, and braided leather loafers.',
    fabricType: 'linen',
    occasion: 'resort',
    realModelImage: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&auto=format&fit=crop',
    modelSource: 'Pitti Uomo Cruise / GQ Riviera Style',
    fabricInfo: {
      name: '100% Normandy Pure Linen with Enzyme Wash',
      texture: 'Airy, highly breathable open-weave linen with natural soft crumple and moisture-wicking drape',
      gsm: '185 GSM Tropical Linen',
      breathability: 'High',
      care: 'Gentle wash cold, hang dry in breeze; avoid stiff ironing to preserve slub character',
    },
    sizeAdvice: {
      slim: 'Tapered sleeves worn rolled to forearms; relaxed hem worn untucked over chinos.',
      regular: 'Classic Riviera silhouette with generous chest ease for humid Mediterranean evenings.',
      oversized: 'Airy camp-collar aesthetic with dropped shoulders and wide-leg linen trousers.',
      tailoringBreak: 'Cropped ankle hem worn sockless over woven leather loafers or espadrilles.',
    },
    accessories: {
      shoe: { name: 'Woven Calfskin Riviera Penny Loafers', style: 'Woven Loafer', finish: 'Caramel Woven Calfskin', tip: 'Woven leather allows air circulation while looking dressed-up.' },
      watch: { name: 'Vintage Dive Watch on Tropical Rubber Strap', style: 'Resort Diver', finish: 'Brushed Steel / Navy Dial', tip: 'Waterproof luxury watch ready for yacht and sunset dinners.' },
      ring: { name: 'Oxidized Silver Nautical Compass Ring', style: 'Artisan Signet', finish: '925 Sterling Silver', tip: 'Maritime flair on the left hand.' },
      chain: { name: 'Raw Turquoise & Silver Bead Pendant', style: 'Resort Necklace', finish: 'Sterling Silver / Natural Stone', tip: 'Rests naturally at the open camp collar.' },
      bracelet: { name: 'Braided Tan Saddle Leather Cord', style: 'Coastal Wrap', finish: 'Vegetable-Tanned Italian Leather', tip: 'Ages beautifully with sun and saltwater exposure.' },
    },
  },

  // WOMEN - HANDCRAFTED ZARDOZI BRIDAL LEHENGA
  {
    id: 'w-lehenga-festive',
    key: 'croptop',
    title: 'Handcrafted Zardozi Bridal Lehenga (Royal Wedding)',
    category: 'Royal Wedding & Sangeet Gala',
    gender: 'female',
    suggestedBottom: 'skirt',
    defaultTopColor: '#991B1B',
    defaultBottomColor: '#991B1B',
    defaultAccentColor: '#D4AF37',
    description: '16-kali flared raw silk lehenga with hand-embroidered antique gold zardozi kalis, sweetheart choli, and scalloped organza dupatta.',
    fabricType: 'silk',
    occasion: 'wedding',
    realModelImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop',
    modelSource: 'Couture Bridal Lookbook / Vogue Weddings',
    fabricInfo: {
      name: '380 GSM Heavyweight Raw Silk with Zardozi Embroidery',
      texture: 'Substantial, regal silk canvas carrying dense metallic dabka and sequin borders with structural flare',
      gsm: '380 GSM Bridal Silk',
      breathability: 'Medium',
      care: 'Wrap in breathable pure muslin; store flat; specialist dry clean only',
    },
    sizeAdvice: {
      slim: 'Fitted sweetheart choli blouse with high-waist kalidar lehenga enhancing vertical height.',
      regular: '16-kali flare with interior can-can skirt offering dramatic ballroom spin volume.',
      oversized: 'Extended sweeping royal court train with pleated dupatta drape.',
      tailoringBreak: 'Lehenga skirt hem hovers exactly 1 inch above floor over embroidered heels.',
    },
    accessories: {
      shoe: { name: 'Hand-Embellished Zari Mojri Heels', style: 'Bridal Heel', finish: 'Velvet & Zari Thread', tip: '55mm cushioned block heel provides steady ballroom longevity.' },
      watch: { name: 'Filigree Antique Gold Bangle Watch', style: 'Heirloom Watch', finish: '22k Gold Foil', tip: 'Complements bridal chooda or gold kada stack.' },
      ring: { name: 'Polki Diamond & Emerald Statement Ring', style: 'Royal Cocktail', finish: '22k Gold Foil / Polki', tip: 'Catches warm chandelier reflection during vows.' },
      chain: { name: 'Polki Diamond & Emerald Bridal Choker', style: 'Bridal Collar', finish: '22k Antique Gold', tip: 'Frames the sweetheart neckline with imperial majesty.' },
      bracelet: { name: 'Temple Filigree Gold Kadas & Hathphool', style: 'Bridal Kadas', finish: 'Antique Gold Polish', tip: 'Adds rhythmic chime and traditional grandeur.' },
    },
  },

  // WOMEN - SCULPTED WIDE-LEG HALTER JUMPSUIT
  {
    id: 'w-jumpsuit-evening',
    key: 'top',
    title: 'Sculpted Wide-Leg Halter Jumpsuit (Art Gala & Cocktail)',
    category: 'Contemporary Art Gala & Cocktail',
    gender: 'female',
    suggestedBottom: 'trousers',
    defaultTopColor: '#064E3B',
    defaultBottomColor: '#064E3B',
    defaultAccentColor: '#EAB308',
    description: 'High-neck Japanese crepe jumpsuit with sculpted halter collar, fluid knife-pleated palazzo legs, and polished gold waist hardware.',
    fabricType: 'silk',
    occasion: 'cocktail',
    realModelImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop',
    modelSource: 'Paris Haute Couture / Harper\'s Bazaar Modern Gala',
    fabricInfo: {
      name: '280 GSM Heavy Japanese Double Crepe',
      texture: 'Crisp architectural drape with fluid silk backing that floats effortlessly without clinging',
      gsm: '280 GSM Luxury Crepe',
      breathability: 'High',
      care: 'Steam press on reverse; store on padded shoulder hanger',
    },
    sizeAdvice: {
      slim: 'Tailored waist contour with elongated palazzo inseam designed to skim over 90mm stilettos.',
      regular: 'Fluid ease through hips and thighs allowing statuesque movement across cocktail salons.',
      oversized: 'Architectural column drape with attached fluid neck scarf floating down the back.',
      tailoringBreak: 'Wide palazzo hem rests flush with the floor over pointed stiletto pumps.',
    },
    accessories: {
      shoe: { name: 'Mirrored Champagne Gold Pointed Heels', style: 'Evening Stiletto', finish: 'Mirror Metallic Leather', tip: 'Elongates legs beneath fluid palazzo hem.' },
      watch: { name: 'Minimalist Gold Bangle Timepiece', style: 'Evening Bangle Watch', finish: '18k Polished Brass', tip: 'Seamlessly doubles as high jewelry on the left wrist.' },
      ring: { name: 'Geometric Double-Band Gold Ring', style: 'Modern Architectural', finish: '18k Solid Gold', tip: 'Clean geometric lines accentuating hand gestures.' },
      chain: { name: 'Architectural Gold Torc Choker', style: 'Torc Collar', finish: 'Polished Brass Gold', tip: 'Accentuates the sculpted halter neckline.' },
      bracelet: { name: 'Solid Minimalist Gold Sculptural Cuff', style: 'Sculptural Cuff', finish: '18k Polished Gold', tip: 'Worn on the opposite wrist of the bangle timepiece.' },
    },
  },

  // WOMEN - ROYAL KALIDAR SILK ANARKALI
  {
    id: 'w-anarkali-royal',
    key: 'kurti',
    title: 'Royal Kalidar Silk Anarkali Suit (Festive Majesty)',
    category: 'Festive Celebration & Royal Soirée',
    gender: 'female',
    suggestedBottom: 'salwar_bottom',
    defaultTopColor: '#1E3A8A',
    defaultBottomColor: '#1E3A8A',
    defaultAccentColor: '#F59E0B',
    description: 'Floor-length 24-kali royal sapphire Chanderi silk anarkali with shimmering gota patti borders, gathered churidar, and tissue organza dupatta.',
    fabricType: 'silk',
    occasion: 'wedding',
    realModelImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop',
    modelSource: 'Jaipur Court Lookbook / Grazia Festive',
    fabricInfo: {
      name: '240 GSM Pure Chanderi Silk with Golden Zari Weft',
      texture: 'Weightless shimmer with crisp Kalidar panels that expand into an ethereal umbrella flare during walking',
      gsm: '240 GSM Chanderi Silk',
      breathability: 'High',
      care: 'Specialist silk dry clean; wrap in cotton fabric to preserve gota work',
    },
    sizeAdvice: {
      slim: 'Fitted empire bust with high kalidar waistline creating an elongated statuesque silhouette.',
      regular: 'Generous 24 kalis allowing full freedom for spins and traditional dance.',
      oversized: 'Angrakha overlapping front with gilded tassel dori tie-ups.',
      tailoringBreak: 'Floor-skimming kali hem hovering 0.5 inches above mojris.',
    },
    accessories: {
      shoe: { name: 'Embellished Velvet Khussa Mojris', style: 'Ceremonial Mojri', finish: 'Raw Silk & Brass Thread', tip: 'Padded insole for celebratory evening longevity.' },
      watch: { name: 'Heritage Filigree Bangle Watch', style: 'Traditional Watch', finish: '22k Antique Gold', tip: 'Pairs harmoniously with bridal chooda or bangles.' },
      ring: { name: 'Kundan Navratan Cocktail Ring', style: 'Imperial Statement', finish: '22k Gold Foil / Stones', tip: 'Commands attention during greeting and tea ceremonies.' },
      chain: { name: 'Layered Gold Gota & Pearl Mala', style: 'Festive Mala', finish: 'Emerald Beads & Gold Zari', tip: 'Drapes gracefully across the royal blue bodice.' },
      bracelet: { name: 'Gold Filigree Temple Kadas Stack', style: 'Heritage Bangles', finish: '22k Gold Finish', tip: 'Adds rhythmic chiming and regal charm.' },
    },
  },

  // WOMEN - AMALFI COAST TIERED FLORAL SILK SUNDRESS
  {
    id: 'w-sundress-resort',
    key: 'gown',
    title: 'Tiered Floral Silk Maxi Sundress (Resort & Garden)',
    category: 'Destination Resort & Summer Gala',
    gender: 'female',
    suggestedBottom: 'gown_skirt',
    defaultTopColor: '#C2410C',
    defaultBottomColor: '#C2410C',
    defaultAccentColor: '#EAB308',
    description: 'Tiered cascading silk chiffon sundress in sunlit terracotta and coral with sweetheart tie-shoulders and breezy ruffled hemline.',
    fabricType: 'silk',
    occasion: 'resort',
    realModelImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop',
    modelSource: 'Riviera Resort Cruise / Vogue Resort',
    fabricInfo: {
      name: '80 GSM Pure Featherweight Silk Chiffon',
      texture: 'Airy, floating texture that catches sea breezes with romantic dynamic ripples',
      gsm: '80 GSM Silk Chiffon',
      breathability: 'High',
      care: 'Delicate cold hand wash; dry flat in shade',
    },
    sizeAdvice: {
      slim: 'Tie-shoulder bows adjusted snug with smocked torso contouring down to hip flare.',
      regular: 'Relaxed tiered flow allowing effortless dining and boardwalk strolling.',
      oversized: 'Bohemian resort silhouette with flowing ruffle flounce.',
      tailoringBreak: 'Floor-grazing hem hovering neatly over woven raffia espadrilles.',
    },
    accessories: {
      shoe: { name: 'Woven Raffia & Metallic Espadrille Wedges', style: 'Resort Wedge', finish: 'Natural Jute & Gold Nappa', tip: 'Solid footing on coastal boardwalks and sandy garden paths.' },
      watch: { name: 'Mother-of-Pearl Dial Bangle Timepiece', style: 'Resort Watch', finish: 'Warm Yellow Gold', tip: 'Catches coastal golden hour sunsets.' },
      ring: { name: 'Raw Hammered Citrine Gemstone Ring', style: 'Resort Ring', finish: '22k Wire-Wrapped Gold', tip: 'Golden warmth on sun-kissed skin.' },
      chain: { name: 'Layered Scallop Shell & Gold Coin Pendant', style: 'Resort Layered Chain', finish: '18k Gold Dipped', tip: 'Rests across the open sweetheart décolletage.' },
      bracelet: { name: 'Stack of Hammered Brass Bangles', style: 'Boho Luxe Bangles', finish: 'Organic Brushed Brass', tip: 'Rhythmic chiming with each step.' },
    },
  },

  // WOMEN - ARCHITECTURAL ASYMMETRICAL CREPE MIDI
  {
    id: 'w-cocktail-crepe',
    key: 'top',
    title: 'Architectural Asymmetrical Crepe Midi (Modern Cocktail)',
    category: 'Black-Tie Dinner & Cocktail',
    gender: 'female',
    suggestedBottom: 'skirt',
    defaultTopColor: '#881337',
    defaultBottomColor: '#881337',
    defaultAccentColor: '#E2E8F0',
    description: 'One-shoulder bonded stretch-crepe column dress in deep bordeaux wine with sculpted shoulder fold and back-vent pencil hem.',
    fabricType: 'silk',
    occasion: 'cocktail',
    realModelImage: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop',
    modelSource: 'Vogue Metropolitan / Pinterest Contemporary Cocktail',
    fabricInfo: {
      name: '310 GSM Bonded Stretch Crepe with Interior Bodice Boning',
      texture: 'Sculptural, smoothing matte fabric that holds clean architectural lines without shifting',
      gsm: '310 GSM Bonded Crepe',
      breathability: 'Medium',
      care: 'Specialist dry clean; store on shaped form hanger',
    },
    sizeAdvice: {
      slim: 'Contoured column fit following body contours down to below-knee pencil hem.',
      regular: 'Balanced ease across hips with hidden stretch backing for comfortable seated dinners.',
      oversized: 'Cape-sleeve extension draping from the single shoulder.',
      tailoringBreak: 'Calf-length hem resting 3 inches below the knee over minimal stiletto sandals.',
    },
    accessories: {
      shoe: { name: 'Minimalist Stiletto Ankle-Strap Sandals', style: 'Evening Stiletto', finish: 'Nappa Black Leather', tip: 'Barely-there strap highlighting foot arches.' },
      watch: { name: 'Ultra-Thin White Gold Jewelry Timepiece', style: 'Cocktail Watch', finish: '18k White Gold / Onyx', tip: 'Discrete profile blending with evening jewelry.' },
      ring: { name: 'Emerald-Cut Solitaire Cocktail Ring', style: 'Cocktail Statement', finish: '18k White Gold & Crystal', tip: 'Flashes brilliance under low evening lighting.' },
      chain: { name: 'Cascading Crystal Chandelier Drop Earrings', style: 'Earring Statement', finish: 'Rhodium Plated', tip: 'Balances the bare shoulder opposite the strap.' },
      bracelet: { name: 'Diamond Tennis Line Bracelet', style: 'Classic Tennis Line', finish: 'Platinum / Crystal', tip: 'Delicate shimmer on the wrist.' },
    },
  },

  // MEN - IMPERIAL HAND-EMBROIDERED ZARI SHERWANI
  {
    id: 'm-sherwani-wedding',
    key: 'kurta',
    title: 'Imperial Zari Silk Sherwani (Royal Wedding Groom)',
    category: 'Wedding & Royal Celebration',
    gender: 'male',
    suggestedBottom: 'salwar_bottom',
    defaultTopColor: '#FAF8F5',
    defaultBottomColor: '#FAF8F5',
    defaultAccentColor: '#D4AF37',
    description: 'Pure Matka silk hand-embroidered sherwani with antique gold zardozi jaal, mandarin stand collar, gathered churidar, and embroidered velvet stole.',
    fabricType: 'silk',
    occasion: 'wedding',
    realModelImage: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop',
    modelSource: 'Royal Atelier Lookbook / GQ Groom Special',
    fabricInfo: {
      name: '360 GSM Pure Handloom Matka Silk with Real Gold Zari',
      texture: 'Regal architectural structure with substantial weight that maintains clean vertical lines without wrinkling',
      gsm: '360 GSM Heavy Silk',
      breathability: 'High',
      care: 'Specialist royal garment dry clean; store with cedar blocks in canvas bag',
    },
    sizeAdvice: {
      slim: 'Tailored chest suppression with structured shoulder pads creating an imposing, athletic frame.',
      regular: 'Imperial court fit allowing ceremonial longevity and comfortable banquet dining.',
      oversized: 'Royal Achkan style cut with overlapping front placket.',
      tailoringBreak: 'Churidar gathers neatly at ankle with 5-6 natural folds above velvet mojris.',
    },
    accessories: {
      shoe: { name: 'Embroidered Velvet Zari Juttis', style: 'Royal Mojri', finish: 'Italian Velvet & Gold Thread', tip: 'Curled toe crest with memory foam arch cushion.' },
      watch: { name: 'Vintage Yellow Gold Dress Chronograph', style: 'Heirloom Watch', finish: '18k Yellow Gold', tip: 'Harmonizes with gilded sherwani buttons.' },
      ring: { name: 'Lion Crest 22k Gold Signet Ring', style: 'Royal Signet', finish: '22k Solid Gold', tip: 'Masculine heirloom statement on the right hand.' },
      chain: { name: 'Multi-Strand Basra Pearl & Emerald Mala', style: 'Royal Wedding Mala', finish: 'Natural Pearls & Emeralds', tip: 'Drapes across the chest with Maharaja elegance.' },
      bracelet: { name: 'Solid Heavy Gold Kada with Engraved Finials', style: 'Traditional Kada', finish: '22k Antique Gold', tip: 'Commands respect and traditional presence.' },
    },
  },

  // MEN - INDO-WESTERN DRAPED ASYMMETRICAL KURTA
  {
    id: 'm-indowestern-drape',
    key: 'kurta',
    title: 'Indo-Western Asymmetrical Kurta & Bandi (Festive Sangeet)',
    category: 'Festive Sangeet & Cocktail Celebration',
    gender: 'male',
    suggestedBottom: 'trousers',
    defaultTopColor: '#881337',
    defaultBottomColor: '#0F172A',
    defaultAccentColor: '#D4AF37',
    description: 'Draped asymmetrical cowl-hem kurta in deep wine marsala paired with an embroidered raw silk Nehru bandi jacket and slim tailored wool trousers.',
    fabricType: 'silk',
    occasion: 'wedding',
    realModelImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop',
    modelSource: 'Contemporary Couturier Lookbook / Men\'s Vogue India',
    fabricInfo: {
      name: '240 GSM Mulberry Silk Georgette & Raw Silk Brocade',
      texture: 'Fluid diagonal cowl drape contrasted by crisp architectural stand-collar jacket',
      gsm: '240 GSM Silk Blend',
      breathability: 'High',
      care: 'Dry clean only; steam cowl drape gently before wearing',
    },
    sizeAdvice: {
      slim: 'Structured Nehru vest with fluid diagonal cowl hem extending down the left thigh.',
      regular: 'Balanced ease across chest with tapered modern trousers.',
      oversized: 'Extended flowing asymmetrical drape for high-fashion runway statement.',
      tailoringBreak: 'No-break trouser hem resting cleanly over double-monkstrap shoes.',
    },
    accessories: {
      shoe: { name: 'Hand-Burnished Double Monkstrap Shoes', style: 'Formal Monkstrap', finish: 'Espresso Box Calf', tip: 'Brass buckles echoing Nehru jacket buttons.' },
      watch: { name: 'Bronze Pilot Chronograph on Saddle Leather', style: 'Sartorial Timepiece', finish: 'Aged Bronze & Calfskin', tip: 'Warm metallic accents matching the marsala tones.' },
      ring: { name: 'Hammered Brass Signet Ring', style: 'Artisan Signet', finish: 'Aged Brass', tip: 'Understated masculine elegance.' },
      chain: { name: 'Vintage Pocket Watch Chain', style: 'Vest Chain', finish: 'Aged Brass Link', tip: 'Drapes from jacket buttonhole to welt pocket.' },
      bracelet: { name: 'Braided Italian Saddle Leather Cuff', style: 'Leather Cuff', finish: 'Dark Espresso', tip: 'Balances the left wrist.' },
    },
  },

  // MEN - NEAPOLITAN DOUBLE-BREASTED SLUB LINEN SUIT
  {
    id: 'm-linen-suit',
    key: 'blazer',
    title: 'Neapolitan Double-Breasted Linen Suit (Riviera Summer)',
    category: 'Destination Resort & Summer Gala',
    gender: 'male',
    suggestedBottom: 'chinos',
    defaultTopColor: '#3F6212',
    defaultBottomColor: '#3F6212',
    defaultAccentColor: '#78350F',
    description: 'Unstructured double-breasted 4x2 sage olive slub linen jacket with pleated spalla camicia shirt-shoulders and double-pleated Gurkha trousers.',
    fabricType: 'linen',
    occasion: 'resort',
    realModelImage: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&auto=format&fit=crop',
    modelSource: 'Pitti Uomo Florence / Riviera Tailoring',
    fabricInfo: {
      name: '240 GSM Pure Normandy Open-Weave Slub Linen',
      texture: 'Breathable, tactile slub character with natural sprezzatura soft crumple',
      gsm: '240 GSM Normandy Linen',
      breathability: 'High',
      care: 'Hang dry in breeze; avoid hard pressing to preserve organic linen texture',
    },
    sizeAdvice: {
      slim: 'Tapered waist with soft unpadded shoulders hugging natural contours.',
      regular: 'Classic Italian Riviera ease with room for light linen popovers beneath.',
      oversized: 'Relaxed wide-lapel drape with generous wide-leg Gurkha trousers.',
      tailoringBreak: 'Cropped ankle hem resting cleanly above sockless Belgian suede loafers.',
    },
    accessories: {
      shoe: { name: 'Snuff Suede Belgian Loafers', style: 'Belgian Loafer', finish: 'Reverse Calf Suede', tip: 'Hand-sewn apron worn sockless with invisible bamboo liners.' },
      watch: { name: 'Field Watch on Olive Canvas Strap', style: 'Vintage Field Watch', finish: 'Matte Sandblasted Bronze', tip: 'Rugged yet refined outdoor luxury presence.' },
      ring: { name: 'Oxidized Silver Nautical Compass Band', style: 'Artisan Band', finish: '925 Sterling Silver', tip: 'Maritime flair on the left hand.' },
      chain: { name: 'Raw Turquoise & Silver Bead Pendant', style: 'Resort Necklace', finish: 'Sterling Silver / Natural Stone', tip: 'Rests naturally at the open camp collar spread.' },
      bracelet: { name: 'Braided Tan Italian Leather Cord', style: 'Coastal Wrap', finish: 'Vegetable-Tanned Calfskin', tip: 'Ages beautifully with sun and saltwater exposure.' },
    },
  },

  // MEN - ROYAL HERITAGE MATKA SILK PATHANI SUIT
  {
    id: 'm-pathani-festive',
    key: 'kurta',
    title: 'Royal Heritage Matka Silk Pathani Suit (Traditional Festive)',
    category: 'Smart Casual & Commute',
    gender: 'male',
    suggestedBottom: 'salwar_bottom',
    defaultTopColor: '#1E293B',
    defaultBottomColor: '#1E293B',
    defaultAccentColor: '#94A3B8',
    description: 'Structured stand-collar pathani kurta tunic with military shoulder epaulets, flapped chest pockets, and deep-pleated salwar bottoms in charcoal slate.',
    fabricType: 'silk',
    occasion: 'casual',
    realModelImage: '/images/branding/hero-banner.jpg',
    modelSource: 'Heritage Crafts Collective / Men\'s Ethnic Review',
    fabricInfo: {
      name: '280 GSM Textured Handloom Matka Silk with Slub Weave',
      texture: 'Substantial, masculine tactile weave with crisp crease retention and natural slub texture',
      gsm: '280 GSM Matka Silk',
      breathability: 'High',
      care: 'Specialist dry clean; press medium steam with protective cloth',
    },
    sizeAdvice: {
      slim: 'Tailored chest and tapered sleeves with interior button tabs to roll cuffs securely.',
      regular: 'Generous traditional cut allowing complete ease for long celebratory gatherings.',
      oversized: 'Loose Pathani tunic falling gracefully down to mid-knee.',
      tailoringBreak: 'Deep-pleated salwar gathers securely into structured ankle cuffs over Peshawari sandals.',
    },
    accessories: {
      shoe: { name: 'Handcrafted Peshawari Leather Sandals', style: 'Peshawari Chappal', finish: 'Full-Grain Buffalo Leather', tip: 'Semi-pointed toe with sturdy non-slip tire-tread sole.' },
      watch: { name: 'Stainless Steel Military Field Chronometer', style: 'Field Watch', finish: 'Brushed Steel / Matte Black', tip: 'Echoes the disciplined military structure of pathani epaulets.' },
      ring: { name: 'Solid Heavy Sterling Silver Signet', style: 'Masculine Signet', finish: 'Oxidized 925 Silver', tip: 'Dignified presence on the right hand.' },
      chain: { name: 'Concealed Silver Wheat Link Collar Chain', style: 'Sub-Collar Chain', finish: 'Solid Silver', tip: 'Rests beneath the opened shirt collar.' },
      bracelet: { name: 'Substantial Engraved Silver Kada', style: 'Traditional Kada', finish: 'Solid Sterling Silver', tip: 'Adds weighty masculine authority on the wrist.' },
    },
  },

  // MEN - LUXURY URBAN FRENCH TERRY TRACKSUIT
  {
    id: 'm-streetwear-lux',
    key: 'top',
    title: 'Luxury Heavyweight French Terry Tracksuit (Urban Streetwear)',
    category: 'Smart Casual & Commute',
    gender: 'male',
    suggestedBottom: 'tracks',
    defaultTopColor: '#FAF8F5',
    defaultBottomColor: '#FAF8F5',
    defaultAccentColor: '#0F172A',
    description: 'Boxy 480 GSM organic cotton French terry hoodie with seamless kangaroo pocket paired with tapered cargo track pants and sculptural designer runners.',
    fabricType: 'wool',
    occasion: 'casual',
    realModelImage: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop',
    modelSource: 'Tokyo Atelier Street / Highsnobiety Luxury Capsule',
    fabricInfo: {
      name: '480 GSM Heavyweight 100% Organic Looped French Terry',
      texture: 'Substantial, ultra-plush fabric that holds an architectural boxy drape without sagging',
      gsm: '480 GSM French Terry',
      breathability: 'High',
      care: 'Machine wash cold inside out; hang dry in shade; do not tumble dry',
    },
    sizeAdvice: {
      slim: 'Structured shoulder line with tapered cuffs resting right above sneaker collar.',
      regular: 'Boxy relaxed streetwear cut with dropped shoulders and roomy hood.',
      oversized: 'Dramatic avant-garde oversized drape extending below hip line.',
      tailoringBreak: 'Elasticized ribbed ankle cuffs resting cleanly over chunky sneaker tongue.',
    },
    accessories: {
      shoe: { name: 'Chunky Architectural Designer Runners', style: 'Luxury Sneaker', finish: 'Nubuck Leather & Vibram Rubber', tip: 'Sculptural sole providing aggressive, modern street stance.' },
      watch: { name: 'Matte Black DLC Sports Watch on Rubber Strap', style: 'Sport Chrono', finish: 'Matte DLC Black Steel', tip: 'Waterproof high-tech performance aesthetic.' },
      ring: { name: 'Brushed Titanium Minimalist Band', style: 'Modern Industrial', finish: 'Satin Titanium', tip: 'Clean geometric accent on left index finger.' },
      chain: { name: 'Sterling Silver 8mm Cuban Curb Chain', style: 'Street Chain', finish: 'Solid 925 Silver', tip: 'Rests cleanly over the double-layered hood collar.' },
      bracelet: { name: 'Matte Black Steel Cable Cuff', style: 'Industrial Cuff', finish: 'DLC Black Coated', tip: 'Minimalist industrial wrist accent.' },
    },
  },
];

// Harmonic Fashion Presets
const HARMONIC_PRESETS = [
  { name: 'Midnight Navy & Gold', top: '#0F172A', bottom: '#1E293B', accent: '#D4AF37' },
  { name: 'Emerald & Warm Sand', top: '#064E3B', bottom: '#FAF8F5', accent: '#F59E0B' },
  { name: 'Burgundy & Soft Cream', top: '#881337', bottom: '#FAF8F5', accent: '#D97706' },
  { name: 'Slate Blue & Charcoal', top: '#1E3A8A', bottom: '#0F172A', accent: '#93C5FD' },
  { name: 'Terracotta & Olive', top: '#C2410C', bottom: '#3F6212', accent: '#EAB308' },
  { name: 'Minimalist Ivory & Noir', top: '#FAF8F5', bottom: '#0A192F', accent: '#E2E8F0' },
];

export default function MannequinVisualizer({
  gender = 'female',
  onGenderChange,
  outfit,
  className = '',
  showControls = true,
  onGarmentChange,
  onSaveOutfit,
}: MannequinVisualizerProps) {
  const { isAuthenticated } = useAuth();
  const collection = useCollection();
  const rewards = useRewards();

  const [skinTone, setSkinTone] = useState<SkinTone>('golden_olive');
  const [activeGender, setActiveGender] = useState<Gender>(gender);
  const [isZoomed, setIsZoomed] = useState(false);
  
  // Display Mode: 3D Runway Walk vs Real Human Model Studio
  const [displayMode, setDisplayMode] = useState<'catwalk' | 'real_model'>('catwalk');
  
  // Real runway walk state
  const [isWalkActive, setIsWalkActive] = useState(true);
  const [walkSpeed, setWalkSpeed] = useState<'slow' | 'medium' | 'fast'>('medium');
  const [turntableAngle, setTurntableAngle] = useState<0 | 30 | -30 | 180>(0);
  
  // Garment Fit: slim, regular, oversized
  const [fitStyle, setFitStyle] = useState<'slim' | 'regular' | 'oversized'>('regular');
  const [selectedSize, setSelectedSize] = useState<'XS' | 'S' | 'M' | 'L' | 'XL'>('M');
  const [activeTab, setActiveTab] = useState<'accessories' | 'fabric' | 'size' | 'occasion'>('accessories');

  const [mannequinForm, setMannequinForm] = useState<'human' | 'dress_form'>('human');
  
  // Local outfit override
  const [localOutfit, setLocalOutfit] = useState<OutfitConfig | null>(null);

  const [isAiSuggesting, setIsAiSuggesting] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<ClothSuggestionResponse | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  // Sync parent gender
  useEffect(() => {
    setActiveGender(gender);
    setLocalOutfit(null);
  }, [gender]);

  // Sync parent outfit
  useEffect(() => {
    if (outfit && (!localOutfit || localOutfit.title !== outfit.title || localOutfit.topColor !== outfit.topColor)) {
      setLocalOutfit(outfit);
    }
  }, [outfit]);

  const handleGenderToggle = (newGender: Gender) => {
    setActiveGender(newGender);
    setLocalOutfit(null);
    onGenderChange?.(newGender);
    setAiSuggestion(null);
  };

  const skin = SKIN_TONES[skinTone] || SKIN_TONES.golden_olive;

  // Active outfit configuration (Local override > prop outfit > default)
  const activeOutfit: OutfitConfig = useMemo(() => {
    if (localOutfit) return localOutfit;
    if (outfit) return outfit;
    return activeGender === 'male'
      ? {
        title: 'Savile Row Tailored Suiting (Executive Interview)',
        topType: 'blazer',
        topColor: '#0F172A',
        bottomType: 'trousers',
        bottomColor: '#0F172A',
        outerwearColor: '#FAF8F5',
        accentColor: '#FAF8F5',
        description: 'Two-piece navy bespoke wool suit with peak lapels, sea-island cotton shirt, and pressed dress trousers. The gold standard for interviews.',
        fabricType: 'wool',
        occasion: 'interview',
      }
      : {
        title: 'Savile Row Power Suiting (Executive Interview)',
        topType: 'blazer',
        topColor: '#0F172A',
        bottomType: 'trousers',
        bottomColor: '#0F172A',
        accentColor: '#FAF8F5',
        description: 'Sculpted wool-crepe blazer over an ivory silk blouse with fluid pressed trousers. Projects competence and boardroom authority.',
        fabricType: 'wool',
        occasion: 'interview',
      };
  }, [localOutfit, outfit, activeGender]);

  const availableSilhouettes = SILHOUETTES.filter(
    (g) => g.gender === activeGender || g.gender === 'both'
  );

  // Find matching silhouette metadata for rich accessories & fabrics
  const currentSilhouette = useMemo(() => {
    return (
      availableSilhouettes.find((s) => s.title === activeOutfit.title) ||
      availableSilhouettes.find((s) => s.key === activeOutfit.topType) ||
      availableSilhouettes[0]
    );
  }, [availableSilhouettes, activeOutfit]);

  const handleSelectSilhouette = (sil: GarmentSilhouette) => {
    const updatedOutfit: OutfitConfig = {
      title: sil.title,
      topType: sil.key,
      topColor: sil.defaultTopColor,
      bottomType: sil.suggestedBottom,
      bottomColor: sil.defaultBottomColor,
      accentColor: sil.defaultAccentColor,
      description: sil.description,
      fabricType: sil.fabricType,
      occasion: sil.occasion,
    };
    setLocalOutfit(updatedOutfit);
    onGarmentChange?.(updatedOutfit);
  };

  const handleApplyHarmonicPreset = (preset: typeof HARMONIC_PRESETS[0]) => {
    const updated: OutfitConfig = {
      ...activeOutfit,
      topColor: preset.top,
      bottomColor: preset.bottom,
      accentColor: preset.accent,
    };
    setLocalOutfit(updated);
    onGarmentChange?.(updated);
  };

  const handleQuickOccasion = (occ: 'interview' | 'wedding' | 'cocktail' | 'casual' | 'graduation' | 'resort') => {
    const match = availableSilhouettes.find((s) => s.occasion === occ) || availableSilhouettes[0];
    if (match) {
      handleSelectSilhouette(match);
    }
  };

  const handleFetchAiSuggestion = async () => {
    setIsAiSuggesting(true);
    setAiSuggestion(null);

    try {
      const response = await fetch('/api/cloth-suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gender: activeGender,
          occasion: activeOutfit.occasion || 'Formal Gala & Interview',
          weather: 'Mild Breezy',
          colorPreference: activeOutfit.topColor,
          skinTone: skin.label,
        }),
      });

      if (response.ok) {
        const data: ClothSuggestionResponse = await response.json();
        setAiSuggestion(data);

        const newOutfitConfig: OutfitConfig = {
          title: data.title,
          topType: (data.suggestedClothKey || 'blazer') as OutfitConfig['topType'],
          topColor: data.recommendedTopColor || '#0F172A',
          bottomType: activeGender === 'male' ? 'trousers' : 'skirt',
          bottomColor: data.recommendedBottomColor || '#FAF8F5',
          accentColor: data.recommendedAccentColor || '#D4AF37',
          description: data.aiStylistRationale,
          fabricType: 'silk',
        };
        setLocalOutfit(newOutfitConfig);
        onGarmentChange?.(newOutfitConfig);
        rewards.earnPoints('try_suggestion');
      }
    } catch (err) {
      console.error('AI suggestion failed:', err);
    } finally {
      setIsAiSuggesting(false);
    }
  };

  const handleSaveOutfitClick = () => {
    const outfitItem = {
      id: Date.now().toString(),
      name: activeOutfit.title || 'Curated Fashion Ensemble',
      category: 'Other' as const,
      color: activeOutfit.topColor,
      tags: [activeGender, activeOutfit.topType, activeOutfit.bottomType, `${fitStyle.toUpperCase()} FIT`, 'Mannequin Curated'],
      notes: `${activeOutfit.description || 'Draped on interactive studio mannequin'} (Accent: ${activeOutfit.accentColor || 'Gold'})`,
      createdAt: new Date().toISOString(),
    };
    collection.addItem(outfitItem);
    rewards.earnPoints('add_to_collection');
    onSaveOutfit?.(activeOutfit);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3500);
  };

  const topColor = activeOutfit.topColor || '#0F172A';
  const bottomColor = activeOutfit.bottomColor || '#FAF8F5';
  const accentColor = activeOutfit.accentColor || '#D4AF37';

  // Walk animation timing
  const walkCycleDuration = walkSpeed === 'fast' ? 1.0 : walkSpeed === 'slow' ? 2.2 : 1.5;

  // Garment Fit Multiplier (Fixes the Garment Fit bug where scale was ignored)
  const fitScale = fitStyle === 'slim' ? 0.92 : fitStyle === 'oversized' ? 1.08 : 1.0;
  const waistSuppress = fitStyle === 'slim' ? 6 : fitStyle === 'oversized' ? -8 : 0;

  return (
    <div className={`w-full flex flex-col items-center select-none text-[#FAF8F5] ${className}`}>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        title="Sync to Cloud Wardrobe"
        message="Your look is saved locally! Sign in to sync your wardrobe across all devices."
      />

      {/* TOP OCCASION SELECTOR & GENDER BAR */}
      {showControls && (
        <div className="w-full flex flex-col gap-3 mb-4 z-10 relative">
          <div className="w-full flex flex-wrap items-center justify-between gap-3">
            {/* Gender Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-[#050d1a] rounded-2xl border border-[#FAF8F5]/15">
              <button
                onClick={() => handleGenderToggle('female')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeGender === 'female'
                    ? 'bg-[#FAF8F5] text-[#0a192f] shadow-md font-bold'
                    : 'text-[#FAF8F5]/60 hover:text-white'
                }`}
              >
                <span>👗</span>
                <span>Women</span>
              </button>
              <button
                onClick={() => handleGenderToggle('male')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeGender === 'male'
                    ? 'bg-[#FAF8F5] text-[#0a192f] shadow-md font-bold'
                    : 'text-[#FAF8F5]/60 hover:text-white'
                }`}
              >
                <span>👔</span>
                <span>Men</span>
              </button>
            </div>

            {/* Display Mode: Runway Catwalk vs Real Human Model Studio */}
            <div className="flex items-center bg-[#050d1a] p-1 rounded-2xl border border-[#FAF8F5]/15 text-xs">
              <button
                onClick={() => setDisplayMode('catwalk')}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                  displayMode === 'catwalk'
                    ? 'bg-[#1e3a8a] text-white shadow-md'
                    : 'text-[#FAF8F5]/60 hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>3D Catwalk Walk</span>
              </button>
              <button
                onClick={() => setDisplayMode('real_model')}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                  displayMode === 'real_model'
                    ? 'bg-[#FAF8F5] text-[#0a192f] shadow-md'
                    : 'text-[#FAF8F5]/60 hover:text-white'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Real Human Model</span>
              </button>
            </div>

            {/* Skin Tone Selector (for Catwalk) */}
            {displayMode === 'catwalk' && (
              <div className="flex items-center gap-1.5 bg-[#050d1a] p-1 rounded-2xl border border-[#FAF8F5]/15">
                {(['soft_ivory', 'warm_almond', 'golden_olive', 'bronze_tan', 'rich_espresso', 'deep_ebony'] as SkinTone[]).map((toneKey) => (
                  <button
                    key={toneKey}
                    onClick={() => setSkinTone(toneKey)}
                    title={SKIN_TONES[toneKey].label}
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                      skinTone === toneKey
                        ? 'ring-2 ring-[#FAF8F5] scale-110 shadow-md'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: SKIN_TONES[toneKey].base }}
                  >
                    {skinTone === toneKey && <Check className="w-3 h-3 text-[#0a192f] stroke-[3]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick 1-Click Occasions: Job Interview, Wedding, Cocktail, Casual */}
          <div className="w-full flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-[10px] font-mono uppercase text-[#93c5fd] font-bold shrink-0">
              Occasion Fit:
            </span>
            <button
              onClick={() => handleQuickOccasion('interview')}
              className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 shrink-0 transition-all border ${
                activeOutfit.title?.toLowerCase().includes('interview')
                  ? 'bg-[#FAF8F5] text-[#0a192f] border-white font-bold shadow-md'
                  : 'bg-[#0a192f] text-[#FAF8F5]/80 border-[#FAF8F5]/15 hover:bg-[#16366f]/50'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Job Interview</span>
            </button>
            <button
              onClick={() => handleQuickOccasion('wedding')}
              className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 shrink-0 transition-all border ${
                activeOutfit.title?.toLowerCase().includes('wedding') || activeOutfit.title?.toLowerCase().includes('gown')
                  ? 'bg-[#FAF8F5] text-[#0a192f] border-white font-bold shadow-md'
                  : 'bg-[#0a192f] text-[#FAF8F5]/80 border-[#FAF8F5]/15 hover:bg-[#16366f]/50'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              <span>Wedding &amp; Reception</span>
            </button>
            <button
              onClick={() => handleQuickOccasion('cocktail')}
              className="px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 shrink-0 transition-all border bg-[#0a192f] text-[#FAF8F5]/80 border-[#FAF8F5]/15 hover:bg-[#16366f]/50"
            >
              <GlassWater className="w-3.5 h-3.5 text-amber-400" />
              <span>Cocktail Gala</span>
            </button>
            <button
              onClick={() => handleQuickOccasion('casual')}
              className="px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 shrink-0 transition-all border bg-[#0a192f] text-[#FAF8F5]/80 border-[#FAF8F5]/15 hover:bg-[#16366f]/50"
            >
              <PartyPopper className="w-3.5 h-3.5 text-blue-400" />
              <span>Smart Casual</span>
            </button>
            <button
              onClick={() => handleQuickOccasion('graduation')}
              className="px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 shrink-0 transition-all border bg-[#0a192f] text-[#FAF8F5]/80 border-[#FAF8F5]/15 hover:bg-[#16366f]/50"
            >
              <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
              <span>Convocation</span>
            </button>
            <button
              onClick={() => handleQuickOccasion('resort')}
              className="px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 shrink-0 transition-all border bg-[#0a192f] text-[#FAF8F5]/80 border-[#FAF8F5]/15 hover:bg-[#16366f]/50"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>Resort Soirée</span>
            </button>
          </div>
        </div>
      )}

      {/* QUICK SILHOUETTE SELECTOR STRIP */}
      {showControls && (
        <div className="w-full mb-4 z-10 relative space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#FAF8F5]/70">
            <span className="flex items-center gap-1.5 font-bold uppercase text-[#93c5fd]">
              <Layers className="w-3.5 h-3.5" />
              Real Clothes Silhouettes
            </span>
            <span>Click to drape on runway model</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {availableSilhouettes.map((sil) => {
              const isSelected = activeOutfit.title === sil.title || (!localOutfit && outfit?.title === sil.title);
              return (
                <button
                  key={sil.id}
                  onClick={() => handleSelectSilhouette(sil)}
                  className={`group relative shrink-0 px-3 py-2 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                    isSelected
                      ? 'border-[#FAF8F5] bg-[#FAF8F5] text-[#0a192f] shadow-lg scale-102 font-bold'
                      : 'border-[#FAF8F5]/15 bg-[#0a192f]/70 text-[#FAF8F5] hover:bg-[#16366f]/50'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full border border-black/20 shrink-0 flex items-center justify-center" style={{ backgroundColor: sil.defaultTopColor }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sil.defaultAccentColor }} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs truncate max-w-[140px]">{sil.title}</p>
                    <p className={`text-[9px] uppercase font-mono ${isSelected ? 'text-[#1e3a8a]' : 'text-[#93c5fd]'}`}>
                      {sil.category}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Harmonic Palettes */}
          <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 text-xs">
            <span className="text-[10px] font-mono uppercase text-[#FAF8F5]/60 shrink-0 flex items-center gap-1">
              <Palette className="w-3 h-3 text-[#93c5fd]" />
              Harmonies:
            </span>
            {HARMONIC_PRESETS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleApplyHarmonicPreset(p)}
                className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#050d1a] border border-[#FAF8F5]/15 hover:border-[#FAF8F5]/40 text-[10px] font-mono text-[#FAF8F5]/80 hover:text-white transition-all"
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.top }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.bottom }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.accent }} />
                <span className="ml-1 truncate">{p.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* GEMINI AI ASSISTANT BANNER */}
      {showControls && (
        <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-4 p-3 rounded-2xl bg-[#0f254e]/60 border border-[#FAF8F5]/15 z-10 relative">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#1e3a8a] text-white">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                AI Mannequin Stylist
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#1e3a8a]/40 text-[#93c5fd] font-mono border border-[#FAF8F5]/20">
                  Gemini Flash 3.6
                </span>
              </h4>
              <p className="text-[11px] text-[#FAF8F5]/70">
                Live harmonic draping and real fabric texture styling
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleFetchAiSuggestion}
              disabled={isAiSuggesting}
              className="px-3.5 py-1.5 rounded-xl bg-[#1e3a8a] hover:bg-[#2563eb] text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {isAiSuggesting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Draping...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#fffff0]" />
                  <span>AI Styling Suggestion</span>
                </>
              )}
            </button>

            <button
              onClick={handleSaveOutfitClick}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
                savedToast
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#FAF8F5] hover:bg-white text-[#0a192f]'
              }`}
            >
              {savedToast ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  <span>Saved to Wardrobe!</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5 text-[#1e3a8a]" />
                  <span>Save Look</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* AI SUGGESTION FEEDBACK CARD */}
      <AnimatePresence>
        {aiSuggestion && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full mb-4 p-3.5 rounded-2xl bg-[#0a192f] border border-[#FAF8F5]/20 text-xs space-y-1.5 z-10 relative shadow-xl"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#93c5fd] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
                Gemini Style Advice: {aiSuggestion.title}
              </span>
              <span className="text-[10px] text-[#fffff0] font-mono px-2 py-0.5 rounded-full bg-[#1e3a8a]/50">
                Fit: {aiSuggestion.fitRecommendation.toUpperCase()}
              </span>
            </div>
            <p className="text-[#FAF8F5]/90 leading-relaxed text-[11px]">{aiSuggestion.aiStylistRationale}</p>
            {aiSuggestion.fabricTexture && (
              <p className="text-[10px] font-mono text-[#D4AF37]">
                Fabric Texture: {aiSuggestion.fabricTexture}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* CANVAS: 3D RUNWAY CATWALK OR REAL HUMAN MODEL STUDIO       */}
      {/* ========================================================= */}
      <div className="relative w-full flex flex-col items-center justify-center py-2">
        <div
          className="relative w-full max-w-lg min-h-[520px] rounded-3xl overflow-hidden border border-[#FAF8F5]/20 shadow-2xl bg-gradient-to-b from-[#071329] via-[#0a192f] to-[#030812] flex flex-col items-center justify-center p-4 group"
        >
          {/* MODE A: REAL HUMAN MODEL STUDIO */}
          {displayMode === 'real_model' ? (
            <div className="relative w-full h-[480px] rounded-2xl overflow-hidden flex flex-col items-center justify-between">
              <img
                src={currentSilhouette.realModelImage}
                alt={currentSilhouette.title}
                className="w-full h-full object-cover object-top filter brightness-95 contrast-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-transparent to-black/30 pointer-events-none" />

              {/* Source Badge */}
              <div className="absolute top-3 left-3 bg-[#0a192f]/90 backdrop-blur-md px-3 py-1 rounded-full border border-[#FAF8F5]/20 text-[10px] font-mono text-[#FAF8F5] flex items-center gap-1.5 shadow-lg">
                <Camera className="w-3 h-3 text-[#38BDF8]" />
                <span>{currentSilhouette.modelSource}</span>
              </div>

              {/* Garment Fit Tag */}
              <div className="absolute top-3 right-3 bg-emerald-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-400/30 text-[10px] font-mono text-emerald-300 font-bold uppercase">
                {fitStyle} Fit Mode &bull; Size {selectedSize}
              </div>

              {/* Bottom Real Clothes Specs Overlay */}
              <div className="absolute bottom-3 left-3 right-3 bg-[#0a192f]/95 backdrop-blur-md p-3.5 rounded-2xl border border-[#FAF8F5]/20 space-y-2 text-xs shadow-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono font-bold text-[#93c5fd]">
                    Real Clothes Editorial Reference
                  </span>
                  <span className="text-[10px] font-mono text-[#FAF8F5]/70">
                    Model Height: 5&apos;11&quot; &bull; Size M
                  </span>
                </div>
                <h4 className="font-serif font-bold text-sm text-white">{currentSilhouette.title}</h4>
                <p className="text-[11px] text-[#FAF8F5]/80 font-light">{currentSilhouette.description}</p>
                <div className="pt-1 flex items-center gap-2 text-[10px] font-mono text-[#D4AF37]">
                  <span>Fabric: {currentSilhouette.fabricInfo.name}</span>
                </div>
              </div>
            </div>
          ) : (
            /* MODE B: 3D RUNWAY CATWALK ANIMATED MANNEQUIN */
            <>
              {/* Runway Catwalk Overhead Spotlights */}
              <div className="absolute top-0 left-0 right-0 h-40 bg-[radial-gradient(ellipse_at_top,_rgba(147,197,253,0.35)_0%,_rgba(30,58,138,0.15)_50%,_transparent_100%)] pointer-events-none" />
              
              {/* Perspective Runway Floor */}
              <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#02060f] via-[#0b172a] to-transparent pointer-events-none overflow-hidden">
                <div className="absolute inset-x-8 bottom-0 h-36 bg-gradient-to-t from-[#1e3a8a]/30 to-transparent rounded-t-[80px] border-t border-[#FAF8F5]/20 backdrop-blur-xs">
                  <div className="w-full h-full flex justify-between px-6 opacity-30">
                    <div className="w-px h-full bg-gradient-to-t from-white/40 to-transparent transform -skew-x-12" />
                    <div className="w-px h-full bg-gradient-to-t from-white/60 to-transparent" />
                    <div className="w-px h-full bg-gradient-to-t from-white/40 to-transparent transform skew-x-12" />
                  </div>
                </div>

                {isWalkActive && (
                  <motion.div
                    animate={{ y: [0, 60] }}
                    transition={{ repeat: Infinity, duration: walkCycleDuration, ease: 'linear' }}
                    className="absolute inset-0 flex justify-center opacity-40 pointer-events-none"
                  >
                    <div className="w-32 h-1 bg-gradient-to-r from-transparent via-[#FAF8F5] to-transparent" />
                  </motion.div>
                )}
              </div>

              {/* Dynamic Model with Scaled Garment Fit */}
              <motion.div
                animate={{
                  rotateY: turntableAngle,
                  scale: (isZoomed ? 1.25 : 1) * fitScale,
                  y: isWalkActive ? [0, -8, 0] : 0,
                }}
                transition={{
                  y: isWalkActive
                    ? { repeat: Infinity, duration: walkCycleDuration / 2, ease: 'easeInOut' }
                    : { type: 'spring', stiffness: 200, damping: 20 },
                  scale: { duration: 0.35, ease: 'easeOut' },
                  rotateY: { duration: 0.5, ease: 'easeOut' },
                }}
                className="relative w-72 h-[460px] flex items-center justify-center z-10"
              >
                {/* Footstep Shadow */}
                <motion.div
                  animate={isWalkActive ? { scaleX: [0.85, 1.1, 0.85], opacity: [0.4, 0.7, 0.4] } : {}}
                  transition={{ repeat: Infinity, duration: walkCycleDuration / 2, ease: 'easeInOut' }}
                  className="absolute bottom-6 w-44 h-5 bg-black/60 blur-md rounded-full pointer-events-none"
                />

                <svg
                  className="w-full h-full drop-shadow-2xl overflow-visible"
                  viewBox="0 0 240 440"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <filter id="silkSheen" x="-20%" y="-20%" width="140%" height="140%">
                      <feTurbulence type="fractalNoise" baseFrequency="0.03 0.08" numOctaves="2" result="noise" />
                      <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.15 0" in="noise" result="softNoise" />
                      <feBlend mode="overlay" in2="SourceGraphic" in="softNoise" />
                    </filter>

                    <filter id="woolTwill" x="-20%" y="-20%" width="140%" height="140%">
                      <feTurbulence type="fractalNoise" baseFrequency="0.08 0.4" numOctaves="2" result="twillNoise" />
                      <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.22 0" in="twillNoise" result="subtleTwill" />
                      <feBlend mode="multiply" in2="SourceGraphic" in="subtleTwill" />
                    </filter>

                    <linearGradient id={`mannequinSkin-${skinTone}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={skin.highlight} />
                      <stop offset="45%" stopColor={skin.base} />
                      <stop offset="100%" stopColor={skin.shadow} />
                    </linearGradient>

                    <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2D2118" />
                      <stop offset="50%" stopColor="#1A120B" />
                      <stop offset="100%" stopColor="#080503" />
                    </linearGradient>

                    <linearGradient id="goldHardware" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FDE68A" />
                      <stop offset="50%" stopColor="#D4AF37" />
                      <stop offset="100%" stopColor="#92400E" />
                    </linearGradient>

                    <linearGradient id="topFabricGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.22" />
                      <stop offset="40%" stopColor="#000000" stopOpacity="0.0" />
                      <stop offset="100%" stopColor="#000000" stopOpacity="0.38" />
                    </linearGradient>

                    <linearGradient id="bottomFabricGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.16" />
                      <stop offset="50%" stopColor="#000000" stopOpacity="0.0" />
                      <stop offset="100%" stopColor="#000000" stopOpacity="0.45" />
                    </linearGradient>
                  </defs>

                  {/* MODEL BODY & ARTICULATED WALKING STRIDE */}
                  {activeGender === 'female' ? (
                    <g id="female-model">
                      <path
                        d="M96 38 C96 18, 144 18, 144 38 C158 52, 156 86, 146 112 C134 116, 106 116, 94 112 C84 86, 82 52, 96 38 Z"
                        fill="url(#hairGrad)"
                      />
                      <ellipse cx="120" cy="28" rx="14" ry="12" fill="url(#hairGrad)" />
                      <ellipse cx="120" cy="48" rx="16" ry="20" fill={`url(#mannequinSkin-${skinTone})`} />
                      <rect x="114" y="66" width="12" height="18" rx="3" fill={`url(#mannequinSkin-${skinTone})`} />
                      <path d="M106 82 Q114 85 120 84 Q126 85 134 82" stroke={skin.shadow} strokeWidth="1.5" strokeLinecap="round" fill="none" />
                      <path d="M82 84 Q120 90 158 84 L150 165 Q120 174 90 165 Z" fill={`url(#mannequinSkin-${skinTone})`} />

                      {/* Left Leg */}
                      <motion.g
                        animate={
                          isWalkActive
                            ? { rotate: [-14, 14, -14], originX: '107px', originY: '170px' }
                            : { rotate: -2 }
                        }
                        transition={
                          isWalkActive
                            ? { repeat: Infinity, duration: walkCycleDuration, ease: 'easeInOut' }
                            : {}
                        }
                      >
                        <rect x="98" y="165" width="18" height="215" rx="5" fill={`url(#mannequinSkin-${skinTone})`} />
                        <path d="M96 380 L112 380 L116 398 L94 398 Z" fill="#0A192F" />
                        <line x1="112" y1="385" x2="114" y2="402" stroke="#FAF8F5" strokeWidth="2" />
                      </motion.g>

                      {/* Right Leg */}
                      <motion.g
                        animate={
                          isWalkActive
                            ? { rotate: [14, -14, 14], originX: '133px', originY: '170px' }
                            : { rotate: 3 }
                        }
                        transition={
                          isWalkActive
                            ? { repeat: Infinity, duration: walkCycleDuration, ease: 'easeInOut' }
                            : {}
                        }
                      >
                        <rect x="124" y="165" width="18" height="215" rx="5" fill={`url(#mannequinSkin-${skinTone})`} />
                        <path d="M126 380 L142 380 L146 398 L124 398 Z" fill="#0A192F" />
                        <line x1="142" y1="385" x2="144" y2="402" stroke="#FAF8F5" strokeWidth="2" />
                      </motion.g>

                      {/* Left Arm */}
                      <motion.g
                        animate={
                          isWalkActive
                            ? { rotate: [12, -12, 12], originX: '82px', originY: '86px' }
                            : { rotate: 2 }
                        }
                        transition={
                          isWalkActive
                            ? { repeat: Infinity, duration: walkCycleDuration, ease: 'easeInOut' }
                            : {}
                        }
                      >
                        <path d="M82 86 L66 182 L76 185 L88 92 Z" fill={`url(#mannequinSkin-${skinTone})`} />
                        <rect x="67" y="174" width="10" height="3" rx="1" fill="url(#goldHardware)" />
                      </motion.g>

                      {/* Right Arm */}
                      <motion.g
                        animate={
                          isWalkActive
                            ? { rotate: [-12, 12, -12], originX: '158px', originY: '86px' }
                            : { rotate: -3 }
                        }
                        transition={
                          isWalkActive
                            ? { repeat: Infinity, duration: walkCycleDuration, ease: 'easeInOut' }
                            : {}
                        }
                      >
                        <path d="M158 86 L174 182 L164 185 L152 92 Z" fill={`url(#mannequinSkin-${skinTone})`} />
                        <rect x="163" y="174" width="10" height="3" rx="1" fill="url(#goldHardware)" />
                      </motion.g>
                    </g>
                  ) : (
                    <g id="male-model">
                      <path
                        d="M96 34 C96 18, 144 18, 144 34 C150 46, 144 54, 120 54 C96 54, 90 46, 96 34 Z"
                        fill="url(#hairGrad)"
                      />
                      <ellipse cx="120" cy="46" rx="18" ry="22" fill={`url(#mannequinSkin-${skinTone})`} />
                      <rect x="111" y="66" width="18" height="20" rx="4" fill={`url(#mannequinSkin-${skinTone})`} />
                      <path d="M72 86 Q120 94 168 86 L156 175 Q120 182 84 175 Z" fill={`url(#mannequinSkin-${skinTone})`} />

                      {/* Male Left Leg */}
                      <motion.g
                        animate={
                          isWalkActive
                            ? { rotate: [-15, 15, -15], originX: '105px', originY: '175px' }
                            : { rotate: -2 }
                        }
                        transition={
                          isWalkActive
                            ? { repeat: Infinity, duration: walkCycleDuration, ease: 'easeInOut' }
                            : {}
                        }
                      >
                        <rect x="94" y="175" width="22" height="210" rx="5" fill={`url(#mannequinSkin-${skinTone})`} />
                        <path d="M88 385 L112 385 L116 404 L86 404 Z" fill="#0A192F" />
                        <line x1="86" y1="400" x2="116" y2="400" stroke="#FAF8F5" strokeWidth="1.5" />
                      </motion.g>

                      {/* Male Right Leg */}
                      <motion.g
                        animate={
                          isWalkActive
                            ? { rotate: [15, -15, 15], originX: '135px', originY: '175px' }
                            : { rotate: 2 }
                        }
                        transition={
                          isWalkActive
                            ? { repeat: Infinity, duration: walkCycleDuration, ease: 'easeInOut' }
                            : {}
                        }
                      >
                        <rect x="124" y="175" width="22" height="210" rx="5" fill={`url(#mannequinSkin-${skinTone})`} />
                        <path d="M128 385 L152 385 L156 404 L126 404 Z" fill="#0A192F" />
                        <line x1="126" y1="400" x2="156" y2="400" stroke="#FAF8F5" strokeWidth="1.5" />
                      </motion.g>

                      {/* Male Left Arm */}
                      <motion.g
                        animate={
                          isWalkActive
                            ? { rotate: [14, -14, 14], originX: '72px', originY: '88px' }
                            : { rotate: 2 }
                        }
                        transition={
                          isWalkActive
                            ? { repeat: Infinity, duration: walkCycleDuration, ease: 'easeInOut' }
                            : {}
                        }
                      >
                        <path d="M72 88 L54 192 L66 195 L80 96 Z" fill={`url(#mannequinSkin-${skinTone})`} />
                        <rect x="56" y="185" width="10" height="4" rx="1" fill="#1E293B" />
                      </motion.g>

                      {/* Male Right Arm */}
                      <motion.g
                        animate={
                          isWalkActive
                            ? { rotate: [-14, 14, -14], originX: '168px', originY: '88px' }
                            : { rotate: -2 }
                        }
                        transition={
                          isWalkActive
                            ? { repeat: Infinity, duration: walkCycleDuration, ease: 'easeInOut' }
                            : {}
                        }
                      >
                        <path d="M168 88 L186 192 L174 195 L160 96 Z" fill={`url(#mannequinSkin-${skinTone})`} />
                      </motion.g>
                    </g>
                  )}

                  {/* BOTTOM GARMENTS WITH GARMENT FIT VARIATION */}
                  {activeOutfit.bottomType === 'skirt' || activeOutfit.topType === 'saree' ? (
                    <motion.g
                      id="real-skirt"
                      animate={isWalkActive ? { rotate: [-3, 3, -3], originX: '120px', originY: '150px' } : {}}
                      transition={isWalkActive ? { repeat: Infinity, duration: walkCycleDuration, ease: 'easeInOut' } : {}}
                      filter="url(#silkSheen)"
                    >
                      <path
                        d={`M${86 + waistSuppress} 150 L${154 - waistSuppress} 150 L${176 - waistSuppress * 1.5} 332 Q120 348 L${64 + waistSuppress * 1.5} 332 Z`}
                        fill={bottomColor}
                      />
                      <path
                        d={`M${86 + waistSuppress} 150 L${154 - waistSuppress} 150 L${176 - waistSuppress * 1.5} 332 Q120 348 L${64 + waistSuppress * 1.5} 332 Z`}
                        fill="url(#bottomFabricGrad)"
                      />
                      <line x1="98" y1="152" x2="88" y2="334" stroke="#000" strokeOpacity="0.25" strokeWidth="1.5" />
                      <line x1="120" y1="152" x2="120" y2="340" stroke="#000" strokeOpacity="0.25" strokeWidth="1.5" />
                      <line x1="142" y1="152" x2="152" y2="334" stroke="#000" strokeOpacity="0.25" strokeWidth="1.5" />
                      <rect x="86" y="148" width="68" height="6" rx="2" fill="url(#goldHardware)" />
                    </motion.g>
                  ) : activeOutfit.bottomType === 'gown_skirt' || activeOutfit.topType === 'gown' ? (
                    <motion.g
                      id="real-gown-skirt"
                      animate={isWalkActive ? { rotate: [-2, 2, -2], originX: '120px', originY: '140px' } : {}}
                      transition={isWalkActive ? { repeat: Infinity, duration: walkCycleDuration, ease: 'easeInOut' } : {}}
                      filter="url(#silkSheen)"
                    >
                      <path
                        d={`M${88 + waistSuppress} 140 L${152 - waistSuppress} 140 L${184 - waistSuppress * 1.5} 395 Q120 412 L${56 + waistSuppress * 1.5} 395 Z`}
                        fill={bottomColor}
                      />
                      <path
                        d={`M${88 + waistSuppress} 140 L${152 - waistSuppress} 140 L${184 - waistSuppress * 1.5} 395 Q120 412 L${56 + waistSuppress * 1.5} 395 Z`}
                        fill="url(#bottomFabricGrad)"
                      />
                      <path d="M106 142 Q100 270 82 398" stroke="#000" strokeOpacity="0.22" strokeWidth="2.5" fill="none" />
                      <path d="M134 142 Q140 270 158 398" stroke="#000" strokeOpacity="0.22" strokeWidth="2.5" fill="none" />
                    </motion.g>
                  ) : activeOutfit.bottomType === 'salwar_bottom' ? (
                    <g id="real-salwar-bottom" filter="url(#silkSheen)">
                      <path
                        d={`M${84 + waistSuppress} 160 L${156 - waistSuppress} 160 L${160 - waistSuppress} 360 Q138 390 ${124 - waistSuppress / 2} 388 L120 230 L${116 + waistSuppress / 2} 388 Q102 390 ${80 + waistSuppress} 360 Z`}
                        fill={bottomColor}
                      />
                      <path
                        d={`M${84 + waistSuppress} 160 L${156 - waistSuppress} 160 L${160 - waistSuppress} 360 Q138 390 ${124 - waistSuppress / 2} 388 L120 230 L${116 + waistSuppress / 2} 388 Q102 390 ${80 + waistSuppress} 360 Z`}
                        fill="url(#bottomFabricGrad)"
                      />
                      <line x1="94" y1="362" x2="114" y2="365" stroke="#000" strokeOpacity="0.2" strokeWidth="1.5" />
                      <line x1="92" y1="374" x2="114" y2="377" stroke="#000" strokeOpacity="0.2" strokeWidth="1.5" />
                      <line x1="126" y1="365" x2="146" y2="362" stroke="#000" strokeOpacity="0.2" strokeWidth="1.5" />
                      <line x1="126" y1="377" x2="148" y2="374" stroke="#000" strokeOpacity="0.2" strokeWidth="1.5" />
                    </g>
                  ) : (
                    /* Tailored Trousers with Fit Adjustments */
                    <g id="real-tailored-trousers" filter="url(#woolTwill)">
                      <path
                        d={`M${86 + waistSuppress} 164 L${154 - waistSuppress} 164 L${150 - waistSuppress} 388 L${126 - waistSuppress / 2} 388 L120 218 L${114 + waistSuppress / 2} 388 L${90 + waistSuppress} 388 Z`}
                        fill={bottomColor}
                      />
                      <path
                        d={`M${86 + waistSuppress} 164 L${154 - waistSuppress} 164 L${150 - waistSuppress} 388 L${126 - waistSuppress / 2} 388 L120 218 L${114 + waistSuppress / 2} 388 L${90 + waistSuppress} 388 Z`}
                        fill="url(#bottomFabricGrad)"
                      />
                      <line x1="102" y1="170" x2="102" y2="385" stroke="#FFFFFF" strokeOpacity="0.15" strokeWidth="1.2" />
                      <line x1="137" y1="170" x2="137" y2="385" stroke="#FFFFFF" strokeOpacity="0.15" strokeWidth="1.2" />
                      <rect x="86" y="164" width="68" height="7" rx="1.5" fill="#3D2314" />
                      <rect x="114" y="163" width="12" height="9" rx="1.5" fill="url(#goldHardware)" />
                    </g>
                  )}

                  {/* TOP GARMENTS WITH TAILORING DETAILS */}
                  {activeOutfit.topType === 'blazer' ? (
                    <g id="real-blazer" filter="url(#woolTwill)">
                      <path d="M104 86 L136 86 L130 170 L110 170 Z" fill="#FAF8F5" />
                      <path d="M112 86 L120 106 L128 86" stroke="#0A192F" strokeWidth="1.5" fill="none" />
                      <path
                        d={`M${74 - waistSuppress / 2} 88 L${166 + waistSuppress / 2} 88 L${158 - waistSuppress} 190 L130 190 L120 135 L110 190 L${82 + waistSuppress} 190 Z`}
                        fill={topColor}
                      />
                      <path
                        d={`M${74 - waistSuppress / 2} 88 L${166 + waistSuppress / 2} 88 L${158 - waistSuppress} 190 L130 190 L120 135 L110 190 L${82 + waistSuppress} 190 Z`}
                        fill="url(#topFabricGrad)"
                      />
                      <path d="M92 88 L114 135 L96 135 Z" fill="#000" fillOpacity="0.3" />
                      <path d="M148 88 L126 135 L144 135 Z" fill="#000" fillOpacity="0.3" />
                      <circle cx="120" cy="148" r="2.2" fill="url(#goldHardware)" />
                      <circle cx="120" cy="162" r="2.2" fill="url(#goldHardware)" />
                      <path d="M140 118 L150 118 L148 122 L142 122 Z" fill="#FAF8F5" />
                    </g>
                  ) : activeOutfit.topType === 'gown' ? (
                    <g id="real-gown-top" filter="url(#silkSheen)">
                      <path
                        d={`M84 94 Q120 108 156 94 L${152 - waistSuppress} 148 Q120 158 L${88 + waistSuppress} 148 Z`}
                        fill={topColor}
                      />
                      <path
                        d={`M84 94 Q120 108 156 94 L${152 - waistSuppress} 148 Q120 158 L${88 + waistSuppress} 148 Z`}
                        fill="url(#topFabricGrad)"
                      />
                      <rect x="88" y="142" width="64" height="6" rx="2" fill="url(#goldHardware)" />
                    </g>
                  ) : activeOutfit.topType === 'saree' ? (
                    <g id="real-saree-top" filter="url(#silkSheen)">
                      <path
                        d={`M82 92 Q120 106 158 92 L${152 - waistSuppress} 142 Q120 150 L${88 + waistSuppress} 142 Z`}
                        fill={topColor}
                      />
                      <path
                        d={`M82 92 Q120 106 158 92 L${152 - waistSuppress} 142 Q120 150 L${88 + waistSuppress} 142 Z`}
                        fill="url(#topFabricGrad)"
                      />
                      <path
                        d={`M${92 + waistSuppress} 144 Q116 118 152 86 L164 88 Q130 130 ${106 + waistSuppress} 176 Z`}
                        fill={accentColor || '#D4AF37'}
                        fillOpacity="0.85"
                      />
                      <circle cx="120" cy="142" r="2.5" fill="url(#goldHardware)" />
                    </g>
                  ) : activeOutfit.topType === 'croptop' ? (
                    <g id="real-croptop" filter="url(#silkSheen)">
                      <path
                        d={`M84 92 Q120 108 156 92 L${150 - waistSuppress} 132 Q120 140 L${90 + waistSuppress} 132 Z`}
                        fill={topColor}
                      />
                      <path
                        d={`M84 92 Q120 108 156 92 L${150 - waistSuppress} 132 Q120 140 L${90 + waistSuppress} 132 Z`}
                        fill="url(#topFabricGrad)"
                      />
                      <line x1="88" y1="132" x2="152" y2="132" stroke="url(#goldHardware)" strokeWidth="2.5" />
                      <circle cx="120" cy="112" r="2" fill="url(#goldHardware)" />
                    </g>
                  ) : activeOutfit.topType === 'kurta' ? (
                    <g id="real-kurta" filter="url(#silkSheen)">
                      <path
                        d={`M74 86 L166 86 L${160 - waistSuppress} 220 L130 220 L120 185 L110 220 L${80 + waistSuppress} 220 Z`}
                        fill={topColor}
                      />
                      <path
                        d={`M74 86 L166 86 L${160 - waistSuppress} 220 L130 220 L120 185 L110 220 L${80 + waistSuppress} 220 Z`}
                        fill="url(#topFabricGrad)"
                      />
                      <rect x="110" y="82" width="20" height="7" rx="2" fill={topColor} stroke="url(#goldHardware)" strokeWidth="1" />
                      <line x1="120" y1="88" x2="120" y2="180" stroke="#000" strokeOpacity="0.25" strokeWidth="1.5" />
                      <circle cx="120" cy="98" r="1.8" fill="url(#goldHardware)" />
                      <circle cx="120" cy="114" r="1.8" fill="url(#goldHardware)" />
                      <circle cx="120" cy="130" r="1.8" fill="url(#goldHardware)" />
                      <circle cx="120" cy="146" r="1.8" fill="url(#goldHardware)" />
                    </g>
                  ) : (
                    /* Classic Oxford Shirt / Kurta */
                    <g id="real-shirt" filter="url(#silkSheen)">
                      <path
                        d={`M76 88 L164 88 L${154 - waistSuppress} 180 L${86 + waistSuppress} 180 Z`}
                        fill={topColor}
                      />
                      <path
                        d={`M76 88 L164 88 L${154 - waistSuppress} 180 L${86 + waistSuppress} 180 Z`}
                        fill="url(#topFabricGrad)"
                      />
                      <path d="M108 86 L120 104 L132 86" stroke="#000" strokeOpacity="0.3" strokeWidth="2" fill="none" />
                      <circle cx="120" cy="118" r="1.8" fill="url(#goldHardware)" />
                      <circle cx="120" cy="136" r="1.8" fill="url(#goldHardware)" />
                      <circle cx="120" cy="154" r="1.8" fill="url(#goldHardware)" />
                    </g>
                  )}
                </svg>
              </motion.div>

              {/* Bottom Draped Info Strip */}
              <div className="absolute bottom-3 left-3 right-3 bg-[#0a192f]/95 backdrop-blur-md p-3 rounded-2xl border border-[#FAF8F5]/15 z-20 flex items-center justify-between shadow-xl">
                <div>
                  <span className="text-[9px] uppercase font-mono font-bold text-[#93c5fd] flex items-center gap-1.5">
                    <Footprints className="w-3 h-3 text-[#38BDF8]" />
                    <span>
                      {activeGender === 'female' ? "Women's" : "Men's"} Runway Catwalk &bull; {fitStyle.toUpperCase()} FIT
                    </span>
                    {isWalkActive && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    )}
                  </span>
                  <h5 className="text-xs font-serif font-bold text-white truncate max-w-[180px]">
                    {activeOutfit.title}
                  </h5>
                </div>
                
                <div className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full border border-white/40 shadow-sm"
                    style={{ backgroundColor: topColor }}
                    title={`Top: ${topColor}`}
                  />
                  <span
                    className="w-4 h-4 rounded-full border border-white/40 shadow-sm"
                    style={{ backgroundColor: bottomColor }}
                    title={`Bottom: ${bottomColor}`}
                  />
                  <span
                    className="w-4 h-4 rounded-full border border-white/40 shadow-sm"
                    style={{ backgroundColor: accentColor }}
                    title={`Accent: ${accentColor}`}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* CATWALK CONTROLS (Pause, Turntable, Speed) */}
        {displayMode === 'catwalk' && (
          <div className="w-full max-w-lg flex items-center justify-between mt-3 px-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsWalkActive(!isWalkActive)}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                  isWalkActive
                    ? 'bg-[#FAF8F5] text-[#0a192f] shadow-md'
                    : 'bg-[#0a192f] text-white border border-[#FAF8F5]/20'
                }`}
              >
                {isWalkActive ? <Pause className="w-3.5 h-3.5 fill-[#0a192f]" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                <span>{isWalkActive ? 'Pause Walk' : 'Runway Catwalk'}</span>
              </button>

              <button
                onClick={() => {
                  const nextAngles: Record<number, 0 | 30 | -30 | 180> = { 0: 30, 30: -30, '-30': 0 };
                  setTurntableAngle(nextAngles[turntableAngle] ?? 0);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-[#0a192f] text-[#FAF8F5]/80 hover:text-white transition-colors border border-[#FAF8F5]/15 flex items-center gap-1"
                title="Rotate Model 360°"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>{turntableAngle}&deg; Turn</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-[#FAF8F5]/60 uppercase">Pace:</span>
              {(['slow', 'medium', 'fast'] as const).map((spd) => (
                <button
                  key={spd}
                  onClick={() => setWalkSpeed(spd)}
                  className={`px-2 py-1 rounded-lg text-[10px] capitalize transition-all ${
                    walkSpeed === spd
                      ? 'bg-[#1e3a8a] text-white font-bold'
                      : 'bg-[#0a192f] text-[#FAF8F5]/60 hover:text-white'
                  }`}
                >
                  {spd}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* GARMENT FIT & SIZE CONTROLLER (FIXED: FULLY FUNCTIONAL)   */}
      {/* ========================================================= */}
      {showControls && (
        <div className="w-full max-w-lg mt-4 p-4 rounded-3xl bg-[#0f254e]/50 border border-[#FAF8F5]/15 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#93c5fd]" />
              <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-white">
                Garment Fit &amp; Tailoring Engine
              </h4>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
              Active: {fitStyle.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(['slim', 'regular', 'oversized'] as const).map((fit) => {
              const isCurrent = fitStyle === fit;
              return (
                <button
                  key={fit}
                  type="button"
                  onClick={() => setFitStyle(fit)}
                  className={`p-2.5 rounded-2xl border text-left transition-all ${
                    isCurrent
                      ? 'bg-[#FAF8F5] text-[#0a192f] border-white shadow-lg font-bold scale-102'
                      : 'bg-[#0a192f]/70 border-[#FAF8F5]/15 text-[#FAF8F5]/80 hover:bg-[#16366f]/40'
                  }`}
                >
                  <p className="text-xs capitalize font-bold">{fit} Fit</p>
                  <p className={`text-[9px] ${isCurrent ? 'text-[#1e3a8a]' : 'text-[#FAF8F5]/60'}`}>
                    {fit === 'slim' ? '-2" Chest Taper' : fit === 'regular' ? 'Savile Row Ease' : '+5" Boxy Drape'}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Size Guide Chips */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <span className="text-[10px] font-mono uppercase text-[#FAF8F5]/60 flex items-center gap-1">
              <Ruler className="w-3 h-3 text-[#93c5fd]" /> Size:
            </span>
            <div className="flex items-center gap-1.5">
              {(['XS', 'S', 'M', 'L', 'XL'] as const).map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`w-7 h-7 rounded-lg text-[10px] font-mono font-bold flex items-center justify-center transition-all ${
                    selectedSize === sz
                      ? 'bg-[#1e3a8a] text-white shadow-md'
                      : 'bg-[#0a192f] text-[#FAF8F5]/60 hover:text-white border border-[#FAF8F5]/15'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DEEP FASHION INTELLIGENCE: FABRICS, SIZES & ACCESSORIES   */}
      {/* ========================================================= */}
      <div className="w-full max-w-lg mt-4 rounded-3xl bg-[#0a192f]/90 border border-[#FAF8F5]/15 p-4 space-y-4 shadow-xl">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-[#FAF8F5]/10 pb-3 text-xs font-mono">
          <button
            onClick={() => setActiveTab('accessories')}
            className={`pb-1 font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'accessories'
                ? 'text-[#93c5fd] border-b-2 border-[#93c5fd]'
                : 'text-[#FAF8F5]/60 hover:text-white'
            }`}
          >
            <Watch className="w-3.5 h-3.5" />
            <span>5-Piece Accessories</span>
          </button>

          <button
            onClick={() => setActiveTab('fabric')}
            className={`pb-1 font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'fabric'
                ? 'text-[#93c5fd] border-b-2 border-[#93c5fd]'
                : 'text-[#FAF8F5]/60 hover:text-white'
            }`}
          >
            <Shirt className="w-3.5 h-3.5" />
            <span>Fabrics &amp; Weave</span>
          </button>

          <button
            onClick={() => setActiveTab('size')}
            className={`pb-1 font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'size'
                ? 'text-[#93c5fd] border-b-2 border-[#93c5fd]'
                : 'text-[#FAF8F5]/60 hover:text-white'
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>Size &amp; Fit Advice</span>
          </button>
        </div>

        {/* TAB 1: FULL 5-PIECE ACCESSORIES (Shoes, Watch, Ring, Chain, Bracelet) */}
        {activeTab === 'accessories' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-[#FAF8F5]/60">
                Curated Luxury Hardware Matching
              </span>
              <span className="text-[10px] font-mono text-[#D4AF37] font-bold">
                Gold &amp; Platinum Harmonized
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {/* Shoes */}
              <div className="p-2.5 rounded-2xl bg-[#050d1a] border border-[#FAF8F5]/10 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <Footprints className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>Footwear: {currentSilhouette.accessories.shoe.name}</span>
                </div>
                <p className="text-[11px] text-[#FAF8F5]/70">{currentSilhouette.accessories.shoe.tip}</p>
              </div>

              {/* Watch */}
              <div className="p-2.5 rounded-2xl bg-[#050d1a] border border-[#FAF8F5]/10 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <Watch className="w-3.5 h-3.5 text-amber-400" />
                  <span>Timepiece: {currentSilhouette.accessories.watch.name}</span>
                </div>
                <p className="text-[11px] text-[#FAF8F5]/70">{currentSilhouette.accessories.watch.tip}</p>
              </div>

              {/* Ring */}
              <div className="p-2.5 rounded-2xl bg-[#050d1a] border border-[#FAF8F5]/10 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <Gem className="w-3.5 h-3.5 text-purple-400" />
                  <span>Ring: {currentSilhouette.accessories.ring.name}</span>
                </div>
                <p className="text-[11px] text-[#FAF8F5]/70">{currentSilhouette.accessories.ring.tip}</p>
              </div>

              {/* Chain / Necklace */}
              <div className="p-2.5 rounded-2xl bg-[#050d1a] border border-[#FAF8F5]/10 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <CircleDot className="w-3.5 h-3.5 text-rose-400" />
                  <span>Chain: {currentSilhouette.accessories.chain.name}</span>
                </div>
                <p className="text-[11px] text-[#FAF8F5]/70">{currentSilhouette.accessories.chain.tip}</p>
              </div>

              {/* Bracelet */}
              <div className="p-2.5 rounded-2xl bg-[#050d1a] border border-[#FAF8F5]/10 space-y-1 sm:col-span-2">
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Bracelet: {currentSilhouette.accessories.bracelet.name}</span>
                </div>
                <p className="text-[11px] text-[#FAF8F5]/70">{currentSilhouette.accessories.bracelet.tip}</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FABRICS & WEAVE */}
        {activeTab === 'fabric' && (
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-2xl bg-[#050d1a] border border-[#FAF8F5]/10 space-y-2">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-white font-serif">{currentSilhouette.fabricInfo.name}</h5>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full">
                  Breathability: {currentSilhouette.fabricInfo.breathability}
                </span>
              </div>
              <p className="text-[11px] text-[#FAF8F5]/80 leading-relaxed font-light">
                {currentSilhouette.fabricInfo.texture}
              </p>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-[#FAF8F5]/60">
                <span>Weight: {currentSilhouette.fabricInfo.gsm}</span>
                <span>Care: {currentSilhouette.fabricInfo.care}</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SIZE & FIT ADVICE */}
        {activeTab === 'size' && (
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-2xl bg-[#050d1a] border border-[#FAF8F5]/10 space-y-2">
              <h5 className="font-bold text-white flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Tailoring &amp; Fit Analysis ({fitStyle.toUpperCase()} FIT)</span>
              </h5>
              <p className="text-[11px] text-[#FAF8F5]/80 leading-relaxed">
                {fitStyle === 'slim'
                  ? currentSilhouette.sizeAdvice.slim
                  : fitStyle === 'oversized'
                  ? currentSilhouette.sizeAdvice.oversized
                  : currentSilhouette.sizeAdvice.regular}
              </p>
              <p className="text-[10px] font-mono text-[#D4AF37] pt-1">
                Hem Break: {currentSilhouette.sizeAdvice.tailoringBreak}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
