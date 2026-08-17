// src/algorithms/datastructures/stack.js — High-precision, stable LIFO Stack engine

export const metadata = {
  name: 'Stack (LIFO)',
  category: 'datastructures',
  slug: 'stack',
  timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
  spaceComplexity: 'O(n)',
  stable: true,
  description:
    'A Stack is a Last-In, First-Out (LIFO) linear data structure. Elements are pushed and popped strictly from the TOP, ensuring that the most recently added element is always the first one removed.',
  fact: 'Call stacks in programming languages, undo/redo mechanisms in text editors (Ctrl+Z), and browser back/forward buttons all use stacks under the hood.',
};

export const CODE = {
  python: [
    'class Stack:',
    '    def __init__(self):',
    '        self.items = []',
    '',
    '    def push(self, val):',
    '        self.items.append(val)  # O(1) Push onto TOP',
    '',
    '    def pop(self):',
    '        if not self.is_empty():',
    '            return self.items.pop()  # O(1) Pop from TOP',
    '        raise IndexError("pop from empty stack")',
    '',
    '    def peek(self):',
    '        return self.items[-1] if not self.is_empty() else None',
    '',
    '    def is_empty(self):',
    '        return len(self.items) == 0',
  ],
  c: [
    '#define MAX 100',
    'typedef struct {',
    '    int items[MAX];',
    '    int top;',
    '} Stack;',
    '',
    'void init(Stack *s) { s->top = -1; }',
    '',
    'void push(Stack *s, int val) {',
    '    if (s->top < MAX - 1) {',
    '        s->items[++(s->top)] = val; // O(1)',
    '    }',
    '}',
    '',
    'int pop(Stack *s) {',
    '    if (s->top >= 0) {',
    '        return s->items[(s->top)--]; // O(1)',
    '    }',
    '    return -1;',
    '}',
  ],
  cpp: [
    '#include <vector>',
    'template <typename T>',
    'class Stack {',
    'private:',
    '    std::vector<T> items;',
    'public:',
    '    void push(const T& val) { items.push_back(val); }',
    '    T pop() {',
    '        if (items.empty()) throw std::runtime_error("Stack is empty");',
    '        T topVal = items.back();',
    '        items.pop_back();',
    '        return topVal;',
    '    }',
    '    T peek() const { return items.back(); }',
    '    bool isEmpty() const { return items.empty(); }',
    '};',
  ],
  java: [
    'public class Stack<T> {',
    '    private java.util.ArrayList<T> items = new java.util.ArrayList<>();',
    '',
    '    public void push(T val) {',
    '        items.add(val); // O(1)',
    '    }',
    '',
    '    public T pop() {',
    '        if (isEmpty()) throw new IllegalStateException("Empty Stack");',
    '        return items.remove(items.size() - 1); // O(1)',
    '    }',
    '',
    '    public T peek() {',
    '        return items.get(items.size() - 1);',
    '    }',
    '',
    '    public boolean isEmpty() {',
    '        return items.isEmpty();',
    '    }',
    '}',
  ],
  js: [
    'class Stack {',
    '    constructor() {',
    '        this.items = [];',
    '    }',
    '',
    '    push(val) {',
    '        this.items.push(val); // O(1) Push at top',
    '    }',
    '',
    '    pop() {',
    '        if (this.isEmpty()) return null;',
    '        return this.items.pop(); // O(1) Remove from top',
    '    }',
    '',
    '    peek() {',
    '        return this.items[this.items.length - 1] ?? null;',
    '    }',
    '',
    '    isEmpty() {',
    '        return this.items.length === 0;',
    '    }',
    '}',
  ],
};

export function* generate(input) {
  let initialVals = [15, 38, 62];
  if (Array.isArray(input) && input.length > 0) {
    initialVals = input.slice(0, 4);
  } else if (input?.array && Array.isArray(input.array) && input.array.length > 0) {
    initialVals = input.array.slice(0, 4);
  }

  let idCounter = 1;
  const stack = initialVals.map(v => ({ id: `s-${idCounter++}`, val: v }));

  // 1. Initial State
  yield {
    type: 'stack',
    items: [...stack],
    topIndex: stack.length - 1,
    incomingItem: null,
    poppingItem: null,
    action: 'idle',
    message: `Initial Stack: Contains ${stack.length} elements. TOP is pointing at element ${stack[stack.length - 1]?.val} (Index: ${stack.length - 1}).`,
    codeLine: { python: 2, c: 7, cpp: 4, java: 2, js: 2 },
  };

  // Step 1: PUSH 85
  const pushVal1 = 85;
  const pushItem1 = { id: `s-${idCounter++}`, val: pushVal1 };
  yield {
    type: 'stack',
    items: [...stack],
    topIndex: stack.length - 1,
    incomingItem: pushVal1,
    poppingItem: null,
    action: 'push_ready',
    message: `PUSH(${pushVal1}) Step 1/2: Preparing to push ${pushVal1} into the top opening...`,
    codeLine: { python: 5, c: 9, cpp: 6, java: 4, js: 6 },
  };

  stack.push(pushItem1);
  yield {
    type: 'stack',
    items: [...stack],
    topIndex: stack.length - 1,
    incomingItem: null,
    poppingItem: null,
    action: 'push_done',
    message: `PUSH(${pushVal1}) Step 2/2: ${pushVal1} has dropped onto TOP! TOP pointer updated to Index ${stack.length - 1}. Stack height = ${stack.length}.`,
    codeLine: { python: 6, c: 11, cpp: 6, java: 5, js: 7 },
  };

  // Step 2: PEEK
  const topVal = stack[stack.length - 1]?.val;
  yield {
    type: 'stack',
    items: [...stack],
    topIndex: stack.length - 1,
    incomingItem: null,
    poppingItem: null,
    action: 'peek',
    message: `PEEK(): Inspecting TOP element without removing it. Current TOP value is ${topVal} at Index ${stack.length - 1}.`,
    codeLine: { python: 14, c: 16, cpp: 11, java: 12, js: 15 },
  };

  // Step 3: PUSH 99
  const pushVal2 = 99;
  const pushItem2 = { id: `s-${idCounter++}`, val: pushVal2 };
  yield {
    type: 'stack',
    items: [...stack],
    topIndex: stack.length - 1,
    incomingItem: pushVal2,
    poppingItem: null,
    action: 'push_ready',
    message: `PUSH(${pushVal2}) Step 1/2: Pushing new item ${pushVal2} onto TOP...`,
    codeLine: { python: 5, c: 9, cpp: 6, java: 4, js: 6 },
  };

  stack.push(pushItem2);
  yield {
    type: 'stack',
    items: [...stack],
    topIndex: stack.length - 1,
    incomingItem: null,
    poppingItem: null,
    action: 'push_done',
    message: `PUSH(${pushVal2}) Step 2/2: Placed ${pushVal2} on TOP. Stack height = ${stack.length}.`,
    codeLine: { python: 6, c: 11, cpp: 6, java: 5, js: 7 },
  };

  // Step 4: POP (LIFO - Removes 99)
  const popItem1 = stack[stack.length - 1];
  yield {
    type: 'stack',
    items: [...stack],
    topIndex: stack.length - 1,
    incomingItem: null,
    poppingItem: popItem1?.val,
    action: 'pop_ready',
    message: `POP() Step 1/2: Preparing to extract TOP element ${popItem1?.val} (Last In, First Out principle)...`,
    codeLine: { python: 9, c: 15, cpp: 7, java: 8, js: 10 },
  };

  stack.pop();
  yield {
    type: 'stack',
    items: [...stack],
    topIndex: stack.length - 1,
    incomingItem: null,
    poppingItem: null,
    action: 'pop_done',
    message: `POP() Step 2/2: Removed ${popItem1?.val} from TOP. TOP pointer drops down to ${stack[stack.length - 1]?.val} (Index: ${stack.length - 1}).`,
    codeLine: { python: 10, c: 17, cpp: 9, java: 9, js: 12 },
  };

  // Step 5: POP (Removes 85)
  const popItem2 = stack[stack.length - 1];
  yield {
    type: 'stack',
    items: [...stack],
    topIndex: stack.length - 1,
    incomingItem: null,
    poppingItem: popItem2?.val,
    action: 'pop_ready',
    message: `POP() Step 1/2: Next item on top is ${popItem2?.val}. Extracting it from the stack...`,
    codeLine: { python: 9, c: 15, cpp: 7, java: 8, js: 10 },
  };

  stack.pop();
  yield {
    type: 'stack',
    items: [...stack],
    topIndex: stack.length - 1,
    incomingItem: null,
    poppingItem: null,
    action: 'pop_done',
    message: `POP() Step 2/2: Removed ${popItem2?.val}. Current TOP is now ${stack[stack.length - 1]?.val} (Index: ${stack.length - 1}).`,
    codeLine: { python: 10, c: 17, cpp: 9, java: 9, js: 12 },
  };

  // Final Summary
  yield {
    type: 'stack',
    items: [...stack],
    topIndex: stack.length - 1,
    incomingItem: null,
    poppingItem: null,
    action: 'complete',
    message: `Stack Demonstration Finished! The stack obeys LIFO: The last element pushed is always the first one popped.`,
    codeLine: { python: 17, c: 17, cpp: 12, java: 15, js: 19 },
  };
}
