const pokemonDetail = document.getElementById("pokemonDetail");

function capitalize(text){
  return text.charAt(0).toUpperCase() + text.slice(1);
}

async function carregarPokemon(){
  const params = new URLSearchParams(window.location.search);
  const nome = params.get("nome");

  if(!nome){
    pokemonDetail.innerHTML = "<p class='loading'>Erro</p>";
    return;
  }

  try{
    const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nome}`);
    const pokemon = await resposta.json();

    pokemonDetail.innerHTML = `
    <button class="favorito-detalhe">⭐ <br> Favoritar</button>
      <img class="pokemon-img"
        src="${pokemon.sprites.versions["generation-v"]["black-white"].animated.front_default}"
      >

      <div class="nome">${capitalize(pokemon.name)}</div>

      <div class="info-box">
        <p><strong>Tipo:</strong> ${pokemon.types.map(t => t.type.name).join(" / ")}</p>
        <p><strong>Altura:</strong> ${pokemon.height / 10} m</p>
        <p><strong>Peso:</strong> ${pokemon.weight / 10} kg</p>
        <p><strong>Velocidade:</strong> ${pokemon.stats[5].base_stat}</p>
        <p><strong>Força:</strong> ${pokemon.stats[1].base_stat}</p>
      </div>
    `;
  }catch(e){
    pokemonDetail.innerHTML = "<p class='loading'>Erro ao carregar</p>";
  }
}

carregarPokemon();

