f = open('input', 'r')
f = f.readlines()[0].split(',')
f = [int(x) for x in f]

def execute(noun, verb, memory):
    memory[1] = noun
    memory[2] = verb

    for i in range(0, len(memory), 4):
        first = memory[i+1]
        second = memory[i+2]
        third = memory[i+3]

        if(memory[i] == 99):
            return memory[0]

        if(memory[i] == 1):
            memory[third] = memory[first] + memory[second]

        if(memory[i] == 2):
            memory[third] = memory[first] * memory[second]

    return memory[0]

print(execute(12,2,f[:]))

for i in range(0, 100):
    for j in range(0, 100):
        result = execute(i, j, f[:])
        if(result == 19690720):
            print(100*i+j)
