import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import type { ServiceAccount } from "firebase-admin";

// 🔐 Läs base64 och konvertera till JSON
const decoded = Buffer.from(process.env.FIREBASE_KEY_BASE64!, "base64").toString("utf-8");
const serviceAccount = JSON.parse(decoded) as ServiceAccount;

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

export const db = getFirestore();
