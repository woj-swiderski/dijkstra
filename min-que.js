'use strict';

// minimum priority queue - items with lowest priority are higher in hierarchy
class PriorityQueue{
  // an item should be an object {value: ..., priority: ...}
  constructor() {
    this.items = []
    this.dict = {}
  }

  // item must be an object: {key, index, priority, distance, prev}}
  // e.g. {key:'a', index: 3, priority: 4, distance: 5, prev: 'b'}}
  push(item) {
    const {key, priority, distance, prev} = {...item}  // item is an object described above
    this.items.push({key, priority})
    this.dict[key] = {priority, index: this.items.length-1}
    // console.log(this.dict)

    // _bubleUp MUST synchronise this.items indices with respective objects properties
    if (this.items.length > 1) {
      this._bubbleUp(this.items.length - 1)
    }
  }

  _bubbleUp(index) {
      const temp = this.items
      let i = index
      let j = Math.floor((i - 1) / 2)
      while (j >= 0 && temp[i].priority < temp[j].priority) {
          [temp[i], temp[j]] = [temp[j], temp[i]]
          this.dict[temp[i].key].index = i
          this.dict[temp[j].key].index = j

          i = j
          j = Math.floor((i - 1) / 2)
      }
  }

  pop() {
      if (this.items.length == 1) {
        this.dict = {}
        return this.items.pop()
      }
      else if (this.items.length == 0) {
          return null
      }
      else {
        const min = this.items[0]
        this.items[0] = this.items.pop()
        // synchronise items and dict
        this.dict[this.items[0].key].index = 0
        // delete removed item from dict
        delete this.dict[min.key]
        this._sinkDown(0)
        return min  // should be a this.dict item
      }
  }

  _sinkDown(index) {
      const temp = this.items
      let j = index   // sinking element - 0
      let i = index   // child element - 0
      i = (2*i+2 < temp.length) ? (temp[2*j+1].priority < temp[2*j+2].priority ? 2*j+1 : 2*j+2) : 2*j + 1
      while (i < temp.length && temp[j].priority > temp[i].priority) {
          [temp[i], temp[j]] = [temp[j], temp[i]]
          this.dict[temp[i].key].index = i
          this.dict[temp[j].key].index = j
          j = i
          i = (2*j+2 < temp.length) ? (temp[2*j+1].priority < temp[2*j+2].priority ? 2*j+1 : 2*j+2) : 2*j + 1
      }
  }

  modify(index, priority) {
      // index of an item and its new priority
      if (index < 0 || index >= this.items.length) {
          return false
      }
      this.items[index].priority = priority
      this.dict[this.items[index].key].priority = priority

      let parentIndex = Math.floor((index - 1) / 2)
      let childIndex = (2*index+2 < this.items.length) ? (this.items[2*index+1].priority < this.items[2*index+2].priority ? 2*index+1 : 2*index+2) : 2*index + 1

      if (parentIndex >= 0 && priority < this.items[parentIndex].priority) {
          this._bubbleUp(index)
          return
      }
      if (childIndex < this.items.length && priority > this.items[childIndex].priority) {
          this._sinkDown(index)
          return
      }
  }

  update(key, priority) {
    const index = this.dict[key].index
    this.modify(index, priority)
  }

    isHeap() {
      let j = 0
      for (let i = 0; i <= this.items.length; i++) {
          j = 2*i+1
          if (j+1 >= this.items.length) return true
          if (this.items[i].priority > this.items[j].priority || this.items[i].priority > this.items[j+1].priority) return false
      }
      return true
  }

  printItems() {
      console.log(this.items.map(item => `${item.key}.${item.priority}`).join(' '), this.isHeap())
  }

  printDict() {
    let ar = []
    for (let i in this.dict) {
      ar.push({key : i, ...this.dict[i]})
    }
    ar.sort((a, b) => (a.priority - b.priority))
    console.log(ar.map(item => JSON.stringify(item)).join(' '))
  }
}

// const randint = function*(a, b, n)  { for (let j = 0; j < n; j++) {
//     yield a + Math.floor(Math.random()*(b-a+1))
//     }
// }

// const a = []
// for (let k of randint(1, 15, 15)) {
//     a.push(k)
// }
// console.log(a)

const print20 = () => {
  console.log('---'.repeat(20))
}

// const l = [ 3, 4, 15, 9, 9, 5, 11, 7, 6, 15, 13, 4, 5, 6, 1 ]
// const h = new MinBinaryHeap()
// for (let i of l) {
//     h.push(i)
// }
// h.print()
// print20()
// while (h.items.length) {
//     h.pop()
//     h.print()
// }

const l = [[0, 34], [2, 38], [2, 21], [3, 36], [5, 7], [1, 38], [1, 37], [1, 22], [1, 6], [6, 40], [7, 40], [9, 14], [10, 37], [10, 7], [7, 24], [7, 19], [8, 20], [8, 10], [8, 4], [9, 35]]
const l2 = l.map((item, index) => { let a = String.fromCharCode(65 + index)
  return {key: String.fromCharCode(97 + index), priority: item[0]}})

const pq = new PriorityQueue()


for (let i of l2) {
  // let k = Object.keys(i)[0]
  // console.log(`${k} -> ${i[k].priority}`)
  // console.log(i[k])
  pq.push(i)
}
pq.printItems()

pq.modify(2, 4)
pq.modify(17,2)
pq.modify(18, 1)
pq.modify(1,20)
print20()
pq.update('a', 3)
pq.update('j', 0)
pq.update('t', 2)
print20()
pq.printItems()
pq.printDict()
print20()
while (pq.items.length) {
  console.log(pq.pop())
  pq.printDict()
  pq.printItems()
  print20()
}

// pq.print()
// print20()
// pq.modify(0, {value: 34, priority:3})
// pq.modify(19, {value: 11, priority:5})
// pq.modify(10, {value: 44, priority:11})
// pq.print()
// print20()



// while (pq.items.length) {
//     pq.pop()
//     pq.print()
// }
