# Verfügbarkeits-Backend (Cloudflare Worker)

Speichert Buchungszeiträume + Preise in Cloudflare KV und stellt sie über eine kleine API bereit.
Die Website (statisch auf GitHub Pages) und die Admin-Seite (`/admin.html`) rufen diese API per `fetch()` auf.

## Einmalige Einrichtung

1. Voraussetzung: kostenloser Cloudflare Account.
2. Im `worker/`-Ordner:
   ```
   npx wrangler login
   npx wrangler kv namespace create AVAILABILITY
   ```
   Die ausgegebene `id` in `wrangler.toml` bei `REPLACE_WITH_KV_NAMESPACE_ID` eintragen.
3. Admin-Passwort setzen (frei wählbar, nicht die gleiche wie sonst irgendwo verwendet):
   ```
   npx wrangler secret put ADMIN_PASSWORD
   ```
4. Deployen:
   ```
   npx wrangler deploy
   ```
   Wrangler gibt eine URL aus, z.B. `https://wohnung-verfuegbarkeit.<dein-account>.workers.dev`.

5. Diese URL in zwei Dateien eintragen (Konstante `WORKER_URL` ganz oben):
   - `js/availability.js` (öffentlicher Kalender)
   - `admin.html` (Verwaltung)

## Nutzung

- **Öffentlich (Website-Besucher):** `GET /api/availability` liefert Preis + gebuchte/verfügbare Zeiträume, keine Anmeldung nötig.
- **Admin (`/admin.html`):** Passwort eingeben, Zeiträume + Preise bearbeiten, Speichern sendet `POST /api/availability` mit Header `X-Admin-Password`.
- Nach 5 Fehlversuchen mit falschem Passwort wird die anfragende IP 15 Minuten gesperrt (Brute-Force-Schutz, keine Nutzer-Identifikation).

## Datenmodell (KV-Key `availability`)

```json
{
  "defaultPrice": 135,
  "extraGuestPrice": 15,
  "ranges": [
    { "start": "2026-08-10", "end": "2026-08-20", "status": "booked" },
    { "start": "2026-09-01", "end": "2026-09-30", "status": "available", "price": 165 }
  ]
}
```

`price` bei einem Zeitraum überschreibt für diesen Zeitraum den `defaultPrice` (z.B. für Saisonpreise).
