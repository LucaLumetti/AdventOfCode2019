const fs = require('fs')
const reactions = fs.readFileSync('input', 'utf-8').trim().split('\n')
    .map(l => {
        let a = l.split(' => ')
        return {
            inputs: a[0].split(', ').map(c => {
                let b = c.split(' ')
                return {
                    amount: Number(b[0]),
                    name: b[1]
                }
            }),
            output: {
                name: a[1].split(' ')[1],
                amount: Number(a[1].split(' ')[0])
            }
        }
    })


let inventory = {}

function produce(name, amount) {
    let ore = 0
    const reaction = reactions.find(e => e.output.name === name)
    const multiplier = Math.ceil(amount / reaction.output.amount)
    for (let input of reaction.inputs) {
        if (input.name === 'ORE') {
            ore += multiplier * input.amount
        } else {
            if (!inventory[input.name]) inventory[input.name] = 0
            if (inventory[input.name] < multiplier * input.amount)
                ore += produce(input.name, multiplier * input.amount - inventory[input.name])
            inventory[input.name] -= multiplier * input.amount
        }
    }
    if (!inventory[reaction.output.name]) inventory[reaction.output.name] = 0
    inventory[reaction.output.name] += multiplier * reaction.output.amount
    return ore
}

console.log(produce('FUEL', 1))

let n = 819e4 //find by doing binary search by hand :D

while(true){
    let ore = produce('FUEL', n)
    if(ore >= 1e12)
        break
    n++
}

console.log(n-1)
