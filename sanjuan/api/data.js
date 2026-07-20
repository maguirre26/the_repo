import { Redis } from "@upstash/redis";

// Redis.fromEnv() detecta automaticamente las variables de entorno
// que Vercel inyecta al conectar la integracion de Upstash
// (UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN,
// o los nombres legacy KV_REST_API_URL / KV_REST_API_TOKEN).
const redis = Redis.fromEnv();

const VALID_KINDS = ["turismo", "bodegas"];

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method === "GET") {
    try {
      const [turismo, bodegas] = await Promise.all([
        redis.get("sanjuan:turismo"),
        redis.get("sanjuan:bodegas")
      ]);
      return res.status(200).json({
        turismo: turismo || null,
        bodegas: bodegas || null
      });
    } catch (err) {
      return res.status(500).json({
        error: "No se pudo leer la base de datos",
        detail: String(err)
      });
    }
  }

  if (req.method === "POST") {
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const { kind, items } = body || {};

      if (!VALID_KINDS.includes(kind) || !Array.isArray(items)) {
        return res.status(400).json({ error: "Datos invalidos" });
      }

      await redis.set("sanjuan:" + kind, items);
      return res.status(200).json({ ok: true });
    } catch (err) {
      return res.status(500).json({
        error: "No se pudo guardar",
        detail: String(err)
      });
    }
  }

  res.setHeader("Allow", ["GET", "POST", "OPTIONS"]);
  return res.status(405).json({ error: "Metodo no permitido" });
}
