export const RATION_SIZE_G = 100 as const;
export const RATIONS_PER_DAY = 3 as const;
export const TOTAL_DAILY_G = RATION_SIZE_G * RATIONS_PER_DAY; // 300 g

export type Ingredient = 'meat' | 'quinoa' | 'veggie';
export type CookedIngredient = Exclude<Ingredient, 'veggie'>;

export interface CompositionEntry {
  pct: number;
  label: string;
}

export const COMPOSITION: Record<Ingredient, CompositionEntry> = {
  meat:   { pct: 0.70, label: 'Carne' },
  quinoa: { pct: 0.20, label: 'Quinua' },
  veggie: { pct: 0.10, label: 'Verduras crudas' },
};

export const PER_RATION: Record<Ingredient, number> = {
  meat:   Math.round(RATION_SIZE_G * COMPOSITION.meat.pct),
  quinoa: Math.round(RATION_SIZE_G * COMPOSITION.quinoa.pct),
  veggie: Math.round(RATION_SIZE_G * COMPOSITION.veggie.pct),
};

export const COOKED_PER_RAW: Record<CookedIngredient, number> = {
  meat:   70 / 97,  // ≈ 0.7216
  quinoa: 20 / 8,   // = 2.5
};

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


export function dailyTotals(): DailyTotals {
  return {
    meat:   PER_RATION.meat   * RATIONS_PER_DAY,
    quinoa: PER_RATION.quinoa * RATIONS_PER_DAY,
    veggie: PER_RATION.veggie * RATIONS_PER_DAY,
    total:  TOTAL_DAILY_G,
  };
}

export function rationComponentsAddUp(): boolean {
  return PER_RATION.meat + PER_RATION.quinoa + PER_RATION.veggie === RATION_SIZE_G;
}

export function compositionSumsToOne(): boolean {
  const total = Object.values(COMPOSITION).reduce((sum, c) => sum + c.pct, 0);
  return Math.abs(total - 1) < 0.0001;
}
