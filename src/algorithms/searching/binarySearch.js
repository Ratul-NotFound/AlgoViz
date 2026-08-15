// src/algorithms/searching/binarySearch.js

export const metadata = {
  name: 'Binary Search',
  category: 'searching',
  slug: 'binary-search',
  timeComplexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
  spaceComplexity: 'O(1)',
  stable: true,
  description:
    'Binary Search works on a SORTED array. It repeatedly halves the search space by comparing the target with the middle element, eliminating half the remaining elements each step.',
  fact: 'Binary Search can find a target in a million-element array in just 20 comparisons! That\'s the power of O(log n).',
};

export const CODE = {
  python: [
    'def binary_search(arr, target):',
    '    left, right = 0, len(arr) - 1',
    '    while left <= right:',
    '        mid = (left + right) // 2',
    '        if arr[mid] == target:',
    '            return mid',
    '        elif arr[mid] < target:',
    '            left = mid + 1',
    '        else:',
    '            right = mid - 1',
    '    return -1',
  ],
  c: [
    'int binarySearch(int arr[], int n, int target) {',
    '    int left = 0, right = n - 1;',
    '    while (left <= right) {',
    '        int mid = left + (right - left) / 2;',
    '        if (arr[mid] == target) return mid;',
    '        if (arr[mid] < target) left = mid + 1;',
    '        else right = mid - 1;',
    '    }',
    '    return -1;',
    '}',
  ],
  cpp: [
    'int binarySearch(vector<int>& arr, int target) {',
    '    int left = 0, right = arr.size() - 1;',
    '    while (left <= right) {',
    '        int mid = left + (right - left) / 2;',
    '        if (arr[mid] == target) return mid;',
    '        if (arr[mid] < target) left = mid + 1;',
    '        else right = mid - 1;',
    '    }',
    '    return -1;',
    '}',
  ],
  java: [
    'int binarySearch(int[] arr, int target) {',
    '    int left = 0, right = arr.length - 1;',
    '    while (left <= right) {',
    '        int mid = left + (right - left) / 2;',
    '        if (arr[mid] == target) return mid;',
    '        if (arr[mid] < target) left = mid + 1;',
    '        else right = mid - 1;',
    '    }',
    '    return -1;',
    '}',
  ],
  js: [
    'function binarySearch(arr, target) {',
    '    let left = 0, right = arr.length - 1;',
    '    while (left <= right) {',
    '        const mid = Math.floor((left + right) / 2);',
    '        if (arr[mid] === target) return mid;',
    '        if (arr[mid] < target) left = mid + 1;',
    '        else right = mid - 1;',
    '    }',
    '    return -1;',
    '}',
  ],
};

export function* generate({ array: inputArray, target }) {
  // Sort the array first (binary search requires sorted input)
  const arr = [...inputArray].sort((a, b) => a - b);
  const n = arr.length;
  const eliminated = new Array(n).fill(false);

  yield {
    array: [...arr], comparing: [], found: -1, eliminated: [...eliminated],
    pointers: { left: 0, right: n - 1 },
    variables: { target, left: 0, right: n - 1, mid: '?' },
    message: `Array sorted. Searching for target = ${target}. left=0, right=${n - 1}`,
    codeLine: { python: 1, c: 1, cpp: 1, java: 1, js: 1 },
  };

  let left = 0, right = n - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    // Mark eliminated regions
    for (let k = 0; k < left; k++) eliminated[k] = true;
    for (let k = right + 1; k < n; k++) eliminated[k] = true;

    yield {
      array: [...arr], comparing: [mid], found: -1, eliminated: [...eliminated],
      pointers: { left, right, mid },
      variables: { left, right, mid, 'arr[mid]': arr[mid], target },
      message: `mid = (${left} + ${right}) / 2 = ${mid}. Checking arr[${mid}] = ${arr[mid]}`,
      codeLine: { python: 3, c: 3, cpp: 3, java: 3, js: 3 },
    };

    if (arr[mid] === target) {
      yield {
        array: [...arr], comparing: [], found: mid, eliminated: [...eliminated],
        pointers: { mid },
        variables: { mid, result: mid },
        message: `🎯 arr[${mid}] = ${arr[mid]} == target! Found at index ${mid}!`,
        codeLine: { python: 5, c: 4, cpp: 4, java: 4, js: 4 },
      };
      return;
    } else if (arr[mid] < target) {
      yield {
        array: [...arr], comparing: [], found: -1, eliminated: [...eliminated],
        pointers: { left, right, mid },
        variables: { left, right, mid, direction: 'RIGHT' },
        message: `arr[${mid}]=${arr[mid]} < target=${target} → Search RIGHT half. left = ${mid + 1}`,
        codeLine: { python: 7, c: 5, cpp: 5, java: 5, js: 5 },
      };
      left = mid + 1;
    } else {
      yield {
        array: [...arr], comparing: [], found: -1, eliminated: [...eliminated],
        pointers: { left, right, mid },
        variables: { left, right, mid, direction: 'LEFT' },
        message: `arr[${mid}]=${arr[mid]} > target=${target} → Search LEFT half. right = ${mid - 1}`,
        codeLine: { python: 9, c: 6, cpp: 6, java: 6, js: 6 },
      };
      right = mid - 1;
    }
  }

  yield {
    array: [...arr], comparing: [], found: -1, eliminated: new Array(n).fill(true),
    pointers: {},
    variables: { target, result: -1 },
    message: `❌ Target ${target} not found. Return -1.`,
    codeLine: { python: 10, c: 8, cpp: 8, java: 8, js: 8 },
  };
}
