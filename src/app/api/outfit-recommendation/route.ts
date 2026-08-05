import { NextResponse } from 'next/server';

export interface OutfitRecommendationResponse {
  title: string;
  overview: string;
  mood: string;
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
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { occasion = 'Casual Outing', colorPreference = 'Neutral & Earthy', weather = 'Mild 20°C' } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured in environment variables' },
        { status: 500 }
      );
    }

    const systemPrompt = `You are a world-class high-fashion AI personal stylist.
A user needs an outfit recommendation based on the following inputs:
- Occasion: ${occasion}
- Color Preference: ${colorPreference}
- Weather Condition: ${weather}

Provide a complete, cohesive, highly stylish outfit recommendation in JSON format matching this EXACT structure:
{
  "title": "A catchy, stylish outfit name",
  "overview": "A brief 2-3 sentence overview explaining why this outfit is ideal for the occasion and weather",
  "mood": "A 2-3 word aesthetic summary (e.g., Chic & Effortless, Smart Casual Monochrome)",
  "items": {
    "upperBody": "Detailed description of top/shirt/blouse/sweater",
    "lowerBody": "Detailed description of pants/trousers/skirt/shorts",
    "footwear": "Detailed description of shoes/sneakers/boots/heels",
    "outerwear": "Optional coat/jacket/cardigan if suitable for weather, else empty string or null"
  },
  "accessories": [
    {
      "category": "Watch | Chain | Bag | Eyewear | Jewelry | Hat",
      "name": "Accessory name",
      "description": "Why it compliments the look"
    }
  ],
  "colorPalette": [
    {
      "name": "Color Name",
      "hex": "#HEXCODE"
    }
  ],
  "stylingTips": [
    "Tip 1 regarding fit, tucking, rolling sleeves, or layering",
    "Tip 2 regarding color balance or grooming/scent",
    "Tip 3 regarding versatility"
  ],
  "weatherSuitability": "Specific note on how this outfit stays comfortable in the given weather"
}

IMPORTANT: Respond ONLY with valid JSON. Do not include markdown codeblock wrappers like \`\`\`json or extra explanatory text outside the JSON object.`;

    const modelsToTry = [
      'gemini-2.5-flash',
      'gemini-1.5-flash',
      'gemini-2.0-flash',
      'gemini-pro'
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
              maxOutputTokens: 1024,
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
      // Fallback response if Gemini API key fails or network issue occurs
      console.error('All Gemini API models failed or API key was invalid. Returning fallback recommendation.');
      return NextResponse.json(getFallbackOutfit(occasion, colorPreference, weather));
    }

    const data = await geminiResponse.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Clean JSON response (strip markdown fences if present)
    const cleanedText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();

    try {
      const parsedRecommendation: OutfitRecommendationResponse = JSON.parse(cleanedText);
      return NextResponse.json(parsedRecommendation);
    } catch (parseError) {
      console.error('Failed to parse Gemini JSON output:', rawText);
      return NextResponse.json(getFallbackOutfit(occasion, colorPreference, weather));
    }
  } catch (error: any) {
    console.error('Error in outfit-recommendation route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error processing outfit recommendation' },
      { status: 500 }
    );
  }
}

function getFallbackOutfit(occasion: string, colorPreference: string, weather: string): OutfitRecommendationResponse {
  return {
    title: `The Essential ${occasion} Ensemble`,
    overview: `A refined outfit tailored for a ${occasion} in ${weather} weather, featuring a harmonious ${colorPreference} palette.`,
    mood: `${occasion} Chic`,
    items: {
      upperBody: `Tailored Oxford shirt or elevated fine-knit top in ${colorPreference.includes('Black') ? 'Charcoal' : 'Off-White'}`,
      lowerBody: 'Slim-tapered tailored trousers or dark selvedge denim',
      footwear: 'Minimalist leather sneakers or classic loafers',
      outerwear: weather.toLowerCase().includes('cold') || weather.toLowerCase().includes('rain') 
        ? 'Structured trench coat or wool-blend overcoat' 
        : 'Lightweight linen blazer',
    },
    accessories: [
      {
        category: 'Watch',
        name: 'Stainless Steel Dress Watch',
        description: 'Adds timeless sophistication and ties the look together.'
      },
      {
        category: 'Bag',
        name: 'Leather Crossbody Sling',
        description: 'Sleek utility for holding essentials effortless.'
      },
      {
        category: 'Eyewear',
        name: 'Classic Acetate Frames',
        description: 'Framing your face with polished elegance.'
      }
    ],
    colorPalette: [
      { name: 'Primary Accent', hex: '#1E293B' },
      { name: 'Secondary Tone', hex: '#64748B' },
      { name: 'Base Neutral', hex: '#F8FAFC' }
    ],
    stylingTips: [
      'Ensure proper fit at the shoulders and ankle cuff for a custom look.',
      'Cuff sleeve cuffs once for a relaxed, confident flair.',
      'Keep accessories in matching metallic hardware finishes.'
    ],
    weatherSuitability: `Layered strategically to adapt smoothly to ${weather} conditions throughout the day.`
  };
}
