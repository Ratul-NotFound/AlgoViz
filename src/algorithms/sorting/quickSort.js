// src/algorithms/sorting/quickSort.js

export const metadata = {
  name: 'Quick Sort',
  category: 'sorting',
  slug: 'quick-sort',
  timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
  spaceComplexity: 'O(log n)',
  stable: false,
  description:
    'Quick Sort picks a pivot element and partitions the array so all elements less than the pivot come before it and all greater elements come after. Then it recursively sorts the two halves.',
  fact: 'Quick Sort is typically 2-3x faster than Merge Sort in practice due to better cache performance. It is the default algorithm in C\'s qsort() and C++\'s std::sort().',
};

export const CODE = {
  python: [
    'def quick_sort(arr, low, high):',
    '    if low < high:',
    '        pi = partition(arr, low, high)',
    '        quick_sort(arr, low, pi - 1)',
    '        quick_sort(arr, pi + 1, high)',
    '',
    'def partition(arr, low, high):',
    '    pivot = arr[high]',
    '    i = low - 1',
    '    for j in range(low, high):',
    '        if arr[j] <= pivot:',
    '            i += 1',
    '            arr[i], arr[j] = arr[j], arr[i]',
    '    arr[i+1], arr[high] = arr[high], arr[i+1]',
    '    return i + 1',
  ],
  c: [
    'int partition(int arr[], int low, int high) {',
    '    int pivot = arr[high];',
    '    int i = low - 1;',
    '    for (int j = low; j < high; j++) {',
    '        if (arr[j] <= pivot) {',
    '            i++;',
    '            int t=arr[i]; arr[i]=arr[j]; arr[j]=t;',
    '        }',
    '    }',
    '    int t=arr[i+1]; arr[i+1]=arr[high]; arr[high]=t;',
    '    return i + 1;',
    '}',
    'void quickSort(int arr[], int low, int high) {',
    '    if (low < high) {',
    '        int pi = partition(arr, low, high);',
    '        quickSort(arr, low, pi - 1);',
    '        quickSort(arr, pi + 1, high);',
    '    }',
    '}',
  ],
  cpp: [
    'int partition(vector<int>& arr, int low, int high) {',
    '    int pivot = arr[high];',
    '    int i = low - 1;',
    '    for (int j = low; j < high; j++) {',
    '        if (arr[j] <= pivot) {',
    '            swap(arr[++i], arr[j]);',
    '        }',
    '    }',
    '    swap(arr[i + 1], arr[high]);',
    '    return i + 1;',
    '}',
    'void quickSort(vector<int>& arr, int low, int high) {',
    '    if (low < high) {',
    '        int pi = partition(arr, low, high);',
    '        quickSort(arr, low, pi - 1);',
    '        quickSort(arr, pi + 1, high);',
    '    }',
    '}',
  ],
  java: [
    'int partition(int[] arr, int low, int high) {',
    '    int pivot = arr[high];',
    '    int i = low - 1;',
    '    for (int j = low; j < high; j++) {',
    '        if (arr[j] <= pivot) {',
    '            int t=arr[++i]; arr[i]=arr[j]; arr[j]=t;',
    '        }',
    '    }',
    '    int t=arr[i+1]; arr[i+1]=arr[high]; arr[high]=t;',
    '    return i + 1;',
    '}',
    'void quickSort(int[] arr, int low, int high) {',
    '    if (low < high) {',
    '        int pi = partition(arr, low, high);',
    '        quickSort(arr, low, pi - 1);',
    '        quickSort(arr, pi + 1, high);',
    '    }',
    '}',
  ],
  js: [
    'function quickSort(arr, low = 0, high = arr.length - 1) {',
    '    if (low < high) {',
    '        const pi = partition(arr, low, high);',
    '        quickSort(arr, low, pi - 1);',
    '        quickSort(arr, pi + 1, high);',
    '    }',
    '}',
    'function partition(arr, low, high) {',
    '    const pivot = arr[high];',
    '    let i = low - 1;',
    '    for (let j = low; j < high; j++) {',
    '        if (arr[j] <= pivot) {',
    '            [arr[++i], arr[j]] = [arr[j], arr[i]];',
    '        }',
    '    }',
    '    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];',
    '    return i + 1;',
    '}',
  ],
};

const frames = [];
let arr, sorted;

function* partition(low, high) {
  const pivot = arr[high];
  let i = low - 1;

  yield {
    array: [...arr], comparing: [], swapping: [], sorted: [...sorted],
    pivot: high,
    pointers: { low, high, pivot: high, i },
    variables: { low, high, pivot, i },
    message: `Pivot = arr[${high}] = ${pivot}. i = ${low - 1}`,
    codeLine: { python: 7, c: 1, cpp: 1, java: 1, js: 8 },
  };

  for (let j = low; j < high; j++) {
    yield {
      array: [...arr], comparing: [j, high], swapping: [], sorted: [...sorted],
      pivot: high,
      pointers: { low, high, pivot: high, i, j },
      variables: { low, high, pivot, i, j, 'arr[j]': arr[j] },
      message: `arr[${j}]=${arr[j]} ≤ pivot=${pivot}? ${arr[j] <= pivot ? 'YES — swap!' : 'NO — skip'}`,
      codeLine: { python: 10, c: 4, cpp: 4, java: 4, js: 11 },
    };

    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      yield {
        array: [...arr], comparing: [], swapping: [i, j], sorted: [...sorted],
        pivot: high,
        pointers: { low, high, pivot: high, i, j },
        variables: { low, high, pivot, i, j },
        message: `Swapped arr[${i}]=${arr[i]} ↔ arr[${j}]=${arr[j]}. i now = ${i}`,
        codeLine: { python: 12, c: 6, cpp: 5, java: 5, js: 12 },
      };
    }
  }

  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  yield {
    array: [...arr], comparing: [], swapping: [i + 1, high], sorted: [...sorted],
    pivot: i + 1,
    pointers: { low, high, pivot: i + 1, i },
    variables: { low, high, pivot, 'pivot position': i + 1 },
    message: `Placed pivot=${pivot} at final position ${i + 1}`,
    codeLine: { python: 13, c: 9, cpp: 8, java: 8, js: 15 },
  };

  sorted[i + 1] = true;
  return i + 1;
}

function* qsort(low, high) {
  if (low >= high) {
    if (low === high) sorted[low] = true;
    return;
  }

  yield {
    array: [...arr], comparing: Array.from({ length: high - low + 1 }, (_, k) => low + k), swapping: [], sorted: [...sorted],
    pivot: high,
    pointers: { low, high },
    variables: { low, high },
    message: `Sorting subarray [${low}..${high}] = [${arr.slice(low, high + 1).join(', ')}]`,
    codeLine: { python: 1, c: 13, cpp: 11, java: 11, js: 0 },
  };

  const pi = yield* partition(low, high);
  yield* qsort(low, pi - 1);
  yield* qsort(pi + 1, high);
}

export function* generate(inputArray) {
  arr = [...inputArray];
  sorted = new Array(arr.length).fill(false);
  yield* qsort(0, arr.length - 1);

  const allSorted = new Array(arr.length).fill(true);
  yield {
    array: [...arr], comparing: [], swapping: [], sorted: allSorted,
    pivot: -1, pointers: {}, variables: {},
    message: '✅ Array fully sorted!',
    codeLine: { python: 4, c: 18, cpp: 17, java: 17, js: 5 },
  };
}
