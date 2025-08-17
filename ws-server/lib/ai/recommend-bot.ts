import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function getBotRecommendation(onboardingData: Record<string, any>) {
  const prompt = `
  The user has completed an onboarding questionnaire. 
  Based on their answers, suggest which AI therapist bot would best fit them.

  Onboarding answers:
  ${JSON.stringify(onboardingData, null, 2)}

  Available bot personalities:
  - Practical Coach (Solution-oriented, gives actionable steps)
  - Supportive Therapist (Gentle, encouraging, focused on emotional support)
  - Friendly Companion (Casual, empathetic, like a supportive friend)

  Return ONLY the bot name that is the best fit.
  `;

  try {
    const result = await genAI.models.generateContent({
      model: 'models/gemini-1.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    return text || "Supportive Therapist"; 
  } catch (err) {
    console.error("Gemini bot recommendation error:", err);
    return "Supportive Therapist";
  }
}
