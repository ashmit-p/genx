// import { GoogleGenAI } from '@google/genai';
// import dotenv from 'dotenv';
// dotenv.config();

// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// export async function getGeminiResponse(prompt: string): Promise<string> {
//   const response = await ai.models.generateContent({
//     model: 'gemini-2.0-flash', 
//     contents: prompt,
//   });
//   return response.text ?? "Sorry, I could not generate an answer.";
// }

// ws-server/lib/ai/gemini.ts
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function getGeminiResponse(prompt: string, contextMessages: string[]): Promise<string> {

  const context = contextMessages.join('\n');
  const fullPrompt = `${context}\n\nUser: ${prompt}\nAI:`;

  try {
    const result = await genAI.models.generateContent({
      model: 'models/gemini-1.5-flash',
      contents: [
        {
          role: 'user', 
          parts: [
            {
              text:
               `You are a supportive AI therapist.
      
               Guidelines:
                - You may provide emotional support, coping strategies, psychoeducation, and encouragement.
                - Always tailor your tone to be gentle, professional, and encouraging.
                - If a user requests a specific language, try to respond in that language.
                - If a question is unrelated to mental health or emotional wellness, politely respond:
                  "I'm here to support your mental well-being. Please ask a question related to mental health or emotional wellness."
                Never provide medical diagnoses, crisis interventions, or emergency advice. Encourage users to seek help from a licensed professional if needed.
                Now, respond to the user's concerns with compassion.`,
            },
          ],
        },
        {
          role: 'user', 
          parts: [{ text: fullPrompt }],
        },
      ],
    });

    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || 'Sorry, I could not generate a response.';
  } catch (error: any) {
    console.error('Gemini API error:', error);
    return 'The AI is currently busy. Please try again in a moment.';
  }
}
