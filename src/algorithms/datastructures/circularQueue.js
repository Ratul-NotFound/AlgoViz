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
  let vals = [32, 58, 76, 89, 44, 17];
  if (Array.isArray(input) && input.length > 0) {
    vals = [...input];
  } else if (input?.array && Array.isArray(input.array) && input.array.length > 0) {
    vals = [...input.array];
  }

  const CAPACITY = Math.max(6, vals.length <= 5 ? 6 : vals.length);
  const slots = new Array(CAPACITY).fill(null);
  let front = -1;
  let rear = -1;

  // 1. Initial State: Empty Ring Buffer
  yield {
    type: 'circular-queue',
    slots: [...slots],
    front,
    rear,
    capacity: CAPACITY,
    action: 'idle',
    message: `Initialized Circular Queue (Ring Buffer) of capacity ${CAPACITY}. Ready to process ${vals.length} custom element(s).`,
    codeLine: { python: 2, c: 6, cpp: 6, java: 2, js: 2 },
  };

  // Phase 1: Enqueue first batch of custom elements
  const initialBatchCount = Math.min(vals.length, Math.max(2, CAPACITY - 2));
  for (let i = 0; i < initialBatchCount; i++) {
    const val = vals[i];
    if (front === -1) front = 0;
    rear = (rear + 1) % CAPACITY;
    slots[rear] = val;

    yield {
      type: 'circular-queue',
      slots: [...slots],
      front,
      rear,
      capacity: CAPACITY,
      action: 'enqueue',
      message: `ENQUEUE(${val}) [${i + 1}/${vals.length}]: rear = (${(rear - 1 + CAPACITY) % CAPACITY} + 1) % ${CAPACITY} = ${rear}. Placed ${val} into slot [${rear}].`,
      codeLine: { python: 8, c: 9, cpp: 9, java: 6, js: 9 },
    };
  }

  // Phase 2: Dequeue 1 or 2 elements from FRONT to create open slots for wrap-around
  const deqCount = Math.min(2, Math.max(1, Math.floor(initialBatchCount / 2)));
  for (let i = 0; i < deqCount; i++) {
    const deqVal = slots[front];
    slots[front] = null;
    const oldFront = front;
    if (front === rear) {
      front = -1;
      rear = -1;
    } else {
      front = (front + 1) % CAPACITY;
    }

    yield {
      type: 'circular-queue',
      slots: [...slots],
      front,
      rear,
      capacity: CAPACITY,
      action: 'dequeue',
      message: `DEQUEUE(): Discharged ${deqVal} from slot [${oldFront}]. front = (${oldFront} + 1) % ${CAPACITY} = ${front}. Slot [${oldFront}] is now free for wrap-around reuse!`,
      codeLine: { python: 15, c: 11, cpp: 11, java: 9, js: 12 },
    };
  }

  // Phase 3: Enqueue remaining custom elements (triggering modulo wrap-around into vacated slots)
  for (let i = initialBatchCount; i < vals.length; i++) {
    const val = vals[i];
    const oldRear = rear;
    if (front === -1) front = 0;
    rear = (rear + 1) % CAPACITY;
    slots[rear] = val;

    const isWrap = rear < oldRear;
    yield {
      type: 'circular-queue',
      slots: [...slots],
      front,
      rear,
      capacity: CAPACITY,
      action: 'enqueue',
      message: isWrap
        ? `WRAP-AROUND ENQUEUE(${val}) [${i + 1}/${vals.length}]: rear = (${oldRear} + 1) % ${CAPACITY} = ${rear}! Wrapped around and reused vacated slot [${rear}]!`
        : `ENQUEUE(${val}) [${i + 1}/${vals.length}]: rear = (${oldRear} + 1) % ${CAPACITY} = ${rear}. Placed ${val} into slot [${rear}].`,
      codeLine: { python: isWrap ? 11 : 8, c: 10, cpp: 10, java: 8, js: 11 },
    };
  }

  // Complete
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
