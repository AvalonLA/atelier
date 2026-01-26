import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  /**
   * Checks if the API Key is provided in the environment.
   */
  static isConfigured(): boolean {
    return (
      !!import.meta.env.VITE_API_KEY &&
      import.meta.env.VITE_API_KEY !== "undefined" &&
      import.meta.env.VITE_API_KEY !== ""
    );
  }

  private static getAI() {
    if (!this.isConfigured()) {
      console.warn("API Key missing for GeminiService");
      throw new Error("API_KEY_MISSING");
    }
    return new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
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
        model: "gemini-2.0-flash-exp",
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
   * Generates a simulation of the product in the user's room.
   * 1. Analyses the room and product using Gemini 1.5 Flash.
   * 2. Generates a new image description.
   * 3. Uses a generative image model to create the visual.
   */
  static async visualizeLighting(
    roomImageBase64: string,
    productImageBase64: string,
    productName: string,
    userPrompt: string,
  ) {
    if (!this.isConfigured()) {
      console.warn("API Key missing");
      return roomImageBase64;
    }

    try {
      const ai = this.getAI();

      // Step 1: Describe the composition
      const analysisPrompt = `
            Act as an expert interior designer and 3D visualizer.
            I will provide two images:
            1. An image of a room (The Base).
            2. An image of a lighting product (The Object).

            User Request: "${userPrompt}"

            TASK:
            Create a highly detailed Prompt for an AI Image Generator to generate a PHOTO-REALISTIC image of this EXACT room but with the lighting product installed in a natural, logical position (ceiling for pendant, floor for floor lamp, etc).
            
            The new image must:
            - Maintain the same style, colors, and furniture of the room.
            - Show the product clearly.
            - Apply the lighting effects requested (day/night/sunset).
            - BE REALISTIC.
            
            Return ONLY the Prompt text in English.
        `;

      const cleanRoom = roomImageBase64.includes(",")
        ? roomImageBase64.split(",")[1]
        : roomImageBase64;
      const cleanProduct = productImageBase64.includes(",")
        ? productImageBase64.split(",")[1]
        : productImageBase64;

      const descriptionResult = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              { text: analysisPrompt },
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: cleanRoom,
                },
              },
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: cleanProduct,
                },
              },
            ],
          },
        ],
      });

      const imagePrompt = descriptionResult.text();
      console.log("Generated Prompt for Image:", imagePrompt);

      // Step 2: Generate the Image
      try {
        const imageResponse = await ai.models.generateContent({
          model: "gemini-3-pro-image-preview",
          contents: {
            parts: [
              {
                text: imagePrompt,
              },
            ],
          },
          config: {
            imageConfig: {
              aspectRatio: "1:1",
              imageSize: "1024x1024",
            },
          },
        });

        for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
          }
        }

        return roomImageBase64;
      } catch (e) {
        console.error("Image gen failed", e);
        return roomImageBase64;
      }
    } catch (error) {
      console.error("Gemini Vision Error:", error);
      return roomImageBase64;
    }
  }
}
