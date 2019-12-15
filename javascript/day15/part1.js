const fs = require('fs')
const term = require( 'terminal-kit' ).terminal
let input = fs.readFileSync('input', 'utf-8').trim()
class IntCode {
    constructor(memory, droid, ip=0){
        this.ip = ip
        this.droid = droid
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
            this.halt = true
        }else if(op == 1){
            this.memory[third] = this.memory[first]+this.memory[second]
        }else if(op == 2){
            this.memory[third] = this.memory[first]*this.memory[second]
        }else if(op == 3){
            this.memory[first] = this.droid.nextMove()
            this.droid.print()
        }else if(op == 4){
            this.droid.moveResult(this.memory[first])
            if(this.memory[first] == 2)
                this.halt = true
            this.droid.print()
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

class Droid {
    constructor(){
        this.map = {}
        this.pos = {x: 0, y: 0}
        this.look = 'N'
        this._look = 0
        this._move = {x: 0, y: 0}
        this.steps = 0
    }

    turn(dir){
        if(dir == 'L'){
            this._look = (this._look+3)%4
        }else{
            this._look = (this._look+1)%4
        }
        switch(this._look){
            case 0: this.look = 'N'; break
            case 1: this.look = 'E'; break
            case 2: this.look = 'S'; break
            case 3: this.look = 'W'; break
        }
    }

    nextMove(){
        let front, back, left, right
        if(this.look === 'N'){
            front = this.map[`${this.pos.x},${this.pos.y-1}`]
            back = this.map[`${this.pos.x},${this.pos.y+1}`]
            left = this.map[`${this.pos.x-1},${this.pos.y}`]
            right = this.map[`${this.pos.x+1},${this.pos.y}`]
        }
        if(this.look === 'S'){
            back = this.map[`${this.pos.x},${this.pos.y-1}`]
            front = this.map[`${this.pos.x},${this.pos.y+1}`]
            right = this.map[`${this.pos.x-1},${this.pos.y}`]
            left = this.map[`${this.pos.x+1},${this.pos.y}`]
        }
        if(this.look === 'E'){
            left = this.map[`${this.pos.x},${this.pos.y-1}`]
            right = this.map[`${this.pos.x},${this.pos.y+1}`]
            back = this.map[`${this.pos.x-1},${this.pos.y}`]
            front = this.map[`${this.pos.x+1},${this.pos.y}`]
        }
        if(this.look === 'W'){
            right = this.map[`${this.pos.x},${this.pos.y-1}`]
            left = this.map[`${this.pos.x},${this.pos.y+1}`]
            front = this.map[`${this.pos.x-1},${this.pos.y}`]
            back = this.map[`${this.pos.x+1},${this.pos.y}`]
        }

        if(left == '#' && front === '#'){
            this.turn('R')
        }else if(right === '#' && front === '#'){
            this.turn('L')
        }else if(right == '.' && left == undefined){
            this.turn('L')
        }else if(right == undefined){
            this.turn('R')
        }else if(front === '#'){
            this.turn('L')
        }

        switch(this.look){
            case 'N': this._move.y = -1; return 1
            case 'S': this._move.y = 1; return 2
            case 'E': this._move.x = 1; return 4
            case 'W': this._move.x = -1; return 3
        }
    }

    moveResult(r){
        if(r === 0){
            this.map[`${this.pos.x + this._move.x},${this.pos.y + this._move.y}`] = '#'
        }else if(r == 1 || r == 2){
            this.pos.x += this._move.x
            this.pos.y += this._move.y
            if(this.map[`${this.pos.x},${this.pos.y}`] == undefined)
                this.steps +=1
            else
                this.steps -=1
            this.map[`${this.pos.x},${this.pos.y}`] = '.'
        }
        this._move.x = 0
        this._move.y = 0
    }
    print(){
        term.clear()
        let minx = Math.min(...Object.keys(this.map).map(k => k.split(',')[0]).map(Number))
        let miny = Math.min(...Object.keys(this.map).map(k => k.split(',')[1]).map(Number))
        Object.keys(this.map).forEach(k => {
            let xy = k.split(',').map(Number)
            let x = xy[0]
            let y = xy[1]
            if(x == this.pos.x && y == this.pos.y)
                term.moveTo(x+Math.abs(minx)+2, y+Math.abs(miny)+2, this.look)
            else
                term.moveTo(x+Math.abs(minx)+2, y+Math.abs(miny)+2, this.map[k])
        })
        term.moveTo(30, 30, `x: ${this.pos.x}, y: ${this.pos.y}`)
        term.moveTo(30, 31, `x: ${this._move.x}, y: ${this._move.y}`)
        term.moveTo(30, 32, `steps: ${this.steps}`)
    }
}
let droid = new Droid()
let computer = new IntCode(input.split(',').map(Number), droid)

setInterval(()=>computer.step(), 1)

