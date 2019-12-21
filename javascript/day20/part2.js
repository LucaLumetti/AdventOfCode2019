const fs = require('fs')
const term = require('terminal-kit').terminal
let input = fs.readFileSync('input', 'utf-8').split('\n').map(a => a.split(''))
let U = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
let L = U.toLowerCase()

input.forEach((r, i) => {
    r.forEach((c, j) => {
        if(c !== '.') return
        let portal_name
        if(j+2 < input[0].length && U.indexOf(input[i][j+1]) > -1 && U.indexOf(input[i][j+2]) > -1)
            portal_name = input[i][j+1] + input[i][j+2]
        if(j-2 >= 0 && U.indexOf(input[i][j-1]) > -1 && U.indexOf(input[i][j-2]) > -1)
            portal_name = input[i][j-2] + input[i][j-1]

        if(i+2 < input.length && U.indexOf(input[i+1][j]) > -1 && U.indexOf(input[i+2][j]) > -1)
            portal_name = input[i+1][j] + input[i+2][j]
        if(i-2 >= 0 && U.indexOf(input[i-1][j]) > -1 && U.indexOf(input[i-2][j]) > -1)
            portal_name = input[i-2][j] + input[i-1][j]

        if(portal_name){
            let pad = 5
            if(i < pad || i > input.length-pad || j < pad || j > input[0].length-pad)
                portal_name += 'O'
            else
                portal_name += 'I'

            input[i][j] = portal_name

        }
    })
})

let loc_visited = {}
class Explorer{
    constructor(map, pos, dir, steps = 0, deep_level = 0){
        this.killable = false
        this.deep_level = deep_level
        this.pos = pos
        this.dir = dir
        this._dir
        this.map = map
        this.steps = steps
        if(this.get_cell(this.pos.x, this.pos.y) !== '.')
            this.portal()
    }
    turn_left(){
        this._dir = (this._dir + 3)%4
    }
    turn_right(){
        this._dir = (this._dir + 1)%4
    }
    turn_back(){
        this._dir = (this._dir + 2)%4
    }
    get dir(){
        switch(this._dir){
            case 0: return 'U'
            case 1: return 'R'
            case 2: return 'D'
            case 3: return 'L'
        }
        throw this._dir
    }
    set dir(val){
        switch(val){
            case 'U': this._dir = 0; break;
            case 'R': this._dir = 1; break;
            case 'D': this._dir = 2; break;
            case 'L': this._dir = 3; break;
        }
    }
    get front(){
        switch(this.dir){
            case 'U': return {x: this.pos.x, y: this.pos.y-1}
            case 'D': return {x: this.pos.x, y: this.pos.y+1}
            case 'L': return {x: this.pos.x-1, y: this.pos.y}
            case 'R': return {x: this.pos.x+1, y: this.pos.y}
        }
    }
    get back(){
        switch(this.dir){
            case 'U': return {x: this.pos.x, y: this.pos.y+1}
            case 'D': return {x: this.pos.x, y: this.pos.y-1}
            case 'L': return {x: this.pos.x+1, y: this.pos.y}
            case 'R': return {x: this.pos.x-1, y: this.pos.y}
        }
    }
    get left(){
        switch(this.dir){
            case 'U': return {x: this.pos.x-1, y: this.pos.y}
            case 'D': return {x: this.pos.x+1, y: this.pos.y}
            case 'L': return {x: this.pos.x, y: this.pos.y+1}
            case 'R': return {x: this.pos.x, y: this.pos.y-1}
        }
    }
    get right(){
        switch(this.dir){
            case 'U': return {x: this.pos.x+1, y: this.pos.y}
            case 'D': return {x: this.pos.x-1, y: this.pos.y}
            case 'L': return {x: this.pos.x, y: this.pos.y-1}
            case 'R': return {x: this.pos.x, y: this.pos.y+1}
        }
    }

    get dir_left(){
        switch(this.dir){
            case 'U': return 'L'
            case 'L': return 'D'
            case 'D': return 'R'
            case 'R': return 'U'
        }
    }

    get dir_right(){
        switch(this.dir){
            case 'U': return 'R'
            case 'R': return 'D'
            case 'D': return 'L'
            case 'L': return 'U'
        }
    }
    get_cell(x, y){
        if(x > this.map[0].length || x < 0) return '#'
        if(y > this.map.length || y < 0) return '#'
        return this.map[y][x]
    }
    is_inters(){
        return [this.front, this.right, this.left]
            .filter(pos => this.get_cell(pos.x, pos.y) !== '#').length > 1
    }

    get inters(){
        return [this.front, this.left, this.right]
            .filter(pos => this.get_cell(pos.x, pos.y) !== '#')
    }

    is_end(){
        if(this.killable) return true
        if(this.get_cell(this.front.x, this.front.y) === '#') return true
        return [this.front, this.right, this.left]
            .filter(pos => this.get_cell(pos.x, pos.y) !== '#').length === 0
    }

    step(){
        if(this.get_cell(this.front.x, this.front.y) === '#'){
            if(this.get_cell(this.left.x, this.left.y) !== '#'){
                this.turn_left()
            }else if(this.get_cell(this.right.x, this.right.y) !== '#'){
                this.turn_right()
            }
        }

        switch(this.dir){
            case 'U': this.pos.y -= 1; break;
            case 'D': this.pos.y += 1; break;
            case 'L': this.pos.x -= 1; break;
            case 'R': this.pos.x += 1; break;
        }
        loc_visited[`${this.pos.x},${this.pos.y},${this.deep_level},${this.dir}`] = 1
        this.steps += 1
        if(this.get_cell(this.pos.x, this.pos.y) !== '.'){
            this.portal()
        }
    }

    portal(){
        let portal_name = this.get_cell(this.pos.x, this.pos.y).slice(0, 2)
        let portal_type = this.get_cell(this.pos.x, this.pos.y).slice(2, 3)
        if((portal_name === 'AA' || portal_name === 'ZZ') && this.deep_level === 0) return
        if(portal_name === 'AA' || portal_name === 'ZZ') return this.killable = true
        if(portal_type === 'O'){
            if(this.deep_level === 0){
                return this.killable = true
            }else{
                this.deep_level -= 1
            }
        }else if(portal_type === 'I'){
            this.deep_level += 1
        }
        let pair = portal_type === 'O'?'I':'O'
        for(let i = 0; i < this.map.length; i++){
            for(let j = 0; j < this.map[0].length; j++){
                let c = this.map[i][j]
                if(c === portal_name+pair){
                    this.pos.x = j
                    this.pos.y = i
                    i = this.map.length
                    break
                }
            }
        }
        loc_visited[`${this.pos.x},${this.pos.y},${this.deep_level},${this.dir}`] = 1
        this.steps += 1
        if(this.get_cell(this.left.x, this.left.y) === '.') this.turn_left()
        else if(this.get_cell(this.right.x, this.right.y) === '.') this.turn_right()
        else if(this.get_cell(this.back.x, this.back.y) === '.') this.turn_back()
    }
    is_exit(){
        return this.get_cell(this.pos.x, this.pos.y) === 'ZZO' && this.deep_level === 0
    }

    print_map(){
        this.map.forEach((r, i) => {
            r.forEach((r, j) => {
                if(i === this.pos.y && j === this.pos.x)
                    process.stdout.write(this.dir)
                else
                    process.stdout.write(this.get_cell(j, i))
            })
            process.stdout.write('\n')
        })
    }
}

let _map_cache = {}
function print_labirynth(map, exps){
    map.forEach((r, i) => {
        r.forEach((c, j) => {
            let p = exps.filter(exp => exp.pos.x == j && exp.pos.y == i)
            if(p.length > 0){
                _map_cache[`${i},${j}`] = p[0].deep_level +''
            }
            else if(_map_cache[`${i},${j}`] !== map[i][j]){
                _map_cache[`${i},${j}`] = map[i][j].charAt(0)
            }
            term.moveTo(j, i)
            process.stdout.write(_map_cache[`${i},${j}`])
        })
    })
}

let start = {x: 0, y: 0}
input.forEach((r, i) => {
    r.forEach((c, j) => {
        if(c === 'AAO'){
            start = {x: j, y: i}
        }
    })
})

let explorers = []
explorers.push(new Explorer([...input], start, 'D', 0, 0))

while(explorers.length > 0){
    let len = explorers.length
    for(let e = 0; e < len; e++){
        let exp = explorers[e]
        let nst = 0
        while((!exp.is_end() && !exp.is_exit())){
            exp.step()
            if(!loc_visited[`${exp.left.x},${exp.left.y},${exp.deep_level},${exp.dir}`] && exp.get_cell(exp.left.x, exp.left.y) !== '#')
                explorers.push(new Explorer([...input], exp.left, exp.dir_left, exp.steps+1, exp.deep_level))
            if(!loc_visited[`${exp.right.x},${exp.right.y},${exp.deep_level},${exp.dir}`] && exp.get_cell(exp.right.x, exp.right.y) !== '#')
                explorers.push(new Explorer([...input], exp.right, exp.dir_right, exp.steps+1, exp.deep_level))
        }

    }
    explorers = explorers.filter(e => !e.is_end())
    let fin = explorers.filter(e => e.is_exit())
    if(fin.length > 0){
        console.log(fin[0].steps)
        break
    }
}
