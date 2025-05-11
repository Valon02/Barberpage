import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";

export async function GET() {
  try {
    const snapshot = await db.collection("bookings").get();
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ Failed to fetch bookings:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
