from Global import generateList

def heapSort(l):
    def heapify(l, iNode, heapSize):
        left = 2 * iNode + 1
        right = 2 * iNode + 2
        largest = iNode
        if left < heapSize and l[left] > l[largest]:
            largest = left
        if right <heapSize and l[right] > l[largest]:
            largest = right
        if largest != iNode:
            tmp = l[iNode]
            l[iNode] = l[largest]
            l[largest] = tmp
            heapify(l, largest, heapSize)
        return l;
    def buildHeap(l, iNode, heapSize):
        for i in range(iNode, -1, -1):
            heapify(l, i, heapSize)
        return l
    def main(l):
        mid = int(len(l) / 2) - 1
        buildHeap(l, mid, len(l))
        for i in range(len(l) - 1, 0, -1):
            tmp = l[0]
            l[0] = l[i]
            l[i] = tmp
            buildHeap(l, 0, i)
        return l

    return main(l)


print(heapSort(generateList(1000)))