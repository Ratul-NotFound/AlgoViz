// src/algorithms/graphs/dijkstra.js

export const metadata = {
  name: "Dijkstra's Algorithm",
  category: 'graphs',
  slug: 'dijkstra',
  timeComplexity: { best: 'O(E log V)', average: 'O(E log V)', worst: 'O(V²)' },
  spaceComplexity: 'O(V)',
  stable: true,
  description:
    "Dijkstra's finds the shortest path from a source node to all other nodes in a weighted graph. It uses a priority queue (min-heap) to always process the node with the smallest known distance next.",
  fact: "Dijkstra's algorithm powers Google Maps, GPS navigation systems, and network routing protocols. It was designed by Edsger Dijkstra in 1956 in just 20 minutes!",
};

export const CODE = {
  python: [
    'import heapq',
    'def dijkstra(graph, start):',
    '    dist = {node: float("inf") for node in graph}',
    '    dist[start] = 0',
    '    pq = [(0, start)]',
    '    while pq:',
    '        d, u = heapq.heappop(pq)',
    '        if d > dist[u]: continue',
    '        for v, w in graph[u]:',
    '            if dist[u] + w < dist[v]:',
    '                dist[v] = dist[u] + w',
    '                heapq.heappush(pq, (dist[v], v))',
    '    return dist',
  ],
  c: [
    '#define INF 99999',
    'void dijkstra(int graph[][7], int n, int src) {',
    '    int dist[7]; int visited[7]={0};',
    '    for (int i=0;i<n;i++) dist[i]=INF;',
    '    dist[src] = 0;',
    '    for (int count=0;count<n-1;count++) {',
    '        int u = minDist(dist, visited, n);',
    '        visited[u] = 1;',
    '        for (int v=0;v<n;v++) {',
    '            if (!visited[v] && graph[u][v]',
    '              && dist[u]+graph[u][v] < dist[v])',
    '                dist[v] = dist[u] + graph[u][v];',
    '        }',
    '    }',
    '}',
  ],
  cpp: [
    '#include <queue>',
    'void dijkstra(vector<vector<pair<int,int>>>& g, int src, int n) {',
    '    vector<int> dist(n, INT_MAX);',
    '    priority_queue<pair<int,int>, vector<pair<int,int>>,',
    '                   greater<>> pq;',
    '    dist[src] = 0;',
    '    pq.push({0, src});',
    '    while (!pq.empty()) {',
    '        auto [d, u] = pq.top(); pq.pop();',
    '        for (auto [v, w] : g[u]) {',
    '            if (dist[u] + w < dist[v]) {',
    '                dist[v] = dist[u] + w;',
    '                pq.push({dist[v], v});',
    '            }',
    '        }',
    '    }',
    '}',
  ],
  java: [
    'void dijkstra(Map<String,List<int[]>> g, String src) {',
    '    Map<String,Integer> dist = new HashMap<>();',
    '    PriorityQueue<int[]> pq = new PriorityQueue<>(',
    '        (a,b) -> a[0]-b[0]);',
    '    dist.put(src, 0);',
    '    pq.offer(new int[]{0, src.charAt(0)});',
    '    while (!pq.isEmpty()) {',
    '        int[] cur = pq.poll();',
    '        String u = String.valueOf((char)cur[1]);',
    '        for (int[] edge : g.get(u)) {',
    '            int newDist = dist.get(u) + edge[1];',
    '            if (newDist < dist.getOrDefault(..)) {',
    '                dist.put(v, newDist);',
    '                pq.offer(new int[]{newDist, edge[0]});',
    '            }',
    '        }',
    '    }',
    '}',
  ],
  js: [
    'function dijkstra(graph, start) {',
    '    const dist = {};',
    '    for (const node in graph) dist[node] = Infinity;',
    '    dist[start] = 0;',
    '    const pq = [[0, start]];',
    '    while (pq.length) {',
    '        pq.sort((a,b) => a[0]-b[0]);',
    '        const [d, u] = pq.shift();',
    '        if (d > dist[u]) continue;',
    '        for (const [v, w] of graph[u]) {',
    '            if (dist[u]+w < dist[v]) {',
    '                dist[v] = dist[u] + w;',
    '                pq.push([dist[v], v]);',
    '            }',
    '        }',
    '    }',
    '    return dist;',
    '}',
  ],
};

export const DEFAULT_GRAPH = {
  nodes: [
    { id: 'A', x: 300, y: 80  },
    { id: 'B', x: 120, y: 220 },
    { id: 'C', x: 480, y: 220 },
    { id: 'D', x: 60,  y: 360 },
    { id: 'E', x: 240, y: 360 },
    { id: 'F', x: 420, y: 360 },
  ],
  edges: [
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'C', weight: 2 },
    { from: 'B', to: 'D', weight: 5 },
    { from: 'B', to: 'E', weight: 1 },
    { from: 'C', to: 'E', weight: 8 },
    { from: 'C', to: 'F', weight: 10 },
    { from: 'E', to: 'F', weight: 2 },
    { from: 'D', to: 'E', weight: 3 },
  ],
  adjacency: {
    A: [['B', 4], ['C', 2]],
    B: [['A', 4], ['D', 5], ['E', 1]],
    C: [['A', 2], ['E', 8], ['F', 10]],
    D: [['B', 5], ['E', 3]],
    E: [['B', 1], ['C', 8], ['D', 3], ['F', 2]],
    F: [['C', 10], ['E', 2]],
  },
  start: 'A',
};

export function* generate(graph = DEFAULT_GRAPH) {
  const { adjacency, start, nodes } = graph;
  const nodeIds = nodes.map(n => n.id);
  const dist = {};
  const prev = {};
  const visited = new Set();

  nodeIds.forEach(n => { dist[n] = Infinity; prev[n] = null; });
  dist[start] = 0;

  // Simple priority queue as sorted array
  let pq = [[0, start]];

  yield {
    visited: new Set(visited),
    current: null,
    dist: { ...dist },
    prev: { ...prev },
    pq: [...pq],
    activeEdge: null,
    message: `Initialize: dist[${start}]=0, all others=∞. Push (0, ${start}) to priority queue.`,
    codeLine: { python: 2, c: 3, cpp: 2, java: 1, js: 2 },
  };

  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, u] = pq.shift();

    if (d > dist[u]) continue;
    if (visited.has(u)) continue;
    visited.add(u);

    yield {
      visited: new Set(visited),
      current: u,
      dist: { ...dist },
      prev: { ...prev },
      pq: [...pq],
      activeEdge: null,
      message: `Process node "${u}" with distance ${d}. Extract min from priority queue.`,
      codeLine: { python: 6, c: 6, cpp: 8, java: 7, js: 7 },
    };

    for (const [v, w] of adjacency[u] || []) {
      yield {
        visited: new Set(visited),
        current: u,
        dist: { ...dist },
        prev: { ...prev },
        pq: [...pq],
        activeEdge: { from: u, to: v },
        message: `Edge ${u}→${v} (weight=${w}): dist[${u}]+${w}=${dist[u]+w} vs dist[${v}]=${dist[v] === Infinity ? '∞' : dist[v]}. ${dist[u]+w < dist[v] ? '✅ Update!' : 'No update.'}`,
        codeLine: { python: 9, c: 9, cpp: 9, java: 9, js: 10 },
      };

      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        prev[v] = u;
        pq.push([dist[v], v]);

        yield {
          visited: new Set(visited),
          current: u,
          dist: { ...dist },
          prev: { ...prev },
          pq: [...pq],
          activeEdge: { from: u, to: v },
          message: `Updated dist[${v}] = ${dist[v]}. Push (${dist[v]}, ${v}) to queue.`,
          codeLine: { python: 10, c: 11, cpp: 11, java: 11, js: 11 },
        };
      }
    }
  }

  yield {
    visited: new Set(visited),
    current: null,
    dist: { ...dist },
    prev: { ...prev },
    pq: [],
    activeEdge: null,
    message: `✅ Dijkstra complete! Shortest distances from ${start}: ${Object.entries(dist).map(([k,v])=>`${k}=${v}`).join(', ')}`,
    codeLine: { python: 12, c: 14, cpp: 15, java: 16, js: 17 },
  };
}
