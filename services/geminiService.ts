import { GoogleGenAI } from "@google/genai";
import { Incident, MoodLog } from "../types";

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

export const getWeeklyReport = async (
  moodLogs: MoodLog[],
  incidents: Incident[],
  petName: string
): Promise<string> => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentMoods = moodLogs.filter(l => new Date(l.date) >= sevenDaysAgo);
  const recentIncidents = incidents.filter(i => new Date(i.date) >= sevenDaysAgo);
  const avgMood = recentMoods.length
    ? (recentMoods.reduce((sum, l) => sum + l.mood, 0) / recentMoods.length).toFixed(1)
    : 'N/A';

  const prompt = `
    You are a professional animal behaviorist.
    Generate a brief weekly wellness summary for a pet named ${petName}.

    Last 7 days data:
    - Mood logs (1=very anxious, 5=very calm): ${JSON.stringify(recentMoods.map(l => ({ date: l.date, mood: l.mood })))}
    - Average mood score: ${avgMood}/5
    - Anxiety incidents: ${JSON.stringify(recentIncidents.map(i => ({ trigger: i.trigger, severity: i.severity, date: i.date })))}

    Provide a 2-3 sentence weekly summary covering:
    1. Overall trend (improving/stable/concerning)
    2. Any notable pattern in triggers or timing
    3. One specific recommendation for next week

    Keep it concise, warm, and actionable. Start with "${petName}'s week:"
  `;

  try {
    return await callGemini(prompt);
  } catch (error) {
    console.error("Weekly report error:", error);
    return "Unable to generate weekly report. Please try again later.";
  }
};

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
