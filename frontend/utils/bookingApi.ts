import { buildUrl } from "./apiClient";

export async function fetchBookings() {
  const res = await fetch(buildUrl("/api/bookings"));
  if (!res.ok) throw new Error("Kunde inte hämta bokningar");
  return res.json();
}
