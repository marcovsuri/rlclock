import { getToday } from "../_shared/global.ts";
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.46.1";
import { Menu, menuQuerySchema, menuSchema } from "./types.ts";

const SAGE_BASE_URL = "https://www.sagedining.com/microsites/getMenuItems";

/** Builds the Sage Dining API URL for today's lunch menu */
const buildMenuUrl = (menuId: number): string => {
  const now = new Date();
  const date = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
  const params = new URLSearchParams({
    menuId: menuId.toString(),
    date,
    meal: "Lunch",
    mode: "",
  });
  return `${SAGE_BASE_URL}?${params}`;
};

const fetchApiMenu = async (menuId: number): Promise<Menu> => {
  const url = buildMenuUrl(menuId);
  console.log("Fetching menu from:", url);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Sage Dining responded with ${response.status}`);
  }

  const json = await response.json();
  return menuSchema.parse(json);
};

/** Fetches and parses today's lunch menu from Sage Dining/DB */
async function getMenu(
  supabase: SupabaseClient,
  save: boolean,
  reset: boolean,
): Promise<Menu> {
  const today = getToday();

  if (!reset) {
    const { data: menus, error: menusError } = await supabase
      .from("menus")
      .select("*")
      .eq("day", today);

    if (menusError) throw new Error(`Supabase error: ${menusError.message}`);

    const rows = menuQuerySchema.parse(menus);

    if (rows.length > 0) {
      return rows[rows.length - 1].menu;
    }
  }

  // Nothing cached for today - fetch, store, and return

  const { data: menuIdRes, error: menuIdError } = await supabase
    .from("menuids")
    .select("menuid")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (menuIdError) throw new Error(`Supabase error: ${menuIdError.message}`);

  const menuId = menuIdRes.menuid;

  console.log(`Using menu id: ${menuId}`);

  const menu = await fetchApiMenu(menuId);

  if (save) {
    const { error: insertError } = await supabase
      .from("menus")
      .insert({ day: today, menu });

    if (insertError) {
      console.warn("Failed to cache menu:", insertError.message);
    }
  }

  return menu;
}

export { getMenu };
