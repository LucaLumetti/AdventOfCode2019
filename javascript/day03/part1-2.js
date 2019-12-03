const fs = require('fs')
let input = fs.readFileSync('input', 'utf-8').trim().split('\n').map(a=>a.split(',')).map(path => path.map(dir => /(.)(\d+)/g.exec(dir).slice(1,3)))

let A = input[0]
let B = input[1]

const dirX = {'U': 0,'D': 0,'R': +1,'L': -1}
const dirY = {'U': +1,'D': -1,'R': 0,'L': 0}

function getPoints(path){
  let pointsMap = {}
  let x = 0
  let y = 0
  let len = 0

  path.forEach(d =>{
    for(let i = 0; i < d[1]; i++){
      len += 1
      x += dirX[d[0]] 
      y += dirY[d[0]]
      pointsMap[`${x},${y}`] = len
    }
  })
  return pointsMap
}

let pA = getPoints(A)
let pB = getPoints(B)
let cross = Object.keys(pA).filter(k => pB[k])
let part1 = cross.map(p=>p.split(',').map(Number).map(Math.abs).reduce((a,b)=>a+b))
let part2 = cross.map(p => pA[p]+pB[p])

console.log(Math.min(...part1))
console.log(Math.min(...part2))
