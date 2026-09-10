/**
 * GET /api/weather?lat=..&lon=.. — Vercel Serverless Function
 *
 * Proxy para o OpenWeatherMap. A OPENWEATHER_API_KEY fica nas Environment
 * Variables do projeto e é usada só aqui: o navegador recebe a previsão já
 * pronta e nunca vê a chave.
 */
function json(res, code, body) {
  res.writeHead(code, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  res.end(JSON.stringify(body));
}

/* O widget de clima é chamado pelo próprio dashboard. Aceitamos requisições da
   mesma origem (ou de ALLOWED_ORIGINS) e, sem Origin/Referer, só de loopback —
   o que mantém o curl local viável sem deixar a chave aberta na internet. */
function originOk(req) {
  const allowed = new Set(
    (process.env.ALLOWED_ORIGINS || "").split(",")
      .map(s => s.trim().replace(/\/+$/, "")).filter(Boolean)
  );
  const raw = req.headers.origin || req.headers.referer || "";
  if (!raw) {
    const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim()
      || req.socket?.remoteAddress || "";
    return /^(::1|::ffff:127\.|127\.)/.test(ip);
  }
  let o;
  try { o = new URL(raw); } catch { return false; }
  if (allowed.has(`${o.protocol}//${o.host}`)) return true;
  const host = String(req.headers.host || "");
  return !!host && o.host === host;
}

export default async function handler(req, res) {
  if (req.method !== "GET") return json(res, 405, { error: "use GET" });
  if (!originOk(req)) return json(res, 403, { error: "origem não autorizada" });

  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) return json(res, 503, { error: "OPENWEATHER_API_KEY não configurada" });

  const u = new URL(req.url, "http://localhost");
  const lat = Number(u.searchParams.get("lat"));
  const lon = Number(u.searchParams.get("lon"));
  if (!Number.isFinite(lat) || !Number.isFinite(lon) ||
      Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    return json(res, 400, { error: "lat/lon inválidos" });
  }

  const api = "https://api.openweathermap.org/data/2.5/weather"
    + `?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${encodeURIComponent(key)}`;
  try {
    const r = await fetch(api);
    return json(res, r.status, await r.json());
  } catch (e) {
    return json(res, 502, { error: e.message });
  }
}
