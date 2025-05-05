import React from "react";

type Booking = {
  id: string;
  date: string;
  time: string;
  service: string;
  price: number;
  name?: string;
  phone?: string;
};

type Props = {
  bookings: Booking[];
  onDeleteSlot: (slotId: string) => Promise<void>;
};

const BookingList = ({ bookings, onDeleteSlot }: Props) => {
  const today = new Date();

  const upcoming = bookings.filter((b) => new Date(b.date) >= today);
  const recent = bookings
    .filter((b) => new Date(b.date) < today)
    .slice(-10)
    .reverse();

  return (
    <div className="bg-gray-800 rounded p-4 space-y-8">
      {/* 🟢 Uppkommande bokningar */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Kommande bokningar</h2>
        {upcoming.length === 0 ? (
          <p className="text-gray-400">Inga kommande bokningar.</p>
        ) : (
          <ul className="space-y-2 max-h-[300px] overflow-auto">
            {upcoming.map((b) => (
              <li
                key={b.id}
                className="bg-gray-700 p-3 rounded flex justify-between items-center"
              >
                <div>
                  <p className="text-sm">{b.date} kl {b.time}</p>
                  <p className="text-sm text-gray-300">{b.service} – {b.price} kr</p>
                  <p className="text-xs text-gray-400">
                    Kund: {b.name || "Okänd"} – {b.phone || "Ingen info"}
                  </p>
                </div>
                <button
                  onClick={() => onDeleteSlot(b.id)}
                  className="text-red-400 hover:underline text-sm"
                >
                  Avboka
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 🕒 Senaste bokningar */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Senaste bokningar</h2>
        {recent.length === 0 ? (
          <p className="text-gray-400">Inga tidigare bokningar.</p>
        ) : (
          <ul className="space-y-2 max-h-[300px] overflow-auto">
            {recent.map((b) => (
              <li
                key={b.id}
                className="bg-gray-700 p-3 rounded flex justify-between items-center"
              >
                <div>
                  <p className="text-sm">{b.date} kl {b.time}</p>
                  <p className="text-sm text-gray-300">{b.service} – {b.price} kr</p>
                  <p className="text-xs text-gray-400">
                    Kund: {b.name || "Okänd"} – {b.phone || "Ingen info"}
                  </p>
                </div>
                <button
                  onClick={() => onDeleteSlot(b.id)}
                  className="text-red-400 hover:underline text-sm"
                >
                  Avboka
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BookingList;
