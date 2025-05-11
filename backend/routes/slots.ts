import express, { Request, Response } from "express";
import { db } from "../firebase";
import { format, addMinutes, isBefore } from "date-fns";

const router = express.Router();

// GET /api/slots
router.get("/", async (_req: Request, res: Response) => {
  try {
    const snapshot = await db.collection("slots").get();
    const slots = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(slots);
  } catch (err) {
    console.error("❌ Fel vid hämtning av slots:", err);
    res.status(500).json({ message: "Serverfel vid hämtning" });
  }
});

// POST /api/slots
router.post("/", async (req: Request, res: Response) => {
  const { date, time, barber } = req.body;

  if (!date || !time || !barber) {
    res.status(400).json({ message: "Saknar fält" });
    return;
  }

  try {
    await db.collection("slots").add({
      date,
      time,
      barber,
      booked: false,
    });

    res.status(201).json({ message: "Slot skapad!" });
  } catch (err) {
    console.error("❌ Fel vid skapande av slot:", err);
    res.status(500).json({ message: "Serverfel vid skapande" });
  }
});

// DELETE /api/slots/:id
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await db.collection("slots").doc(id).delete();
    res.status(200).json({ message: "Slot borttagen" });
  } catch (err) {
    console.error("❌ Fel vid radering av slot:", err);
    res.status(500).json({ message: "Serverfel vid radering" });
  }
});

// POST /api/slots/bulk
router.post("/bulk", async (req: Request, res: Response) => {
  const { days, startHour, endHour, interval, barber } = req.body;

  if (
    !Array.isArray(days) ||
    typeof startHour !== "number" ||
    typeof endHour !== "number" ||
    typeof interval !== "number" ||
    typeof barber !== "string"
  ) {
    res.status(400).json({ message: "Saknar eller ogiltiga fält" });
    return;
  }

  try {
    const today = new Date();
    let createdCount = 0;

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      if (!days.includes(date.getDay())) continue;

      const dateStr = format(date, "yyyy-MM-dd");

      let currentTime = new Date(date);
      currentTime.setHours(startHour, 0, 0, 0);

      const endTime = new Date(date);
      endTime.setHours(endHour, 0, 0, 0);

      while (isBefore(currentTime, endTime)) {
        const timeStr = format(currentTime, "HH:mm");

        const existing = await db
          .collection("slots")
          .where("date", "==", dateStr)
          .where("time", "==", timeStr)
          .where("barber", "==", barber)
          .get();

        if (existing.empty) {
          await db.collection("slots").add({
            date: dateStr,
            time: timeStr,
            barber,
            booked: false,
          });
          createdCount++;
        }

        currentTime = addMinutes(currentTime, interval);
      }
    }

    res.status(201).json({ message: `✅ Skapade ${createdCount} tider.` });
  } catch (err) {
    console.error("❌ Fel vid bulk-skapande:", err);
    res.status(500).json({ message: "Serverfel vid bulk-skapande" });
  }
});

// POST /api/slots/copy
router.post("/copy", async (req: Request, res: Response) => {
  const { fromDate, toDate, barber } = req.body;

  if (!fromDate || !toDate || !barber) {
    res.status(400).json({ message: "Saknar fält" });
    return;
  }

  try {
    const snapshot = await db
      .collection("slots")
      .where("date", "==", fromDate)
      .where("barber", "==", barber)
      .get();

    if (snapshot.empty) {
      res.status(404).json({ message: "Inga tider att kopiera" });
      return;
    }

    let copied = 0;

    for (const doc of snapshot.docs) {
      const data = doc.data();

      const existing = await db
        .collection("slots")
        .where("date", "==", toDate)
        .where("time", "==", data.time)
        .where("barber", "==", barber)
        .get();

      if (existing.empty) {
        await db.collection("slots").add({
          date: toDate,
          time: data.time,
          barber,
          booked: false,
        });
        copied++;
      }
    }

    res.status(201).json({ message: `✅ Kopierade ${copied} tider.` });
  } catch (err) {
    console.error("❌ Fel vid kopiering av tider:", err);
    res.status(500).json({ message: "Serverfel vid kopiering" });
  }
});

export default router;
