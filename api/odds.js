const sports = [
  "basketball_nba",
  "americanfootball_nfl",
  "baseball_mlb",
  "icehockey_nhl",
  "mma_mixed"
];

async function loadAllOdds() {
  const container = document.getElementById("oddsContainer");
  container.innerHTML = "";

  for (const sport of sports) {
    const res = await fetch(`/api/odds?sport=${sport}`);
    const data = await res.json();

    if (!data || data.length === 0) continue;

    const title = document.createElement("h2");
    title.textContent = sport.replaceAll("_", " ").toUpperCase();
    container.appendChild(title);

    data.forEach(game => {
      const div = document.createElement("div");
      div.className = "odds-card";

      div.innerHTML = `
        <strong>${game.home_team} vs ${game.away_team}</strong><br>
        ${new Date(game.commence_time).toLocaleString()}
      `;

      container.appendChild(div);
    });
  }
}

loadAllOdds();
