import { useState } from "react";
import { Menu } from "../types/lunch";

// Example placeholder URL – replace with your actual lunch menu endpoint

export function useLunch() {
  const [menu, setMenu] = useState<Menu | null>(null);

  async function update() {
    console.log("Fetching lunch menu...");
    try {
      const url = process.env.REACT_APP_LUNCH_MENU_URL;
      const accessToken = process.env.REACT_APP_SUPABASE_ANON_KEY;

      if (!url || !accessToken) {
        console.log(url);
        console.log(accessToken);
        throw new Error(
          "LUNCH_MENU_URL or LUNCH_MENU_ACCESS_TOKEN is not defined"
        );
      }

      const response = await fetch(url, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      //   console.log(data);
      setMenu(data);
    } catch (error) {
      console.error("Failed to fetch lunch menu:", error);
    }
  }

  return { menu, update };
}
