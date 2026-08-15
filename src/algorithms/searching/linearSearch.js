// src/algorithms/searching/linearSearch.js

export const metadata = {
  name: 'Linear Search',
  category: 'searching',
  slug: 'linear-search',
  timeComplexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
  spaceComplexity: 'O(1)',
  stable: true,
  description:
    'Linear Search scans each element one by one from left to right until the target is found or the array is exhausted. Simple but works on unsorted arrays.',
  fact: 'Despite being slow, Linear Search is the only option when data is unordered or data structures like hash maps are unavailable.',
};

export const CODE = {
  python: [
    'def linear_search(arr, target):',
    '    for i in range(len(arr)):',
    '        if arr[i] == target:',
    '            return i',
    '    return -1',
  ],
  c: [
    'int linearSearch(int arr[], int n, int target) {',
    '    for (int i = 0; i < n; i++) {',
    '        if (arr[i] == target)',
    '            return i;',
    '    }',
    '    return -1;',
    '}',
  ],
  cpp: [
    'int linearSearch(vector<int>& arr, int target) {',
    '    for (int i = 0; i < arr.size(); i++) {',
    '        if (arr[i] == target)',
    '            return i;',
    '    }',
    '    return -1;',
    '}',
  ],
  java: [
    'int linearSearch(int[] arr, int target) {',
    '    for (int i = 0; i < arr.length; i++) {',
    '        if (arr[i] == target)',
    '            return i;',
    '    }',
    '    return -1;',
    '}',
  ],
  js: [
    'function linearSearch(arr, target) {',
    '    for (let i = 0; i < arr.length; i++) {',
    '        if (arr[i] === target)',
    '            return i;',
    '    }',
    '    return -1;',
    '}',
  ],
};

export function* generate({ array: inputArray, target }) {
  const arr = [...inputArray];
  const n = arr.length;
  const checked = new Array(n).fill(false);

  yield {
    array: [...arr], comparing: [], found: -1, checked: [...checked],
    pointers: {}, variables: { target },
    message: `Searching for target = ${target}`,
    codeLine: { python: 0, c: 0, cpp: 0, java: 0, js: 0 },
  };

  for (let i = 0; i < n; i++) {
    yield {
      array: [...arr], comparing: [i], found: -1, checked: [...checked],
      pointers: { i },
      variables: { i, 'arr[i]': arr[i], target },
      message: `Checking arr[${i}] = ${arr[i]} == ${target}? ${arr[i] === target ? '✅ FOUND!' : '❌ No'}`,
      codeLine: { python: 2, c: 2, cpp: 2, java: 2, js: 2 },
    };

    if (arr[i] === target) {
      checked[i] = 'found';
      yield {
        array: [...arr], comparing: [], found: i, checked: [...checked],
        pointers: { i },
        variables: { i, result: i },
        message: `🎯 Target ${target} found at index ${i}!`,
        codeLine: { python: 3, c: 3, cpp: 3, java: 3, js: 3 },
      };
      return;
    }
    checked[i] = true;
  }

  yield {
    array: [...arr], comparing: [], found: -1, checked: [...checked],
    pointers: {}, variables: { target, result: -1 },
    message: `❌ Target ${target} not found in array. Return -1.`,
    codeLine: { python: 4, c: 5, cpp: 5, java: 5, js: 5 },
  };
}
