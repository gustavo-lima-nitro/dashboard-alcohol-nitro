/**
 * Nitro · Alcohol Intelligence — servidor local com proxy (zero dependência)
 *
 * Diferença para o serve.ps1: aqui as chaves do .env NUNCA chegam ao navegador.
 * O front detecta /api/config, entra em "modo proxy" e passa a falar com
 * /api/weather e /api/chat; este processo é quem chama Google e OpenWeather.
 *
 *   node server.mjs
 *
 * Requer Node 18+ (usa fetch nativo). Nenhum pacote é instalado.
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL(".", import.meta.url)));

/* ── .env ────────────────────────────────────────────────────────────────── */
function loadEnv() {
  const out = {};
  const f = join(ROOT, ".env");
  if (!existsSync(f)) return out;
  for (const raw of readFileSync(f, "utf8").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const i = line.indexOf("=");
    if (i < 0) continue;
    let v = line.slice(i + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    out[line.slice(0, i).trim()] = v;
  }
  return out;
}
const ENV = { ...loadEnv(), ...process.env };
const GEMINI_KEY = ENV.GEMINI_API_KEY || "";
const OWM_KEY = ENV.OPENWEATHER_API_KEY || "";
const MODELS = (ENV.GEMINI_MODELS || "gemini-3.8-flash,gemini-3.6-flash,gemini-3.5-flash,gemini-flash-latest")
  .split(",").map(s => s.trim()).filter(Boolean);
const PORT = Number(ENV.PORT || 8080);

/* ── estático ────────────────────────────────────────────────────────────── */
const MIME = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".csv": "text/csv; charset=utf-8",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
  ".ico": "image/x-icon", ".woff2": "font/woff2", ".pdf": "application/pdf",
  ".md": "text/markdown; charset=utf-8",
};

function json(res, code, body) {
  const s = JSON.stringify(body);
  res.writeHead(code, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  res.end(s);
}

function readBody(req, limit = 1_000_000) {
  return new Promise((ok, fail) => {
    let n = 0; const chunks = [];
    req.on("data", c => { n += c.length; if (n > limit) { fail(new Error("payload grande")); req.destroy(); } chunks.push(c); });
    req.on("end", () => ok(Buffer.concat(chunks).toString("utf8")));
    req.on("error", fail);
  });
}

/* ── Gemini com cadeia de fallback ───────────────────────────────────────── */
const RETRYABLE = new Set([404, 408, 409, 429, 500, 502, 503, 504]);

/* Os modelos Gemini 3.x raciocinam antes de responder e o "pensamento" consome o
   mesmo orçamento de saída: sem thinkingLevel baixo e um teto folgado, a resposta
   volta vazia com finishReason MAX_TOKENS. Modelos antigos não conhecem
   thinkingConfig e devolvem 400 — nesse caso repetimos sem ele. */
function geminiBody(system, contents, temperature, withThinking) {
  const generationConfig = { temperature, maxOutputTokens: 8192 };
  if (withThinking) generationConfig.thinkingConfig = { thinkingLevel: "low" };
  return JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, contents, generationConfig });
}

async function askGemini({ system, contents, temperature = 0.3 }) {
  const tried = [];
  for (const model of MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
    for (const withThinking of [true, false]) {
      let r;
      try {
        r = await fetch(url, {
          method: "POST",
          headers: { "content-type": "application/json", "x-goog-api-key": GEMINI_KEY },
          body: geminiBody(system, contents, temperature, withThinking),
        });
      } catch (e) {
        tried.push({ model, error: `rede: ${e.message}` });
        break;
      }
      if (r.ok) {
        const data = await r.json();
        const cand = data?.candidates?.[0] || {};
        const text = (cand.content?.parts || []).map(p => p.text || "").join("").trim();
        if (text) return { text, model, tried };
        tried.push({ model, error: `resposta vazia (${cand.finishReason || "sem motivo"})` });
        break;
      }
      const detail = (await r.text().catch(() => "")).slice(0, 300);
      if (r.status === 400 && withThinking && /thinking/i.test(detail)) continue;
      tried.push({ model, status: r.status, error: detail });
      // 400/401/403 = erro de chave ou payload: trocar de modelo não resolveria
      if (!RETRYABLE.has(r.status)) { const e = new Error("Nenhum modelo Gemini respondeu."); e.tried = tried; throw e; }
      break;
    }
  }
  const err = new Error("Nenhum modelo Gemini respondeu.");
  err.tried = tried;
  throw err;
}

/* ── servidor ────────────────────────────────────────────────────────────── */
createServer(async (req, res) => {
  const u = new URL(req.url, `http://localhost:${PORT}`);
  const path = u.pathname;

  if (path === "/api/config") {
    return json(res, 200, { proxy: true, chat: !!GEMINI_KEY, weather: !!OWM_KEY, models: MODELS });
  }

  if (path === "/api/weather") {
    if (!OWM_KEY) return json(res, 503, { error: "OPENWEATHER_API_KEY ausente no .env" });
    const lat = Number(u.searchParams.get("lat")), lon = Number(u.searchParams.get("lon"));
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return json(res, 400, { error: "lat/lon inválidos" });
    const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${OWM_KEY}`;
    try {
      const r = await fetch(api);
      return json(res, r.status, await r.json());
    } catch (e) {
      return json(res, 502, { error: e.message });
    }
  }

  if (path === "/api/chat") {
    if (req.method !== "POST") return json(res, 405, { error: "use POST" });
    if (!GEMINI_KEY) return json(res, 503, { error: "GEMINI_API_KEY ausente no .env" });
    try {
      const { system, contents } = JSON.parse(await readBody(req));
      if (!Array.isArray(contents) || !contents.length) return json(res, 400, { error: "contents vazio" });
      const out = await askGemini({ system: String(system || ""), contents });
      return json(res, 200, out);
    } catch (e) {
      return json(res, 502, { error: e.message, tried: e.tried || [] });
    }
  }

  // nunca servir o .env em modo proxy: as chaves ficam aqui dentro
  if (path === "/.env" || path.endsWith("/.env")) return json(res, 403, { error: "proibido" });

  let rel = decodeURIComponent(path).replace(/^\/+/, "");
  if (!rel) rel = "Dashboards/index.html";
  const full = resolve(ROOT, normalize(rel));
  if (!full.startsWith(ROOT + sep) && full !== ROOT) { res.writeHead(403); return res.end("403"); }
  try {
    const st = statSync(full);
    const file = st.isDirectory() ? join(full, "index.html") : full;
    const buf = await readFile(file);
    res.writeHead(200, {
      "content-type": MIME[extname(file).toLowerCase()] || "application/octet-stream",
      "cache-control": "no-store",
    });
    res.end(buf);
  } catch {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end(`404 - ${rel}`);
  }
}).listen(PORT, () => {
  console.log(`\n  Nitro · Alcohol Intelligence (modo proxy)`);
  console.log(`  http://localhost:${PORT}/Dashboards/index.html`);
  console.log(`  gemini: ${GEMINI_KEY ? MODELS.join(" → ") : "sem chave"}`);
  console.log(`  clima : ${OWM_KEY ? "ok" : "sem chave"}\n`);
});
