import { Menu, menuSchema } from "./types.ts";

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

/** Fetches and parses today's lunch menu from Sage Dining */
export async function fetchMenu(): Promise<Menu> {
  const url = buildMenuUrl();
  console.log("Fetching menu from:", url);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Sage Dining responded with ${response.status}`);
  }

  const json = await response.json();
  return menuSchema.parse(json);
}
