import express, { Request, Response } from "express";
import { db } from "../firebase";

const router = express.Router();

/* ---------- Hämta alla bokningar ---------- */
router.get("/", async (_req: Request, res: Response): Promise<void> => {
  try {
    const snap = await db.collection("bookings").get();

    // Tom samling ⇒ returnera tom array (inte 500-fel)
    if (snap.empty) {
      res.status(200).json([]);
      return;
    }

    const bookings = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json(bookings);
  } catch (e) {
    console.error("❌ Hämta bokningar:", e);
    res.status(500).send("Serverfel");
  }
});

/* ---------- Skapa bokning ---------- */
router.post("/", async (req: Request, res: Response): Promise<void> => {
  const { userId, name, phone, email, date, time, service, price, barber } =
    req.body;

  if (!date || !time || !barber || !service) {
    res.status(400).json({ message: "Saknar obligatoriska fält" });
    return;
  }

  try {
    const bookRef = await db.collection("bookings").add({
      userId: userId ?? null,
      name: name || "Gäst",
      phone: phone || "okänd",
      email: email || "okänd",
      date,
      time,
      service,
      price: price || 250,
      barber,
      yearMonth: date.slice(0, 7),
      createdAt: new Date(),
    });

    /* Lägg ev. andra halvan av sloten om det är “Hår + Skägg” */
    const times: string[] = [time];
    const [h, m] = time.split(":");
    if (service === "Hår + Skägg") {
      const next = `${+h + (m === "30" ? 1 : 0)}:${m === "30" ? "00" : "30"}`;
      times.push(next);
    }

    const slotSnap = await db
      .collection("slots")
      .where("date", "==", date)
      .where("barber", "==", barber)
      .where("time", "in", times)
      .get();

    for (const s of slotSnap.docs) {
      await db.collection("slots").doc(s.id).update({ booked: true });
    }

    res.status(200).json({ bookingId: bookRef.id });
  } catch (e) {
    console.error("❌ Skapa bokning:", e);
    res.status(500).json({ message: "Serverfel" });
  }
});

/* ---------- Avboka bokning ---------- */
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const docRef = db.collection("bookings").doc(id);
    const snap = await docRef.get();

    if (!snap.exists) {
      res.status(404).json({ message: "Bokningen finns inte" });
      return;
    }

    const { date, time, barber, service } = snap.data() as any;

    const times: string[] = [time];
    const [h, m] = time.split(":");
    if (service === "Hår + Skägg") {
      const next = `${+h + (m === "30" ? 1 : 0)}:${m === "30" ? "00" : "30"}`;
      times.push(next);
    }

    const slotSnap = await db
      .collection("slots")
      .where("date", "==", date)
      .where("barber", "==", barber)
      .where("time", "in", times)
      .get();

    for (const s of slotSnap.docs) {
      await db.collection("slots").doc(s.id).update({ booked: false });
    }

    await docRef.delete();
    res.status(200).json({ message: "Bokningen är avbokad." });
  } catch (e) {
    console.error("❌ Avboka:", e);
    res.status(500).json({ message: "Serverfel" });
  }
});

export default router;
