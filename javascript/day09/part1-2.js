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
    '08': 3,
    '09': 1
}

function execute (inputs, memory){
    let relative_base = 0
    let output = 0
    let kk = 0

    memory = memory.map(Number)
    for(let i = 0; i < memory.length;){
        memory[i] = `000${memory[i]}`
        let opcode = memory[i].substr(memory[i].length-2,memory[i].length)
        let mode = memory[i].substr(0,memory[i].length-2).split('')
        memory = memory.map(Number)

        mode = mode.reverse()
        mode.push(0)
        mode.push(0)
        mode.push(0)

        let first, second, third
        if(mode[0] == 0)
            first = memory[i+1]
        else if(mode[0] == 1)
            first = i+1
        else if(mode[0] == 2)
            first = memory[i+1]+relative_base

        if(mode[1] == 0)
            second = memory[i+2]
        else if(mode[1] == 1)
            second = i+2
        else if(mode[1] == 2)
            second = memory[i+2]+relative_base

        if(mode[2] == 0)
            third = memory[i+3]
        else if(mode[2] == 1)
            third = i+3
        else if(mode[2] == 2)
            third = memory[i+3]+relative_base

        if(OPCODE[opcode] >= 1 && memory[first] == undefined)
            memory[first] = 0
        if(OPCODE[opcode] >= 2 && memory[second] == undefined)
            memory[second] = 0
        if(OPCODE[opcode] >= 3 && memory[third] == undefined)
            memory[third] = 0

        i+=OPCODE[opcode]+1

        if(opcode == 99)
            break
        if(opcode == 1)
            memory[third] = memory[first] + memory[second]
        if(opcode == 2)
            memory[third] = memory[first] * memory[second]
        if(opcode == 3)
            memory[first] = inputs[kk++]
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
        if(opcode == 9)
            relative_base += memory[first]
    }

    return output
}

console.log(execute([1], input.split(',')))
console.log(execute([2], input.split(',')))
