from Global import generateList

def selectionSort(l):
    for index, val in enumerate(l):
        min = index
        for i in range(index + 1, len(l)):
            if l[i] < l[min]:
                min = i
        if min != index:
            tmp = l[min]
            l[min] = l[index]
            l[index] = tmp
    return l

print(selectionSort(generateList(10)))