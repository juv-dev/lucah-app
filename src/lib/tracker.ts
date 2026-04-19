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


export function createWeek(fecha = ''): WeekRecord {
  return { fecha, inicio: '', medio: '', final: '', obs: '' };
}

export function toggleHeces(week: WeekRecord, etapa: Etapa, val: HecesOpt): WeekRecord {
  if (!(ETAPAS as readonly string[]).includes(etapa)) {
    throw new Error(`Invalid etapa: "${etapa}"`);
  }
  if (val !== '' && !(OPTS as readonly string[]).includes(val)) {
    throw new Error(`Invalid option: "${val}"`);
  }
  return { ...week, [etapa]: week[etapa] === val ? '' : val };
}

export function isGoalMet(week: WeekRecord): boolean {
  return ETAPAS.every(et => week[et] === 'F');
}

export function consecutiveFirmWeeks(weeks: WeekRecord[]): number {
  let count = 0;
  for (let i = weeks.length - 1; i >= 0; i--) {
    if (isGoalMet(weeks[i])) count++;
    else break;
  }
  return count;
}

export function addWeek(weeks: WeekRecord[]): WeekRecord[] {
  return [...weeks, createWeek()];
}
