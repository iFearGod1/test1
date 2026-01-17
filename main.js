const overlay = document.getElementById("overlay");
const panel = document.getElementById("oddsPanel");

overlay.addEventListener("click", start);
window.addEventListener("keydown", e => {
  if (e.key === "Enter") start();
});

function start() {
  overlay.style.display = "none";
  panel.style.display = "block";
  loadOdds();
  setInterval(loadOdds, 15 * 60 * 1000); // refresh every 15 min
}

async function loadOdds() {
  try {
    const res = await fetch("/api/odds?sport=basketball_nba&markets=h2h,spreads,totals");
    const games = await res.json();
    render(games);
  } catch (err) {
    panel.innerHTML = `<div class="title">ODDS ERROR</div>`;
    console.error(err);
  }
}

function render(games) {
  panel.innerHTML = `<div class="title">NBA LIVE ODDS</div>`;

  games.forEach(game => {
    const home = game.home_team;
    const away = game.away_team;

    const bm = game.bookmakers?.[0];
    const h2h = bm?.markets?.find(m => m.key === "h2h");
    const spreads = bm?.markets?.find(m => m.key === "spreads");
    const totals = bm?.markets?.find(m => m.key === "totals");

    const money =
      h2h?.outcomes?.map(o => `${o.name}: ${o.price}`).join(" | ") || "--";

    const spread =
      spreads?.outcomes?.map(o => `${o.name} ${o.point}: ${o.price}`).join(" | ") || "--";

    const total =
      totals?.outcomes?.map(o => `${o.name} ${o.point}: ${o.price}`).join(" | ") || "--";

    panel.innerHTML += `
      <div class="game">
        <div><strong>${away}</strong> @ <strong>${home}</strong></div>
        <div class="line">Moneyline: ${money}</div>
        <div class="line">Spread: ${spread}</div>
        <div class="line">Total: ${total}</div>
      </div>
    `;
  });
}
