// src/algorithms/sorting/insertionSort.js

export const metadata = {
  name: 'Insertion Sort',
  category: 'sorting',
  slug: 'insertion-sort',
  timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
  spaceComplexity: 'O(1)',
  stable: true,
  description:
    'Insertion Sort builds the sorted array one element at a time. It takes each element and inserts it into its correct position among the already-sorted elements — like sorting playing cards in your hand.',
  fact: 'Insertion Sort is very efficient for small arrays and nearly-sorted arrays. Many sorting libraries use it as a base case for larger algorithms like Tim Sort.',
};

export const CODE = {
  python: [
    'def insertion_sort(arr):',
    '    for i in range(1, len(arr)):',
    '        key = arr[i]',
    '        j = i - 1',
    '        while j >= 0 and arr[j] > key:',
    '            arr[j + 1] = arr[j]',
    '            j -= 1',
    '        arr[j + 1] = key',
    '    return arr',
  ],
  c: [
    'void insertionSort(int arr[], int n) {',
    '    for (int i = 1; i < n; i++) {',
    '        int key = arr[i];',
    '        int j = i - 1;',
    '        while (j >= 0 && arr[j] > key) {',
    '            arr[j + 1] = arr[j];',
    '            j--;',
    '        }',
    '        arr[j + 1] = key;',
    '    }',
    '}',
  ],
  cpp: [
    'void insertionSort(vector<int>& arr) {',
    '    for (int i = 1; i < arr.size(); i++) {',
    '        int key = arr[i];',
    '        int j = i - 1;',
    '        while (j >= 0 && arr[j] > key) {',
    '            arr[j + 1] = arr[j];',
    '            j--;',
    '        }',
    '        arr[j + 1] = key;',
    '    }',
    '}',
  ],
  java: [
    'void insertionSort(int[] arr) {',
    '    for (int i = 1; i < arr.length; i++) {',
    '        int key = arr[i];',
    '        int j = i - 1;',
    '        while (j >= 0 && arr[j] > key) {',
    '            arr[j + 1] = arr[j];',
    '            j--;',
    '        }',
    '        arr[j + 1] = key;',
    '    }',
    '}',
  ],
  js: [
    'function insertionSort(arr) {',
    '    for (let i = 1; i < arr.length; i++) {',
    '        let key = arr[i];',
    '        let j = i - 1;',
    '        while (j >= 0 && arr[j] > key) {',
    '            arr[j + 1] = arr[j];',
    '            j--;',
    '        }',
    '        arr[j + 1] = key;',
    '    }',
    '    return arr;',
    '}',
  ],
};

export function* generate(inputArray) {
  const arr = [...inputArray];
  const n = arr.length;
  const sorted = [true];

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    yield {
      array: [...arr], comparing: [i], swapping: [], sorted: [...sorted, ...new Array(n - i).fill(false)],
      pivot: -1, current: i,
      pointers: { i, key: i },
      variables: { i, key },
      message: `Picking key = arr[${i}] = ${key} to insert into sorted portion`,
      codeLine: { python: 2, c: 2, cpp: 2, java: 2, js: 2 },
    };

    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      yield {
        array: [...arr], comparing: [j, j + 1], swapping: [], sorted: [...sorted, ...new Array(n - i).fill(false)],
        pivot: -1, current: j + 1,
        pointers: { i, j, key: j + 1 },
        variables: { i, j, key, 'arr[j]': arr[j] },
        message: `arr[${j}]=${arr[j]} > key=${key} — shift ${arr[j]} right`,
        codeLine: { python: 4, c: 4, cpp: 4, java: 4, js: 4 },
      };

      arr[j + 1] = arr[j];
      yield {
        array: [...arr], comparing: [], swapping: [j, j + 1], sorted: [...sorted, ...new Array(n - i).fill(false)],
        pivot: -1, current: j + 1,
        pointers: { i, j },
        variables: { i, j, key },
        message: `Shifted arr[${j}]=${arr[j]} to position ${j + 1}`,
        codeLine: { python: 5, c: 5, cpp: 5, java: 5, js: 5 },
      };
      j--;
    }

    arr[j + 1] = key;
    sorted.push(true);
    yield {
      array: [...arr], comparing: [], swapping: [j + 1], sorted: [...sorted, ...new Array(n - sorted.length).fill(false)],
      pivot: -1, current: j + 1,
      pointers: { i },
      variables: { i, j: j + 1, key },
      message: `Inserted key=${key} at position ${j + 1}. Sorted region: [0..${i}]`,
      codeLine: { python: 7, c: 8, cpp: 8, java: 8, js: 8 },
    };
  }

  const allSorted = new Array(n).fill(true);
  yield {
    array: [...arr], comparing: [], swapping: [], sorted: allSorted,
    pivot: -1, current: -1, pointers: {}, variables: {},
    message: '✅ Array fully sorted!',
    codeLine: { python: 8, c: 10, cpp: 10, java: 10, js: 10 },
  };
}
