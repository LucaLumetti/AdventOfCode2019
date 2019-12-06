const fs = require('fs')
let input = fs.readFileSync('input', 'utf-8').trim().split('\n').map(v=>v.split(')'))

let orbits = {}
input.forEach(o => {
    let a = `${o[0]}`
    let b = `${o[1]}`

    if(!orbits[a])
        orbits[a] = {id: a, ch: []}
    if(!orbits[b])
        orbits[b] = {id: b, ch: []}
    if(orbits[b])
        orbits[a].ch.push(orbits[b])
})

let COM = orbits['COM']
let SAN = orbits['SAN']
let YOU  = orbits['YOU']

function countWalk(com, i){
    if(com.ch.length == 0)
        return i
    return i+com.ch.map(c => countWalk(c, i+1)).reduce((a,b)=>a+b)
}

function hasP(com, p){
    if(com.ch.filter(k => k.id == p.id).length > 0)
        return true
    let f = false
    for(let i = 0; i < com.ch.length; i++){
        f = f || hasP(com.ch[i], p)
    }
    return f
}

function findCommonPlanet(com){
    if(!hasP(com, SAN) || !hasP(com, YOU))
        return false
    COMMON = com
    com.ch.forEach(findCommonPlanet)
}

function stepsTo(com, p){
    if(com.ch.filter(k => k.id == p.id).length > 0)
        return 0
    return 1+stepsTo(com.ch.filter(k => hasP(k, p))[0], p)
}

console.log(countWalk(COM, 0))
findCommonPlanet(COM)
console.log(stepsTo(COMMON, SAN) + stepsTo(COMMON, YOU))
