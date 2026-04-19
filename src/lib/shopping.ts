/**
 * Shopping list items and cost calculations for Lucah's fortnightly diet purchase.
 * All functions are pure — no DOM, no side-effects.
 */

export const FORTNIGHT_DAYS = 14 as const;
export const RATIONS_PER_DAY = 3 as const;

export interface ShoppingItem {
  name: string;
  kg: number;
  pricePerKg: number;
}

export type ShoppingItemKey = 'carne' | 'quinua' | 'verduras';

/** Shopping items with quantities and Makro prices */
export const ITEMS: Record<ShoppingItemKey, ShoppingItem> = {
  carne: {
    name: 'Carne magra (aguja / pecho de res)',
    kg: 4.2,
    pricePerKg: 17.00,
  },
  quinua: {
    name: 'Quinua blanca ARO (bolsa 1 kg)',
    kg: 0.5,
    pricePerKg: 12.79,
  },
  verduras: {
    name: 'Verduras crudas variadas',
    kg: 0.5,
    pricePerKg: 2.50,
  },
};

/**
 * Calculates the cost of a single shopping item, rounded to 2 decimals.
 */
export function itemPrice(item: ShoppingItem): number {
  return Math.round(item.kg * item.pricePerKg * 100) / 100;
}

/**
 * Calculates the total fortnightly shopping cost.
 */
export function totalFortnight(): number {
  return Object.values(ITEMS).reduce((sum, item) => sum + itemPrice(item), 0);
}

/**
 * Calculates the average daily cost (rounded to 2 decimals).
 */
export function dailyCost(forthnightTotal: number = totalFortnight()): number {
  return Math.round((forthnightTotal / FORTNIGHT_DAYS) * 100) / 100;
}

/**
 * Calculates the cost per ration (3 rations per day), rounded to 2 decimals.
 */
export function perRationCost(daily: number = dailyCost()): number {
  return Math.round((daily / RATIONS_PER_DAY) * 100) / 100;
}

/**
 * Estimates the monthly cost (two fortnights), rounded to 2 decimals.
 */
export function monthlyCost(forthnightTotal: number = totalFortnight()): number {
  return Math.round(forthnightTotal * 2 * 100) / 100;
}
