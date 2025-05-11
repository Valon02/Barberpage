import { buildUrl } from "./apiClient";

export type BookingPayload = {
  userId?: string;
  name: string;
  phone: string;
  email: string;
  date: string;           // YYYY-MM-DD
  time: string;           // HH:mm
  service: "Hår" | "Hår + Skägg";
  price: number;
  barber: string;
};

export async function bookSlot(data: BookingPayload): Promise<boolean> {
  try {
    const res = await fetch(buildUrl("/api/bookings"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      console.error(`❌ API svarade ${res.status} ${res.statusText}`);
    }

    return res.ok;          
  } catch (err) {
    console.error("❌ Kunde inte nå API:t:", err);
    return false;
  }
}