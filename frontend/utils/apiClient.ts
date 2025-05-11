/* utils/apiClient.ts
   --------------------------------------------------------------
   • Läser NEXT_PUBLIC_API_BASE om den finns
   • Faller annars tillbaka till ”relativ path” – då kan Next/Ver­cel
     själv rewrita /api-anropen vid behov.
   -------------------------------------------------------------- */

const FALLBACK = "";            // => fetch("/api/…")   (Next-proxy)

export function buildUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_API_BASE?.trim();
  if (base) {
    /* säkerställ att base INTE slutar med slash  */
    return `${base.replace(/\/+$/, "")}${path}`;
  }
  return `${FALLBACK}${path}`;
}
