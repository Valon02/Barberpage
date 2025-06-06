const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

function buildUrl(path: string) {
  return `${API_BASE}${path}`;
}

type BulkSlotRequest = {
  days: number[];
  startHour: number;
  endHour: number;
  interval: number;
};

export async function createBulkSlots(data: BulkSlotRequest) {
  const res = await fetch(buildUrl("/api/slots/bulk"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.ok;
}

export async function getBookings() {
  const res = await fetch(buildUrl("/api/bookings"));
  if (!res.ok) throw new Error("Kunde inte hämta bokningar");
  return res.json();
}

export async function getAvailableSlots() {
  const res = await fetch(buildUrl("/api/slots"));
  if (!res.ok) throw new Error("Kunde inte hämta tider");
  return res.json();
}

export async function deleteSlot(slotId: string) {
  const res = await fetch(buildUrl(`/api/slots/${slotId}`), {
    method: "DELETE",
  });
  return res.ok;
}

export async function createSingleSlot(data: {
  date: string;
  time: string;
  barber: string;
}) {
  const res = await fetch(buildUrl("/api/slots"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.ok;
}

export async function copySlotsToDate(data: {
  fromDate: string;
  toDate: string;
  barber: string;
}) {
  const res = await fetch(buildUrl("/api/slots/copy"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.ok;
}

export async function deleteBooking(bookingId: string) {
  const res = await fetch(buildUrl(`/api/bookings/${bookingId}`), {
    method: "DELETE",
  });
  return res.ok;
}
