import { menuFetcher } from '~/shared/fetchers';
import type { Route } from './+types/lunch';
import type { Menu } from '~/types/lunch';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'RL Clock | Lunch' },
    { name: 'description', content: 'RL Lunch Menu' },
  ];
}

export async function clientLoader() {
  // Fetch menu
  const menuResult = await menuFetcher.get();
  if (!menuResult.success) throw new Error(menuResult.errorMessage);

  return { menu: menuResult.data };
}

export default function Lunch({ loaderData }: Route.ComponentProps) {
  const { menu }: { menu: Menu } = loaderData;

  console.log(menu);
  return <h1>Lunch</h1>;
}
