import { useEffect } from 'react';
import type { Route } from './+types/home';
import scheduleFetcher from '~/core/ScheduleFetcher';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export default function Home() {
  useEffect(() => {
    async function s() {
      const r = await scheduleFetcher.get();
      console.log(r);
    }

    s();
  }, []);

  return <h1>Hello world</h1>;
}
