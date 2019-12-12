const fs = require('fs')
let input = fs.readFileSync('input', 'utf-8').trim().split('\n')

class Moon{
    constructor(pos){
        this.pos = pos
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
}

let moons = []
let rgx = /(-?\d+)/g;
input.forEach(l => {
    let m = l.match(rgx).map(Number)
    moons.push(new Moon({x: m[0], y: m[1], z: m[2]}))
})

function step(){
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

for(let i = 0; i < 1000; i++)
    step()
console.log(moons.map(m => m.get_energy()).reduce((a, b)=>a+b))
