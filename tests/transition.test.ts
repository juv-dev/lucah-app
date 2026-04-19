import { describe, it, expect } from 'vitest';
import {
  TOTAL_G,
  TRANSITION_PLAN,
  newFoodGrams,
  oldFoodGrams,
  allDaysAddUp,
} from '../src/lib/transition.ts';

describe('Transition constants', () => {
  it('total daily grams is 300', () => {
    expect(TOTAL_G).toBe(300);
  });

  it('plan has exactly 3 days', () => {
    expect(Object.keys(TRANSITION_PLAN)).toHaveLength(3);
  });

  it('day 1 is 30% new / 70% old', () => {
    expect(TRANSITION_PLAN[1].newPct).toBe(0.30);
    expect(TRANSITION_PLAN[1].oldPct).toBe(0.70);
  });

  it('day 2 is 60% new / 40% old', () => {
    expect(TRANSITION_PLAN[2].newPct).toBe(0.60);
    expect(TRANSITION_PLAN[2].oldPct).toBe(0.40);
  });

  it('day 3 is 100% new / 0% old', () => {
    expect(TRANSITION_PLAN[3].newPct).toBe(1.00);
    expect(TRANSITION_PLAN[3].oldPct).toBe(0.00);
  });

  it('each day percentages sum to 100%', () => {
    for (const entry of Object.values(TRANSITION_PLAN)) {
      expect(entry.newPct + entry.oldPct).toBeCloseTo(1, 5);
    }
  });
});

describe('newFoodGrams()', () => {
  it('day 1: 90 g new food (30% of 300)', () => {
    expect(newFoodGrams(1)).toBe(90);
  });

  it('day 2: 180 g new food (60% of 300)', () => {
    expect(newFoodGrams(2)).toBe(180);
  });

  it('day 3: 300 g new food (100% of 300)', () => {
    expect(newFoodGrams(3)).toBe(300);
  });

  it('accepts a custom total', () => {
    expect(newFoodGrams(1, 100)).toBe(30); // 30% of 100
  });
});

describe('oldFoodGrams()', () => {
  it('day 1: 210 g old food (70% of 300)', () => {
    expect(oldFoodGrams(1)).toBe(210);
  });

  it('day 2: 120 g old food (40% of 300)', () => {
    expect(oldFoodGrams(2)).toBe(120);
  });

  it('day 3: 0 g old food (0% of 300)', () => {
    expect(oldFoodGrams(3)).toBe(0);
  });

  it('new + old always equals total for each day', () => {
    ([1, 2, 3] as const).forEach(day => {
      expect(newFoodGrams(day) + oldFoodGrams(day)).toBe(TOTAL_G);
    });
  });
});

describe('allDaysAddUp()', () => {
  it('returns true for the default 300 g total', () => {
    expect(allDaysAddUp()).toBe(true);
  });

  it('returns true for any consistent total', () => {
    expect(allDaysAddUp(200)).toBe(true);
  });
});

describe('error handling', () => {
  it('newFoodGrams throws for invalid day', () => {
    expect(() => newFoodGrams(99 as any)).toThrow('Invalid transition day');
  });

  it('oldFoodGrams throws for invalid day', () => {
    expect(() => oldFoodGrams(0 as any)).toThrow('Invalid transition day');
  });
});
