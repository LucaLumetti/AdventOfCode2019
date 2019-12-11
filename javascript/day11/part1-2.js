const fs = require('fs')
let input = fs.readFileSync('input', 'utf-8').trim()
class IntCode {
    constructor(memory, ip=0){
        this.ip = ip
        this.memory = memory.splice(0)
        this.rel_base = 0
        this.halt = false
        this.pause = false
        this.inputs = []
        this.outputs = []
        this.OPCODES = {99: 0, 1: 3, 2: 3, 3: 1, 4: 1, 5: 2, 6: 2, 7: 3, 8: 3, 9: 1}

    }

    input(inp){
        this.inputs.push(inp)
    }

    output(){
        return this.outputs.shift()
    }

    step(){
        if(this.halt) return
        if(this.pause) return
        let fop = this.memory[this.ip]
        let op = fop%100
        let modes = Math.floor(fop/100)
        let m1 = modes%10
        let m2 = Math.floor(modes/10)%10
        let m3 = Math.floor(modes/100)%10

        let first, second, third
        switch(m1){
            case 0: first = this.memory[this.ip+1]; break;
            case 1: first = this.ip+1; break;
            case 2: first = this.memory[this.ip+1]+this.rel_base; break;
        }
        switch(m2){
            case 0: second = this.memory[this.ip+2]; break;
            case 1: second = this.ip+2; break;
            case 2: second = this.memory[this.ip+2]+this.rel_base; break;
        }
        switch(m3){
            case 0: third = this.memory[this.ip+3]; break;
            case 1: third = this.ip+3; break;
            case 2: third = this.memory[this.ip+3]+this.rel_base; break;
        }

        if(this.OPCODES[op] >= 1 && this.memory[first] == undefined)
            this.memory[first] = 0
        if(this.OPCODES[op] >= 2 && this.memory[second] == undefined)
            this.memory[second] = 0
        if(this.OPCODES[op] >= 3 && this.memory[third] == undefined)
            this.memory[third] = 0

        this.ip += this.OPCODES[op]+1
        if(op === 99){
            console.log('SYSTEM HALT')
            this.halt = true
        }else if(op == 1){
            this.memory[third] = this.memory[first]+this.memory[second]
        }else if(op == 2){
            this.memory[third] = this.memory[first]*this.memory[second]
        }else if(op == 3){
            this.memory[first] = this.inputs.shift()
        }else if(op == 4){
            this.outputs.push(this.memory[first])
            this.pause = true
        }else if(op == 5){
            this.ip = this.memory[first]!=0?this.memory[second]:this.ip
        }else if(op == 6){
            this.ip = this.memory[first]==0?this.memory[second]:this.ip
        }else if(op == 7){
            this.memory[third] = this.memory[first] < this.memory[second]?1:0
        }else if(op == 8){
            this.memory[third] = this.memory[first] == this.memory[second]?1:0
        }else if(op == 9){
            this.rel_base += this.memory[first]
        }else{
            console.log('UNKNOWN OP: ' + fop)
            this.halt = true
        }
    }

    run(){
        this.pause = false
        while(!this.halt && !this.pause){
            this.step()
        }
    }
}

class PaintingRobot{
    constructor(){
        this.pos = {x: 0, y: 0}
        this.dir = 'up'
        this.input_type = 'paint'
        this.map = {}
    }

    move(d){
        if(this.dir == 'up' && d == 0){
            this.pos.x -= 1
            this.dir = 'left'
        } else if(this.dir == 'up' && d == 1){
            this.pos.x += 1
            this.dir = 'right'
        }else if(this.dir == 'left' && d == 0){
            this.pos.y -= 1
            this.dir = 'down'
        }else if(this.dir == 'left' && d == 1){
            this.pos.y += 1
            this.dir = 'up'
        }else if(this.dir == 'down' && d == 0){
            this.pos.x += 1
            this.dir = 'right'
        }else if(this.dir == 'down' && d == 1){
            this.pos.x -= 1
            this.dir = 'left'
        }else if(this.dir == 'right' && d == 0){
            this.pos.y += 1
            this.dir = 'up'
        }else if(this.dir == 'right' && d == 1){
            this.pos.y -= 1
            this.dir = 'down'
        }
    }

    paint(color){
        color = color == 1?'w':'b'
        this.map[`${this.pos.x},${this.pos.y}`] = color
    }

    getFloor(){
        let c = this.map[`${this.pos.x},${this.pos.y}`]
        return c === 'w'?1:0
    }

    input(inp){
        if(this.input_type == 'move'){
            this.move(inp)
            this.input_type = 'paint'
        }else if(this.input_type == 'paint'){
            this.paint(inp)
            this.input_type = 'move'
        }
    }
}

let computer = new IntCode(input.split(',').map(Number))
let robot = new PaintingRobot()

while(!computer.halt){
    computer.input(robot.getFloor())
    computer.run()
    robot.input(computer.output())
    computer.run()
    robot.input(computer.output())
}

console.log(Object.keys(robot.map).length)


computer = new IntCode(input.split(',').map(Number))
robot = new PaintingRobot()

robot.map['0,0'] = 'w'
while(!computer.halt){
    computer.input(robot.getFloor())
    computer.run()
    robot.input(computer.output())
    computer.run()
    robot.input(computer.output())
}

let c = Object.keys(robot.map)
    .map(k => {
        let x = k.split(',')[0]
        let y = Number(k.split(',')[1])
        return `${x},${y}`
    })
    .sort((a, b) => {
    let x1 = a.split(',')[0]
    let y1 = a.split(',')[1]
    let x2 = b.split(',')[0]
    let y2 = b.split(',')[1]

    if(y1 != y2) return y2-y1
    return x1-x2
})


for(let j = 0; j < 6; j++){
    for(let i = 1; i < 40; i++){
        let ch = robot.map[`${i},${-Number(j)}`] || ' '
        process.stdout.write(ch == 'w'?'█':' ')
    }
    process.stdout.write('\n')
}
