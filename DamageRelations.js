const final = {
    "teamWeakness": new Set(),
    "teamEffective": new Set()
}

export async function PopulateArray(array){
    await getURL(array)
    return final
}

async function getURL(array) {
    console.log("Array in test.js", array)
    for (const item of array) {
            console.log("item in test.js", item)
            const data = await fetch(`${item}`)
            const jsonData = await data.json()
            const relations = await GetDamageRelations(jsonData)
            DisplayDamageRelations(relations)
    }
}


async function GetDamageRelations(data){
    let res = data
    console.log("from GetDamageRelations ", res)
    const weak = res.damage_relations.double_damage_from
    const effective = res.damage_relations.double_damage_to
    const relations = {}
    const weaknesses = {}
    const effectiveness = {}

    for (let i = 0; i < weak.length; i++) {
        //console.log(`Weak Against, ${weak[i].name}`)
        weaknesses[i] = weak[i].name
    }
      for (let i = 0; i < effective.length; i++) {
        //console.log(`Strong Against, ${effective[i].name}`)
        effectiveness[i] = effective[i].name
    
    }
    relations["effectiveness"] = effectiveness
    relations["weaknesses"] = weaknesses
    return relations
}

function DisplayDamageRelations(damageRelations){
    final.teamWeakness.add(damageRelations.weaknesses)
    final.teamEffective.add(damageRelations.effectiveness)
    return final
} 

//TODO: GET SINGULAR POKEMON DAMAGE RELATIONS