// agent-notes: { ctx: "editorial model dress options with Gemini multi-model opinion engine", deps: ["next/server"], state: active, last: "tara@2026-09-23" }
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
    topType: 'blazer' | 'gown' | 'saree' | 'kurta' | 'kurti' | 'shirt' | 'jacket' | 'top' | 'croptop';
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

Generate EXACTLY 3 distinct options with diverse dress silhouettes:
- For women: explore evening gowns, bridal/festive lehengas, royal anarkalis, banarasi sarees, tailored jumpsuits, and sculpted power suits.
- For men: explore bespoke peak tuxedos, imperial zari sherwanis, draped asymmetrical kurtas, Neapolitan linen suits, bandhgala suits, and luxury streetwear tracksuits.
- Option 1: Classic High-Fashion Authority (Timeless, structured, tailored power silhouette)
- Option 2: Statement Celebration & Gala Luxe (Fluid silk/brocade, dramatic drape, high luxury)
- Option 3: Modern Avant-Garde / Contemporary Fusion (Asymmetrical drape, textural contrast, architectural lines)

For EACH option provide:
1. modelStyleName
2. silhouetteType (e.g. 'Hourglass Runway', 'Sartorial Power Suit', 'Fluid Bias Cut', 'Architectural Cape', 'Imperial Sherwani', 'Flared Kalidar')
3. editorialReferral (source e.g. 'Vogue Runway / Pinterest Executive', inspiration, lookbookImageUrl from high-res fashion Unsplash)
4. geminiOpinion (score 85-99, verdict, critique, whyItWorks, walkingImpression)
5. outfit:
   - topType (must be one of: 'blazer', 'gown', 'saree', 'kurta', 'kurti', 'shirt', 'jacket', 'top', 'croptop')
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
      },
      {
        id: 'opt-men-4',
        modelStyleName: 'The Imperial Zari Silk Sherwani',
        silhouetteType: 'Imperial Grand Wedding Court Cut',
        editorialReferral: {
          source: 'Vogue Groom Editorial / Royal Atelier Lookbook',
          inspiration: 'Knee-length structured raw silk sherwani with gilded floral jaal needlework and gathered silk churidar.',
          lookbookImageUrl: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop'
        },
        geminiOpinion: {
          score: 99,
          verdict: 'Supreme Ceremonial Grandeur & Noble Poise',
          critique: 'The pure ivory silk with micro-zari threading creates an imperial presence unmatched for grand weddings.',
          whyItWorks: 'The 360 GSM heavy silk holds structural lines cleanly, while the mandarin collar commands upright posture.',
          walkingImpression: 'Commanding slow imperial pace with chest open and shoulders aligned.'
        },
        outfit: {
          topType: 'kurta',
          topColor: '#FAF8F5',
          bottomType: 'trousers',
          bottomColor: '#FAF8F5',
          outerwearColor: '#FAF8F5',
          accentColor: '#D4AF37',
          fabricType: 'silk',
          fabricGsm: '360 GSM Pure Matka Silk',
          fitStyle: 'regular'
        },
        accessories: {
          shoe: { name: 'Embroidered Velvet Zari Juttis', style: 'Ceremonial Mojri', finish: 'Midnight Velvet & Gold Thread', advice: 'Padded insole for ballroom longevity.' },
          watch: { name: 'Vintage Yellow Gold Dress Chronometer', style: 'Heirloom Watch', finish: '18k Yellow Gold', advice: 'Harmonizes with gilded sherwani buttons.' },
          ring: { name: 'Lion Crest Solid Gold Signet', style: 'Royal Signet', finish: '22k Gold', advice: 'Wear on right hand.' },
          chain: { name: 'Multi-Strand Basra Pearl Mala', style: 'Wedding Mala', finish: 'Saltwater Pearls & Emerald Beads', advice: 'Draped symmetrically across chest.' },
          bracelet: { name: 'Solid Heavy Gold Kada', style: 'Traditional Kada', finish: '22k Antique Gold', advice: 'Commands traditional respect.' }
        }
      },
      {
        id: 'opt-men-5',
        modelStyleName: 'The Savile Row 3-Piece Peak Tuxedo',
        silhouetteType: 'Black-Tie Red Carpet Sovereign',
        editorialReferral: {
          source: 'GQ Black Tie Special / Met Gala Archive',
          inspiration: 'Super 160s worsted barathea wool with silk grosgrain peak lapels, low-cut vest, and side-braided trousers.',
          lookbookImageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop'
        },
        geminiOpinion: {
          score: 98,
          verdict: 'Uncompromising Black-Tie Mastery & Red Carpet Precision',
          critique: 'The grosgrain silk lapels absorb flash photography while the pristine white piqué bib delivers brilliant contrast.',
          whyItWorks: 'The low-cut horseshoe vest eliminates shirt-bunching and maintains razor-sharp formal proportions.',
          walkingImpression: 'Sleek, statuesque red-carpet gait.'
        },
        outfit: {
          topType: 'blazer',
          topColor: '#020617',
          bottomType: 'trousers',
          bottomColor: '#020617',
          outerwearColor: '#FAF8F5',
          accentColor: '#FAF8F5',
          fabricType: 'wool',
          fabricGsm: '290 GSM Super 160s Barathea Wool',
          fitStyle: 'slim'
        },
        accessories: {
          shoe: { name: 'Patent Leather Wholecut Oxford Shoes', style: 'Formal Tuxedo Shoe', finish: 'Mirror Patent Gloss', advice: 'Conditioned to absolute mirror shine.' },
          watch: { name: 'Ultra-Thin Onyx Dress Watch', style: 'Formal Watch', finish: '18k White Gold / Onyx', advice: 'Under 7mm profile to slip beneath French cuffs.' },
          ring: { name: 'Black Onyx & Platinum Signet Band', style: 'Black-Tie Signet', finish: 'Platinum / Onyx', advice: 'Worn on pinky finger.' },
          chain: { name: 'Hand-Tied Silk Grosgrain Butterfly Bowtie', style: 'Formal Tie', finish: 'Mulberry Silk', advice: 'Tied by hand for natural sprezzatura.' },
          bracelet: { name: 'Black DLC Titanium Cable Cuff', style: 'Minimal Cuff', finish: 'DLC Black Steel', advice: 'Balances the left timepiece.' }
        }
      },
      {
        id: 'opt-men-6',
        modelStyleName: 'The Indo-Western Draped Kurta & Bandi',
        silhouetteType: 'Contemporary Draped Menswear',
        editorialReferral: {
          source: 'Men\'s Vogue India / Pinterest Festive Sangeet',
          inspiration: 'Asymmetrical cowl-hem silk kurta in deep wine marsala paired with an embroidered raw silk Nehru bandi jacket.',
          lookbookImageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop'
        },
        geminiOpinion: {
          score: 96,
          verdict: 'Dynamic Architectural Motion & Modern Festive Flair',
          critique: 'Breaks away from conventional kurtas with an arresting asymmetrical diagonal cowl line.',
          whyItWorks: 'Mulberry silk georgette flows effortlessly while the structured bandi vest anchors the chest.',
          walkingImpression: 'Fluid, confident stride with natural garment movement.'
        },
        outfit: {
          topType: 'kurta',
          topColor: '#881337',
          bottomType: 'trousers',
          bottomColor: '#0F172A',
          outerwearColor: '#881337',
          accentColor: '#D4AF37',
          fabricType: 'silk',
          fabricGsm: '240 GSM Silk Georgette & Raw Silk',
          fitStyle: 'regular'
        },
        accessories: {
          shoe: { name: 'Burnished Double Monkstrap Leather Shoes', style: 'Monkstrap Shoe', finish: 'Espresso Calf', advice: 'Brass buckles echoing Nehru jacket hardware.' },
          watch: { name: 'Bronze Pilot Chronograph on Saddle Leather', style: 'Sartorial Watch', finish: 'Aged Bronze & Leather', advice: 'Warm metallic accents matching the marsala tones.' },
          ring: { name: 'Hammered Brass Signet Ring', style: 'Artisan Band', finish: 'Aged Brass', advice: 'Understated bohemian refinement.' },
          chain: { name: 'Vintage Pocket Watch Chain', style: 'Vest Chain', finish: 'Aged Brass', advice: 'Draped into Nehru jacket welt pocket.' },
          bracelet: { name: 'Braided Italian Saddle Leather Cuff', style: 'Leather Wrap', finish: 'Dark Espresso', advice: 'Balances opposite wrist.' }
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
    },
    {
      id: 'opt-fem-4',
      modelStyleName: 'The Handcrafted Zardozi Bridal Lehenga',
      silhouetteType: 'Imperial 16-Kali Flared Bridal Silhouette',
      editorialReferral: {
        source: 'Vogue Weddings Haute Couture / Heritage Bridal',
        inspiration: 'Crimson raw silk lehenga with hand-embroidered antique gold zardozi kalis, sweetheart choli, and sheer organza dupatta.',
        lookbookImageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop'
      },
      geminiOpinion: {
        score: 99,
        verdict: 'Breathtaking Bridal Grandeur & Masterwork Embroidery',
        critique: 'The deep crimson raw silk accented by 24k gold zardozi needlework creates an unforgettable heirloom bridal silhouette.',
        whyItWorks: 'The 380 GSM heavyweight silk holds dramatic flare during circular spins and entrance walks.',
        walkingImpression: 'Majestic slow bridal walk with flowing organza pallu draped over forearm.'
      },
      outfit: {
        topType: 'croptop',
        topColor: '#991B1B',
        bottomType: 'skirt',
        bottomColor: '#991B1B',
        outerwearColor: '#FAF8F5',
        accentColor: '#D4AF37',
        fabricType: 'silk',
        fabricGsm: '380 GSM Heavyweight Raw Silk',
        fitStyle: 'regular'
      },
      accessories: {
        shoe: { name: 'Embellished Zari Mojri Block Heels', style: 'Bridal Heel', finish: 'Velvet & Gold Thread', advice: 'Cushioned 55mm block heel for ballroom endurance.' },
        watch: { name: 'Heritage Filigree Gold Bangle Watch', style: 'Traditional Watch', finish: '22k Gold Foil', advice: 'Complements bridal bangles.' },
        ring: { name: 'Polki Diamond & Emerald Statement Ring', style: 'Cocktail Statement', finish: '22k Gold Foil', advice: 'Catches candlelight reflection.' },
        chain: { name: 'Polki Diamond & Emerald Bridal Choker', style: 'Bridal Choker', finish: '22k Antique Gold', advice: 'Frames the sweetheart neckline.' },
        bracelet: { name: 'Temple Filigree Gold Kadas & Hathphool', style: 'Bridal Kadas', finish: 'Antique Gold Polish', advice: 'Adds traditional chiming grandeur.' }
      }
    },
    {
      id: 'opt-fem-5',
      modelStyleName: 'The Sculpted Wide-Leg Halter Jumpsuit',
      silhouetteType: 'Contemporary Architectural Haute Jumpsuit',
      editorialReferral: {
        source: 'Harper\'s Bazaar Evening / Paris Haute Couture',
        inspiration: 'High-neck Japanese crepe jumpsuit with sculpted halter collar, fluid knife-pleated palazzo legs, and gold hardware.',
        lookbookImageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop'
      },
      geminiOpinion: {
        score: 97,
        verdict: 'Razor-Sharp Contemporary Elegance & Red Carpet Power',
        critique: 'A fearless, sophisticated alternative to conventional evening gowns that elongates the frame with continuous palazzo lines.',
        whyItWorks: 'The high-neck halter collar broadens shoulders while the fluid palazzo legs float effortlessly.',
        walkingImpression: 'Sleek, statuesque runway stride.'
      },
      outfit: {
        topType: 'top',
        topColor: '#064E3B',
        bottomType: 'trousers',
        bottomColor: '#064E3B',
        outerwearColor: '#0A192F',
        accentColor: '#EAB308',
        fabricType: 'silk',
        fabricGsm: '280 GSM Heavy Japanese Crepe',
        fitStyle: 'slim'
      },
      accessories: {
        shoe: { name: 'Champagne Gold Pointed-Toe Stilettos', style: 'Evening Heel', finish: 'Mirror Metallic Leather', advice: '90mm stiletto elevating palazzo hem flush with floor.' },
        watch: { name: 'Minimalist Gold Bangle Timepiece', style: 'Bangle Watch', finish: '18k Polished Brass', advice: 'Doubles as high jewelry on left wrist.' },
        ring: { name: 'Geometric Double-Band Gold Ring', style: 'Architectural Ring', finish: '18k Solid Gold', advice: 'Clean lines accentuating hand gestures.' },
        chain: { name: 'Architectural Gold Torc Choker', style: 'Torc Collar', finish: 'Polished Brass Gold', advice: 'Accentuates the sculpted halter neckline.' },
        bracelet: { name: 'Solid Minimalist Gold Sculptural Cuff', style: 'Sculptural Cuff', finish: '18k Polished Gold', advice: 'Balances opposite wrist.' }
      }
    },
    {
      id: 'opt-fem-6',
      modelStyleName: 'The Royal Kalidar Silk Anarkali Gown',
      silhouetteType: 'Fluted Kalidar Umbrella Gown Silhouette',
      editorialReferral: {
        source: 'Jaipur Court Lookbook / Grazia India Festive',
        inspiration: '24-kali royal sapphire Chanderi silk anarkali with shimmering gota patti borders, gathered churidar, and tissue organza dupatta.',
        lookbookImageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop'
      },
      geminiOpinion: {
        score: 98,
        verdict: 'Regal Poise & Ethereal Dynamic Motion',
        critique: 'The umbrella flare created by 24 hand-stitched kalis produces mesmerizing movement during formal evening festivities.',
        whyItWorks: 'Empire waist contour creates statuesque height while pure Chanderi silk ensures weightless comfort.',
        walkingImpression: 'Gliding, graceful regal gait with flared hem rippling harmoniously.'
      },
      outfit: {
        topType: 'kurti',
        topColor: '#1E3A8A',
        bottomType: 'skirt',
        bottomColor: '#1E3A8A',
        outerwearColor: '#FAF8F5',
        accentColor: '#F59E0B',
        fabricType: 'silk',
        fabricGsm: '240 GSM Pure Chanderi Silk with Zari',
        fitStyle: 'regular'
      },
      accessories: {
        shoe: { name: 'Embellished Velvet Khussa Mojris', style: 'Traditional Mojri', finish: 'Raw Silk & Brass Thread', advice: 'Cushioned flat sole for lively celebrations.' },
        watch: { name: 'Heritage Filigree Bangle Watch', style: 'Heirloom Watch', finish: '22k Antique Gold', advice: 'Harmonizes with festive bangles.' },
        ring: { name: 'Kundan Navratan Cocktail Statement Ring', style: 'Royal Ring', finish: '22k Gold Foil / Stones', advice: 'Draws focus during ceremonial greetings.' },
        chain: { name: 'Layered Gold Gota & Pearl Mala', style: 'Festive Mala', finish: 'Emerald Beads & Gold Zari', advice: 'Drapes across royal blue bodice.' },
        bracelet: { name: 'Gold Filigree Temple Kadas Stack', style: 'Heirloom Bangles', finish: '22k Antique Gold', advice: 'Adds rhythmic chiming with hand movement.' }
      }
    }
  ];
}
