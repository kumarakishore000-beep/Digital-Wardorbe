import { NextResponse } from 'next/server';

export interface WalkInAdvice {
  entranceVibe: string;
  postureAndGait: string;
  holdingStyle: string;
  lightingPresence: string;
}

export interface AccessoryDetail {
  name: string;
  style: string;
  finish: string;
  advice: string;
}

export interface AccessoriesSuite {
  shoe: AccessoryDetail;
  watch: AccessoryDetail;
  ring: AccessoryDetail;
  chain: AccessoryDetail;
  bracelet: AccessoryDetail;
  bag?: AccessoryDetail;
}

export interface FabricIntelligence {
  fabricName: string;
  texture: string;
  breathability: 'High' | 'Medium' | 'Low';
  drapeAndWeight: string; // e.g. "260 GSM Mid-weight"
  careInstructions: string;
}

export interface SizeAndFitOpinion {
  recommendedFit: 'slim' | 'regular' | 'oversized';
  fitRationale: string;
  tailoringGuide: string;
  shouldersAndCuffs: string;
  trouserBreak: string;
}

export interface RealHumanModel {
  imageUrl: string;
  title: string;
  editorialSource: string;
  modelHeight: string;
  modelWearing: string;
  lookAngle: string;
}

export interface OutfitRecommendationResponse {
  title: string;
  overview: string;
  mood: string;
  gender?: string;
  dressWearStyle: string;
  dressModel: string;
  items: {
    upperBody: string;
    lowerBody: string;
    footwear: string;
    outerwear?: string;
  };
  accessories: Array<{
    category: string;
    name: string;
    description: string;
  }>;
  accessoriesSuite: AccessoriesSuite;
  fabricIntelligence: FabricIntelligence;
  sizeAndFitOpinion: SizeAndFitOpinion;
  realHumanModel: RealHumanModel;
  colorPalette: Array<{
    name: string;
    hex: string;
  }>;
  stylingTips: string[];
  weatherSuitability: string;
  walkInAdvice: WalkInAdvice;
  interviewAdvice?: string;
  weddingAdvice?: string;
  source?: string;
  modelUsed?: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      occasion = 'Job Interview', 
      colorPreference = 'Navy & Ivory', 
      weather = 'Mild 20°C',
      gender = 'female'
    } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        ...getFallbackOutfit(occasion, colorPreference, weather, gender),
        source: 'fallback',
        modelUsed: 'Fallback Engine (Missing API Key)'
      });
    }

    const systemPrompt = `You are an elite high-fashion designer, personal stylist, and wardrobe consultant for luxury magazines (Vogue, GQ, Harper's Bazaar, Pinterest Fashion).
Provide a complete, master-class styling solution tailored specifically for:
- Gender: ${gender}
- Occasion: ${occasion} (Pay special attention if this is a Job Interview, Wedding, Cocktail, Evening Gala, or Formal Celebration!)
- Color Palette Preference: ${colorPreference}
- Weather Condition: ${weather}

Return a valid JSON object matching this EXACT structure:
{
  "title": "Short catchy high-fashion ensemble title (e.g. The Savile Row Executive Power Suit)",
  "overview": "2-3 sentences explaining why this look commands respect and elegance for a ${gender} during a ${occasion} in ${weather}.",
  "mood": "2-3 word aesthetic summary (e.g. Boardroom Authority, Royal Wedding Grandeur)",
  "gender": "${gender}",
  "dressWearStyle": "Exact fashion genre and dress wear style (e.g. Modern Executive Power Suiting, Regal Festive Indo-Western)",
  "dressModel": "Exact silhouette and cut model (e.g. Double-Breasted Peak Lapel & Fluid Pleated Trousers, Floor-Length Flute Sweetheart Gown)",
  "items": {
    "upperBody": "Detailed description of top garment with fabric, collar/lapel, and drape notes",
    "lowerBody": "Detailed description of bottom garment with waistband, pleats, cut, and hem length",
    "footwear": "Specific shoe/heel model, leather/fabric finish, and sole type",
    "outerwear": "Structured blazer, coat, or cardigan with tailoring specifications"
  },
  "accessories": [
    { "category": "Shoe", "name": "Exact shoe model", "description": "Why it grounds the outfit" },
    { "category": "Watch", "name": "Exact watch model and metal finish", "description": "Wrist precision" },
    { "category": "Ring", "name": "Exact ring band and finish", "description": "Hand accent" },
    { "category": "Chain", "name": "Exact chain / necklace style and length", "description": "Neckline complement" },
    { "category": "Bracelet", "name": "Exact bracelet model", "description": "Wrist harmony" },
    { "category": "Bag", "name": "Exact bag / clutch model", "description": "Proportion balance" }
  ],
  "accessoriesSuite": {
    "shoe": {
      "name": "Shoe Model (e.g. Hand-Burnished Cap-Toe Oxfords or Pointed-Toe 85mm Leather Pumps)",
      "style": "Formal Dress / Stiletto / Loafer / Oxford",
      "finish": "Cognac Calf Leather / Patent Black / Metallic Nude",
      "advice": "How this specific shoe anchors the trousers/skirt break and matches the leather belt or clutch hardware."
    },
    "watch": {
      "name": "Watch Model (e.g. 39mm Chronograph on Alligator Strap or 28mm Gold Mesh Dress Watch)",
      "style": "Dress Watch / Minimalist Chronograph",
      "finish": "Champagne Gold / Brushed Stainless Steel / Rose Gold",
      "advice": "Keep the case profile thin to slide effortlessly under shirt/blazer cuffs."
    },
    "ring": {
      "name": "Ring Model (e.g. Brushed Platinum Signet Ring or Solitaire Emerald-Cut Band)",
      "style": "Signet / Minimalist Band / Cocktail Gemstone",
      "finish": "Platinum / 18k Yellow Gold / Rose Gold",
      "advice": "Wear on pinky or ring finger for understated luxury."
    },
    "chain": {
      "name": "Chain/Necklace Model (e.g. 20-inch 18k Flat Herringbone Chain or Delicate Freshwater Pearl Pendant)",
      "style": "Collar Choker / Princess Length Chain / Minimalist Pendant",
      "finish": "18k Yellow Gold / Sterling Silver",
      "advice": "Rests cleanly above or inside the neckline without competing with the lapel."
    },
    "bracelet": {
      "name": "Bracelet Model (e.g. Minimalist Solid Gold Cuff or Tennis Diamond Line Bracelet)",
      "style": "Cuff / Tennis Bracelet / Link Chain",
      "finish": "Polished Gold / Brushed Titanium / Silver",
      "advice": "Placed on the opposite wrist of the watch to create visual equilibrium."
    },
    "bag": {
      "name": "Bag/Clutch Model (e.g. Structured Saffiano Leather Brief-Tote or Silk Minaudière Clutch)",
      "style": "Executive Brief / Evening Clutch / Crossbody",
      "finish": "Black Saffiano Leather with Gold Hardware",
      "advice": "Structured edges reinforce confidence during meetings and entrances."
    }
  },
  "fabricIntelligence": {
    "fabricName": "Exact luxury fabric composition (e.g. Super 140s Tasmanian Merino Wool & Silk Blend)",
    "texture": "Physical texture description (e.g. Supple twill weave with high crease-recovery and subtle luminous sheen)",
    "breathability": "High",
    "drapeAndWeight": "260 GSM Mid-weight four-season drape",
    "careInstructions": "Steam press between wears; dry clean only with eco-solvents."
  },
  "sizeAndFitOpinion": {
    "recommendedFit": "regular",
    "fitRationale": "Why this fit (slim, regular, or oversized) flatters the silhouette for this occasion",
    "tailoringGuide": "Specific tailoring rules (e.g. sleeve cuff should expose exactly 0.5 inch of dress shirt)",
    "shouldersAndCuffs": "Shoulder pads must end at natural deltoid line; sleeve hem rests at wrist bone",
    "trouserBreak": "Slight break resting lightly on the shoe vamp without pooling"
  },
  "realHumanModel": {
    "imageUrl": "Editorial reference image URL representing this look on a real model",
    "title": "Editorial Runway Look",
    "editorialSource": "Vogue Runway / Pinterest Couture Archive",
    "modelHeight": "5'11\" (180 cm)",
    "modelWearing": "Size 38 Regular (Tailored)",
    "lookAngle": "Front View & Catwalk Stride"
  },
  "colorPalette": [
    { "name": "Primary Base", "hex": "#1E293B" },
    { "name": "Secondary Drape", "hex": "#FAF8F5" },
    { "name": "Hardware Accent", "hex": "#D4AF37" }
  ],
  "stylingTips": [
    "Tip 1 for personal poise and styling",
    "Tip 2 for accessories unity",
    "Tip 3 for garment care and walk-in confidence"
  ],
  "weatherSuitability": "Explanation of thermal comfort in ${weather}",
  "walkInAdvice": {
    "entranceVibe": "Catchy walk-in title (e.g. Boardroom Authority Entry or Red-Carpet Grand Entrance)",
    "postureAndGait": "Specific walking gait, upright posture, and eye-level focus",
    "holdingStyle": "How to hold bag or hands while entering the room",
    "lightingPresence": "How fabrics and jewelry reflect lighting in the venue"
  },
  "interviewAdvice": "Special advice if this is an interview (how this ensemble projects competence, credibility, and modern approachability)",
  "weddingAdvice": "Special advice if this is a wedding (how this look respects celebration etiquette, photogenic aesthetics, and comfortable movement)"
}

Respond ONLY with raw valid JSON. Do not include markdown codeblock tags.`;

    const modelsToTry = [
      'gemini-3.6-flash',
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-1.5-flash',
    ];

    let geminiResponse: Response | null = null;
    let selectedModel = modelsToTry[0];

    for (const model of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: systemPrompt }],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            },
          }),
        });

        if (res.ok) {
          geminiResponse = res;
          selectedModel = model;
          break;
        }
      } catch (err) {
        console.warn(`Error connecting to model ${model}:`, err);
      }
    }

    if (!geminiResponse || !geminiResponse.ok) {
      return NextResponse.json({
        ...getFallbackOutfit(occasion, colorPreference, weather, gender),
        source: 'fallback',
        modelUsed: 'Fallback Engine',
      });
    }

    const data = await geminiResponse.json();
    const parts = data?.candidates?.[0]?.content?.parts || [];
    const rawText = parts.map((p: { text?: string }) => p.text || '').filter(Boolean).join('\n');
    
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    const cleanedText = jsonMatch ? jsonMatch[0] : rawText.replace(/```json/gi, '').replace(/```/g, '').trim();

    try {
      const parsedRecommendation: OutfitRecommendationResponse = JSON.parse(cleanedText);
      
      // Ensure real human model image is guaranteed high-quality
      if (!parsedRecommendation.realHumanModel || !parsedRecommendation.realHumanModel.imageUrl) {
        parsedRecommendation.realHumanModel = getRealModelReference(gender, occasion);
      }

      return NextResponse.json({
        ...parsedRecommendation,
        source: 'gemini-api',
        modelUsed: selectedModel,
      });
    } catch (parseError) {
      console.error('Failed to parse Gemini JSON output:', parseError, rawText);
      return NextResponse.json({
        ...getFallbackOutfit(occasion, colorPreference, weather, gender),
        source: 'fallback',
        modelUsed: 'Fallback Engine',
      });
    }
  } catch (error: unknown) {
    console.error('Error in outfit-recommendation route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error processing outfit recommendation' },
      { status: 500 }
    );
  }
}

function getRealModelReference(gender: string, occasion: string): RealHumanModel {
  const isMale = gender === 'male';
  const occ = occasion.toLowerCase();

  if (occ.includes('interview') || occ.includes('corporate') || occ.includes('business')) {
    return {
      imageUrl: isMale
        ? 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop'
        : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop',
      title: isMale ? 'Executive Savile Row Tailored Suiting' : 'Modern Executive Power Suit & Ivory Silk',
      editorialSource: 'GQ Executive Style / Pinterest Corporate Board',
      modelHeight: isMale ? '6\'1" (185 cm)' : '5\'10" (178 cm)',
      modelWearing: isMale ? 'Size 40R / Slim Tapered' : 'Size 38 / Tailored Fit',
      lookAngle: 'Front Standing Interview Presence',
    };
  }

  if (occ.includes('wedding') || occ.includes('gala') || occ.includes('black tie') || occ.includes('reception')) {
    return {
      imageUrl: isMale
        ? 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop'
        : 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop',
      title: isMale ? 'Black Tie Evening Tuxedo with Satin Lapels' : 'Haute Couture Mulberry Silk Gala Gown',
      editorialSource: 'Vogue Haute Couture Runway / Pinterest Bridal & Gala',
      modelHeight: isMale ? '6\'2" (188 cm)' : '5\'11" (180 cm)',
      modelWearing: isMale ? 'Size 42L / Savile Row Cut' : 'Size 36 / Sweetheart Bodice',
      lookAngle: 'Catwalk Stride & Liquid Drapery',
    };
  }

  if (occ.includes('festive') || occ.includes('ethnic') || occ.includes('traditional')) {
    return {
      imageUrl: isMale
        ? '/images/branding/hero-banner.jpg'
        : '/images/branding/womens-ethnic-fusion.jpg',
      title: isMale ? 'Bandhgala Raw Silk Kurta & Gold Accents' : 'Royal Banarasi Silk Saree & Zari Pallu',
      editorialSource: 'Pantaloons Atelier Archive / Grazia Luxury',
      modelHeight: isMale ? '6\'0" (183 cm)' : '5\'9" (175 cm)',
      modelWearing: isMale ? 'Size 40 Kurta / Slim Churidar' : 'Free Drape / Fitted Choli',
      lookAngle: 'Editorial Heritage Presence',
    };
  }

  // Smart Casual / Default
  return {
    imageUrl: isMale
      ? '/images/branding/mens-smart-casual.jpg'
      : '/images/branding/urban-western-casual.jpg',
    title: isMale ? 'Oxford Cotton Shirt & Tailored Chinos' : 'Urban Pastel Denim Trucker & Cargo',
    editorialSource: 'Atelier Street Lookbook / Pinterest Capsule',
    modelHeight: isMale ? '6\'0" (183 cm)' : '5\'9" (175 cm)',
    modelWearing: isMale ? 'Size 40 / Tailored Regular' : 'Size 38 / Relaxed Urban',
    lookAngle: 'Walking Stride & Natural Drape',
  };
}

function getFallbackOutfit(occasion: string, colorPreference: string, weather: string, gender: string = 'female'): OutfitRecommendationResponse {
  const isMale = gender === 'male';
  const occLower = occasion.toLowerCase();
  const isInterview = occLower.includes('interview');
  const isWedding = occLower.includes('wedding');

  return {
    title: isInterview
      ? (isMale ? "The Executive Interview Power Suit" : "The Boardroom Authority Silk Suiting")
      : isWedding
      ? (isMale ? "The Grand Wedding Bandhgala Tuxedo" : "The Regal Gala Silk Flute Gown")
      : (isMale ? `The Gentleman's ${occasion} Ensemble` : `The Chic ${occasion} Statement`),
    overview: `A masterfully tailored ${gender} ensemble curated for a ${occasion} in ${weather} weather, balancing structured elegance with an authentic ${colorPreference} palette.`,
    mood: isInterview ? "Corporate Authority & Poise" : isWedding ? "Festive Grandeur & Opulence" : `${occasion} Elegance`,
    gender,
    dressWearStyle: isInterview
      ? (isMale ? "Savile Row Executive Power Suiting" : "Modern Executive Suiting & Silk Camisole")
      : isWedding
      ? (isMale ? "Royal Silk Bandhgala Tuxedo" : "Mulberry Silk Sweetheart Gala Gown")
      : "Contemporary Bespoke Tailoring",
    dressModel: isInterview
      ? (isMale ? "Two-Piece Peak Lapel Jacket with Straight-Leg Trousers" : "Single-Breasted Sculpted Blazer with Fluid Trousers")
      : isWedding
      ? (isMale ? "Mandarin Collar Raw Silk Kurta with Gold Button Placket" : "Sculpted Sweetheart Bodice with Floor-Length Flute Skirt")
      : "Tailored Regular Fit Silhouette",
    items: {
      upperBody: isMale 
        ? (isInterview ? "Super 140s navy wool suit jacket over a crisp sea-island cotton shirt" : "Hand-embroidered raw silk bandhgala jacket with gold button placket")
        : (isInterview ? "Tailored navy wool-crepe blazer over a high-neck ivory silk georgette blouse" : "Mulberry silk sweetheart gala bodice with delicate princess seams"),
      lowerBody: isMale
        ? (isInterview ? "Flat-front wool trousers with a sharp pressed center crease and slight shoe break" : "Tailored raw silk churidar trousers in pearl ivory")
        : (isInterview ? "High-waist fluid wool-crepe trousers with a clean no-break ankle hem" : "Cascading silk accordion skirt with concealed side zip and fluid hemline"),
      footwear: isMale
        ? (isInterview ? "Hand-burnished dark cognac Oxford calf-leather dress shoes" : "Embroidered black velvet formal mojris with leather soles")
        : (isInterview ? "Pointed-toe 75mm Italian nappa leather pumps in deep navy" : "Champagne metallic stiletto ankle-strap heels with crystal buckle"),
      outerwear: "Structured tailored wool blazer with high armholes and peak lapels",
    },
    accessories: [
      {
        category: 'Shoe',
        name: isMale ? 'Hand-Burnished Oxford Dress Shoes' : 'Pointed-Toe Italian Leather Pumps',
        description: isInterview ? 'Grounds your professional presence with pristine polish.' : 'Adds statuesque poise and grace to your walk-in.',
      },
      {
        category: 'Watch',
        name: isMale ? '39mm Minimalist Chronograph on Alligator Strap' : 'Rose Gold Slim Mesh Dress Timepiece',
        description: 'Clean dial proportions signal punctuality and quiet luxury.',
      },
      {
        category: 'Ring',
        name: isMale ? 'Brushed Platinum Signet Ring' : 'Solitaire Diamond Pave Band',
        description: 'Understated elegance on the hand that catches subtle ambient light.',
      },
      {
        category: 'Chain',
        name: isMale ? '18k White Gold 20-inch Figaro Chain' : 'Delicate Freshwater Pearl Pendant Necklace',
        description: 'Accents the neckline and collar without overpowering the lapels.',
      },
      {
        category: 'Bracelet',
        name: isMale ? 'Titanium & Leather Braided Cuff' : '18k Gold Minimalist Bar Cuff',
        description: 'Balances the wrist opposite your timepiece for aesthetic symmetry.',
      },
      {
        category: 'Bag',
        name: isMale ? 'Full-Grain Saffiano Leather Document Folio' : 'Structured Top-Handle Executive Envelope Bag',
        description: 'Sleek architectural lines to hold all documents and essentials cleanly.',
      },
    ],
    accessoriesSuite: {
      shoe: {
        name: isMale ? 'Hand-Burnished Cap-Toe Oxfords' : 'Pointed-Toe 75mm Leather Pumps',
        style: isInterview ? 'Classic Executive Oxford' : 'Haute Couture Stiletto',
        finish: 'Burnished Antique Cognac / Midnight Noir',
        advice: 'Ensure pristine leather conditioning; soles should feel solid with non-slip grip.',
      },
      watch: {
        name: isMale ? 'Swiss Automatic Minimalist Dress Watch' : '28mm Rose Gold Mesh Timepiece',
        style: 'Dress Watch with Clean White Enamel Dial',
        finish: 'Rose Gold / Brushed Stainless Steel',
        advice: 'Ultra-thin 8mm profile to slip effortlessly under shirt cuffs.',
      },
      ring: {
        name: isMale ? 'Brushed Platinum Signet Ring' : '18k Gold Solitaire Band',
        style: 'Minimalist Signet / Pave Band',
        finish: 'Brushed Satin Platinum',
        advice: 'Wear on left pinky or ring finger for timeless sophistication.',
      },
      chain: {
        name: isMale ? '18k White Gold 20" Box Chain' : 'Freshwater Pearl Droplet Pendant',
        style: 'Princess Length Chain',
        finish: '18k Polished Gold',
        advice: 'Rests neatly beneath collar spread, creating a focal point at the throat.',
      },
      bracelet: {
        name: isMale ? 'Titanium Satin Finish Cuff' : '18k Yellow Gold Diamond Tennis Line',
        style: 'Minimalist Bangle / Tennis Line',
        finish: 'High Polished Gold',
        advice: 'Wear on right wrist to balance the watch on the left wrist.',
      },
      bag: {
        name: isMale ? 'Full-Grain Leather Executive Folio' : 'Structured Silk Envelope Clutch',
        style: 'Document Portfolio / Structured Clutch',
        finish: 'Saffiano Leather / Silk Brocade',
        advice: 'Hold securely under forearm or by top handle with relaxed shoulders.',
      },
    },
    fabricIntelligence: {
      fabricName: isInterview ? 'Super 140s Tasmanian Merino Wool' : 'Pure Mulberry Silk Charmeuse & Chanderi Brocade',
      texture: 'Fine twill weave with natural high wrinkle-recovery and subtle matte luster.',
      breathability: 'High',
      drapeAndWeight: '260 GSM Mid-weight breathable fabric with natural shoulder structure.',
      careInstructions: 'Steam press between wears; store on contoured cedar wooden hangers.',
    },
    sizeAndFitOpinion: {
      recommendedFit: 'regular',
      fitRationale: isInterview 
        ? 'A tailored regular cut projects competence and authority without feeling restrictive during long interviews.'
        : 'Flowing drape accommodates comfortable standing, walking, and dining throughout the wedding celebration.',
      tailoringGuide: 'Shoulder seam must end at the natural acromion bone; jacket waist suppression should allow exactly two flat fingers inside button.',
      shouldersAndCuffs: 'Jacket sleeve should expose exactly 0.5 inches (1.2 cm) of the shirt cuff.',
      trouserBreak: 'Slight trouser break resting gently on the shoe vamp with no messy ankle fabric pooling.',
    },
    realHumanModel: getRealModelReference(gender, occasion),
    colorPalette: [
      { name: 'Primary Suit Base', hex: '#1E293B' },
      { name: 'Draped Silk Accent', hex: '#FAF8F5' },
      { name: 'Hardware & Jewelry', hex: '#D4AF37' },
    ],
    stylingTips: [
      'Coordinate metal hardware: ensure watch bezel, belt buckle, and chain all share the same metallic warmth.',
      'Always leave the bottom button of a two-button or double-breasted suit jacket unbuttoned.',
      'Walk into the room with an upright posture, shoulders pulled back naturally, and head level to command instant respect.',
    ],
    weatherSuitability: `Layered strategically for breathable thermal regulation in ${weather} conditions.`,
    walkInAdvice: {
      entranceVibe: isInterview ? 'Authoritative & Approachable Entry' : 'Regal Celebration Grand Walk-In',
      postureAndGait: 'Take measured, unhurried strides. Make direct eye contact, offer a warm engaging smile, and stand tall.',
      holdingStyle: 'Keep the document folio or clutch in your left hand so your right hand remains free for greetings.',
      lightingPresence: 'Under conference room or ballroom lighting, the silk lapels and polished watch bezel catch crisp specular highlights.',
    },
    interviewAdvice: isInterview
      ? 'For interviews: this structured look conveys diligence, meticulous attention to detail, and cultural fit. The navy and ivory palette communicates trustworthiness and sharp intellectual acumen.'
      : undefined,
    weddingAdvice: isWedding
      ? 'For weddings: this outfit honors the celebratory occasion with luxurious fabrics and gold jewelry accents while ensuring comfortable movement for hours of socializing and photography.'
      : undefined,
  };
}
