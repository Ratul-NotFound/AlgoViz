import { useState, useMemo, useEffect, useRef } from 'react';
import { ALGORITHMS, CATEGORIES } from '../data/algorithms.js';
import AlgorithmDuel from '../components/AlgorithmDuel.jsx';
import {
  SearchIcon, ArrowRightIcon, PlayIcon, PauseIcon, ShuffleIcon, CodeIcon,
  PythonIcon, CIcon, CppIcon, JavaIcon, JSIcon, getAlgoIcon, AlgoFlowXLogo
} from '../components/Icons.jsx';

const LANG_OPTIONS = [
  { id: 'python', label: 'Python', icon: PythonIcon, ext: 'py' },
  { id: 'c',      label: 'C',      icon: CIcon,      ext: 'c' },
  { id: 'cpp',    label: 'C++',    icon: CppIcon,    ext: 'cpp' },
  { id: 'java',   label: 'Java',   icon: JavaIcon,   ext: 'java' },
  { id: 'js',     label: 'JavaScript', icon: JSIcon, ext: 'js' },
];

const FEATURED_QUICK_LAUNCH = [
  { slug: 'quick-sort', name: 'Quick Sort', comp: 'O(n log n)', tag: 'Divide & Conquer', cat: 'sorting' },
  { slug: 'binary-search', name: 'Binary Search', comp: 'O(log n)', tag: 'Interval Halving', cat: 'searching' },
  { slug: 'dijkstra', name: "Dijkstra's Algorithm", comp: 'O(E log V)', tag: 'Greedy Shortest Path', cat: 'graphs' },
  { slug: 'binary-heap', name: 'Binary Min-Heap', comp: 'O(log n)', tag: 'Priority Queue', cat: 'datastructures' },
  { slug: 'circular-queue', name: 'Circular Queue', comp: 'O(1)', tag: 'Ring Buffer', cat: 'datastructures' },
  { slug: 'bst', name: 'Binary Search Tree', comp: 'O(log n)', tag: 'Hierarchical Search', cat: 'trees' },
];

// Structured Learning Tracks
const LEARNING_TRACKS = [
  {
    id: 'sorting-foundations',
    trackNum: '01',
    title: 'Sorting Fundamentals',
    category: 'sorting',
    description: 'Master iterative adjacent swaps, min-element extraction, and progressive insertion sorting mechanics.',
    difficulty: 'Beginner',
    diffColor: '#10b981',
    timeEst: '25 mins',
    algorithms: ['bubble-sort', 'selection-sort', 'insertion-sort'],
  },
  {
    id: 'divide-and-conquer',
    trackNum: '02',
    title: 'Divide & Conquer Sorting',
    category: 'sorting',
    description: 'Learn recursive array partitions, logarithmic divide-and-conquer merges, and binary heap sifters.',
    difficulty: 'Intermediate',
    diffColor: '#f59e0b',
    timeEst: '35 mins',
    algorithms: ['merge-sort', 'quick-sort', 'heap-sort'],
  },
  {
    id: 'searching-algorithms',
    trackNum: '03',
    title: 'Search Strategies',
    category: 'searching',
    description: 'Compare linear memory sweeps against logarithmic interval bisection in sorted data.',
    difficulty: 'Beginner',
    diffColor: '#10b981',
    timeEst: '15 mins',
    algorithms: ['linear-search', 'binary-search'],
  },
  {
    id: 'linear-data-structures',
    trackNum: '04',
    title: 'Linear Data Structures',
    category: 'datastructures',
    description: 'Master LIFO stacks, FIFO queues, circular ring buffers, and singly/doubly linked pointer chains.',
    difficulty: 'Beginner',
    diffColor: '#10b981',
    timeEst: '30 mins',
    algorithms: ['stack', 'queue', 'linked-list', 'doubly-linked-list', 'circular-queue'],
  },
  {
    id: 'tree-structures',
    trackNum: '05',
    title: 'Hierarchical Trees',
    category: 'trees',
    description: 'Understand Binary Search Tree invariant, dynamic node insertions, and recursive tree traversals.',
    difficulty: 'Intermediate',
    diffColor: '#a855f7',
    timeEst: '20 mins',
    algorithms: ['bst'],
  },
  {
    id: 'graph-traversals',
    trackNum: '06',
    title: 'Graph Theory & Shortest Paths',
    category: 'graphs',
    description: 'Traverse complex graphs using queues, recursive stacks, and greedy edge relaxation algorithms.',
    difficulty: 'Advanced',
    diffColor: '#38bdf8',
    timeEst: '45 mins',
    algorithms: ['bfs', 'dfs', 'dijkstra'],
  },
  {
    id: 'advanced-data-structures',
    trackNum: '07',
    title: 'Priority Heaps & Hash Tables',
    category: 'datastructures',
    description: 'Build binary min-heaps with sift-up/down bubble and hash tables with separate chaining collisions.',
    difficulty: 'Intermediate',
    diffColor: '#f59e0b',
    timeEst: '35 mins',
    algorithms: ['binary-heap', 'hash-table'],
  },
];

// Interactive Big-O Growth Curves
function calculateOperations(n) {
  return [
    { name: 'O(1)', label: 'Constant', ops: 1, class: 'good' },
    { name: 'O(log n)', label: 'Logarithmic', ops: Math.max(1, Math.round(Math.log2(n || 1))), class: 'good' },
    { name: 'O(n)', label: 'Linear', ops: n, class: 'med' },
    { name: 'O(n log n)', label: 'Linearithmic', ops: Math.round(n * Math.log2(n || 1)), class: 'med' },
    { name: 'O(n²)', label: 'Quadratic', ops: n * n, class: 'bad' },
  ];
}

const CATEGORY_COLORS = {
  sorting:        '#818cf8',
  searching:      '#38bdf8',
  datastructures: '#f43f5e',
  graphs:         '#10b981',
  trees:          '#a78bfa',
};

export default function HomePage({ onSelectAlgo }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'tracks' | 'duel' | 'matrix' | 'growth'
  const [selectedLang, setSelectedLang] = useState('python');
  const [sliderN, setSliderN] = useState(64);

  // ── Hero Interactive DSA Console State ──
  const [heroMode, setHeroMode] = useState('quick'); // 'quick' | 'bubble' | 'binary' | 'heap'
  const [heroArray, setHeroArray] = useState([42, 18, 85, 29, 67, 12, 94, 38, 55, 73]);
  const [heroActiveIdx, setHeroActiveIdx] = useState({ i: -1, j: -1, pivot: -1 });
  const [heroSorting, setHeroSorting] = useState(false);
  const [heroStats, setHeroStats] = useState({ step: 0, comps: 0, swaps: 0 });
  const heroTimerRef = useRef(null);

  const shuffleHero = () => {
    clearInterval(heroTimerRef.current);
    setHeroSorting(false);
    setHeroActiveIdx({ i: -1, j: -1, pivot: -1 });
    setHeroStats({ step: 0, comps: 0, swaps: 0 });
    const fresh = Array.from({ length: 10 }, () => Math.floor(Math.random() * 75) + 15);
    if (heroMode === 'binary') {
      fresh.sort((a, b) => a - b);
    }
    setHeroArray(fresh);
  };

  const handleSwitchHeroMode = (mode) => {
    clearInterval(heroTimerRef.current);
    setHeroSorting(false);
    setHeroActiveIdx({ i: -1, j: -1, pivot: -1 });
    setHeroStats({ step: 0, comps: 0, swaps: 0 });
    setHeroMode(mode);
    const fresh = Array.from({ length: 10 }, () => Math.floor(Math.random() * 75) + 15);
    if (mode === 'binary') {
      fresh.sort((a, b) => a - b);
    }
    setHeroArray(fresh);
  };

  const runHeroAnimation = () => {
    if (heroSorting) {
      clearInterval(heroTimerRef.current);
      setHeroSorting(false);
      return;
    }

    setHeroSorting(true);
    let arr = [...heroArray];
    let stepCount = heroStats.step;
    let compCount = heroStats.comps;
    let swapCount = heroStats.swaps;

    if (heroMode === 'bubble') {
      let i = 0, j = 0;
      const n = arr.length;

      heroTimerRef.current = setInterval(() => {
        if (i < n) {
          if (j < n - i - 1) {
            compCount++;
            stepCount++;
            setHeroActiveIdx({ i: j, j: j + 1, pivot: -1 });
            if (arr[j] > arr[j + 1]) {
              swapCount++;
              const temp = arr[j];
              arr[j] = arr[j + 1];
              arr[j + 1] = temp;
              setHeroArray([...arr]);
            }
            setHeroStats({ step: stepCount, comps: compCount, swaps: swapCount });
            j++;
          } else {
            j = 0;
            i++;
          }
        } else {
          clearInterval(heroTimerRef.current);
          setHeroSorting(false);
          setHeroActiveIdx({ i: -1, j: -1, pivot: -1 });
        }
      }, 95);
    } else if (heroMode === 'binary') {
      let left = 0;
      let right = arr.length - 1;
      const target = arr[Math.floor(Math.random() * arr.length)];

      heroTimerRef.current = setInterval(() => {
        if (left <= right) {
          stepCount++;
          compCount++;
          const mid = Math.floor((left + right) / 2);
          setHeroActiveIdx({ i: left, j: right, pivot: mid });
          setHeroStats({ step: stepCount, comps: compCount, swaps: swapCount });

          if (arr[mid] === target) {
            clearInterval(heroTimerRef.current);
            setHeroSorting(false);
          } else if (arr[mid] < target) {
            left = mid + 1;
          } else {
            right = mid - 1;
          }
        } else {
          clearInterval(heroTimerRef.current);
          setHeroSorting(false);
          setHeroActiveIdx({ i: -1, j: -1, pivot: -1 });
        }
      }, 350);
    } else {
      // Quick sort preview
      let i = 0, j = 0;
      const n = arr.length;
      heroTimerRef.current = setInterval(() => {
        if (i < n) {
          if (j < n - i - 1) {
            compCount++;
            stepCount++;
            setHeroActiveIdx({ i: j, j: j + 1, pivot: n - 1 });
            if (arr[j] > arr[j + 1]) {
              swapCount++;
              const temp = arr[j];
              arr[j] = arr[j + 1];
              arr[j + 1] = temp;
              setHeroArray([...arr]);
            }
            setHeroStats({ step: stepCount, comps: compCount, swaps: swapCount });
            j++;
          } else {
            j = 0;
            i++;
          }
        } else {
          clearInterval(heroTimerRef.current);
          setHeroSorting(false);
          setHeroActiveIdx({ i: -1, j: -1, pivot: -1 });
        }
      }, 85);
    }
  };

  useEffect(() => {
    return () => clearInterval(heroTimerRef.current);
  }, []);

  // Filtered algorithms for directory & matrix
  const filteredAlgos = useMemo(() => {
    return ALGORITHMS.filter(algo => {
      const matchesCat = activeCategory === 'all' || algo.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        algo.name.toLowerCase().includes(q) ||
        algo.description.toLowerCase().includes(q) ||
        algo.timeComplexity.average.toLowerCase().includes(q) ||
        algo.category.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const complexityResults = useMemo(() => calculateOperations(sliderN), [sliderN]);

  return (
    <div className="home-container">
      {/* ── 1. Master Flagship Hero Section ── */}
      <section className="creative-hero-grid flagship-hero-grid">
        <div className="platform-hero flagship-hero-left">
          {/* Eyebrow Status Badge */}
          <div className="flagship-status-badge">
            <span className="badge-signal-dot" />
            <span className="badge-kernel-text">ALGOFLOWX STUDIO v2.4 • INTERACTIVE DSA KERNEL</span>
          </div>

          {/* Main Hero Title */}
          <h1 className="platform-hero-title flagship-title">
            The Visual Operating System for <br className="hero-title-br" />
            <span className="hero-title-accent">Data Structures & Algorithms.</span>
          </h1>

          <p className="platform-hero-sub flagship-sub">
            Step into execution memory. Trace pointer mutations, debug recursive partitions frame-by-frame, and master algorithmic complexities across 19 interactive DSA engines with synchronized multi-language source code.
          </p>

          {/* Featured Launch Modules Strip */}
          <div className="hero-quick-launch">
            <span className="launch-label">FEATURED VISUALIZERS:</span>
            <div className="launch-chips">
              {FEATURED_QUICK_LAUNCH.map(item => (
                <button
                  key={item.slug}
                  className="quick-chip-btn"
                  onClick={() => onSelectAlgo(item.slug)}
                >
                  <span className="quick-chip-name">{item.name}</span>
                  <span className="quick-chip-comp">{item.comp}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="platform-hero-actions flagship-actions">
            <button className="btn btn-primary btn-hero-cta" onClick={() => onSelectAlgo('quick-sort')}>
              <PlayIcon size={14} />
              <span>Launch Studio</span>
            </button>
            <button className="btn btn-secondary btn-hero-cta" onClick={() => setActiveTab('duel')}>
              <span>⚔️ Battle Arena</span>
            </button>
            <button className="btn btn-secondary btn-hero-cta" onClick={() => setActiveTab('matrix')}>
              <span>Big-O Matrix</span>
              <ArrowRightIcon size={13} />
            </button>
          </div>

          {/* Engineering Metrics Strip */}
          <div className="hero-metrics-strip">
            <div className="metric-chip">
              <span className="metric-num font-mono">19</span>
              <span className="metric-tag">Interactive Modules</span>
            </div>
            <div className="metric-chip">
              <span className="metric-num font-mono">5</span>
              <span className="metric-tag">Language Targets</span>
            </div>
            <div className="metric-chip">
              <span className="metric-num font-mono">O(1) → O(n²)</span>
              <span className="metric-tag">Complexity Bounds</span>
            </div>
            <div className="metric-chip">
              <span className="metric-num font-mono">100%</span>
              <span className="metric-tag">Dynamic Custom Arrays</span>
            </div>
          </div>
        </div>

        {/* ── 2. Interactive Flagship DSA Console Sandbox ── */}
        <div className="hero-sandbox-card flagship-console-card">
          <div className="sandbox-terminal-bar">
            <div className="terminal-dots">
              <span className="dot dot-red" />
              <span className="dot dot-yellow" />
              <span className="dot dot-green" />
            </div>

            {/* Mode Switcher */}
            <div className="sandbox-mode-switcher">
              <button
                className={`mode-btn ${heroMode === 'quick' ? 'active' : ''}`}
                onClick={() => handleSwitchHeroMode('quick')}
              >
                Quick Sort
              </button>
              <button
                className={`mode-btn ${heroMode === 'bubble' ? 'active' : ''}`}
                onClick={() => handleSwitchHeroMode('bubble')}
              >
                Bubble Sort
              </button>
              <button
                className={`mode-btn ${heroMode === 'binary' ? 'active' : ''}`}
                onClick={() => handleSwitchHeroMode('binary')}
              >
                Binary Search
              </button>
            </div>

            <div className="sandbox-controls">
              <button className="btn btn-sm btn-icon sandbox-action-btn" onClick={shuffleHero} title="Shuffle Elements">
                <ShuffleIcon size={13} />
              </button>
              <button className="btn btn-sm btn-primary sandbox-play-btn" onClick={runHeroAnimation}>
                {heroSorting ? <PauseIcon size={12} /> : <PlayIcon size={12} />}
                <span>{heroSorting ? 'Pause' : 'Run'}</span>
              </button>
            </div>
          </div>

          {/* Sandbox Live Canvas */}
          <div className="sandbox-canvas">
            {heroArray.map((val, idx) => {
              const isI = idx === heroActiveIdx.i;
              const isJ = idx === heroActiveIdx.j;
              const isPivot = idx === heroActiveIdx.pivot;
              const isActive = isI || isJ || isPivot;

              return (
                <div key={idx} className="sandbox-bar-col">
                  <div
                    className={`sandbox-bar ${isActive ? 'active' : ''} ${isPivot ? 'bar-pivot' : ''}`}
                    style={{ height: `${Math.max(12, val)}%` }}
                  />
                  <span className="sandbox-val font-mono">{val}</span>
                  {isI && <span className="sandbox-ptr-tag tag-i">i</span>}
                  {isJ && <span className="sandbox-ptr-tag tag-j">j</span>}
                  {isPivot && <span className="sandbox-ptr-tag tag-pivot">pivot</span>}
                </div>
              );
            })}
          </div>

          {/* Sandbox Telemetry Footer */}
          <div className="sandbox-footer">
            <div className="sandbox-telemetry">
              <span className="telemetry-pill">
                <span className="pill-name">Step:</span>
                <span className="pill-val font-mono">{heroStats.step}</span>
              </span>
              <span className="telemetry-pill">
                <span className="pill-name">Comparisons:</span>
                <span className="pill-val font-mono">{heroStats.comps}</span>
              </span>
              <span className="telemetry-pill">
                <span className="pill-name">Swaps:</span>
                <span className="pill-val font-mono">{heroStats.swaps}</span>
              </span>
            </div>

            <button
              className="sandbox-open-link"
              onClick={() => onSelectAlgo(heroMode === 'binary' ? 'binary-search' : heroMode === 'quick' ? 'quick-sort' : 'bubble-sort')}
            >
              <span>Inspect in Full Studio</span>
              <ArrowRightIcon size={11} />
            </button>
          </div>
        </div>
      </section>

      {/* ── 3. High-Impact Bento Feature Grid ── */}
      <section className="bento-showcase-grid">
        {/* Bento Card 1: Live Battle Arena Teaser */}
        <div className="bento-card bento-card-duel" onClick={() => setActiveTab('duel')}>
          <div className="bento-card-header">
            <span className="bento-tag tag-red">⚔️ LIVE PERFORMANCE RACE</span>
            <span className="bento-action-arrow">Explore Arena ➔</span>
          </div>
          <h3 className="bento-title">Algorithm Battle Arena</h3>
          <p className="bento-desc">
            Race two algorithms head-to-head on identical arrays. Watch O(n log n) Quick Sort outperform O(n²) Bubble Sort in real-time execution.
          </p>
          <div className="bento-duel-preview">
            <div className="duel-lane-mini">
              <div className="lane-header-mini">
                <span className="lane-name">Bubble Sort</span>
                <span className="lane-comp-bad font-mono">O(n²)</span>
              </div>
              <div className="lane-bar-track">
                <div className="lane-progress-fill fill-bad" style={{ width: '38%' }} />
              </div>
            </div>
            <div className="duel-lane-mini">
              <div className="lane-header-mini">
                <span className="lane-name">Quick Sort</span>
                <span className="lane-comp-good font-mono">O(n log n)</span>
              </div>
              <div className="lane-bar-track">
                <div className="lane-progress-fill fill-good" style={{ width: '92%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Bento Card 2: Multi-Language Code Engine */}
        <div className="bento-card bento-card-code">
          <div className="bento-card-header">
            <span className="bento-tag tag-blue">⚡ 5 LANGUAGE TARGETS</span>
            <div className="bento-lang-pills">
              {LANG_OPTIONS.map(l => (
                <span
                  key={l.id}
                  className={`bento-lang-dot ${selectedLang === l.id ? 'active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); setSelectedLang(l.id); }}
                >
                  {l.label}
                </span>
              ))}
            </div>
          </div>
          <h3 className="bento-title">Synchronized Code Stepper</h3>
          <p className="bento-desc">
            Every pointer swap illuminates the matching line of source code. Study production implementations across Python, C, C++, Java, and JavaScript.
          </p>
          <div className="bento-code-snippet font-mono">
            <span className="code-kw">def</span> <span className="code-fn">quick_sort</span>(arr, low, high):<br />
            &nbsp;&nbsp;<span className="code-kw">if</span> low &lt; high:<br />
            &nbsp;&nbsp;&nbsp;&nbsp;pivot = partition(arr, low, high) <span className="code-active-line"># ◀ CURRENT STEP</span>
          </div>
        </div>

        {/* Bento Card 3: Dynamic Memory Models */}
        <div className="bento-card bento-card-memory">
          <div className="bento-card-header">
            <span className="bento-tag tag-green">📦 REAL DATA STRUCTURES</span>
          </div>
          <h3 className="bento-title">Pointer Memory Models</h3>
          <p className="bento-desc">
            Visualize contiguous array buffers, circular queues with modulo wrap-around, and binary min-heaps with animated vector tree branches.
          </p>
          <div className="bento-ds-mini-tags">
            <span className="ds-pill">Stack (LIFO)</span>
            <span className="ds-pill">Queue (FIFO)</span>
            <span className="ds-pill">Circular Ring Buffer</span>
            <span className="ds-pill">Binary Min-Heap</span>
            <span className="ds-pill">Linked Lists</span>
          </div>
        </div>
      </section>

      {/* ── 4. Segmented Master Navigation Bar ── */}
      <div className="platform-view-tabs-wrapper">
        <div className="platform-view-tabs">
          <button
            className={`platform-tab ${activeTab === 'catalog' ? 'active' : ''}`}
            onClick={() => setActiveTab('catalog')}
          >
            <span>Algorithm Directory</span>
            <span className="tab-count-badge">{ALGORITHMS.length}</span>
          </button>
          <button
            className={`platform-tab ${activeTab === 'tracks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tracks')}
          >
            <span>Curriculum Tracks</span>
            <span className="tab-count-badge">{LEARNING_TRACKS.length}</span>
          </button>
          <button
            className={`platform-tab ${activeTab === 'duel' ? 'active' : ''}`}
            onClick={() => setActiveTab('duel')}
          >
            <span>⚔️ Battle Arena</span>
            <span className="tab-glow-badge">LIVE RACE</span>
          </button>
          <button
            className={`platform-tab ${activeTab === 'matrix' ? 'active' : ''}`}
            onClick={() => setActiveTab('matrix')}
          >
            <span>Big-O Matrix</span>
          </button>
          <button
            className={`platform-tab ${activeTab === 'growth' ? 'active' : ''}`}
            onClick={() => setActiveTab('growth')}
          >
            <span>Growth Calculator</span>
          </button>
        </div>
      </div>

      {/* ── View: Algorithm Battle Arena ── */}
      {activeTab === 'duel' && (
        <section className="duel-arena-section">
          <AlgorithmDuel />
        </section>
      )}

      {/* ── 5. View A: Algorithm Directory & Search ── */}
      {activeTab === 'catalog' && (
        <section className="catalog-section">
          <div className="catalog-toolbar">
            <div className="category-tabs">
              <button
                className={`category-tab ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => setActiveCategory('all')}
              >
                All Modules ({ALGORITHMS.length})
              </button>
              {Object.entries(CATEGORIES).map(([key, cat]) => {
                const count = ALGORITHMS.filter(a => a.category === key).length;
                return (
                  <button
                    key={key}
                    className={`category-tab ${activeCategory === key ? 'active' : ''}`}
                    onClick={() => setActiveCategory(key)}
                  >
                    <span>{cat.label} ({count})</span>
                  </button>
                );
              })}
            </div>

            <div className="search-box-compact">
              <SearchIcon size={14} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Filter algorithms (e.g. quick, O(log n), LIFO)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="search-clear" onClick={() => setSearchQuery('')}>✕</button>
              )}
            </div>
          </div>

          <div className="compact-grid">
            {filteredAlgos.length === 0 ? (
              <div className="no-results-compact">
                <p>No algorithms found matching "{searchQuery}"</p>
                <button className="btn btn-sm btn-secondary" onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}>
                  Clear Filter
                </button>
              </div>
            ) : (
              filteredAlgos.map(algo => {
                const catLabel = CATEGORIES[algo.category]?.label || algo.category;
                const catColor = CATEGORY_COLORS[algo.category] || '#38bdf8';

                return (
                  <div
                    key={algo.slug}
                    className="compact-card"
                    onClick={() => onSelectAlgo(algo.slug)}
                  >
                    <div className="compact-card-top">
                      <div className="compact-card-title-group">
                        <span className="compact-card-glyph">{getAlgoIcon(algo.slug, 16)}</span>
                        <span className="compact-card-name">{algo.name}</span>
                      </div>
                      <span className="compact-card-cat" style={{ color: catColor, borderColor: `${catColor}33`, background: `${catColor}12` }}>
                        {catLabel}
                      </span>
                    </div>

                    <p className="compact-card-desc">{algo.description}</p>

                    <div className="compact-card-bottom">
                      <div className="compact-tags">
                        <span className="tag-time font-mono">{algo.timeComplexity.average}</span>
                        <span className="tag-space font-mono">Space {algo.spaceComplexity}</span>
                      </div>
                      <span className="compact-arrow">
                        <ArrowRightIcon size={13} />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}

      {/* ── 6. View B: Structured Curriculum Tracks ── */}
      {activeTab === 'tracks' && (
        <section className="learning-tracks-section">
          <div className="section-header-row">
            <div>
              <h2 className="section-title">Structured Curriculum Tracks</h2>
              <p className="section-subtitle">Sequential learning progressions structured for university coursework and technical interview prep.</p>
            </div>
          </div>

          <div className="tracks-grid">
            {LEARNING_TRACKS.map((track) => {
              const trackAlgos = track.algorithms.map(slug => ALGORITHMS.find(a => a.slug === slug)).filter(Boolean);
              return (
                <div key={track.id} className="track-card">
                  <div className="track-card-top-bar">
                    <div className="track-index-badge">{track.trackNum}</div>
                    <div className="track-meta-badges">
                      <span className="track-difficulty" style={{ color: track.diffColor, borderColor: `${track.diffColor}44`, background: `${track.diffColor}15` }}>
                        {track.difficulty}
                      </span>
                    </div>
                  </div>

                  <h3 className="track-title">{track.title}</h3>
                  <p className="track-desc">{track.description}</p>

                  {/* Algorithms in this track */}
                  <div className="track-modules-list">
                    {trackAlgos.map(algo => (
                      <div
                        key={algo.slug}
                        className="track-module-chip"
                        onClick={() => onSelectAlgo(algo.slug)}
                        title={`Visualize ${algo.name}`}
                      >
                        <div className="track-module-title-group">
                          <span className="track-module-glyph">{getAlgoIcon(algo.slug, 14)}</span>
                          <span className="module-name">{algo.name}</span>
                        </div>
                        <span className="module-comp font-mono">{algo.timeComplexity.average}</span>
                      </div>
                    ))}
                  </div>

                  <div className="track-card-footer">
                    <span className="track-time-est">⏱ {track.timeEst}</span>
                    <button
                      className="btn btn-sm btn-primary track-start-btn"
                      onClick={() => onSelectAlgo(trackAlgos[0]?.slug || 'bubble-sort')}
                    >
                      <span>Start Track</span>
                      <ArrowRightIcon size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── 7. View C: Big-O Complexity Matrix ── */}
      {activeTab === 'matrix' && (
        <section className="matrix-section">
          <div className="section-header-row">
            <div>
              <h2 className="section-title">Algorithmic Complexity Matrix</h2>
              <p className="section-subtitle">Theoretical bounds, auxiliary memory constraints, and stability guarantees across all 19 modules.</p>
            </div>
          </div>

          <div className="matrix-table-container">
            <table className="matrix-table">
              <thead>
                <tr>
                  <th>Algorithm</th>
                  <th>Category</th>
                  <th>Best Time</th>
                  <th>Average Time</th>
                  <th>Worst Time</th>
                  <th>Space</th>
                  <th>Stability</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {ALGORITHMS.map(algo => {
                  const catLabel = CATEGORIES[algo.category]?.label || algo.category;
                  const catColor = CATEGORY_COLORS[algo.category] || '#38bdf8';
                  return (
                    <tr key={algo.slug} className="matrix-row">
                      <td className="matrix-algo-name">{algo.name}</td>
                      <td>
                        <span className="matrix-cat-tag" style={{ color: catColor, borderColor: `${catColor}33` }}>
                          {catLabel}
                        </span>
                      </td>
                      <td className="matrix-code-cell">{algo.timeComplexity.best}</td>
                      <td className="matrix-code-cell font-highlight">{algo.timeComplexity.average}</td>
                      <td className="matrix-code-cell">{algo.timeComplexity.worst}</td>
                      <td className="matrix-code-cell">{algo.spaceComplexity}</td>
                      <td>
                        {algo.stable !== undefined ? (
                          <span className={`matrix-status-pill ${algo.stable ? 'stable' : 'unstable'}`}>
                            {algo.stable ? 'Stable' : 'Unstable'}
                          </span>
                        ) : (
                          <span className="matrix-status-pill na">N/A</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => onSelectAlgo(algo.slug)}
                        >
                          Launch Studio →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ── 8. View D: Interactive Big-O Growth Calculator ── */}
      {activeTab === 'growth' && (
        <section className="growth-section">
          <div className="section-header-row">
            <div>
              <h2 className="section-title">Big-O Scalability & Operation Curves</h2>
              <p className="section-subtitle">Adjust problem scale (N) to observe why logarithmic and divide-and-conquer algorithms out-scale quadratic algorithms.</p>
            </div>
          </div>

          <div className="growth-card">
            <div className="growth-slider-bar">
              <span className="growth-slider-label">Dataset Size (N = {sliderN}):</span>
              <input
                type="range"
                min={4}
                max={1024}
                step={4}
                value={sliderN}
                onChange={e => setSliderN(parseInt(e.target.value))}
                className="slider growth-slider"
              />
              <span className="growth-slider-val font-mono">{sliderN} elements</span>
            </div>

            <div className="growth-metrics-grid">
              {complexityResults.map(item => (
                <div key={item.name} className="growth-metric-box">
                  <span className="growth-comp-tag font-mono">{item.name}</span>
                  <span className="growth-label">{item.label}</span>
                  <div className={`growth-ops-count ${item.class} font-mono`}>
                    {item.ops.toLocaleString()} ops
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 9. Multi-Language Code Synchronization Engine ── */}
      <section className="lang-showcase-section">
        <div className="lang-showcase-card">
          <div className="lang-showcase-content">
            <div className="hero-compact-badge">Multi-Target Synchronization</div>
            <h3 className="showcase-title">Learn Algorithms in Your Preferred Language</h3>
            <p className="showcase-desc">
              Every visualization step traces synchronized source code across five runtime targets. Seamlessly switch between Python, C, C++, Java, and JavaScript without losing your visualizer state.
            </p>
            <div className="lang-pills-row">
              {LANG_OPTIONS.map(l => {
                const Icon = l.icon;
                const isActive = selectedLang.toLowerCase() === l.id.toLowerCase();
                return (
                  <span
                    key={l.id}
                    className={`lang-select-chip ${isActive ? 'active' : ''}`}
                    onClick={() => setSelectedLang(l.id)}
                  >
                    <Icon size={15} />
                    <span>{l.label}</span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
