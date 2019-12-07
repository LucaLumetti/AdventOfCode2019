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

function execute (inputs, memory){
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
    }

    return output
}

const perm = a => a.length ? a.reduce((r, v, i) => [ ...r, ...perm([ ...a.slice(0, i), ...a.slice(i + 1) ]).map(x => [ v, ...x ])], []) : [[]]

let permutations = perm([0, 1, 2, 3, 4])

let maxOut = -Infinity
let outA
let outB
let outC
let outD
let outE

permutations.forEach(p=>{
    outA = execute([p[0],0], input.split(','))
    outB = execute([p[1], outA], input.split(','))
    outC = execute([p[2], outB], input.split(','))
    outD = execute([p[3], outC], input.split(','))
    outE = execute([p[4], outD], input.split(','))
    if(maxOut < outE) maxOut = outE
})
console.log(maxOut)
