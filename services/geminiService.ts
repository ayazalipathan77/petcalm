import { GoogleGenAI } from "@google/genai";
import { Incident } from "../types";

const apiKey = process.env.API_KEY || '';
// Initialize conditionally to prevent crashing if key is missing during dev, 
// though typical environment assumes it's present.
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const getBehaviorAnalysis = async (incidents: Incident[], petName: string): Promise<string> => {
  if (!ai) {
    return "API Key not configured. Unable to generate insights.";
  }

  const recentIncidents = incidents.slice(0, 5);
  
  const prompt = `
    You are a professional animal behaviorist expert.
    Analyze the following recent anxiety incidents for a pet named ${petName}.
    
    Incidents:
    ${JSON.stringify(recentIncidents)}

    Provide a concise, 3-sentence summary of the pattern you see and 2 actionable, specific training tips to help the owner.
    Keep the tone calming, empathetic, and professional.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "No insights available at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to generate insights at this moment. Please try again later.";
  }
};
