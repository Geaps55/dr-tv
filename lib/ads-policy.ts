// Single source of truth for "can AdSense serve on this route?"
// AdSense policy forbids ads on behavioral / no-content / error screens.

const DISABLED_PREFIXES = ["/admin"];

export function adsAllowedForPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return !DISABLED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
}
