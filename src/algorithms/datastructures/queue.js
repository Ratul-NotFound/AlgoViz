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
  let vals = [21, 45, 78, 92, 64];
  if (Array.isArray(input) && input.length > 0) {
    vals = [...input];
  } else if (input?.array && Array.isArray(input.array) && input.array.length > 0) {
    vals = [...input.array];
  }

  // Cap at 6 for optimal transit tube visualization
  if (vals.length > 6) {
    vals = vals.slice(0, 6);
  }

  let idCounter = 1;
  const queue = [];

  // Initial State: Empty transit tube
  yield {
    type: 'queue',
    items: [...queue],
    frontIndex: -1,
    rearIndex: -1,
    incomingItem: null,
    leavingItem: null,
    action: 'idle',
    capacity: 6,
    message: `Queue Transit Tube Initialized (Empty, FRONT = -1, REAR = -1). Ready for ${vals.length} element(s).`,
    codeLine: { python: 4, c: 6, cpp: 4, java: 2, js: 2 },
  };

  // Enqueue EVERY custom element at REAR
  for (let i = 0; i < vals.length; i++) {
    const enqVal = vals[i];
    const enqItem = { id: `q-${idCounter++}`, val: enqVal };

    // Stage 1: Arrival at REAR Ingestion Gate
    yield {
      type: 'queue',
      items: [...queue],
      frontIndex: queue.length > 0 ? 0 : -1,
      rearIndex: queue.length > 0 ? queue.length - 1 : -1,
      incomingItem: enqVal,
      leavingItem: null,
      action: 'enqueue_ready',
      capacity: 6,
      message: `ENQUEUE(${enqVal}) [Step 1/2]: Value ${enqVal} arrives at the REAR Intake Injector...`,
      codeLine: { python: 7, c: 9, cpp: 6, java: 4, js: 6 },
    };

    // Stage 2: Glides into rear position
    queue.push(enqItem);
    yield {
      type: 'queue',
      items: [...queue],
      frontIndex: 0,
      rearIndex: queue.length - 1,
      incomingItem: null,
      leavingItem: null,
      action: 'enqueue_done',
      capacity: 6,
      message: `ENQUEUE(${enqVal}) [Step 2/2]: Element ${enqVal} docked at REAR (Slot [${queue.length - 1}]). FRONT is at [0].`,
      codeLine: { python: 8, c: 11, cpp: 6, java: 5, js: 7 },
    };
  }

  // PEEK at FRONT
  if (queue.length > 0) {
    yield {
      type: 'queue',
      items: [...queue],
      frontIndex: 0,
      rearIndex: queue.length - 1,
      incomingItem: null,
      leavingItem: null,
      action: 'peek',
      capacity: 6,
      message: `PEEK(): Optical sensor reads FRONT element [${queue[0]?.val}] at Slot [0] (first to be discharged, O(1)).`,
      codeLine: { python: 15, c: 15, cpp: 13, java: 13, js: 15 },
    };
  }

  // DEQUEUE demonstration (FIFO - discharge from FRONT)
  const deqCount = Math.max(1, Math.min(2, Math.floor(queue.length / 2)));
  for (let i = 0; i < deqCount; i++) {
    const deqItem = queue[0];

    // Dequeue Stage 1: Departure clamp locks onto FRONT
    yield {
      type: 'queue',
      items: [...queue],
      frontIndex: 0,
      rearIndex: queue.length - 1,
      incomingItem: null,
      leavingItem: deqItem?.val,
      action: 'dequeue_ready',
      capacity: 6,
      message: `DEQUEUE() [Step 1/2]: Departure clamp locks onto FRONT element [${deqItem?.val}] for discharge...`,
      codeLine: { python: 10, c: 15, cpp: 7, java: 8, js: 10 },
    };

    // Dequeue Stage 2: Ejected through exit port; remaining elements shift forward
    queue.shift();
    yield {
      type: 'queue',
      items: [...queue],
      frontIndex: queue.length > 0 ? 0 : -1,
      rearIndex: queue.length > 0 ? queue.length - 1 : -1,
      incomingItem: null,
      leavingItem: deqItem?.val,
      action: 'dequeue_done',
      capacity: 6,
      message: queue.length > 0
        ? `DEQUEUE() [Step 2/2]: Element [${deqItem?.val}] served at FRONT. Queue advanced forward (New FRONT = [${queue[0]?.val}]).`
        : `DEQUEUE() [Step 2/2]: Element [${deqItem?.val}] served. Queue is now empty.`,
      codeLine: { python: 12, c: 17, cpp: 9, java: 9, js: 12 },
    };
  }

  // Final Summary
  yield {
    type: 'queue',
    items: [...queue],
    frontIndex: queue.length > 0 ? 0 : -1,
    rearIndex: queue.length > 0 ? queue.length - 1 : -1,
    incomingItem: null,
    leavingItem: null,
    action: 'complete',
    capacity: 6,
    message: `Queue Demonstration Complete! All operations strictly preserved FIFO (First-In, First-Out) discipline.`,
    codeLine: { python: 18, c: 18, cpp: 14, java: 16, js: 19 },
  };
}
