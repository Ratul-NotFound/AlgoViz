// src/algorithms/sorting/heapSort.js

export const metadata = {
  name: 'Heap Sort',
  category: 'sorting',
  slug: 'heap-sort',
  timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
  spaceComplexity: 'O(1)',
  stable: false,
  description:
    'Heap Sort first builds a max-heap from the array, then repeatedly extracts the maximum element and places it at the end. It achieves O(n log n) in all cases with O(1) extra space.',
  fact: 'Although Heap Sort has optimal worst-case complexity, it is rarely used in practice because it has poor cache performance compared to Quick Sort.',
};

export const CODE = {
  python: [
    'def heapify(arr, n, i):',
    '    largest = i',
    '    l, r = 2*i+1, 2*i+2',
    '    if l < n and arr[l] > arr[largest]: largest = l',
    '    if r < n and arr[r] > arr[largest]: largest = r',
    '    if largest != i:',
    '        arr[i], arr[largest] = arr[largest], arr[i]',
    '        heapify(arr, n, largest)',
    '',
    'def heap_sort(arr):',
    '    n = len(arr)',
    '    for i in range(n // 2 - 1, -1, -1):',
    '        heapify(arr, n, i)',
    '    for i in range(n - 1, 0, -1):',
    '        arr[0], arr[i] = arr[i], arr[0]',
    '        heapify(arr, i, 0)',
  ],
  c: [
    'void heapify(int arr[], int n, int i) {',
    '    int largest=i, l=2*i+1, r=2*i+2;',
    '    if (l<n && arr[l]>arr[largest]) largest=l;',
    '    if (r<n && arr[r]>arr[largest]) largest=r;',
    '    if (largest != i) {',
    '        int t=arr[i]; arr[i]=arr[largest]; arr[largest]=t;',
    '        heapify(arr, n, largest);',
    '    }',
    '}',
    'void heapSort(int arr[], int n) {',
    '    for (int i=n/2-1; i>=0; i--)',
    '        heapify(arr, n, i);',
    '    for (int i=n-1; i>0; i--) {',
    '        int t=arr[0]; arr[0]=arr[i]; arr[i]=t;',
    '        heapify(arr, i, 0);',
    '    }',
    '}',
  ],
  cpp: [
    'void heapify(vector<int>& arr, int n, int i) {',
    '    int largest=i, l=2*i+1, r=2*i+2;',
    '    if (l<n && arr[l]>arr[largest]) largest=l;',
    '    if (r<n && arr[r]>arr[largest]) largest=r;',
    '    if (largest != i) {',
    '        swap(arr[i], arr[largest]);',
    '        heapify(arr, n, largest);',
    '    }',
    '}',
    'void heapSort(vector<int>& arr) {',
    '    int n = arr.size();',
    '    for (int i=n/2-1; i>=0; i--)',
    '        heapify(arr, n, i);',
    '    for (int i=n-1; i>0; i--) {',
    '        swap(arr[0], arr[i]);',
    '        heapify(arr, i, 0);',
    '    }',
    '}',
  ],
  java: [
    'void heapify(int[] arr, int n, int i) {',
    '    int largest=i, l=2*i+1, r=2*i+2;',
    '    if (l<n && arr[l]>arr[largest]) largest=l;',
    '    if (r<n && arr[r]>arr[largest]) largest=r;',
    '    if (largest != i) {',
    '        int t=arr[i]; arr[i]=arr[largest]; arr[largest]=t;',
    '        heapify(arr, n, largest);',
    '    }',
    '}',
    'void heapSort(int[] arr) {',
    '    int n = arr.length;',
    '    for (int i=n/2-1; i>=0; i--)',
    '        heapify(arr, n, i);',
    '    for (int i=n-1; i>0; i--) {',
    '        int t=arr[0]; arr[0]=arr[i]; arr[i]=t;',
    '        heapify(arr, i, 0);',
    '    }',
    '}',
  ],
  js: [
    'function heapify(arr, n, i) {',
    '    let largest=i, l=2*i+1, r=2*i+2;',
    '    if (l<n && arr[l]>arr[largest]) largest=l;',
    '    if (r<n && arr[r]>arr[largest]) largest=r;',
    '    if (largest !== i) {',
    '        [arr[i], arr[largest]] = [arr[largest], arr[i]];',
    '        heapify(arr, n, largest);',
    '    }',
    '}',
    'function heapSort(arr) {',
    '    const n = arr.length;',
    '    for (let i=Math.floor(n/2)-1; i>=0; i--)',
    '        heapify(arr, n, i);',
    '    for (let i=n-1; i>0; i--) {',
    '        [arr[0], arr[i]] = [arr[i], arr[0]];',
    '        heapify(arr, i, 0);',
    '    }',
    '}',
  ],
};

let _arr, _sorted;

function* heapify(n, i) {
  let largest = i;
  const l = 2 * i + 1;
  const r = 2 * i + 2;

  yield {
    array: [..._arr], comparing: [i, l < n ? l : -1, r < n ? r : -1].filter(x => x >= 0),
    swapping: [], sorted: [..._sorted],
    pivot: -1,
    pointers: { root: i, left: l, right: r, largest },
    variables: { i, n, largest, l, r },
    message: `Heapify at i=${i}: comparing with children l=${l}, r=${r}`,
    codeLine: { python: 1, c: 0, cpp: 0, java: 0, js: 0 },
  };

  if (l < n && _arr[l] > _arr[largest]) largest = l;
  if (r < n && _arr[r] > _arr[largest]) largest = r;

  if (largest !== i) {
    yield {
      array: [..._arr], comparing: [], swapping: [i, largest],
      sorted: [..._sorted], pivot: -1,
      pointers: { root: i, largest },
      variables: { i, largest, 'arr[i]': _arr[i], 'arr[largest]': _arr[largest] },
      message: `Swap root=${_arr[i]} with largest child=${_arr[largest]}`,
      codeLine: { python: 6, c: 5, cpp: 5, java: 5, js: 5 },
    };
    [_arr[i], _arr[largest]] = [_arr[largest], _arr[i]];
    yield* heapify(n, largest);
  }
}

export function* generate(inputArray) {
  _arr = [...inputArray];
  const n = _arr.length;
  _sorted = new Array(n).fill(false);

  // Build max-heap
  yield {
    array: [..._arr], comparing: [], swapping: [], sorted: [..._sorted],
    pivot: -1, pointers: {}, variables: { phase: 'Build Max-Heap' },
    message: 'Phase 1: Building Max-Heap from bottom-up',
    codeLine: { python: 11, c: 10, cpp: 11, java: 11, js: 11 },
  };

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(n, i);
  }

  yield {
    array: [..._arr], comparing: [], swapping: [], sorted: [..._sorted],
    pivot: -1, pointers: {}, variables: { phase: 'Extract Max' },
    message: 'Max-Heap built! Phase 2: Extracting max elements',
    codeLine: { python: 13, c: 12, cpp: 13, java: 13, js: 13 },
  };

  for (let i = n - 1; i > 0; i--) {
    yield {
      array: [..._arr], comparing: [], swapping: [0, i], sorted: [..._sorted],
      pivot: -1, pointers: { root: 0, last: i },
      variables: { i, 'root': _arr[0], 'last': _arr[i] },
      message: `Extract max=${_arr[0]}, swap with last=${_arr[i]} at position ${i}`,
      codeLine: { python: 14, c: 13, cpp: 14, java: 14, js: 14 },
    };
    [_arr[0], _arr[i]] = [_arr[i], _arr[0]];
    _sorted[i] = true;
    yield* heapify(i, 0);
  }

  _sorted[0] = true;
  yield {
    array: [..._arr], comparing: [], swapping: [], sorted: [..._sorted],
    pivot: -1, pointers: {}, variables: {},
    message: '✅ Array fully sorted!',
    codeLine: { python: 15, c: 16, cpp: 16, java: 16, js: 16 },
  };
}
