import { redirect } from 'react-router';
import type { Route } from './+types/catchall';

export async function loader({ params }: Route.LoaderArgs) {
  return redirect('/');
}

export default function CatchAll() {
  return <h1>No page found</h1>;
}
