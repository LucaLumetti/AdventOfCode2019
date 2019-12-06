const fs = require('fs')
let input = fs.readFileSync('input', 'utf-8').trim()

// opcode: number of params
const OPCODE = {
    '99': 0,
    '01': 3,
    '02': 3,
    '03': 1,
    '04': 1,
    '05': 2,
    '06': 2,
    '07': 3,
    '08': 3
}

function execute (input, memory){
    let output = 0

    memory = memory.map(Number)
    for(let i = 0; i < memory.length;){
        memory[i] = `0000${memory[i]}`
        let opcode = memory[i].substr(memory[i].length-2,memory[i].length)
        let mode = memory[i].substr(0,memory[i].length-2).split('')

        memory[i] = Number(memory[i])
        mode = mode.reverse()
        mode.push(0)
        mode.push(0)
        mode.push(0)

        let first = mode[0] == 1 ? i+1 : memory[i+1]
        let second = mode[1] == 1 ? i+2 : memory[i+2]
        let third = mode[2] == 1 ? i+3 : memory[i+3]

        i+=OPCODE[opcode]+1
        if(opcode == 99)
            break

        if(opcode == 1)
            memory[third] = memory[first] + memory[second]
        if(opcode == 2)
            memory[third] = memory[first] * memory[second]
        if(opcode == 3)
            memory[first] = input
        if(opcode == 4)
            output = memory[first]
        if(opcode == 5)
            i = memory[first]?memory[second]:i
        if(opcode == 6)
            i = !memory[first]?memory[second]:i
        if(opcode == 7)
            memory[third] = memory[first]<memory[second]?1:0
        if(opcode == 8)
            memory[third] = memory[first]==memory[second]?1:0
    }

    return output
}

console.log(execute(1, input.split(',')))
console.log(execute(5, input.split(',')))
