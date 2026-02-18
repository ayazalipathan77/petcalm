import { GoogleGenAI } from "@google/genai";
import { Incident } from "../types";

// When GEMINI_PROXY_URL is set, requests go through the Cloudflare Worker proxy
// (API key stays server-side). Otherwise falls back to direct API access.
const proxyUrl = process.env.GEMINI_PROXY_URL || '';
const apiKey = process.env.API_KEY || '';

const ai = !proxyUrl && apiKey ? new GoogleGenAI({ apiKey }) : null;

const MODEL = 'gemini-2.0-flash';

async function callGemini(prompt: string): Promise<string> {
  // Proxy path: API key never in the client bundle
  if (proxyUrl) {
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      }),
    });
    if (!response.ok) throw new Error(`Proxy error: ${response.status}`);
    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI.';
  }

  // Direct path (dev only — key exposed in bundle, use proxy for production)
  if (ai) {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
    });
    return response.text || 'No insights available at this time.';
  }

  return 'AI Insights are not configured. Set GEMINI_PROXY_URL or GEMINI_API_KEY.';
}

export const getBehaviorAnalysis = async (incidents: Incident[], petName: string): Promise<string> => {
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
    return await callGemini(prompt);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to generate insights at this moment. Please try again later.";
  }
};
