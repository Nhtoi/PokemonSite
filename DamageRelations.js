

export async function PopulateArray(array){
    return await getURL(array)
}

export async function singleDamageRelation(url){
    return getSingle(url)
}
async function getSingle(array) {
    const relations = {
    "weakness": new Set(),
    "effective": new Set()
    }
    //console.log("Array in test.js", array)
    for (const item of array) {
            //console.log("item in test.js", item)
            const data = await fetch(`${item}`)
            const jsonData = await data.json()
            const damageRelations = await GetDamageRelations(jsonData)
    
            for (const type of Object.values(damageRelations.weaknesses)) {
                relations.weakness.add(type)
            }
            for (const type of Object.values(damageRelations.effectiveness)) {
                relations.effective.add(type)
            }
        }
    return relations
}

async function getURL(array) {
    //console.log("Array in test.js", array)
    for (const item of array) {
            //console.log("item in test.js", item)
            const data = await fetch(`${item}`)
            const jsonData = await data.json()
            const relations = await GetDamageRelations(jsonData)
            DisplayDamageRelations(relations)
    }
}


async function GetDamageRelations(data){
    let res = data
    //console.log("from GetDamageRelations ", res)
    const weak = res.damage_relations.double_damage_from
    const effective = res.damage_relations.double_damage_to
    const relations = {}
    const weaknesses = {}
    const effectiveness = {}

    for (let i = 0; i < weak.length; i++) {
        // console.log(`Weak Against, ${weak[i].name}`)
        weaknesses[i] = weak[i].name
    }
      for (let i = 0; i < effective.length; i++) {
        // console.log(`Strong Against, ${effective[i].name}`)
        effectiveness[i] = effective[i].name
    
    }
    relations["effectiveness"] = effectiveness
    relations["weaknesses"] = weaknesses
    return relations
}



function DisplayDamageRelations(damageRelations) {
    const final = {
    "teamWeakness": new Set(),
    "teamEffective": new Set()
    }
    for (const type of Object.values(damageRelations.weaknesses)) {
        final.teamWeakness.add(type);
    }
    for (const type of Object.values(damageRelations.effectiveness)) {
        final.teamEffective.add(type);
    }
    return final;
}

