// agent-notes: { ctx: "real clothes & real model options catalog", deps: [], state: active, last: "tara@2026-09-23" }

export interface ColorSwatch {
  name: string;
  hex: string;
  role: 'primary' | 'secondary' | 'accent' | 'neutral';
  description: string;
}

export interface RealGarmentPiece {
  slot: 'top' | 'bottom' | 'outerwear' | 'footwear' | 'accessory';
  name: string;
  colorName: string;
  colorHex: string;
  fabric: string;
  details: string;
}

export interface RealClothesOption {
  id: string;
  title: string;
  tagline: string;
  gender: 'female' | 'male' | 'unisex';
  occasion: string;
  occasionCategory: 'interview' | 'wedding' | 'casual' | 'cocktail' | 'festive' | 'date';
  harmonyType: 'Complementary' | 'Monochromatic' | 'Analogous' | 'High-Contrast Luxury' | 'Earth Tones' | 'Pastel Harmonic';
  model: {
    name: string;
    ethnicity: string;
    height: string;
    wearingSize: string;
  };
  imageUrl: string;
  colorPalette: ColorSwatch[];
  whyItWorks: string;
  fabricSummary: string;
  pieces: RealGarmentPiece[];
  stylingAdvice: string;
}

export const REAL_CLOTHES_OPTIONS: RealClothesOption[] = [
  // ==========================================
  // WOMEN'S REAL CLOTHES OPTIONS
  // ==========================================
  {
    id: 'fem-real-1',
    title: 'The Savile Row Executive Power Suit',
    tagline: 'Sculpted Wool-Crepe Blazer & Fluid Trousers in Midnight Navy & Crisp Ivory',
    gender: 'female',
    occasion: 'Job Interview & Executive Assessment',
    occasionCategory: 'interview',
    harmonyType: 'High-Contrast Luxury',
    model: {
      name: 'Maya Patel',
      ethnicity: 'South Asian Poise',
      height: '5\'10" (178 cm)',
      wearingSize: 'Size 38 / Tailored Fit',
    },
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&auto=format&fit=crop',
    colorPalette: [
      { name: 'Midnight Obsidian Navy', hex: '#0F172A', role: 'primary', description: 'Projects calm intellectual authority and executive discernment.' },
      { name: 'Crisp Silk Ivory', hex: '#FAF8F5', role: 'secondary', description: 'Creates a radiant contrast at the neckline and cuffs.' },
      { name: 'Polished Champagne Gold', hex: '#D4AF37', role: 'accent', description: 'Subtle metallic warmth across watch bezel and button hardware.' },
      { name: 'Slate Graphite', hex: '#334155', role: 'neutral', description: 'Grounds the lower silhouette and accessories.' },
    ],
    whyItWorks: 'The deep obsidian navy sets an uncompromising foundation of competence, while the pristine silk ivory shirt brightens facial expressions during high-stakes interviews.',
    fabricSummary: '260 GSM Double-Faced Worsted Wool Crepe & 19-Momme Mulberry Silk',
    pieces: [
      { slot: 'outerwear', name: 'Sculpted Waist Single-Breasted Blazer', colorName: 'Midnight Navy', colorHex: '#0F172A', fabric: 'Double-Faced Wool Crepe', details: 'Slight shoulder roping with horn buttons and peaked lapels.' },
      { slot: 'top', name: 'Fluid High-Neck Silk Georgette Blouse', colorName: 'Crisp Ivory', colorHex: '#FAF8F5', fabric: '100% Mulberry Silk', details: 'Concealed button placket with soft drape at the collar.' },
      { slot: 'bottom', name: 'High-Waist Fluid Pleated Trousers', colorName: 'Crisp Ivory', colorHex: '#FAF8F5', fabric: 'Lightweight Wool-Silk Blend', details: 'Wide-leg no-break drape elongating the vertical line.' },
      { slot: 'footwear', name: 'Pointed-Toe 75mm Italian Nappa Pumps', colorName: 'Deep Navy', colorHex: '#0F172A', fabric: 'Full-Grain Calf Leather', details: 'Sleek pointed toe elongates legs beneath fluid trousers.' },
      { slot: 'accessory', name: 'Rose Gold 28mm Mesh Executive Timepiece', colorName: 'Champagne Gold', colorHex: '#D4AF37', fabric: 'Stainless Steel & Sapphire Glass', details: 'Ultra-thin 8mm profile slips cleanly under blazer cuffs.' },
    ],
    stylingAdvice: 'Keep accessories minimalist; ensure the blazer cuff exposes exactly 0.5 inches of the ivory blouse cuff.',
  },
  {
    id: 'fem-real-2',
    title: 'The Mulberry Liquid Silk Gala Gown',
    tagline: 'Liquid Charmeuse Floor-Length Gown in Rich Burgundy Merlot & Champagne',
    gender: 'female',
    occasion: 'Luxury Wedding & Reception Gala',
    occasionCategory: 'wedding',
    harmonyType: 'Complementary',
    model: {
      name: 'Elena Rostova',
      ethnicity: 'European Haute Couture',
      height: '5\'11" (180 cm)',
      wearingSize: 'Size 36 / Bias Cut',
    },
    imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=900&auto=format&fit=crop',
    colorPalette: [
      { name: 'Burgundy Merlot', hex: '#881337', role: 'primary', description: 'Opulent jewel tone that catches ambient chandelier lighting.' },
      { name: 'Soft Champagne Silk', hex: '#FAF8F5', role: 'secondary', description: 'Harmonious reflective sheen for shawls and jewelry.' },
      { name: 'Warm Gilded Gold', hex: '#EAB308', role: 'accent', description: 'Candlelight reflection on drop earrings and clutch.' },
      { name: 'Rose Bronze', hex: '#9F1239', role: 'neutral', description: 'Depth shadow enhancing bias-cut curves.' },
    ],
    whyItWorks: 'The 19-Momme liquid charmeuse ripples dynamically in motion, while the rich burgundy jewel tone flatters diverse skin tones with timeless evening glamour.',
    fabricSummary: '110 GSM 100% Pure Mulberry Silk Charmeuse with Bias Cut Drape',
    pieces: [
      { slot: 'top', name: 'Liquid Charmeuse Cowl-Neck Sweetheart Bodice', colorName: 'Burgundy Merlot', colorHex: '#881337', fabric: '100% Mulberry Silk', details: 'Delicate cowl draping framing the collarbone.' },
      { slot: 'bottom', name: 'Floor-Sweeping Bias-Cut Flute Skirt', colorName: 'Burgundy Merlot', colorHex: '#881337', fabric: 'Mulberry Silk Charmeuse', details: 'Cascading liquid drape brushing 0.5 inches off ballroom floor.' },
      { slot: 'footwear', name: 'Champagne Metallic Ankle-Strap Stilettos', colorName: 'Soft Champagne', colorHex: '#FAF8F5', fabric: 'Mirrored Metallic Leather', details: '85mm stiletto heel with padded leather insole.' },
      { slot: 'accessory', name: 'Emerald-Cut Solitaire Cocktail Ring & Choker', colorName: 'Warm Gilded Gold', colorHex: '#EAB308', fabric: '18k Solid Gold & Crystal', details: 'Frames the sweetheart neckline with luminous warmth.' },
    ],
    stylingAdvice: 'Wear delicate gold drop earrings and carry a micro clutch; avoid heavy necklaces that compete with the cowl neckline.',
  },
  {
    id: 'fem-real-3',
    title: 'The Royal Banarasi Katan Silk Saree',
    tagline: 'Handwoven Pure Katan Silk in Forest Emerald Green & Antique Gold Zari',
    gender: 'female',
    occasion: 'Traditional Festive & Indo-Western',
    occasionCategory: 'festive',
    harmonyType: 'High-Contrast Luxury',
    model: {
      name: 'Amara Diop',
      ethnicity: 'Statuesque Royal Poise',
      height: '6\'0" (183 cm)',
      wearingSize: 'Free Drape / Fitted Blouse',
    },
    imageUrl: '/images/branding/womens-ethnic-fusion.jpg',
    colorPalette: [
      { name: 'Imperial Forest Emerald', hex: '#064E3B', role: 'primary', description: 'Deep majestic emerald establishing regal presence.' },
      { name: 'Antique Zari Gold', hex: '#F59E0B', role: 'secondary', description: 'Intricate handwoven brocade borders and floral motifs.' },
      { name: 'Crimson Ruby Tint', hex: '#991B1B', role: 'accent', description: 'Subtle bindi and gemstone ring accentuation.' },
      { name: 'Pearl Ivory Base', hex: '#FAF8F5', role: 'neutral', description: 'Warm undertone in zari warp.' },
    ],
    whyItWorks: 'Emerald green and antique gold create one of fashion’s most iconic regal pairings, holding architectural pleats with ceremonial grandeur.',
    fabricSummary: '320 GSM Pure Handspun Varanasi Katan Silk with Real Metallic Zari',
    pieces: [
      { slot: 'top', name: 'Boat-Neck Raw Silk Contrast Blouse', colorName: 'Imperial Forest Emerald', colorHex: '#064E3B', fabric: 'Hand-Spun Raw Silk', details: 'Elbow-length sleeves with delicate gold brocade piping.' },
      { slot: 'bottom', name: 'Varanasi Brocade Pleated Saree & Cape Pallu', colorName: 'Imperial Forest Emerald', colorHex: '#064E3B', fabric: 'Katan Silk with Zari', details: 'Substantial 320 GSM fabric holding crisp pleats.' },
      { slot: 'footwear', name: 'Embroidered Zardozi Mojri Block Heels', colorName: 'Antique Gold', colorHex: '#F59E0B', fabric: 'Silk Velvet & Gold Thread', details: 'Steady 50mm block heel for ballroom comfort.' },
      { slot: 'accessory', name: 'Temple Filigree Gold Kadas & Choker', colorName: 'Antique Gold', colorHex: '#F59E0B', fabric: '22k Antique Gold Finish', details: 'Heritage motifs harmonizing with the saree zari.' },
    ],
    stylingAdvice: 'Drape the pallu cleanly over the left arm to showcase the zari border; pair with swept-back hair.',
  },
  {
    id: 'fem-real-4',
    title: 'The Urban Washed Pastel Denim & Cargo',
    tagline: 'Cropped Denim Trucker Jacket, Ivory Ribbed Tank & Sand Utility Trousers',
    gender: 'female',
    occasion: 'Streetwear & Gallery Walk',
    occasionCategory: 'casual',
    harmonyType: 'Pastel Harmonic',
    model: {
      name: 'Ava Lindqvist',
      ethnicity: 'Nordic Contemporary Chic',
      height: '5\'11" (180 cm)',
      wearingSize: 'Size S / Relaxed Fit',
    },
    imageUrl: '/images/branding/urban-western-casual.jpg',
    colorPalette: [
      { name: 'Washed Sky Powder Blue', hex: '#38BDF8', role: 'primary', description: 'Relaxed pastel denim setting casual street tone.' },
      { name: 'Warm Desert Sand', hex: '#E2D9C8', role: 'secondary', description: 'Neutral utility trousers balancing pastel brightness.' },
      { name: 'Clean Chalk Ivory', hex: '#FAF8F5', role: 'neutral', description: 'Underlayer knit providing clean negative space.' },
      { name: 'Burnished Amber Gum', hex: '#D97706', role: 'accent', description: 'Gum sole shoe accent adding warm street credibility.' },
    ],
    whyItWorks: 'Pastel blue and warm desert sand create an effortless, approachable aesthetic perfect for creative studios, gallery walks, and casual days out.',
    fabricSummary: '13.5 oz Washed Japanese Cotton Denim & High-Twist Cotton Twill',
    pieces: [
      { slot: 'outerwear', name: 'Cropped Boxy Washed Denim Trucker', colorName: 'Powder Sky Blue', colorHex: '#38BDF8', fabric: '100% Japanese Denim', details: 'Antiqued copper buttons and slightly dropped shoulders.' },
      { slot: 'top', name: 'High-Neck Ribbed Organic Cotton Tank', colorName: 'Chalk Ivory', colorHex: '#FAF8F5', fabric: 'Ribbed Organic Cotton', details: 'Snug supportive fit with clean bound neckline.' },
      { slot: 'bottom', name: 'Relaxed Tapered Utility Cargo Chinos', colorName: 'Warm Desert Sand', colorHex: '#E2D9C8', fabric: 'Structured Cotton Twill', details: 'Discreet gusset pockets with slight crop at ankle.' },
      { slot: 'footwear', name: 'Minimalist White Leather Court Sneakers', colorName: 'Chalk Ivory', colorHex: '#FAF8F5', fabric: 'Italian Calf Leather & Gum Sole', details: 'Clean monochrome silhouette with gum sole contrast.' },
    ],
    stylingAdvice: 'Roll the trucker sleeves slightly; pair with minimal silver huggie earrings and an across-body leather pouch.',
  },
  {
    id: 'fem-real-5',
    title: 'The Tuscan Camel Cashmere & Noir Silk',
    tagline: 'Belted Double-Faced Cashmere Coat over Obsidian Silk Midi Slip',
    gender: 'female',
    occasion: 'Romantic Date Night',
    occasionCategory: 'date',
    harmonyType: 'Earth Tones',
    model: {
      name: 'Elena Rostova',
      ethnicity: 'European High Fashion',
      height: '5\'10" (178 cm)',
      wearingSize: 'Size M / Tailored Coat',
    },
    imageUrl: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=900&auto=format&fit=crop',
    colorPalette: [
      { name: 'Tuscan Camel Tan', hex: '#B45309', role: 'primary', description: 'Warm opulent camel radiating quiet luxury.' },
      { name: 'Obsidian Noir', hex: '#1C1917', role: 'secondary', description: 'Deep sensual black creating slimming vertical lines.' },
      { name: 'Warm Cream Silk', hex: '#FAF8F5', role: 'neutral', description: 'Soft interior highlight.' },
      { name: 'Polished Brass', hex: '#D4AF37', role: 'accent', description: 'Belt buckle and jewelry accents.' },
    ],
    whyItWorks: 'Camel and noir black is the ultimate timeless color pairing, effortlessly bridging cozy softness with sultry evening sophistication.',
    fabricSummary: 'Double-Faced Cashmere Wool Blend & Heavyweight Silk Charmeuse',
    pieces: [
      { slot: 'outerwear', name: 'Double-Faced Cashmere Belted Trench', colorName: 'Tuscan Camel Tan', colorHex: '#B45309', fabric: 'Wool-Cashmere Blend', details: 'Horn buckle belt, storm flaps, and unlined hand-finished seams.' },
      { slot: 'top', name: 'V-Neck Fluid Silk Midi Slip Dress', colorName: 'Obsidian Noir', colorHex: '#1C1917', fabric: '100% Silk Charmeuse', details: 'Sculpted bust line and fluid bias drape.' },
      { slot: 'footwear', name: 'Pointed Suede Kitten Heel Booties', colorName: 'Obsidian Noir', colorHex: '#1C1917', fabric: 'Italian Calf Suede', details: '50mm sculptural heel for effortless evening walkability.' },
      { slot: 'accessory', name: 'Structured Top-Handle Saddle Leather Bag', colorName: 'Tuscan Camel Tan', colorHex: '#B45309', fabric: 'Vegetable-Tanned Calfskin', details: 'Gold clasp hardware matching coat buckle.' },
    ],
    stylingAdvice: 'Tie the coat belt loosely in a half-knot to reveal the noir silk slip beneath.',
  },
  {
    id: 'fem-real-6',
    title: 'The Handcrafted Zardozi Bridal Lehenga',
    tagline: 'Opulent Crimson Raw Silk Lehenga Choli with Antique Zari Kalis & Sheer Dupatta',
    gender: 'female',
    occasion: 'Royal Wedding & Sangeet Gala',
    occasionCategory: 'wedding',
    harmonyType: 'High-Contrast Luxury',
    model: {
      name: 'Maya Patel',
      ethnicity: 'South Asian Poise',
      height: '5\'10" (178 cm)',
      wearingSize: 'Size M / Flared Kalis',
    },
    imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=900&auto=format&fit=crop',
    colorPalette: [
      { name: 'Royal Crimson Ruby', hex: '#991B1B', role: 'primary', description: 'Ceremonial red reflecting timeless bridal majesty.' },
      { name: 'Antique 24k Zari Gold', hex: '#D4AF37', role: 'secondary', description: 'Intricate metallic dabka and zardozi threadwork.' },
      { name: 'Gilded Amber', hex: '#F59E0B', role: 'accent', description: 'Kundan stone and pearl necklace accents.' },
      { name: 'Warm Cream Silk', hex: '#FAF8F5', role: 'neutral', description: 'Organza dupatta border highlights.' },
    ],
    whyItWorks: 'The weight of 380 GSM handspun silk paired with 16 kalis creates an imperial, dramatic flare while dancing, accentuated by glistening gold zari.',
    fabricSummary: '380 GSM Heavyweight Raw Silk with Zardozi Embroidery & Pure Organza Dupatta',
    pieces: [
      { slot: 'top', name: 'Sweetheart Neckline Embroidered Choli Blouse', colorName: 'Royal Crimson Ruby', colorHex: '#991B1B', fabric: 'Raw Silk & Gold Thread', details: 'Fitted elbow-sleeve cut with hand-embroidered floral bel work.' },
      { slot: 'bottom', name: '16-Kali Flared Zardozi Silk Lehenga Skirt', colorName: 'Royal Crimson Ruby', colorHex: '#991B1B', fabric: 'Pure Raw Silk with Can-Can', details: 'Heavy antique zari hem with latkan drawstring tie-ups.' },
      { slot: 'outerwear', name: 'Hand-Embroidered Sheer Organza Dupatta', colorName: 'Warm Cream & Gold', colorHex: '#FAF8F5', fabric: 'Tissue Organza', details: 'Scalloped zardozi border draped regally over shoulder.' },
      { slot: 'footwear', name: 'Hand-Embellished Zari Mojri Heels', colorName: 'Antique Gold', colorHex: '#D4AF37', fabric: 'Velvet & Zari Thread', details: '55mm cushioned block heel designed for ceremonial endurance.' },
      { slot: 'accessory', name: 'Polki Diamond & Emerald Bridal Choker Set', colorName: 'Antique Gold', colorHex: '#D4AF37', fabric: '22k Gold Foil & Uncut Polki', details: 'Statement collar necklace framing the sweetheart choli.' },
    ],
    stylingAdvice: 'Pin the dupatta securely on the right shoulder, letting the scalloped pallu cascade gracefully over the left arm.',
  },
  {
    id: 'fem-real-7',
    title: 'The Sculpted Wide-Leg Halter Jumpsuit',
    tagline: 'High-Neck Crepe Jumpsuit with Gold Sash Buckle in Imperial Emerald',
    gender: 'female',
    occasion: 'Contemporary Art Gala & Cocktail',
    occasionCategory: 'cocktail',
    harmonyType: 'Complementary',
    model: {
      name: 'Amara Diop',
      ethnicity: 'Statuesque Royal Poise',
      height: '6\'0" (183 cm)',
      wearingSize: 'Size S / Elongated Inseam',
    },
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&auto=format&fit=crop',
    colorPalette: [
      { name: 'Imperial Emerald Jade', hex: '#064E3B', role: 'primary', description: 'Deep lustrous emerald projecting sleek contemporary glamour.' },
      { name: 'Polished Brass Gold', hex: '#EAB308', role: 'accent', description: 'Sculptural waist buckle and cuff hardware.' },
      { name: 'Noir Obsidian', hex: '#0A192F', role: 'neutral', description: 'Contrast clutch and evening footwear.' },
      { name: 'Soft Mint Glow', hex: '#6EE7B7', role: 'secondary', description: 'Subtle ambient light reflection.' },
    ],
    whyItWorks: 'An architectural alternative to traditional evening gowns: the halter neck exposes toned shoulders while the floor-sweeping palazzo legs elongate stature.',
    fabricSummary: '280 GSM Heavy Japanese Crepe with Fluid Silk Backing',
    pieces: [
      { slot: 'top', name: 'Sculpted High-Neck Halter Bodice', colorName: 'Imperial Emerald Jade', colorHex: '#064E3B', fabric: 'Heavyweight Crepe', details: 'Keyhole back closure with tailored darting along torso.' },
      { slot: 'bottom', name: 'High-Waisted Knife-Pleated Palazzo Trousers', colorName: 'Imperial Emerald Jade', colorHex: '#064E3B', fabric: 'Fluid Heavy Crepe', details: 'Seamless integration with bodice for continuous vertical flow.' },
      { slot: 'footwear', name: 'Mirrored Champagne Gold Pointed Heels', colorName: 'Polished Brass Gold', colorHex: '#EAB308', fabric: 'Mirror Metallic Leather', details: '90mm stiletto elevating palazzo hem flush with floor.' },
      { slot: 'accessory', name: 'Architectural Gold Torc Choker & Cuff', colorName: 'Polished Brass Gold', colorHex: '#EAB308', fabric: '18k Polished Brass', details: 'Minimalist statement jewelry accentuating the halter neckline.' },
    ],
    stylingAdvice: 'Style with an updo or sleek high ponytail to highlight the sculpted halter collar; carry an acrylic geometric clutch.',
  },
  {
    id: 'fem-real-8',
    title: 'The Royal Kalidar Silk Anarkali Suit',
    tagline: 'Floor-Length Draped Royal Blue Anarkali with Gota Patti & Gold Churidar',
    gender: 'female',
    occasion: 'Festive Celebration & Diwali Soirée',
    occasionCategory: 'festive',
    harmonyType: 'High-Contrast Luxury',
    model: {
      name: 'Maya Patel',
      ethnicity: 'South Asian Poise',
      height: '5\'10" (178 cm)',
      wearingSize: 'Size 38 / 24 Kalis',
    },
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&auto=format&fit=crop',
    colorPalette: [
      { name: 'Royal Sapphire Indigo', hex: '#1E3A8A', role: 'primary', description: 'Majestic deep royal sapphire tone commanding reverence.' },
      { name: 'Shimmering Gota Gold', hex: '#F59E0B', role: 'secondary', description: 'Ribbon gold border trims across hem and sleeves.' },
      { name: 'Silk Ivory', hex: '#FAF8F5', role: 'neutral', description: 'Contrast silk lining and pearls.' },
      { name: 'Midnight Charcoal', hex: '#0F172A', role: 'accent', description: 'Grounding velvet waist band.' },
    ],
    whyItWorks: 'The 24 kalis expand dramatically during spins and walking, giving an ethereal floating illusion while retaining modest traditional elegance.',
    fabricSummary: '240 GSM Pure Chanderi Silk with Golden Zari Weft',
    pieces: [
      { slot: 'top', name: 'Floor-Length 24-Kali Anarkali Flute Gown', colorName: 'Royal Sapphire Indigo', colorHex: '#1E3A8A', fabric: 'Chanderi Silk & Zari', details: 'Fitted empire waist with grand flared hemline trimmed in gota patti.' },
      { slot: 'bottom', name: 'Gathered Mulberry Silk Churidar', colorName: 'Royal Sapphire Indigo', colorHex: '#1E3A8A', fabric: 'Stretch Silk Blend', details: 'Fitted gathers resting gracefully above footwear.' },
      { slot: 'outerwear', name: 'Tissue Organza Dupatta with Mukaish Work', colorName: 'Shimmering Gota Gold', colorHex: '#F59E0B', fabric: 'Organza Silk', details: 'Dotted with fine golden sparkles and scalloped lace.' },
      { slot: 'footwear', name: 'Embellished Velvet Khussa Mojris', colorName: 'Antique Gold', colorHex: '#F59E0B', fabric: 'Raw Silk & Brass Thread', details: 'Cushioned flat sole for lively dance gatherings.' },
      { slot: 'accessory', name: 'Kundan Chandbali Earrings & Maang Tikka', colorName: 'Shimmering Gota Gold', colorHex: '#F59E0B', fabric: '22k Gold Foil & Emerald Beads', details: 'Elaborate traditional jewelry matching gota borders.' },
    ],
    stylingAdvice: 'Pleat the dupatta neatly over one shoulder and cinch at the waist with an embroidered kamarband belt.',
  },
  {
    id: 'fem-real-9',
    title: 'The Amalfi Coast Floral Silk Maxi Sundress',
    tagline: 'Tiered Cascading Silk Chiffon Sundress in Sunlit Terracotta & Coral',
    gender: 'female',
    occasion: 'Destination Resort & Summer Gala',
    occasionCategory: 'casual',
    harmonyType: 'Earth Tones',
    model: {
      name: 'Elena Rostova',
      ethnicity: 'Mediterranean Glow',
      height: '5\'10" (178 cm)',
      wearingSize: 'Size S / Tiered Flow',
    },
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&auto=format&fit=crop',
    colorPalette: [
      { name: 'Sunburst Terracotta', hex: '#C2410C', role: 'primary', description: 'Vibrant Mediterranean warmth capturing coastal sunset glow.' },
      { name: 'Warm Sunlit Gold', hex: '#EAB308', role: 'secondary', description: 'Golden hour floral accents.' },
      { name: 'Pristine Sand Ivory', hex: '#FAF8F5', role: 'neutral', description: 'Airy chiffon ground fabric.' },
      { name: 'Olive Grove Green', hex: '#65A30D', role: 'accent', description: 'Leaf motif detailing.' },
    ],
    whyItWorks: 'Featherweight pure silk chiffon dances with coastal breezes, providing exceptional breathability and romantic, photographic movement.',
    fabricSummary: '80 GSM 100% Featherweight Silk Chiffon with Soft Modal Slip Lining',
    pieces: [
      { slot: 'top', name: 'Tie-Shoulder Sweetheart Ruched Bodice', colorName: 'Sunburst Terracotta', colorHex: '#C2410C', fabric: 'Silk Chiffon', details: 'Adjustable self-tie ribbons and elasticized smocked back.' },
      { slot: 'bottom', name: 'Three-Tiered Ruffled Cascading Maxi Skirt', colorName: 'Sunburst Terracotta', colorHex: '#C2410C', fabric: 'Silk Chiffon', details: 'Fluid tiers opening into a graceful A-line sweeping hem.' },
      { slot: 'footwear', name: 'Woven Raffia & Metallic Leather Espadrilles', colorName: 'Warm Sand Ivory', colorHex: '#FAF8F5', fabric: 'Natural Jute & Nappa Leather', details: '70mm wedge heel sturdy on cobblestone pathways.' },
      { slot: 'accessory', name: 'Hand-Woven Palm Leaf Tote & Shell Bangles', colorName: 'Sunlit Gold', colorHex: '#EAB308', fabric: 'Natural Palm & 18k Dipped Shells', details: 'Effortless vacation luxury touch.' },
    ],
    stylingAdvice: 'Tie the shoulder straps into bows; pair with cat-eye tortoise sunglasses and a wide-brim woven sunhat.',
  },
  {
    id: 'fem-real-10',
    title: 'The Parisian Ribbed Cashmere Midi Dress',
    tagline: 'Ultra-Soft Fine Ribbed Sweater Dress with Sculpted Waist & Boots',
    gender: 'female',
    occasion: 'Smart Casual & Commute',
    occasionCategory: 'casual',
    harmonyType: 'Earth Tones',
    model: {
      name: 'Ava Lindqvist',
      ethnicity: 'Nordic Contemporary Chic',
      height: '5\'11" (180 cm)',
      wearingSize: 'Size S / Contoured Knit',
    },
    imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=900&auto=format&fit=crop',
    colorPalette: [
      { name: 'Heather Oatmeal Cream', hex: '#FAF8F5', role: 'primary', description: 'Calm, refined neutral radiating timeless quiet luxury.' },
      { name: 'Espresso Calf Brown', hex: '#3E2723', role: 'secondary', description: 'Rich leather boots and belt contrast.' },
      { name: 'Warm Camel Tan', hex: '#B45309', role: 'accent', description: 'Camel wool overcoat pairing.' },
      { name: 'Muted Slate', hex: '#64748B', role: 'neutral', description: 'Soft shadowed knit ribs.' },
    ],
    whyItWorks: 'Combines the cozy warmth of pure Mongolian cashmere with a streamlined, body-contouring silhouette that transitions effortlessly from gallery visits to dinner dates.',
    fabricSummary: '100% 2-Ply Mongolian Cashmere in 12-Gauge Ribbed Knit',
    pieces: [
      { slot: 'top', name: 'Mock-Neck Ribbed Contoured Midi Sweater Dress', colorName: 'Heather Oatmeal Cream', colorHex: '#FAF8F5', fabric: 'Pure Cashmere', details: 'Seamless 3D knit construction with micro side slit at calf.' },
      { slot: 'outerwear', name: 'Tailored Camel Hair Belted Overcoat', colorName: 'Warm Camel Tan', colorHex: '#B45309', fabric: '100% Baby Camelhair', details: 'Relaxed drop-shoulder with horn button front.' },
      { slot: 'footwear', name: 'Knee-High Burnished Suede Riding Boots', colorName: 'Espresso Calf Brown', colorHex: '#3E2723', fabric: 'Italian Calf Suede', details: 'Almond toe with stacked leather block heel.' },
      { slot: 'accessory', name: 'Croc-Embossed Saddle Leather Belt & Bag', colorName: 'Espresso Calf Brown', colorHex: '#3E2723', fabric: 'Vegetable-Tanned Leather', details: 'Cinched at natural waist for structured definition.' },
    ],
    stylingAdvice: 'Cinch with the espresso leather belt to accentuate the waist; push sleeves gently up the forearms.',
  },
  {
    id: 'fem-real-11',
    title: 'The Asymmetrical Sculpted Crepe Cocktail Dress',
    tagline: 'One-Shoulder Column Midi with Sculptural Drape in Deep Bordeaux',
    gender: 'female',
    occasion: 'Cocktail Soirée & Gala',
    occasionCategory: 'cocktail',
    harmonyType: 'Monochromatic',
    model: {
      name: 'Elena Rostova',
      ethnicity: 'European Haute Couture',
      height: '5\'11" (180 cm)',
      wearingSize: 'Size 36 / Sculptural Fit',
    },
    imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900&auto=format&fit=crop',
    colorPalette: [
      { name: 'Deep Bordeaux Wine', hex: '#881337', role: 'primary', description: 'Rich velvet red wine projecting refined sensuality.' },
      { name: 'Bright Sterling Silver', hex: '#E2E8F0', role: 'accent', description: 'Cool metallic contrast in drop earrings and cuffs.' },
      { name: 'Noir Obsidian', hex: '#020617', role: 'neutral', description: 'Footwear and evening clutch grounding.' },
      { name: 'Rosé Shimmer', hex: '#BE185D', role: 'secondary', description: 'High-contrast edge reflection under flash.' },
    ],
    whyItWorks: 'The asymmetrical one-shoulder cut creates an arresting diagonal line across the collarbones, perfectly balanced by a streamlined calf-length pencil slit.',
    fabricSummary: '310 GSM Bonded Stretch Crepe with Interior Bodice Boning',
    pieces: [
      { slot: 'top', name: 'One-Shoulder Sculpted Crepe Bodice', colorName: 'Deep Bordeaux Wine', colorHex: '#881337', fabric: 'Bonded Crepe', details: 'Architectural fold over right shoulder with hidden side zip.' },
      { slot: 'bottom', name: 'Pencil Column Midi Skirt with Back Vent', colorName: 'Deep Bordeaux Wine', colorHex: '#881337', fabric: 'Bonded Crepe', details: 'Sleek contoured fit hitting just below the knee.' },
      { slot: 'footwear', name: 'Minimalist Stiletto Ankle-Strap Sandals', colorName: 'Noir Obsidian', colorHex: '#020617', fabric: 'Nappa Leather', details: 'Barely-there delicate strap highlighting foot arches.' },
      { slot: 'accessory', name: 'Cascading Crystal Chandelier Drop Earrings', colorName: 'Bright Sterling Silver', colorHex: '#E2E8F0', fabric: 'Rhodium Plated & Crystals', details: 'Frames the exposed bare shoulder opposite the strap.' },
    ],
    stylingAdvice: 'Keep hair swept back on the strap side; skip necklaces to let the architectural diagonal neckline take center stage.',
  },

  // ==========================================
  // MEN'S REAL CLOTHES OPTIONS
  // ==========================================
  {
    id: 'men-real-1',
    title: 'The Savile Row Boardroom Power Suit',
    tagline: 'Two-Piece Structured Worsted Wool Suit in Midnight Navy & Crisp White',
    gender: 'male',
    occasion: 'Job Interview & Executive Assessment',
    occasionCategory: 'interview',
    harmonyType: 'High-Contrast Luxury',
    model: {
      name: 'Lucas Sterling',
      ethnicity: 'Savile Row Tailored Poise',
      height: '6\'1" (185 cm)',
      wearingSize: 'Size 40R / Regular Tailored',
    },
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&auto=format&fit=crop',
    colorPalette: [
      { name: 'Deep Midnight Navy', hex: '#0F172A', role: 'primary', description: 'Commands instant corporate respect and intellectual focus.' },
      { name: 'Egyptian Cotton White', hex: '#FAF8F5', role: 'secondary', description: 'Pristine shirt collar creating razor-sharp facial framing.' },
      { name: 'Burnished Antique Cognac', hex: '#78350F', role: 'accent', description: 'Rich leather footwear and belt warmth.' },
      { name: 'Polished Stainless Steel', hex: '#94A3B8', role: 'neutral', description: 'Cufflink and timepiece metal unity.' },
    ],
    whyItWorks: 'Navy suiting paired with crisp white and warm cognac leather is the universally acclaimed golden standard for interviews, projecting integrity, precision, and executive maturity.',
    fabricSummary: '270 GSM Super 150s Australian Merino Worsted Wool',
    pieces: [
      { slot: 'outerwear', name: 'Single-Breasted 2-Button Peak Lapel Jacket', colorName: 'Deep Midnight Navy', colorHex: '#0F172A', fabric: 'Super 150s Merino Wool', details: 'Natural shoulder construction with pick-stitched lapels and dual rear vents.' },
      { slot: 'top', name: 'Sea-Island Spread Collar Dress Shirt', colorName: 'Egyptian Cotton White', colorHex: '#FAF8F5', fabric: '100% 2-Ply Cotton', details: 'Mother-of-pearl buttons and crisp French cuffs.' },
      { slot: 'bottom', name: 'Flat-Front Tailored Wool Trousers', colorName: 'Deep Midnight Navy', colorHex: '#0F172A', fabric: 'Super 150s Merino Wool', details: 'Razor-sharp center crease with slight break over the shoe vamp.' },
      { slot: 'footwear', name: 'Goodyear-Welted Cap-Toe Oxford Brogues', colorName: 'Antique Cognac', colorHex: '#78350F', fabric: 'Full-Grain Box Calf Leather', details: 'Mirror-shined toe cap with oak bark leather soles.' },
      { slot: 'accessory', name: '39mm Swiss Automatic Dress Watch', colorName: 'Stainless Steel', colorHex: '#94A3B8', fabric: 'Brushed Steel on Alligator Strap', details: 'Slim 8.5mm profile slipping cleanly beneath shirt cuffs.' },
    ],
    stylingAdvice: 'Ensure exactly 0.5 inches of shirt cuff is visible past the jacket sleeve; condition shoes to a high mirror polish.',
  },
  {
    id: 'men-real-2',
    title: 'The Royal Raw Silk Bandhgala Tuxedo',
    tagline: 'Imperial Mandarin Collar Jacket in Midnight Obsidian & Gold Buttons',
    gender: 'male',
    occasion: 'Luxury Wedding & Reception Gala',
    occasionCategory: 'wedding',
    harmonyType: 'Complementary',
    model: {
      name: 'Dev Malhotra',
      ethnicity: 'Royal Heritage & Contemporary Edge',
      height: '6\'2" (188 cm)',
      wearingSize: 'Size 42 / Slim Cut',
    },
    imageUrl: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=900&auto=format&fit=crop',
    colorPalette: [
      { name: 'Midnight Obsidian', hex: '#1E293B', role: 'primary', description: 'Regal dark backdrop accentuating golden embroidery.' },
      { name: 'Pearl Cream Silk', hex: '#FAF8F5', role: 'secondary', description: 'Churidar trousers delivering clean contrast.' },
      { name: '22k Hand-Carved Gold', hex: '#D4AF37', role: 'accent', description: 'Gilded button placket and royal brooch.' },
      { name: 'Velvet Midnight Black', hex: '#020617', role: 'neutral', description: 'Grounding ceremonial loafers.' },
    ],
    whyItWorks: 'The structured mandarin collar naturally draws the neck and chin upright, imparting an imperial poise ideal for evening weddings and grand galas.',
    fabricSummary: '320 GSM Hand-Spun Matka Raw Silk & Pure Silk Churidar',
    pieces: [
      { slot: 'outerwear', name: 'Structured Mandarin Bandhgala Jacket', colorName: 'Midnight Obsidian', colorHex: '#1E293B', fabric: '320 GSM Raw Silk', details: 'Hand-carved brass buttons with micro zari piping on collar.' },
      { slot: 'bottom', name: 'Tapered Pearl Raw Silk Jodhpur Trousers', colorName: 'Pearl Cream Silk', colorHex: '#FAF8F5', fabric: 'Raw Silk Blend', details: 'Tapered ankle cut designed for ceremonial footwear.' },
      { slot: 'footwear', name: 'Embroidered Velvet Mojri Loafers', colorName: 'Midnight Black & Gold', colorHex: '#020617', fabric: 'Velvet & Metallic Thread', details: 'Padded leather insole engineered for ballroom receptions.' },
      { slot: 'accessory', name: 'Uncut Polki Diamond & Gold Signet Ring', colorName: '22k Gold', colorHex: '#D4AF37', fabric: '22k Gold Foil & Stone', details: 'Statement heirloom piece worn on the right hand.' },
    ],
    stylingAdvice: 'Fasten all buttons except the lowest; stand tall with shoulders squared over the pelvis.',
  },
  {
    id: 'men-real-3',
    title: 'The Milanese Slub Linen Resort Ensemble',
    tagline: 'Terracotta Slub Linen Camp Collar Shirt & Warm Sand Pleated Chinos',
    gender: 'male',
    occasion: 'Smart Casual & Commuter Chic',
    occasionCategory: 'casual',
    harmonyType: 'Earth Tones',
    model: {
      name: 'Lucas Sterling',
      ethnicity: 'Modern Mediterranean Casual',
      height: '6\'1" (185 cm)',
      wearingSize: 'Size L / Relaxed Fit',
    },
    imageUrl: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=900&auto=format&fit=crop',
    colorPalette: [
      { name: 'Terracotta Sunburst', hex: '#C2410C', role: 'primary', description: 'Rich Mediterranean earth tone radiating warmth.' },
      { name: 'Warm Sand Dune', hex: '#FAF8F5', role: 'secondary', description: 'Fluid lightweight linen chinos balancing warmth.' },
      { name: 'Olive Green Laurel', hex: '#65A30D', role: 'accent', description: 'Canvas watch strap and woven belt subtle accent.' },
      { name: 'Snuff Italian Suede', hex: '#78350F', role: 'neutral', description: 'Understated shoe texture grounding the look.' },
    ],
    whyItWorks: 'Terracotta and warm sand channel Mediterranean sprezzatura, providing effortless airflow and timeless relaxed elegance for warm-weather gatherings.',
    fabricSummary: '220 GSM Normandy Open-Weave Slub Linen & Cotton Twill',
    pieces: [
      { slot: 'top', name: 'Open-Weave Slub Linen Camp Collar Shirt', colorName: 'Terracotta Sunburst', colorHex: '#C2410C', fabric: '100% Normandy Linen', details: 'Camp collar with chest patch pocket and relaxed straight hem.' },
      { slot: 'bottom', name: 'Relaxed Single-Pleat Linen Chinos', colorName: 'Warm Sand Dune', colorHex: '#FAF8F5', fabric: 'Linen-Cotton Blend', details: 'High-rise with internal drawstring and clean cuff hem.' },
      { slot: 'footwear', name: 'Unlined Italian Snuff Suede Penny Loafers', colorName: 'Snuff Brown', colorHex: '#78350F', fabric: 'Reverse Calf Suede', details: 'Ultra-flexible unlined construction worn sockless.' },
      { slot: 'accessory', name: 'Vintage Field Watch on Olive Canvas Strap', colorName: 'Olive Green', colorHex: '#65A30D', fabric: 'Matte Sandblasted Bronze', details: 'Rugged yet refined presence.' },
    ],
    stylingAdvice: 'Wear the camp collar open; unbutton the top two buttons and roll the chino cuffs once for breezy nonchalance.',
  },
  {
    id: 'men-real-4',
    title: 'The Contemporary Smart Commuter Capsule',
    tagline: 'Navy Utility Zip Jacket, Oxford Cotton Shirt & Indigo Denim',
    gender: 'male',
    occasion: 'Casual Day Out',
    occasionCategory: 'casual',
    harmonyType: 'Monochromatic',
    model: {
      name: 'Dev Malhotra',
      ethnicity: 'Urban Contemporary Explorer',
      height: '6\'2" (188 cm)',
      wearingSize: 'Size M / Tailored Athletic',
    },
    imageUrl: '/images/branding/mens-smart-casual.jpg',
    colorPalette: [
      { name: 'Technical Royal Indigo', hex: '#1E3A8A', role: 'primary', description: 'Modern sleek jacket tone projecting active confidence.' },
      { name: 'Crisp Oxford Sky Blue', hex: '#93C5FD', role: 'secondary', description: 'Classic underlayer shirt tone.' },
      { name: 'Raw Indigo Denim', hex: '#0F172A', role: 'neutral', description: 'Dark rinse jeans providing grounding structure.' },
      { name: 'Amber Gum Sole', hex: '#D97706', role: 'accent', description: 'Footwear sole contrast.' },
    ],
    whyItWorks: 'Layered shades of navy, sky blue, and raw denim create a monochromatic aesthetic that feels sleek, intentional, and supremely versatile.',
    fabricSummary: 'Water-Resistant Technical Cotton Blend & 14 oz Selvedge Denim',
    pieces: [
      { slot: 'outerwear', name: 'Tailored Water-Resistant Commuter Jacket', colorName: 'Technical Navy', colorHex: '#1E3A8A', fabric: 'Technical Cotton Blend', details: 'Minimalist two-way front zip with stand collar.' },
      { slot: 'top', name: 'Garment-Dyed Oxford Button-Down Shirt', colorName: 'Sky Blue', colorHex: '#93C5FD', fabric: '100% Oxford Cotton', details: 'Button-down collar and curved shirttail hem.' },
      { slot: 'bottom', name: 'Slim-Tapered Raw Selvedge Denim Jeans', colorName: 'Deep Indigo', colorHex: '#0F172A', fabric: '14 oz Kurabo Japanese Denim', details: 'Clean dark rinse with no artificial distressing.' },
      { slot: 'footwear', name: 'Leather Minimalist Court Trainers', colorName: 'White & Gum', colorHex: '#FAF8F5', fabric: 'Italian Nappa Leather & Gum Rubber', details: 'Gum sole and tonal stitching.' },
    ],
    stylingAdvice: 'Leave the jacket unzipped halfway to show the sky blue shirt collar; pair with a matte leather backpack.',
  },
  {
    id: 'men-real-5',
    title: 'The Black Tie Velvet Smoking Tuxedo',
    tagline: 'Obsidian Velvet Dinner Jacket with Satin Shawl Lapel & Tuxedo Trousers',
    gender: 'male',
    occasion: 'Cocktail Soirée & Gala',
    occasionCategory: 'cocktail',
    harmonyType: 'High-Contrast Luxury',
    model: {
      name: 'Lucas Sterling',
      ethnicity: 'Sartorial Evening Royalty',
      height: '6\'1" (185 cm)',
      wearingSize: 'Size 40L / Bespoke Tuxedo',
    },
    imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=900&auto=format&fit=crop',
    colorPalette: [
      { name: 'Midnight Velvet Noir', hex: '#0A192F', role: 'primary', description: 'Absorbs and reflects low evening lighting with rich depth.' },
      { name: 'Duchesse Satin Black', hex: '#020617', role: 'neutral', description: 'Glossy lapel and side-stripe trim.' },
      { name: 'Pristine Marcella White', hex: '#FAF8F5', role: 'secondary', description: 'Tuxedo shirt bib delivering brilliant contrast.' },
      { name: 'Polished Black Onyx & Silver', hex: '#E2E8F0', role: 'accent', description: 'Shirt studs and cufflink precision.' },
    ],
    whyItWorks: 'The textural contrast between plush cotton velvet, lustrous silk satin, and crisp piqué cotton elevates evening formality to pure black-tie art.',
    fabricSummary: 'Italian Cotton Velvet & Duchesse Silk Satin',
    pieces: [
      { slot: 'outerwear', name: 'Shawl Lapel Velvet Dinner Jacket', colorName: 'Midnight Velvet Noir', colorHex: '#0A192F', fabric: 'Italian Cotton Velvet', details: 'Satin-faced shawl lapels with single satin-covered button.' },
      { slot: 'top', name: 'Marcella Bib Front Tuxedo Shirt', colorName: 'Pristine White', colorHex: '#FAF8F5', fabric: 'Swiss Cotton Piqué', details: 'Turndown formal collar and French cuffs for onyx cufflinks.' },
      { slot: 'bottom', name: 'Barathea Wool Tuxedo Trousers', colorName: 'Duchesse Black', colorHex: '#020617', fabric: 'Barathea Wool', details: 'Side satin braid stripe with side adjusters.' },
      { slot: 'footwear', name: 'Patent Leather Opera Pumps with Grosgrain Bow', colorName: 'Glossy Black', colorHex: '#020617', fabric: 'Patent Leather', details: 'Mirror finish reflecting red-carpet flash photography.' },
      { slot: 'accessory', name: 'Black Onyx & Sterling Silver Cufflink Suite', colorName: 'Onyx & Silver', colorHex: '#E2E8F0', fabric: 'Sterling Silver & Onyx', details: 'Geometric studs and matching cufflinks.' },
    ],
    stylingAdvice: 'Tie a silk grosgrain bow tie by hand; always keep the dinner jacket buttoned when standing.',
  },
  {
    id: 'men-real-6',
    title: 'The Royal Imperial Zari Sherwani',
    tagline: 'Pure Matka Silk Hand-Embroidered Sherwani with Churidar & Velvet Stole',
    gender: 'male',
    occasion: 'Royal Wedding & Groom Grandeur',
    occasionCategory: 'wedding',
    harmonyType: 'High-Contrast Luxury',
    model: {
      name: 'Dev Malhotra',
      ethnicity: 'Royal Heritage & Contemporary Edge',
      height: '6\'2" (188 cm)',
      wearingSize: 'Size 42 / Tailored Sherwani',
    },
    imageUrl: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=900&auto=format&fit=crop',
    colorPalette: [
      { name: 'Imperial Ivory Silk', hex: '#FAF8F5', role: 'primary', description: 'Pure lustrous silk canvas reflecting ceremonial nobility.' },
      { name: 'Antique 24k Zari Gold', hex: '#D4AF37', role: 'secondary', description: 'Intricate zardozi needlework along collar and cuffs.' },
      { name: 'Royal Emerald Green', hex: '#064E3B', role: 'accent', description: 'Multi-strand emerald mala and brooch.' },
      { name: 'Velvet Midnight Black', hex: '#020617', role: 'neutral', description: 'Footwear foundation.' },
    ],
    whyItWorks: 'The knee-length structured sherwani with hand-carved golden buttons and stand collar commands instant ceremonial reverence and supreme masculine poise.',
    fabricSummary: '360 GSM Pure Handloom Matka Silk with Gold Zardozi Embroidery',
    pieces: [
      { slot: 'outerwear', name: 'Hand-Embroidered Zari Silk Sherwani', colorName: 'Imperial Ivory Silk', colorHex: '#FAF8F5', fabric: '360 GSM Pure Matka Silk', details: 'Full front gilded button placket with micro-zari floral jaal.' },
      { slot: 'top', name: 'Fine Chanderi Silk Kurta Underlayer', colorName: 'Imperial Ivory Silk', colorHex: '#FAF8F5', fabric: 'Chanderi Silk', details: 'Mandarin collar with concealed placket for seamless layering.' },
      { slot: 'bottom', name: 'Gathered Mulberry Silk Churidar', colorName: 'Imperial Ivory Silk', colorHex: '#FAF8F5', fabric: 'Pure Silk Crepe', details: 'Fitted ankle gathers falling crisply over ceremonial footwear.' },
      { slot: 'footwear', name: 'Embroidered Velvet Zari Juttis', colorName: 'Antique Gold & Velvet', colorHex: '#D4AF37', fabric: 'Italian Velvet & Metallic Thread', details: 'Curled toe crest with memory foam cushioned arch.' },
      { slot: 'accessory', name: 'Multi-Strand Basra Pearl & Emerald Haar', colorName: 'Royal Emerald Green', colorHex: '#064E3B', fabric: 'Natural Saltwater Pearls & Gemstones', details: 'Draped symmetrically across the sherwani chest.' },
    ],
    stylingAdvice: 'Drape the matching embroidered stole over the right shoulder; ensure the collar stands tall and crisp.',
  },
  {
    id: 'men-real-7',
    title: 'The Indo-Western Draped Asymmetrical Kurta',
    tagline: 'Draped Cowl-Hem Kurta with Structured Embroidered Nehru Bandi Jacket',
    gender: 'male',
    occasion: 'Festive Sangeet & Cocktail Celebration',
    occasionCategory: 'festive',
    harmonyType: 'Earth Tones',
    model: {
      name: 'Dev Malhotra',
      ethnicity: 'Royal Heritage & Contemporary Edge',
      height: '6\'2" (188 cm)',
      wearingSize: 'Size 40 / Fluid Asymmetrical Cut',
    },
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&auto=format&fit=crop',
    colorPalette: [
      { name: 'Deep Wine Marsala', hex: '#881337', role: 'primary', description: 'Rich intoxicating red wine tone for celebratory evenings.' },
      { name: 'Antique Brass Gold', hex: '#D4AF37', role: 'secondary', description: 'Metallic buttons and Nehru jacket threadwork.' },
      { name: 'Obsidian Noir', hex: '#0F172A', role: 'neutral', description: 'Tailored trousers providing clean foundation.' },
      { name: 'Champagne Silk Highlight', hex: '#FAF8F5', role: 'accent', description: 'Pocket square contrast.' },
    ],
    whyItWorks: 'Fuses millennium-old drapery with contemporary architectural menswear: the asymmetrical diagonal hem creates dynamic visual motion during movement.',
    fabricSummary: '240 GSM Mulberry Silk Georgette & Raw Silk Brocade Bandi',
    pieces: [
      { slot: 'outerwear', name: 'Embroidered Raw Silk Nehru Bandi Jacket', colorName: 'Deep Wine Marsala', colorHex: '#881337', fabric: 'Raw Silk Brocade', details: 'Mandarin collar with antique brass metallic buttons and welt chest pocket.' },
      { slot: 'top', name: 'Asymmetrical Draped Cowl Kurta Tunic', colorName: 'Deep Wine Marsala', colorHex: '#881337', fabric: 'Silk Georgette Blend', details: 'Fluid diagonal overlapping front with side slit.' },
      { slot: 'bottom', name: 'Tapered Slim-Fit Italian Wool Trousers', colorName: 'Obsidian Noir', colorHex: '#0F172A', fabric: 'Super 130s Wool', details: 'Modern no-break ankle cut replacing traditional pajama for sharper stance.' },
      { slot: 'footwear', name: 'Hand-Burnished Monkstrap Leather Shoes', colorName: 'Espresso Noir', colorHex: '#0F172A', fabric: 'Full-Grain Box Calf', details: 'Double brass buckles echoing Nehru jacket hardware.' },
      { slot: 'accessory', name: 'Hammered Brass Signet Ring & Vintage Pocket Watch', colorName: 'Antique Brass Gold', colorHex: '#D4AF37', fabric: 'Aged Brass', details: 'Subtle sartorial touch placed in jacket vest pocket.' },
    ],
    stylingAdvice: 'Keep the Nehru jacket fastened on the upper 3 buttons; let the draped cowl hem flow freely beneath.',
  },
  {
    id: 'men-real-8',
    title: 'The Neapolitan Double-Breasted Linen Suit',
    tagline: 'Unstructured Sage Olive Slub Linen Blazer with High-Waist Gurkha Pants',
    gender: 'male',
    occasion: 'Summer Garden Soirée & Resort Gala',
    occasionCategory: 'casual',
    harmonyType: 'Earth Tones',
    model: {
      name: 'Lucas Sterling',
      ethnicity: 'Modern Mediterranean Casual',
      height: '6\'1" (185 cm)',
      wearingSize: 'Size 40R / Neapolitan Soft Cut',
    },
    imageUrl: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=900&auto=format&fit=crop',
    colorPalette: [
      { name: 'Sage Olive Green', hex: '#3F6212', role: 'primary', description: 'Understated Mediterranean earth tone signaling quiet refinement.' },
      { name: 'Crisp Ecru Linen', hex: '#FAF8F5', role: 'secondary', description: 'Breathable popover shirt contrast.' },
      { name: 'Burnished Tobacco Leather', hex: '#78350F', role: 'accent', description: 'Penny loafers and woven leather belt.' },
      { name: 'Warm Jute Sand', hex: '#E2D9C8', role: 'neutral', description: 'Subtle slub weave undertone.' },
    ],
    whyItWorks: 'Neapolitan soft tailoring eliminates stiff shoulder pads, using 100% natural slub linen for breathable comfort and effortless Italian sprezzatura.',
    fabricSummary: '240 GSM Pure Normandy Slub Linen with Unlined Interior Construction',
    pieces: [
      { slot: 'outerwear', name: 'Double-Breasted Unstructured 4x2 Linen Jacket', colorName: 'Sage Olive Green', colorHex: '#3F6212', fabric: '100% Normandy Linen', details: 'Spalla camicia pleated shirt-shoulders and patch hip pockets.' },
      { slot: 'top', name: 'Open One-Piece Camp Collar Linen Shirt', colorName: 'Crisp Ecru Linen', colorHex: '#FAF8F5', fabric: 'Slub Linen Weave', details: 'Mother-of-pearl buttons with relaxed straight hem.' },
      { slot: 'bottom', name: 'Double-Pleated High-Waisted Gurkha Trousers', colorName: 'Sage Olive Green', colorHex: '#3F6212', fabric: '100% Normandy Linen', details: 'Extended double-buckle waistband with 1.75" cuffs.' },
      { slot: 'footwear', name: 'Snuff Suede Belgian Loafers', colorName: 'Burnished Tobacco', colorHex: '#78350F', fabric: 'Reverse Calf Suede', details: 'Hand-sewn apron with small bow accent worn sockless.' },
      { slot: 'accessory', name: 'Vintage Tortoise Sunglasses & Bronze Chronometer', colorName: 'Burnished Tobacco', colorHex: '#78350F', fabric: 'Acetate & Bronze', details: 'Casual Riviera luxury essentials.' },
    ],
    stylingAdvice: 'Leave the jacket unfastened or button only the internal anchor; roll trousers slightly above the ankle.',
  },
  {
    id: 'men-real-9',
    title: 'The Savile Row 3-Piece Peak Tuxedo',
    tagline: 'Formal Obsidian Evening Tuxedo with Grosgrain Silk Lapels & Horseshoe Vest',
    gender: 'male',
    occasion: 'Black-Tie Opera & Charity Ball',
    occasionCategory: 'cocktail',
    harmonyType: 'High-Contrast Luxury',
    model: {
      name: 'Lucas Sterling',
      ethnicity: 'Sartorial Evening Royalty',
      height: '6\'1" (185 cm)',
      wearingSize: 'Size 40L / 3-Piece Bespoke Cut',
    },
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&auto=format&fit=crop',
    colorPalette: [
      { name: 'Obsidian Midnight Black', hex: '#020617', role: 'primary', description: 'Deepest formal black with light-absorbing grosgrain trim.' },
      { name: 'Swiss Cotton Marcella White', hex: '#FAF8F5', role: 'secondary', description: 'Crisp stiff bib shirt delivering absolute contrast.' },
      { name: 'Polished Black Onyx', hex: '#0F172A', role: 'neutral', description: 'Studs and cufflinks.' },
      { name: 'Platinum Satin', hex: '#E2E8F0', role: 'accent', description: 'Pocket square micro piping.' },
    ],
    whyItWorks: 'The low-cut horseshoe evening vest frames the pleated shirt bib while keeping the waist seamlessly covered, maintaining pristine formal lines even when unbuttoning the coat.',
    fabricSummary: '290 GSM Super 160s Worsted Wool Barathea with Pure Silk Grosgrain',
    pieces: [
      { slot: 'outerwear', name: 'Single-Breasted 1-Button Peak Lapel Tuxedo', colorName: 'Obsidian Midnight Black', colorHex: '#020617', fabric: 'Super 160s Barathea Wool', details: 'Silk grosgrain faced peak lapels, jetted pockets, and no vents.' },
      { slot: 'top', name: 'Horseshoe Low-Cut 3-Button Evening Vest', colorName: 'Obsidian Midnight Black', colorHex: '#020617', fabric: 'Barathea Wool & Silk', details: 'Sculpted deep scoop framing formal Marcella shirt bib.' },
      { slot: 'bottom', name: 'Barathea Wool Tuxedo Trousers with Silk Braid', colorName: 'Obsidian Midnight Black', colorHex: '#020617', fabric: 'Barathea Wool', details: 'Single continuous silk grosgrain side stripe and side adjusters.' },
      { slot: 'footwear', name: 'Wholecut Patent Leather Oxford Shoes', colorName: 'Obsidian Midnight Black', colorHex: '#020617', fabric: 'Patent Leather', details: 'Cut from a single flawless piece of leather with mirror gloss.' },
      { slot: 'accessory', name: 'Hand-Tied Silk Grosgrain Butterfly Bowtie', colorName: 'Obsidian Midnight Black', colorHex: '#020617', fabric: 'Pure Mulberry Silk', details: 'Matches lapel facings precisely in texture and luster.' },
    ],
    stylingAdvice: 'Never wear a belt with black tie; adjust waist using the side tabs and ensure shoes are polished to a mirror reflection.',
  },
  {
    id: 'men-real-10',
    title: 'The Heritage Matka Silk Pathani Suit',
    tagline: 'Structured Stand-Collar Pathani Kurta with Pleated Salwar in Charcoal Slate',
    gender: 'male',
    occasion: 'Traditional Festive Celebration & Eid',
    occasionCategory: 'festive',
    harmonyType: 'Monochromatic',
    model: {
      name: 'Dev Malhotra',
      ethnicity: 'Royal Heritage & Contemporary Edge',
      height: '6\'2" (188 cm)',
      wearingSize: 'Size 42 / Traditional Comfort',
    },
    imageUrl: '/images/branding/hero-banner.jpg',
    colorPalette: [
      { name: 'Charcoal Slate Noir', hex: '#1E293B', role: 'primary', description: 'Imposing, dignified dark charcoal projecting masculine authority.' },
      { name: 'Burnished Antique Silver', hex: '#94A3B8', role: 'secondary', description: 'Metallic buttons and epaulet buckles.' },
      { name: 'Crisp Silk Ivory', hex: '#FAF8F5', role: 'neutral', description: 'Pocket square contrast.' },
      { name: 'Deep Onyx', hex: '#0F172A', role: 'accent', description: 'Leather footwear base.' },
    ],
    whyItWorks: 'The military-inspired shoulder epaulets, flapped chest pockets, and curved shirt-collar impart commanding masculine structure while the pleated salwar guarantees supreme all-day movement.',
    fabricSummary: '280 GSM Textured Handloom Matka Silk with Natural Slub Finish',
    pieces: [
      { slot: 'top', name: 'Shoulder Epaulet Structured Pathani Kurta Tunic', colorName: 'Charcoal Slate Noir', colorHex: '#1E293B', fabric: 'Handloom Matka Silk', details: 'Shirt collar with button tab epaulets and dual flap-pleat chest pockets.' },
      { slot: 'bottom', name: 'Traditional Deep-Pleated Silk Salwar Bottoms', colorName: 'Charcoal Slate Noir', colorHex: '#1E293B', fabric: 'Matka Silk Blend', details: 'Generous pleating tapering into clean cuff bands at ankle.' },
      { slot: 'footwear', name: 'Handcrafted Peshawari Leather Sandals', colorName: 'Deep Onyx', colorHex: '#0F172A', fabric: 'Full-Grain Buffalo Leather', details: 'Semi-pointed toe with thick tire-tread rubber sole.' },
      { slot: 'accessory', name: 'Engraved Silver Kada & Chronograph Watch', colorName: 'Burnished Antique Silver', colorHex: '#94A3B8', fabric: 'Solid Sterling Silver', details: 'Substantial metallic presence on right wrist.' },
    ],
    stylingAdvice: 'Roll the kurta sleeves up once with the interior button tab; keep the top collar button open for relaxed confidence.',
  },
  {
    id: 'men-real-11',
    title: 'The Luxury Urban Oversized Athleisure Tracksuit',
    tagline: 'Heavyweight 480 GSM French Terry Hoodie & Tailored Cargo Track Pants',
    gender: 'male',
    occasion: 'Streetwear & Creative Studio',
    occasionCategory: 'casual',
    harmonyType: 'Pastel Harmonic',
    model: {
      name: 'Lucas Sterling',
      ethnicity: 'Modern Urban Streetwear',
      height: '6\'1" (185 cm)',
      wearingSize: 'Size L / Boxy Silhouette',
    },
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=900&auto=format&fit=crop',
    colorPalette: [
      { name: 'Mineral Bone Ivory', hex: '#FAF8F5', role: 'primary', description: 'Clean minimalist off-white setting contemporary luxury tone.' },
      { name: 'Shadow Slate Grey', hex: '#475569', role: 'secondary', description: 'Grounded neutral contrast in cargo details.' },
      { name: 'Jet Noir', hex: '#0F172A', role: 'neutral', description: 'Chunky sneaker and crossbody hardware.' },
      { name: 'Amber Gum', hex: '#D97706', role: 'accent', description: 'Footwear sole warmth.' },
    ],
    whyItWorks: 'Engineered with ultra-heavy 480 GSM looped French terry, holding an architectural, boxy drape that transforms casual comfort into high-fashion streetwear credibility.',
    fabricSummary: '480 GSM 100% Organic Heavyweight Cotton French Terry',
    pieces: [
      { slot: 'top', name: 'Double-Layered Hood Boxy Heavyweight Hoodie', colorName: 'Mineral Bone Ivory', colorHex: '#FAF8F5', fabric: '480 GSM French Terry', details: 'Seamless kangaroo pocket, drop shoulders, and ribbed hem.' },
      { slot: 'bottom', name: 'Tapered Tailored Fleece Cargo Joggers', colorName: 'Mineral Bone Ivory', colorHex: '#FAF8F5', fabric: '480 GSM French Terry', details: 'Concealed zip cargo pockets and heavy braided drawstring.' },
      { slot: 'footwear', name: 'Chunky Architectural Designer Runners', colorName: 'Jet Noir & Bone', colorHex: '#0F172A', fabric: 'Mesh & Nubuck Leather', details: 'Sculptural Vibram rubber sole providing aggressive street stance.' },
      { slot: 'accessory', name: 'Matte Nylon Crossbody Chest Bag & Silver Chain', colorName: 'Jet Noir', colorHex: '#0F172A', fabric: 'Cordura Nylon & Sterling Silver', details: 'Technical functional accessories completing the urban uniform.' },
    ],
    stylingAdvice: 'Layer a longer raw-edge white tee beneath the hoodie hem; cinch the cargo cuffs right above the sneaker collar.',
  },
];

/**
 * Filter real clothes options by gender, occasion, and/or preferred color keyword.
 */
export function getRealClothesOptions(
  gender: 'female' | 'male' | 'unisex' = 'female',
  occasion?: string,
  preferredColor?: string
): RealClothesOption[] {
  let filtered = REAL_CLOTHES_OPTIONS.filter((item) => {
    if (gender === 'unisex') return true;
    return item.gender === gender || item.gender === 'unisex';
  });

  if (occasion) {
    const occLower = occasion.toLowerCase();
    const occasionMatched = filtered.filter((item) => {
      return (
        item.occasion.toLowerCase().includes(occLower) ||
        occLower.includes(item.occasionCategory)
      );
    });
    if (occasionMatched.length > 0) {
      filtered = occasionMatched;
    }
  }

  if (preferredColor) {
    const colorLower = preferredColor.toLowerCase();
    // Sort items matching the preferred color to the top
    filtered.sort((a, b) => {
      const aMatch = a.colorPalette.some((c) =>
        c.name.toLowerCase().includes(colorLower) || c.hex.toLowerCase() === colorLower
      );
      const bMatch = b.colorPalette.some((c) =>
        c.name.toLowerCase().includes(colorLower) || c.hex.toLowerCase() === colorLower
      );
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return 0;
    });
  }

  return filtered;
}

export function getRealClothesById(id: string): RealClothesOption | undefined {
  return REAL_CLOTHES_OPTIONS.find((item) => item.id === id);
}
