// agent-notes: { ctx: "real clothes & real model options catalog JS module", deps: [], state: active, last: "tara@2026-09-09" }

export const REAL_CLOTHES_OPTIONS = [
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
  }
];

export function getRealClothesOptions(gender = 'female', occasion, preferredColor) {
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

export function getRealClothesById(id) {
  return REAL_CLOTHES_OPTIONS.find((item) => item.id === id);
}
