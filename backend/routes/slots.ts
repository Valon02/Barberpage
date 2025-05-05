import express, { Request, Response } from "express";
import admin from "../firebase"; // ✅ centraliserad Firebase-init

const db = admin.firestore();
const router = express.Router();

// 🔹 Hämta alla slots
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const snapshot = await db.collection("slots").get();
    const slots = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(slots);
  } catch (error) {
    console.error("GET / error:", error);
    res.status(500).json({ message: "Fel vid hämtning av slots" });
  }
});

// 🔹 Skapa en individuell slot
router.post("/create", async (req: Request, res: Response): Promise<void> => {
  const { date, time, barber } = req.body;

  if (!date || !time || !barber) {
    res.status(400).json({ message: "Alla fält krävs" });
    return;
  }

  try {
    const exists = await db
      .collection("slots")
      .where("date", "==", date)
      .where("time", "==", time)
      .where("barber", "==", barber)
      .get();

    if (!exists.empty) {
      res.status(409).json({ message: "Slot finns redan" });
      return;
    }

    await db.collection("slots").add({
      date,
      time,
      barber,
      booked: false,
    });

    res.json({ message: "✅ Slot skapad!" });
  } catch (err) {
    console.error("POST /create error:", err);
    res.status(500).json({ message: "Fel vid skapande av slot" });
  }
});

// 🔹 Kopiera slots från en dag till en annan
router.post("/copy-day", async (req: Request, res: Response): Promise<void> => {
  const { fromDate, toDate, barber } = req.body;

  if (!fromDate || !toDate || !barber) {
    res.status(400).json({ message: "fromDate, toDate och barber krävs" });
    return;
  }

  try {
    const snapshot = await db
      .collection("slots")
      .where("date", "==", fromDate)
      .where("barber", "==", barber)
      .get();

    const copied: string[] = [];

    for (const doc of snapshot.docs) {
      const data = doc.data();

      const exists = await db
        .collection("slots")
        .where("date", "==", toDate)
        .where("time", "==", data.time)
        .where("barber", "==", barber)
        .get();

      if (exists.empty) {
        await db.collection("slots").add({
          date: toDate,
          time: data.time,
          barber,
          booked: false,
        });
        copied.push(data.time);
      }
    }

    res.json({ message: `✅ Kopierade ${copied.length} slots.`, copied });
  } catch (err) {
    console.error("POST /copy-day error:", err);
    res.status(500).json({ message: "Fel vid kopiering" });
  }
});

// 🔹 Ta bort slot
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  const slotId = req.params.id;

  try {
    await db.collection("slots").doc(slotId).delete();
    res.send("❌ Slot borttagen");
  } catch (err) {
    console.error("DELETE / error:", err);
    res.status(500).send("Fel vid radering");
  }
});

export default router;
