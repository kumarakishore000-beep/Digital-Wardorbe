import { NextResponse } from 'next/server';

interface AccessoryRecommendation {
  category: string;
  styleName: string;
  reasoning: string;
  searchQuery: string;
  inCloset: boolean;
}

// Context-aware accessory database
const ACCESSORY_DB: Record<string, Record<string, AccessoryRecommendation[]>> = {
  Indoor: {
    Casual: [
      { category: 'Watch', styleName: 'Minimalist Canvas Strap Watch', reasoning: 'A clean, lightweight watch for everyday indoor settings — pairs well with casual layers.', searchQuery: 'minimalist canvas watch casual', inCloset: false },
      { category: 'Chain', styleName: 'Thin Gold Layered Chains', reasoning: 'Subtle layered chains add depth to a casual indoor look without being overdone.', searchQuery: 'thin gold layered chain necklace', inCloset: false },
      { category: 'Bracelet', styleName: 'Beaded Stretch Bracelet', reasoning: 'Relaxed beaded bracelets complement casual vibes perfectly for indoor hangouts.', searchQuery: 'beaded stretch bracelet casual', inCloset: true },
      { category: 'Shoes', styleName: 'Clean White Sneakers', reasoning: 'Classic white sneakers keep it casual and polished for indoor environments.', searchQuery: 'white minimalist sneakers', inCloset: true },
      { category: 'Jewelry', styleName: 'Simple Stud Earrings', reasoning: 'Small studs add a subtle sparkle without competing with casual wear.', searchQuery: 'simple gold stud earrings', inCloset: true },
      { category: 'Bag', styleName: 'Canvas Tote Bag', reasoning: 'Practical and stylish for carrying everyday essentials.', searchQuery: 'canvas tote bag casual', inCloset: false },
    ],
    Cocktail: [
      { category: 'Watch', styleName: 'Rose Gold Dress Watch', reasoning: 'A rose gold watch adds warmth and sophistication perfect for cocktail events.', searchQuery: 'rose gold dress watch women', inCloset: false },
      { category: 'Chain', styleName: 'Silver Statement Pendant', reasoning: 'A bold pendant draws attention and serves as a conversation piece at cocktail events.', searchQuery: 'silver statement pendant necklace', inCloset: false },
      { category: 'Bracelet', styleName: 'Crystal Tennis Bracelet', reasoning: 'Sparkling crystals catch the light beautifully in indoor cocktail settings.', searchQuery: 'crystal tennis bracelet elegant', inCloset: false },
      { category: 'Shoes', styleName: 'Strappy Metallic Heels', reasoning: 'Metallic heels add glamour suitable for cocktail events while keeping focus on the outfit.', searchQuery: 'silver strappy stiletto heels', inCloset: false },
      { category: 'Jewelry', styleName: 'Silver Pendant Necklace', reasoning: 'A pendant perfectly complements V-necklines by mirroring their shape.', searchQuery: 'silver pendant necklace minimalist', inCloset: true },
      { category: 'Bag', styleName: 'Structured Metallic Clutch', reasoning: 'A small clutch balances the silhouette and matches metallic hardware.', searchQuery: 'silver structured evening clutch', inCloset: false },
    ],
    Formal: [
      { category: 'Watch', styleName: 'Classic Leather Strap Watch', reasoning: 'A timeless leather watch signals refinement for formal indoor events.', searchQuery: 'classic leather strap dress watch', inCloset: false },
      { category: 'Chain', styleName: 'Pearl Strand Necklace', reasoning: 'Pearls are the gold standard for formal elegance — understated yet powerful.', searchQuery: 'pearl strand necklace formal', inCloset: false },
      { category: 'Bracelet', styleName: 'Gold Cuff Bracelet', reasoning: 'A structured cuff adds architectural elegance to formal attire.', searchQuery: 'gold cuff bracelet formal', inCloset: false },
      { category: 'Shoes', styleName: 'Classic Pointed Pumps', reasoning: 'Pointed-toe pumps elongate the silhouette for maximum formal impact.', searchQuery: 'black pointed toe pumps formal', inCloset: true },
      { category: 'Jewelry', styleName: 'Diamond Drop Earrings', reasoning: 'Drop earrings frame the face beautifully and catch light in formal venues.', searchQuery: 'diamond drop earrings formal', inCloset: false },
      { category: 'Bag', styleName: 'Silk Envelope Clutch', reasoning: 'An envelope clutch in silk adds texture variety to a formal ensemble.', searchQuery: 'silk envelope clutch formal', inCloset: false },
    ],
  },
  Outdoor: {
    Casual: [
      { category: 'Watch', styleName: 'Sports Digital Watch', reasoning: 'A rugged digital watch handles outdoor activities while adding sporty style.', searchQuery: 'sports digital watch outdoor', inCloset: true },
      { category: 'Chain', styleName: 'Leather Cord Pendant', reasoning: 'Natural materials complement outdoor casual settings beautifully.', searchQuery: 'leather cord pendant necklace', inCloset: false },
      { category: 'Bracelet', styleName: 'Woven Friendship Bracelet', reasoning: 'Colorful woven bracelets add personality to outdoor casual looks.', searchQuery: 'woven friendship bracelet colorful', inCloset: true },
      { category: 'Shoes', styleName: 'Trail Running Sneakers', reasoning: 'Comfortable and functional shoes for outdoor adventure with street style.', searchQuery: 'trail running sneakers outdoor', inCloset: false },
      { category: 'Jewelry', styleName: 'Wooden Bead Earrings', reasoning: 'Earthy materials connect with outdoor settings and complement casual styles.', searchQuery: 'wooden bead drop earrings', inCloset: false },
      { category: 'Bag', styleName: 'Crossbody Sling Bag', reasoning: 'Hands-free convenience for outdoor exploration with modern style.', searchQuery: 'crossbody sling bag outdoor', inCloset: false },
    ],
    Cocktail: [
      { category: 'Watch', styleName: 'Sleek Chronograph', reasoning: 'A chronograph balances sporty and sophisticated for outdoor cocktail events.', searchQuery: 'sleek chronograph watch', inCloset: false },
      { category: 'Chain', styleName: 'Gold Choker Chain', reasoning: 'A choker makes a statement that works well in outdoor garden party settings.', searchQuery: 'gold choker chain necklace', inCloset: false },
      { category: 'Bracelet', styleName: 'Charm Bracelet', reasoning: 'A personalized charm bracelet adds character and conversation value.', searchQuery: 'gold charm bracelet elegant', inCloset: true },
      { category: 'Shoes', styleName: 'Block Heel Sandals', reasoning: 'Block heels provide stability on outdoor surfaces while maintaining elegance.', searchQuery: 'block heel sandals cocktail', inCloset: false },
      { category: 'Jewelry', styleName: 'Gemstone Cocktail Ring', reasoning: 'A bold cocktail ring adds drama without requiring a necklace.', searchQuery: 'gemstone cocktail ring statement', inCloset: false },
      { category: 'Bag', styleName: 'Wicker Clutch', reasoning: 'Natural textures complement outdoor cocktail venues beautifully.', searchQuery: 'wicker clutch evening bag', inCloset: false },
    ],
    Formal: [
      { category: 'Watch', styleName: 'Swiss Automatic Watch', reasoning: 'A premium automatic watch signals serious style for formal outdoor events.', searchQuery: 'swiss automatic dress watch', inCloset: false },
      { category: 'Chain', styleName: 'Platinum Lariat Necklace', reasoning: 'A lariat necklace adds elongating elegance to formal outdoor attire.', searchQuery: 'platinum lariat necklace formal', inCloset: false },
      { category: 'Bracelet', styleName: 'Diamond Bangle', reasoning: 'A sparkling bangle catches natural sunlight beautifully at outdoor formal events.', searchQuery: 'diamond bangle bracelet formal', inCloset: false },
      { category: 'Shoes', styleName: 'Wedge Heels', reasoning: 'Wedges provide height and elegance with stability on outdoor terrain.', searchQuery: 'formal wedge heels elegant', inCloset: false },
      { category: 'Jewelry', styleName: 'Emerald Stud Earrings', reasoning: 'Colored gemstones pop against natural light at outdoor formal events.', searchQuery: 'emerald stud earrings formal', inCloset: false },
      { category: 'Bag', styleName: 'Leather Minaudière', reasoning: 'A structured mini bag in premium leather elevates formal outdoor looks.', searchQuery: 'leather minaudiere formal', inCloset: false },
    ],
  },
  Beach: {
    Casual: [
      { category: 'Watch', styleName: 'Waterproof Sport Watch', reasoning: 'A waterproof watch handles sand and surf while looking stylish.', searchQuery: 'waterproof sport watch beach', inCloset: false },
      { category: 'Chain', styleName: 'Shell Pendant Necklace', reasoning: 'Natural shell pendants embody the beach aesthetic perfectly.', searchQuery: 'shell pendant necklace beach', inCloset: false },
      { category: 'Bracelet', styleName: 'Anklet & Bracelet Set', reasoning: 'Layered anklets and bracelets are quintessential beach accessories.', searchQuery: 'gold anklet bracelet set beach', inCloset: true },
      { category: 'Shoes', styleName: 'Leather Slide Sandals', reasoning: 'Easy on-off sandals in quality leather elevate beach casual.', searchQuery: 'leather slide sandals beach', inCloset: true },
      { category: 'Jewelry', styleName: 'Turquoise Drop Earrings', reasoning: 'Ocean-colored stones naturally complement any beach setting.', searchQuery: 'turquoise drop earrings boho', inCloset: false },
      { category: 'Bag', styleName: 'Straw Beach Tote', reasoning: 'A roomy straw tote carries beach essentials with effortless style.', searchQuery: 'straw beach tote large', inCloset: false },
    ],
    Cocktail: [
      { category: 'Watch', styleName: 'Mother of Pearl Face Watch', reasoning: 'Iridescent dial reflects coastal light for beach cocktail events.', searchQuery: 'mother of pearl watch elegant', inCloset: false },
      { category: 'Chain', styleName: 'Multi-strand Pearl Necklace', reasoning: 'Layered pearls echo ocean treasures for elevated beach events.', searchQuery: 'multi strand pearl necklace', inCloset: false },
      { category: 'Bracelet', styleName: 'Coral Bead Bracelet', reasoning: 'Coral tones complement warm beach hues for cocktail settings.', searchQuery: 'coral bead bracelet elegant', inCloset: false },
      { category: 'Shoes', styleName: 'Espadrille Wedges', reasoning: 'Espadrilles bridge beach and cocktail with their natural-yet-elevated look.', searchQuery: 'espadrille wedge sandals cocktail', inCloset: false },
      { category: 'Jewelry', styleName: 'Starfish Earrings', reasoning: 'Themed statement pieces work beautifully for beach cocktail events.', searchQuery: 'starfish statement earrings gold', inCloset: false },
      { category: 'Bag', styleName: 'Raffia Clutch', reasoning: 'Natural raffia material is perfect for elevated beach events.', searchQuery: 'raffia clutch bag evening', inCloset: false },
    ],
    Formal: [
      { category: 'Watch', styleName: 'Gold Bracelet Watch', reasoning: 'A gold bracelet watch adds luxurious formality to beachside galas.', searchQuery: 'gold bracelet watch formal', inCloset: false },
      { category: 'Chain', styleName: 'Aquamarine Pendant', reasoning: 'An aquamarine stone mirrors ocean colors for formal beach elegance.', searchQuery: 'aquamarine pendant necklace gold', inCloset: false },
      { category: 'Bracelet', styleName: 'Crystal Wrap Bracelet', reasoning: 'Crystals catch the seaside sun beautifully at formal beach events.', searchQuery: 'crystal wrap bracelet formal', inCloset: false },
      { category: 'Shoes', styleName: 'Metallic Flat Sandals', reasoning: 'Flat metallic sandals maintain formality while being beach-practical.', searchQuery: 'metallic flat sandals formal beach', inCloset: false },
      { category: 'Jewelry', styleName: 'Sapphire Chandelier Earrings', reasoning: 'Blue sapphires complement the ocean setting with dramatic elegance.', searchQuery: 'sapphire chandelier earrings formal', inCloset: false },
      { category: 'Bag', styleName: 'Jeweled Box Clutch', reasoning: 'A jeweled clutch elevates formal beachside looks to black-tie level.', searchQuery: 'jeweled box clutch formal', inCloset: false },
    ],
  },
};

// Weather modifiers for local fallback
function applyWeatherModifiers(accessories: AccessoryRecommendation[], weather: string): AccessoryRecommendation[] {
  return accessories.map(acc => {
    let modified = { ...acc };
    
    if (weather === 'Cold') {
      if (acc.category === 'Shoes' && acc.styleName.includes('Sandal')) {
        modified = { ...acc, styleName: 'Leather Ankle Boots', reasoning: 'Cold weather calls for warm, closed-toe footwear that maintains style.', searchQuery: 'leather ankle boots warm stylish' };
      }
    } else if (weather === 'Rainy') {
      if (acc.category === 'Shoes') {
        modified = { ...acc, styleName: 'Waterproof Chelsea Boots', reasoning: 'Chelsea boots keep feet dry while looking polished in wet conditions.', searchQuery: 'waterproof chelsea boots stylish' };
      }
      if (acc.category === 'Bag') {
        modified = { ...acc, styleName: acc.styleName.includes('Tote') ? 'Water-Resistant Crossbody' : acc.styleName, reasoning: acc.category === 'Bag' ? 'Water-resistant materials protect your belongings in rainy conditions.' : acc.reasoning, searchQuery: 'water resistant crossbody bag' };
      }
    } else if (weather === 'Hot') {
      if (acc.category === 'Watch' && acc.styleName.includes('Leather')) {
        modified = { ...acc, styleName: 'Mesh Band Watch', reasoning: 'Breathable mesh bands keep you comfortable in hot weather.', searchQuery: 'mesh band watch breathable' };
      }
    }
    
    return modified;
  });
}

function getFallbackStyleAnalysis(formality: string, setting: string, weather: string) {
  const settingRecs = ACCESSORY_DB[setting] || ACCESSORY_DB['Indoor'];
  const formalityRecs = settingRecs[formality] || settingRecs['Cocktail'];
  const weatherAdjusted = applyWeatherModifiers(formalityRecs, weather);

  return {
    analyzedItem: {
      category: 'Dress / Garment',
      neckline: 'V-Neck',
      silhouette: 'A-Line',
      pattern: 'Solid',
      primaryColor: '#1E3A8A',
    },
    overallAssessment: {
      compatibilityScore: 9.2,
      verdict: 'Excellent Match',
      eventCompatibility: `Perfect for a ${formality} ${setting.toLowerCase()} setting${weather !== 'Mild' ? ` in ${weather.toLowerCase()} weather` : ''}.`,
      stylistNotes: `The garment provides a versatile, elegant base. We've curated ${setting.toLowerCase()} ${formality.toLowerCase()} accessories${weather !== 'Mild' ? ` adapted for ${weather.toLowerCase()} conditions` : ''} — including watch, jewelry, chains, bracelets, and footwear.`,
    },
    colorPalette: {
      primary: '#1E3A8A',
      secondary: '#E5E7EB',
      accent: '#F59E0B',
    },
    context: {
      setting,
      formality,
      weather,
    },
    accessoryRecommendations: weatherAdjusted,
  };
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const formality = formData.get('formality')?.toString() || 'Cocktail';
    const setting = formData.get('setting')?.toString() || 'Indoor';
    const weather = formData.get('weather')?.toString() || 'Mild';
    const useCloset = formData.get('useCloset')?.toString() === 'true';
    const imageFile = formData.get('image') as File | null;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn('GEMINI_API_KEY not found in environment. Using context-aware fallback.');
      return NextResponse.json(getFallbackStyleAnalysis(formality, setting, weather));
    }

    // Build Gemini Multimodal Payload
    const promptText = `You are an elite high-fashion AI personal stylist for the "Discover Your Perfect Match" wardrobe analyzer.
Analyze the provided wardrobe item ${imageFile ? 'in the uploaded image' : 'garment'} and build a curated, highly stylish head-to-toe outfit styling analysis for the following user parameters:
- Formality Level: ${formality}
- Setting / Venue: ${setting}
- Weather Condition: ${weather}
- Prioritize Digital Closet Items: ${useCloset ? 'Yes' : 'No'}

Provide a complete, structured analysis matching this EXACT JSON structure:
{
  "analyzedItem": {
    "category": "Detected Garment Category (e.g. Dress, Blazer, T-Shirt, Pants, Skirt, Jacket)",
    "neckline": "Detected Neckline (e.g. V-Neck, Crew Neck, Turtleneck, Collar, Off-Shoulder, N/A)",
    "silhouette": "Detected Silhouette (e.g. A-Line, Slim-Fit, Oversized, Tailored, Boxy)",
    "pattern": "Detected Pattern (e.g. Solid, Floral, Striped, Plaid, Geometric)",
    "primaryColor": "#HEXCODE of the garment primary color"
  },
  "overallAssessment": {
    "compatibilityScore": 9.4,
    "verdict": "Short punchy 2-4 word verdict (e.g. Excellent Match, Radiant Ensemble, Effortless Elegance)",
    "eventCompatibility": "1-2 sentences explaining why this outfit works perfectly for a ${formality} ${setting} event during ${weather} weather.",
    "stylistNotes": "Comprehensive 2-3 sentence expert styling advise detailing color coordination and accessory harmony."
  },
  "colorPalette": {
    "primary": "#HEXCODE of garment primary tone",
    "secondary": "#HEXCODE of complementing neutral/secondary tone",
    "accent": "#HEXCODE of vibrant accent color for accessories"
  },
  "context": {
    "setting": "${setting}",
    "formality": "${formality}",
    "weather": "${weather}"
  },
  "accessoryRecommendations": [
    {
      "category": "Watch",
      "styleName": "Specific watch style name",
      "reasoning": "Why this watch complements the outfit",
      "searchQuery": "Search query string for shopping",
      "inCloset": true
    },
    {
      "category": "Chain",
      "styleName": "Specific chain or necklace style name",
      "reasoning": "Why this necklace balances the neckline",
      "searchQuery": "Search query string for shopping",
      "inCloset": false
    },
    {
      "category": "Bracelet",
      "styleName": "Specific bracelet or bangle style name",
      "reasoning": "Why this bracelet fits the formality",
      "searchQuery": "Search query string for shopping",
      "inCloset": true
    },
    {
      "category": "Shoes",
      "styleName": "Specific footwear style name",
      "reasoning": "Why this footwear works for ${setting} and ${weather}",
      "searchQuery": "Search query string for shopping",
      "inCloset": false
    },
    {
      "category": "Jewelry",
      "styleName": "Specific earrings or ring style name",
      "reasoning": "Why this jewelry adds sparkle",
      "searchQuery": "Search query string for shopping",
      "inCloset": false
    },
    {
      "category": "Bag",
      "styleName": "Specific bag or clutch style name",
      "reasoning": "Why this bag complements the ensemble",
      "searchQuery": "Search query string for shopping",
      "inCloset": false
    }
  ]
}

CRITICAL RULES:
- Output ONLY raw valid JSON matching the exact schema above.
- Do NOT wrap JSON in markdown code fences (\`\`\`json).
- Provide exactly 6 accessory recommendations (one per category: Watch, Chain, Bracelet, Shoes, Jewelry, Bag).`;

    const userParts: Array<{ inline_data?: { mime_type: string; data: string }; text?: string }> = [];

    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const base64Data = buffer.toString('base64');
      const mimeType = imageFile.type || 'image/jpeg';

      userParts.push({
        inline_data: {
          mime_type: mimeType,
          data: base64Data,
        },
      });
    }

    userParts.push({ text: promptText });

    const modelsToTry = [
      'gemini-3.6-flash',
      'gemini-2.5-flash',
      'gemini-flash-latest',
      'gemini-2.5-pro',
    ];

    let geminiResponse: Response | null = null;

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
                parts: userParts,
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
          break;
        } else {
          console.warn(`Gemini model ${model} status ${res.status}. Trying next model...`);
        }
      } catch (err) {
        console.warn(`Error connecting to Gemini model ${model}:`, err);
      }
    }

    if (!geminiResponse || !geminiResponse.ok) {
      console.error('All Gemini API models failed. Returning fallback analysis.');
      return NextResponse.json(getFallbackStyleAnalysis(formality, setting, weather));
    }

    const data = await geminiResponse.json();
    const parts = data?.candidates?.[0]?.content?.parts || [];
    const rawText = parts.map((p: { text?: string }) => p.text || '').filter(Boolean).join('\n');
    
    // Clean and extract valid JSON object from response
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    const cleanedText = jsonMatch ? jsonMatch[0] : rawText.replace(/```json/gi, '').replace(/```/g, '').trim();

    try {
      const parsed = JSON.parse(cleanedText);
      return NextResponse.json(parsed);
    } catch (parseErr) {
      console.error('Failed to parse Gemini style JSON output:', parseErr, rawText);
      return NextResponse.json(getFallbackStyleAnalysis(formality, setting, weather));
    }
  } catch (error) {
    console.error('Style API error:', error);
    return NextResponse.json(getFallbackStyleAnalysis('Cocktail', 'Indoor', 'Mild'));
  }
}
