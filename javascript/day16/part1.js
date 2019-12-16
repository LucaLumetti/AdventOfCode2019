const fs = require('fs')
let input = fs.readFileSync('input', 'utf-8').trim().split('').map(Number)

let base_pattern = [0, 1, 0, -1]

function bpattern(n,l){
    let patt = []
    for(let i = 0; i < base_pattern.length*n; i++){
        patt.push(base_pattern[Math.floor(i/n)])
    }

    while(patt.length < l+1){
        let a = patt.concat(patt)
        patt = a
    }

    patt.shift()

    return patt
}


let result = ''
for(let j = 0; j < 100; j++){
    for(let i = 0; i < input.length; i++){
        let p = bpattern(i+1, input.length)
        let r = ''+input.map((a, i) => a*p[i]).reduce((a,b)=>a+b)
        result += r.charAt(r.length-1)
    }
    input = result.split('').map(Number)
    result = ''
}

console.log(input.slice(0, 8).join(''))
