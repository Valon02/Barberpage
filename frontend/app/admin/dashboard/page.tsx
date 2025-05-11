"use client";

import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import {
  getBookings,
  getAvailableSlots,
  deleteSlot,
  deleteBooking,
  copySlotsToDate,
} from "@/utils/adminApi";
import { buildUrl } from "@/utils/apiClient"; // ✅ Detta behövs
import { createSmartSlots } from "@/utils/smartSlotUtils";
import { format, isBefore } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import BookingList from "./components/BookingList";
import CalendarPicker from "./components/CalendarPicker";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title);

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [slots, setSlots] = useState<any[]>([]);
  const [stats, setStats] = useState<{ [key: string]: number }>({});

  const [singleDate, setSingleDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [barber, setBarber] = useState("fadezbydrizz");
  const [copyFromDate, setCopyFromDate] = useState("");
  const [copyToDate, setCopyToDate] = useState("");

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    const fetchedBookings = await getBookings();
    const fetchedSlots = await getAvailableSlots();
    setBookings(fetchedBookings);
    setSlots(fetchedSlots);
    generateStats(fetchedBookings);
  };

  const generateStats = (data: any[]) => {
    const grouped: { [key: string]: number } = {};
    const now = new Date();

    data.forEach((b) => {
      const dateObj = new Date(b.date);
      const week = format(dateObj, "yyyy-MM") + " v" + getWeekNumber(dateObj);
      if (isBefore(dateObj, now)) {
        grouped[week] = (grouped[week] || 0) + (b.price || 250);
      }
    });
    setStats(grouped);
  };

  const getWeekNumber = (date: Date) => {
    const onejan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil(((date.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7);
  };

  const handleCreateSlots = async () => {
    if (!singleDate) return alert("Välj ett datum först");

    const [startHour] = startTime.split(":").map(Number);
    const [endHour] = endTime.split(":").map(Number);

    const success = await createSmartSlots({
      date: singleDate,
      startHour,
      endHour,
      barber,
    });

    if (success) {
      alert("Smarta tider skapade!");
      fetchAllData();
    }
  };

  const handleCopySlots = async () => {
    if (!copyFromDate || !copyToDate) return;
    await copySlotsToDate({ fromDate: copyFromDate, toDate: copyToDate, barber });
    fetchAllData();
    setCopyFromDate("");
    setCopyToDate("");
  };

  const handleDeleteSlot = async (slotId: string) => {
    await deleteSlot(slotId);
    fetchAllData();
  };

  const handleDeleteBooking = async (bookingId: string) => {
    const confirmDelete = window.confirm("Är du säker på att du vill avboka?");
    if (!confirmDelete) return;

    // ✅ Använd rätt base URL (Express kör på 5000)
    const res = await fetch(buildUrl(`/api/bookings/${bookingId}`), {
      method: "DELETE",
    });

    if (res.ok) {
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    } else {
      alert("Kunde inte avboka bokningen.");
    }
  };

  const totalBookingsThisWeek = bookings.filter((b) => {
    const now = new Date();
    const week = getWeekNumber(now);
    return getWeekNumber(new Date(b.date)) === week;
  });

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todaysSlots = slots.filter((s) => s.date === todayStr);

  const filteredSlots = slots
    .filter((s) => s.date === singleDate && s.barber === barber)
    .map((s) => ({ id: s.id, time: s.time }));

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Adminpanel</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">Totala bokningar</h2>
            <p className="text-3xl font-bold">{totalBookingsThisWeek.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">Dagens tider</h2>
            <p className="text-3xl font-bold">{todaysSlots.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">Totala intäkter</h2>
            <p className="text-3xl font-bold">
              {bookings
                .filter((b) => isBefore(new Date(b.date), new Date()))
                .reduce((acc, b) => acc + (b.price || 250), 0)}{" "}
              kr
            </p>
          </CardContent>
        </Card>
      </div>

      <CalendarPicker
        singleDate={singleDate}
        startTime={startTime}
        endTime={endTime}
        barber={barber}
        onDateChange={setSingleDate}
        onStartTimeChange={setStartTime}
        onEndTimeChange={setEndTime}
        onBarberChange={setBarber}
        onCreateSmartSlots={handleCreateSlots}
        copyFromDate={copyFromDate}
        copyToDate={copyToDate}
        onCopyChangeFrom={setCopyFromDate}
        onCopyChangeTo={setCopyToDate}
        onCopySlots={handleCopySlots}
        existingSlots={filteredSlots}
        onDeleteSlot={handleDeleteSlot}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Intäkter per vecka</h2>
            <Bar
              data={{
                labels: Object.keys(stats),
                datasets: [
                  {
                    label: "Intäkter (kr)",
                    data: Object.values(stats),
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                plugins: { title: { display: false } },
                responsive: true,
                scales: { y: { beginAtZero: true } },
              }}
            />
          </CardContent>
        </Card>

        <BookingList bookings={bookings} onDeleteSlot={handleDeleteBooking} />
      </div>
    </div>
  );
}
