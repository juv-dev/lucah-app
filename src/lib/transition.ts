export const TOTAL_G = 300 as const;

export type TransitionDay = 1 | 2 | 3;

export interface TransitionEntry {
  newPct: number;
  oldPct: number;
  label: string;
}

export const TRANSITION_PLAN: Record<TransitionDay, TransitionEntry> = {
  1: { newPct: 0.30, oldPct: 0.70, label: 'Día 1: 30% comida nueva → 70% comida anterior' },
  2: { newPct: 0.60, oldPct: 0.40, label: 'Día 2: 60% comida nueva → 40% comida anterior' },
  3: { newPct: 1.00, oldPct: 0.00, label: 'Día 3+: 100% comida nueva ✅ Plan completo' },
};

export function newFoodGrams(day: TransitionDay, totalG: number = TOTAL_G): number {
  const plan = TRANSITION_PLAN[day];
  if (!plan) throw new Error(`Invalid transition day: ${day}. Valid values: 1, 2, 3`);
  return Math.round(plan.newPct * totalG);
}

export function oldFoodGrams(day: TransitionDay, totalG: number = TOTAL_G): number {
  const plan = TRANSITION_PLAN[day];
  if (!plan) throw new Error(`Invalid transition day: ${day}. Valid values: 1, 2, 3`);
  return Math.round(plan.oldPct * totalG);
}


export function allDaysAddUp(totalG: number = TOTAL_G): boolean {
  return (Object.keys(TRANSITION_PLAN) as unknown as TransitionDay[]).every(day => {
    return newFoodGrams(day, totalG) + oldFoodGrams(day, totalG) === totalG;
  });
}
