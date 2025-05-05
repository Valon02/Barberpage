import { addDoc, collection, serverTimestamp, updateDoc, getDocs, query, where, doc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

export const saveBooking = async ({
  userId,
  name,
  phone,
  date,
  time,
  service,
  price,
  barber,
}: {
  userId?: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  service: string;
  price: number;
  barber: string;
}) => {
  try {
    const bookingsRef = collection(db, "bookings");
    const yearMonth = date.slice(0, 7);

    await addDoc(bookingsRef, {
      userId: userId || null,
      name,
      phone,
      date,
      time,
      service,
      price,
      barber,
      yearMonth,
      createdAt: serverTimestamp(),
    });

    const slotQuery = query(
      collection(db, "slots"),
      where("date", "==", date),
      where("time", "==", time),
      where("barber", "==", barber)
    );

    const slotSnap = await getDocs(slotQuery);
    if (!slotSnap.empty) {
      const slotDoc = slotSnap.docs[0];
      await updateDoc(doc(db, "slots", slotDoc.id), { booked: true });
    }

    return true;
  } catch (err) {
    console.error("❌ Fel vid bokning:", err);
    return false;
  }
};
