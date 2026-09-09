/**
 * GET /api/config — Vercel Serverless Function
 *
 * É a resposta desta rota que faz o bootConfig() do dashboard entrar em
 * "modo proxy": as chaves ficam no processo da função e nunca chegam ao
 * navegador. Nada de secreto sai daqui — só se cada chave existe, para o
 * front decidir se liga o chat e o widget de clima.
 *
 * As respostas usam a API http do Node (writeHead/end) em vez dos helpers
 * res.status().json() da Vercel: funciona igual em qualquer runtime Node.
 */
const DEFAULT_MODELS =
  "gemini-3.8-flash,gemini-3.6-flash,gemini-3.5-flash,gemini-flash-latest";

function json(res, code, body) {
  res.writeHead(code, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  res.end(JSON.stringify(body));
}

export default function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    return json(res, 405, { error: "use GET" });
  }
  json(res, 200, {
    proxy: true,
    chat: !!process.env.GEMINI_API_KEY,
    weather: !!process.env.OPENWEATHER_API_KEY,
    models: (process.env.GEMINI_MODELS || DEFAULT_MODELS)
      .split(",").map(s => s.trim()).filter(Boolean),
  });
}
