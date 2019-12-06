let a = 0
let b = 0
let c = 0
let d = 0
let e = 0
let f = 0
let g = 0

let num = 100000

function toNum(a,b,c,d,e,f,g){
return a*1000000+b*100000+c*10000+d*1000+e*100+f*10+g*1
}

while(toNum(a,b,c,d,e,f,g) < num){
    if(a<=b && b<=c && c<=d && d<=e && e<=f && f<=g)
    console.log(toNum(a,b,c,d,e,f,g))
    g++
    f+=Math.floor(g/10)
    e+=Math.floor(f/10)
    d+=Math.floor(e/10)
    c+=Math.floor(d/10)
    b+=Math.floor(c/10)
    a+=Math.floor(b/10)

    g=g==10?0:g
    f=f==10?0:f
    e=e==10?0:e
    d=d==10?0:d
    c=c==10?0:c
    b=b==10?0:b
}
