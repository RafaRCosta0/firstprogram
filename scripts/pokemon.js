const pokemonDetail = document.getElementById("pokemonDetail");

let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
/* declaracao das mega evoluções*/
const megaForms = {
  venusaur: ["venusaur-mega"],
  charizard: [
    "charizard-mega-x",
    "charizard-mega-y"
  ],
  blastoise: ["blastoise-mega"],
  beedrill: ["beedrill-mega"],
  pidgeot: ["pidgeot-mega"],
  alakazam: ["alakazam-mega"],
  slowbro: ["slowbro-mega"],
  gengar: ["gengar-mega"],
  kangaskhan: ["kangaskhan-mega"],
  pinsir: ["pinsir-mega"],
  gyarados: ["gyarados-mega"],
  aerodactyl: ["aerodactyl-mega"],
  mewtwo: [
    "mewtwo-mega-x",
    "mewtwo-mega-y"
  ],
  ampharos: ["ampharos-mega"],
  steelix: ["steelix-mega"],
  scizor: ["scizor-mega"],
  heracross: ["heracross-mega"],
  houndoom: ["houndoom-mega"],
  tyranitar: ["tyranitar-mega"],
  sceptile: ["sceptile-mega"],
  blaziken: ["blaziken-mega"],
  swampert: ["swampert-mega"],
  gardevoir: ["gardevoir-mega"],
  sableye: ["sableye-mega"],
  mawile: ["mawile-mega"],
  aggron: ["aggron-mega"],
  medicham: ["medicham-mega"],
  manectric: ["manectric-mega"],
  sharpedo: ["sharpedo-mega"],
  camerupt: ["camerupt-mega"],
  altaria: ["altaria-mega"],
  banette: ["banette-mega"],
  absol: ["absol-mega"],
  glalie: ["glalie-mega"],
  salamence: ["salamence-mega"],
  metagross: ["metagross-mega"],
  latias: ["latias-mega"],
  latios: ["latios-mega"],
  rayquaza: ["rayquaza-mega"],
  kyogre: ["kyogre-primal"],
  groudon: ["groudon-primal"],
  lopunny: ["lopunny-mega"],
  garchomp: ["garchomp-mega"],
  lucario: ["lucario-mega"],
  abomasnow: ["abomasnow-mega"],
  gallade: ["gallade-mega"],
  audino: ["audino-mega"],
  diancie: ["diancie-mega"]
};

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
/*declaracao das variaveis de mega/shiny*/
  try{
    const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nome}`);
    const pokemon = await resposta.json();
    let shinyAtivo = false;
    let megaAtiva = false;
    let megaAtual = 0;
    let megaData = null;
    const spriteNormal = pokemon.sprites.versions["generation-v"]["black-white"].animated.front_default
  ||pokemon.sprites.front_default;
    const spriteShiny = pokemon.sprites.versions["generation-v"]["black-white"].animated.front_shiny
  ||pokemon.sprites.front_shiny;
    const favorito = favoritos.includes(pokemon.id);

    pokemonDetail.innerHTML = `
    <button class="favorito-detalhe">
      ${favorito ? "⭐" : "☆"} <br> Favoritar
    </button>

      <img
  class="pokemon-img"
  id="pokemonSprite"
  src="${spriteNormal}"
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

    const btnFavorito = document.querySelector(".favorito-detalhe");

    btnFavorito.addEventListener("click", () => {
      if (favoritos.includes(pokemon.id)) {
        favoritos = favoritos.filter(id => id !== pokemon.id);
      } else {
        favoritos.push(pokemon.id);
      }

      localStorage.setItem("favoritos", JSON.stringify(favoritos));

      btnFavorito.innerHTML = `
        ${favoritos.includes(pokemon.id) ? "⭐" : "☆"} <br> Favoritar
      `;
    });
/*função para os botões*/
    const pokemonSprite = document.getElementById("pokemonSprite");
    const btnMega = document.querySelector(".megaEvolução");
    btnMega.textContent = "M";
    const btnForma1 = document.querySelector(".evolução1");
    const btnForma2 = document.querySelector(".evolução2");
    const btnForma3 = document.querySelector(".evolução3");
    btnForma1.textContent = "X";
    btnForma2.textContent = "Y";
    btnForma3.textContent = "✨";
/*opacidade dos botões*/
    if(
  pokemon.name !== "charizard" &&
  pokemon.name !== "mewtwo"
){
  btnForma1.style.opacity = "1.0";
  btnForma2.style.opacity = "1.0";
}

if(!megaForms[pokemon.name]){
  btnMega.style.opacity = "1.0";
}
/*função para ativar o shiny */
btnForma3.addEventListener("click", () => {
  
  shinyAtivo = !shinyAtivo;

  if(megaAtiva && megaData){

    pokemonSprite.src = (shinyAtivo && spriteShiny)
  ? spriteShiny
  : spriteNormal;

  }else{

    pokemonSprite.src = shinyAtivo
      ? spriteShiny
      : spriteNormal;

  }
});
/*função para os botões de mega evolucao*/
btnMega.addEventListener("click", async () => {

  if(!megaForms[pokemon.name]){
    return;
  }

  if(!megaAtiva){

    const megaName =
      megaForms[pokemon.name][megaAtual];

    const respostaMega =
      await fetch(`https://pokeapi.co/api/v2/pokemon/${megaName}`);

    megaData = await respostaMega.json();

    pokemonSprite.src = shinyAtivo
      ? megaData.sprites.front_shiny
      : megaData.sprites.front_default;

    document.querySelector(".nome").textContent =
      capitalize(megaData.name);

    megaAtiva = true;

  }else{

    pokemonSprite.src = shinyAtivo
      ? spriteShiny
      : spriteNormal;

    document.querySelector(".nome").textContent =
      capitalize(pokemon.name);

    megaAtiva = false;
  }

});
/*funções especificas para charizard/mewtwo*/
btnForma1.addEventListener("click", () => {

  if(
    pokemon.name !== "charizard" &&
    pokemon.name !== "mewtwo"
  ){
    return;
  }

  megaAtual = 0;

});

btnForma2.addEventListener("click", () => {

  if(
    pokemon.name !== "charizard" &&
    pokemon.name !== "mewtwo"
  ){
    return;
  }

  megaAtual = 1;

});

  }catch(e){
    pokemonDetail.innerHTML = "<p class='loading'>Erro ao carregar</p>";
  }
}

carregarPokemon();