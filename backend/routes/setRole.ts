import express, { Request, Response } from "express";
import admin from "../firebase"; // 👈 importera från din centraliserade setup

const router = express.Router();

router.post("/set-role", async (req: Request, res: Response) => {
  const { uid, role } = req.body;

  try {
    await admin.auth().setCustomUserClaims(uid, { role });
    res.send(`✅ Roll uppdaterad till: ${role}`);
  } catch (err) {
    console.error("🔥 Fel:", err);
    res.status(500).send("❌ Kunde inte uppdatera rollen.");
  }
});

export default router;
