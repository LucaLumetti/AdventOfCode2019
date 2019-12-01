const fs = require('fs')

let input = fs.readFileSync('input', 'utf-8').trim().split('\n').map(v=>parseInt(v))

total_fuel = 0
input.forEach((v) => {
  while(1){
    v = Math.floor(v/3)-2
    if(v < 0) break
    total_fuel += v
  }
})

console.log(total_fuel)
