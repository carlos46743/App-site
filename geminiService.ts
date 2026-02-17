
import { GoogleGenAI, Type, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Auxiliares de Áudio conforme diretrizes
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodePCM(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const generateSpeechAI = async (text: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Leia esta oração com calma e reverência: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' }, // Voz calma e profunda
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  return base64Audio ? decodeBase64(base64Audio) : null;
};

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
