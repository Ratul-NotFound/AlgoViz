// src/algorithms/graphs/dfs.js

export const metadata = {
  name: 'Depth-First Search',
  category: 'graphs',
  slug: 'dfs',
  timeComplexity: { best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)' },
  spaceComplexity: 'O(V)',
  stable: true,
  description:
    'DFS explores as deep as possible along each branch before backtracking. It uses a Stack (or recursion) and is the foundation of many graph algorithms like cycle detection and topological sort.',
  fact: 'DFS is used in maze-solving, detecting cycles in dependency graphs, and compilers for topological sorting of code dependencies.',
};

export const CODE = {
  python: [
    'def dfs(graph, start):',
    '    visited = set()',
    '    stack = [start]',
    '    order = []',
    '    while stack:',
    '        node = stack.pop()',
    '        if node not in visited:',
    '            visited.add(node)',
    '            order.append(node)',
    '            for nb in graph[node]:',
    '                stack.append(nb)',
    '    return order',
  ],
  c: [
    'void dfs(int graph[][10], int visited[], int n, int v) {',
    '    visited[v] = 1;',
    '    printf("%d ", v);',
    '    for (int i = 0; i < n; i++) {',
    '        if (graph[v][i] && !visited[i])',
    '            dfs(graph, visited, n, i);',
    '    }',
    '}',
  ],
  cpp: [
    'void dfs(unordered_map<int,vector<int>>& g,',
    '         unordered_set<int>& visited, int node) {',
    '    visited.insert(node);',
    '    cout << node << " ";',
    '    for (int nb : g[node]) {',
    '        if (!visited.count(nb))',
    '            dfs(g, visited, nb);',
    '    }',
    '}',
  ],
  java: [
    'void dfs(Map<String,List<String>> g,',
    '         Set<String> visited, String node) {',
    '    visited.add(node);',
    '    System.out.print(node + " ");',
    '    for (String nb : g.get(node)) {',
    '        if (!visited.contains(nb))',
    '            dfs(g, visited, nb);',
    '    }',
    '}',
  ],
  js: [
    'function dfs(graph, start) {',
    '    const visited = new Set();',
    '    const stack = [start];',
    '    const order = [];',
    '    while (stack.length) {',
    '        const node = stack.pop();',
    '        if (!visited.has(node)) {',
    '            visited.add(node);',
    '            order.push(node);',
    '            graph[node].forEach(nb => stack.push(nb));',
    '        }',
    '    }',
    '    return order;',
    '}',
  ],
};

import { DEFAULT_GRAPH } from './bfs.js';

export function* generate(graph = DEFAULT_GRAPH) {
  const { adjacency, start } = graph;
  const visited = new Set();
  const stack = [start];
  const order = [];
  const callStack = []; // Visual call stack

  yield {
    visited: new Set(visited),
    current: null,
    stack: [...stack],
    callStack: [...callStack],
    order: [...order],
    activeEdge: null,
    message: `Start DFS from "${start}". Push to stack.`,
    codeLine: { python: 2, c: 0, cpp: 0, java: 0, js: 2 },
  };

  while (stack.length > 0) {
    const node = stack.pop();

    yield {
      visited: new Set(visited),
      current: node,
      stack: [...stack],
      callStack: [...callStack, node],
      order: [...order],
      activeEdge: null,
      message: `Pop "${node}" from stack.`,
      codeLine: { python: 5, c: 1, cpp: 2, java: 2, js: 5 },
    };

    if (!visited.has(node)) {
      visited.add(node);
      order.push(node);

      yield {
        visited: new Set(visited),
        current: node,
        stack: [...stack],
        callStack: [...callStack, node],
        order: [...order],
        activeEdge: null,
        message: `Visit "${node}". DFS order so far: [${order.join(' → ')}]`,
        codeLine: { python: 8, c: 2, cpp: 3, java: 3, js: 7 },
      };

      const neighbors = adjacency[node] || [];
      for (const nb of [...neighbors].reverse()) {
        yield {
          visited: new Set(visited),
          current: node,
          stack: [...stack],
          callStack: [...callStack, node],
          order: [...order],
          activeEdge: { from: node, to: nb },
          message: `Neighbor "${nb}": ${visited.has(nb) ? 'already visited' : 'push to stack'}`,
          codeLine: { python: 9, c: 3, cpp: 4, java: 4, js: 8 },
        };
        if (!visited.has(nb)) {
          stack.push(nb);
        }
      }
    }
  }

  yield {
    visited: new Set(visited),
    current: null,
    stack: [],
    callStack: [],
    order: [...order],
    activeEdge: null,
    message: `✅ DFS complete! Traversal order: ${order.join(' → ')}`,
    codeLine: { python: 11, c: 7, cpp: 8, java: 8, js: 12 },
  };
}
