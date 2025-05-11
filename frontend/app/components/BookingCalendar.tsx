import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { fetchBookings } from '@/utils/bookingApi';


interface Booking {
  service: string;
  date: string;
}

const BookingCalendar = () => {
  // ✅ Skapa en state-variabel för kalenderns events
  const [events, setEvents] = useState<{ title: string; start: string }[]>([]);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data: Booking[] = await fetchBookings();
        setEvents(
          data.map((booking) => ({
            title: booking.service,
            start: booking.date,
          }))
        );
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    loadBookings();
  }, []);

  return (
    <FullCalendar 
      plugins={[dayGridPlugin]} 
      initialView="dayGridMonth" 
      events={events} 
    />
  );
};

export default BookingCalendar;
