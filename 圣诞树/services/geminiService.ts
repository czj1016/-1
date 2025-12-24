
import { GoogleGenAI, Type } from "@google/genai";
import { HolidayGreeting } from "../types";

export const generateHolidayGreeting = async (recipient: string = "zxy"): Promise<HolidayGreeting> => {
  // Use process.env.API_KEY directly as required by the SDK guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a luxury, elegant, and warm Christmas greeting for ${recipient}. 
      The tone should be sophisticated, cinematic, and heartfelt. 
      Keep it to around 2-3 sentences. Return it in JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            message: { type: Type.STRING },
            sender: { type: Type.STRING }
          },
          required: ["message", "sender"]
        }
      }
    });

    // Directly access the text property (it is not a method)
    const json = JSON.parse(response.text || '{}');
    return {
      message: json.message || "May your holidays be filled with the brilliance of golden light and the warmth of a thousand emerald dreams.",
      sender: "Arix Signature"
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      message: "May your holidays be filled with the brilliance of golden light and the warmth of a thousand emerald dreams.",
      sender: "Arix Signature"
    };
  }
};
