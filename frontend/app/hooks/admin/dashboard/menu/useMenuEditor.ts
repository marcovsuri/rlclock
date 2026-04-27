import type { SupabaseClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import type { Database, Json } from '~/types/database.types';
import {
  MENU_SECTION_CONFIG,
  menuSchema,
  type Menu,
  type MenuItem,
  type MenuSectionKey,
} from '~/types/lunch';

type EditingTarget = {
  sectionKey: MenuSectionKey;
  index: number;
} | null;

const createEmptyAllergens = (): MenuItem['allergens'] => ({
  allergenCodes: [],
  allergenNames: [],
  lmAllergenCodes: [],
  lmAllergenNames: [],
  lifestyleCodes: [],
  lifestyleNames: [],
  lmLifestyleCodes: [],
  lmLifestyleNames: [],
  performanceSpotlight: '',
});

const menuQuerySchema = z.array(
  z.object({
    id: z.number(),
    created_at: z.string(),
    day: z.string(),
    menu: menuSchema,
  }),
);

const menuIdValueSchema = z.coerce.number().int().positive();

const menuIdQuerySchema = z.object({
  menuid: menuIdValueSchema,
});

const createEmptyMenu = (): Menu =>
  MENU_SECTION_CONFIG.reduce(
    (menu, { key }) => ({ ...menu, [key]: [] }),
    {} as Menu,
  );

const EMPTY_MENU = createEmptyMenu();

const getToday = () =>
  new Date().toLocaleDateString('en-CA', {
    timeZone: 'America/New_York',
  });

const createId = () => {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  return `menu-item-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const createMenuItem = (sectionKey: MenuSectionKey): MenuItem => {
  const id = createId();

  return {
    id,
    menuId: id,
    recipeId: '',
    recipeType: '',
    day: '',
    week: '',
    meal: 'Lunch',
    stations: [],
    displayCategory: sectionKey,
    dailyCategory: sectionKey,
    displayStation: '',
    card: '',
    name: 'New Item',
    desc: '',
    price: 0,
    dot: '',
    allergens: createEmptyAllergens(),
    hasDetails: false,
  };
};

const serializeMenu = (menu: Menu): Json =>
  JSON.parse(JSON.stringify(menu)) as Json;

const fetchDatabaseMenu = async (
  supabase: SupabaseClient<Database>,
): Promise<Menu | null> => {
  const today = getToday();
  const { data, error } = await supabase
    .from('menus')
    .select('*')
    .eq('day', today);

  if (error) throw new Error(`Supabase error: ${error.message}`);

  const rows = menuQuerySchema.parse(data);
  if (rows.length > 0) {
    return rows[rows.length - 1].menu;
  }

  return null;
};

const fetchLatestMenuId = async (
  supabase: SupabaseClient<Database>,
): Promise<number> => {
  const { data, error } = await supabase
    .from('menuids')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) throw new Error(`Supabase error: ${error.message}`);

  return menuIdQuerySchema.parse(data).menuid;
};

export function useMenuEditor(supabase: SupabaseClient<Database>) {
  const [menu, setMenu] = useState<Menu>(EMPTY_MENU);
  const [menuId, setMenuId] = useState('');
  const [editingTarget, setEditingTarget] = useState<EditingTarget>(null);

  useEffect(() => {
    let cancelled = false;

    const loadMenuEditorState = async () => {
      const [storedMenuResult, latestMenuIdResult] = await Promise.allSettled([
        fetchDatabaseMenu(supabase),
        fetchLatestMenuId(supabase),
      ]);

      if (cancelled) return;

      if (storedMenuResult.status === 'fulfilled' && storedMenuResult.value) {
        setMenu(storedMenuResult.value);
      } else if (storedMenuResult.status === 'rejected') {
        console.error(
          'Failed to load menu from Supabase',
          storedMenuResult.reason,
        );
      }

      if (latestMenuIdResult.status === 'fulfilled') {
        setMenuId(String(latestMenuIdResult.value));
      } else {
        console.error(
          'Failed to load latest menu ID from Supabase',
          latestMenuIdResult.reason,
        );
      }
    };

    void loadMenuEditorState();

    return () => {
      cancelled = true;
    };
  }, [supabase]);

  const updateItem = (
    sectionKey: MenuSectionKey,
    index: number,
    updater: (item: MenuItem) => MenuItem,
  ) => {
    setMenu((current) => ({
      ...current,
      [sectionKey]: current[sectionKey].map((item, itemIndex) =>
        itemIndex === index ? updater(item) : item,
      ),
    }));
  };

  const moveItem = (
    sectionKey: MenuSectionKey,
    fromIndex: number,
    toIndex: number,
  ) => {
    setMenu((current) => {
      const nextSectionItems = [...current[sectionKey]];
      const [moved] = nextSectionItems.splice(fromIndex, 1);
      nextSectionItems.splice(toIndex, 0, moved);

      return {
        ...current,
        [sectionKey]: nextSectionItems,
      };
    });

    setEditingTarget((current) => {
      if (!current || current.sectionKey !== sectionKey) return current;
      if (current.index === fromIndex) {
        return { sectionKey, index: toIndex };
      }
      if (current.index === toIndex) {
        return { sectionKey, index: fromIndex };
      }

      return current;
    });
  };

  const toggleEdit = (sectionKey: MenuSectionKey, index: number) => {
    setEditingTarget((current) =>
      current?.sectionKey === sectionKey && current.index === index
        ? null
        : { sectionKey, index },
    );
  };

  const updateMenuId = (value: string) => {
    setMenuId(value);
  };

  const fetchMenuIdFromSupabase = async () => {
    try {
      const latestMenuId = await fetchLatestMenuId(supabase);
      setMenuId(String(latestMenuId));
    } catch (error) {
      console.error('Failed to fetch latest menu ID from Supabase', error);
      alert('Unable to load the latest menu ID from the database.');
    }
  };

  const fetchMenuFromAPI = async () => {
    const parsedMenuId = menuIdValueSchema.safeParse(menuId.trim());
    if (!parsedMenuId.success) {
      alert('Enter a valid menu ID before fetching from the API.');
      return;
    }

    try {
      const response = await fetch(import.meta.env.VITE_MENU_URL, {
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
      const res = menuSchema.safeParse(raw);

      if (res.success) {
        setMenu(res.data);
        setEditingTarget(null);
      }
    } catch (error) {
      console.error('Failed to fetch menu from API', error);
      alert('Unable to fetch menu from API.');
    }
  };

  const sendMenuId = async () => {
    const parsedMenuId = menuIdValueSchema.safeParse(menuId.trim());
    if (!parsedMenuId.success) {
      alert('Enter a valid menu ID before sending it to the database.');
      return;
    }

    const { error: insertError } = await supabase
      .from('menuids')
      .insert({ menuid: parsedMenuId.data });

    if (insertError) {
      console.warn('Failed to cache menu id:', insertError.message);
      alert('Unable to save menu id to database.');
    }
  };

  const fetchMenuFromSupabase = async () => {
    try {
      const storedMenu = await fetchDatabaseMenu(supabase);
      if (!storedMenu) {
        alert('Unable to fetch menu from database.');
        return;
      }

      setMenu(storedMenu);
      setEditingTarget(null);
    } catch (error) {
      console.error('Failed to fetch menu from Supabase', error);
      alert('Unable to fetch menu from database.');
    }
  };

  const addItem = (sectionKey: MenuSectionKey) => {
    setEditingTarget({
      sectionKey,
      index: menu[sectionKey].length,
    });
    setMenu((current) => ({
      ...current,
      [sectionKey]: [...current[sectionKey], createMenuItem(sectionKey)],
    }));
  };

  const removeItem = (sectionKey: MenuSectionKey, index: number) => {
    setMenu((current) => ({
      ...current,
      [sectionKey]: current[sectionKey].filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));

    setEditingTarget((current) => {
      if (!current || current.sectionKey !== sectionKey) return current;
      if (current.index === index) return null;

      return current.index > index
        ? { sectionKey, index: current.index - 1 }
        : current;
    });
  };

  const sendMenu = async () => {
    const today = getToday();
    const menuJson = serializeMenu(menu);
    const { error: insertError } = await supabase
      .from('menus')
      .insert({ day: today, menu: menuJson });

    if (insertError) {
      console.warn('Failed to cache menu:', insertError.message);
      alert('Unable to save menu to database.');
    }
  };

  return {
    menu,
    menuId,
    editingTarget,
    updateMenuId,
    updateItem,
    moveItem,
    toggleEdit,
    fetchMenuIdFromSupabase,
    fetchMenuFromAPI,
    fetchMenuFromSupabase,
    sendMenuId,
    addItem,
    removeItem,
    sendMenu,
  };
}
