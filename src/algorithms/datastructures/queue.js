// src/algorithms/datastructures/queue.js — High-precision, stable FIFO Queue engine

export const metadata = {
  name: 'Queue (FIFO)',
  category: 'datastructures',
  slug: 'queue',
  timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
  spaceComplexity: 'O(n)',
  stable: true,
  description:
    'A Queue is a First-In, First-Out (FIFO) linear data structure. Elements enter at the REAR (Enqueue) and leave from the FRONT (Dequeue), just like customers in a grocery store line.',
  fact: 'Operating system task schedulers, printer job queues, network packet routers, and Breadth-First Search (BFS) graph algorithms all rely on FIFO queues.',
};

export const CODE = {
  python: [
    'from collections import deque',
    '',
    'class Queue:',
    '    def __init__(self):',
    '        self.items = deque()',
    '',
    '    def enqueue(self, val):',
    '        self.items.append(val)  # O(1) Enter at REAR',
    '',
    '    def dequeue(self):',
    '        if not self.is_empty():',
    '            return self.items.popleft()  # O(1) Leave at FRONT',
    '        raise IndexError("dequeue from empty queue")',
    '',
    '    def peek(self):',
    '        return self.items[0] if not self.is_empty() else None',
    '',
    '    def is_empty(self):',
    '        return len(self.items) == 0',
  ],
  c: [
    '#define MAX 100',
    'typedef struct {',
    '    int items[MAX];',
    '    int front, rear;',
    '} Queue;',
    '',
    'void init(Queue *q) { q->front = 0; q->rear = -1; }',
    '',
    'void enqueue(Queue *q, int val) {',
    '    if (q->rear < MAX - 1) {',
    '        q->items[++(q->rear)] = val; // O(1) Enter at REAR',
    '    }',
    '}',
    '',
    'int dequeue(Queue *q) {',
    '    if (q->front <= q->rear) {',
    '        return q->items[(q->front)++]; // O(1) Leave from FRONT',
    '    }',
    '    return -1;',
    '}',
  ],
  cpp: [
    '#include <deque>',
    'template <typename T>',
    'class Queue {',
    'private:',
    '    std::deque<T> items;',
    'public:',
    '    void enqueue(const T& val) { items.push_back(val); }',
    '    T dequeue() {',
    '        if (items.empty()) throw std::runtime_error("Queue is empty");',
    '        T frontVal = items.front();',
    '        items.pop_front();',
    '        return frontVal;',
    '    }',
    '    T peek() const { return items.front(); }',
    '    bool isEmpty() const { return items.empty(); }',
    '};',
  ],
  java: [
    'public class Queue<T> {',
    '    private java.util.LinkedList<T> items = new java.util.LinkedList<>();',
    '',
    '    public void enqueue(T val) {',
    '        items.addLast(val); // O(1) at REAR',
    '    }',
    '',
    '    public T dequeue() {',
    '        if (isEmpty()) throw new IllegalStateException("Empty Queue");',
    '        return items.removeFirst(); // O(1) at FRONT',
    '    }',
    '',
    '    public T peek() {',
    '        return items.getFirst();',
    '    }',
    '',
    '    public boolean isEmpty() {',
    '        return items.isEmpty();',
    '    }',
    '}',
  ],
  js: [
    'class Queue {',
    '    constructor() {',
    '        this.items = [];',
    '    }',
    '',
    '    enqueue(val) {',
    '        this.items.push(val); // O(1) Enter at REAR',
    '    }',
    '',
    '    dequeue() {',
    '        if (this.isEmpty()) return null;',
    '        return this.items.shift(); // O(1) Leave at FRONT',
    '    }',
    '',
    '    peek() {',
    '        return this.items[0] ?? null;',
    '    }',
    '',
    '    isEmpty() {',
    '        return this.items.length === 0;',
    '    }',
    '}',
  ],
};

export function* generate(input) {
  let initialVals = [21, 45, 78];
  if (Array.isArray(input) && input.length > 0) {
    initialVals = input.slice(0, 4);
  } else if (input?.array && Array.isArray(input.array) && input.array.length > 0) {
    initialVals = input.array.slice(0, 4);
  }

  let idCounter = 1;
  const queue = initialVals.map(v => ({ id: `q-${idCounter++}`, val: v }));

  // 1. Initial State
  yield {
    type: 'queue',
    items: [...queue],
    frontIndex: 0,
    rearIndex: queue.length - 1,
    incomingItem: null,
    leavingItem: null,
    action: 'idle',
    message: `Initial Queue: Contains ${queue.length} elements. FRONT is ${queue[0]?.val} (Index: 0), REAR is ${queue[queue.length - 1]?.val} (Index: ${queue.length - 1}).`,
    codeLine: { python: 4, c: 6, cpp: 4, java: 2, js: 2 },
  };

  // Step 1: ENQUEUE 92 at REAR
  const enqVal1 = 92;
  const enqItem1 = { id: `q-${idCounter++}`, val: enqVal1 };
  yield {
    type: 'queue',
    items: [...queue],
    frontIndex: 0,
    rearIndex: queue.length - 1,
    incomingItem: enqVal1,
    leavingItem: null,
    action: 'enqueue_ready',
    message: `ENQUEUE(${enqVal1}) Step 1/2: Customer ${enqVal1} arrives at the REAR intake gate...`,
    codeLine: { python: 7, c: 9, cpp: 6, java: 4, js: 6 },
  };

  queue.push(enqItem1);
  yield {
    type: 'queue',
    items: [...queue],
    frontIndex: 0,
    rearIndex: queue.length - 1,
    incomingItem: null,
    leavingItem: null,
    action: 'enqueue_done',
    message: `ENQUEUE(${enqVal1}) Step 2/2: ${enqVal1} joined line at REAR (Index: ${queue.length - 1}). Queue size = ${queue.length}.`,
    codeLine: { python: 8, c: 11, cpp: 6, java: 5, js: 7 },
  };

  // Step 2: PEEK at FRONT
  yield {
    type: 'queue',
    items: [...queue],
    frontIndex: 0,
    rearIndex: queue.length - 1,
    incomingItem: null,
    leavingItem: null,
    action: 'peek',
    message: `PEEK(): Inspecting FRONT element ${queue[0]?.val} (first customer in line to be served).`,
    codeLine: { python: 15, c: 15, cpp: 13, java: 13, js: 15 },
  };

  // Step 3: DEQUEUE from FRONT (FIFO - Removes 21)
  const deqItem1 = queue[0];
  yield {
    type: 'queue',
    items: [...queue],
    frontIndex: 0,
    rearIndex: queue.length - 1,
    incomingItem: null,
    leavingItem: deqItem1?.val,
    action: 'dequeue_ready',
    message: `DEQUEUE() Step 1/2: Preparing to discharge FRONT element ${deqItem1?.val} (First-In, First-Out)...`,
    codeLine: { python: 10, c: 15, cpp: 7, java: 8, js: 10 },
  };

  queue.shift();
  yield {
    type: 'queue',
    items: [...queue],
    frontIndex: 0,
    rearIndex: queue.length - 1,
    incomingItem: null,
    leavingItem: null,
    action: 'dequeue_done',
    message: `DEQUEUE() Step 2/2: Discharged ${deqItem1?.val} from FRONT. Remaining customers advance smoothly. New FRONT is ${queue[0]?.val} (Index: 0).`,
    codeLine: { python: 12, c: 17, cpp: 9, java: 9, js: 12 },
  };

  // Step 4: ENQUEUE 64 at REAR
  const enqVal2 = 64;
  const enqItem2 = { id: `q-${idCounter++}`, val: enqVal2 };
  yield {
    type: 'queue',
    items: [...queue],
    frontIndex: 0,
    rearIndex: queue.length - 1,
    incomingItem: enqVal2,
    leavingItem: null,
    action: 'enqueue_ready',
    message: `ENQUEUE(${enqVal2}) Step 1/2: New customer ${enqVal2} arrives at REAR...`,
    codeLine: { python: 7, c: 9, cpp: 6, java: 4, js: 6 },
  };

  queue.push(enqItem2);
  yield {
    type: 'queue',
    items: [...queue],
    frontIndex: 0,
    rearIndex: queue.length - 1,
    incomingItem: null,
    leavingItem: null,
    action: 'enqueue_done',
    message: `ENQUEUE(${enqVal2}) Step 2/2: ${enqVal2} joins at REAR. Total queue length = ${queue.length}.`,
    codeLine: { python: 8, c: 11, cpp: 6, java: 5, js: 7 },
  };

  // Step 5: DEQUEUE from FRONT (Removes 45)
  const deqItem2 = queue[0];
  yield {
    type: 'queue',
    items: [...queue],
    frontIndex: 0,
    rearIndex: queue.length - 1,
    incomingItem: null,
    leavingItem: deqItem2?.val,
    action: 'dequeue_ready',
    message: `DEQUEUE() Step 1/2: Serving and discharging FRONT customer ${deqItem2?.val}...`,
    codeLine: { python: 10, c: 15, cpp: 7, java: 8, js: 10 },
  };

  queue.shift();
  yield {
    type: 'queue',
    items: [...queue],
    frontIndex: 0,
    rearIndex: queue.length - 1,
    incomingItem: null,
    leavingItem: null,
    action: 'dequeue_done',
    message: `DEQUEUE() Step 2/2: Discharged ${deqItem2?.val}. New FRONT customer is ${queue[0]?.val}.`,
    codeLine: { python: 12, c: 17, cpp: 9, java: 9, js: 12 },
  };

  // Final Summary
  yield {
    type: 'queue',
    items: [...queue],
    frontIndex: 0,
    rearIndex: queue.length - 1,
    incomingItem: null,
    leavingItem: null,
    action: 'complete',
    message: `Queue Demonstration Complete! The FIFO structure ensures fair first-come, first-served order.`,
    codeLine: { python: 18, c: 18, cpp: 14, java: 16, js: 19 },
  };
}
