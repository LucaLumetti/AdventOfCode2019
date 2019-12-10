const fs = require('fs')
let amin = fs.readFileSync('input', 'utf-8');
let map = amin.split("\n").map(l => l.split(""));
let results = amin.split("\n").map(l => l.split(""));

function gcd(x, y) {
	if (typeof x !== "number" || typeof y !== "number") return false;
	x = Math.abs(x);
	y = Math.abs(y);
	while (y) {
		var t = y;
		y = x % y;
		x = t;
	}
	return x;
}

function getAngle(x1, y1, x2, y2) {
	var angle= (Math.atan2(y1 - y2, x1 - x2) * 180) / Math.PI - 90;
	if (angle< 0) angle += 360;
	return angle;
}

function checkLineOfSight(x1, y1, x2, y2) {
	if (y2 === y1 && x2 === x1) return -1;
	if (map[y2][x2] !== "#") return -1;
	if (map[y1][x1] !== "#") return -1;
	let dy = y2 - y1;
	let dx = x2 - x1;
	if (dx !== dy || dy !== 0) {
		let div= gcd(dy, dx);
		dy /= div;
		dx /= div;
	}
	let x = x1 + dx;
	let y = y1 + dy;
	let fullturns = 0;
	while (map[y] && map[y][x]) {
		if (map[y][x] === "#") {
			if (y === y2 && x === x2) return fullturns;
			fullturns++;
		}
		y += dy;
		x += dx;
	}
    return -1
}

let maxCount = 0;
let maxx = 0;
let maxy = 0;
for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
        let count = 0;
        for (let y2 = 0; y2 < map.length; y2++) {
            for (let x2 = 0; x2 < map[0].length; x2++) {
                count += !checkLineOfSight(x, y, x2, y2);
            }
        }
        results[y][x] = count;
        if (count > maxCount) {
            maxCount = count;
            maxx = x;
            maxy = y;
        }
    }
}

let x = maxx
let y = maxy
let slopes = [];
for (let y2 = 0; y2 < map.length; y2++) {
	for (let x2 = 0; x2 < map[0].length; x2++) {
		let l = checkLineOfSight(x, y, x2, y2);
		if (l < 0) continue;
        let slope = {
            angle: getAngle(x, y, x2, y2) + 360*l,
            x: x2,
            y: y2
        }
        slopes.push(slope)
	}
}
slopes.sort((a, b) => (a.angle - b.angle));

console.log(maxCount)
console.log(slopes[199].x*100+slopes[199].y);
