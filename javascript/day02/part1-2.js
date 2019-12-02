const fs = require('fs')
let input = fs.readFileSync('input', 'utf-8').trim()

function execute (noun, verb, memory){
  memory[1] = noun
  memory[2] = verb

  for(let i = 0; i < memory.length; i+=4){
    let opcode = memory[i]
    let first = memory[i+1]
    let second = memory[i+2]
    let third = memory[i+3]

    if(opcode == 99)
      break

    if(opcode == 1)
      memory[third] = memory[first] + memory[second]
    if(opcode == 2)
      memory[third] = memory[first] * memory[second]
  }

  return memory[0]
}


console.log(execute(12,2, input.split(',').map(Number)))

for(let i = 0; i < 100; i++){
  for(let j = 0; j < 100; j++){
    let r = execute(i, j, input.split(',').map(Number))
    if(r == 19690720)
      console.log(100*i+j)
  }
}
