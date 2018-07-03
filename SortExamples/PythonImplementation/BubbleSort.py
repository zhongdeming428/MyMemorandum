from Global import generateList

def bubbleSort(l):
    for index, item in enumerate(l):
        for i in range(0, len(l) - index - 1):
            if l[i] > l[i + 1]:
                tmp = l[i]
                l[i] = l[i + 1]
                l[i + 1] = tmp
    return l

print(bubbleSort(generateList(10000)))