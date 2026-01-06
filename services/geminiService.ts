
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getDesignAdvice = async (userPrompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  if (!apiKey) {
    console.log("No API Key detected. Returning mock response.");
    return "Modo Demostración: Como no se ha detectado una API Key, estoy simulando ser MORK AI. Te recomendaría nuestras cortinas Roller Blackout Pro para máxima privacidad o las Sunscreen Architectural para gestionar la luz natural.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: userPrompt }] }
      ],
      config: {
        systemInstruction: `Eres 'MORK AI', un diseñador de interiores experto en sistemas de cortinas roller motorizadas y minimalistas. 
        Tu objetivo es sugerir cortinas roller de alta gama, sistemas blackout y sunscreen. 
        Sé profesional, elegante y conciso. Usa un lenguaje moderno.
        Menciona productos del catálogo MORK: Roller Blackout Pro, Sunscreen Architectural y Zebra Dual Tech.`,
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Mis sistemas de procesamiento estético están recalibrando. ¿Cómo puedo asistirte hoy con tu arquitectura de ventanas?";
  }
};

export const visualizeCurtains = async (base64Image: string, productName: string, userPrompt: string) => {
  if (!apiKey) {
    console.log("No API Key detected. Skipping image generation.");
    return null; 
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1],
              mimeType: 'image/jpeg',
            },
          },
          {
            text: `Por favor, edita esta imagen de una habitación para mostrar cómo quedarían instaladas unas cortinas roller tipo '${productName}'. 
            Aclaraciones del cliente: ${userPrompt}. 
            Las cortinas deben verse integradas arquitectónicamente, con un estilo minimalista y futurista. 
            Mantén la iluminación realista de la habitación.`,
          },
        ],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    throw error;
  }
};
