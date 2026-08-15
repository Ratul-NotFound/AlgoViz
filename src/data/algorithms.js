// src/data/algorithms.js
// Central registry of all algorithms

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

export const ALGORITHMS = [
  // Sorting
  { ...bubbleSort.metadata,    module: bubbleSort,    icon: '🫧', color: '#6d28d9', bgColor: 'rgba(109,40,217,0.2)' },
  { ...selectionSort.metadata, module: selectionSort, icon: '🎯', color: '#0284c7', bgColor: 'rgba(2,132,199,0.2)'   },
  { ...insertionSort.metadata, module: insertionSort, icon: '🃏', color: '#059669', bgColor: 'rgba(5,150,105,0.2)'   },
  { ...mergeSort.metadata,     module: mergeSort,     icon: '🔀', color: '#7c3aed', bgColor: 'rgba(124,58,237,0.2)' },
  { ...quickSort.metadata,     module: quickSort,     icon: '⚡', color: '#d97706', bgColor: 'rgba(217,119,6,0.2)'   },
  { ...heapSort.metadata,      module: heapSort,      icon: '🏔️', color: '#dc2626', bgColor: 'rgba(220,38,38,0.2)'  },
  // Searching
  { ...linearSearch.metadata,  module: linearSearch,  icon: '🔍', color: '#0891b2', bgColor: 'rgba(8,145,178,0.2)'  },
  { ...binarySearch.metadata,  module: binarySearch,  icon: '🎲', color: '#7c3aed', bgColor: 'rgba(124,58,237,0.2)' },
  // Graphs
  { ...bfs.metadata,           module: bfs,           icon: '🌊', color: '#0d9488', bgColor: 'rgba(13,148,136,0.2)' },
  { ...dfs.metadata,           module: dfs,           icon: '🌀', color: '#4f46e5', bgColor: 'rgba(79,70,229,0.2)'  },
  { ...dijkstra.metadata,      module: dijkstra,      icon: '🗺️', color: '#ea580c', bgColor: 'rgba(234,88,12,0.2)'  },
  // Trees
  { ...bst.metadata,           module: bst,           icon: '🌳', color: '#16a34a', bgColor: 'rgba(22,163,74,0.2)'  },
];

export const CATEGORIES = {
  sorting:     { label: 'Sorting',           icon: '📊' },
  searching:   { label: 'Searching',         icon: '🔎' },
  graphs:      { label: 'Graph Algorithms',  icon: '🕸️' },
  trees:       { label: 'Trees',             icon: '🌲' },
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
    .slice(0, 60);
}
