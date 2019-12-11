class intCode{
    constructor(filename, pausecount){
        var data = fs.readFileSync(filename).toString().split('\n');
        if(data[data.length-1]==''){data.pop();}
        this.p = data[0].split(',').map(Number);
        this.maxp = this.p.length;
        this.instruction=0;
        this.done=false;
        this.relbase = 0;
        this.pausecount=pausecount; //1 = pause after each output, 0 = no pauses, run to completion
    }

    run(rin){
        var ip1, ip2, ip3, op, oppos;
        var i, inc=4;
        var pmode1,pmode2,pmode3;
        var inst, opc, ipcount=0;
        var rout=[];
        var p=this.p;
                
        for(i=this.instruction;i<this.p.length;i+=inc){
        
            inst = p[i];
            opc=inst%100;
            pmode1 = (inst-opc)%1000/100;
            pmode2 = (inst-pmode1*100-opc)%10000/1000;
            pmode3 = (inst-pmode2*1000-pmode1*100-opc)%100000/10000;
        
            if(pmode1==0){ip1=p[p[i+1]]}else if(pmode1==1){ip1=p[i+1];}else{ip1=p[p[i+1]+this.relbase];}
            if(pmode2==0){ip2=p[p[i+2]]}else if(pmode2==1){ip2=p[i+2];}else{ip2=p[p[i+2]+this.relbase];}
            if(pmode3==0){ip3=p[p[i+3]]}else if(pmode3==1){ip3=p[i+3];}else{ip3=p[p[i+3]+this.relbase];}

            if(ip1==undefined){ip1=0;}
            if(ip2==undefined){ip2=0;}
            if(ip3==undefined){ip3=0;}
        
            if(opc==1||opc==2||opc==7||opc==8){
                if(pmode3==2){oppos=p[i+3]+this.relbase;}else{oppos=p[i+3];}    
            } else if (opc==3){
                if(pmode1==2){oppos=p[i+1]+this.relbase;}else{oppos=p[i+1];}
            }
        
            // console.log('INPUT i='+i+': inst:'+inst+'; p[i+1]: '+p[i+1]+'; p[i+2]: '+p[i+2]+'; pmode1='+pmode1+'; pmode2='+pmode2);
            switch(opc){
                case 1:
                    op=ip1+ip2;
                    inc=4;
                    break;
                case 2: 
                    op=ip1*ip2;
                    inc=4;
                    break;
                case 3:
                    op=rin[ipcount];
                    ipcount++;
                    inc=2;
                    break;
                case 4:
                    rout.push(ip1);
                    console.log('OUTPUT: p'+i+': '+ip1);
                    inc=2;
                    break; 
                case 5:
                    if(ip1!=0){
                        i=ip2;
                        inc=0;
                    } else {inc=3;}
                    break; 
                case 6:
                    if(ip1==0){
                        i=ip2;
                        inc=0;
                    } else {inc=3;}
                    break; 
                case 7:
                    if(ip1<ip2){op=1;}else{op=0;}
                    inc=4;
                    break; 
                case 8:
                    if(ip1==ip2){op=1;}else{op=0;}
                    inc=4;
                    break;
                case 9:
                    this.relbase+=ip1;
                    inc=2;
                    break;
            }
            
            if(opc==1||opc==2||opc==3||opc==7||opc==8){
                p[oppos]=op;
                // console.log('WRITING i='+i+': '+op+' to p['+oppos+']');
            }
            if(opc==99){
                this.done=true;
                break;
            }

            if(opc==4&&rout.length==this.pausecount){ //pause if instruction is an output and pausecount is reached
                break;
            }
        }
        this.instruction=i+=inc;
        return rout;
    }
}

class Panel {
    constructor(x,y){
        this.x
        this.y
        this.color=0;
        this.visits=1;
    }

    Paint(c){
        this.color=c;
        this.visits++;
    }
}

var ret, comp;
const fs = require('fs');
var robotx=0,roboty=0;
var dir = 'u',todo=[];
var panels = [];
var visited = [];
var ix, coords;

comp = new intCode('./input', 2);

while(!comp.done){
    coords=robotx.toString()+','+roboty.toString();
    if(visited.includes(coords)){ //previously visit panel
        ix = visited.indexOf(coords);
    } else { // new panel
        panels.push(new Panel(robotx,roboty));
        visited.push(coords);
        ix = visited.length-1;
    }
    todo=comp.run([panels[ix].color]);
    panels[ix].Paint(todo[0]);
    if(todo[1]==0){ //left
        if(dir=='u'){dir='l';}else if(dir=='l'){dir='d';}else if(dir=='d'){dir='r';}else{dir='u';}
    } else { //right
        if(dir=='u'){dir='r';}else if(dir=='r'){dir='d';}else if(dir=='d'){dir='l';}else{dir='u';}
    }
    switch(dir){
        case 'u': roboty++; break;
        case 'l': robotx--; break;
        case 'd': roboty--; break;
        case 'r': robotx++; break;
    }
}

ret = visited.length;
console.log('Part 1: '+ret);

