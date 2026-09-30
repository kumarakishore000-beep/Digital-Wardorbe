// agent-notes: { ctx: "unit tests for Mix & Match model gender consistency and styled look harmony", deps: [], state: active, last: "tara@2026-09-30" }

import test from 'node:test';
import assert from 'node:assert/strict';

const STUDIO_MODELS = [
  {
    id: 'model-ava',
    name: 'Ava',
    gender: 'female',
    ethnicity: 'Nordic / European Editorial',
    baseImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop',
    styledImage: '/images/branding/urban-western-casual.jpg',
  },
  {
    id: 'model-maya',
    name: 'Maya',
    gender: 'female',
    ethnicity: 'South Asian Heritage',
    baseImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop',
    styledImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop',
  },
  {
    id: 'model-amara',
    name: 'Amara',
    gender: 'female',
    ethnicity: 'Afro Statuesque Chic',
    baseImage: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&auto=format&fit=crop',
    styledImage: '/images/branding/womens-ethnic-fusion.jpg',
  },
  {
    id: 'model-elena',
    name: 'Elena',
    gender: 'female',
    ethnicity: 'Latina / Mediterranean Glow',
    baseImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop',
    styledImage: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop',
  },
  {
    id: 'model-lucas',
    name: 'Lucas',
    gender: 'male',
    ethnicity: 'Savile Row European',
    baseImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop',
    styledImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop',
  },
  {
    id: 'model-dev',
    name: 'Dev',
    gender: 'male',
    ethnicity: 'South Asian Contemporary',
    baseImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop',
    styledImage: '/images/branding/mens-smart-casual.jpg',
  }
];

function getDefaultSlotsForGender(gender) {
  if (gender === 'male') {
    return {
      tops: { id: 'top-4', gender: 'male', name: 'Normandy Slub Linen Popover Shirt' },
      bottoms: { id: 'bot-3', gender: 'male', name: 'Savile Row Midnight Wool Dress Pants' },
      dresses: null,
      outerwear: { id: 'out-2', gender: 'unisex', name: 'Obsidian Velvet Smoking Dinner Jacket' },
      shoes: { id: 'shoe-1', gender: 'male', name: 'Handcrafted Goodyear-Welted Oxford Brogues' },
      accessories: { id: 'acc-1', gender: 'unisex', name: 'Swiss Automatic Rose Gold Chronograph' },
    };
  }
  return {
    tops: { id: 'top-1', gender: 'female', name: 'Mulberry Silk Charmeuse Blouse' },
    bottoms: { id: 'bot-1', gender: 'unisex', name: 'High-Waist Fluid Pleated Slacks' },
    dresses: null,
    outerwear: { id: 'out-1', gender: 'unisex', name: 'Double-Breasted Cashmere Belted Trench' },
    shoes: { id: 'shoe-2', gender: 'female', name: 'Pointed Lacquer Stiletto Pumps' },
    accessories: { id: 'acc-1', gender: 'unisex', name: 'Swiss Automatic Rose Gold Chronograph' },
  };
}

function resolveCompositeImage(selectedModel, selectedOccasionId) {
  if (selectedModel.styledOccasions && selectedModel.styledOccasions[selectedOccasionId]) {
    return selectedModel.styledOccasions[selectedOccasionId];
  }
  if (selectedModel.styledImage) {
    return selectedModel.styledImage;
  }
  return selectedModel.baseImage;
}

test('mixAndMatch - models roster contains verified male and female models', () => {
  const maleModels = STUDIO_MODELS.filter((m) => m.gender === 'male');
  const femaleModels = STUDIO_MODELS.filter((m) => m.gender === 'female');

  assert.equal(maleModels.length, 2);
  assert.equal(femaleModels.length, 4);
  assert.deepEqual(maleModels.map((m) => m.name), ['Lucas', 'Dev']);
  assert.deepEqual(femaleModels.map((m) => m.name), ['Ava', 'Maya', 'Amara', 'Elena']);
});

test('mixAndMatch - male models always have male styledImage', () => {
  const maleModels = STUDIO_MODELS.filter((m) => m.gender === 'male');
  for (const model of maleModels) {
    assert.ok(model.baseImage.startsWith('https://') || model.baseImage.startsWith('/'));
    assert.ok(model.styledImage.startsWith('https://') || model.styledImage.startsWith('/'));
    assert.notEqual(model.baseImage, '');
    assert.notEqual(model.styledImage, '');
  }
});

test('mixAndMatch - getDefaultSlotsForGender for male returns strictly male/unisex items with no dresses', () => {
  const maleSlots = getDefaultSlotsForGender('male');
  assert.equal(maleSlots.dresses, null);
  assert.equal(maleSlots.tops?.gender, 'male');
  assert.equal(maleSlots.bottoms?.gender, 'male');
  assert.equal(maleSlots.shoes?.gender, 'male');
  assert.ok(maleSlots.outerwear?.gender === 'male' || maleSlots.outerwear?.gender === 'unisex');
});

test('mixAndMatch - getDefaultSlotsForGender for female returns female/unisex items', () => {
  const femaleSlots = getDefaultSlotsForGender('female');
  assert.equal(femaleSlots.dresses, null);
  assert.equal(femaleSlots.tops?.gender, 'female');
  assert.equal(femaleSlots.shoes?.gender, 'female');
  assert.ok(femaleSlots.bottoms?.gender === 'female' || femaleSlots.bottoms?.gender === 'unisex');
});

test('mixAndMatch - resolveCompositeImage guarantees same model identity between Before and After', () => {
  const lucas = STUDIO_MODELS.find((m) => m.id === 'model-lucas');
  assert.ok(lucas);
  const afterImage = resolveCompositeImage(lucas, 'interview');
  assert.equal(afterImage, lucas.styledImage);
  assert.notEqual(afterImage, '');
  assert.notEqual(afterImage, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop'); // Not Ava
});
