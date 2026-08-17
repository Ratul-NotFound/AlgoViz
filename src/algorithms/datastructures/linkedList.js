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
  let initialVals = [14, 28, 56];
  if (Array.isArray(input)) {
    initialVals = input.slice(0, 5);
  } else if (input?.array && Array.isArray(input.array)) {
    initialVals = input.array.slice(0, 5);
  }

  let nodes = initialVals.map((val, i) => ({
    id: `node-${i}`,
    data: val,
  }));

  yield {
    type: 'linked-list',
    nodes: [...nodes],
    activeNodeId: null,
    traversingId: null,
    action: 'idle',
    message: `Initialized Singly Linked List with ${nodes.length} nodes. HEAD points to Node ${nodes[0]?.data ?? 'null'}.`,
    codeLine: { python: 7, c: 5, cpp: 8, java: 7, js: 9 },
  };

  // Demo operations: Insert Head -> Traverse -> Append -> Traverse -> Search
  // 1. Insert Head
  const newHeadVal = 82;
  const newHeadNode = { id: `node-h1`, data: newHeadVal };
  yield {
    type: 'linked-list',
    nodes: [newHeadNode, ...nodes],
    activeNodeId: newHeadNode.id,
    traversingId: null,
    action: 'insert_head',
    message: `INSERT_HEAD(${newHeadVal}): Created new node [${newHeadVal}], pointed .next ➔ current HEAD, updated HEAD pointer.`,
    codeLine: { python: 10, c: 13, cpp: 10, java: 10, js: 12 },
  };
  nodes = [newHeadNode, ...nodes];

  // 2. Traversal
  for (let i = 0; i < nodes.length; i++) {
    yield {
      type: 'linked-list',
      nodes: [...nodes],
      activeNodeId: null,
      traversingId: nodes[i].id,
      action: 'traverse',
      message: `TRAVERSE: Visiting node at index ${i} with value ${nodes[i].data}. Following .next pointer ➔`,
      codeLine: { python: 21, c: 13, cpp: 11, java: 11, js: 14 },
    };
  }

  // 3. Append to Tail
  const tailVal = 99;
  const tailNode = { id: `node-t1`, data: tailVal };
  yield {
    type: 'linked-list',
    nodes: [...nodes, tailNode],
    activeNodeId: tailNode.id,
    traversingId: null,
    action: 'append',
    message: `APPEND(${tailVal}): Traversed to end of chain and linked last node .next ➔ [${tailVal}].`,
    codeLine: { python: 15, c: 13, cpp: 10, java: 10, js: 12 },
  };
  nodes = [...nodes, tailNode];

  yield {
    type: 'linked-list',
    nodes: [...nodes],
    activeNodeId: null,
    traversingId: null,
    action: 'complete',
    message: `Linked List operations completed. Total length: ${nodes.length} nodes ending at NULL.`,
    codeLine: { python: 23, c: 16, cpp: 13, java: 13, js: 16 },
  };
}
