/* utils/smartSlotUtils.ts
   -------------------------------------------------------------- */
   "use client";

   import { db } from "@/firebase/firebaseConfig";
   import {
     collection,
     addDoc,
     getDocs,
     query,
     where,
     updateDoc,
     doc,
   } from "firebase/firestore";
   
   /* --------------------------------------------------------------
      Skapa 30-min-slots för EN specifik dag (client-side/Firebase)
      -------------------------------------------------------------- */
   export async function createSmartSlots({
     date,
     startHour,
     endHour,
     barber,
   }: {
     date: string;
     startHour: number;
     endHour: number;
     barber: string;
   }): Promise<boolean> {
     const slotsRef = collection(db, "slots");
   
     /* hämta redan skapade tider för dagen + barber */
     const existingSnap = await getDocs(
       query(
         slotsRef,
         where("date", "==", date),
         where("barber", "==", barber)
       )
     );
     const existingTimes = new Set(
       existingSnap.docs.map((d) => (d.data() as any).time)
     );
   
     /* generera var 30:e minut mellan startHour-endHour (exkl. endHour) */
     const tasks: Promise<any>[] = [];
     for (let h = startHour; h < endHour; h++) {
       for (const m of [0, 30]) {
         const t = `${String(h).padStart(2, "0")}:${m === 0 ? "00" : "30"}`;
         if (!existingTimes.has(t)) {
           tasks.push(
             addDoc(slotsRef, { date, time: t, barber, booked: false })
           );
         }
       }
     }
   
     await Promise.all(tasks);
     return true;
   }
   
   /* --------------------------------------------------------------
      Boka slot/slottar (1 eller 2 beroende på service)
      -------------------------------------------------------------- */
   export async function bookSmartSlot({
     userId,
     name,
     phone,
     email,
     date,
     time,
     service,
     price,
     barber,
   }: {
     userId?: string;
     name: string;
     phone: string;
     email: string;
     date: string;
     time: string;
     service: "Hår" | "Hår + Skägg";
     price: number;
     barber: string;
   }): Promise<boolean> {
     const slotsRef = collection(db, "slots");
     const bookingsRef = collection(db, "bookings");
   
     /* vilka tider krävs? */
     const [h, m] = time.split(":").map(Number);
     const next = `${h + (m === 30 ? 1 : 0)}:${m === 30 ? "00" : "30"}`;
     const timesNeeded = service === "Hår + Skägg" ? [time, next] : [time];
   
     /* finns de lediga? */
     const availSnap = await getDocs(
       query(
         slotsRef,
         where("date", "==", date),
         where("barber", "==", barber),
         where("time", "in", timesNeeded)
       )
     );
     const toBook = availSnap.docs.filter((d) => !(d.data() as any).booked);
     if (toBook.length < timesNeeded.length) return false;
   
     /* skapa booking-dokument */
     await addDoc(bookingsRef, {
       userId: userId || null,
       name,
       phone,
       email,
       date,
       time,
       service,
       price,
       barber,
       yearMonth: date.slice(0, 7),
       createdAt: new Date(),
     });
   
     /* markera slot(ar) som bokade */
     await Promise.all(
       toBook.map((d) => updateDoc(doc(db, "slots", d.id), { booked: true }))
     );
     return true;
   }
   