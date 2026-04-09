import { useState } from 'react';
import type { Period, Schedule } from '~/types/clock';
import { ETTimeToDate } from '~/utils/global/time';

const DEFAULT_BLOCK_DURATION_MINUTES = 45;
const DEFAULT_BLOCK_GAP_MINUTES = 5;

const normalizeSchedule = (schedule: Schedule): Schedule => ({
  ...schedule,
  periods: schedule.periods.map((period, index) => ({ ...period, index })),
});

const createNextPeriod = (schedule: Schedule): Period => {
  const lastPeriod = schedule.periods.at(-1);
  if (!lastPeriod) {
    return {
      index: 0,
      name: 'A',
      start: ETTimeToDate(8, 30),
      end: ETTimeToDate(8, 30 + DEFAULT_BLOCK_DURATION_MINUTES),
    };
  }
  const duration =
    lastPeriod.end.getTime() - lastPeriod.start.getTime() ||
    DEFAULT_BLOCK_GAP_MINUTES * 60 * 1000;
  const start = new Date(
    lastPeriod.end.getTime() + DEFAULT_BLOCK_GAP_MINUTES * 60 * 1000,
  );
  const end = new Date(start.getTime() + duration);
  const nextIndex = schedule.periods.length;
  return { index: nextIndex, name: 'New Block', start, end };
};

// TODO: REMOVE
const buildExampleSchedule = (): Schedule => ({
  name: 'Example Schedule',
  periods: [
    {
      index: 0,
      name: 'A',
      start: ETTimeToDate(8, 30),
      end: ETTimeToDate(9, 15),
    },
    {
      index: 1,
      name: 'B',
      start: ETTimeToDate(9, 20),
      end: ETTimeToDate(10, 5),
    },
    {
      index: 2,
      name: 'C',
      start: ETTimeToDate(10, 15),
      end: ETTimeToDate(11, 0),
    },
    {
      index: 3,
      name: 'D',
      start: ETTimeToDate(11, 10),
      end: ETTimeToDate(11, 55),
    },
  ],
});

export function useScheduleEditor() {
  // TODO: Make this pull from supabase
  const [schedule, setSchedule] = useState<Schedule>(() =>
    buildExampleSchedule(),
  );

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const updatePeriod = (
    index: number,
    updater: (
      period: Schedule['periods'][number],
    ) => Schedule['periods'][number],
  ) => {
    setSchedule((current) => ({
      ...current,
      periods: current.periods.map((period, i) =>
        i === index ? updater(period) : period,
      ),
    }));
  };

  const movePeriod = (fromIndex: number, toIndex: number) => {
    setSchedule((current) => {
      const next = [...current.periods];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return normalizeSchedule({ ...current, periods: next });
    });
    setEditingIndex((current) => {
      if (current === fromIndex) return toIndex;
      if (current === toIndex) return fromIndex;
      return current;
    });
  };

  const toggleEdit = (index: number) =>
    setEditingIndex((current) => (current === index ? null : index));

  const fetchSchedule = () => {
    // TODO: Make this fetch from api
    setSchedule(buildExampleSchedule());
    setEditingIndex(null);
  };

  const addBlock = () => {
    setEditingIndex(schedule.periods.length);
    setSchedule((current) =>
      normalizeSchedule({
        ...current,
        periods: [...current.periods, createNextPeriod(current)],
      }),
    );
  };

  const removeBlock = (index: number) => {
    setSchedule((current) =>
      normalizeSchedule({
        ...current,
        periods: current.periods.filter((_, i) => i !== index),
      }),
    );
    setEditingIndex((current) => {
      if (current === null || current === index) return null;
      return current > index ? current - 1 : current;
    });
  };

  const sendSchedule = () => {
    // TODO: update schedule in supabase
    console.info('Schedule payload preview', schedule);
  };

  return {
    schedule,
    editingIndex,
    updatePeriod,
    movePeriod,
    toggleEdit,
    fetchSchedule,
    addBlock,
    removeBlock,
    sendSchedule,
  };
}
