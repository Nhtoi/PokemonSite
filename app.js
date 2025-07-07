import {PopulateArray, singleDamageRelation} from '/DamageRelations.js'
const subButton = document.getElementById("subButton")
const clearButton = document.getElementById("clear")
const shiny = document.getElementById("shinycheck")
const imageContainer = document.getElementById("image-container")
const pokemons = []
const pokemonContainers = []
const typesSet = new Set()
const typeColorsPromise = fetch('colors.json').then(res => res.json());

//team, team.pokemon, team.pokemon.types team.pokemon.name so team is an object that has pokemon as an object
const team = {
    "team": [],
    "allTypes": new Set()
}

let inputPokemon;
let isShiny = false


class Pokemon{
    constructor(name, sprite, cry, typings, typesURL, damageRelations){
        this.name = name
        this.sprite = sprite
        this.cry = cry
        this.typings = typings
        this.typesURL = typesURL 
        this.damageRelations = null
    }
    addToTeam(){
        team.team.push(this)
        console.log(team.team)
    }
    playSound(){
        const audio = new Audio(this.cry);
        audio.volume = 0.06;
        audio.play()
    }
    async getDamageRelations(){
         this.damageRelations = await singleDamageRelation(this.typesURL)
    }
}

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
      clearTarget.replaceChildren("")
        while (pokemonContainers.length > 0){
          pokemonContainers.pop()
      }
    } else{
      target.remove()
      pokemonContainers.pop()
  }  
 }
clearButton.addEventListener("click", ()=>{
    clear()
})
subButton.addEventListener("click", () =>{
    const input = document.getElementById("searchPokemon")
    inputPokemon = input.value.toLowerCase()
    CreatePokemon(setUrl(inputPokemon))
})

function setUrl(inputPokemon){
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
        console.log(res)
        return res
    }
    catch {
        console.error("Pokemon Not Found")
    }
}

async function CreatePokemon(url){
    const data = await getData(url)
    
    const pokemonContainer = document.createElement("div")
    pokemonContainer.setAttribute("id", "pokemonContainer") 
    let sprite = ""

    if (isShiny){
        sprite = data.sprites.front_shiny
    } else {
        sprite = data.sprites.front_default
    }
    
    const img = document.createElement("img")
    const typingDiv = document.createElement("div")

    typingDiv.setAttribute("id", "pokemon")
    
    const types = [...data.types]
    const colors = await typeColorsPromise
    
    let count = 1
    for (const typing of types) {
        let typeTextDiv = document.createElement("div")
        typeTextDiv.setAttribute("id",`type${count}`)
        typeTextDiv.setAttribute("class", colors[typing.type.name] )
        typeTextDiv.innerText = typing.type.name
        count += 1
        typingDiv.append(typeTextDiv)
    }
    count = 0
    
    
    const typesURL = TypesInfo(data)
    let damageRelations;
    const newPokemon = new Pokemon(inputPokemon, sprite, data.cries.latest, types, typesURL, damageRelations)
    await newPokemon.getDamageRelations()
    console.log('HERRE', newPokemon.damageRelations)
    pokemons.push(newPokemon)
    
    
    typingDiv.setAttribute("name", `${newPokemon.name}`)
    img.setAttribute("src", `${newPokemon.sprite}`)

    pokemonContainer.append(typingDiv)
    pokemonContainer.append(img)
    
    imageContainer.append(pokemonContainer)
    pokemonContainers.push(pokemonContainer)

    console.log(pokemonContainers)
    const addPokemon = document.createElement("button")
    addPokemon.setAttribute("id", "AddButton")
    addPokemon.setAttribute("class", "button")
    addPokemon.innerText = "Add Pokemon"
    
    for (const container of pokemonContainers){
            container.append(addPokemon)
    }
    addPokemon.addEventListener("click", (e)=>{
        let workingOn = e.target.parentElement
        const pokeName = workingOn.children[0].getAttribute("name")
        const selectedPokemon = pokemons.find(p => p.name === pokeName)
        selectedPokemon.addToTeam()
        selectedPokemon.playSound()
        teamMaker(selectedPokemon.sprite)  
        clear(e.target.parentElement)
        
    })
}

let counter = 0;
const teamContainer = document.getElementById("team-container")
const completedTeam = document.getElementById("completed-team")

async function teamMaker(pokemonToAdd) {
    const teamDiv = document.createElement("img")
    teamDiv.setAttribute("src",`${pokemonToAdd}`)
    teamContainer.append(teamDiv)
    if (team.team.length === 6){
        let finishedTeam = document.createElement("div")
        finishedTeam.setAttribute("id", `team-number${counter}`)
        let addAll = Array.from(teamContainer.children)
        addAll.forEach(child => {
        finishedTeam.append(child)
        })       
        const teamDamageRelations = await PopulateArray(Array.from(typesSet)) 
        completedTeam.append(finishedTeam)    
        counter += 1
        team.team = []
    }
}

function TypesInfo(data){
    const types = new Set()
    console.log(typeof(data.types))
    for (const type of data.types) {
        types.add(type.type.url)
    }
    return types
}

//TODO: DISPLAY TEAM DAMAGE RELATIONS

