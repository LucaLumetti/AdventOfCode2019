const fs = require('fs')
let input = fs.readFileSync('input', 'utf-8').trim()

function execute (noun, verb, memory){
  memory[1] = `${noun}`
  memory[2] = `${verb}`

  for(let i = 0; i < memory.length; i+=4){
    let opcode = Number(memory[i])
    let first = Number(memory[i+1])
    let second = Number(memory[i+2])
    let third = Number(memory[i+3])

    if(opcode == 99)
      break

    if(opcode == 1)
      memory[Number(third)] = `(${memory[first]} + ${memory[second]})`
    if(opcode == 2)
      memory[Number(third)] = `(${memory[first]} * ${memory[second]})`
  }

  return memory[0]
}

console.log(execute('x','y', input.split(',')))



