from math import floor
f = open('input', 'r')
f = f.readlines()

total = 0
for n in f:
    while 1:
        n = floor(int(n)/3)-2
        if n <= 0:
            break
        total += n
        
print(total)
