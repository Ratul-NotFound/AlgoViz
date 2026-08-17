// src/algorithms/datastructures/circularQueue.js — Circular Queue (Ring Buffer)

export const metadata = {
  name: 'Circular Queue',
  category: 'datastructures',
  slug: 'circular-queue',
  timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
  spaceComplexity: 'O(n)',
  stable: true,
  description:
    'A Circular Queue (Ring Buffer) is a linear data structure that treats the memory array as a continuous ring by wrapping around from the last index back to the first using modulo arithmetic: (rear + 1) % capacity. This prevents memory waste in standard array-based queues.',
  fact: 'High-performance audio streaming buffers, video frame encoders, and embedded real-time device drivers (UART buffers) use circular ring buffers to maintain constant-time throughput without memory reallocation.',
};

export const CODE = {
  python: [
    'class CircularQueue:',
    '    def __init__(self, capacity=6):',
    '        self.capacity = capacity',
    '        self.queue = [None] * capacity',
    '        self.front = -1',
    '        self.rear = -1',
    '',
    '    def enqueue(self, val):',
    '        if (self.rear + 1) % self.capacity == self.front:',
    '            raise OverflowError("Queue is Full")',
    '        if self.front == -1: self.front = 0',
    '        self.rear = (self.rear + 1) % self.capacity  # Modulo wrap-around',
    '        self.queue[self.rear] = val  # O(1)',
    '',
    '    def dequeue(self):',
    '        if self.front == -1: raise IndexError("Queue is Empty")',
    '        val = self.queue[self.front]',
    '        self.queue[self.front] = None',
    '        if self.front == self.rear: self.front = self.rear = -1',
    '        else: self.front = (self.front + 1) % self.capacity  # O(1)',
    '        return val',
  ],
  c: [
    '#define SIZE 6',
    'typedef struct {',
    '    int items[SIZE];',
    '    int front, rear;',
    '} CircularQueue;',
    '',
    'void enqueue(CircularQueue *q, int val) {',
    '    if ((q->rear + 1) % SIZE == q->front) return; // Full',
    '    if (q->front == -1) q->front = 0;',
    '    q->rear = (q->rear + 1) % SIZE; // Modulo Wrap',
    '    q->items[q->rear] = val;',
    '}',
  ],
  cpp: [
    'template <int SIZE = 6>',
    'class CircularQueue {',
    'private:',
    '    int arr[SIZE];',
    '    int front = -1, rear = -1;',
    'public:',
    '    bool enqueue(int val) {',
    '        if ((rear + 1) % SIZE == front) return false;',
    '        if (front == -1) front = 0;',
    '        rear = (rear + 1) % SIZE;',
    '        arr[rear] = val;',
    '        return true;',
    '    }',
    '};',
  ],
  java: [
    'public class CircularQueue {',
    '    private int[] data = new int[6];',
    '    private int front = -1, rear = -1, size = 6;',
    '',
    '    public boolean enqueue(int val) {',
    '        if ((rear + 1) % size == front) return false;',
    '        if (front == -1) front = 0;',
    '        rear = (rear + 1) % size;',
    '        data[rear] = val;',
    '        return true;',
    '    }',
    '}',
  ],
  js: [
    'class CircularQueue {',
    '    constructor(capacity = 6) {',
    '        this.capacity = capacity;',
    '        this.items = new Array(capacity).fill(null);',
    '        this.front = -1;',
    '        this.rear = -1;',
    '    }',
    '    enqueue(val) {',
    '        if ((this.rear + 1) % this.capacity === this.front) return false;',
    '        if (this.front === -1) this.front = 0;',
    '        this.rear = (this.rear + 1) % this.capacity;',
    '        this.items[this.rear] = val;',
    '        return true;',
    '    }',
    '}',
  ],
};

export function* generate(input) {
  const CAPACITY = 6;
  const slots = new Array(CAPACITY).fill(null);
  let front = -1;
  let rear = -1;

  // Initial seed elements: [32, 58, 76]
  slots[0] = 32;
  slots[1] = 58;
  slots[2] = 76;
  front = 0;
  rear = 2;

  // 1. Initial State
  yield {
    type: 'circular-queue',
    slots: [...slots],
    front,
    rear,
    capacity: CAPACITY,
    action: 'idle',
    message: `Initialized Circular Queue (Ring Buffer) of capacity ${CAPACITY}. FRONT at slot ${front} (value: ${slots[front]}), REAR at slot ${rear} (value: ${slots[rear]}).`,
    codeLine: { python: 2, c: 6, cpp: 6, java: 2, js: 2 },
  };

  // Step 1: Enqueue 89 at slot 3
  const v1 = 89;
  rear = (rear + 1) % CAPACITY;
  slots[rear] = v1;
  yield {
    type: 'circular-queue',
    slots: [...slots],
    front,
    rear,
    capacity: CAPACITY,
    action: 'enqueue',
    message: `ENQUEUE(${v1}): rear = (2 + 1) % 6 = 3. Placed ${v1} into slot [3].`,
    codeLine: { python: 8, c: 9, cpp: 9, java: 6, js: 9 },
  };

  // Step 2: Dequeue from FRONT (slot 0)
  const deq1 = slots[front];
  slots[front] = null;
  front = (front + 1) % CAPACITY;
  yield {
    type: 'circular-queue',
    slots: [...slots],
    front,
    rear,
    capacity: CAPACITY,
    action: 'dequeue',
    message: `DEQUEUE(): Discharged ${deq1} from slot [0]. front moved forward: (0 + 1) % 6 = 1. New FRONT is slot [1] (${slots[front]}). Slot [0] is now free for wrap-around reuse!`,
    codeLine: { python: 15, c: 11, cpp: 11, java: 9, js: 12 },
  };

  // Step 3: Enqueue 44 at slot 4
  const v2 = 44;
  rear = (rear + 1) % CAPACITY;
  slots[rear] = v2;
  yield {
    type: 'circular-queue',
    slots: [...slots],
    front,
    rear,
    capacity: CAPACITY,
    action: 'enqueue',
    message: `ENQUEUE(${v2}): rear = (3 + 1) % 6 = 4. Placed ${v2} into slot [4].`,
    codeLine: { python: 8, c: 9, cpp: 9, java: 6, js: 9 },
  };

  // Step 4: Enqueue 91 at slot 5 (End of array)
  const v3 = 91;
  rear = (rear + 1) % CAPACITY;
  slots[rear] = v3;
  yield {
    type: 'circular-queue',
    slots: [...slots],
    front,
    rear,
    capacity: CAPACITY,
    action: 'enqueue',
    message: `ENQUEUE(${v3}): rear = (4 + 1) % 6 = 5. Placed ${v3} into slot [5] (End of array).`,
    codeLine: { python: 8, c: 9, cpp: 9, java: 6, js: 9 },
  };

  // Step 5: WRAP-AROUND ENQUEUE! (Slot 0 reuse)
  const v4 = 17;
  rear = (rear + 1) % CAPACITY; // (5 + 1) % 6 = 0!
  slots[rear] = v4;
  yield {
    type: 'circular-queue',
    slots: [...slots],
    front,
    rear,
    capacity: CAPACITY,
    action: 'enqueue',
    message: `WRAP-AROUND ENQUEUE(${v4}): rear = (5 + 1) % 6 = 0! Wrapped around from tail to head and reused vacated slot [0]!`,
    codeLine: { python: 11, c: 10, cpp: 10, java: 8, js: 11 },
  };

  // Step 6: Complete
  yield {
    type: 'circular-queue',
    slots: [...slots],
    front,
    rear,
    capacity: CAPACITY,
    action: 'complete',
    message: `Circular Queue demonstration complete. Modulo wrap-around guarantees 100% memory slot reuse.`,
    codeLine: { python: 20, c: 12, cpp: 12, java: 11, js: 14 },
  };
}
