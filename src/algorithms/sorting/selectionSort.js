// src/algorithms/sorting/selectionSort.js

export const metadata = {
  name: 'Selection Sort',
  category: 'sorting',
  slug: 'selection-sort',
  timeComplexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
  spaceComplexity: 'O(1)',
  stable: false,
  description:
    'Selection Sort divides the array into a sorted and unsorted region. It repeatedly finds the minimum element from the unsorted region and places it at the end of the sorted region.',
  fact: 'Selection Sort makes at most O(n) swaps, making it useful when memory writes are expensive.',
};

export const CODE = {
  python: [
    'def selection_sort(arr):',
    '    n = len(arr)',
    '    for i in range(n):',
    '        min_idx = i',
    '        for j in range(i + 1, n):',
    '            if arr[j] < arr[min_idx]:',
    '                min_idx = j',
    '        arr[i], arr[min_idx] = arr[min_idx], arr[i]',
    '    return arr',
  ],
  c: [
    'void selectionSort(int arr[], int n) {',
    '    for (int i = 0; i < n - 1; i++) {',
    '        int min_idx = i;',
    '        for (int j = i + 1; j < n; j++) {',
    '            if (arr[j] < arr[min_idx])',
    '                min_idx = j;',
    '        }',
    '        int temp = arr[min_idx];',
    '        arr[min_idx] = arr[i];',
    '        arr[i] = temp;',
    '    }',
    '}',
  ],
  cpp: [
    'void selectionSort(vector<int>& arr) {',
    '    int n = arr.size();',
    '    for (int i = 0; i < n - 1; i++) {',
    '        int min_idx = i;',
    '        for (int j = i + 1; j < n; j++) {',
    '            if (arr[j] < arr[min_idx])',
    '                min_idx = j;',
    '        }',
    '        swap(arr[i], arr[min_idx]);',
    '    }',
    '}',
  ],
  java: [
    'void selectionSort(int[] arr) {',
    '    int n = arr.length;',
    '    for (int i = 0; i < n - 1; i++) {',
    '        int min_idx = i;',
    '        for (int j = i + 1; j < n; j++) {',
    '            if (arr[j] < arr[min_idx])',
    '                min_idx = j;',
    '        }',
    '        int temp = arr[min_idx];',
    '        arr[min_idx] = arr[i];',
    '        arr[i] = temp;',
    '    }',
    '}',
  ],
  js: [
    'function selectionSort(arr) {',
    '    const n = arr.length;',
    '    for (let i = 0; i < n - 1; i++) {',
    '        let minIdx = i;',
    '        for (let j = i + 1; j < n; j++) {',
    '            if (arr[j] < arr[minIdx])',
    '                minIdx = j;',
    '        }',
    '        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];',
    '    }',
    '    return arr;',
    '}',
  ],
};

export function* generate(inputArray) {
  const arr = [...inputArray];
  const n = arr.length;
  const sorted = new Array(n).fill(false);

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    yield {
      array: [...arr], comparing: [], swapping: [], sorted: [...sorted],
      pivot: -1, current: i,
      pointers: { i, min: minIdx },
      variables: { i, minIdx },
      message: `Pass ${i + 1}: Looking for minimum in positions ${i}..${n - 1}`,
      codeLine: { python: 2, c: 1, cpp: 2, java: 2, js: 2 },
    };

    for (let j = i + 1; j < n; j++) {
      yield {
        array: [...arr], comparing: [j, minIdx], swapping: [], sorted: [...sorted],
        pivot: -1, current: minIdx,
        pointers: { i, j, min: minIdx },
        variables: { i, j, minIdx, 'arr[j]': arr[j], 'arr[min]': arr[minIdx] },
        message: `Checking: arr[${j}]=${arr[j]} < arr[min=${minIdx}]=${arr[minIdx]}? ${arr[j] < arr[minIdx] ? 'YES — new min!' : 'NO'}`,
        codeLine: { python: 5, c: 4, cpp: 5, java: 5, js: 5 },
      };
      if (arr[j] < arr[minIdx]) minIdx = j;
    }

    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      yield {
        array: [...arr], comparing: [], swapping: [i, minIdx], sorted: [...sorted],
        pivot: -1, current: i,
        pointers: { i, min: minIdx },
        variables: { i, minIdx },
        message: `Placing minimum ${arr[i]} at position ${i}`,
        codeLine: { python: 7, c: 7, cpp: 8, java: 8, js: 8 },
      };
    }

    sorted[i] = true;
    yield {
      array: [...arr], comparing: [], swapping: [], sorted: [...sorted],
      pivot: -1, current: i,
      pointers: { i },
      variables: { i },
      message: `Position ${i} is now sorted with value ${arr[i]}`,
      codeLine: { python: 7, c: 7, cpp: 8, java: 8, js: 8 },
    };
  }

  for (let k = 0; k < n; k++) sorted[k] = true;
  yield {
    array: [...arr], comparing: [], swapping: [], sorted: [...sorted],
    pivot: -1, current: -1, pointers: {}, variables: {},
    message: '✅ Array fully sorted!',
    codeLine: { python: 8, c: 11, cpp: 9, java: 11, js: 10 },
  };
}
