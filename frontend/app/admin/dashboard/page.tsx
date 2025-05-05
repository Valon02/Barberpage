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
  createBulkSlots,
  deleteSlot,
  createSingleSlot,
  copySlotsToDate,
} from "@/utils/adminApi";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BookingList from "./components/BookingList";
import CalendarPicker from "./components/CalendarPicker";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title);

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [slots, setSlots] = useState<any[]>([]);
  const [stats, setStats] = useState<{ [key: string]: number }>({});
  const [singleDate, setSingleDate] = useState("");
  const [singleTime, setSingleTime] = useState("");
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
    data.forEach((b) => {
      const week =
        format(parseISO(b.date), "yyyy-MM") +
        " v" +
        getWeekNumber(new Date(b.date));
      grouped[week] = (grouped[week] || 0) + (b.price || 250);
    });
    setStats(grouped);
  };

  const getWeekNumber = (date: Date) => {
    const onejan = new Date(date.getFullYear(), 0, 1);
    const millisecsInDay = 86400000;
    return Math.ceil(
      ((date.getTime() - onejan.getTime()) / millisecsInDay +
        onejan.getDay() +
        1) /
        7
    );
  };

  const handleCreateSlots = async () => {
    const created = await createBulkSlots({
      days: [1, 2, 3, 4, 5],
      startHour: 9,
      endHour: 17,
      interval: 30,
    });
    if (created) {
      alert("Tider skapade!");
      fetchAllData();
    }
  };

  const handleAddSingleSlot = async () => {
    if (!singleDate || !singleTime) return;
    await createSingleSlot({ date: singleDate, time: singleTime, barber });
    fetchAllData();
    setSingleDate("");
    setSingleTime("");
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

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Adminpanel</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">Totala bokningar</h2>
            <p className="text-3xl font-bold">{bookings.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">Totala tider</h2>
            <p className="text-3xl font-bold">{slots.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">Totala intäkter</h2>
            <p className="text-3xl font-bold">
              {bookings.reduce((acc, b) => acc + (b.price || 250), 0)} kr
            </p>
          </CardContent>
        </Card>
      </div>

      <CalendarPicker
        singleDate={singleDate}
        singleTime={singleTime}
        barber={barber}
        onDateChange={setSingleDate}
        onTimeChange={setSingleTime}
        onBarberChange={setBarber}
        onAddSlot={handleAddSingleSlot}
        copyFromDate={copyFromDate}
        copyToDate={copyToDate}
        onCopyChangeFrom={setCopyFromDate}
        onCopyChangeTo={setCopyToDate}
        onCopySlots={handleCopySlots}
        onCreateBulk={handleCreateSlots}
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

        <BookingList bookings={bookings} onDeleteSlot={handleDeleteSlot} />
      </div>
    </div>
  );
}
