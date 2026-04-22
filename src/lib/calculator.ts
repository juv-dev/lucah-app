export type FoodMode = 'raw' | 'cooked';
export type IngredientKey = 'meat' | 'quinoa' | 'veggie';

export const COOKING_RATIO: Record<'meat' | 'quinoa', number> = {
  meat:   51 / 83,
  quinoa: 20 / 8,
};

export interface IngredientInput {
  meatCooked: number;
  quinoaCooked: number;
  veggieRaw: number;
}

export interface IngredientBreakdown {
  key: IngredientKey;
  label: string;
  icon: string;
  raw: number;
  cooked: number;
  servedRaw: boolean;
}

export interface PortionResult {
  breakdown: IngredientBreakdown[];
  totalRaw: number;
  totalCooked: number;
}

function cookedToRaw(cooked: number, ratio: number): number {
  return Math.round(cooked / ratio);
}

function assertAmount(name: string, v: number): void {
  if (!Number.isFinite(v) || v < 0) {
    throw new Error(`${name} must be a non-negative finite number`);
  }
}

export function calculatePortion(input: IngredientInput): PortionResult {
  assertAmount('meatCooked',   input.meatCooked);
  assertAmount('quinoaCooked', input.quinoaCooked);
  assertAmount('veggieRaw',    input.veggieRaw);

  const meatRaw   = cookedToRaw(input.meatCooked,   COOKING_RATIO.meat);
  const quinoaRaw = cookedToRaw(input.quinoaCooked, COOKING_RATIO.quinoa);

  const breakdown: IngredientBreakdown[] = [
    { key: 'meat',   label: 'Carne',   icon: '🥩', raw: meatRaw,          cooked: input.meatCooked,   servedRaw: false },
    { key: 'quinoa', label: 'Quinua',  icon: '🌾', raw: quinoaRaw,        cooked: input.quinoaCooked, servedRaw: false },
    { key: 'veggie', label: 'Verdura', icon: '🥕', raw: input.veggieRaw,  cooked: input.veggieRaw,    servedRaw: true  },
  ];

  return {
    breakdown,
    totalRaw:    meatRaw + quinoaRaw + input.veggieRaw,
    totalCooked: input.meatCooked + input.quinoaCooked + input.veggieRaw,
  };
}

export function pickTotal(result: PortionResult, mode: FoodMode): number {
  return mode === 'raw' ? result.totalRaw : result.totalCooked;
}
