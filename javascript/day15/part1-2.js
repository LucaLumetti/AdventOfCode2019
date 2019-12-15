const fs = require('fs')
const term = require( 'terminal-kit' ).terminal

const CHAR = {
    '#': '^#^W ^:',
    'O': '^#^B ^:',
    '.': ' ',
    'P': '^#^R ^:'

}
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
            if(this.memory[first] == 99)
                this.halt = true
            this.droid.print()
        }else if(op == 4){
            this.droid.moveResult(this.memory[first])
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
        this._map_cache = {}
        this.pos = {x: 0, y: 0}
        this.look = 'N'
        this._look = 0
        this._move = {x: 0, y: 0}
        this.steps = 0
        this.oxygen = {steps: 0}
        this.check = 0
        this.full = false
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
        if(this.pos.x == 0 && this.pos.y == 0){
            if(this.check > 5)
                return 99
            else
                this.check += 1
        }
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

        right = right === 'O'?'.':right
        left = left === 'O'?'.':left
        front = front === 'O'?'.':front
        back = back === 'O'?'.':back
        if(left == '#' && front === '#'){
            this.turn('R')
        }else if(right === '#' && front === '#'){
            this.turn('L')
        }else if(right == '.' && left == undefined){
            this.turn('L')
        }else if(right == undefined){
            this.turn('R')
        }else if(front === '#' && right == '.' && left === '.' && back == '.'){
            this.turn('R')
        }else if(front === '#' && left == '.'){
            this.turn('L')
        }else if(right === '.' && front === '.'){
            this.turn('R')
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
            if(!this.oxygen.found)
                if(this.map[`${this.pos.x},${this.pos.y}`] == undefined){
                    this.steps +=1
                }else{
                    this.steps -=1
                }
            this.map[`${this.pos.x},${this.pos.y}`] = r == 1?'.':'O'
        }
        if(r == 2){
            this.oxygen.x = this.pos.x
            this.oxygen.y = this.pos.y
            this.oxygen.found = true
        }
        this._move.x = 0
        this._move.y = 0
    }
    print(){
        let nminx = Math.min(...Object.keys(this.map).map(k => k.split(',')[0]).map(Number))
        let nminy = Math.min(...Object.keys(this.map).map(k => k.split(',')[1]).map(Number))
        if(this.minx !== nminx || this.miny !== nminy){
            term.clear()
            this._map_cache = {}
            this.minx = nminx
            this.miny = nminy
        }
        Object.keys(this.map).forEach(k => {
            let xy = k.split(',').map(Number)
            let x = xy[0]
            let y = xy[1]
            let cx = xy[0] + Math.abs(this.minx)+2
            let cy = xy[1] + Math.abs(this.miny)+2

            let toPrint = ''
            if(x == this.pos.x && y == this.pos.y){
                toPrint = 'P'
                this._map_cache[k] = this.look
            }else if(x === this.oxygen.x && y === this.oxygen.y){
                toPrint = 'O'
                this._map_cache[k] = 'O'
            }else if(x === 0 && y === 0){
                toPrint = 'X'
                this._map_cache[k] = 'X'
            }else{
                if(this._map_cache[k] == this.map[k]) return
                toPrint = this.map[k]
                this._map_cache[k] = this.map[k]
            }
            term.moveTo(cx, cy, CHAR[toPrint] || toPrint)
        })
    }
    spreadOxygen(){
        this.full = true
        Object.keys(this.map).forEach(k => {
            if(this.map[k] !== 'O') return
            let xy = k.split(',').map(Number)
            let x = xy[0]
            let y = xy[1]
            if(this.map[`${x+1},${y}`] === '.'){
                this.map[`${x+1},${y}`] = 'OO'
                this.full = false
            }
            if(this.map[`${x-1},${y}`] === '.'){
                this.map[`${x-1},${y}`] = 'OO'
                this.full = false
            }
            if(this.map[`${x},${y+1}`] === '.'){
                this.map[`${x},${y+1}`] = 'OO'
                this.full = false
            }
            if(this.map[`${x},${y-1}`] === '.'){
                this.map[`${x},${y-1}`] = 'OO'
                this.full = false
            }
        })
        Object.keys(this.map).forEach(k => {
            if(this.map[k] === 'OO') this.map[k] = 'O'
        })
        if(this.full == false){
            this.oxygen.steps += 1
        }
    }
}
let droid = new Droid()
let computer = new IntCode(input.split(',').map(Number), droid)

while(!computer.halt){
    computer.step()
}

while(!droid.full){
    droid.spreadOxygen()
    droid.print()
}

term.moveTo(0, 44)
console.log(droid.steps)
console.log(droid.oxygen.steps)
