// app/api/admin/set-claims/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const { uid } = await req.json();

    if (!uid) {
      return NextResponse.json({ error: "Missing uid" }, { status: 400 });
    }

    // Get role from Firestore
    const userDoc = await adminDb.collection("users").doc(uid).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found in Firestore" }, { status: 404 });
    }

    const role = userDoc.data()?.role || "User";

    // Set custom claim
    await adminAuth.setCustomUserClaims(uid, { role });

    return NextResponse.json({ success: true, uid, role });
  } catch (err) {
    console.error("Error setting custom claims:", err);
    return NextResponse.json({ error: "Failed to set custom claims" }, { status: 500 });
  }
}
