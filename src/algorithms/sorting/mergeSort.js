// src/algorithms/sorting/mergeSort.js

export const metadata = {
  name: 'Merge Sort',
  category: 'sorting',
  slug: 'merge-sort',
  timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
  spaceComplexity: 'O(n)',
  stable: true,
  description:
    'Merge Sort uses divide-and-conquer: it recursively splits the array in half, sorts each half, then merges them back together. It guarantees O(n log n) time in all cases.',
  fact: 'Merge Sort is the algorithm of choice for sorting linked lists and is used in Java\'s Arrays.sort() for objects and Python\'s built-in sort (TimSort).',
};

export const CODE = {
  python: [
    'def merge_sort(arr):',
    '    if len(arr) <= 1:',
    '        return arr',
    '    mid = len(arr) // 2',
    '    left = merge_sort(arr[:mid])',
    '    right = merge_sort(arr[mid:])',
    '    return merge(left, right)',
    '',
    'def merge(left, right):',
    '    result, i, j = [], 0, 0',
    '    while i < len(left) and j < len(right):',
    '        if left[i] <= right[j]:',
    '            result.append(left[i]); i += 1',
    '        else:',
    '            result.append(right[j]); j += 1',
    '    result += left[i:] + right[j:]',
    '    return result',
  ],
  c: [
    'void merge(int arr[], int l, int m, int r) {',
    '    int n1 = m-l+1, n2 = r-m;',
    '    int L[n1], R[n2];',
    '    for (int i=0; i<n1; i++) L[i]=arr[l+i];',
    '    for (int j=0; j<n2; j++) R[j]=arr[m+1+j];',
    '    int i=0, j=0, k=l;',
    '    while (i<n1 && j<n2) {',
    '        if (L[i] <= R[j]) arr[k++]=L[i++];',
    '        else arr[k++]=R[j++];',
    '    }',
    '    while (i<n1) arr[k++]=L[i++];',
    '    while (j<n2) arr[k++]=R[j++];',
    '}',
    'void mergeSort(int arr[], int l, int r) {',
    '    if (l < r) {',
    '        int m = l+(r-l)/2;',
    '        mergeSort(arr, l, m);',
    '        mergeSort(arr, m+1, r);',
    '        merge(arr, l, m, r);',
    '    }',
    '}',
  ],
  cpp: [
    'void merge(vector<int>& arr, int l, int m, int r) {',
    '    vector<int> left(arr.begin()+l, arr.begin()+m+1);',
    '    vector<int> right(arr.begin()+m+1, arr.begin()+r+1);',
    '    int i=0, j=0, k=l;',
    '    while (i<left.size() && j<right.size()) {',
    '        if (left[i] <= right[j]) arr[k++]=left[i++];',
    '        else arr[k++]=right[j++];',
    '    }',
    '    while (i<left.size()) arr[k++]=left[i++];',
    '    while (j<right.size()) arr[k++]=right[j++];',
    '}',
    'void mergeSort(vector<int>& arr, int l, int r) {',
    '    if (l < r) {',
    '        int m = l+(r-l)/2;',
    '        mergeSort(arr, l, m);',
    '        mergeSort(arr, m+1, r);',
    '        merge(arr, l, m, r);',
    '    }',
    '}',
  ],
  java: [
    'void mergeSort(int[] arr, int l, int r) {',
    '    if (l < r) {',
    '        int m = (l + r) / 2;',
    '        mergeSort(arr, l, m);',
    '        mergeSort(arr, m + 1, r);',
    '        merge(arr, l, m, r);',
    '    }',
    '}',
    'void merge(int[] arr, int l, int m, int r) {',
    '    int[] left  = Arrays.copyOfRange(arr, l, m+1);',
    '    int[] right = Arrays.copyOfRange(arr, m+1, r+1);',
    '    int i=0, j=0, k=l;',
    '    while (i<left.length && j<right.length) {',
    '        if (left[i] <= right[j]) arr[k++]=left[i++];',
    '        else arr[k++]=right[j++];',
    '    }',
    '    while (i<left.length)  arr[k++]=left[i++];',
    '    while (j<right.length) arr[k++]=right[j++];',
    '}',
  ],
  js: [
    'function mergeSort(arr) {',
    '    if (arr.length <= 1) return arr;',
    '    const mid = Math.floor(arr.length / 2);',
    '    const left  = mergeSort(arr.slice(0, mid));',
    '    const right = mergeSort(arr.slice(mid));',
    '    return merge(left, right);',
    '}',
    'function merge(left, right) {',
    '    const result = [];',
    '    let i = 0, j = 0;',
    '    while (i < left.length && j < right.length) {',
    '        if (left[i] <= right[j]) result.push(left[i++]);',
    '        else result.push(right[j++]);',
    '    }',
    '    return [...result, ...left.slice(i), ...right.slice(j)];',
    '}',
  ],
};

// Iterative bottom-up merge sort for easier visualization
export function* generate(inputArray) {
  const arr = [...inputArray];
  const n = arr.length;
  const sorted = new Array(n).fill(false);

  yield {
    array: [...arr], comparing: [], swapping: [], sorted: [...sorted],
    pivot: -1, current: -1, pointers: {},
    variables: { phase: 'divide', width: 1 },
    message: 'Merge Sort: Starting bottom-up merge — width=1',
    codeLine: { python: 3, c: 14, cpp: 11, java: 0, js: 0 },
  };

  // Bottom-up merge sort
  for (let width = 1; width < n; width *= 2) {
    for (let l = 0; l < n; l += 2 * width) {
      const m = Math.min(l + width - 1, n - 1);
      const r = Math.min(l + 2 * width - 1, n - 1);

      if (m >= r) continue;

      const left  = arr.slice(l, m + 1);
      const right = arr.slice(m + 1, r + 1);

      yield {
        array: [...arr], comparing: Array.from({ length: r - l + 1 }, (_, k) => l + k), swapping: [], sorted: [...sorted],
        pivot: -1, current: m,
        pointers: { left: l, mid: m, right: r },
        variables: { width, l, m, r },
        message: `Merging subarrays [${l}..${m}] = [${left}] and [${m+1}..${r}] = [${right}]`,
        codeLine: { python: 9, c: 0, cpp: 0, java: 8, js: 7 },
      };

      // Merge
      let i = 0, j = 0, k = l;
      while (i < left.length && j < right.length) {
        yield {
          array: [...arr], comparing: [l + i, m + 1 + j], swapping: [], sorted: [...sorted],
          pivot: -1, current: k,
          pointers: { left: l + i, right: m + 1 + j, write: k },
          variables: { i, j, k, 'left[i]': left[i], 'right[j]': right[j] },
          message: `Compare left[${i}]=${left[i]} vs right[${j}]=${right[j]} — pick ${left[i] <= right[j] ? left[i] : right[j]}`,
          codeLine: { python: 11, c: 7, cpp: 5, java: 13, js: 11 },
        };

        if (left[i] <= right[j]) {
          arr[k++] = left[i++];
        } else {
          arr[k++] = right[j++];
        }
        yield {
          array: [...arr], comparing: [], swapping: [k - 1], sorted: [...sorted],
          pivot: -1, current: k - 1,
          pointers: { write: k - 1 },
          variables: { i, j, k },
          message: `Placed ${arr[k - 1]} at position ${k - 1}`,
          codeLine: { python: 12, c: 8, cpp: 6, java: 14, js: 12 },
        };
      }

      while (i < left.length) { arr[k++] = left[i++]; }
      while (j < right.length) { arr[k++] = right[j++]; }

      // Mark merged region
      for (let idx = l; idx <= r; idx++) {
        if (width * 2 >= n) sorted[idx] = true;
      }

      yield {
        array: [...arr], comparing: [], swapping: Array.from({ length: r - l + 1 }, (_, k) => l + k), sorted: [...sorted],
        pivot: -1, current: -1,
        pointers: { left: l, right: r },
        variables: { width },
        message: `Merged: [${arr.slice(l, r + 1).join(', ')}] at positions [${l}..${r}]`,
        codeLine: { python: 15, c: 11, cpp: 9, java: 17, js: 14 },
      };
    }
  }

  const allSorted = new Array(n).fill(true);
  yield {
    array: [...arr], comparing: [], swapping: [], sorted: allSorted,
    pivot: -1, current: -1, pointers: {}, variables: {},
    message: '✅ Array fully sorted!',
    codeLine: { python: 6, c: 19, cpp: 17, java: 7, js: 5 },
  };
}
