const subButton = document.getElementById("subButton")
const clearButton = document.getElementById("clear")
const shiny = document.getElementById("shinycheck")
let isShiny = false
shiny.addEventListener("change", ()=>{
    if(shiny.checked){
        isShiny = true
    } else{
        isShiny = false
    }
})
clearButton.addEventListener("click", function clear(){
    let clearTarget = document.getElementById("image-container")
    clearTarget.replaceChildren("")
})
subButton.addEventListener("click", () =>{
    const input = document.getElementById("searchPokemon")
    const inputPokemon = input.value
    CreatePokemon(setUrl(inputPokemon))
})
function setUrl(inputPokemon){
    const pokemon = document.getElementById("searchPokemon")
    let url = `https://pokeapi.co/api/v2/pokemon/${inputPokemon}`
    return url
}
async function getData(url){
    try {
        let res = await fetch(url)
        if(!res.ok){
            console.error("Pokemon Not Found")
        }

        res = await res.json() 
        
        return res
    }
    catch {
        console.error("Pokemon Not Found")
    }
}
async function CreatePokemon(url){
    const body = document.getElementById("image-container")
    const pokemonContainer = document.createElement("div")
    pokemonContainer.setAttribute("id", "pokemonContainer")
    let sprite = ""
    let type = []
    let typesToShow = ""
    data = await getData(url)
    console.log(data)
    if (isShiny){
        sprite = data.sprites.front_shiny
    } else {
        sprite = data.sprites.front_default
    }
    console.log(data)
    const img = document.createElement("img")
    const typingDiv = document.createElement("div")
    typingDiv.setAttribute("id", "typings")
    const types = [...data.types]
    for (names of [...types]){
        type.push(names.type.name)
    }
    typesToShow = ([...type].join(" ")).toString()
    console.log(typesToShow)
    img.setAttribute("src", `${sprite}`)
    pokemonContainer.append(typingDiv)
    pokemonContainer.append(img)
    typingDiv.append(typesToShow)
    body.append(pokemonContainer)
}