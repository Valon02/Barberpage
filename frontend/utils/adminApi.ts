type BulkSlotRequest = {
  days: number[];
  startHour: number;
  endHour: number;
  interval: number;
};

export async function createBulkSlots(data: BulkSlotRequest) {
  const res = await fetch("/api/slots/bulk", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.ok;
}

export async function getBookings() {
  const res = await fetch("/api/bookings");
  return res.json();
}

export async function getAvailableSlots() {
  const res = await fetch("/api/slots");
  return res.json();
}

export async function deleteSlot(slotId: string) {
  const res = await fetch(`/api/slots/${slotId}`, {
    method: "DELETE",
  });
  return res.ok;
}

export async function createSingleSlot(data: {
  date: string;
  time: string;
  barber: string;
}) {
  const res = await fetch("/api/add-slot", {
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
  const res = await fetch("/api/slots/copy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.ok;
}
