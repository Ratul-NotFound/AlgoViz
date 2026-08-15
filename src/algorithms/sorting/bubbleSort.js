// src/algorithms/sorting/bubbleSort.js

export const metadata = {
  name: 'Bubble Sort',
  category: 'sorting',
  slug: 'bubble-sort',
  timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
  spaceComplexity: 'O(1)',
  stable: true,
  description:
    'Bubble Sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The largest unsorted element "bubbles up" to its correct position each pass.',
  fact: 'Bubble Sort is one of the simplest sorting algorithms but also one of the slowest — it is rarely used in practice except for educational purposes.',
};

export const CODE = {
  python: [
    'def bubble_sort(arr):',
    '    n = len(arr)',
    '    for i in range(n):',
    '        swapped = False',
    '        for j in range(0, n - i - 1):',
    '            if arr[j] > arr[j + 1]:',
    '                arr[j], arr[j + 1] = arr[j + 1], arr[j]',
    '                swapped = True',
    '        if not swapped:',
    '            break',
    '    return arr',
  ],
  c: [
    'void bubbleSort(int arr[], int n) {',
    '    for (int i = 0; i < n - 1; i++) {',
    '        int swapped = 0;',
    '        for (int j = 0; j < n - i - 1; j++) {',
    '            if (arr[j] > arr[j + 1]) {',
    '                int temp = arr[j];',
    '                arr[j] = arr[j + 1];',
    '                arr[j + 1] = temp;',
    '                swapped = 1;',
    '            }',
    '        }',
    '        if (!swapped) break;',
    '    }',
    '}',
  ],
  cpp: [
    'void bubbleSort(vector<int>& arr) {',
    '    int n = arr.size();',
    '    for (int i = 0; i < n - 1; i++) {',
    '        bool swapped = false;',
    '        for (int j = 0; j < n - i - 1; j++) {',
    '            if (arr[j] > arr[j + 1]) {',
    '                swap(arr[j], arr[j + 1]);',
    '                swapped = true;',
    '            }',
    '        }',
    '        if (!swapped) break;',
    '    }',
    '}',
  ],
  java: [
    'void bubbleSort(int[] arr) {',
    '    int n = arr.length;',
    '    for (int i = 0; i < n - 1; i++) {',
    '        boolean swapped = false;',
    '        for (int j = 0; j < n - i - 1; j++) {',
    '            if (arr[j] > arr[j + 1]) {',
    '                int temp = arr[j];',
    '                arr[j] = arr[j + 1];',
    '                arr[j + 1] = temp;',
    '                swapped = true;',
    '            }',
    '        }',
    '        if (!swapped) break;',
    '    }',
    '}',
  ],
  js: [
    'function bubbleSort(arr) {',
    '    const n = arr.length;',
    '    for (let i = 0; i < n - 1; i++) {',
    '        let swapped = false;',
    '        for (let j = 0; j < n - i - 1; j++) {',
    '            if (arr[j] > arr[j + 1]) {',
    '                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];',
    '                swapped = true;',
    '            }',
    '        }',
    '        if (!swapped) break;',
    '    }',
    '    return arr;',
    '}',
  ],
};

// Code line mapping: { python: lineIndex, c: lineIndex, ... }
// Lines are 0-indexed
const L = {
  outerLoop:    { python: 2, c: 1,  cpp: 2,  java: 2,  js: 2  },
  swappedInit:  { python: 3, c: 2,  cpp: 3,  java: 3,  js: 3  },
  innerLoop:    { python: 4, c: 3,  cpp: 4,  java: 4,  js: 4  },
  compare:      { python: 5, c: 4,  cpp: 5,  java: 5,  js: 5  },
  swap:         { python: 6, c: 6,  cpp: 6,  java: 6,  js: 6  },
  earlyBreak:   { python: 9, c: 11, cpp: 11, java: 10, js: 10 },
};

export function* generate(inputArray) {
  const arr = [...inputArray];
  const n = arr.length;
  const sorted = new Array(n).fill(false);

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    yield {
      array: [...arr],
      comparing: [],
      swapping: [],
      sorted: sorted.map((s, idx) => s),
      pivot: -1,
      pointers: { i },
      variables: { i, swapped: false },
      message: `Pass ${i + 1}: Scanning for largest unsorted element`,
      codeLine: L.outerLoop,
    };

    for (let j = 0; j < n - i - 1; j++) {
      yield {
        array: [...arr],
        comparing: [j, j + 1],
        swapping: [],
        sorted: sorted.map((s, idx) => s),
        pivot: -1,
        pointers: { i, j },
        variables: { i, j, swapped },
        message: `Comparing arr[${j}]=${arr[j]} and arr[${j+1}]=${arr[j+1]}`,
        codeLine: L.compare,
      };

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
        yield {
          array: [...arr],
          comparing: [],
          swapping: [j, j + 1],
          sorted: sorted.map((s, idx) => s),
          pivot: -1,
          pointers: { i, j },
          variables: { i, j, swapped: true },
          message: `Swapped! arr[${j}]=${arr[j]} ↔ arr[${j+1}]=${arr[j+1]}`,
          codeLine: L.swap,
        };
      }
    }

    sorted[n - i - 1] = true;

    if (!swapped) {
      // Mark all remaining as sorted
      for (let k = 0; k < n; k++) sorted[k] = true;
      yield {
        array: [...arr],
        comparing: [],
        swapping: [],
        sorted: sorted.map((s, idx) => s),
        pivot: -1,
        pointers: { i },
        variables: { i, swapped: false },
        message: `No swaps in pass ${i + 1} — array is sorted! Early exit.`,
        codeLine: L.earlyBreak,
      };
      return;
    }
  }

  for (let k = 0; k < n; k++) sorted[k] = true;
  yield {
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: sorted.map((s) => s),
    pivot: -1,
    pointers: {},
    variables: {},
    message: '✅ Array fully sorted!',
    codeLine: L.outerLoop,
  };
}
