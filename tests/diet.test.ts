import { describe, it, expect } from 'vitest';
import {
  RATION_SIZE_G,
  RATIONS_PER_DAY,
  TOTAL_DAILY_G,
  COMPOSITION,
  PER_RATION,
  COOKED_PER_RAW,
  rawGramsNeeded,
  dailyTotals,
  rationComponentsAddUp,
  compositionSumsToOne,
} from '../src/lib/diet.ts';

describe('Diet constants', () => {
  it('ration size is 100 g', () => {
    expect(RATION_SIZE_G).toBe(100);
  });

  it('3 rations per day', () => {
    expect(RATIONS_PER_DAY).toBe(3);
  });

  it('total daily is 300 g (3 × 100)', () => {
    expect(TOTAL_DAILY_G).toBe(300);
  });

  it('composition includes meat, quinoa and veggie', () => {
    expect(Object.keys(COMPOSITION)).toEqual(expect.arrayContaining(['meat', 'quinoa', 'veggie']));
  });

  it('meat is 70% of each ration', () => {
    expect(COMPOSITION.meat.pct).toBe(0.70);
  });

  it('quinoa is 20% of each ration', () => {
    expect(COMPOSITION.quinoa.pct).toBe(0.20);
  });

  it('veggies are 10% of each ration', () => {
    expect(COMPOSITION.veggie.pct).toBe(0.10);
  });
});

describe('PER_RATION cooked grams', () => {
  it('meat: 70 g cooked per ration', () => {
    expect(PER_RATION.meat).toBe(70);
  });

  it('quinoa: 20 g cooked per ration', () => {
    expect(PER_RATION.quinoa).toBe(20);
  });

  it('veggies: 10 g per ration', () => {
    expect(PER_RATION.veggie).toBe(10);
  });

  it('components sum to exactly 100 g', () => {
    expect(rationComponentsAddUp()).toBe(true);
  });
});

describe('compositionSumsToOne()', () => {
  it('all percentages add up to 100%', () => {
    expect(compositionSumsToOne()).toBe(true);
  });
});

describe('COOKED_PER_RAW ratios', () => {
  it('meat ratio: 70 cooked / 97 raw', () => {
    expect(COOKED_PER_RAW.meat).toBeCloseTo(70 / 97, 5);
  });

  it('quinoa expands 2.5× when cooked', () => {
    expect(COOKED_PER_RAW.quinoa).toBe(2.5);
  });
});

describe('rawGramsNeeded()', () => {
  it('meat: ~97 g raw to get 70 g cooked', () => {
    expect(rawGramsNeeded('meat', 70)).toBe(97);
  });

  it('quinoa: 8 g raw to get 20 g cooked', () => {
    expect(rawGramsNeeded('quinoa', 20)).toBe(8);
  });

  it('returns 0 when cookedGrams is 0', () => {
    expect(rawGramsNeeded('meat', 0)).toBe(0);
  });

  it('scales proportionally — 3 rations of 70 g meat need ~291 g raw', () => {
    expect(rawGramsNeeded('meat', 210)).toBe(291);
  });

  it('throws for negative cookedGrams', () => {
    expect(() => rawGramsNeeded('meat', -1)).toThrow('non-negative');
  });
});

describe('dailyTotals()', () => {
  it('meat: 210 g/day (70 g × 3 rations)', () => {
    expect(dailyTotals().meat).toBe(210);
  });

  it('quinoa: 60 g/day (20 g × 3 rations)', () => {
    expect(dailyTotals().quinoa).toBe(60);
  });

  it('veggies: 30 g/day (10 g × 3 rations)', () => {
    expect(dailyTotals().veggie).toBe(30);
  });

  it('total: 300 g/day', () => {
    expect(dailyTotals().total).toBe(300);
  });
});
