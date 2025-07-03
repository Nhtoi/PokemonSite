//!BIG TODO: REFRACTOR TO USE OBJECTS INSTEAD OF PASSING PROPERTIES BY HTML VALUES

import {PopulateArray} from '/DamageRelations.js'

const subButton = document.getElementById("subButton")
const clearButton = document.getElementById("clear")
const shiny = document.getElementById("shinycheck")
const body = document.querySelector("body")
const imageContainer = document.getElementById("image-container")
let typesSet = new Set()

let typeColorsPromise = fetch('colors.json').then(res => res.json());
//team, team.pokemon, team.pokemon.types team.pokemon.name so team is an object that has pokemon as an object
let team = {
    "team": [],
    "allTypes": new Set()
}
let inputPokemon;
let isShiny = false
let pokemonContainers = []
let sound;

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
        console.log(res)
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
    const data = await getData(url)
    // console.log(sound)
    if (isShiny){
        sprite = data.sprites.front_shiny
    } else {
        sprite = data.sprites.front_default
    }
    const img = document.createElement("img")
    const typingDiv = document.createElement("div")
    typingDiv.setAttribute("id", "pokemon")
    typingDiv.setAttribute("name", `${inputPokemon}`)
    typingDiv.setAttribute("sound", `${data.cries.latest}`)
    const types = [...data.types]
    //TypesInfo(data.types)
    const colors = await typeColorsPromise
    //console.log(colors)
    let count = 1
    for (const typing of types) {
        //console.log(typing.type.name)
        let typeTextDiv = document.createElement("div")
        typeTextDiv.setAttribute("id",`type${count}`)
        typeTextDiv.setAttribute("class", colors[typing.type.name] )
        typeTextDiv.innerText = typing.type.name
        count += 1
        typingDiv.append(typeTextDiv)
    }
    //console.log(typingDiv)
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
        TypesInfo(data.types)
        let workingOn = e.target.parentElement
        sound = workingOn.children[0].getAttribute("sound")
        const audio = new Audio(sound);
        audio.volume = 0.06;
        audio.play()
        console.log("Image", workingOn.children[1])
        team.team.push(workingOn.children[1])
        console.log(team.team)
        //team.allTypes.add(TypesInfo(data.types))
        // console.log(team.allTypes)
        teamMaker(workingOn.children[1])  
        clear(e.target.parentElement)
        
    })
}

let counter = 0;
const teamContainer = document.getElementById("team-container")
const completedTeam = document.getElementById("completed-team")
async function teamMaker(pokemonToAdd) {
    const image = pokemonToAdd.getAttribute("src")
    const teamDiv = document.createElement("img")
    teamDiv.setAttribute("src",`${image}`)
    teamContainer.append(teamDiv)
    if (team.team.length === 3){
        let finishedTeam = document.createElement("div")
        finishedTeam.setAttribute("id", `team-number${counter}`)
        let addAll = Array.from(teamContainer.children)
        addAll.forEach(child => {
        finishedTeam.append(child)
        //console.log(team.team)
        })
        //!CALL TO GET DAMAGE RELATIONS        
        const teamDamageRelations = await PopulateArray(Array.from(typesSet)) 
        console.log("Readin from here", teamDamageRelations)
        completedTeam.append(finishedTeam)    
        counter += 1
        team.team = []
        typesSet = new Set()
    }
}

function TypesInfo(data){
    for (const type of data) {
        typesSet.add(type.type.url)
    }
    console.log("HERE",typesSet)
}

//TODO: DISPLAY TEAM DAMAGE RELATIONS

