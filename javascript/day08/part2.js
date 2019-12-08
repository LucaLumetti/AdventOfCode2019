const fs = require('fs')
let input = fs.readFileSync('input', 'utf-8').trim()
let width = 25
let height = 6

let layers = []

input = input.match(/.{150}/g)

let smashedLayers = new Array(150).fill(3)

smashedLayers = smashedLayers.map( (layer,i) =>{
    let l = 2
    for(let j = 0; j < input.length; j++){
        if(l > input[j][i]){
            l = input[j][i]
        }
        if(l != 2)
            return l
    }
    return l
})

smashedLayers = smashedLayers.map(a => a == 0?' ':'█')

let k = 0
for(let i = 0; i < height; i++){
    for(let j = 0; j < width; j++)
       process.stdout.write(`${smashedLayers[k++]}`)
    process.stdout.write('\n')
}
