import express from "express";
import admin from "../firebase"; // 👈 importera din Firebase-instans

const router = express.Router();
const db = admin.firestore();

router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("bookings").get();
    const bookings = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(bookings);
  } catch (err) {
    console.error("Fel vid hämtning av bokningar:", err);
    res.status(500).send("Serverfel");
  }
});

export default router;
