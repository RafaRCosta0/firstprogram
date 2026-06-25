const pokemonGrid = document.getElementById("pokemonGrid");
const searchInput = document.getElementById("searchPokemon");
const filterToggle = document.getElementById("filterToggle");
const filterPanel = document.getElementById("filterPanel");
const typeFilter = document.getElementById("typeFilter");
const clearFiltersBtn = document.getElementById("clearFilters");
const searchFilterBtn = document.getElementById("searchFilterBtn");
let favoritos = JSON.parse(localStorage.getItem("favoritos")) ||[];
let mostrandoFavoritos = false;
let offset = 1;
const limit = 20;
const loadMoreBtn = document.getElementById("loadMoreBtn");
let allPokemons = [];

/* abrir e fechar painel */
function toggleFilters() {
    filterPanel.classList.toggle("hidden");
}

filterToggle.addEventListener("click", () => {
    mostrandoFavoritos = !mostrandoFavoritos;

    if (mostrandoFavoritos) {
        const pokemonsFavoritos = allPokemons.filter(pokemon =>
            favoritos.includes(pokemon.id)
        );

        renderPokemons(pokemonsFavoritos);
    } else {
        renderPokemons(allPokemons);
    }
});


searchFilterBtn.addEventListener("click", toggleFilters);

/* buscar na API de pokémons */
async function getPokemons() {

    const promises = [];

    for (let i = offset; i < offset + limit; i++) {
        promises.push(
            fetch(`https://pokeapi.co/api/v2/pokemon/${i}`)
            .then(res => res.json())
        );
    }

    const pokemons = await Promise.all(promises);

    const enrichedPokemons = await Promise.all(
        pokemons.map(async (pokemon) => {
            const weaknesses = await getPokemonWeaknesses(pokemon.types);

            return {
                id: pokemon.id,
                name: pokemon.name,
                image: pokemon.sprites.versions["generation-v"]["black-white"].animated.front_default,
                types: pokemon.types.map(t => t.type.name),
                weaknesses
            };
        })
    );

    allPokemons.push(...enrichedPokemons);

    renderPokemons(allPokemons);

    offset += limit;
}
/* buscar fraquezas com base nos tipos */
async function getPokemonWeaknesses(types) {
    const weaknessSet = new Set();

    for (const t of types) {
        const res = await fetch(t.type.url);
        const typeData = await res.json();

        typeData.damage_relations.double_damage_from.forEach(weakness => {
            weaknessSet.add(weakness.name);
        });
    }

    return [...weaknessSet];
}



/* renderiza os cards */
function renderPokemons(pokemons) {
    pokemonGrid.innerHTML = "";

    pokemons.forEach(pokemon => {
        const card = document.createElement("article");
        const favorito = favoritos.includes(pokemon.id);
        card.classList.add("pokemon-card");

        const mainType = pokemon.types[0];
        card.classList.add(mainType);

        card.innerHTML = `
            <button class="favorito">
            ${favorito ? "⭐" : "☆"}
            </button>

            <span>#${pokemon.id}</span>
            <img src="${pokemon.image}" alt="${pokemon.name}">
            <h2>${capitalize(pokemon.name)}</h2>
        `;

        const btnFavorito = card.querySelector(".favorito");

btnFavorito.addEventListener("click", (e) => {

    e.stopPropagation();

    if (favoritos.includes(pokemon.id)) {

        favoritos = favoritos.filter(id => id !== pokemon.id);

    } else {

        favoritos.push(pokemon.id);

    }

    localStorage.setItem("favoritos", JSON.stringify(favoritos));

    btnFavorito.textContent =
        favoritos.includes(pokemon.id) ? "⭐" : "☆";

});

        card.addEventListener("click", () => {
            abrirPokemon(pokemon.name);
        });

        pokemonGrid.appendChild(card);
    });
}

loadMoreBtn.addEventListener("click", () => {
    getPokemons();
});



function abrirPokemon(nome) {
    window.open(`pokemon.html?nome=${nome}`, "_blank");
}
/* Rafael \filtro geral */
function applyFilters() {
    const searchValue = searchInput.value.toLowerCase().trim();
    const selectedType = typeFilter.value;
    

    const filtered = allPokemons.filter(pokemon => {
        const matchesName = pokemon.name.toLowerCase().includes(searchValue);
        const matchesType = !selectedType || pokemon.types.includes(selectedType);
        
        return matchesName && matchesType;
    });

    renderPokemons(filtered);
}
/* Rafael */

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

/* eventos */
searchInput.addEventListener("input", applyFilters);
typeFilter.addEventListener("change", applyFilters);


clearFiltersBtn.addEventListener("click", () => {
    searchInput.value = "";
    typeFilter.value = "";
    renderPokemons(allPokemons);
});

/* iniciar */
getPokemons();

const musica = document.getElementById("musicaFundo");
const btnSom = document.getElementById("btnSom");
const musicaSalva = localStorage.getItem("musica");

if (musicaSalva === "on") {
  musica.play();
  btnSom.textContent = "🔊";
} else {
  btnSom.textContent = "🔇";
}

btnSom.addEventListener("click", () => {
  if (musica.paused) {
    musica.play();
    localStorage.setItem("musica", "on");
    btnSom.textContent = "🔊";

  } else {
    musica.pause();
    localStorage.setItem("musica", "off");
    btnSom.textContent = "🔇";
  }

});
