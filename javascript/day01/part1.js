console.log(require('fs').readFileSync('input', 'utf-8').trim().split('\n').map(v=>Math.floor(parseInt(v)/3)-2).reduce((a, b)=>a+b))
