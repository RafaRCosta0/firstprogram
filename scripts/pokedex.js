const pokemonGrid = document.getElementById("pokemonGrid");
const searchInput = document.getElementById("searchPokemon");
const filterToggle = document.getElementById("filterToggle");
const filterPanel = document.getElementById("filterPanel");
const typeFilter = document.getElementById("typeFilter");
const weaknessFilter = document.getElementById("weaknessFilter");
const clearFiltersBtn = document.getElementById("clearFilters");
const searchFilterBtn = document.getElementById("searchFilterBtn");

let allPokemons = [];

/* abrir e fechar painel */
function toggleFilters() {
    filterPanel.classList.toggle("hidden");
}

filterToggle.addEventListener("click", toggleFilters);
searchFilterBtn.addEventListener("click", toggleFilters);

/* buscar na API de pokémons */
async function getPokemons() {
    const promises = [];
/* busca os 60 pokemons */
    for (let i = 1; i <= 7; i++) {
        promises.push(fetch(`https://pokeapi.co/api/v2/pokemon/${i}`).then(res => res.json()));
    }

    const pokemons = await Promise.all(promises);

    const enrichedPokemons = await Promise.all(
        pokemons.map(async (pokemon) => {
            const weaknesses = await getPokemonWeaknesses(pokemon.types);
            return {
                id: pokemon.id,
                name: pokemon.name,
                image: pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default,
                types: pokemon.types.map(t => t.type.name),
                weaknesses: weaknesses
            };
        })
    );

    allPokemons = enrichedPokemons;
    renderPokemons(allPokemons);
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
        card.classList.add("pokemon-card");

        const mainType = pokemon.types[0];
        card.classList.add(mainType);

        card.innerHTML = `
            <span>#${pokemon.id}</span>
            <img src="${pokemon.image}" alt="${pokemon.name}">
            <h2>${capitalize(pokemon.name)}</h2>
        `;
        card.addEventListener("click", () => {
            abrirPokemon(pokemon.name);
        });

        pokemonGrid.appendChild(card);
    });
}

function abrirPokemon(nome) {
    window.location.href = `pokemon.html?nome=${nome}`;
}
/* filtro geral */
function applyFilters() {
    const searchValue = searchInput.value.toLowerCase().trim();
    const selectedType = typeFilter.value;
    const selectedWeakness = weaknessFilter.value;

    const filtered = allPokemons.filter(pokemon => {
        const matchesName = pokemon.name.toLowerCase().includes(searchValue);
        const matchesType = !selectedType || pokemon.types.includes(selectedType);
        const matchesWeakness = !selectedWeakness || pokemon.weaknesses.includes(selectedWeakness);

        return matchesName && matchesType && matchesWeakness;
    });

    renderPokemons(filtered);
}

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

/* eventos */
searchInput.addEventListener("input", applyFilters);
typeFilter.addEventListener("change", applyFilters);
weaknessFilter.addEventListener("change", applyFilters);

clearFiltersBtn.addEventListener("click", () => {
    searchInput.value = "";
    typeFilter.value = "";
    weaknessFilter.value = "";
    renderPokemons(allPokemons);
});

/* iniciar */
getPokemons();