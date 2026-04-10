const input = document.querySelector(".second");
const img = document.querySelector(".specie");

input.addEventListener("keydown", async function(e) {

    if (e.key === "Enter") {

        e.preventDefault();

        const valor = input.value.toLowerCase();

        try {
            const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${valor}`);
            const dados = await resposta.json();

            const gif =
                dados.sprites.versions["generation-v"]["black-white"].animated.front_default;

            const imagem = gif || dados.sprites.front_default;

            img.src = imagem;

            // 🔥 SALVA
            localStorage.setItem("pokemonAtual", JSON.stringify(dados));

        } catch {
            alert("Pokémon não encontrado");
        }

    }

});