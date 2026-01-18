// api/odds.js
// Vercel Serverless Function: https://YOUR_DOMAIN.vercel.app/api/odds?sport=basketball_nba
// IMPORTANT: Put your key in an environment variable named ODDS_API_KEY (NOT in this file).

export default async function handler(req, res) {
  // Temporarily disabled while updates are in progress.
  return res.status(503).json({
    error: "Odds API temporarily disabled"
  });

  // Only allow GET
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const apiKey = process.env.ODDS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "Server misconfigured: missing ODDS_API_KEY environment variable"
    });
  }

  // Query params (with safe defaults)
  const sport = (req.query.sport || "basketball_nba").toString();

  // Odds API params (customize via query string if you want)
  const regions = (req.query.regions || "us").toString(); // us, eu, uk, au
  const markets = (req.query.markets || "h2h,spreads,totals").toString(); // h2h, spreads, totals, etc.
  const oddsFormat = (req.query.oddsFormat || "american").toString(); // american, decimal
  const dateFormat = (req.query.dateFormat || "iso").toString(); // iso, unix
  const bookmakers = req.query.bookmakers ? req.query.bookmakers.toString() : ""; // optional: "fanduel,draftkings"

  // Build upstream URL
  const base = `https://api.the-odds-api.com/v4/sports/${encodeURIComponent(sport)}/odds`;
  const params = new URLSearchParams({
    apiKey,
    regions,
    markets,
    oddsFormat,
    dateFormat
  });

  if (bookmakers) params.set("bookmakers", bookmakers);

  const url = `${base}?${params.toString()}`;

  try {
    const upstream = await fetch(url, {
      method: "GET",
      headers: { "Accept": "application/json" }
    });

    const text = await upstream.text();

    // Forward helpful rate-limit headers to your frontend (optional but useful)
    const remaining = upstream.headers.get("x-requests-remaining");
    const used = upstream.headers.get("x-requests-used");
    if (remaining) res.setHeader("x-requests-remaining", remaining);
    if (used) res.setHeader("x-requests-used", used);

    // If Odds API errors, pass it through (but keep it JSON-safe)
    if (!upstream.ok) {
      return res.status(upstream.status).json({
        error: "Upstream Odds API error",
        status: upstream.status,
        body: safeJson(text)
      });
    }

    // Return JSON
    return res.status(200).json(safeJson(text));
  } catch (err) {
    return res.status(500).json({
      error: "Failed to fetch odds",
      message: err?.message || String(err)
    });
  }
}

function safeJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    // If upstream returns non-JSON (rare), return raw text
    return { raw: text };
  }
}
