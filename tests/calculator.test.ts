import { describe, it, expect } from 'vitest';
import {
  calculatePortion,
  pickTotal,
  COOKING_RATIO,
  type PortionResult,
} from '../src/lib/calculator';

describe('calculatePortion', () => {
  it('meat: raw is greater than cooked (loses water)', () => {
    const r = calculatePortion({ meatCooked: 60, quinoaCooked: 0, veggieRaw: 0 });
    const meat = r.breakdown.find(b => b.key === 'meat')!;
    expect(meat.raw).toBeGreaterThan(meat.cooked);
    expect(meat.raw).toBe(Math.round(60 / COOKING_RATIO.meat));
  });

  it('quinoa: raw is less than cooked (absorbs water, ratio 2.5)', () => {
    const r = calculatePortion({ meatCooked: 0, quinoaCooked: 40, veggieRaw: 0 });
    const quinoa = r.breakdown.find(b => b.key === 'quinoa')!;
    expect(quinoa.raw).toBeLessThan(quinoa.cooked);
    expect(quinoa.raw).toBe(16);
  });

  it('veggie: raw equals cooked, flagged as servedRaw', () => {
    const r = calculatePortion({ meatCooked: 0, quinoaCooked: 0, veggieRaw: 30 });
    const v = r.breakdown.find(b => b.key === 'veggie')!;
    expect(v.raw).toBe(30);
    expect(v.cooked).toBe(30);
    expect(v.servedRaw).toBe(true);
  });

  it('totals sum each ingredient correctly', () => {
    const r = calculatePortion({ meatCooked: 60, quinoaCooked: 40, veggieRaw: 30 });
    expect(r.totalCooked).toBe(130);
    const expectedRaw =
      Math.round(60 / COOKING_RATIO.meat) +
      Math.round(40 / COOKING_RATIO.quinoa) +
      30;
    expect(r.totalRaw).toBe(expectedRaw);
  });

  it('emits breakdown in meat → quinoa → veggie order', () => {
    const r = calculatePortion({ meatCooked: 10, quinoaCooked: 10, veggieRaw: 10 });
    expect(r.breakdown.map(b => b.key)).toEqual(['meat', 'quinoa', 'veggie']);
  });

  it('rejects negative and non-finite amounts', () => {
    expect(() => calculatePortion({ meatCooked: -1, quinoaCooked: 0, veggieRaw: 0 })).toThrow();
    expect(() => calculatePortion({ meatCooked: NaN, quinoaCooked: 0, veggieRaw: 0 })).toThrow();
    expect(() => calculatePortion({ meatCooked: 0, quinoaCooked: Infinity, veggieRaw: 0 })).toThrow();
  });

  it('accepts all zeros (empty plate)', () => {
    const r = calculatePortion({ meatCooked: 0, quinoaCooked: 0, veggieRaw: 0 });
    expect(r.totalCooked).toBe(0);
    expect(r.totalRaw).toBe(0);
  });
});

describe('pickTotal', () => {
  const r: PortionResult = { breakdown: [], totalRaw: 129, totalCooked: 130 };
  it('picks cooked total in cooked mode', () => expect(pickTotal(r, 'cooked')).toBe(130));
  it('picks raw total in raw mode',     () => expect(pickTotal(r, 'raw')).toBe(129));
});
