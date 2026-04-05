import { describe, expect, it } from 'vitest';
import dayjs from 'dayjs';
import { getSelectedDate, useDateStore } from '@/shared/stores/dateStore';

describe('dateStore', () => {
  it('normalizes string dates set through the store', () => {
    useDateStore.getState().setDate('2026-05-07');

    expect(useDateStore.getState().date).toBe('2026-05-07');
    expect(getSelectedDate()).toBe('2026-05-07');
  });

  it('normalizes dayjs values set through the store', () => {
    useDateStore.getState().setDate(dayjs('2026-06-08'));

    expect(useDateStore.getState().date).toBe('2026-06-08');
  });
});
