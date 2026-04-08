const DUMMY_BASE = 'http://localhost';
export const DEFAULT_REDIRECT = '/admin/dashboard';

export function safeAdminRedirect(redirectTo?: string | null): string {
  if (!redirectTo) return DEFAULT_REDIRECT;
  try {
    const { pathname, search, hash } = new URL(redirectTo, DUMMY_BASE);
    const destination = `${pathname}${search}${hash}`;
    if (!destination.startsWith('/admin')) return DEFAULT_REDIRECT;
    if (destination.startsWith('/admin/signin')) return DEFAULT_REDIRECT;
    return destination;
  } catch {
    return DEFAULT_REDIRECT;
  }
}

export function adminSigninUrl(redirectTo?: string | null): string {
  const params = new URLSearchParams({
    redirectTo: safeAdminRedirect(redirectTo),
  });
  return `/admin/signin?${params}`;
}
