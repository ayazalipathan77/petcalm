/**
 * PetCalm — Cloudflare Worker: Gemini API Proxy
 *
 * Deploy to Cloudflare Workers (free tier: 100,000 req/day):
 *   1. Install Wrangler: npm install -g wrangler
 *   2. wrangler login
 *   3. wrangler secret put GEMINI_API_KEY   (paste your key when prompted)
 *   4. wrangler deploy
 *   5. Copy the worker URL (e.g. https://petcalm.YOUR_ACCOUNT.workers.dev)
 *   6. Add it to your .env:  GEMINI_PROXY_URL=https://petcalm.YOUR_ACCOUNT.workers.dev
 *
 * The app will then call this worker instead of the Gemini API directly.
 * Your API key is stored as a Cloudflare env secret — it never appears in the app bundle.
 */

export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response('Invalid JSON body', { status: 400 });
    }

    const { model = 'gemini-2.0-flash', contents } = body;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': env.GEMINI_API_KEY,
      },
      body: JSON.stringify({ contents }),
    });

    const data = await geminiResponse.json();

    return new Response(JSON.stringify(data), {
      status: geminiResponse.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  },
};
