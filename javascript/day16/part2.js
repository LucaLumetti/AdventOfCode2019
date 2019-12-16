const fs = require('fs')
let input = fs.readFileSync('input', 'utf-8').trim().split('').map(Number)

input = [].concat(...new Array(10000).fill(input))

let offset = input.slice(0, 7).join('')
for(let j = 0; j < 100; j++){
    let sum = 0
    for(let i = input.length-2; i >= offset; i--){
        sum += input[i]
        input[i] = Math.abs(sum%10)
    }
}
console.log(input.splice(offset, 8).join(''))
