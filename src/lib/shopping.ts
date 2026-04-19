
export const FORTNIGHT_DAYS = 14 as const;
export const RATIONS_PER_DAY = 3 as const;

export interface ShoppingItem {
  name: string;
  kg: number;
  pricePerKg: number;
}

export type ShoppingItemKey = 'carne' | 'quinua' | 'verduras';

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


export function itemPrice(item: ShoppingItem): number {
  return Math.round(item.kg * item.pricePerKg * 100) / 100;
}

export function totalFortnight(): number {
  return Object.values(ITEMS).reduce((sum, item) => sum + itemPrice(item), 0);
}

export function dailyCost(forthnightTotal: number = totalFortnight()): number {
  return Math.round((forthnightTotal / FORTNIGHT_DAYS) * 100) / 100;
}

export function perRationCost(daily: number = dailyCost()): number {
  return Math.round((daily / RATIONS_PER_DAY) * 100) / 100;
}

export function monthlyCost(forthnightTotal: number = totalFortnight()): number {
  return Math.round(forthnightTotal * 2 * 100) / 100;
}
