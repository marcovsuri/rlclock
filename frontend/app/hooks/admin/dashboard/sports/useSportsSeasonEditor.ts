import type { SupabaseClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import type { Database } from '~/types/database.types';
import { z } from 'zod';

const DATE_INPUT_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const normalizeDateInput = (value: string) => value.trim();

const isValidDateInput = (value: string) => {
  const normalized = normalizeDateInput(value);
  if (!DATE_INPUT_PATTERN.test(normalized)) return false;

  const [yearText, monthText, dayText] = normalized.split('-');
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(year, month - 1, day);

  return (
    !Number.isNaN(date.getTime()) &&
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

const sportsDateQuerySchema = z.object({
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const fetchLatestSportsDate = async (
  supabase: SupabaseClient<Database>,
): Promise<string> => {
  const { data, error } = await supabase
    .from('sportsdates')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    throw new Error(`Supabase error: ${error.message}`);
  }

  return sportsDateQuerySchema.parse(data).start_date;
};

export function useSportsSeasonEditor(supabase: SupabaseClient<Database>) {
  const [seasonStartDate, setSeasonStartDate] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadSeasonStartDate = async () => {
      try {
        const storedDate = await fetchLatestSportsDate(supabase);
        if (!cancelled && storedDate) {
          setSeasonStartDate(storedDate);
        }
      } catch (error) {
        console.error(
          'Failed to load sports season start date from Supabase',
          error,
        );
      }
    };

    void loadSeasonStartDate();

    return () => {
      cancelled = true;
    };
  }, [supabase]);

  const updateSeasonStartDate = (value: string) => {
    setSeasonStartDate(value);
  };

  const fetchSeasonStartDateFromSupabase = async () => {
    try {
      const storedDate = await fetchLatestSportsDate(supabase);
      if (!storedDate) {
        alert('Unable to load the sports season start date from the database.');
        return;
      }

      setSeasonStartDate(storedDate);
    } catch (error) {
      console.error(
        'Failed to fetch sports season start date from Supabase',
        error,
      );
      alert('Unable to load the sports season start date from the database.');
    }
  };

  const sendSeasonStartDate = async () => {
    const normalizedDate = normalizeDateInput(seasonStartDate);

    if (!isValidDateInput(normalizedDate)) {
      alert(
        'Enter a valid season start date before sending it to the database.',
      );
      return;
    }

    const { error: insertError } = await supabase
      .from('sportsdates')
      .insert({ start_date: normalizedDate });

    if (insertError) {
      console.warn(
        'Failed to save sports season start date:',
        insertError.message,
      );
      alert('Unable to save the sports season start date to the database.');
      return;
    }

    setSeasonStartDate(normalizedDate);
  };

  return {
    seasonStartDate,
    updateSeasonStartDate,
    fetchSeasonStartDateFromSupabase,
    sendSeasonStartDate,
  };
}
