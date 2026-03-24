import dayjs, { type Dayjs } from 'dayjs';
import { create } from 'zustand';

type DateValue = string | Dayjs;

interface DateStoreState {
  date: string;
  setDate: (value: DateValue) => void;
}

function normalizeDate(value: DateValue) {
  return dayjs(value).format('YYYY-MM-DD');
}

export const useDateStore = create<DateStoreState>((set) => ({
  date: normalizeDate(dayjs()),
  setDate: (value) => set({ date: normalizeDate(value) }),
}));

export function getSelectedDate() {
  return useDateStore.getState().date;
}
