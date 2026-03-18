import { getToday } from "../_shared/global.ts";
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.46.1";
import { Menu, menuQuerySchema, menuSchema } from "./types.ts";

const SAGE_MENU_ID = "134281";
const SAGE_BASE_URL = "https://www.sagedining.com/microsites/getMenuItems";

/** Builds the Sage Dining API URL for today's lunch menu */
const buildMenuUrl = (): string => {
  const now = new Date();
  const date = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
  const params = new URLSearchParams({
    menuId: SAGE_MENU_ID,
    date,
    meal: "Lunch",
    mode: "",
  });
  return `${SAGE_BASE_URL}?${params}`;
};

const fetchApiMenu = async (): Promise<Menu> => {
  const url = buildMenuUrl();
  console.log("Fetching menu from:", url);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Sage Dining responded with ${response.status}`);
  }

  const json = await response.json();
  return menuSchema.parse(json);
};

/** Fetches and parses today's lunch menu from Sage Dining/DB */
async function getMenu(supabase: SupabaseClient): Promise<Menu> {
  // Todo: manual reset check

  const today = getToday();

  const { data, error } = await supabase
    .from("menus")
    .select("*")
    .eq("day", today);

  if (error) throw new Error(`Supabase error: ${error.message}`);

  const rows = menuQuerySchema.parse(data);

  if (rows.length > 0) {
    return rows[rows.length - 1].menu;
  }

  // Nothing cached for today - fetch, store, and return
  const menu = await fetchApiMenu();

  const { error: insertError } = await supabase
    .from("menus")
    .insert({ day: today, menu });

  if (insertError) {
    console.warn("Failed to cache menu:", insertError.message);
  }

  return menu;
}

export { getMenu };
