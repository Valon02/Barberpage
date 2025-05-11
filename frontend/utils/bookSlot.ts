import { buildUrl } from "./apiClient";

export async function bookSlot(data: {
  userId?: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  service: "Hår" | "Hår + Skägg";
  price: number;
  barber: string;
}) {
  const res = await fetch(buildUrl("/api/bookings"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.ok;
}
