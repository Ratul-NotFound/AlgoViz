// src/algorithms/datastructures/hashTable.js — Hash Table (Collision Resolution with Chaining)

export const metadata = {
  name: 'Hash Table (Chaining)',
  category: 'datastructures',
  slug: 'hash-table',
  timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(n)' },
  spaceComplexity: 'O(n)',
  stable: false,
  description:
    'A Hash Table is an associative data structure that maps keys to values using a Hash Function to compute an index into an array of buckets. When two keys hash to the same bucket (a Hash Collision), Separate Chaining stores colliding entries in a linked chain.',
  fact: 'Dictionaries in Python, Maps in JavaScript/Java, database indexing engines, and Redis in-memory caches all use Hash Tables to achieve lightning-fast O(1) average lookup and insertion speeds.',
};

export const CODE = {
  python: [
    'class HashTable:',
    '    def __init__(self, size=5):',
    '        self.size = size',
    '        self.buckets = [[] for _ in range(size)]',
    '',
    '    def _hash(self, key):',
    '        return sum(ord(c) for c in str(key)) % self.size  # O(1)',
    '',
    '    def put(self, key, value):',
    '        idx = self._hash(key)',
    '        bucket = self.buckets[idx]',
    '        for i, (k, v) in enumerate(bucket):',
    '            if k == key:',
    '                bucket[i] = (key, value)  # Update',
    '                return',
    '        bucket.append((key, value))  # Chain Collision',
    '',
    '    def get(self, key):',
    '        idx = self._hash(key)',
    '        for k, v in self.buckets[idx]:',
    '            if k == key: return v',
    '        return None',
  ],
  c: [
    'int hash(const char* key, int size) {',
    '    int sum = 0;',
    '    while (*key) sum += *key++;',
    '    return sum % size;',
    '}',
  ],
  cpp: [
    '#include <vector>',
    '#include <list>',
    'class HashTable {',
    '    std::vector<std::list<std::pair<std::string, int>>> table;',
    'public:',
    '    void put(std::string key, int val) { /* O(1) avg */ }',
    '    int get(std::string key) { /* O(1) avg */ }',
    '};',
  ],
  java: [
    'public class HashTable<K, V> {',
    '    private java.util.LinkedList<Entry<K, V>>[] buckets;',
    '    public void put(K key, V val) {',
    '        int idx = (key.hashCode() & 0x7fffffff) % buckets.length;',
    '        // separate chaining insertion',
    '    }',
    '}',
  ],
  js: [
    'class HashTable {',
    '    constructor(size = 5) {',
    '        this.buckets = Array.from({ length: size }, () => []);',
    '    }',
    '    hash(key) {',
    '        return key.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % this.buckets.length;',
    '    }',
    '    put(key, val) {',
    '        const idx = this.hash(key);',
    '        this.buckets[idx].push({ key, val });',
    '    }',
    '}',
  ],
};

function simpleHash(key, size = 5) {
  return String(key).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % size;
}

export function* generate(input) {
  const NUM_BUCKETS = 5;
  const buckets = Array.from({ length: NUM_BUCKETS }, () => []);

  // Initial seed key-value pairs
  const initialData = [
    { key: 'Alice', val: 94 },
    { key: 'Bob', val: 81 },
  ];

  initialData.forEach(item => {
    const idx = simpleHash(item.key, NUM_BUCKETS);
    buckets[idx].push(item);
  });

  // 1. Initial State
  yield {
    type: 'hash-table',
    buckets: buckets.map(b => [...b]),
    activeBucketIdx: null,
    hashComputation: null,
    action: 'idle',
    message: `Initialized Hash Table with ${NUM_BUCKETS} bucket slots. Alice (hash: ${simpleHash('Alice')}) and Bob (hash: ${simpleHash('Bob')}) mapped to buckets.`,
    codeLine: { python: 2, c: 1, cpp: 4, java: 2, js: 2 },
  };

  // Step 1: Insert "Charlie": 78
  const k1 = 'Charlie';
  const v1 = 78;
  const h1 = simpleHash(k1, NUM_BUCKETS);
  buckets[h1].push({ key: k1, val: v1 });

  yield {
    type: 'hash-table',
    buckets: buckets.map(b => [...b]),
    activeBucketIdx: h1,
    hashComputation: `hash("${k1}") = (ASCII sum) % 5 = ${h1}`,
    action: 'insert',
    message: `PUT("${k1}", ${v1}): Calculated hash("${k1}") % 5 = ${h1}. Inserted into Bucket [${h1}].`,
    codeLine: { python: 8, c: 3, cpp: 6, java: 3, js: 7 },
  };

  // Step 2: Insert "Dave": 99 -> COLLISION with Alice or Bob!
  const k2 = 'Dave';
  const v2 = 99;
  const h2 = simpleHash(k2, NUM_BUCKETS);
  const isCollision = buckets[h2].length > 0;
  buckets[h2].push({ key: k2, val: v2 });

  yield {
    type: 'hash-table',
    buckets: buckets.map(b => [...b]),
    activeBucketIdx: h2,
    hashComputation: `hash("${k2}") = ${h2} (COLLISION!)`,
    action: 'collision',
    message: `PUT("${k2}", ${v2}): hash("${k2}") = ${h2}. Slot [${h2}] already contains an entry! Separate Chaining appended ("${k2}", ${v2}) to Bucket [${h2}]'s linked list.`,
    codeLine: { python: 14, c: 4, cpp: 6, java: 4, js: 8 },
  };

  // Step 3: Lookup "Alice"
  const lookupKey = 'Alice';
  const lkHash = simpleHash(lookupKey, NUM_BUCKETS);
  yield {
    type: 'hash-table',
    buckets: buckets.map(b => [...b]),
    activeBucketIdx: lkHash,
    hashComputation: `hash("${lookupKey}") = ${lkHash}`,
    action: 'lookup',
    message: `GET("${lookupKey}"): Directly computed hash("${lookupKey}") = Bucket [${lkHash}]. Retrieved value 94 in O(1) constant time!`,
    codeLine: { python: 17, c: 4, cpp: 7, java: 4, js: 8 },
  };

  // Step 4: Complete
  yield {
    type: 'hash-table',
    buckets: buckets.map(b => [...b]),
    activeBucketIdx: null,
    hashComputation: null,
    action: 'complete',
    message: `Hash Table operations complete. Separate Chaining ensures collision safety with O(1) average lookup.`,
    codeLine: { python: 20, c: 5, cpp: 8, java: 5, js: 10 },
  };
}
