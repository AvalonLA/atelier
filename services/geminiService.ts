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

  static async getDesignAdvice(
    prompt: string,
    history: { role: "user" | "model"; parts: { text: string }[] }[],
  ) {
    if (!this.isConfigured()) {
      return "Modo Demostración: Como no se ha detectado una API Key, estoy simulando ser ATELIER AI. Te recomendaría nuestra línea Orbital Suspension para espacios centrales o Monolith Floor para iluminación ambiental. Visítanos en nuestro showroom.";
    }
    try {
      const ai = this.getAI();
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [...history, { role: "user", parts: [{ text: prompt }] }],
        config: {
          systemInstruction: `Eres 'ATELIER AI', un consultor de iluminación arquitectónica para ATELIER.
        
            IDENTIDAD:
            - Tono: Sofisticado, técnico, artístico, minimalista. Hable de "temperatura de luz", "índice de reproducción cromática (CRI)", "lúmenes" y "atmósfera".
            - Formato: Usa MARKDOWN para estructurar tu respuesta (negritas **texto**, listas bullets, etc).
            - RESTRICCIÓN: NO uses emojis ni iconos visuales en el texto.
            
            INFORMACIÓN DE LA EMPRESA:
            - Concepto: "Arquitectura de la Luz". No vendemos lámparas, creamos atmósferas.
            - Enfoque: Diseño paramétrico, LEDs de alta fidelidad, integración Smart Home (Matter/DALI).
            
            CATÁLOGO PRINCIPAL:
            1. PENDANT (Suspensión): Orbital, Linear. Para comedores, recepciones, doble altura.
            2. FLOOR (Pie): Monolith, Arc. Luz indirecta, esculturas lumínicas.
            3. TABLE (Mesa): Lumina, Task. Para trabajo de precisión o lectura.
            4. TECH (Smart): Paneles modulares, tiras LED inteligentes.
    
            OBJETIVO:
            Asesora al cliente sobre cómo esculpir el espacio con luz. Pregunta por el uso del espacio (trabajo, relax, social) y recomienda temperatura y tipo de luminaria.`,
        },
      });
      return response.text;
    } catch (error: any) {
      if (error.message === "API_KEY_MISSING")
        return "Error: API Key faltante.";
      console.error("Gemini API Error:", error);
      return "Mis sistemas están recalibrando. Por favor intente nuevamente en unos instantes.";
    }
  }

  /**
   * Simulates room visualization.
   * Real implementation would require an Image-to-Image model or specific Inpainting endpoint.
   */
  static async visualizeLighting(
    base64Image: string,
    productName: string,
    userPrompt: string,
  ) {
    console.log(
      `[GeminiService] Visualizing lighting for ${productName} with prompt: ${userPrompt}`,
    );

    // Simulate processing delay for UX
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Return original image for now (Mock)
    return base64Image;
  }
}
