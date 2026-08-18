// src/algorithms/datastructures/binaryHeap.js — Min Binary Heap & Priority Queue

export const metadata = {
  name: 'Binary Min-Heap',
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
  let vals = [35, 14, 65, 28, 42, 10, 8];
  if (Array.isArray(input) && input.length > 0) {
    vals = [...input];
  } else if (input?.array && Array.isArray(input.array) && input.array.length > 0) {
    vals = [...input.array];
  }

  const heap = [];

  // 1. Initial State: Empty Min-Heap
  yield {
    type: 'binary-heap',
    heap: [],
    highlightIndices: [],
    swapIndices: [],
    action: 'idle',
    message: `Initialized empty Binary Min-Heap. Preparing to insert ${vals.length} element(s) with logarithmic Sift-Up bubble.`,
    codeLine: { python: 2, c: 1, cpp: 4, java: 2, js: 2 },
  };

  // Phase 1: Sequentially INSERT each custom element and Sift-Up
  for (let i = 0; i < vals.length; i++) {
    const insertVal = vals[i];
    heap.push(insertVal);
    let curIdx = heap.length - 1;

    // Step A: Append at leaf
    yield {
      type: 'binary-heap',
      heap: [...heap],
      highlightIndices: [curIdx],
      swapIndices: [],
      action: 'insert',
      message: `INSERT(${insertVal}) [${i + 1}/${vals.length}]: Appended ${insertVal} at leaf index [${curIdx}]. Checking parent against Min-Heap property (Parent ≤ Child)...`,
      codeLine: { python: 5, c: 1, cpp: 6, java: 3, js: 6 },
    };

    // Step B: Sift-Up loop
    while (curIdx > 0) {
      const parentIdx = Math.floor((curIdx - 1) / 2);

      // Check comparison
      yield {
        type: 'binary-heap',
        heap: [...heap],
        highlightIndices: [curIdx, parentIdx],
        swapIndices: [],
        action: 'sift_up',
        message: `COMPARE: Child [${curIdx}] (val: ${heap[curIdx]}) vs Parent [${parentIdx}] = ((${curIdx}-1)//2) (val: ${heap[parentIdx]}).`,
        codeLine: { python: 36, c: 44, cpp: 58, java: 67, js: 78 },
      };

      if (heap[curIdx] < heap[parentIdx]) {
        // Swap frame
        yield {
          type: 'binary-heap',
          heap: [...heap],
          highlightIndices: [curIdx, parentIdx],
          swapIndices: [curIdx, parentIdx],
          action: 'sift_up',
          message: `SWAP: Child ${heap[curIdx]} < Parent ${heap[parentIdx]}! Swapping to restore Min-Heap property (Parent ≤ Child).`,
          codeLine: { python: 37, c: 45, cpp: 58, java: 67, js: 78 },
        };

        const tmp = heap[curIdx];
        heap[curIdx] = heap[parentIdx];
        heap[parentIdx] = tmp;

        curIdx = parentIdx;
      } else {
        // Satisfied
        yield {
          type: 'binary-heap',
          heap: [...heap],
          highlightIndices: [curIdx, parentIdx],
          swapIndices: [],
          action: 'idle',
          message: `HEAP PROPERTY SATISFIED: Child ${heap[curIdx]} ≥ Parent ${heap[parentIdx]}. Sift-Up complete for this insertion.`,
          codeLine: { python: 39, c: 46, cpp: 58, java: 67, js: 78 },
        };
        break;
      }
    }
  }

  // Phase 2: PEEK Root Minimum element
  if (heap.length > 0) {
    yield {
      type: 'binary-heap',
      heap: [...heap],
      highlightIndices: [0],
      swapIndices: [],
      action: 'peek',
      message: `PEEK ROOT: In a Min-Heap, the absolute minimum element is ALWAYS located at Root index [0] (Current minimum = ${heap[0]}). Time complexity: O(1).`,
      codeLine: { python: 27, c: 43, cpp: 59, java: 64, js: 74 },
    };
  }

  // Phase 3: EXTRACT_MIN() demonstration
  if (heap.length > 1) {
    const minVal = heap[0];
    const lastVal = heap.pop();
    const oldRoot = heap[0];
    heap[0] = lastVal;

    yield {
      type: 'binary-heap',
      heap: [...heap],
      highlightIndices: [0],
      swapIndices: [],
      action: 'extract_min',
      message: `EXTRACT_MIN(): Removed minimum element ${minVal} from root [0]. Moved last leaf node (${lastVal}) to ROOT [0] to maintain complete binary tree structure. Initiating Sift-Down (O(log n))...`,
      codeLine: { python: 27, c: 43, cpp: 59, java: 64, js: 74 },
    };

    // Sift-Down loop
    let p = 0;
    while (true) {
      let smallest = p;
      const left = 2 * p + 1;
      const right = 2 * p + 2;

      // Highlight parent and available children
      const checkIndices = [p];
      if (left < heap.length) checkIndices.push(left);
      if (right < heap.length) checkIndices.push(right);

      yield {
        type: 'binary-heap',
        heap: [...heap],
        highlightIndices: checkIndices,
        swapIndices: [],
        action: 'sift_down',
        message: `SIFT_DOWN CHECK: Parent [${p}] (${heap[p]}) vs Left Child [${left}] (${heap[left] ?? 'none'}) & Right Child [${right}] (${heap[right] ?? 'none'}).`,
        codeLine: { python: 31, c: 45, cpp: 59, java: 64, js: 74 },
      };

      if (left < heap.length && heap[left] < heap[smallest]) smallest = left;
      if (right < heap.length && heap[right] < heap[smallest]) smallest = right;

      if (smallest !== p) {
        yield {
          type: 'binary-heap',
          heap: [...heap],
          highlightIndices: [p, smallest],
          swapIndices: [p, smallest],
          action: 'sift_down',
          message: `SIFT_DOWN SWAP: Smallest child is [${smallest}] (${heap[smallest]}). Swapping Parent ${heap[p]} ➔ ${heap[smallest]} down the tree.`,
          codeLine: { python: 31, c: 45, cpp: 59, java: 64, js: 74 },
        };

        const tmp = heap[p];
        heap[p] = heap[smallest];
        heap[smallest] = tmp;
        p = smallest;
      } else {
        yield {
          type: 'binary-heap',
          heap: [...heap],
          highlightIndices: [p],
          swapIndices: [],
          action: 'idle',
          message: `SIFT_DOWN COMPLETE: Parent [${p}] (${heap[p]}) is smaller than all children. Min-Heap invariant restored.`,
          codeLine: { python: 32, c: 47, cpp: 59, java: 64, js: 74 },
        };
        break;
      }
    }
  }

  // Phase 4: Complete Summary
  yield {
    type: 'binary-heap',
    heap: [...heap],
    highlightIndices: [0],
    swapIndices: [],
    action: 'complete',
    message: `Min-Heap Demonstration Complete! Current heap contains ${heap.length} elements. Root is ${heap[0]}. All parent-child pairs satisfy Parent ≤ Children.`,
    codeLine: { python: 33, c: 48, cpp: 60, java: 69, js: 80 },
  };
}
