/**
 * Diet plan constants and pure calculation functions for Lucah's therapeutic diet.
 * All functions are pure (no DOM, no side-effects) — safe to use in tests and in the browser.
 */

export const RATION_SIZE_G = 100 as const;
export const RATIONS_PER_DAY = 3 as const;
export const TOTAL_DAILY_G = RATION_SIZE_G * RATIONS_PER_DAY; // 300 g

export type Ingredient = 'meat' | 'quinoa' | 'veggie';
export type CookedIngredient = Exclude<Ingredient, 'veggie'>;

export interface CompositionEntry {
  pct: number;
  label: string;
}

/** Diet composition by ingredient (cooked weight percentages) */
export const COMPOSITION: Record<Ingredient, CompositionEntry> = {
  meat:   { pct: 0.70, label: 'Carne' },
  quinoa: { pct: 0.20, label: 'Quinua' },
  veggie: { pct: 0.10, label: 'Verduras crudas' },
};

/** Cooked grams per ration for each ingredient */
export const PER_RATION: Record<Ingredient, number> = {
  meat:   Math.round(RATION_SIZE_G * COMPOSITION.meat.pct),   // 70 g
  quinoa: Math.round(RATION_SIZE_G * COMPOSITION.quinoa.pct), // 20 g
  veggie: Math.round(RATION_SIZE_G * COMPOSITION.veggie.pct), // 10 g
};

/**
 * Raw-to-cooked weight ratios (cooked / raw).
 *  - Meat loses ~28% water when boiled  →  97 g raw → 70 g cooked
 *  - Quinoa expands ~2.5×               →   8 g raw → 20 g cooked
 */
export const COOKED_PER_RAW: Record<CookedIngredient, number> = {
  meat:   70 / 97,  // ≈ 0.7216
  quinoa: 20 / 8,   // = 2.5
};

/**
 * Returns how many raw grams are needed to obtain `cookedGrams` of a given ingredient.
 */
export function rawGramsNeeded(ingredient: CookedIngredient, cookedGrams: number): number {
  const ratio = COOKED_PER_RAW[ingredient];
  if (ratio === undefined) throw new Error(`Unknown ingredient: "${ingredient}"`);
  if (cookedGrams < 0) throw new Error('cookedGrams must be non-negative');
  return Math.round(cookedGrams / ratio);
}

export interface DailyTotals {
  meat: number;
  quinoa: number;
  veggie: number;
  total: number;
}

/**
 * Returns the total daily amount of each ingredient across all rations.
 */
export function dailyTotals(): DailyTotals {
  return {
    meat:   PER_RATION.meat   * RATIONS_PER_DAY, // 210 g
    quinoa: PER_RATION.quinoa * RATIONS_PER_DAY, // 60 g
    veggie: PER_RATION.veggie * RATIONS_PER_DAY, // 30 g
    total:  TOTAL_DAILY_G,                        // 300 g
  };
}

/**
 * Returns true if the three ration components sum to exactly RATION_SIZE_G.
 */
export function rationComponentsAddUp(): boolean {
  return PER_RATION.meat + PER_RATION.quinoa + PER_RATION.veggie === RATION_SIZE_G;
}

/**
 * Returns true if all composition percentages sum to 1 (100%).
 */
export function compositionSumsToOne(): boolean {
  const total = Object.values(COMPOSITION).reduce((sum, c) => sum + c.pct, 0);
  return Math.abs(total - 1) < 0.0001;
}
