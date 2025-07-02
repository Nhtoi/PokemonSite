const subButton = document.getElementById("subButton")
const clearButton = document.getElementById("clear")
const shiny = document.getElementById("shinycheck")
const body = document.querySelector("body")
const imageContainer = document.getElementById("image-container")
let typeColorsPromise = fetch('colors.json').then(res => res.json());
let team = []
let inputPokemon;
let isShiny = false
let pokemonContainers = []
shiny.addEventListener("change", ()=>{
    if(shiny.checked){
        isShiny = true
    }else { 
        isShiny = false
    }
})
function clear(target){
    if (target === undefined || target === null){
      let clearTarget = document.getElementById("image-container")
      //console.log("clear")
      clearTarget.replaceChildren("")
        while (pokemonContainers.length > 0){
          pokemonContainers.pop()
      }
    } else{
      //console.log(target)
      target.remove()
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
//TODO: MAKE IT LOOK BETTER WHEN DISPLAYING TYPINGS
async function CreatePokemon(url){
    const pokemonContainer = document.createElement("div")
    pokemonContainer.setAttribute("id", "pokemonContainer") 
    let sprite = ""
    data = await getData(url)
    //console.log(data)
    if (isShiny){
        sprite = data.sprites.front_shiny
    } else {
        sprite = data.sprites.front_default
    }
    const img = document.createElement("img")
    const typingDiv = document.createElement("div")
    typingDiv.setAttribute("id", "pokemon")
    typingDiv.setAttribute("name", `${inputPokemon}`)
    const types = [...data.types]
    const colors = await typeColorsPromise
    console.log(colors)
    let count = 1
    for (const typing of types) {
        console.log(typing.type.name)
        let typeTextDiv = document.createElement("div")
        typeTextDiv.setAttribute("id",`type${count}`)
        typeTextDiv.setAttribute("class", colors[typing.type.name] )
        typeTextDiv.innerText = typing.type.name
        count += 1
        typingDiv.append(typeTextDiv)
    }
    console.log(typingDiv)
    count = 0
    img.setAttribute("src", `${sprite}`)
    pokemonContainer.append(typingDiv)
    pokemonContainer.append(img)
    imageContainer.append(pokemonContainer)
    pokemonContainers.push(pokemonContainer)
    const addPokemon = document.createElement("button")
    addPokemon.setAttribute("id", "AddButton")
    addPokemon.setAttribute("class", "button")
    addPokemon.innerText = "Add Pokemon"
    for (const container of pokemonContainers){
            container.append(addPokemon)
    }
    addPokemon.addEventListener("click", (e)=>{
            let workingOn = e.target.parentElement
            team.push(workingOn.children[1])
            teamMaker(workingOn.children[1])  
            clear(e.target.parentElement)  
    })
}

let counter = 0;
const teamContainer = document.getElementById("team-container")
const completedTeam = document.getElementById("completed-team")
function teamMaker(pokemonToAdd) {
    const image = pokemonToAdd.getAttribute("src")
    const teamDiv = document.createElement("img")
    teamDiv.setAttribute("src",`${image}`)
    teamContainer.append(teamDiv)
    if (team.length === 6){
        let finishedTeam = document.createElement("div")
        finishedTeam.setAttribute("id", `team-number${counter}`)
        addAll = Array.from(teamContainer.children)
        addAll.forEach(child => {
            finishedTeam.append(child)
        })
        console.log(finishedTeam)
        completedTeam.append(finishedTeam)    
        counter += 1
        team = []
    }
}
