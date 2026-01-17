// ===== Elements =====
const weatherTemp = document.getElementById("weather-temp");
const weatherMeta = document.getElementById("weather-meta");
const enterBtn = document.getElementById("enter-btn");
const intro = document.getElementById("intro");
const app = document.getElementById("app");

const sportSelect = document.getElementById("sportSelect");
const oddsIframe = document.querySelector(".odds-iframe");

// ===== Weather =====
const formatTempF = (c) => Math.round((c * 9) / 5 + 32);

async function fetchWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m&temperature_unit=celsius&wind_speed_unit=mph`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Weather request failed");
  return res.json();
}

async function updateWeather(lat, lon, label) {
  const data = await fetchWeather(lat, lon);
  const tempC = data.current.temperature_2m;
  const wind = data.current.wind_speed_10m;

  weatherTemp.textContent = formatTempF(tempC);
  weatherMeta.textContent = `${label} • Wind ${Math.round(wind)} mph`;
}

function fallbackWeather() {
  updateWeather(34.0522, -118.2437, "Los Angeles").catch(() => {
    weatherMeta.textContent = "Weather unavailable";
  });
}

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    (pos) => updateWeather(pos.coords.latitude, pos.coords.longitude, "Your area").catch(fallbackWeather),
    fallbackWeather
  );
} else {
  fallbackWeather();
}

// ===== Enter Button =====
enterBtn.addEventListener("click", () => {
  document.body.classList.add("is-entered");
  intro.setAttribute("aria-hidden", "true");
  app.setAttribute("aria-hidden", "false");
});

// ===== Odds Widget (swap sport) =====
const WIDGET_KEY = "wk_6988473aa35808c52396ceeaec2c38d0";
const BASE = "https://widget.the-odds-api.com/v1/sports";

function buildWidgetUrl(sportKey) {
  return `${BASE}/${sportKey}/events/?accessKey=${WIDGET_KEY}&bookmakerKeys=fanduel&oddsFormat=american&markets=h2h%2Cspreads%2Ctotals&marketNames=h2h%3AMoneyline%2Cspreads%3ASpreads%2Ctotals%3AOver%2FUnder`;
}

sportSelect.addEventListener("change", () => {
  const sportKey = sportSelect.value;
  oddsIframe.src = buildWidgetUrl(sportKey);
});

