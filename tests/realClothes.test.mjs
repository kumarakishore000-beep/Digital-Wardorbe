// agent-notes: { ctx: "unit tests for real clothes and real model color combination catalog", deps: ["src/data/realClothesOptions.ts"], state: active, last: "tara@2026-09-09" }

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  REAL_CLOTHES_OPTIONS,
  getRealClothesOptions,
  getRealClothesById,
} from '../src/data/realClothesOptions.js';

test('realClothesOptions - catalog contains rich real clothes options', () => {
  assert.ok(REAL_CLOTHES_OPTIONS.length >= 8, `Expected at least 8 options, got ${REAL_CLOTHES_OPTIONS.length}`);
  
  const femaleOptions = REAL_CLOTHES_OPTIONS.filter((o) => o.gender === 'female');
  const maleOptions = REAL_CLOTHES_OPTIONS.filter((o) => o.gender === 'male');

  assert.ok(femaleOptions.length >= 4, `Expected at least 4 female options, got ${femaleOptions.length}`);
  assert.ok(maleOptions.length >= 4, `Expected at least 4 male options, got ${maleOptions.length}`);
});

test('realClothesOptions - all outfits have valid real images (no cartoon or placeholders)', () => {
  for (const option of REAL_CLOTHES_OPTIONS) {
    assert.ok(option.imageUrl, `Option ${option.id} is missing imageUrl`);
    assert.ok(
      option.imageUrl.startsWith('https://images.unsplash.com') || option.imageUrl.startsWith('/images/branding/'),
      `Option ${option.id} has invalid imageUrl: ${option.imageUrl}`
    );
    assert.ok(!option.imageUrl.includes('placeholder'), `Option ${option.id} contains placeholder`);
    assert.ok(!option.imageUrl.includes('cartoon'), `Option ${option.id} contains cartoon reference`);
  }
});

test('realClothesOptions - all outfits have valid color palettes with hex codes', () => {
  const hexRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

  for (const option of REAL_CLOTHES_OPTIONS) {
    assert.ok(option.colorPalette.length >= 3, `Option ${option.id} should have at least 3 color swatches`);
    
    for (const swatch of option.colorPalette) {
      assert.ok(swatch.name, `Swatch in ${option.id} missing name`);
      assert.match(swatch.hex, hexRegex, `Invalid hex ${swatch.hex} in ${option.id}`);
      assert.ok(swatch.description, `Swatch in ${option.id} missing description`);
      assert.ok(
        ['primary', 'secondary', 'accent', 'neutral'].includes(swatch.role),
        `Invalid role ${swatch.role} in ${option.id}`
      );
    }
  }
});

test('realClothesOptions - all outfits have detailed real garment pieces', () => {
  for (const option of REAL_CLOTHES_OPTIONS) {
    assert.ok(option.pieces.length >= 3, `Option ${option.id} should have at least 3 garment pieces`);
    
    for (const piece of option.pieces) {
      assert.ok(piece.name, `Piece in ${option.id} missing name`);
      assert.ok(piece.fabric, `Piece in ${option.id} missing fabric description`);
      assert.ok(piece.colorName, `Piece in ${option.id} missing colorName`);
      assert.ok(piece.details, `Piece in ${option.id} missing tailoring details`);
    }
  }
});

test('realClothesOptions - getRealClothesOptions filters and prioritizes accurately', () => {
  // Filter by gender female
  const femaleList = getRealClothesOptions('female');
  assert.ok(femaleList.every((o) => o.gender === 'female' || o.gender === 'unisex'));

  // Filter by gender male
  const maleList = getRealClothesOptions('male');
  assert.ok(maleList.every((o) => o.gender === 'male' || o.gender === 'unisex'));

  // Filter by interview occasion
  const interviewList = getRealClothesOptions('female', 'Job Interview & Executive Assessment');
  assert.ok(interviewList.length > 0);
  assert.ok(interviewList.some((o) => o.occasionCategory === 'interview'));

  // Filter by preferred color 'emerald'
  const emeraldList = getRealClothesOptions('female', undefined, 'emerald');
  assert.ok(emeraldList.length > 0);
  assert.ok(
    emeraldList[0].colorPalette.some((c) => c.name.toLowerCase().includes('emerald') || c.hex === '#064E3B')
  );
});

test('realClothesOptions - getRealClothesById retrieves exact option', () => {
  const opt = getRealClothesById('fem-real-1');
  assert.ok(opt);
  assert.equal(opt.id, 'fem-real-1');
  assert.equal(opt.model.name, 'Maya Patel');

  const menOpt = getRealClothesById('men-real-1');
  assert.ok(menOpt);
  assert.equal(menOpt.id, 'men-real-1');
  assert.equal(menOpt.model.name, 'Lucas Sterling');
});
