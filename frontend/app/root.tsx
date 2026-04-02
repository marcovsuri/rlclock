import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';

import type { Route } from './+types/root';
import './app.css';

export const links: Route.LinksFunction = () => [
  // Fonts
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap',
  },
  // PWA / Icons
  { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
  { rel: 'apple-touch-icon', href: '/favicon.svg' },
  { rel: 'manifest', href: '/manifest.json' },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Dark mode - must run before paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
          document.documentElement.classList.add('no-transition');
          if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark-mode');
          }
        `,
          }}
        />

        {/* SEO */}
        <meta
          name="description"
          content="RL Clock helps students stay updated with real-time schedules, lunch menus, sports info, and more."
        />
        <meta
          name="keywords"
          content="RL Clock, Roxbury Latin, school schedule, real-time clock, student info, lunch menu, sports updates"
        />
        <meta name="author" content="RL Developers" />
        <link rel="canonical" href="https://rlclock.com/" />
        <meta name="theme-color" content="#000000" />

        {/* Open Graph */}
        <meta property="og:title" content="RL Clock" />
        <meta
          property="og:description"
          content="Stay up to date with Roxbury Latin's daily class schedules, lunch menus, and sports updates, and more, with RL Clock."
        />
        <meta property="og:image" content="/favicon.svg" />
        <meta property="og:url" content="https://rlclock.com/" />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="RL Clock - The HUB for Roxbury Latin Students"
        />
        <meta
          name="twitter:description"
          content="Stay up to date with Roxbury Latin's daily class schedules, lunch menus, and sports updates, and more, with RL Clock."
        />
        <meta name="twitter:image" content="/favicon.svg" />

        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-5RL5VKMLVC"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-5RL5VKMLVC');
        `,
          }}
        />

        {/* Vimeo */}
        <script src="https://player.vimeo.com/api/player.js" />

        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
