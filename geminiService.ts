
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getBiblicalInsight = async (verse: string, context: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analise o versículo "${verse}" no contexto de: ${context}. Forneça: 1. Significado Original, 2. Aplicação para hoje, 3. Uma oração curta. Use Markdown.`,
  });
  return response.text;
};

export const askMentor = async (question: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Você é um Mentor Bíblico sábio e acolhedor. Responda à seguinte dúvida de forma bíblica e encorajadora: "${question}"`,
  });
  return response.text;
};

export const generateQuizAI = async (topic: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Gere 3 perguntas de quiz sobre o tema "${topic}". Retorne apenas JSON seguindo este esquema: Array<{question: string, options: string[], correctIndex: number}>`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctIndex: { type: Type.NUMBER }
          },
          required: ["question", "options", "correctIndex"]
        }
      }
    }
  });
  
  const text = response.text;
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Erro ao parsear JSON do Quiz:", e);
    return null;
  }
};

export const generatePrayerAI = async (mood: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Escreva uma oração profunda e curta para alguém que está se sentindo: ${mood}. Comece com "Senhor," e termine com "Amém."`,
  });
  return response.text;
};
