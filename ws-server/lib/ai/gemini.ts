import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { personalities } from './personalities';
dotenv.config();

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function getGeminiResponse(prompt: string, contextMessages: string[], personality: keyof typeof personalities = "supportive"): Promise<string> {

  const bot = personalities[personality] || personalities.supportive;
  const context = contextMessages.join('\n');
  const fullPrompt = `${context}\n\nUser: ${prompt}\nAI:`;

  try {
    const result = await genAI.models.generateContent({
      model: 'models/gemini-1.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: bot.systemPrompt }]
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
