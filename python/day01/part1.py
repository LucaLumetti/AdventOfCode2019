from math import floor
f = open('input', 'r')
f = f.readlines()

total = 0
for n in f:
    total += floor(int(n)/3)-2
print(total)
