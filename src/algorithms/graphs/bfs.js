// src/algorithms/graphs/bfs.js

export const metadata = {
  name: 'Breadth-First Search',
  category: 'graphs',
  slug: 'bfs',
  timeComplexity: { best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)' },
  spaceComplexity: 'O(V)',
  stable: true,
  description:
    'BFS explores a graph level by level, visiting all neighbors of the current node before moving deeper. It uses a Queue and guarantees the shortest path in unweighted graphs.',
  fact: 'BFS is used by social networks to find the "degrees of separation" between users, and by GPS apps to find the nearest point of interest.',
};

export const CODE = {
  python: [
    'from collections import deque',
    'def bfs(graph, start):',
    '    visited = set([start])',
    '    queue = deque([start])',
    '    order = []',
    '    while queue:',
    '        node = queue.popleft()',
    '        order.append(node)',
    '        for neighbor in graph[node]:',
    '            if neighbor not in visited:',
    '                visited.add(neighbor)',
    '                queue.append(neighbor)',
    '    return order',
  ],
  c: [
    '#include <stdio.h>',
    'void bfs(int graph[][10], int n, int start) {',
    '    int visited[10] = {0};',
    '    int queue[10], front=0, rear=0;',
    '    visited[start] = 1;',
    '    queue[rear++] = start;',
    '    while (front < rear) {',
    '        int node = queue[front++];',
    '        printf("%d ", node);',
    '        for (int i=0; i<n; i++) {',
    '            if (graph[node][i] && !visited[i]) {',
    '                visited[i] = 1;',
    '                queue[rear++] = i;',
    '            }',
    '        }',
    '    }',
    '}',
  ],
  cpp: [
    '#include <queue>',
    'void bfs(unordered_map<int,vector<int>>& g, int start) {',
    '    unordered_set<int> visited = {start};',
    '    queue<int> q;',
    '    q.push(start);',
    '    while (!q.empty()) {',
    '        int node = q.front(); q.pop();',
    '        cout << node << " ";',
    '        for (int nb : g[node]) {',
    '            if (!visited.count(nb)) {',
    '                visited.insert(nb);',
    '                q.push(nb);',
    '            }',
    '        }',
    '    }',
    '}',
  ],
  java: [
    'void bfs(Map<Integer,List<Integer>> g, int start) {',
    '    Set<Integer> visited = new HashSet<>();',
    '    Queue<Integer> queue = new LinkedList<>();',
    '    visited.add(start);',
    '    queue.offer(start);',
    '    while (!queue.isEmpty()) {',
    '        int node = queue.poll();',
    '        System.out.print(node + " ");',
    '        for (int nb : g.get(node)) {',
    '            if (!visited.contains(nb)) {',
    '                visited.add(nb);',
    '                queue.offer(nb);',
    '            }',
    '        }',
    '    }',
    '}',
  ],
  js: [
    'function bfs(graph, start) {',
    '    const visited = new Set([start]);',
    '    const queue = [start];',
    '    const order = [];',
    '    while (queue.length) {',
    '        const node = queue.shift();',
    '        order.push(node);',
    '        for (const nb of graph[node]) {',
    '            if (!visited.has(nb)) {',
    '                visited.add(nb);',
    '                queue.push(nb);',
    '            }',
    '        }',
    '    }',
    '    return order;',
    '}',
  ],
};

// Default graph for BFS visualization
export const DEFAULT_GRAPH = {
  nodes: [
    { id: 'A', x: 300, y: 80 },
    { id: 'B', x: 150, y: 200 },
    { id: 'C', x: 450, y: 200 },
    { id: 'D', x: 80,  y: 340 },
    { id: 'E', x: 230, y: 340 },
    { id: 'F', x: 380, y: 340 },
    { id: 'G', x: 520, y: 340 },
  ],
  edges: [
    { from: 'A', to: 'B' }, { from: 'A', to: 'C' },
    { from: 'B', to: 'D' }, { from: 'B', to: 'E' },
    { from: 'C', to: 'F' }, { from: 'C', to: 'G' },
  ],
  adjacency: {
    A: ['B', 'C'],
    B: ['A', 'D', 'E'],
    C: ['A', 'F', 'G'],
    D: ['B'],
    E: ['B'],
    F: ['C'],
    G: ['C'],
  },
  start: 'A',
};

export function* generate(graph = DEFAULT_GRAPH) {
  const { adjacency, start } = graph;
  const visited  = new Set();
  const queue    = [];
  const order    = [];

  visited.add(start);
  queue.push(start);

  yield {
    visited: new Set(visited),
    current: null,
    queue: [...queue],
    frontier: new Set([start]),
    order: [...order],
    activeEdge: null,
    message: `Start BFS from node "${start}". Add to queue.`,
    codeLine: { python: 2, c: 4, cpp: 2, java: 2, js: 1 },
  };

  while (queue.length > 0) {
    const node = queue.shift();
    order.push(node);

    yield {
      visited: new Set(visited),
      current: node,
      queue: [...queue],
      frontier: new Set(queue),
      order: [...order],
      activeEdge: null,
      message: `Dequeue "${node}". Visit it. BFS order: [${order.join(' → ')}]`,
      codeLine: { python: 6, c: 7, cpp: 6, java: 6, js: 5 },
    };

    for (const nb of adjacency[node] || []) {
      yield {
        visited: new Set(visited),
        current: node,
        queue: [...queue],
        frontier: new Set(queue),
        order: [...order],
        activeEdge: { from: node, to: nb },
        message: `Checking neighbor "${nb}" of "${node}": ${visited.has(nb) ? 'already visited ✓' : 'not visited — add to queue'}`,
        codeLine: { python: 9, c: 10, cpp: 9, java: 9, js: 7 },
      };

      if (!visited.has(nb)) {
        visited.add(nb);
        queue.push(nb);

        yield {
          visited: new Set(visited),
          current: node,
          queue: [...queue],
          frontier: new Set(queue),
          order: [...order],
          activeEdge: { from: node, to: nb },
          message: `Added "${nb}" to queue. Queue: [${queue.join(', ')}]`,
          codeLine: { python: 11, c: 12, cpp: 11, java: 11, js: 9 },
        };
      }
    }
  }

  yield {
    visited: new Set(visited),
    current: null,
    queue: [],
    frontier: new Set(),
    order: [...order],
    activeEdge: null,
    message: `✅ BFS complete! Traversal order: ${order.join(' → ')}`,
    codeLine: { python: 12, c: 16, cpp: 14, java: 14, js: 13 },
  };
}
