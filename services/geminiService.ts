
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  /**
   * Checks if the API Key is provided in the environment.
   */
  static isConfigured(): boolean {
    return (
      !!process.env.API_KEY &&
      process.env.API_KEY !== "undefined" &&
      process.env.API_KEY !== ""
    );
  }

  private static getAI() {
    if (!this.isConfigured()) {
      console.warn("API Key missing for GeminiService");
      throw new Error("API_KEY_MISSING");
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  static async getDesignAdvice(prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
    if (!this.isConfigured()) {
        return "Modo Demostración: Como no se ha detectado una API Key, estoy simulando ser MORK AI. Te recomendaría nuestras cortinas Roller Blackout Pro para máxima privacidad o las Sunscreen Architectural para gestionar la luz natural. Visítanos en La Plata.";
    }
    try {
      const ai = this.getAI();
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [
            ...history,
            { role: 'user', parts: [{ text: prompt }] }
        ],
        config: {
          systemInstruction:
            `Eres 'MORK AI', un consultor de arquitectura e iluminación para MORK (Minimalist Window Tech).
        
            IDENTIDAD:
            - Tono: Profesional, minimalista, arquitectónico, sofisticado.
            - Formato: Usa MARKDOWN para estructurar tu respuesta (negritas **texto**, listas bullets, etc).
            - RESTRICCIÓN: NO uses emojis ni iconos visuales en el texto.
            
            INFORMACIÓN DE LA EMPRESA:
            - Ubicación: Calle 17 y 50 N° 903, La Plata.
            - Horarios: Lunes a Viernes 09:00 - 18:00, Sábados 10:00 - 14:00.
            - Enfoque: Control solar, privacidad, domótica, diseño minimalista.
            
            CATÁLOGO PRINCIPAL:
            1. Roller Blackout Pro: Oscuridad total, privacidad máxima. Ideal dormitorios/proyección.
            2. Sunscreen Architectural: Filtra UV, visión al exterior, luz difusa. Ideal livings/oficinas.
            3. Zebra Dual Tech: Bandas alternadas para control dinámico de luz. Versatilidad.
            4. Ultra Motorized: Automatización inteligente (recomienda esto para casas inteligentes).
    
            OBJETIVO:
            Asesora al cliente sobre qué cortina elegir según su necesidad de luz y privacidad. Invítalos al showroom si piden ver muestras. Sé conciso.`,
        },
      });
      return response.text;
    } catch (error: any) {
      if (error.message === "API_KEY_MISSING") return "Error: API Key faltante.";
      console.error("Gemini API Error:", error);
      return "Mis sistemas están recalibrando. Por favor intente nuevamente en unos instantes.";
    }
  }

  /**
   * Simulates room visualization. 
   * Real implementation would require an Image-to-Image model or specific Inpainting endpoint.
   */
  static async visualizeCurtains(base64Image: string, productName: string, userPrompt: string) {
    console.log(`[GeminiService] Visualizing ${productName} with prompt: ${userPrompt}`);
    
    // Simulate processing delay for UX
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Return original image for now (Mock)
    return base64Image;
  }
}
