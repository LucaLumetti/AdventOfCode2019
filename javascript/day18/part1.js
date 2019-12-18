const fs = require('fs')
let input = fs.readFileSync('input1', 'utf-8').trim().split('\n').map(l => l.split(''))

let lowercase = "abcdefghijklmnopqrstuvwxyz"
let uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
let keys= {}
let doors = {}
input.forEach((r, i) => {
    r.forEach((c, j) => {
        let pos = {x: i, y: j}
        if(lowercase.indexOf(c) > -1){
            keys[c] = pos
        }else if(uppercase.indexOf(c) > -1){
            doors[c] = pos
        }
    })
})

function printMap(map){
    for(let i = 0; i < map.length; i++){
        console.log(map[i].join(''))
    }
}

function cloneMatrix(matrix){
    return matrix.map(function(arr) {
        return arr.slice();
    });
}
function keysOnSight(map){
    map = cloneMatrix(map)
    let finish = false
    let onsight = []
    let steps = 0
    while(!finish){
        finish = true
        steps += 1
        map.forEach((r, i) => {
            r.forEach((c, j) => {
                if(c !== '@') return
                let up = map[i][j-1]
                let down = map[i][j+1]
                let left = map[i-1][j]
                let right = map[i+1][j]
                if(up === '.' || lowercase.indexOf(up) > -1){
                    map[i][j-1] = '@@'
                    if(up !== '.') onsight.push({k: up, s: steps})
                    finish = false
                }
                if(down === '.' || lowercase.indexOf(down) > -1){
                    map[i][j+1] = '@@'
                    if(down !== '.') onsight.push({k: down, s: steps})
                    finish = false
                }
                if(left === '.' || lowercase.indexOf(left) > -1){
                    map[i-1][j] = '@@'
                    if(left !== '.') onsight.push({k: left, s: steps})
                    finish = false
                }
                if(right === '.' || lowercase.indexOf(right) > -1){
                    map[i+1][j] = '@@'
                    if(right !== '.') onsight.push({k: right, s: steps})
                    finish = false
                }
            })
        })
        map.forEach((r, i) => {
            r.forEach((c, j) => {
                if(c === '@@')
                    map[i][j] = '@'
            })
        })
    }
    return onsight
}

function takeKey(map, k){
    let kx = keys[k].x
    let ky = keys[k].y
    map.forEach((r, i) => {
        r.forEach((c, j) => {
            if(c === '@') map[i][j] = '.'
        })
    })
    map[kx][ky] = '@'
    let d = k.toUpperCase()
    if(doors[d] == undefined) return map
    let x = doors[d].x
    let y = doors[d].y
    map[x][y] = '.'
    return map
}

function mapFromKeys(map, ks){
    map = cloneMatrix(map)
    ks.split('').forEach(k =>{
        map = takeKey(map, k)
    })
    return map
}

function solve(map, steps, keys, fmin){
    console.log(keys, steps, fmin)
    if(steps >= fmin) return {s: Infinity, m: Infinity}
    let osk = keysOnSight(map)
    let smin = osk.reduce((a, b) => a.s + b.s, 0)
    if(steps + smin >= fmin) return {s: +Infinity, m: +Infinity}
    if(osk.length === 0){
        return {s: steps, m: fmin}
    }

    let min = +Infinity
    let states = []
    for(key of osk){
        let s = solve(mapFromKeys(map, keys+key.k), steps + key.s, keys + key.k, fmin)
        fmin = s.m < fmin ? s.m : fmin
        if(s.s < min)
            min = s.s
    }
    return {s: min, m: min}
}

console.log(solve(input, 0, "", +Infinity))
