import { describe, it, expect } from 'vitest';
import {
  FORTNIGHT_DAYS,
  ITEMS,
  itemPrice,
  totalFortnight,
  dailyCost,
  perRationCost,
  monthlyCost,
} from '../src/lib/shopping.ts';

describe('Shopping constants', () => {
  it('fortnight is 14 days', () => {
    expect(FORTNIGHT_DAYS).toBe(14);
  });

  it('has carne, quinua and verduras', () => {
    expect(Object.keys(ITEMS)).toEqual(expect.arrayContaining(['carne', 'quinua', 'verduras']));
  });

  it('carne is 4.2 kg at S/17.00/kg', () => {
    expect(ITEMS.carne.kg).toBe(4.2);
    expect(ITEMS.carne.pricePerKg).toBe(17.00);
  });

  it('quinua is 0.5 kg at S/12.79/kg', () => {
    expect(ITEMS.quinua.kg).toBe(0.5);
    expect(ITEMS.quinua.pricePerKg).toBe(12.79);
  });

  it('verduras is 0.5 kg at S/2.50/kg', () => {
    expect(ITEMS.verduras.kg).toBe(0.5);
    expect(ITEMS.verduras.pricePerKg).toBe(2.50);
  });
});

describe('itemPrice()', () => {
  it('carne: 4.2 kg × S/17 = S/71.40', () => {
    expect(itemPrice(ITEMS.carne)).toBe(71.40);
  });

  it('quinua: 0.5 kg × S/12.79 = S/6.40', () => {
    expect(itemPrice(ITEMS.quinua)).toBe(6.40);
  });

  it('verduras: 0.5 kg × S/2.50 = S/1.25', () => {
    expect(itemPrice(ITEMS.verduras)).toBe(1.25);
  });

  it('returns 0 for a zero-kg item', () => {
    expect(itemPrice({ name: 'test', kg: 0, pricePerKg: 10 })).toBe(0);
  });
});

describe('totalFortnight()', () => {
  it('total is S/79.05 (71.40 + 6.40 + 1.25)', () => {
    expect(totalFortnight()).toBeCloseTo(79.05, 2);
  });
});

describe('dailyCost()', () => {
  it('calculates cost per day from fortnightly total', () => {
    const total = totalFortnight(); // 79.05
    const expected = Math.round((total / 14) * 100) / 100;
    expect(dailyCost()).toBe(expected);
  });

  it('accepts a custom fortnightly total', () => {
    expect(dailyCost(140)).toBe(10.00); // 140 / 14 = 10
  });
});

describe('perRationCost()', () => {
  it('calculates cost per ration from daily cost', () => {
    const daily = dailyCost();
    const expected = Math.round((daily / 3) * 100) / 100;
    expect(perRationCost()).toBe(expected);
  });

  it('accepts a custom daily cost', () => {
    expect(perRationCost(3.00)).toBe(1.00); // 3 / 3 = 1
  });
});

describe('monthlyCost()', () => {
  it('monthly is 2 × fortnightly total', () => {
    const fortnight = totalFortnight();
    expect(monthlyCost()).toBeCloseTo(fortnight * 2, 2);
  });

  it('accepts a custom fortnightly total', () => {
    expect(monthlyCost(50)).toBe(100);
  });
});
