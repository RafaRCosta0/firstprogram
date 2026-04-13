let progress = 0;

const bar = document.getElementById("progress");
const percent = document.getElementById("percent");
const pet = document.getElementById("pet");

const interval = setInterval(() => {
  progress += Math.floor(Math.random() * 10) + 1;

  if (progress >= 100) {
    progress = 100;
    clearInterval(interval);

    setTimeout(() => {
      window.location.href = "pokedex.html";
    }, 800);
  }

  bar.style.width = progress + "%";
  percent.innerText = progress + "%";
  pet.style.left = progress + "%";

}, 300);