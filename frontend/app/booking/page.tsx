"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "@/styles/calendar-dark.css";
import { format, isBefore, startOfDay } from "date-fns";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { saveBooking } from "@/utils/saveBooking";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const db = getFirestore();

interface TimeSlot {
  time: string;
  booked: boolean;
}

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentViewDate, setCurrentViewDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [barber, setBarber] = useState("fadezbydrizz");
  const [service, setService] = useState("Hår + Skägg");
  const [barberInfo, setBarberInfo] = useState<{ name: string; workingDays: number[] } | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<{ name?: string; phone?: string } | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData({ name: data.name || "", phone: data.phone || "" });
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadBarberInfo = async () => {
      const docSnap = await getDoc(doc(db, "Barbers", barber));
      if (docSnap.exists()) {
        setBarberInfo(docSnap.data() as any);
      }
    };
    loadBarberInfo();
  }, [barber]);

  useEffect(() => {
    const loadSlots = async () => {
      const selectedDateStr = format(selectedDate, "yyyy-MM-dd");

      const snapshot = await getDocs(
        query(
          collection(db, "slots"),
          where("date", "==", selectedDateStr),
          where("barber", "==", barber),
          where("booked", "==", false)
        )
      );

      const fetched: TimeSlot[] = snapshot.docs.map((doc) => ({
        time: doc.data().time,
        booked: false,
      }));

      setTimeSlots(fetched);
      setSelectedTime(null);
    };

    const today = startOfDay(new Date());
    const isFuture = !isBefore(selectedDate, today);
    const isWorkday = barberInfo?.workingDays.includes(selectedDate.getDay());

    if (isFuture && isWorkday) {
      loadSlots();
    } else {
      setTimeSlots([]);
    }
  }, [selectedDate, barberInfo]);

  const handleConfirmBooking = async () => {
    setError("");
    if (!selectedTime) return setError("Välj en tid först.");

    if (!user && (!guestName.trim() || !guestEmail.trim() || !guestPhone.trim())) {
      return setError("Fyll i namn, e-post och telefonnummer.");
    }

    const price = service === "Hår" ? 200 : 250;

    const bookingData = {
      userId: user?.uid || null,
      name: user?.displayName || userData?.name || guestName || "Gäst",
      phone: user?.phoneNumber || userData?.phone || guestPhone || "okänd",
      email: user?.email || guestEmail || "okänd",
      date: format(selectedDate, "yyyy-MM-dd"),
      time: selectedTime,
      service,
      price,
      barber,
    };

    const success = await saveBooking(bookingData);
    if (success) {
      setSuccess("Bokning sparad! 🙌");
      setSelectedTime(null);
      setGuestName("");
      setGuestEmail("");
      setGuestPhone("");
    } else {
      setError("Något gick fel vid bokningen.");
    }
  };

  const today = startOfDay(new Date());
  const minSelectableDate = new Date(2025, 3, 1);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-white">
      {/* Kalender & val */}
      <div className="md:w-1/3 p-6 border-b md:border-b-0 md:border-r border-gray-800">
        <select
          value={barber}
          onChange={(e) => setBarber(e.target.value)}
          className="mb-4 w-full p-3 rounded bg-gray-800 text-white border border-gray-600"
        >
          <option value="fadezbydrizz">FadezbyDrizz</option>
          <option value="blizzfades">Blizz Fades</option>
        </select>

        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="mb-6 w-full p-3 rounded bg-gray-800 text-white border border-gray-600"
        >
          <option value="Hår + Skägg">Hår + Skägg</option>
          <option value="Hår">Hår</option>
        </select>

        <div className="text-center text-white text-xl font-semibold mb-2">
          {format(currentViewDate, "MMMM yyyy")}
        </div>

        <Calendar
          onChange={(value) => setSelectedDate(value as Date)}
          value={selectedDate}
          locale="sv-SE"
          minDate={minSelectableDate}
          maxDetail="month"
          onActiveStartDateChange={({ activeStartDate }) =>
            activeStartDate && setCurrentViewDate(activeStartDate)
          }
          tileDisabled={({ date }) =>
            isBefore(date, today) ||
            !barberInfo?.workingDays.includes(date.getDay())
          }
          tileClassName={({ date }) => {
            const isPast = isBefore(date, today);
            const isSelected =
              format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
            if (isSelected) return "active-date";
            if (isPast) return "disabled-date";
            return null;
          }}
          next2Label={null}
          prev2Label={null}
          className="REACT-CALENDAR bg-gray-900 text-white"
        />

        <p className="text-sm text-gray-400 mt-4">
          Tidszon: Sweden – Stockholm
        </p>
      </div>

      {/* Tider & Formulär */}
      <div className="md:w-1/3 p-6">
        <h3 className="text-xl font-semibold mb-4 capitalize">
          {format(selectedDate, "eeee d MMMM", { locale: undefined })}
        </h3>

        {timeSlots.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {timeSlots.map((slot) => (
              <button
                key={slot.time}
                onClick={() => setSelectedTime(slot.time)}
                className={`py-3 rounded-lg border text-center transition font-medium
                  ${
                    selectedTime === slot.time
                      ? "bg-purple-600 text-white"
                      : "bg-gray-800 hover:bg-gray-700 border-gray-600"
                  }`}
              >
                {slot.time}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 mb-6">Inga tider tillgängliga.</p>
        )}

        {!user && (
          <div className="space-y-3 mb-4">
            <input
              type="text"
              placeholder="För- och efternamn"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
            />
            <input
              type="email"
              placeholder="E-post"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
            />
            <input
              type="tel"
              placeholder="Telefonnummer"
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
            />
          </div>
        )}

        {selectedTime && (
          <button
            onClick={handleConfirmBooking}
            className="mt-2 w-full py-3 bg-green-600 hover:bg-green-700 rounded text-white font-semibold"
          >
            Bekräfta Bokning
          </button>
        )}

        {error && <p className="text-red-400 mt-4">{error}</p>}
        {success && <p className="text-green-400 mt-4">{success}</p>}
      </div>

      {/* Bekräftelse */}
      <div className="md:w-1/3 bg-gray-900 p-6">
        <h4 className="text-xl font-semibold mb-2">{barberInfo?.name}</h4>
        <p className="text-gray-400 mb-4">
          {service === "Hår" ? "200 kr · Hår" : "250 kr · Hår + Skägg"}
        </p>
        {selectedTime && (
          <p className="text-sm text-gray-300">
            Tid: {selectedTime} – {format(selectedDate, "yyyy-MM-dd")}
          </p>
        )}
      </div>
    </div>
  );
}
