import { NextResponse } from 'next/server';

export interface AiOpinionResponse {
  rating: {
    overallScore: number; // 0-100
    verdict: string;
    metrics: {
      colorHarmony: number;
      eventFit: number;
      walkInImpact: number;
      trendFactor: number;
    };
  };
  aiCritique: {
    strengths: string[];
    suggestions: string[];
    overallOpinion: string;
  };
  adjustedOutfit?: {
    title: string;
    overview: string;
    mood: string;
    topType?: string;
    topColor?: string;
    bottomType?: string;
    bottomColor?: string;
    outerwearColor?: string;
    accentColor?: string;
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
    colorPalette: Array<{ name: string; hex: string }>;
    stylingTips: string[];
    walkInAdvice: {
      entranceVibe: string;
      postureAndGait: string;
      holdingStyle: string;
      lightingPresence: string;
    };
  };
  source?: string;
  modelUsed?: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      userOpinion = '', 
      userAdjustment = '',
      currentOutfit = null, 
      gender = 'female',
      occasion = 'Event',
      weather = 'Mild'
    } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        ...getFallbackAiOpinion(userOpinion, userAdjustment, gender, occasion, weather),
        source: 'fallback',
        modelUsed: 'Fallback Engine (No API Key)'
      });
    }

    const systemPrompt = `You are an elite AI Fashion Designer, Personal Stylist, and E-commerce Advisor acting as a legendary fashion critic and design judge.
Evaluate the user's fashion opinion / outfit choice or adjustment request for a ${gender.toUpperCase()} attending a ${occasion} event in ${weather} weather.

Core Styling Guidelines to Enforce:
1. Holistic Analysis: Base your rating on occasion fit, body proportion balance, skin tone harmony, and weather suitability.
2. Complete Looks: Evaluate top, bottom, outerwear, footwear, and accessory pairings using Base, Layer, Accent rules.
3. Accessory & Hardware Unity: Ensure watches, chains, bag metal accents, and belts match hardware finishes.
4. Fabric & Fit Precision: Specify exact fabric weaves, drape, and tailored fit details in the refined output.
5. Color Science: Provide cohesive 3-color palette harmony with web-safe HEX codes.

User Opinion / Choice: "${userOpinion || 'None provided'}"
User Adjustment Request: "${userAdjustment || 'None provided'}"
Current Outfit Baseline: ${JSON.stringify(currentOutfit || {})}

Analyze the user's choice and opinion thoroughly. Rate their taste (0-100), evaluate color balance, event suitability, and walk-in presence. Provide constructive design critique and a refined, updated outfit recommendation.

Respond with EXACT raw JSON matching this structure:
{
  "rating": {
    "overallScore": 92,
    "verdict": "Sublime Taste & Sophisticated Flair",
    "metrics": {
      "colorHarmony": 94,
      "eventFit": 90,
      "walkInImpact": 95,
      "trendFactor": 88
    }
  },
  "aiCritique": {
    "strengths": [
      "Spot-on color contrast balancing primary tones",
      "Sophisticated selection of footwear for the occasion"
    ],
    "suggestions": [
      "Consider elevating metal accents to match watch casing finish",
      "Add a structured outerwear piece for dramatic walk-in entrance"
    ],
    "overallOpinion": "Detailed 2-3 sentence expert review evaluating the user's design choice and aesthetic intuition."
  },
  "adjustedOutfit": {
    "title": "Refined Outfit Title",
    "overview": "Overview reflecting user adjustments and AI refinement",
    "mood": "2-3 word aesthetic summary (e.g. Midnight City Minimalist)",
    "topType": "shirt | tshirt | kurti | kurta | saree | salwar | top | croptop | gown | skirt | shrug | jacket | blazer",
    "topColor": "#HEXCODE",
    "bottomType": "jeans | trousers | salwar_bottom | skirt | chinos | tracks | gown_skirt",
    "bottomColor": "#HEXCODE",
    "outerwearColor": "#HEXCODE",
    "accentColor": "#HEXCODE",
    "items": {
      "upperBody": "Upper body item description including fabric and fit",
      "lowerBody": "Lower body item description including fabric and fit",
      "footwear": "Footwear item description including heel/sole finish",
      "outerwear": "Outerwear description including fabric drape and structure"
    },
    "accessories": [
      {
        "category": "Watch | Chain | Bag | Eyewear | Jewelry | Belt",
        "name": "Accessory name and metal finish",
        "description": "Why it elevates this look"
      }
    ],
    "colorPalette": [
      { "name": "Primary Color", "hex": "#HEXCODE" },
      { "name": "Secondary Color", "hex": "#HEXCODE" },
      { "name": "Accent Tone", "hex": "#HEXCODE" }
    ],
    "stylingTips": [
      "Styling tip 1",
      "Styling tip 2"
    ],
    "walkInAdvice": {
      "entranceVibe": "Entrance vibe title",
      "postureAndGait": "Walk-in gait and stride advice",
      "holdingStyle": "Bag and jacket holding style during walk-in",
      "lightingPresence": "Lighting reflection advice"
    }
  }
}

IMPORTANT: Output raw JSON only. Do not use markdown codeblock wrappers (\`\`\`json).`;

    const modelsToTry = [
      'gemini-3.6-flash',
      'gemini-2.5-flash',
      'gemini-flash-latest',
      'gemini-2.5-pro'
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
              maxOutputTokens: 1536,
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
        ...getFallbackAiOpinion(userOpinion, userAdjustment, gender, occasion, weather),
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
      const parsed: AiOpinionResponse = JSON.parse(cleanedText);
      return NextResponse.json({
        ...parsed,
        source: 'gemini-api',
        modelUsed: selectedModel
      });
    } catch (parseError) {
      console.error('Failed to parse Gemini AI opinion JSON:', parseError, rawText);
      return NextResponse.json({
        ...getFallbackAiOpinion(userOpinion, userAdjustment, gender, occasion, weather),
        source: 'fallback',
        modelUsed: 'Fallback Engine'
      });
    }
  } catch (error: unknown) {
    console.error('Error in ai-opinion route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error processing AI opinion' },
      { status: 500 }
    );
  }
}

function getFallbackAiOpinion(
  userOpinion: string,
  userAdjustment: string,
  gender: string,
  occasion: string,
  weather: string
): AiOpinionResponse {
  const isMale = gender === 'male';

  return {
    rating: {
      overallScore: 89,
      verdict: 'Impeccable Fashion Instincts',
      metrics: {
        colorHarmony: 91,
        eventFit: 88,
        walkInImpact: 92,
        trendFactor: 85,
      },
    },
    aiCritique: {
      strengths: [
        'Great understanding of high-contrast color palette balance',
        'Strong alignment with venue formality and weather context',
      ],
      suggestions: [
        'Pair with polished metallic accessories for extra shine under venue lighting',
        'Maintain relaxed posture during entry to let outfit drape cleanly',
      ],
      overallOpinion: userOpinion 
        ? `Your opinion ("${userOpinion}") demonstrates solid aesthetic intuition. The combination of tailored silhouettes with complementary accessories creates a cohesive look.`
        : `Your adjustment request ("${userAdjustment}") enhances the ensemble's overall versatility for a ${occasion} in ${weather}.`,
    },
    adjustedOutfit: {
      title: isMale ? "Refined Gentleman's Tailored Look" : "Elevated Couture Statement",
      overview: `Custom adjusted for ${gender} attire, balancing user preferences with high-fashion rules for ${occasion}.`,
      mood: 'Sophisticated & Polished',
      topType: isMale ? 'blazer' : 'kurti',
      topColor: isMale ? '#1E293B' : '#059669',
      bottomType: isMale ? 'chinos' : 'salwar_bottom',
      bottomColor: isMale ? '#475569' : '#F8FAFC',
      outerwearColor: '#0F172A',
      accentColor: '#F59E0B',
      items: {
        upperBody: isMale ? 'Double-breasted navy blazer with slim Oxford shirt' : 'Hand-embroidered silk kurti with gold threadwork',
        lowerBody: isMale ? 'Slim tailored trousers in stone beige' : 'Off-white draped salwar bottom with gold trim',
        footwear: isMale ? 'Hand-burnished leather loafers' : 'Pointed metallic heels',
        outerwear: 'Structured overcoat draped over shoulders',
      },
      accessories: [
        {
          category: 'Watch',
          name: isMale ? 'Chronograph Leather Watch' : 'Rose Gold Mesh Strap Watch',
          description: 'Timeless elegance on the wrist.',
        },
        {
          category: 'Chain',
          name: isMale ? 'Silver Curb Chain' : 'Gold Layered Pendant',
          description: 'Adds metallic shine near the collar.',
        },
        {
          category: 'Bag',
          name: isMale ? 'Leather Sling Briefcase' : 'Embossed Leather Clutch',
          description: 'Sleek utility for carrying essentials.',
        },
      ],
      colorPalette: [
        { name: 'Primary Accent', hex: isMale ? '#1E293B' : '#059669' },
        { name: 'Secondary Tone', hex: '#475569' },
        { name: 'Gold Accent', hex: '#F59E0B' },
      ],
      stylingTips: [
        'Keep accessory metal tones matched (watch case, belt buckle, necklace).',
        'Roll sleeves slightly or unbutton top button for a relaxed walk-in vibe.',
      ],
      walkInAdvice: {
        entranceVibe: isMale ? 'Executive Walk-In Presence' : 'Stunning Entrance Walk-In',
        postureAndGait: 'Walk with an unhurried, steady gait with shoulders back to emphasize tailored shoulders.',
        holdingStyle: 'Hold bag casually in left hand, keeping right arm free for greetings.',
        lightingPresence: 'Fabric textures absorb venue lights softly while metallic details spark under spotlights.',
      },
    },
  };
}
