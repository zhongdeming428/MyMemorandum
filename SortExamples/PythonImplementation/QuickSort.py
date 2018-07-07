from Global import generateList

def quickSort(l):
    def partition(l, left, right):
        mid = int((left + right) / 2)
        pivot = l[mid]
        while left <= right:
            while l[left] < pivot:
                left = left + 1
            while l[right] > pivot:
                right = right - 1
            if left <= right:
                tmp = l[left]
                l[left] = l[right]
                l[right] = tmp
                right = right - 1
                left = left + 1
        return left
    def main(l, left, right):
        if len(l) == 1:
            return l
        index = partition(l, left, right)
        if index - 1 > left:
            main(l, left, index - 1)
        if index < right:
            # 注意这里main函数的第一个参数不需要是截取后的list，那样的话下标会溢出。
            main(l, index, right)
        return l
    return main(l, 0, len(l) - 1)

print(quickSort(generateList(100)))

