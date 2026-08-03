const ALLOWED_ORIGINS = [
  "https://ferienwohnungdenhaag.pages.dev",
];

const KV_KEY = "availability";
const RATE_LIMIT_PREFIX = "ratelimit:";
const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 15 * 60;

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Admin-Password",
    "Vary": "Origin",
  };
}

function json(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...headers, "Content-Type": "application/json" },
  });
}

async function isLockedOut(env, ip) {
  const attempts = parseInt((await env.AVAILABILITY.get(RATE_LIMIT_PREFIX + ip)) || "0", 10);
  return attempts >= MAX_ATTEMPTS;
}

async function recordFailedAttempt(env, ip) {
  const key = RATE_LIMIT_PREFIX + ip;
  const current = parseInt((await env.AVAILABILITY.get(key)) || "0", 10);
  await env.AVAILABILITY.put(key, String(current + 1), { expirationTtl: LOCKOUT_SECONDS });
}

async function clearFailedAttempts(env, ip) {
  await env.AVAILABILITY.delete(RATE_LIMIT_PREFIX + ip);
}

function isValidDate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";
    const headers = corsHeaders(origin);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    if (url.pathname !== "/api/availability") {
      return json({ error: "Not found" }, 404, headers);
    }

    if (request.method === "GET") {
      const data = await env.AVAILABILITY.get(KV_KEY, "json");
      const payload = data || { defaultPrice: null, extraGuestPrice: null, ranges: [] };
      return json(payload, 200, { ...headers, "Cache-Control": "no-store" });
    }

    if (request.method === "POST") {
      const ip = request.headers.get("CF-Connecting-IP") || "unknown";

      if (await isLockedOut(env, ip)) {
        return json({ error: "Zu viele Fehlversuche. Bitte in 15 Minuten erneut versuchen." }, 429, headers);
      }

      const password = request.headers.get("X-Admin-Password") || "";
      if (!env.ADMIN_PASSWORD || password !== env.ADMIN_PASSWORD) {
        await recordFailedAttempt(env, ip);
        return json({ error: "Falsches Passwort" }, 401, headers);
      }
      await clearFailedAttempts(env, ip);

      let body;
      try {
        body = await request.json();
      } catch {
        return json({ error: "Ungültiges JSON" }, 400, headers);
      }

      if (!Array.isArray(body.ranges)) {
        return json({ error: "ranges muss ein Array sein" }, 400, headers);
      }

      for (const r of body.ranges) {
        if (!isValidDate(r.start) || !isValidDate(r.end) || !["booked", "available"].includes(r.status)) {
          return json(
            { error: "Jeder Zeitraum braucht start (YYYY-MM-DD), end (YYYY-MM-DD) und status (booked/available)" },
            400,
            headers
          );
        }
        if (r.price !== undefined && r.price !== null && typeof r.price !== "number") {
          return json({ error: "price muss eine Zahl sein" }, 400, headers);
        }
      }

      const payload = {
        defaultPrice: typeof body.defaultPrice === "number" ? body.defaultPrice : null,
        extraGuestPrice: typeof body.extraGuestPrice === "number" ? body.extraGuestPrice : null,
        ranges: body.ranges,
      };

      await env.AVAILABILITY.put(KV_KEY, JSON.stringify(payload));

      return json({ ok: true }, 200, headers);
    }

    return json({ error: "Method not allowed" }, 405, headers);
  },
};
