import { NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { getApps, initializeApp, cert } from "firebase-admin/app";
import type { ServiceAccount } from "firebase-admin";

import serviceAccount from "@/firebase/serviceAccount.json";

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
  });
}

const db = getFirestore();

export async function POST(req: Request) {
  const body = await req.json();
  const { date, time, barber } = body;

  if (!date || !time || !barber) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  try {
    await db.collection("slots").add({
      date,
      time,
      barber,
      booked: false,
    });

    return NextResponse.json({ message: "Slot created!" });
  } catch (err) {
    console.error("🔥 Error adding slot:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
