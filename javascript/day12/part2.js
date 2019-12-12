const fs = require('fs')
let input = fs.readFileSync('input', 'utf-8').trim().split('\n')

function lcm2(x, y) {
    if ((typeof x !== 'number') || (typeof y !== 'number')) 
        return false;
    return (!x || !y) ? 0 : Math.abs((x * y) / gcd2(x, y));
}

function lcm3(x, y, z){
    return lcm2(x, lcm2(y, z))
}

function gcd2(x, y) {
    x = Math.abs(x);
    y = Math.abs(y);
    while(y) {
        let t = y;
        y = x % y;
        x = t;
    }
    return x;
}

class Moon{
    constructor(pos){
        this.cycles = {x: 1, y:1, z: 1}
        this.pos = {...pos}
        this.initial_pos = {...pos}
        this.vel = {x: 0, y:0, z: 0}
    }

    get_pot_energy(){
        return Math.abs(this.pos.x) + Math.abs(this.pos.y) + Math.abs(this.pos.z)
    }

    get_kn_energy(){
        return Math.abs(this.vel.x) + Math.abs(this.vel.y) + Math.abs(this.vel.z)
    }

    get_energy(){
        return this.get_pot_energy()*this.get_kn_energy()
    }

    get_cycles_lcm(){
        return lcm_two_numbers(this.cycles.x, lcm_two_numbers(this.cycles.y, this.cycles.z))
    }
}

let moons = []
let rgx = /(-?\d+)/g;
input.forEach(l => {
    let m = l.match(rgx).map(Number)
    moons.push(new Moon({x: m[0], y: m[1], z: m[2]}))
})

function step(n){
    moons.forEach((m, i) => {
        moons.forEach((n, j) => {
            if(i >= j)  return
            if(m.pos.x > n.pos.x){
                m.vel.x -= 1
                n.vel.x += 1
            }else if(m.pos.x < n.pos.x){
                m.vel.x +=1
                n.vel.x -=1
            }
            if(m.pos.y > n.pos.y){
                m.vel.y -=1
                n.vel.y += 1
            }else if(m.pos.y < n.pos.y){
                m.vel.y += 1
                n.vel.y -=1
            }
            if(m.pos.z > n.pos.z){
                m.vel.z -=1
                n.vel.z +=1
            }else if(m.pos.z < n.pos.z){
                m.vel.z +=1
                n.vel.z -=1
            }
        })
    })
    moons.forEach(m => {
        m.pos.x += m.vel.x
        m.pos.y += m.vel.y
        m.pos.z += m.vel.z
    })
}

let ppx = false, ppy = false, ppz = false
let cyclex = 0; cycley = 0; cyclez = 0

for(let n = 1; !ppx || !ppy || !ppz; n++){
let px = true, py = true, pz = true
    step(n)
    moons.forEach(m => {
        if(m.pos.x !== m.initial_pos.x || m.vel.x !== 0) px = false
        if(m.pos.y !== m.initial_pos.y || m.vel.y !== 0) py = false
        if(m.pos.z !== m.initial_pos.z || m.vel.z != 0) pz = false
    })
    if(px && !ppx){
        cyclex = n
        ppx = true
    }
    if(py && !ppy){
        cycley = n
        ppy = true
    }
    if(pz && !ppz){
        cyclez = n
        ppz = true
    }
    let br = true
    moons.forEach(m => {
        if(m.cycles.x === 1 || m.cycles.y === 1 || m.cycles.z === 1) br = false
    })
    if(br) break
}

console.log(lcm3(cyclex, cycley, cyclez))
