from Global import generateList

def mergeSort(l):
    def merge(left, right):
        result = []
        i, j = 0, 0
        ll, rl = len(left), len(right)
        while i < ll and j < rl:
            if left[i] < right[j]:
                result.append(left[i])
                i = i + 1
            else :
                result.append(right[j])
                j = j + 1
        result.extend(left[i:])
        result.extend(right[j:])
        return result
    def main(l):
        if len(l) == 1:
            return l
        mid = int(len(l) / 2)
        left = l[0:mid]
        right = l[mid:]
        return merge(main(left), main(right))
    return main(l)

print(mergeSort(generateList(10000)))