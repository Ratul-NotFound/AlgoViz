// src/algorithms/trees/bst.js

export const metadata = {
  name: 'Binary Search Tree',
  category: 'trees',
  slug: 'bst',
  timeComplexity: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)' },
  spaceComplexity: 'O(n)',
  stable: true,
  description:
    'A BST is a binary tree where each node\'s left subtree contains only smaller values and its right subtree contains only larger values. This property allows O(log n) insert, search, and delete on average.',
  fact: 'The worst case for BST is O(n) when elements are inserted in sorted order, creating a "degenerate tree" like a linked list. AVL and Red-Black trees solve this by keeping the tree balanced.',
};

export const CODE = {
  python: [
    'class Node:',
    '    def __init__(self, val):',
    '        self.val = val',
    '        self.left = self.right = None',
    '',
    'def insert(root, val):',
    '    if root is None:',
    '        return Node(val)',
    '    if val < root.val:',
    '        root.left = insert(root.left, val)',
    '    else:',
    '        root.right = insert(root.right, val)',
    '    return root',
  ],
  c: [
    'struct Node {',
    '    int val;',
    '    struct Node *left, *right;',
    '};',
    'struct Node* insert(struct Node* root, int val) {',
    '    if (root == NULL) {',
    '        struct Node* node = malloc(sizeof(struct Node));',
    '        node->val = val;',
    '        node->left = node->right = NULL;',
    '        return node;',
    '    }',
    '    if (val < root->val)',
    '        root->left = insert(root->left, val);',
    '    else',
    '        root->right = insert(root->right, val);',
    '    return root;',
    '}',
  ],
  cpp: [
    'struct Node {',
    '    int val;',
    '    Node *left = nullptr, *right = nullptr;',
    '    Node(int v) : val(v) {}',
    '};',
    'Node* insert(Node* root, int val) {',
    '    if (!root) return new Node(val);',
    '    if (val < root->val)',
    '        root->left = insert(root->left, val);',
    '    else',
    '        root->right = insert(root->right, val);',
    '    return root;',
    '}',
  ],
  java: [
    'class Node {',
    '    int val;',
    '    Node left, right;',
    '    Node(int v) { val = v; }',
    '}',
    'Node insert(Node root, int val) {',
    '    if (root == null) return new Node(val);',
    '    if (val < root.val)',
    '        root.left = insert(root.left, val);',
    '    else',
    '        root.right = insert(root.right, val);',
    '    return root;',
    '}',
  ],
  js: [
    'class Node {',
    '    constructor(val) {',
    '        this.val = val;',
    '        this.left = this.right = null;',
    '    }',
    '}',
    'function insert(root, val) {',
    '    if (!root) return new Node(val);',
    '    if (val < root.val)',
    '        root.left = insert(root.left, val);',
    '    else',
    '        root.right = insert(root.right, val);',
    '    return root;',
    '}',
  ],
};

let nodeId = 0;

function createNode(val) {
  return { id: nodeId++, val, left: null, right: null };
}

function cloneTree(node) {
  if (!node) return null;
  return { ...node, left: cloneTree(node.left), right: cloneTree(node.right) };
}

function setHighlight(tree, id, highlight) {
  if (!tree) return null;
  const node = { ...tree };
  if (node.id === id) node.highlight = highlight;
  else { node.highlight = null; }
  node.left  = setHighlight(tree.left,  id, highlight);
  node.right = setHighlight(tree.right, id, highlight);
  return node;
}

function* insertGen(root, val, frames) {
  if (!root) {
    const newNode = createNode(val);
    frames.push({ type: 'insert', node: newNode });
    return newNode;
  }

  frames.push({
    type: 'compare',
    nodeId: root.id,
    val,
    rootVal: root.val,
    direction: val < root.val ? 'left' : 'right',
  });

  if (val < root.val) {
    root.left = yield* insertGen(root.left, val, frames);
  } else {
    root.right = yield* insertGen(root.right, val, frames);
  }
  return root;
}

function* searchGen(root, val, path = []) {
  if (!root) {
    yield { type: 'notfound', path: [...path], val };
    return;
  }

  path.push(root.id);
  yield {
    type: 'compare', nodeId: root.id, val, rootVal: root.val,
    path: [...path],
    direction: val === root.val ? 'found' : val < root.val ? 'left' : 'right',
  };

  if (val === root.val) {
    yield { type: 'found', nodeId: root.id, val, path: [...path] };
    return;
  }

  if (val < root.val) yield* searchGen(root.left, val, path);
  else yield* searchGen(root.right, val, path);
}

export function* generate({ values = [50, 30, 70, 20, 40, 60, 80], searchVal = null }) {
  nodeId = 0;
  let root = null;

  // Insert all values
  for (const val of values) {
    const insertFrames = [];
    root = yield* insertStep(root, val);

    yield {
      tree: cloneTree(root),
      currentNodeId: null,
      path: [],
      message: `Inserted ${val} into BST`,
      phase: 'build',
      codeLine: { python: 5, c: 4, cpp: 5, java: 5, js: 6 },
    };
  }

  // Search if searchVal provided
  if (searchVal !== null) {
    yield {
      tree: cloneTree(root),
      currentNodeId: null,
      path: [],
      message: `Now searching for ${searchVal}...`,
      phase: 'search',
      codeLine: { python: 5, c: 4, cpp: 5, java: 5, js: 6 },
    };

    for (const frame of collectSearchFrames(root, searchVal)) {
      yield {
        tree: cloneTree(root),
        currentNodeId: frame.nodeId || null,
        path: frame.path || [],
        message: frame.type === 'compare'
          ? `Compare ${searchVal} with ${frame.rootVal}: go ${frame.direction}`
          : frame.type === 'found'
          ? `🎯 Found ${searchVal}!`
          : `❌ ${searchVal} not found`,
        phase: 'search',
        codeLine: frame.type === 'found'
          ? { python: 6, c: 5, cpp: 6, java: 6, js: 7 }
          : frame.direction === 'left'
          ? { python: 8, c: 11, cpp: 7, java: 7, js: 8 }
          : { python: 10, c: 13, cpp: 9, java: 9, js: 10 },
      };
    }
  }
}

function collectSearchFrames(root, val, path = []) {
  if (!root) return [{ type: 'notfound', path, val }];
  path = [...path, root.id];
  const frame = { type: 'compare', nodeId: root.id, val, rootVal: root.val, path };
  if (val === root.val) {
    frame.direction = 'found';
    return [frame, { type: 'found', nodeId: root.id, val, path }];
  }
  if (val < root.val) {
    frame.direction = 'left';
    return [frame, ...collectSearchFrames(root.left, val, path)];
  }
  frame.direction = 'right';
  return [frame, ...collectSearchFrames(root.right, val, path)];
}

function* insertStep(root, val) {
  if (!root) {
    const node = createNode(val);
    yield {
      tree: cloneTree(node),
      currentNodeId: node.id,
      path: [],
      message: `Tree is empty or reached null — insert ${val} here`,
      phase: 'insert',
      codeLine: { python: 6, c: 5, cpp: 6, java: 6, js: 7 },
    };
    return node;
  }

  yield {
    tree: cloneTree(root),
    currentNodeId: root.id,
    path: [],
    message: `Compare ${val} with ${root.val}: ${val < root.val ? `${val} < ${root.val} → go LEFT` : `${val} >= ${root.val} → go RIGHT`}`,
    phase: 'insert',
    codeLine: val < root.val
      ? { python: 8, c: 11, cpp: 7, java: 7, js: 8 }
      : { python: 10, c: 13, cpp: 9, java: 9, js: 10 },
  };

  if (val < root.val) {
    root.left = yield* insertStep(root.left, val);
  } else {
    root.right = yield* insertStep(root.right, val);
  }
  return root;
}
