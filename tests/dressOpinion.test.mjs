// agent-notes: { ctx: "unit tests for user dress suggestion and opinion evaluation", deps: ["src/utils/dressOpinion.js"], state: active, last: "tara@2026-09-30" }

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateDressOpinion,
  OPINION_PRESETS,
  formatDressOpinionSummary,
} from '../src/utils/dressOpinion.js';

test('dressOpinion - presets provide clear user sentiment options', () => {
  assert.ok(OPINION_PRESETS.length >= 4, `Expected at least 4 presets, got ${OPINION_PRESETS.length}`);
  const ids = OPINION_PRESETS.map((p) => p.id);
  assert.ok(ids.includes('love'));
  assert.ok(ids.includes('formal'));
  assert.ok(ids.includes('casual'));
  assert.ok(ids.includes('color'));
});

test('dressOpinion - evaluateDressOpinion handles "too formal" feedback with casual styling adjustments', () => {
  const result = evaluateDressOpinion({
    dressId: 'men-look-02',
    dressTitle: 'Savile Row Power Suit',
    gender: 'male',
    rating: 'formal',
    feedback: 'A bit too stiff for a casual tech meet',
  });

  assert.ok(result.id, 'Opinion result must have an ID');
  assert.equal(result.rating, 'formal');
  assert.ok(result.stylistVerdict.length > 10, 'Must have detailed stylist verdict');
  assert.ok(
    result.actionableAdvice.toLowerCase().includes('sneaker') ||
    result.actionableAdvice.toLowerCase().includes('unbutton') ||
    result.actionableAdvice.toLowerCase().includes('casual') ||
    result.actionableAdvice.toLowerCase().includes('t-shirt') ||
    result.actionableAdvice.toLowerCase().includes('knit'),
    `Expected casualizing advice, got: ${result.actionableAdvice}`
  );
  assert.ok(result.adjustedScore >= 70 && result.adjustedScore <= 100);
});

test('dressOpinion - evaluateDressOpinion handles "love" feedback with aesthetic reinforcement', () => {
  const result = evaluateDressOpinion({
    dressId: 'fem-look-03',
    dressTitle: 'The Mulberry Liquid Silk Gala Gown',
    gender: 'female',
    rating: 'love',
    feedback: 'Absolutely stunning drape and jewel tones!',
  });

  assert.equal(result.rating, 'love');
  assert.ok(result.stylistVerdict.toLowerCase().includes('flattering') || result.stylistVerdict.toLowerCase().includes('elegance') || result.stylistVerdict.toLowerCase().includes('harmony'));
  assert.ok(result.actionableAdvice.length > 10);
  assert.ok(result.adjustedScore >= 90);
});

test('dressOpinion - evaluateDressOpinion handles color preference adjustments', () => {
  const result = evaluateDressOpinion({
    dressId: 'fem-look-04',
    dressTitle: 'The Royal Banarasi Katan Silk Saree',
    gender: 'female',
    rating: 'color',
    feedback: 'I would prefer a sapphire blue or silver zari option',
  });

  assert.equal(result.rating, 'color');
  assert.ok(
    result.actionableAdvice.toLowerCase().includes('palette') ||
    result.actionableAdvice.toLowerCase().includes('color') ||
    result.actionableAdvice.toLowerCase().includes('tone') ||
    result.actionableAdvice.toLowerCase().includes('shade'),
    `Expected color advice, got: ${result.actionableAdvice}`
  );
});

test('dressOpinion - formatDressOpinionSummary creates clean human-readable summary', () => {
  const opinion = evaluateDressOpinion({
    dressId: 'men-look-01',
    dressTitle: 'Smart Casual Utility Overshirt',
    gender: 'male',
    rating: 'good',
    feedback: 'Looks comfortable and modern',
  });

  const summary = formatDressOpinionSummary(opinion);
  assert.ok(summary.includes('Smart Casual Utility Overshirt'));
  assert.ok(summary.includes('Looks comfortable and modern'));
  assert.ok(summary.includes('Stylist Note:'));
});
