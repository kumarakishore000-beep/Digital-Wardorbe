// agent-notes: { ctx: "unit tests for curated looks gender segregation (men clothes for men, women for women)", deps: ["src/data/curatedLooksData.js"], state: active, last: "tara@2026-09-30" }

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CURATED_LOOKS,
  getCuratedLooks,
} from '../src/data/curatedLooksData.js';

test('curatedLooksData - catalog contains dedicated male and female curated looks', () => {
  assert.ok(CURATED_LOOKS.length >= 8, `Expected at least 8 curated looks, got ${CURATED_LOOKS.length}`);
  
  const maleLooks = CURATED_LOOKS.filter((l) => l.gender === 'male');
  const femaleLooks = CURATED_LOOKS.filter((l) => l.gender === 'female');

  assert.ok(maleLooks.length >= 4, `Expected at least 4 male looks, got ${maleLooks.length}`);
  assert.ok(femaleLooks.length >= 4, `Expected at least 4 female looks, got ${femaleLooks.length}`);
});

test('curatedLooksData - getCuratedLooks returns ONLY men clothes when gender is male', () => {
  const menLooks = getCuratedLooks('male');
  assert.ok(menLooks.length >= 4);

  for (const look of menLooks) {
    assert.equal(look.gender, 'male', `Expected male look, got ${look.gender} for ${look.id}`);
    
    // Check that items do not contain typical women-only garments
    for (const item of look.items) {
      const lowerName = item.name.toLowerCase();
      assert.ok(!lowerName.includes('gown'), `Male look ${look.id} contains gown: ${item.name}`);
      assert.ok(!lowerName.includes('saree'), `Male look ${look.id} contains saree: ${item.name}`);
      assert.ok(!lowerName.includes('lehenga'), `Male look ${look.id} contains lehenga: ${item.name}`);
      assert.ok(!lowerName.includes('blouse'), `Male look ${look.id} contains blouse: ${item.name}`);
      assert.ok(!lowerName.includes('stiletto'), `Male look ${look.id} contains stiletto: ${item.name}`);
      assert.ok(!lowerName.includes('choli'), `Male look ${look.id} contains choli: ${item.name}`);
    }
  }
});

test('curatedLooksData - getCuratedLooks returns ONLY women clothes when gender is female', () => {
  const womenLooks = getCuratedLooks('female');
  assert.ok(womenLooks.length >= 4);

  for (const look of womenLooks) {
    assert.equal(look.gender, 'female', `Expected female look, got ${look.gender} for ${look.id}`);

    // Check that items do not contain typical men-only suiting or items
    for (const item of look.items) {
      const lowerName = item.name.toLowerCase();
      assert.ok(!lowerName.includes('sherwani'), `Female look ${look.id} contains sherwani: ${item.name}`);
      assert.ok(!lowerName.includes('bandhgala'), `Female look ${look.id} contains bandhgala: ${item.name}`);
      assert.ok(!lowerName.includes('tuxedo'), `Female look ${look.id} contains tuxedo: ${item.name}`);
      assert.ok(!lowerName.includes('oxford brogues'), `Female look ${look.id} contains oxford brogues: ${item.name}`);
    }
  }
});

test('curatedLooksData - each look has complete editorial metadata and pieces', () => {
  for (const look of CURATED_LOOKS) {
    assert.ok(look.id, 'Look must have id');
    assert.ok(look.code, `Look ${look.id} must have code`);
    assert.ok(look.titleSerif, `Look ${look.id} must have titleSerif`);
    assert.ok(look.titleSans, `Look ${look.id} must have titleSans`);
    assert.ok(look.modelImage, `Look ${look.id} must have modelImage`);
    assert.ok(look.tagline, `Look ${look.id} must have tagline`);
    assert.ok(Array.isArray(look.palette) && look.palette.length >= 3, `Look ${look.id} must have palette`);
    assert.ok(Array.isArray(look.items) && look.items.length >= 3, `Look ${look.id} must have items`);
  }
});
