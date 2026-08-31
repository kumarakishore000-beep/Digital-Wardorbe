import { NextResponse } from 'next/server';

export interface ClothSuggestionResponse {
  title: string;
  suggestedClothKey: string; // e.g. 'gown', 'kurti', 'saree', 'skirt', 'kurta', 'shirt', 'jacket', 'tshirt', 'blazer', 'salwar'
  suggestedGarmentName: string;
  fabricTexture: string;
  recommendedTopColor: string;
  recommendedBottomColor: string;
  recommendedAccentColor: string;
  aiStylistRationale: string;
  matchingAccessories: Array<{
    category: string;
    name: string;
    description: string;
  }>;
  wearingTip: string;
  fitRecommendation: 'slim' | 'regular' | 'oversized';
  source?: string;
  modelUsed?: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      gender = 'female',
      occasion = 'Casual Outing',
      weather = 'Mild 20°C',
      colorPreference = 'Warm Earth Tones',
      skinTone = 'brown',
    } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        ...getFallbackClothSuggestion(gender, occasion, weather, colorPreference, skinTone),
        source: 'fallback',
        modelUsed: 'Fallback Engine (Missing API Key)',
      });
    }

    const systemPrompt = `You are an elite high-fashion AI Stylist and Virtual Fitting Room Advisor for a Digital Wardrobe Mannequin.
Suggest the single best real clothing piece option to wear on the mannequin for:
- Gender: ${gender}
- Occasion: ${occasion}
- Weather: ${weather}
- Color Palette Preference: ${colorPreference}
- Mannequin Skin Tone: ${skinTone}

Choose one 'suggestedClothKey' strictly from these options:
For female: ['gown', 'skirt', 'kurti', 'saree', 'salwar', 'croptop', 'shrug', 'blazer']
For male: ['kurta', 'tshirt', 'shirt', 'jacket']

Return a valid JSON matching this EXACT structure:
{
  "title": "Short catchy styling name (e.g. Royal Emerald Silk Ensemble)",
  "suggestedClothKey": "one of the keys listed above",
  "suggestedGarmentName": "Full real clothing item name (e.g. Hand-Embroidered Chanderi Silk Kurti)",
  "fabricTexture": "Specific fabric texture notes (e.g. Pure Mulberry Silk with Gold Zari Border)",
  "recommendedTopColor": "#HEXCODE of garment top/primary color",
  "recommendedBottomColor": "#HEXCODE of bottom piece",
  "recommendedAccentColor": "#HEXCODE of accent jewelry/accessories",
  "aiStylistRationale": "2-3 sentences explaining why this real cloth image and color pairing creates a stunning realistic wearing experience on the ${skinTone} mannequin for a ${occasion}.",
  "matchingAccessories": [
    {
      "category": "Watch | Jewelry | Bag",
      "name": "Accessory Name",
      "description": "Why it pairs with this real garment"
    },
    {
      "category": "Footwear | Chain",
      "name": "Accessory Name",
      "description": "How it completes the look"
    }
  ],
  "wearingTip": "Actionable tip on drape, tucking, or shoulder alignment when wearing this garment",
  "fitRecommendation": "regular"
}

Respond ONLY with valid JSON. Do not include markdown code block formatting.`;

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
                parts: [{ text: systemPrompt }],
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
        }
      } catch (err) {
        console.warn(`Error connecting to Gemini model ${model}:`, err);
      }
    }

    if (!geminiResponse || !geminiResponse.ok) {
      return NextResponse.json({
        ...getFallbackClothSuggestion(gender, occasion, weather, colorPreference, skinTone),
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
      const parsed: ClothSuggestionResponse = JSON.parse(cleanedText);
      return NextResponse.json({
        ...parsed,
        source: 'gemini-api',
        modelUsed: selectedModel,
      });
    } catch (parseErr) {
      console.error('Failed to parse Gemini cloth suggestion JSON:', parseErr, rawText);
      return NextResponse.json({
        ...getFallbackClothSuggestion(gender, occasion, weather, colorPreference, skinTone),
        source: 'fallback',
        modelUsed: 'Fallback Engine',
      });
    }
  } catch (error) {
    console.error('Cloth suggestion route error:', error);
    return NextResponse.json(
      { error: 'Internal server error processing cloth suggestion' },
      { status: 500 }
    );
  }
}

function getFallbackClothSuggestion(
  gender: string,
  occasion: string,
  weather: string,
  colorPreference: string,
  skinTone: string
): ClothSuggestionResponse {
  const isMale = gender === 'male';
  return {
    title: isMale ? "Gentleman's Tailored Linen Look" : "Royal Embroidered Ethnic Silk",
    suggestedClothKey: isMale ? 'shirt' : 'kurti',
    suggestedGarmentName: isMale ? 'Italian Linen Tailored Shirt' : 'Hand-Embroidered Chanderi Silk Kurti',
    fabricTexture: isMale ? 'Breathable Pure Linen Weave' : 'Chanderi Silk with Zardozi Gold Work',
    recommendedTopColor: isMale ? '#FFFFFF' : '#059669',
    recommendedBottomColor: isMale ? '#2E7D32' : '#F8FAFC',
    recommendedAccentColor: '#F59E0B',
    aiStylistRationale: `Selected for a ${occasion} in ${weather} conditions. The rich fabric texture drapes naturally across the ${skinTone} mannequin frame, providing an authentic luxury look.`,
    matchingAccessories: [
      {
        category: 'Watch',
        name: isMale ? 'Chronograph Rose Gold Watch' : 'Gold Mesh Dress Watch',
        description: 'Syncs with the metal hardware and enhances wrist elegance.',
      },
      {
        category: 'Footwear',
        name: isMale ? 'Burnished Italian Oxfords' : 'Embellished Mojri Heels',
        description: 'Anchors the garment color palette cleanly.',
      },
    ],
    wearingTip: 'Tuck in slightly at the waistline to emphasize structured mannequin proportions.',
    fitRecommendation: 'regular',
  };
}
