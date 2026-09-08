import { NextResponse } from 'next/server';

export interface ModelDressOption {
  id: string;
  modelStyleName: string;
  silhouetteType: string;
  editorialReferral: {
    source: string;
    inspiration: string;
    lookbookImageUrl: string;
  };
  geminiOpinion: {
    score: number;
    verdict: string;
    critique: string;
    whyItWorks: string;
    walkingImpression: string;
  };
  outfit: {
    topType: 'blazer' | 'gown' | 'saree' | 'kurta' | 'shirt' | 'jacket' | 'top' | 'croptop';
    topColor: string;
    bottomType: 'trousers' | 'skirt' | 'chinos' | 'jeans' | 'gown_skirt';
    bottomColor: string;
    outerwearColor?: string;
    accentColor: string;
    fabricType: 'wool' | 'silk' | 'linen' | 'denim' | 'leather';
    fabricGsm: string;
    fitStyle: 'slim' | 'regular' | 'oversized';
  };
  accessories: {
    shoe: { name: string; style: string; finish: string; advice: string };
    watch: { name: string; style: string; finish: string; advice: string };
    ring: { name: string; style: string; finish: string; advice: string };
    chain: { name: string; style: string; finish: string; advice: string };
    bracelet: { name: string; style: string; finish: string; advice: string };
  };
}

export interface ModelDressOptionsResponse {
  options: ModelDressOption[];
  occasion: string;
  gender: string;
  source: string;
  modelUsed: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      gender = 'female', 
      occasion = 'Job Interview & Executive Assessment', 
      preferredColor = '#1E293B',
      bodySilhouette = 'runway_tall'
    } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      const fallbackOptions = getFallbackModelOptions(gender, occasion, preferredColor);
      return NextResponse.json({
        options: fallbackOptions,
        occasion,
        gender,
        source: 'fallback',
        modelUsed: 'AuraStyle Elite Heuristic Engine'
      });
    }

    const systemPrompt = `You are a renowned Fashion Director, Haute Couture Designer, and Vogue Editorial Judge.
Your client is a ${gender.toUpperCase()} seeking 3 UNIQUE, distinct Model Dress & Accessory Options for: "${occasion}".
Preferred Color Anchor: ${preferredColor}
Target Silhouette: ${bodySilhouette}

Generate EXACTLY 3 distinct options:
- Option 1: Classic High-Fashion Authority (Timeless, structured, tailored power silhouette)
- Option 2: Statement Celebration & Gala Luxe (Fluid silk/brocade, dramatic drape, high luxury)
- Option 3: Modern Avant-Garde / Contemporary Fusion (Asymmetrical drape, textural contrast, architectural lines)

For EACH option provide:
1. modelStyleName
2. silhouetteType (e.g. 'Hourglass Runway', 'Sartorial Power Suit', 'Fluid Bias Cut', 'Architectural Cape')
3. editorialReferral (source e.g. 'Vogue Runway / Pinterest Executive', inspiration, lookbookImageUrl from high-res fashion Unsplash)
4. geminiOpinion (score 85-99, verdict, critique, whyItWorks, walkingImpression)
5. outfit:
   - topType (must be one of: 'blazer', 'gown', 'saree', 'kurta', 'shirt', 'jacket', 'top', 'croptop')
   - topColor (hex)
   - bottomType (must be one of: 'trousers', 'skirt', 'chinos', 'jeans', 'gown_skirt')
   - bottomColor (hex)
   - outerwearColor (hex)
   - accentColor (hex)
   - fabricType ('wool', 'silk', 'linen', 'denim', 'leather')
   - fabricGsm (e.g. '260 GSM Super 140s Wool')
   - fitStyle ('slim', 'regular', 'oversized')
6. accessories (5 distinct pieces: shoe, watch, ring, chain, bracelet with coordinated metal finishes)

Return RAW JSON matching this structure:
{
  "options": [
    {
      "id": "opt-1",
      "modelStyleName": "...",
      "silhouetteType": "...",
      "editorialReferral": { "source": "...", "inspiration": "...", "lookbookImageUrl": "https://..." },
      "geminiOpinion": { "score": 96, "verdict": "...", "critique": "...", "whyItWorks": "...", "walkingImpression": "..." },
      "outfit": { "topType": "blazer", "topColor": "#1E293B", "bottomType": "trousers", "bottomColor": "#FAF8F5", "outerwearColor": "#0A192F", "accentColor": "#D4AF37", "fabricType": "wool", "fabricGsm": "260 GSM Worsted Wool", "fitStyle": "regular" },
      "accessories": {
        "shoe": { "name": "...", "style": "...", "finish": "...", "advice": "..." },
        "watch": { "name": "...", "style": "...", "finish": "...", "advice": "..." },
        "ring": { "name": "...", "style": "...", "finish": "...", "advice": "..." },
        "chain": { "name": "...", "style": "...", "finish": "...", "advice": "..." },
        "bracelet": { "name": "...", "style": "...", "finish": "...", "advice": "..." }
      }
    }
  ]
}`;

    const modelsToTry = [
      'gemini-3.6-flash',
      'gemini-2.5-flash',
      'gemini-1.5-flash-latest'
    ];

    for (const model of modelsToTry) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
              generationConfig: {
                temperature: 0.75,
                maxOutputTokens: 2048,
                responseMimeType: 'application/json'
              }
            })
          }
        );

        if (response.ok) {
          const geminiData = await response.json();
          const candidateText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            const cleaned = candidateText.replace(/```json/gi, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleaned);
            if (parsed.options && Array.isArray(parsed.options) && parsed.options.length > 0) {
              return NextResponse.json({
                options: parsed.options,
                occasion,
                gender,
                source: 'gemini',
                modelUsed: model
              });
            }
          }
        }
      } catch (err) {
        console.warn(`Model ${model} failed for model dress options, trying next:`, err);
      }
    }

    const fallbackOptions = getFallbackModelOptions(gender, occasion, preferredColor);
    return NextResponse.json({
      options: fallbackOptions,
      occasion,
      gender,
      source: 'fallback',
      modelUsed: 'AuraStyle Elite Heuristics Engine'
    });

  } catch (err) {
    console.error('Error generating model dress options:', err);
    return NextResponse.json({
      options: getFallbackModelOptions('female', 'Event', '#1E293B'),
      occasion: 'Event',
      gender: 'female',
      source: 'error-fallback',
      modelUsed: 'Default Engine'
    });
  }
}

function getFallbackModelOptions(gender: string, occasion: string, preferredColor: string): ModelDressOption[] {
  const isMen = gender === 'male';

  if (isMen) {
    return [
      {
        id: 'opt-men-1',
        modelStyleName: 'The Savile Row Boardroom Authority',
        silhouetteType: 'Sartorial Power Suit (British Structured)',
        editorialReferral: {
          source: 'GQ British Edition / Savile Row Archive',
          inspiration: 'Subtle shoulder roping, peak lapels, and pristine Egyptian cotton shirt with no-break trousers.',
          lookbookImageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop'
        },
        geminiOpinion: {
          score: 97,
          verdict: 'Masterful Corporate Gravitas & Precision',
          critique: 'The deep navy worsted wool establishes immediate intellectual dominance, while the ivory shirt cuff reveal adds Savile Row distinction.',
          whyItWorks: 'The 260 GSM fabric creates a razor-sharp vertical drape that elongates the torso and minimizes wrinkling during marathon interviews.',
          walkingImpression: 'Upright, measured catwalk stride with shoulders aligned squarely over the pelvis.'
        },
        outfit: {
          topType: 'blazer',
          topColor: '#0F172A',
          bottomType: 'trousers',
          bottomColor: '#0F172A',
          outerwearColor: '#FAF8F5',
          accentColor: '#FAF8F5',
          fabricType: 'wool',
          fabricGsm: '270 GSM Super 150s Merino Wool',
          fitStyle: 'regular'
        },
        accessories: {
          shoe: { name: 'Goodyear-Welted Oxford Brogues', style: 'Formal Oxford', finish: 'Burnished Antique Cognac', advice: 'Conditioned to mirror gloss on toe cap.' },
          watch: { name: '38mm Slim Steel Timepiece', style: 'Executive Dress Watch', finish: 'Brushed Stainless / White Enamel', advice: 'Profile under 9mm to slip beneath cuff.' },
          ring: { name: 'Satin Finish Signet Band', style: 'Signet Band', finish: 'Platinum Satin', advice: 'Wear on left pinky finger for subtle elegance.' },
          chain: { name: 'Flat Curb Gold Collar Chain', style: 'Sub-Collar Chain', finish: '14k Polished Gold', advice: 'Tucked beneath shirt collar spread.' },
          bracelet: { name: 'Architectural Titanium Bar Cuff', style: 'Minimalist Cuff', finish: 'Brushed Titanium', advice: 'Balances the right wrist opposite timepiece.' }
        }
      },
      {
        id: 'opt-men-2',
        modelStyleName: 'The Royal Gala Raw Silk Bandhgala',
        silhouetteType: 'Imperial Indo-Western Ceremonial',
        editorialReferral: {
          source: 'Vogue India Weddings / Pinterest Royal Groom',
          inspiration: 'Mandarin collar raw silk jacket with hand-carved gilded buttons and tapered Jodhpur trousers.',
          lookbookImageUrl: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop'
        },
        geminiOpinion: {
          score: 98,
          verdict: 'Regal Splendor & Ceremonial Majesty',
          critique: 'The champagne raw silk captures chandelier lighting with an ethereal pearlescent sheen. Unmatched for evening weddings.',
          whyItWorks: 'The structured mandarin collar naturally pulls the chin upward, projecting nobility and poise.',
          walkingImpression: 'Commanding regal pace with chest open and confident eye contact.'
        },
        outfit: {
          topType: 'kurta',
          topColor: '#1E293B',
          bottomType: 'trousers',
          bottomColor: '#FAF8F5',
          outerwearColor: '#FAF8F5',
          accentColor: '#D4AF37',
          fabricType: 'silk',
          fabricGsm: '320 GSM Hand-Spun Raw Silk',
          fitStyle: 'slim'
        },
        accessories: {
          shoe: { name: 'Embroidered Velvet Mojri Loafers', style: 'Ceremonial Loafer', finish: 'Midnight Velvet / Zari Thread', advice: 'Padded leather insole for ballroom longevity.' },
          watch: { name: 'Vintage Gold Dress Chronometer', style: 'Heirloom Watch', finish: '18k Yellow Gold / Crocodile Strap', advice: 'Pairs with gilded bandhgala buttons.' },
          ring: { name: 'Uncut Polki Diamond Signet', style: 'Royal Gemstone', finish: '22k Gold Foil', advice: 'Wear on ring finger as heirloom statement.' },
          chain: { name: 'Layered Basra Pearl Haar', style: 'Royal Pearl Chain', finish: 'Natural Saltwater Pearls', advice: 'Draped gently over the chest lapel.' },
          bracelet: { name: 'Gold Filigree Kada Cuff', style: 'Heirloom Kada', finish: '22k Antique Gold', advice: 'Adds solid metallic weight to the right wrist.' }
        }
      },
      {
        id: 'opt-men-3',
        modelStyleName: 'The Milanese Relaxed Tailoring',
        silhouetteType: 'Modern Casual Luxe (Soft Construction)',
        editorialReferral: {
          source: 'Pitti Uomo Florence / Pinterest Menswear Archive',
          inspiration: 'Unstructured double-breasted cotton jacket paired with fluid pleated chinos and suede penny loafers.',
          lookbookImageUrl: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&auto=format&fit=crop'
        },
        geminiOpinion: {
          score: 94,
          verdict: 'Effortless Sprezzatura & Contemporary Ease',
          critique: 'Deconstructs rigid formality while maintaining clean architectural proportions through pleated trousers and rich earth tones.',
          whyItWorks: 'Breathable linen-cotton blend delivers thermal regulation and relaxed movement for creative and casual gatherings.',
          walkingImpression: 'Breezy, confident stride with natural arm swing and relaxed shoulders.'
        },
        outfit: {
          topType: 'shirt',
          topColor: '#C2410C',
          bottomType: 'chinos',
          bottomColor: '#FAF8F5',
          outerwearColor: '#1E293B',
          accentColor: '#EAB308',
          fabricType: 'linen',
          fabricGsm: '220 GSM Italian Slub Linen',
          fitStyle: 'oversized'
        },
        accessories: {
          shoe: { name: 'Unlined Snuff Suede Penny Loafers', style: 'Casual Loafer', finish: 'Snuff Italian Suede', advice: 'Wear sockless or with invisible bamboo socks.' },
          watch: { name: 'Field Watch on Olive NATO Strap', style: 'Vintage Field Watch', finish: 'Matte Sandblasted Bronze', advice: 'Rugged yet refined outdoor presence.' },
          ring: { name: 'Hammered Sterling Silver Band', style: 'Artisan Band', finish: 'Oxidized Silver', advice: 'Understated bohemian sophistication.' },
          chain: { name: 'Venetian Box Chain Pendant', style: 'Collar Chain', finish: 'Aged Silver', advice: 'Rests cleanly at the hollow of the throat.' },
          bracelet: { name: 'Braided Italian Leather Wrap', style: 'Leather Wrap', finish: 'Espresso Calfskin', advice: 'Layered alongside vintage timepiece.' }
        }
      }
    ];
  }

  // WOMEN OPTIONS
  return [
    {
      id: 'opt-fem-1',
      modelStyleName: 'The Executive Couture Power Tailoring',
      silhouetteType: 'Sculpted Hourglass Blazer & Fluid Trousers',
      editorialReferral: {
        source: 'Harper\'s Bazaar Executive / Pinterest Corporate Runway',
        inspiration: 'Single-breasted sculpted wool-crepe blazer cinched lightly at natural waist over high-waist fluid trousers.',
        lookbookImageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop'
      },
      geminiOpinion: {
        score: 98,
        verdict: 'Unrivaled Boardroom Poise & Modern Authority',
        critique: 'The deep obsidian and crisp ivory palette communicates absolute reliability and high intellectual discernment.',
        whyItWorks: 'Sculpted waist suppression provides flattering definition without restricting mobility during executive presentations.',
        walkingImpression: 'Statuesque, fluid runway walk with sharp heel-strike and commanding posture.'
      },
      outfit: {
        topType: 'blazer',
        topColor: '#0F172A',
        bottomType: 'trousers',
        bottomColor: '#FAF8F5',
        outerwearColor: '#0F172A',
        accentColor: '#D4AF37',
        fabricType: 'wool',
        fabricGsm: '260 GSM Double-Faced Wool Crepe',
        fitStyle: 'regular'
      },
      accessories: {
        shoe: { name: 'Pointed-Toe 75mm Italian Nappa Pumps', style: 'Classic Pump', finish: 'Deep Midnight Leather', advice: 'Sleek pointed toe elongates legs beneath fluid trousers.' },
        watch: { name: '28mm Rose Gold Mesh Timepiece', style: 'Dress Mesh Watch', finish: '18k Rose Gold / Enamel Dial', advice: 'Understated 8mm profile slips beneath blazer cuff.' },
        ring: { name: 'Solitaire Diamond Pavé Band', style: 'Elegance Band', finish: '18k Polished Gold', advice: 'Wear on left hand for luminous ambient reflection.' },
        chain: { name: 'Freshwater Pearl Droplet Pendant', style: 'Princess Length Chain', finish: '18k Yellow Gold', advice: 'Centers cleanly at the neck collar spread.' },
        bracelet: { name: 'Diamond Tennis Line Bracelet', style: 'Tennis Line', finish: 'Platinum / Crystal', advice: 'Worn on right wrist to balance the watch on the left.' }
      }
    },
    {
      id: 'opt-fem-2',
      modelStyleName: 'The Mulberry Silk Gala Gown',
      silhouetteType: 'Liquid Charmeuse Cathedral Silhouette',
      editorialReferral: {
        source: 'Vogue Runway Haute Couture / Met Gala Lookbook',
        inspiration: 'Floor-sweeping liquid mulberry silk gown with sculpted cowl back and liquid cascading drapery.',
        lookbookImageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop'
      },
      geminiOpinion: {
        score: 99,
        verdict: 'Breathtaking Gala Elegance & Liquid Luster',
        critique: 'The 19-Momme mulberry silk creates mesmerizing dynamic shadows on the catwalk, catching every spotlight angle.',
        whyItWorks: 'Bias-cut drape skims the body contours effortlessly, creating an elongated, statuesque proportion.',
        walkingImpression: 'Gliding, ethereal stride with fabric rippling harmoniously in motion.'
      },
      outfit: {
        topType: 'gown',
        topColor: '#881337',
        bottomType: 'gown_skirt',
        bottomColor: '#881337',
        outerwearColor: '#FAF8F5',
        accentColor: '#D4AF37',
        fabricType: 'silk',
        fabricGsm: '110 GSM Pure Silk Charmeuse',
        fitStyle: 'slim'
      },
      accessories: {
        shoe: { name: 'Champagne Ankle-Strap Stilettos', style: 'Evening Heel', finish: 'Mirrored Metallic Champagne', advice: 'Calculated to elevate hem exactly 0.5 inches off the floor.' },
        watch: { name: 'Diamond-Bezel Jewelry Watch', style: 'Cocktail Timepiece', finish: '18k Yellow Gold', advice: 'Doubles as high jewelry on evening receptions.' },
        ring: { name: 'Emerald-Cut Cocktail Gemstone', style: 'Cocktail Ring', finish: '18k Yellow Gold / Diamond', advice: 'Catches candlelight and ballroom chandeliers.' },
        chain: { name: 'Layered Gold Décolletage Choker', style: 'Décolletage Necklace', finish: '18k Solid Gold', advice: 'Frames the sweetheart neckline with luminous warmth.' },
        bracelet: { name: 'Cascading Gold Bangle Stack', style: 'Artisan Bangles', finish: 'Polished Yellow Gold', advice: 'Adds graceful chiming with hand gestures.' }
      }
    },
    {
      id: 'opt-fem-3',
      modelStyleName: 'The Heritage Banarasi Zari Saree',
      silhouetteType: 'Royal Indo-Western Festive Fusion',
      editorialReferral: {
        source: 'Pantaloons Flagship Lookbook / Grazia India',
        inspiration: 'Handwoven pure katan silk with antique zari brocade border, modern high-neck blouse, and floating cape pallu.',
        lookbookImageUrl: '/images/branding/womens-ethnic-fusion.jpg'
      },
      geminiOpinion: {
        score: 97,
        verdict: 'Majestic Heritage Splendor with Contemporary Chic',
        critique: 'Combines millennia-old Varanasi zari craftsmanship with a sleek minimalist blouse silhouette.',
        whyItWorks: 'The substantial 320 GSM weight holds architectural pleats flawlessly throughout festive celebrations.',
        walkingImpression: 'Slow, graceful imperial stride with flowing pallu draped over forearm.'
      },
      outfit: {
        topType: 'saree',
        topColor: '#064E3B',
        bottomType: 'skirt',
        bottomColor: '#064E3B',
        outerwearColor: '#064E3B',
        accentColor: '#F59E0B',
        fabricType: 'silk',
        fabricGsm: '320 GSM Katan Silk with Zari',
        fitStyle: 'regular'
      },
      accessories: {
        shoe: { name: 'Embroidered Zardozi Mojri Block Heels', style: 'Traditional Heel', finish: 'Antique Gold Threadwork', advice: 'Provides steady ballroom balance during dancing.' },
        watch: { name: 'Filigree Heritage Bangle Watch', style: 'Traditional Timepiece', finish: '22k Antique Gold', advice: 'Harmonizes with wedding chooda or gold bangles.' },
        ring: { name: 'Kundan Cocktail Statement Ring', style: 'Royal Ring', finish: 'Gold Foil / Uncut Stones', advice: 'Draws focus during ceremonial greetings.' },
        chain: { name: 'Royal Emerald & Pearl Choker', style: 'Bridal Choker', finish: 'Emerald Beads / Gold Zari', advice: 'Frames the neckline with regal grandeur.' },
        bracelet: { name: 'Temple Filigree Gold Kadas', style: 'Heirloom Kadas', finish: '22k Antique Gold', advice: 'Complements the zari border of the saree.' }
      }
    }
  ];
}
