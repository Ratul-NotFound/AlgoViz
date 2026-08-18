// src/algorithms/datastructures/linkedList.js — Comprehensive Singly Linked List Data Structure

export const metadata = {
  name: 'Singly Linked List',
  category: 'datastructures',
  slug: 'linked-list',
  timeComplexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
  spaceComplexity: 'O(n)',
  stable: true,
  description:
    'A Singly Linked List is a linear data collection where elements (nodes) are stored non-contiguously in memory, each containing data and a reference pointer (`next`) to the following node.',
  fact: 'Unlike arrays, linked lists can dynamically grow and shrink in memory with zero array reallocation overhead. Insertion at the head is a blazing fast O(1) operation.',
};

export const CODE = {
  python: [
    'class Node:',
    '    def __init__(self, data):',
    '        self.data = data',
    '        self.next = None',
    '',
    'class LinkedList:',
    '    def __init__(self):',
    '        self.head = None',
    '',
    '    def insert_head(self, data):',
    '        new_node = Node(data)',
    '        new_node.next = self.head',
    '        self.head = new_node  # O(1)',
    '',
    '    def append(self, data):',
    '        new_node = Node(data)',
    '        if not self.head:',
    '            self.head = new_node',
    '            return',
    '        curr = self.head',
    '        while curr.next:',
    '            curr = curr.next',
    '        curr.next = new_node  # O(n)',
  ],
  c: [
    'struct Node {',
    '    int data;',
    '    struct Node* next;',
    '};',
    '',
    'struct Node* createNode(int data) {',
    '    struct Node* n = malloc(sizeof(struct Node));',
    '    n->data = data;',
    '    n->next = NULL;',
    '    return n;',
    '}',
    '',
    'void insertHead(struct Node** head, int data) {',
    '    struct Node* n = createNode(data);',
    '    n->next = *head;',
    '    *head = n; // O(1)',
    '}',
  ],
  cpp: [
    'struct Node {',
    '    int data;',
    '    Node* next = nullptr;',
    '    Node(int val) : data(val), next(nullptr) {}',
    '};',
    '',
    'class LinkedList {',
    'public:',
    '    Node* head = nullptr;',
    '    void insertHead(int data) {',
    '        Node* n = new Node(data);',
    '        n->next = head;',
    '        head = n; // O(1)',
    '    }',
    '};',
  ],
  java: [
    'class Node {',
    '    int data;',
    '    Node next;',
    '    Node(int d) { data = d; next = null; }',
    '}',
    '',
    'public class LinkedList {',
    '    Node head;',
    '',
    '    public void insertHead(int data) {',
    '        Node n = new Node(data);',
    '        n.next = head;',
    '        head = n; // O(1)',
    '    }',
    '}',
  ],
  js: [
    'class Node {',
    '    constructor(data) {',
    '        this.data = data;',
    '        this.next = null;',
    '    }',
    '}',
    '',
    'class LinkedList {',
    '    constructor() {',
    '        this.head = null;',
    '    }',
    '    insertHead(data) {',
    '        const node = new Node(data);',
    '        node.next = this.head;',
    '        this.head = node; // O(1)',
    '    }',
    '}',
  ],
};

export function* generate(input) {
  let vals = [14, 28, 56, 82, 99];
  if (Array.isArray(input) && input.length > 0) {
    vals = [...input];
  } else if (input?.array && Array.isArray(input.array) && input.array.length > 0) {
    vals = [...input.array];
  }

  let idCounter = 1;
  let nodes = [];

  // 1. Initial State: Empty List
  yield {
    type: 'linked-list',
    nodes: [],
    activeNodeId: null,
    traversingId: null,
    action: 'idle',
    message: `Initialized empty Singly Linked List (HEAD = null). Preparing to construct chain with ${vals.length} custom node(s).`,
    codeLine: { python: 7, c: 5, cpp: 8, java: 7, js: 9 },
  };

  // Step 1: Insert first node as HEAD
  const firstNode = { id: `node-${idCounter++}`, data: vals[0] };
  nodes = [firstNode];
  yield {
    type: 'linked-list',
    nodes: [...nodes],
    activeNodeId: firstNode.id,
    traversingId: null,
    action: 'insert_head',
    message: `INSERT_HEAD(${vals[0]}): Created root node [${vals[0]}]. HEAD pointer now references this node.`,
    codeLine: { python: 10, c: 13, cpp: 10, java: 10, js: 12 },
  };

  // Step 2..N: Append remaining custom elements one by one
  for (let i = 1; i < vals.length; i++) {
    const val = vals[i];
    const newNode = { id: `node-${idCounter++}`, data: val };
    nodes = [...nodes, newNode];

    yield {
      type: 'linked-list',
      nodes: [...nodes],
      activeNodeId: newNode.id,
      traversingId: null,
      action: 'append',
      message: `APPEND(${val}) [${i + 1}/${vals.length}]: Created node [${val}] and linked previous node .next ➔ [${val}].`,
      codeLine: { python: 15, c: 13, cpp: 10, java: 10, js: 12 },
    };
  }

  // Traversal: Walk through every node from HEAD to TAIL (pointing to NULL)
  for (let i = 0; i < nodes.length; i++) {
    yield {
      type: 'linked-list',
      nodes: [...nodes],
      activeNodeId: null,
      traversingId: nodes[i].id,
      action: 'traverse',
      message: `TRAVERSE [Node ${i + 1}/${nodes.length}]: Visiting node [${nodes[i].data}] at 0x${(1024 + i * 32).toString(16).toUpperCase()}. Following .next pointer ➔`,
      codeLine: { python: 21, c: 13, cpp: 11, java: 11, js: 14 },
    };
  }

  // Complete
  yield {
    type: 'linked-list',
    nodes: [...nodes],
    activeNodeId: null,
    traversingId: null,
    action: 'complete',
    message: `Singly Linked List demonstration complete. All ${nodes.length} custom node(s) chained sequentially ending at NULL.`,
    codeLine: { python: 23, c: 16, cpp: 13, java: 13, js: 16 },
  };
}
