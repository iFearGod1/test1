export default async function handler(req, res) {
  const key = process.env.ODDS_API_KEY;

  const sport = req.query.sport || "basketball_nba";
  const markets = req.query.markets || "h2h,spreads,totals";
  const regions = req.query.regions || "us";

  const url =
    `https://api.the-odds-api.com/v4/sports/${sport}/odds` +
    `?apiKey=${key}` +
    `&regions=${regions}` +
    `&markets=${markets}` +
    `&oddsFormat=american`;

  const r = await fetch(url);
  const text = await r.text();

  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
  res.status(r.status).send(text);
}
