const fs = require('fs')
let input = fs.readFileSync('input', 'utf-8').trim()
let width = 25
let height = 6

let layers = []

input = input.match(/.{150}/g)

let lowest0layer = [+Infinity, +Infinity];

input.forEach((l, i) => {
    let zeros = l.split('').filter(p => p == '0').length;
    if(lowest0layer[0] > zeros){
        lowest0layer[1] = i
        lowest0layer[0] = zeros
    }
})

let layer = input[lowest0layer[1]]
console.log(layer.split('').filter(p => p == '1').length*layer.split('').filter(p => p == '2').length)
