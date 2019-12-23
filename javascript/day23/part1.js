const fs = require('fs')

let input = fs.readFileSync('input', 'utf-8').trim()

let NAT_SEND = [+Infinity,+Infinity]
class IntCode {
    constructor(memory){
        this.memory = [...memory]
        this._memory_backup = [...memory]
        this.ip = 0
        this.rel_base = 0
        this.halt = false
        this.pause = false
        this.is_waiting = false
        this.empty_inputs = 0
        this.inputs = []
        this.outputs = []
        this.OPCODES = {99: 0, 1: 3, 2: 3, 3: 1, 4: 1, 5: 2, 6: 2, 7: 3, 8: 3, 9: 1}
        this.computers = []
        this.address = -1
    }

    setAddress(a){
        this.address = a
        this.inputs = [a]
    }

    setComputers(c){
        this.computers = c
    }

    reset(){
        this.ip = 0
        this.rel_base = 0
        this.halt = false
        this.pause = false
        this.inputs = []
        this.outputs = []
        this.memory = [...this._memory_backup]
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

//        console.log(`${this.address} FOP: ${fop} ${first} ${second} ${third}, IP: ${this.ip}, LEN: ${this.OPCODES[op]}`)
        this.ip += this.OPCODES[op]+1
        if(op === 99){
            this.halt = true
        }else if(op == 1){
            this.memory[third] = this.memory[first]+this.memory[second]
        }else if(op == 2){
            this.memory[third] = this.memory[first]*this.memory[second]
        }else if(op == 3){
            if(this.inputs.length === 0){
                this.memory[first] = -1
                this.empty_inputs += 1
                if(this.empty_inputs > 40){
                    this.is_waiting = true
                }
            }else{
                this.memory[first] = this.inputs.shift()
                this.is_waiting = false
                this.empty_inputs = 0
            }
        }else if(op == 4){
            this.outputs.push(this.memory[first])
            if(this.outputs.length === 3){
                let ADDR = this.outputs[0]
                let X = this.outputs[1]
                let Y = this.outputs[2]
                if(ADDR === 255){
                    if(NAT_SEND[1] === Y){
                        console.log(X, Y)
                        process.exit(0)
                    }
                    NAT_SEND = [X, Y]
                }else{
                    this.computers[ADDR].input(X)
                    this.computers[ADDR].input(Y)
                }
                this.outputs = []
            }
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
            console.log('UNKNOWN OP: ' + fop + ' at ' + this.ip)
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


let computers = new Array(50).fill(0)

computers = computers.map(c => new IntCode(input.split(',').map(Number)))
computers.forEach((c, i) => {
    c.setAddress(i)
    return c
})

computers.forEach(c =>{
    c.setComputers(computers)
})

let s = 0
while(computers.filter(c => !c.halt).length > 0){

    let r = computers.filter(c => !c.is_waiting).length
    let t = computers.map(c => !c.is_waiting)
    if(r !== s){
        s = r
    }
    if(computers.filter(c => c.is_waiting).length >= 50){
        computers[0].input(NAT_SEND[0])
        computers[0].input(NAT_SEND[1])
    }
    computers.forEach(c => c.step())
}
