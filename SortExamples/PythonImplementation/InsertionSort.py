from Global import generateList

def insertionSort(l):
    for i in range(1, len(l)):
        j = i
        tmp = l[i]
        while l[j-1] > tmp and j - 1 >= 0:
            l[j] = l[j-1]
            j = j - 1
        l[j] = tmp
    return l

print(insertionSort(generateList(10000)))