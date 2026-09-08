import { NextResponse } from 'next/server';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AiChatResponse {
  reply: string;
  voiceText: string;
  suggestedQuestions: string[];
  stylingTags: string[];
  source: string;
  modelUsed: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      message = '', 
      history = [], 
      gender = 'female', 
      occasion = 'Everyday Chic',
      isVoice = false 
    } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      const fallback = generateSmartFallbackReply(message, gender, occasion);
      return NextResponse.json({
        ...fallback,
        source: 'fallback',
        modelUsed: 'AuraStyle Elite Heuristics (No API Key)',
      });
    }

    const systemPrompt = `You are "AuraStylist", the world-class personal AI fashion designer and celebrity stylist for AuraStyle AI.
You advise clients of both genders (${gender.toUpperCase()} currently selected) on:
1. Job Interview Mastery (corporate, finance, tech, executive presence, 0.5-inch cuff exposure, no-break/slight-break trousers, collar spread).
2. Wedding & Gala Etiquette (bridal, groom, black-tie tuxedos, ethnic silk sherwanis, embroidered lehengas, cocktail gowns).
3. 5-Piece Coordinated Accessories (shoes, watch, ring, chain/necklace, bracelet, clutch/bag) with unified hardware tones (gold, silver, rose gold).
4. Fabric & Fit Science (GSM weight, drape, breathability, Super 140s wool, silk charmeuse, linen-cotton blends, slim vs. regular vs. oversized).
5. Chromatic Harmonies (complimentary tones, skin tone warmth, contrast ratios).

Voice & Tone:
- Confident, discerning, inspiring, polite, and luxury fashion editorial standard (like a top Vogue editor & Savile Row bespoke master).
${isVoice ? '- KEEP RESPONSES CONCISE & CONVERSATIONAL (2-4 sentences max), formatted smoothly for text-to-speech audio.' : '- Provide thorough, actionable, beautifully structured advice with bullet points for items/accessories when helpful.'}

User message: "${message}"
Current occasion context: ${occasion}
Active gender preference: ${gender}`;

    // Format conversation history for Gemini API
    const formattedContents = [
      {
        role: 'user',
        parts: [{ text: systemPrompt }]
      },
      ...history.slice(-6).map((msg: ChatMessage) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      })),
      {
        role: 'user',
        parts: [{ text: `Client asks: ${message}\nProvide your expert styling advice in JSON format:
{
  "reply": "Styling advice text here...",
  "voiceText": "Short 2-sentence conversational summary suitable to be spoken aloud...",
  "suggestedQuestions": ["Follow up question 1?", "Follow up question 2?", "Follow up question 3?"],
  "stylingTags": ["Tag1", "Tag2", "Tag3"]
}` }]
      }
    ];

    const modelsToTry = [
      'gemini-3.6-flash',
      'gemini-2.5-flash',
      'gemini-1.5-flash-latest',
      'gemini-1.5-pro'
    ];

    let apiSuccess = false;
    let replyData: Partial<AiChatResponse> = {};
    let chosenModel = '';

    for (const model of modelsToTry) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: formattedContents,
              generationConfig: {
                temperature: 0.7,
                topP: 0.95,
                maxOutputTokens: 1024,
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
            replyData = parsed;
            chosenModel = model;
            apiSuccess = true;
            break;
          }
        }
      } catch (err) {
        console.warn(`Model ${model} failed for ai-chat, trying next:`, err);
      }
    }

    if (apiSuccess && replyData.reply) {
      return NextResponse.json({
        reply: replyData.reply,
        voiceText: replyData.voiceText || replyData.reply.slice(0, 160),
        suggestedQuestions: replyData.suggestedQuestions || [
          "What jewelry matches this look?",
          "Can you suggest shoes and a bag?",
          "How do I adjust this for hot weather?"
        ],
        stylingTags: replyData.stylingTags || ["AuraStyle", "Bespoke", occasion],
        source: 'gemini',
        modelUsed: chosenModel
      });
    }

    // Smart fallback if API quota or connectivity fails
    const fallback = generateSmartFallbackReply(message, gender, occasion);
    return NextResponse.json({
      ...fallback,
      source: 'fallback',
      modelUsed: 'AuraStyle Elite Heuristics Engine'
    });

  } catch (error) {
    console.error('AI Chat Error:', error);
    return NextResponse.json({
      reply: "I am ready to elevate your personal style! Tell me about the event you're preparing for—whether a high-stakes job interview, a luxury wedding, or daily boardroom presence.",
      voiceText: "I'm ready to style you. Tell me about your upcoming occasion, interview, or wedding.",
      suggestedQuestions: [
        "What should I wear to a software engineer interview?",
        "What colors and jewelry work for an evening wedding?",
        "How do I choose between slim and regular suit fit?"
      ],
      stylingTags: ["Interview", "Wedding", "Accessories"],
      source: 'error-recovery',
      modelUsed: 'Fallback Local'
    });
  }
}

function generateSmartFallbackReply(message: string, gender: string, occasion: string): {
  reply: string;
  voiceText: string;
  suggestedQuestions: string[];
  stylingTags: string[];
} {
  const lower = message.toLowerCase();

  // Job Interview query
  if (lower.includes('interview') || lower.includes('job') || lower.includes('corporate') || lower.includes('office')) {
    if (gender === 'male' || lower.includes('men') || lower.includes('guy')) {
      return {
        reply: `For a high-impact men's job interview, poise and precision are paramount:\n\n• **Upper Body**: A structured Super 140s Navy or Charcoal wool suit jacket with high armholes, paired with a crisp 100% Egyptian cotton white or sky-blue dress shirt.\n• **Lower Body**: Flat-front matching tailored trousers with a slight trouser break resting neatly on the shoe vamp.\n• **Footwear**: Dark burnished antique cognac or black leather Oxford brogues, conditioned to a mirror shine.\n• **5-Piece Accessories**: An ultra-thin 28-38mm dress watch on a dark leather strap (slips beneath shirt cuff), subtle satin platinum signet or plain band, delicate tie bar matching your belt buckle, and a leather folio bag.\n• **Sartorial Rule**: Expose exactly 0.5 inches (1.2 cm) of your shirt cuff beneath your jacket sleeve.`,
        voiceText: "For your interview, opt for a tailored navy wool suit with a crisp white shirt and polished leather Oxfords. Keep accessories minimalist and ensure your jacket reveals half an inch of shirt cuff.",
        suggestedQuestions: [
          "Should I wear a tie for a tech company interview?",
          "What watch should I wear with a navy suit?",
          "What shoes are best for long interview days?"
        ],
        stylingTags: ["Corporate Interview", "Men Suiting", "Executive Poise"]
      };
    } else {
      return {
        reply: `For a women's executive interview, your look should radiate competence, calm authority, and refined polish:\n\n• **Silhouette**: A bespoke single-breasted wool-crepe blazer in deep midnight navy or charcoal, paired with high-waisted fluid trousers or an elegant knee-length pencil skirt.\n• **Inner Layer**: A high-neck ivory silk georgette blouse or structured crepe camisole with clean drape.\n• **Footwear**: Pointed-toe 65-75mm Italian nappa leather pumps or sleek equestrian leather block heels.\n• **5-Piece Accessories**: Minimalist freshwater pearl droplet pendant, rose gold mesh dress watch, delicate solitaire ring band, understated gold cuff, and a structured architectural leather document tote.\n• **Pro Tip**: Keep necklines modest and ensure all metal hardware (watch, bag clasp, necklace) harmonize in warm gold or cool silver.`,
        voiceText: "For your interview, I recommend a tailored midnight navy blazer paired with an ivory silk blouse and pointed-toe leather pumps. Accent with minimalist pearl and gold jewelry.",
        suggestedQuestions: [
          "Are flats acceptable for an executive interview?",
          "What colors convey the most trust in interviews?",
          "How do I style my hair with a high-neck blouse?"
        ],
        stylingTags: ["Women Executive", "Interview Mastery", "Quiet Luxury"]
      };
    }
  }

  // Wedding & Gala query
  if (lower.includes('wedding') || lower.includes('reception') || lower.includes('gala') || lower.includes('sangeet') || lower.includes('party')) {
    if (gender === 'male' || lower.includes('men') || lower.includes('groom')) {
      return {
        reply: `For a wedding celebration or formal gala reception:\n\n• **Black-Tie / Western**: A midnight blue or black wool-silk tuxedo with grosgrain silk peak lapels, wing-collar pleated shirt, and patent leather oxford pumps.\n• **Ethnic / Royal Fusion**: Raw silk or jacquard bandhgala in champagne ivory or deep sapphire, paired with tailored slim Jodhpur trousers and embroidered velvet mojris.\n• **5-Piece Accessories**: High-polish 18k gold cufflinks, onyx dress watch, signet ring on pinky, braided metallic chain beneath the collar, and a matching silk pocket square with a presidential fold.\n• **Grooming Advice**: Match your watch bezel with your cufflinks and belt hardware.`,
        voiceText: "For weddings, a midnight blue silk-lapel tuxedo or champagne raw silk bandhgala creates timeless grandeur. Pair with high-polish cufflinks and velvet footwear.",
        suggestedQuestions: [
          "Can I wear a velvet jacket to an evening wedding?",
          "What pocket square fold works best for galas?",
          "How do I coordinate with my partner's dress?"
        ],
        stylingTags: ["Wedding Gala", "Tuxedo", "Ethnic Royal"]
      };
    } else {
      return {
        reply: `For a wedding gala or festive reception:\n\n• **Western Formal**: An architectural floor-sweeping gown in champagne satin or emerald crepe, featuring an asymmetrical cowl neckline or sculpted corsetry.\n• **Festive / Ethnic Fusion**: An embroidered silk organza lehenga or georgette cape saree in jewel tones (sapphire, ruby, or champagne gold).\n• **Footwear**: Metallic champagne ankle-strap 85mm stilettos or embellished block-heel mules for effortless dancing.\n• **5-Piece Accessories**: Solitaire diamond tennis bracelet, cascading pearl & stone chandelier earrings, layered delicate choker chain, cocktail gemstone ring, and a beaded micro clutch.\n• **Finishing Touch**: Mist with floral-amber notes and keep an ivory silk shawl draped over the forearms.`,
        voiceText: "For wedding occasions, choose an emerald or champagne satin gown or embroidered organza drape. Complement with a diamond tennis bracelet and metallic stilettos.",
        suggestedQuestions: [
          "What accessories complement an emerald gown?",
          "What shoes are comfortable for dancing at a wedding?",
          "Which bag size works best for formal receptions?"
        ],
        stylingTags: ["Wedding Couture", "Jewel Tones", "Diamond Tennis Suite"]
      };
    }
  }

  // Fabric & Fit query
  if (lower.includes('fabric') || lower.includes('fit') || lower.includes('size') || lower.includes('cotton') || lower.includes('wool') || lower.includes('silk')) {
    return {
      reply: `Here is our master guide to fabric science and tailored fit:\n\n• **Fit Architecture**:\n  - **Slim**: Tapered waist suppression, high armholes, clean back line without pulling.\n  - **Regular**: Timeless balance with two fingers of breathing room inside the fastened top button.\n  - **Oversized / Fluid**: Relaxed dropped shoulders with generous drape for contemporary street-luxe.\n• **Fabric Weights (GSM)**:\n  - Summer/Mild: 180-220 GSM (Egyptian cotton, silk-linen blends).\n  - Year-Round: 250-290 GSM (Super 140s Merino Wool twill).\n  - Structured Winter: 350+ GSM (Cashmere melton, heavy flannel).\n• **Care Advice**: Steam press rather than flat iron, and always hang on broad cedar contoured hangers.`,
      voiceText: "Slim fits emphasize tapered waist suppression, while regular provides two fingers of breathing room. Opt for two-hundred-sixty GSM Super 140s wool for year-round luxury.",
      suggestedQuestions: [
        "What is the best fabric for hot, humid climates?",
        "How should suit trousers break over shoes?",
        "How do I prevent wool garments from wrinkling?"
      ],
      stylingTags: ["Fabric Science", "Tailored Fit", "Garment Care"]
    };
  }

  // Accessories query
  if (lower.includes('accessory') || lower.includes('watch') || lower.includes('shoe') || lower.includes('ring') || lower.includes('chain') || lower.includes('jewelry')) {
    return {
      reply: `Our signature 5-Piece Accessory Coordination Rule:\n\n1. **The Shoe**: The anchor of your outfit. Match leather warmth to the hour (cognac for afternoon, obsidian black for gala).\n2. **The Watch**: The personal signature. Keep the case under 10mm thickness so it rests smoothly beneath shirt cuffs.\n3. **The Ring**: One statement ring per hand maximum (e.g. pinky signet or pavé band).\n4. **The Chain / Necklace**: Princess length for open collars, choker for off-shoulder, or heavy herringbone for streetwear.\n5. **The Bracelet**: Wear on the wrist opposite your timepiece to create visual counterweight.\n• **Rule of Metals**: Never mix rose gold with silver on the same hand; keep all metallic hardware unified.`,
      voiceText: "Coordinate your 5 essential accessories by keeping all metal finishes unified. Wear your bracelet on the opposite wrist of your watch for balanced visual weight.",
      suggestedQuestions: [
        "Can I mix silver and gold jewelry in one outfit?",
        "What watch style is best for everyday versatility?",
        "How do I match shoe leather with belts and bags?"
      ],
      stylingTags: ["5-Piece Accessories", "Jewelry Coordination", "Rule of Metals"]
    };
  }

  // Default response
  return {
    reply: `Welcome to AuraStylist AI! Whether you are preparing for a critical job interview, a luxury wedding, or curating your seasonal wardrobe, I am here to assist.\n\nTell me about:\n• Your upcoming event or occasion\n• Your preferred fit (Slim, Regular, or Oversized)\n• Colors or fabrics you love or want to experiment with\n• What accessories you'd like coordinated (shoes, watch, ring, chain, bracelet)`,
    voiceText: "Welcome to AuraStylist AI. Tell me about your upcoming event, your preferred fit, or ask for interview and wedding outfit styling.",
    suggestedQuestions: [
      "What should I wear to a modern job interview?",
      "Can you style an outfit for a destination wedding?",
      "How do I style a 5-piece accessories collection?"
    ],
    stylingTags: ["AuraStyle AI", "Personal Stylist", "Bespoke Consulting"]
  };
}
