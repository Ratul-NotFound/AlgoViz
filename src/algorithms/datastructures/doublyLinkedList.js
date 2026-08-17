// src/algorithms/datastructures/doublyLinkedList.js — Doubly Linked List (Bidirectional Pointers)

export const metadata = {
  name: 'Doubly Linked List',
  category: 'datastructures',
  slug: 'doubly-linked-list',
  timeComplexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
  spaceComplexity: 'O(n)',
  stable: true,
  description:
    'A Doubly Linked List is a linear data structure where each node contains three fields: data, a pointer to the next node (next), and a pointer to the previous node (prev). This enables bidirectional traversal in both forward and backward directions.',
  fact: 'Web browser forward/back history, media players (Next Track / Previous Track), and LRU cache implementations use doubly linked lists for O(1) removals and insertions.',
};

export const CODE = {
  python: [
    'class Node:',
    '    def __init__(self, data):',
    '        self.data = data',
    '        self.prev = None',
    '        self.next = None',
    '',
    'class DoublyLinkedList:',
    '    def __init__(self):',
    '        self.head = None',
    '        self.tail = None',
    '',
    '    def insert_head(self, data):',
    '        new_node = Node(data)',
    '        if not self.head:',
    '            self.head = self.tail = new_node',
    '        else:',
    '            new_node.next = self.head',
    '            self.head.prev = new_node',
    '            self.head = new_node  # O(1)',
    '',
    '    def insert_tail(self, data):',
    '        new_node = Node(data)',
    '        if not self.tail:',
    '            self.head = self.tail = new_node',
    '        else:',
    '            new_node.prev = self.tail',
    '            self.tail.next = new_node',
    '            self.tail = new_node  # O(1)',
  ],
  c: [
    'typedef struct Node {',
    '    int data;',
    '    struct Node *prev;',
    '    struct Node *next;',
    '} Node;',
    '',
    'typedef struct {',
    '    Node *head;',
    '    Node *tail;',
    '} DoublyLinkedList;',
    '',
    'void insertHead(DoublyLinkedList *list, int val) {',
    '    Node *node = (Node*)malloc(sizeof(Node));',
    '    node->data = val; node->prev = NULL; node->next = list->head;',
    '    if (list->head) list->head->prev = node;',
    '    else list->tail = node;',
    '    list->head = node;',
    '}',
  ],
  cpp: [
    'template <typename T>',
    'struct Node {',
    '    T data;',
    '    Node *prev = nullptr;',
    '    Node *next = nullptr;',
    '    Node(T val) : data(val) {}',
    '};',
    '',
    'template <typename T>',
    'class DoublyLinkedList {',
    'public:',
    '    Node<T> *head = nullptr;',
    '    Node<T> *tail = nullptr;',
    '    void insertHead(T val) { /* O(1) */ }',
    '    void insertTail(T val) { /* O(1) */ }',
    '};',
  ],
  java: [
    'public class DoublyLinkedList<T> {',
    '    static class Node<T> {',
    '        T data;',
    '        Node<T> prev, next;',
    '        Node(T val) { this.data = val; }',
    '    }',
    '    private Node<T> head, tail;',
    '',
    '    public void insertHead(T val) {',
    '        Node<T> node = new Node<>(val);',
    '        if (head == null) { head = tail = node; }',
    '        else { node.next = head; head.prev = node; head = node; }',
    '    }',
    '}',
  ],
  js: [
    'class Node {',
    '    constructor(val) {',
    '        this.val = val;',
    '        this.prev = null;',
    '        this.next = null;',
    '    }',
    '}',
    '',
    'class DoublyLinkedList {',
    '    constructor() {',
    '        this.head = null;',
    '        this.tail = null;',
    '    }',
    '    insertHead(val) {',
    '        const node = new Node(val);',
    '        if (!this.head) { this.head = this.tail = node; }',
    '        else { node.next = this.head; this.head.prev = node; this.head = node; }',
    '    }',
    '}',
  ],
};

export function* generate(input) {
  let initial = [24, 48, 72];
  if (Array.isArray(input) && input.length > 0) {
    initial = input.slice(0, 4);
  } else if (input?.array && Array.isArray(input.array) && input.array.length > 0) {
    initial = input.array.slice(0, 4);
  }

  let idCounter = 1;
  let nodes = initial.map(val => ({
    id: `dll-${idCounter++}`,
    data: val,
  }));

  // 1. Initial State
  yield {
    type: 'doubly-linked-list',
    nodes: [...nodes],
    headId: nodes[0]?.id,
    tailId: nodes[nodes.length - 1]?.id,
    activeNodeId: null,
    traversingId: null,
    direction: 'forward',
    action: 'idle',
    message: `Initialized Doubly Linked List with ${nodes.length} nodes. HEAD = ${nodes[0]?.data}, TAIL = ${nodes[nodes.length - 1]?.data}. Each node has bidirectional ⇄ pointers.`,
    codeLine: { python: 7, c: 7, cpp: 8, java: 6, js: 8 },
  };

  // 2. Insert at Head (Prepend 12)
  const headVal = 12;
  const newHead = { id: `dll-${idCounter++}`, data: headVal };
  nodes = [newHead, ...nodes];
  yield {
    type: 'doubly-linked-list',
    nodes: [...nodes],
    headId: newHead.id,
    tailId: nodes[nodes.length - 1]?.id,
    activeNodeId: newHead.id,
    traversingId: null,
    direction: 'forward',
    action: 'insert_head',
    message: `INSERT_HEAD(${headVal}): Created node [${headVal}], wired .next ➔ old HEAD, wired old HEAD.prev ➔ [${headVal}], updated HEAD pointer (O(1)).`,
    codeLine: { python: 12, c: 12, cpp: 13, java: 9, js: 12 },
  };

  // 3. Forward Traversal (HEAD ➔ TAIL)
  for (let i = 0; i < nodes.length; i++) {
    yield {
      type: 'doubly-linked-list',
      nodes: [...nodes],
      headId: nodes[0]?.id,
      tailId: nodes[nodes.length - 1]?.id,
      activeNodeId: null,
      traversingId: nodes[i].id,
      direction: 'forward',
      action: 'traverse',
      message: `FORWARD TRAVERSAL ➔: Visiting node [${nodes[i].data}] at index ${i} by following .next pointers.`,
      codeLine: { python: 17, c: 15, cpp: 13, java: 11, js: 15 },
    };
  }

  // 4. Insert at Tail (Append 95)
  const tailVal = 95;
  const newTail = { id: `dll-${idCounter++}`, data: tailVal };
  nodes = [...nodes, newTail];
  yield {
    type: 'doubly-linked-list',
    nodes: [...nodes],
    headId: nodes[0]?.id,
    tailId: newTail.id,
    activeNodeId: newTail.id,
    traversingId: null,
    direction: 'backward',
    action: 'insert_tail',
    message: `INSERT_TAIL(${tailVal}): Created node [${tailVal}], wired old TAIL.next ➔ [${tailVal}], wired [${tailVal}].prev ➔ old TAIL, updated TAIL pointer (O(1)).`,
    codeLine: { python: 20, c: 16, cpp: 14, java: 11, js: 15 },
  };

  // 5. Backward Traversal (TAIL ➔ HEAD)
  for (let i = nodes.length - 1; i >= 0; i--) {
    yield {
      type: 'doubly-linked-list',
      nodes: [...nodes],
      headId: nodes[0]?.id,
      tailId: nodes[nodes.length - 1]?.id,
      activeNodeId: null,
      traversingId: nodes[i].id,
      direction: 'backward',
      action: 'traverse',
      message: `BACKWARD TRAVERSAL ⬅: Visiting node [${nodes[i].data}] at index ${i} by following .prev pointers backward from TAIL.`,
      codeLine: { python: 25, c: 16, cpp: 14, java: 11, js: 15 },
    };
  }

  // 6. Complete
  yield {
    type: 'doubly-linked-list',
    nodes: [...nodes],
    headId: nodes[0]?.id,
    tailId: nodes[nodes.length - 1]?.id,
    activeNodeId: null,
    traversingId: null,
    direction: 'forward',
    action: 'complete',
    message: `Doubly Linked List demonstration complete. Both .prev and .next links are fully intact.`,
    codeLine: { python: 26, c: 17, cpp: 14, java: 12, js: 16 },
  };
}
