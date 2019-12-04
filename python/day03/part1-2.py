f = open('input', 'r').readlines()

paths = [l.split(',') for l in f]

direction = {'R': [1, 0],'L': [-1, 0],'U': [0, 1],'D': [0, -1]}

wiresmap = [{} for _ in paths]

for j in range(len(paths)):
    path = paths[j]
    x = 0
    y = 0
    plen = 0

    for i in range(len(path)):
        wire = path[i]
        move = wire[0]
        steps = int(wire[1:])
        for _ in range(steps):
            plen += 1
            x += direction[move][0]
            y += direction[move][1]
            wiresmap[j]['{},{}'.format(x, y)] = plen

def intersection(wire1, wire2):
    inters = {}
    for k in wire1:
        if(k in wire2):
            inters[k] = wire1[k] + wire2[k]
    return inters

inters = intersection(wiresmap[0], wiresmap[1])

#part1
min_man = float('+inf')
for c in inters:
    x,y = [abs(int(p)) for p in c.split(',')]
    if(min_man > x+y):
        min_man = x+y

#part2
min_dist = float('+inf')
for c in inters:
    if(min_dist > inters[c]):
        min_dist = inters[c]

print(min_man)
print(min_dist)
