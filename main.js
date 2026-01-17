const select = document.getElementById("sportSelect");

if (select) {
  select.addEventListener("change", () => {
    loadOdds(select.value);
  });
}

function loadOdds(sport) {
  fetch(`/api/odds?sport=${sport}`)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      // render odds here
    });
}
