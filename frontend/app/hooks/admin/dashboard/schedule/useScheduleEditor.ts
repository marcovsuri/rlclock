import type { SupabaseClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import type { Database, Json } from '~/types/database.types';
import { scheduleSchema, type Period, type Schedule } from '~/types/clock';
import { ETTimeToDate } from '~/utils/global/time';

const DEFAULT_BLOCK_DURATION_MINUTES = 45;
const DEFAULT_BLOCK_GAP_MINUTES = 5;
const EMPTY_SCHEDULE: Schedule = { name: '', periods: [] };

const scheduleQuerySchema = z.array(
  z.object({
    id: z.number(),
    created_at: z.string(),
    day: z.string(),
    schedule: scheduleSchema,
  }),
);

const normalizeSchedule = (schedule: Schedule): Schedule => ({
  ...schedule,
  periods: schedule.periods.map((period, index) => ({ ...period, index })),
});

const getToday = () =>
  new Date().toLocaleDateString('en-CA', {
    timeZone: 'America/New_York',
  });

const serializeSchedule = (schedule: Schedule): Json => ({
  name: schedule.name,
  periods: schedule.periods.map((period) => ({
    index: period.index,
    name: period.name,
    start: period.start.toISOString(),
    end: period.end.toISOString(),
  })),
});

const fetchDatabaseSchedule = async (
  supabase: SupabaseClient<Database>,
): Promise<Schedule | null> => {
  const today = getToday();
  const { data, error } = await supabase
    .from('schedules')
    .select('*')
    .eq('day', today);

  if (error) throw new Error(`Supabase error: ${error.message}`);

  const rows = scheduleQuerySchema.parse(data);
  if (rows.length > 0) {
    return rows[rows.length - 1].schedule;
  }

  return null;
};

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

export function useScheduleEditor(supabase: SupabaseClient<Database>) {
  const [schedule, setSchedule] = useState<Schedule>(EMPTY_SCHEDULE);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadSchedule = async () => {
      try {
        const storedSchedule = await fetchDatabaseSchedule(supabase);
        if (!cancelled && storedSchedule) {
          setSchedule(storedSchedule);
        }
      } catch (error) {
        console.error('Failed to load schedule from Supabase', error);
      }
    };

    void loadSchedule();

    return () => {
      cancelled = true;
    };
  }, [supabase]);

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

  const updateScheduleName = (name: string) => {
    setSchedule((current) => ({ ...current, name }));
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

  const fetchScheduleFromAPI = async () => {
    const response = await fetch(import.meta.env.VITE_SCHEDULE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        save: false,
        reset: true,
      }),
    });

    const raw = await response.json();
    const res = scheduleSchema.safeParse(raw);

    if (res.success) {
      setSchedule(res.data);
      setEditingIndex(null);
    }
  };

  const fetchScheduleFromSupabase = async () => {
    const s = await fetchDatabaseSchedule(supabase);
    if (!s) return alert('Unable to fetch from supabase');
    setSchedule(s);
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

  const sendSchedule = async () => {
    const today = getToday();
    const scheduleJson = serializeSchedule(schedule);
    const { error: insertError } = await supabase
      .from('schedules')
      .insert({ day: today, schedule: scheduleJson });

    if (insertError) {
      console.warn('Failed to cache schedule:', insertError.message);
    }
  };

  return {
    schedule,
    editingIndex,
    updateScheduleName,
    updatePeriod,
    movePeriod,
    toggleEdit,
    fetchScheduleFromAPI,
    fetchScheduleFromSupabase,
    addBlock,
    removeBlock,
    sendSchedule,
  };
}
