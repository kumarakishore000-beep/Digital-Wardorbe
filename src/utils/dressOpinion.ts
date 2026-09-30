// agent-notes: { ctx: "user dress suggestion and opinion evaluation utility", deps: [], state: active, last: "sato@2026-09-30" }

export type OpinionPresetId = 'love' | 'good' | 'color' | 'formal' | 'casual';

export interface OpinionPreset {
  id: OpinionPresetId;
  label: string;
  icon: string;
  description: string;
}

export const OPINION_PRESETS: OpinionPreset[] = [
  {
    id: 'love',
    label: 'Love the Style',
    icon: '🔥',
    description: 'Perfect aesthetic balance, silhouette and color harmony.',
  },
  {
    id: 'good',
    label: 'Good Match',
    icon: '👌',
    description: 'Strong potential with minor personal styling preference.',
  },
  {
    id: 'color',
    label: 'Change Color Palette',
    icon: '🎨',
    description: 'Prefer alternative hue balance, contrast or metallic undertones.',
  },
  {
    id: 'formal',
    label: 'Too Formal / Relax It',
    icon: '👔',
    description: 'Desire a more relaxed, casual or effortless everyday feel.',
  },
  {
    id: 'casual',
    label: 'Too Casual / Elevate It',
    icon: '👞',
    description: 'Desire sharper tailoring, luxurious textures or elevated accessories.',
  },
];

export interface DressOpinionInput {
  dressId: string;
  dressTitle: string;
  gender: string;
  rating: OpinionPresetId;
  feedback?: string;
}

export interface DressOpinionResult {
  id: string;
  dressId: string;
  dressTitle: string;
  gender: string;
  rating: OpinionPresetId;
  feedback: string;
  stylistVerdict: string;
  actionableAdvice: string;
  adjustedScore: number;
  timestamp: string;
}

const OPINIONS_STORAGE_KEY = 'stylematch-dress-opinions';

/**
 * Evaluate user opinion on a dress and provide tailored styling intelligence.
 */
export function evaluateDressOpinion(input: DressOpinionInput): DressOpinionResult {
  const { dressId, dressTitle, gender, rating, feedback = '' } = input;
  const isMale = gender === 'male';
  const cleanFeedback = feedback.trim();
  const id = `op-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  let stylistVerdict = '';
  let actionableAdvice = '';
  let adjustedScore = 90;

  switch (rating) {
    case 'formal':
      stylistVerdict = `Understood! You want a more relaxed, approachable aura for "${dressTitle}".`;
      actionableAdvice = isMale
        ? 'Casualize with ease: unbutton the top collar button, swap stiff leather shoes for clean minimalist white sneakers, and consider ditching the tie or rolling the sleeves for effortless Italian sprezzatura.'
        : 'Casualize with ease: swap formal high heels for clean platform court sneakers or pointed leather flats, drape the jacket casually over the shoulders, or layer over a relaxed organic ribbed t-shirt.';
      adjustedScore = 86;
      break;

    case 'casual':
      stylistVerdict = `Sharp eye! You want to elevate "${dressTitle}" for higher-impact occasions.`;
      actionableAdvice = isMale
        ? 'Elevate with structure: switch casual sneakers to hand-burnished leather Oxford brogues or Chelsea boots, add an unlined tailored wool blazer, and clip in a polished steel dress watch.'
        : 'Elevate with structure: switch casual footwear to pointed-toe 75mm stilettos or block heels, add a structured leather clutch, and frame the collarbone with delicate layered gold jewelry.';
      adjustedScore = 92;
      break;

    case 'color':
      stylistVerdict = `Excellent harmonic critique! Color resonance is deeply personal and dependent on skin undertones.`;
      actionableAdvice = cleanFeedback
        ? `Palette adaptation: To honor your note ("${cleanFeedback}"), swap primary garments into your preferred color tone while keeping neutrals (chalk ivory, obsidian slate) in the footwear and secondary layers to retain high-fashion contrast.`
        : 'Palette adaptation: If the primary color feels too dominant, introduce a monochromatic tint or switch to complementary earth tones (terracotta, desert sand, sage olive) for a softer, organic presence.';
      adjustedScore = 88;
      break;

    case 'good':
      stylistVerdict = `A very harmonious foundation! "${dressTitle}" naturally flatters the silhouette.`;
      actionableAdvice = cleanFeedback
        ? `Fine-tuning: Incorporating "${cleanFeedback}" into your styling routine will lock in your signature look with polished confidence.`
        : 'Fine-tuning: Focus on micro-details: ensure cuff lengths show exactly 0.5 inches of shirt or sleeve, and match metals across watch bezels, belt hardware, and jewelry.';
      adjustedScore = 93;
      break;

    case 'love':
    default:
      stylistVerdict = `Brilliant styling instinct! "${dressTitle}" exudes timeless poise and aesthetic harmony.`;
      actionableAdvice = isMale
        ? 'Walk in with commanding upright posture, squared shoulders, and relaxed hands. Let the tailored cut speak for your authority and taste.'
        : 'Walk in with statuesque grace: allow the fluid fabric drape to catch natural ambient lighting and pair with swept-back hair to accentuate the neckline.';
      adjustedScore = 97;
      break;
  }

  // Factor user feedback into advice if specific nuances are detected
  if (cleanFeedback) {
    const lower = cleanFeedback.toLowerCase();
    if (lower.includes('shoe') || lower.includes('footwear') || lower.includes('sneaker') || lower.includes('boot')) {
      actionableAdvice += ' Footwear note: prioritize memory-cushioned soles that honor your arch support while preserving clean silhouette lines.';
    } else if (lower.includes('summer') || lower.includes('hot') || lower.includes('breathable')) {
      actionableAdvice += ' Climate note: seek 100% open-weave flax linen or lightweight silk georgette with high thermal breathability.';
    }
  }

  return {
    id,
    dressId,
    dressTitle,
    gender,
    rating,
    feedback: cleanFeedback || OPINION_PRESETS.find((p) => p.id === rating)?.label || '',
    stylistVerdict,
    actionableAdvice,
    adjustedScore,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Format a dress opinion into a user-friendly summary card string.
 */
export function formatDressOpinionSummary(opinion: DressOpinionResult): string {
  return `👗 ${opinion.dressTitle} (${opinion.gender.toUpperCase()})\n` +
    `• Your Opinion: ${opinion.feedback} [Score: ${opinion.adjustedScore}/100]\n` +
    `• Stylist Note: ${opinion.stylistVerdict}\n` +
    `• Recommendation: ${opinion.actionableAdvice}`;
}

/**
 * Load saved dress opinions from localStorage.
 */
export function getSavedDressOpinions(): Record<string, DressOpinionResult> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(OPINIONS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Save user opinion for a dress into localStorage.
 */
export function saveDressOpinion(opinion: DressOpinionResult): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getSavedDressOpinions();
    current[opinion.dressId] = opinion;
    localStorage.setItem(OPINIONS_STORAGE_KEY, JSON.stringify(current));
  } catch (err) {
    console.warn('Failed to save dress opinion to localStorage:', err);
  }
}
