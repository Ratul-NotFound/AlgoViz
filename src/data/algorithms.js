// src/data/algorithms.js — Central registry of algorithms and metadata

import * as bubbleSort    from '../algorithms/sorting/bubbleSort.js';
import * as selectionSort from '../algorithms/sorting/selectionSort.js';
import * as insertionSort from '../algorithms/sorting/insertionSort.js';
import * as mergeSort     from '../algorithms/sorting/mergeSort.js';
import * as quickSort     from '../algorithms/sorting/quickSort.js';
import * as heapSort      from '../algorithms/sorting/heapSort.js';
import * as linearSearch  from '../algorithms/searching/linearSearch.js';
import * as binarySearch  from '../algorithms/searching/binarySearch.js';
import * as bfs           from '../algorithms/graphs/bfs.js';
import * as dfs           from '../algorithms/graphs/dfs.js';
import * as dijkstra      from '../algorithms/graphs/dijkstra.js';
import * as bst           from '../algorithms/trees/bst.js';
import * as stack            from '../algorithms/datastructures/stack.js';
import * as queue            from '../algorithms/datastructures/queue.js';
import * as linkedList       from '../algorithms/datastructures/linkedList.js';
import * as doublyLinkedList from '../algorithms/datastructures/doublyLinkedList.js';
import * as circularQueue    from '../algorithms/datastructures/circularQueue.js';
import * as binaryHeap       from '../algorithms/datastructures/binaryHeap.js';
import * as hashTable        from '../algorithms/datastructures/hashTable.js';

export const ALGORITHMS = [
  // Sorting
  { ...bubbleSort.metadata,    module: bubbleSort    },
  { ...selectionSort.metadata, module: selectionSort },
  { ...insertionSort.metadata, module: insertionSort },
  { ...mergeSort.metadata,     module: mergeSort     },
  { ...quickSort.metadata,     module: quickSort     },
  { ...heapSort.metadata,      module: heapSort      },
  // Searching
  { ...linearSearch.metadata,  module: linearSearch  },
  { ...binarySearch.metadata,  module: binarySearch  },
  // Data Structures
  { ...stack.metadata,            module: stack            },
  { ...queue.metadata,            module: queue            },
  { ...linkedList.metadata,       module: linkedList       },
  { ...doublyLinkedList.metadata, module: doublyLinkedList },
  { ...circularQueue.metadata,    module: circularQueue    },
  { ...binaryHeap.metadata,       module: binaryHeap       },
  { ...hashTable.metadata,        module: hashTable        },
  // Graphs
  { ...bfs.metadata,           module: bfs           },
  { ...dfs.metadata,           module: dfs           },
  { ...dijkstra.metadata,      module: dijkstra      },
  // Trees
  { ...bst.metadata,           module: bst           },
];

export const CATEGORIES = {
  sorting:        { label: 'Sorting' },
  searching:      { label: 'Searching' },
  datastructures: { label: 'Data Structures' },
  graphs:         { label: 'Graph Algorithms' },
  trees:          { label: 'Tree Structures' },
};

export function getAlgorithm(slug) {
  return ALGORITHMS.find(a => a.slug === slug);
}

export function generateRandomArray(size = 15, min = 5, max = 100) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

export function parseCustomArray(str) {
  return str
    .split(/[,\s]+/)
    .map(s => parseInt(s.trim()))
    .filter(n => !isNaN(n))
    .slice(0, 50);
}
