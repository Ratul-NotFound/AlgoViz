// src/algorithms/datastructures/binaryHeap.js — Min Binary Heap & Priority Queue

export const metadata = {
  name: 'Binary Heap (Min-Heap)',
  category: 'datastructures',
  slug: 'binary-heap',
  timeComplexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
  spaceComplexity: 'O(n)',
  stable: false,
  description:
    'A Binary Heap is a complete binary tree that satisfies the Heap Property: in a Min-Heap, every parent node is smaller than or equal to its children. Stored efficiently in a contiguous array where parent(i) = (i-1)//2, left(i) = 2i+1, right(i) = 2i+2.',
  fact: "Dijkstra's shortest path algorithm, A* pathfinding, Huffman coding, and OS process priority schedulers all rely on Min-Heaps for O(1) minimum lookups and O(log n) insertions/extractions.",
};

export const CODE = {
  python: [
    'class MinHeap:',
    '    def __init__(self):',
    '        self.heap = []',
    '',
    '    def insert(self, val):',
    '        self.heap.append(val)',
    '        self._sift_up(len(self.heap) - 1)  # O(log n)',
    '',
    '    def extract_min(self):',
    '        if not self.heap: return None',
    '        min_val = self.heap[0]',
    '        last_val = self.heap.pop()',
    '        if self.heap:',
    '            self.heap[0] = last_val',
    '            self._sift_down(0)  # O(log n)',
    '        return min_val',
    '',
    '    def _sift_up(self, idx):',
    '        parent = (idx - 1) // 2',
    '        while idx > 0 and self.heap[idx] < self.heap[parent]:',
    '            self.heap[idx], self.heap[parent] = self.heap[parent], self.heap[idx]',
    '            idx = parent',
    '            parent = (idx - 1) // 2',
  ],
  c: [
    'void siftUp(int heap[], int idx) {',
    '    int parent = (idx - 1) / 2;',
    '    while (idx > 0 && heap[idx] < heap[parent]) {',
    '        int tmp = heap[idx]; heap[idx] = heap[parent]; heap[parent] = tmp;',
    '        idx = parent; parent = (idx - 1) / 2;',
    '    }',
    '}',
  ],
  cpp: [
    '#include <vector>',
    'class MinHeap {',
    '    std::vector<int> heap;',
    'public:',
    '    void insert(int val) {',
    '        heap.push_back(val);',
    '        siftUp(heap.size() - 1);',
    '    }',
    '    int extractMin() { /* O(log n) */ }',
    '};',
  ],
  java: [
    'public class MinHeap {',
    '    private java.util.ArrayList<Integer> heap = new java.util.ArrayList<>();',
    '    public void insert(int val) {',
    '        heap.add(val);',
    '        siftUp(heap.size() - 1);',
    '    }',
    '}',
  ],
  js: [
    'class MinHeap {',
    '    constructor() {',
    '        this.heap = [];',
    '    }',
    '    insert(val) {',
    '        this.heap.push(val);',
    '        this.siftUp(this.heap.length - 1);',
    '    }',
    '}',
  ],
};

export function* generate(input) {
  let initial = [14, 28, 35, 65, 42];
  const heap = [...initial];

  // 1. Initial State
  yield {
    type: 'binary-heap',
    heap: [...heap],
    highlightIndices: [0],
    swapIndices: [],
    action: 'idle',
    message: `Initialized Min-Heap with ${heap.length} elements. Root [0] is minimum element ${heap[0]}. Heap property holds for all parent-child pairs.`,
    codeLine: { python: 2, c: 1, cpp: 4, java: 2, js: 2 },
  };

  // Step 1: Insert 10 (triggers Sift-Up bubble)
  const insertVal = 10;
  heap.push(insertVal);
  let curIdx = heap.length - 1;

  yield {
    type: 'binary-heap',
    heap: [...heap],
    highlightIndices: [curIdx],
    swapIndices: [],
    action: 'insert',
    message: `INSERT(${insertVal}): Appended ${insertVal} at leaf index [${curIdx}]. Checking parent against Heap property...`,
    codeLine: { python: 5, c: 1, cpp: 6, java: 3, js: 6 },
  };

  // Sift-Up loop
  while (curIdx > 0) {
    const parentIdx = Math.floor((curIdx - 1) / 2);
    if (heap[curIdx] < heap[parentIdx]) {
      yield {
        type: 'binary-heap',
        heap: [...heap],
        highlightIndices: [curIdx, parentIdx],
        swapIndices: [curIdx, parentIdx],
        action: 'sift_up',
        message: `SIFT_UP: Child ${heap[curIdx]} (idx: ${curIdx}) < Parent ${heap[parentIdx]} (idx: ${parentIdx}). Swapping to restore Min-Heap property!`,
        codeLine: { python: 20, c: 4, cpp: 7, java: 4, js: 7 },
      };

      const tmp = heap[curIdx];
      heap[curIdx] = heap[parentIdx];
      heap[parentIdx] = tmp;

      curIdx = parentIdx;
    } else {
      break;
    }
  }

  yield {
    type: 'binary-heap',
    heap: [...heap],
    highlightIndices: [0],
    swapIndices: [],
    action: 'idle',
    message: `Sift-Up completed! ${insertVal} bubbled up to the ROOT (Index 0) as the new minimum element!`,
    codeLine: { python: 7, c: 5, cpp: 8, java: 5, js: 8 },
  };

  // Step 2: Extract-Min (Removes 10 from root, replaces with leaf, Sift-Down)
  const minVal = heap[0];
  const lastVal = heap.pop();
  heap[0] = lastVal;

  yield {
    type: 'binary-heap',
    heap: [...heap],
    highlightIndices: [0],
    swapIndices: [],
    action: 'extract_min',
    message: `EXTRACT_MIN(): Extracted minimum value ${minVal}. Moved last leaf (${lastVal}) to ROOT [0]. Initiating Sift-Down...`,
    codeLine: { python: 9, c: 1, cpp: 9, java: 3, js: 6 },
  };

  // Sift-Down loop
  let p = 0;
  while (true) {
    let smallest = p;
    const left = 2 * p + 1;
    const right = 2 * p + 2;

    if (left < heap.length && heap[left] < heap[smallest]) smallest = left;
    if (right < heap.length && heap[right] < heap[smallest]) smallest = right;

    if (smallest !== p) {
      yield {
        type: 'binary-heap',
        heap: [...heap],
        highlightIndices: [p, smallest],
        swapIndices: [p, smallest],
        action: 'sift_down',
        message: `SIFT_DOWN: Parent ${heap[p]} > Smallest Child ${heap[smallest]}. Swapping down...`,
        codeLine: { python: 15, c: 4, cpp: 9, java: 4, js: 7 },
      };

      const tmp = heap[p];
      heap[p] = heap[smallest];
      heap[smallest] = tmp;
      p = smallest;
    } else {
      break;
    }
  }

  yield {
    type: 'binary-heap',
    heap: [...heap],
    highlightIndices: [0],
    swapIndices: [],
    action: 'complete',
    message: `Min-Heap operations complete! Root is now ${heap[0]}. Min lookup remains O(1).`,
    codeLine: { python: 16, c: 5, cpp: 9, java: 5, js: 8 },
  };
}
