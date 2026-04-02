import { z } from 'zod';

const stationSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.url(),
});

const allergensSchema = z.object({
  allergenCodes: z.array(z.string()),
  allergenNames: z.array(z.string()),
  lmAllergenCodes: z.array(z.string()),
  lmAllergenNames: z.array(z.string()),
  lifestyleCodes: z.array(z.string()),
  lifestyleNames: z.array(z.string()),
  lmLifestyleCodes: z.array(z.string()),
  lmLifestyleNames: z.array(z.string()),
  performanceSpotlight: z.string(),
});

const menuItemSchema = z.object({
  id: z.string(),
  menuId: z.string(),
  recipeId: z.string(),
  recipeType: z.string(), // could be narrowed if known enum
  day: z.string(), // could be z.union([z.literal("1"), ..., z.literal("7")]) if range is fixed
  week: z.string(),
  meal: z.string(), // e.g., "Lunch"
  stations: z.array(stationSchema),
  displayCategory: z.string(),
  dailyCategory: z.string(),
  displayStation: z.string(),
  card: z.string(),
  name: z.string(),
  desc: z.string(),
  price: z.number(),
  dot: z.string(), // e.g., "Yellow"
  allergens: allergensSchema,
  hasDetails: z.boolean(),
});

const menuSchema = z.object({
  "Today's Menu Features": z.array(menuItemSchema),
  Specials: z.array(menuItemSchema),
  Soups: z.array(menuItemSchema),
  Salads: z.array(menuItemSchema),
  Deli: z.array(menuItemSchema),
  Entrées: z.array(menuItemSchema),
  'Sides and Vegetables': z.array(menuItemSchema),
  Desserts: z.array(menuItemSchema),
  // "Daily": z.array(menuItemSchema),
  // "Exclude": z.array(menuItemSchema),
  // "Snacks": z.array(menuItemSchema),
  // "Events": z.array(menuItemSchema),
});

type Station = z.infer<typeof stationSchema>;
type Allergens = z.infer<typeof allergensSchema>;
type MenuItem = z.infer<typeof menuItemSchema>;
type Menu = z.infer<typeof menuSchema>;

export type { MenuItem, Menu, Station, Allergens };
export { menuSchema };
