import { buildUrl } from "./apiClient";

type BulkSlotRequest = {
  days: number[];
  startHour: number;
  endHour: number;
  interval: number;
};

export async function getAvailableSlots() {
  const res = await fetch(buildUrl("/api/slots"));
  if (!res.ok) throw new Error("Kunde inte hämta tider");
  return res.json();
}

export async function createBulkSlots(data: BulkSlotRequest) {
  const res = await fetch(buildUrl("/api/slots/bulk"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
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

export async function deleteSlot(slotId: string) {
  const res = await fetch(buildUrl(`/api/slots/${slotId}`), {
    method: "DELETE",
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
