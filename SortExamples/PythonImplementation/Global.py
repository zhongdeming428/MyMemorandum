import random

def generateList(count):
    list = []
    for index in range(count):
        list.append(random.uniform(0,1))
    return list
