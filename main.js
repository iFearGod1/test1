console.log("main.js loaded");

async function loadOdds() {
  const res = await fetch("/api/odds?sport=basketball_nba");
  const data = await res.json();
  console.log("ODDS DATA:", data);
}

loadOdds();

