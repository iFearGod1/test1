const intro = document.getElementById("intro");
const app = document.getElementById("app");
const enterBtn = document.getElementById("enter-btn");

enterBtn.addEventListener("click", () => {
  // Hide intro + stop it from blocking clicks
  intro.setAttribute("aria-hidden", "true");
  intro.style.display = "none";
  intro.style.pointerEvents = "none";

  // Show main app
  app.setAttribute("aria-hidden", "false");
});
