const subButton = document.getElementById("subButton")
const clearButton = document.getElementById("clear")
const shiny = document.getElementById("shinycheck")
const body = document.querySelector("body")
const imageContainer = document.getElementById("image-container")


let inputPokemon;
let isShiny = false
let pokemonContainers = []

shiny.addEventListener("change", ()=>{
    if(shiny.checked){
        isShiny = true
    } else{
        isShiny = false
    }
})

//TODO: MAKE IT SO THE SELECTED POKEMON IS CLEARED INSTEAD OF THE WHOLE DIV.
function clear(){
    let clearTarget = document.getElementById("image-container")
    console.log("clear")
    clearTarget.replaceChildren("")
    while (pokemonContainers.length > 0){
        pokemonContainers.pop()
    }
}

clearButton.addEventListener("click", ()=>{
    clear()
})

subButton.addEventListener("click", () =>{
    const input = document.getElementById("searchPokemon")
    inputPokemon = input.value
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
let typing = []
async function CreatePokemon(url){
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
    
    const img = document.createElement("img")
    const typingDiv = document.createElement("div")
    typingDiv.setAttribute("id", "typings")
    typingDiv.setAttribute("name", `${inputPokemon}`)
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
    typing.push(typingDiv)
    imageContainer.append(pokemonContainer)
    pokemonContainers.push(pokemonContainer)
    
    //TODO: ADD THE SELECTED POKEMON NOT THE HEAD OF THE ARRAY.
    const addPokemon = document.createElement("button")
    addPokemon.setAttribute("id", "AddButton")
    addPokemon.setAttribute("class", "button")
    addPokemon.innerText = "Add Pokemon"
    for (const container of pokemonContainers){
            container.append(addPokemon)
    }
    addPokemon.addEventListener("click", ()=>{
        for (const container of pokemonContainers){
            let clearTarget = document.getElementById("team-container")
            clearTarget.replaceChildren("")
            const pokemonToAdd = container.children[1].getAttribute("src") 
            teamMaker(pokemonToAdd) 
            clear()        
        }
    })
}
let team = []
let counter = 0;
const teamContainer = document.getElementById("team-container")
const completedTeam = document.getElementById("completed-team")

//TODO: PRETTY UP THE DISPLAY FOR THE POKEMON TEAM.
function teamMaker(pokemonToAdd) {
    const teamDiv = document.createElement("div")
    console.log(pokemonToAdd)
    team.push(pokemonToAdd)
    console.log(team)
    counter += 1
    
    for (const item of team) {
        const teamMemberImage = document.createElement("img")
        teamMemberImage.setAttribute("src", `${item}`)
        teamDiv.append(teamMemberImage)
    }
    console.log(teamDiv)
    teamContainer.append(teamDiv)
    if (team.length >= 6){
        teamDiv.setAttribute("id",`teamNumber${counter}`)
        counter += 1
        team = []
        completedTeam.append(teamDiv)
    }
    // console.log(team) 
}