/**
 * Stool-tracking state logic for Lucah's health tracker.
 * Pure functions — no DOM, no localStorage access.
 */

export const ETAPAS = ['inicio', 'medio', 'final'] as const;
export const OPTS   = ['F', 'M', 'B', 'A'] as const;

export type Etapa    = typeof ETAPAS[number];
export type HecesOpt = typeof OPTS[number] | '';

export interface WeekRecord {
  fecha: string;
  inicio: HecesOpt;
  medio: HecesOpt;
  final: HecesOpt;
  obs: string;
}

/**
 * Creates an empty week record.
 */
export function createWeek(fecha = ''): WeekRecord {
  return { fecha, inicio: '', medio: '', final: '', obs: '' };
}

/**
 * Toggles a heces value for a given etapa.
 * Clicking the same value twice clears it (deselects).
 * Returns a new object (immutable).
 */
export function toggleHeces(week: WeekRecord, etapa: Etapa, val: HecesOpt): WeekRecord {
  if (!(ETAPAS as readonly string[]).includes(etapa)) {
    throw new Error(`Invalid etapa: "${etapa}"`);
  }
  if (val !== '' && !(OPTS as readonly string[]).includes(val)) {
    throw new Error(`Invalid option: "${val}"`);
  }
  return { ...week, [etapa]: week[etapa] === val ? '' : val };
}

/**
 * Returns true if all three etapas of a week are 'F' (Firme).
 */
export function isGoalMet(week: WeekRecord): boolean {
  return ETAPAS.every(et => week[et] === 'F');
}

/**
 * Counts consecutive weeks (from the end of the list) where all etapas are 'F'.
 */
export function consecutiveFirmWeeks(weeks: WeekRecord[]): number {
  let count = 0;
  for (let i = weeks.length - 1; i >= 0; i--) {
    if (isGoalMet(weeks[i])) count++;
    else break;
  }
  return count;
}

/**
 * Adds a new empty week to the list (immutable).
 */
export function addWeek(weeks: WeekRecord[]): WeekRecord[] {
  return [...weeks, createWeek()];
}
