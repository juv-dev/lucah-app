import { describe, it, expect } from 'vitest';
import {
  ETAPAS,
  OPTS,
  createWeek,
  toggleHeces,
  isGoalMet,
  consecutiveFirmWeeks,
  addWeek,
  type WeekRecord,
} from '../src/lib/tracker.ts';

describe('Tracker constants', () => {
  it('ETAPAS has inicio, medio, final', () => {
    expect(ETAPAS).toEqual(['inicio', 'medio', 'final']);
  });

  it('OPTS has F, M, B, A', () => {
    expect(OPTS).toEqual(['F', 'M', 'B', 'A']);
  });
});

describe('createWeek()', () => {
  it('creates an empty week with blank fields', () => {
    const w = createWeek();
    expect(w).toEqual({ fecha: '', inicio: '', medio: '', final: '', obs: '' });
  });

  it('accepts an initial date', () => {
    const w = createWeek('2026-04-18');
    expect(w.fecha).toBe('2026-04-18');
  });

  it('all heces fields start empty', () => {
    const w = createWeek();
    expect(w.inicio).toBe('');
    expect(w.medio).toBe('');
    expect(w.final).toBe('');
  });
});

describe('toggleHeces()', () => {
  it('sets a heces value when empty', () => {
    const w = createWeek();
    const updated = toggleHeces(w, 'inicio', 'F');
    expect(updated.inicio).toBe('F');
  });

  it('clears the value when the same option is clicked again', () => {
    const w = { ...createWeek(), inicio: 'F' as const };
    const updated = toggleHeces(w, 'inicio', 'F');
    expect(updated.inicio).toBe('');
  });

  it('changes to a different value', () => {
    const w = { ...createWeek(), medio: 'B' as const };
    const updated = toggleHeces(w, 'medio', 'M');
    expect(updated.medio).toBe('M');
  });

  it('does not mutate the original week', () => {
    const w = createWeek();
    toggleHeces(w, 'final', 'A');
    expect(w.final).toBe('');
  });

  it('throws for invalid etapa', () => {
    expect(() => toggleHeces(createWeek(), 'almuerzo' as any, 'F')).toThrow('Invalid etapa');
  });

  it('throws for invalid option', () => {
    expect(() => toggleHeces(createWeek(), 'inicio', 'Z' as any)).toThrow('Invalid option');
  });
});

describe('isGoalMet()', () => {
  it('returns true when all etapas are F', () => {
    const w: WeekRecord = { fecha: '', inicio: 'F', medio: 'F', final: 'F', obs: '' };
    expect(isGoalMet(w)).toBe(true);
  });

  it('returns false when any etapa is not F', () => {
    const w: WeekRecord = { fecha: '', inicio: 'F', medio: 'M', final: 'F', obs: '' };
    expect(isGoalMet(w)).toBe(false);
  });

  it('returns false when etapas are empty', () => {
    expect(isGoalMet(createWeek())).toBe(false);
  });
});

describe('consecutiveFirmWeeks()', () => {
  const firmWeek = (): WeekRecord => ({ fecha: '', inicio: 'F', medio: 'F', final: 'F', obs: '' });
  const softWeek = (): WeekRecord => ({ fecha: '', inicio: 'B', medio: 'B', final: 'B', obs: '' });

  it('returns 0 for an empty list', () => {
    expect(consecutiveFirmWeeks([])).toBe(0);
  });

  it('returns 0 when the last week is not all-F', () => {
    expect(consecutiveFirmWeeks([firmWeek(), softWeek()])).toBe(0);
  });

  it('counts 1 consecutive firm week', () => {
    expect(consecutiveFirmWeeks([softWeek(), firmWeek()])).toBe(1);
  });

  it('counts 2 consecutive firm weeks (therapeutic target)', () => {
    expect(consecutiveFirmWeeks([softWeek(), firmWeek(), firmWeek()])).toBe(2);
  });

  it('stops counting at a non-firm week', () => {
    expect(consecutiveFirmWeeks([firmWeek(), softWeek(), firmWeek()])).toBe(1);
  });
});

describe('addWeek()', () => {
  it('adds an empty week to the list', () => {
    const weeks = addWeek([]);
    expect(weeks).toHaveLength(1);
    expect(weeks[0]).toEqual(createWeek());
  });

  it('does not mutate the original array', () => {
    const original: WeekRecord[] = [];
    addWeek(original);
    expect(original).toHaveLength(0);
  });

  it('appends to an existing list', () => {
    const weeks = addWeek([createWeek(), createWeek()]);
    expect(weeks).toHaveLength(3);
  });
});
