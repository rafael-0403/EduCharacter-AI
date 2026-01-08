
import { GoogleGenAI, Type } from "@google/genai";
import { CharacterScores } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeCharacterQuiz = async (answer: string): Promise<{ scores: CharacterScores; feedback: string }> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analisis jawaban siswa berikut untuk menilai karakteristiknya. Berikan skor 0-100 untuk kategori: Disiplin, Kejujuran, Kerja Sama, Empati, Tanggung Jawab, Kesopanan.
    Jawaban: "${answer}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          scores: {
            type: Type.OBJECT,
            properties: {
              disiplin: { type: Type.NUMBER },
              kejujuran: { type: Type.NUMBER },
              kerjaSama: { type: Type.NUMBER },
              empati: { type: Type.NUMBER },
              tanggungJawab: { type: Type.NUMBER },
              kesopanan: { type: Type.NUMBER },
            },
            required: ["disiplin", "kejujuran", "kerjaSama", "empati", "tanggungJawab", "kesopanan"]
          },
          feedback: { type: Type.STRING }
        },
        required: ["scores", "feedback"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const getAISuggestions = async (category: string, score: number): Promise<{ physical: string; game: string; reflective: string }> => {
  const prompt = `Berikan saran untuk siswa yang memiliki nilai rendah (${score}/100) di kategori ${category}. Berikan: 
  1. Aktivitas fisik untuk melatih kategori ini.
  2. Permainan untuk meningkatkan kategori ini.
  3. Topik percakapan reflektif.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          physical: { type: Type.STRING },
          game: { type: Type.STRING },
          reflective: { type: Type.STRING }
        },
        required: ["physical", "game", "reflective"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const getCounselingResponse = async (history: { role: 'user' | 'model', text: string }[], message: string): Promise<string> => {
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: 'Anda adalah seorang konselor sekolah yang ramah, empatik, dan bijaksana. Tugas Anda adalah mendengarkan siswa, memberikan dukungan moral, dan membantu mereka merefleksikan perilaku atau masalah mereka di sekolah dengan cara yang positif. Gunakan bahasa Indonesia yang santun namun tetap akrab bagi remaja.',
    }
  });

  // Sending history could be done here if needed, but for simplicity we'll just send the message
  // Note: Standard chat interface usually sends the full history. 
  // For this implementation, we will just send the single message as per your simple chat logic.
  const response = await chat.sendMessage({ message });
  return response.text || "Maaf, saya tidak bisa merespon saat ini.";
};
