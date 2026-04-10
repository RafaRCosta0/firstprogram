const email = document.getElementById("email");
const password = document.getElementById("password");

function moverSeta(input) {
const pos = input.getBoundingClientRect();

arrow.style.top = (pos.top + window.scrollY + (input.offsetHeight / 2) - (arrow.offsetHeight / 2)) + "px";
}

email.addEventListener("focus", () => moverSeta(email));
password.addEventListener("focus", () => moverSeta(password));