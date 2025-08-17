import { NextResponse } from 'next/server';

const personalities = {
  supportive: {
    name: "Supportive Therapist",
    description: "Gentle, encouraging, focused on emotional support."
  },
  practical: {
    name: "Practical Coach", 
    description: "Solution-oriented, gives actionable steps."
  },
  friendly: {
    name: "Friendly Companion",
    description: "Casual, empathetic, like a supportive friend."
  }
};

export async function GET() {
  return NextResponse.json({ personalities });
}
