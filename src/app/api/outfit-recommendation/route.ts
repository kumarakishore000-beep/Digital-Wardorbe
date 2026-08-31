import { NextResponse } from 'next/server';

export interface WalkInAdvice {
  entranceVibe: string;
  postureAndGait: string;
  holdingStyle: string;
  lightingPresence: string;
}

export interface OutfitRecommendationResponse {
  title: string;
  overview: string;
  mood: string;
  gender?: string;
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
  colorPalette: Array<{
    name: string;
    hex: string;
  }>;
  stylingTips: string[];
  weatherSuitability: string;
  walkInAdvice: WalkInAdvice;
  source?: string;
  modelUsed?: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      occasion = 'Casual Outing', 
      colorPreference = 'Neutral & Earthy', 
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

    const systemPrompt = `You are an elite AI Fashion Designer, Personal Stylist, and E-commerce Advisor specializing in both Men's and Women's fashion intelligence.
Your styling methodology is rooted in:
1. Holistic Analysis (occasion, body proportions, skin tone compatibility, weather).
2. Base, Layer, Accent methodology for complete head-to-toe ensemble construction.
3. Accessory Mastery (coordinating watches, chains, bags, eyewear, jewelry/belts with matching hardware finishes).
4. Precise Fabric & Fit specifications (specify exact texture, drape, weave, and fit like 'structured wool blend', 'flowy mulberry silk', 'tailored tapered fit').
5. Color Science (cohesive 3-tone color harmony with web-safe HEX codes).

Target Parameters:
- Target Gender: ${gender}
- Occasion: ${occasion}
- Color Preference: ${colorPreference}
- Weather Condition: ${weather}

Provide a complete, cohesive, head-to-toe ensemble in JSON format matching this EXACT structure:
{
  "title": "A catchy, stylish outfit name tailored for ${gender}",
  "overview": "A 2-3 sentence overview explaining why this outfit is ideal for a ${gender} for this occasion and weather",
  "mood": "A 2-3 word aesthetic summary (e.g. Midnight City Minimalist, Royal Emerald Elegance)",
  "gender": "${gender}",
  "items": {
    "upperBody": "Specific description of top including exact fabric texture, drape, and fit (e.g. Hand-embroidered silk tunic in tailored slim fit)",
    "lowerBody": "Specific description of bottom including fabric and fit (e.g. Draped silk palazzo trousers in high-waisted fluid fit)",
    "footwear": "Specific description of footwear including heel/sole material and finish",
    "outerwear": "Specific jacket, coat, or cardigan with fabric and structured fit details"
  },
  "accessories": [
    {
      "category": "Watch",
      "name": "Specific watch style name and metal finish",
      "description": "Why it elevates this look"
    },
    {
      "category": "Chain | Necklace",
      "name": "Specific chain, pendant, or choker style and length",
      "description": "How it accents the neckline and chest"
    },
    {
      "category": "Bag | Clutch",
      "name": "Specific bag style, material, and hardware finish",
      "description": "Why it balances the silhouette"
    },
    {
      "category": "Eyewear",
      "name": "Specific sunglasses or optical frames",
      "description": "Facial framing and lens finish notes"
    },
    {
      "category": "Jewelry | Cufflinks | Belt",
      "name": "Specific earrings, ring, cufflinks, or leather belt",
      "description": "Finishing touch detail"
    }
  ],
  "colorPalette": [
    {
      "name": "Primary Color",
      "hex": "#HEXCODE"
    },
    {
      "name": "Secondary Color",
      "hex": "#HEXCODE"
    },
    {
      "name": "Accent Tone",
      "hex": "#HEXCODE"
    }
  ],
  "stylingTips": [
    "Tip 1 regarding fit, tucking, rolling sleeves, or drape",
    "Tip 2 regarding color balance or metal hardware finish unity",
    "Tip 3 regarding versatility and walk-in entrance confidence"
  ],
  "weatherSuitability": "Specific note on how this outfit keeps you comfortable in ${weather}",
  "walkInAdvice": {
    "entranceVibe": "Catchy walk-in vibe title (e.g. Red-Carpet Grand Entrance, Executive Walk-In Presence)",
    "postureAndGait": "Actionable gait, stride length, and posture instructions during entry walk-in",
    "holdingStyle": "How to hold the bag, jacket, or accessories while walking into the venue",
    "lightingPresence": "How the fabric textures and accessories catch venue spotlights and ambient light"
  }
}

IMPORTANT: Respond ONLY with valid raw JSON. Do not include markdown codeblock wrappers (\`\`\`json).`;

    const modelsToTry = [
      'gemini-2.0-flash',
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-2.5-flash',
      'gemini-3.6-flash',
      'gemini-flash-latest',
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
                parts: [
                  {
                    text: systemPrompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1536,
            },
          }),
        });

        if (res.ok) {
          geminiResponse = res;
          selectedModel = model;
          break;
        } else {
          console.warn(`Model ${model} returned status ${res.status}. Trying next model...`);
        }
      } catch (err) {
        console.warn(`Error trying model ${model}:`, err);
      }
    }

    if (!geminiResponse || !geminiResponse.ok) {
      console.error('All Gemini API models failed or API key was invalid. Returning fallback recommendation.');
      return NextResponse.json({
        ...getFallbackOutfit(occasion, colorPreference, weather, gender),
        source: 'fallback',
        modelUsed: 'Fallback Engine'
      });
    }

    const data = await geminiResponse.json();
    const parts = data?.candidates?.[0]?.content?.parts || [];
    const rawText = parts.map((p: { text?: string }) => p.text || '').filter(Boolean).join('\n');
    
    // Clean and extract valid JSON object from response
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    const cleanedText = jsonMatch ? jsonMatch[0] : rawText.replace(/```json/gi, '').replace(/```/g, '').trim();

    try {
      const parsedRecommendation: OutfitRecommendationResponse = JSON.parse(cleanedText);
      return NextResponse.json({
        ...parsedRecommendation,
        source: 'gemini-api',
        modelUsed: selectedModel
      });
    } catch (parseError) {
      console.error('Failed to parse Gemini JSON output:', parseError, rawText);
      return NextResponse.json({
        ...getFallbackOutfit(occasion, colorPreference, weather, gender),
        source: 'fallback',
        modelUsed: 'Fallback Engine'
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

function getFallbackOutfit(occasion: string, colorPreference: string, weather: string, gender: string = 'female'): OutfitRecommendationResponse {
  const isMale = gender === 'male';

  return {
    title: isMale ? `The Gentleman's ${occasion} Ensemble` : `The Chic ${occasion} Statement`,
    overview: `A refined ${gender} ensemble curated for a ${occasion} in ${weather} weather, crafted around a harmonious ${colorPreference} palette.`,
    mood: `${occasion} ${isMale ? 'Distinguished' : 'Elegance'}`,
    gender,
    items: {
      upperBody: isMale 
        ? `Structured Oxford shirt or fine linen blazer in ${colorPreference.includes('Black') ? 'Charcoal' : 'Crisp White'}`
        : `Silk button blouse or hand-embroidered emerald kurti in ${colorPreference.includes('Black') ? 'Midnight Black' : 'Emerald Green'}`,
      lowerBody: isMale
        ? 'Slim-tapered tailored chinos or dark selvedge denim'
        : 'Tailored high-waist trousers or silk salwar bottom',
      footwear: isMale
        ? 'Burnished leather Oxford shoes or clean minimalist sneakers'
        : 'Pointed-toe stiletto pumps or embellised mojris',
      outerwear: weather.toLowerCase().includes('cold') || weather.toLowerCase().includes('rain') 
        ? 'Tailored double-breasted trench coat' 
        : isMale ? 'Unstructured cotton cardigan' : 'Flowing sheer silk shrug',
    },
    accessories: [
      {
        category: 'Watch',
        name: isMale ? 'Chronograph Leather Strap Watch' : 'Rose Gold Slim Mesh Watch',
        description: 'Adds quiet luxury and architectural precision to the wrist.'
      },
      {
        category: 'Chain / Necklace',
        name: isMale ? 'Minimalist Silver Box Chain' : 'Layered Gold Pendant Necklace',
        description: 'Framing the collarbone area with polished brilliance.'
      },
      {
        category: 'Bag',
        name: isMale ? 'Full-Grain Leather Sling Briefcase' : 'Structured Envelope Leather Clutch',
        description: 'Streamlined functionality for carrying daily essentials in style.'
      },
      {
        category: 'Eyewear',
        name: 'Square Acetate Polarized Frames',
        description: 'Frames your features with modern elegance.'
      },
      {
        category: 'Jewelry / Accent',
        name: isMale ? 'Brushed Stainless Steel Cufflinks' : 'Emerald Drop Halo Earrings',
        description: 'Elevates visual interest with curated sparkle.'
      }
    ],
    colorPalette: [
      { name: 'Primary Accent', hex: isMale ? '#1E293B' : '#059669' },
      { name: 'Secondary Tone', hex: '#64748B' },
      { name: 'Base Neutral', hex: '#F8FAFC' }
    ],
    stylingTips: [
      'Ensure precise shoulder seam alignment and tailored trouser break at the shoe top.',
      'Maintain hardware finish unity: sync watch casing, chain metal, and belt buckle.',
      'Walk with upright shoulders to let outerwear drape naturally during your walk-in.'
    ],
    weatherSuitability: `Layered strategically to maintain breathable comfort during ${weather} conditions.`,
    walkInAdvice: {
      entranceVibe: isMale ? 'Commanding Executive Entry' : 'Red-Carpet Grand Entrance',
      postureAndGait: 'Walk with an unhurried, measured stride, relaxed arms, and head held high to project effortless confidence.',
      holdingStyle: isMale 
        ? 'Carry the sling bag naturally at your side; keep one hand casually near your jacket lapel.'
        : 'Hold the clutch securely at mid-torso with fingertips for a graceful silhouette.',
      lightingPresence: 'Under entry spotlights, the metallic accessory accents catch soft reflections against rich fabric tones.'
    }
  };
}

