/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase-admin'

export async function POST(req: NextRequest) {
  try {
    const { uid, username, email } = await req.json()

    if (!uid || !username || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: uid, username, email' },
        { status: 400 }
      )
    }

    try {
      await adminAuth.getUser(uid)
    } catch (error) {
      return NextResponse.json(
        { error: 'User not found in authentication system' },
        { status: 404 }
      )
    }

    await adminDb.collection('users').doc(uid).set({
      username: username,
      email: email,
      avatar_url: "",
      role: "User",
      created_at: new Date(),
      updated_at: new Date(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error creating user profile:', error)
    return NextResponse.json(
      { error: 'Failed to create user profile' },
      { status: 500 }
    )
  }
}
