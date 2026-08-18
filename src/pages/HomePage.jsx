import { useState, useMemo, useEffect, useRef } from 'react';
import { ALGORITHMS, CATEGORIES } from '../data/algorithms.js';
import AlgorithmDuel from '../components/AlgorithmDuel.jsx';
import {
  SearchIcon, ArrowRightIcon, PlayIcon, PauseIcon, ShuffleIcon,
  PythonIcon, CIcon, CppIcon, JavaIcon, JSIcon, getAlgoIcon
} from '../components/Icons.jsx';

const LANG_OPTIONS = [
  { id: 'python', label: 'Python', icon: PythonIcon, ext: 'py' },
  { id: 'c',      label: 'C',      icon: CIcon,      ext: 'c' },
  { id: 'cpp',    label: 'C++',    icon: CppIcon,    ext: 'cpp' },
  { id: 'java',   label: 'Java',   icon: JavaIcon,   ext: 'java' },
  { id: 'js',     label: 'JavaScript', icon: JSIcon, ext: 'js' },
];

const FEATURED_CHIPS = [
  { slug: 'quick-sort', name: 'Quick Sort', comp: 'O(n log n)' },
  { slug: 'binary-search', name: 'Binary Search', comp: 'O(log n)' },
  { slug: 'dijkstra', name: "Dijkstra's", comp: 'O(E log V)' },
  { slug: 'binary-heap', name: 'Min-Heap', comp: 'O(log n)' },
  { slug: 'circular-queue', name: 'Circular Queue', comp: 'O(1)' },
  { slug: 'bst', name: 'BST', comp: 'O(log n)' },
];

const LEARNING_TRACKS = [
  {
    id: 'sorting-foundations',
    trackNum: '01',
    title: 'Sorting Fundamentals',
    category: 'sorting',
    description: 'Master iterative comparisons, adjacent swaps, min-element selection, and progressive insertion mechanics.',
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
    description: 'Learn recursive array partitioning, logarithmic merges, and binary min-heap sift-up/down balancing.',
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
    description: 'Compare linear memory sweeps against logarithmic interval bisection in sorted datasets.',
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
    diffColor: '#8b5cf6',
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
    diffColor: '#3b82f6',
    timeEst: '45 mins',
    algorithms: ['bfs', 'dfs', 'dijkstra'],
  },
  {
    id: 'advanced-data-structures',
    trackNum: '07',
    title: 'Priority Heaps & Hash Tables',
    category: 'datastructures',
    description: 'Build binary min-heaps with vector branches and hash tables with separate chaining collisions.',
    difficulty: 'Intermediate',
    diffColor: '#f59e0b',
    timeEst: '35 mins',
    algorithms: ['binary-heap', 'hash-table'],
  },
];

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
  sorting:        '#3b82f6',
  searching:      '#0284c7',
  datastructures: '#6366f1',
  graphs:         '#10b981',
  trees:          '#8b5cf6',
};

function getComplexityColor(comp = '') {
  if (comp.includes('O(1)') || comp.includes('O(log n)')) return '#10b981';
  if (comp.includes('O(n log n)') || comp === 'O(n)') return '#3b82f6';
  if (comp.includes('O(n²)') || comp.includes('O(V') || comp.includes('O(E')) return '#f59e0b';
  return '#8b5cf6';
}

export default function HomePage({ onSelectAlgo }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'tracks' | 'duel' | 'matrix' | 'growth'
  const [selectedLang, setSelectedLang] = useState('python');
  const [sliderN, setSliderN] = useState(64);

  // ── Hero Interactive DSA Console State ──
  const [heroMode, setHeroMode] = useState('quick'); // 'quick' | 'bubble' | 'binary'
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
      }, 90);
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
      // Quick sort simulation
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
      }, 80);
    }
  };

  useEffect(() => {
    return () => clearInterval(heroTimerRef.current);
  }, []);

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
    <div className="home-layout">
      {/* ── 1. Clean Minimal Hero Workbench ── */}
      <section className="hero-workbench">
        {/* Left: Authoritative Value Proposition */}
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="eyebrow-dot" />
            <span className="eyebrow-text">ALGOFLOWX • INTERACTIVE DSA PLATFORM</span>
          </div>

          <h1 className="hero-title">
            Visualize Data Structures &amp; Algorithms
          </h1>

          <p className="hero-description">
            Step into memory execution. Trace pointer mutations, debug recursion frame-by-frame, and inspect synchronized multi-language source code across 19 interactive engines.
          </p>

          {/* Quick Launch Chips */}
          <div className="hero-chips-bar">
            <span className="chips-label">POPULAR:</span>
            <div className="chips-list">
              {FEATURED_CHIPS.map(chip => (
                <button
                  key={chip.slug}
                  className="chip-btn"
                  onClick={() => onSelectAlgo(chip.slug)}
                >
                  <span className="chip-name">{chip.name}</span>
                  <span className="chip-comp font-mono">{chip.comp}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="hero-actions">
            <button className="btn-hero-primary" onClick={() => onSelectAlgo('quick-sort')}>
              <PlayIcon size={14} />
              <span>Launch Studio</span>
            </button>
            <button className="btn-hero-secondary" onClick={() => setActiveTab('duel')}>
              <span>⚔️ Battle Arena</span>
            </button>
            <button className="btn-hero-ghost" onClick={() => setActiveTab('matrix')}>
              <span>Complexity Matrix →</span>
            </button>
          </div>

          {/* Clean Metric Grid */}
          <div className="hero-metrics-grid">
            <div className="metric-box">
              <span className="metric-val font-mono">19</span>
              <span className="metric-lbl">Visualizers</span>
            </div>
            <div className="metric-box">
              <span className="metric-val font-mono">5</span>
              <span className="metric-lbl">Languages</span>
            </div>
            <div className="metric-box">
              <span className="metric-val font-mono">O(1)→O(n²)</span>
              <span className="metric-lbl">Complexity</span>
            </div>
            <div className="metric-box">
              <span className="metric-val font-mono">100%</span>
              <span className="metric-lbl">Custom Data</span>
            </div>
          </div>
        </div>

        {/* Right: Live Interactive Sandbox Terminal */}
        <div className="hero-sandbox">
          <div className="sandbox-header">
            <div className="window-dots">
              <span className="w-dot dot-r" />
              <span className="w-dot dot-y" />
              <span className="w-dot dot-g" />
            </div>

            <div className="sandbox-tabs">
              <button
                className={`s-tab ${heroMode === 'quick' ? 'active' : ''}`}
                onClick={() => handleSwitchHeroMode('quick')}
              >
                Quick
              </button>
              <button
                className={`s-tab ${heroMode === 'bubble' ? 'active' : ''}`}
                onClick={() => handleSwitchHeroMode('bubble')}
              >
                Bubble
              </button>
              <button
                className={`s-tab ${heroMode === 'binary' ? 'active' : ''}`}
                onClick={() => handleSwitchHeroMode('binary')}
              >
                Binary
              </button>
            </div>

            <div className="sandbox-btns">
              <button className="s-btn-icon" onClick={shuffleHero} title="Shuffle Data">
                <ShuffleIcon size={12} />
              </button>
              <button className="s-btn-play" onClick={runHeroAnimation}>
                {heroSorting ? <PauseIcon size={11} /> : <PlayIcon size={11} />}
                <span>{heroSorting ? 'Pause' : 'Run'}</span>
              </button>
            </div>
          </div>

          {/* Sandbox Stage */}
          <div className="sandbox-stage">
            {heroArray.map((val, idx) => {
              const isI = idx === heroActiveIdx.i;
              const isJ = idx === heroActiveIdx.j;
              const isPivot = idx === heroActiveIdx.pivot;
              const isActive = isI || isJ || isPivot;

              return (
                <div key={idx} className="stage-col">
                  <div
                    className={`stage-bar ${isActive ? 'active' : ''} ${isPivot ? 'pivot' : ''}`}
                    style={{ height: `${Math.max(12, val)}%` }}
                  />
                  <span className="stage-val font-mono">{val}</span>
                  {isI && <span className="stage-ptr ptr-i">i</span>}
                  {isJ && <span className="stage-ptr ptr-j">j</span>}
                  {isPivot && <span className="stage-ptr ptr-p">p</span>}
                </div>
              );
            })}
          </div>

          {/* Sandbox Footer */}
          <div className="sandbox-footer">
            <div className="telemetry-group">
              <span className="t-pill">Step <b className="font-mono">{heroStats.step}</b></span>
              <span className="t-pill">Comps <b className="font-mono">{heroStats.comps}</b></span>
              <span className="t-pill">Swaps <b className="font-mono">{heroStats.swaps}</b></span>
            </div>
            <button
              className="open-studio-btn"
              onClick={() => onSelectAlgo(heroMode === 'binary' ? 'binary-search' : heroMode === 'quick' ? 'quick-sort' : 'bubble-sort')}
            >
              <span>Inspect in Studio</span>
              <ArrowRightIcon size={11} />
            </button>
          </div>
        </div>
      </section>

      {/* ── 2. Segmented Navigation Bar ── */}
      <nav className="platform-nav-bar">
        <div className="nav-segments">
          <button
            className={`nav-segment ${activeTab === 'catalog' ? 'active' : ''}`}
            onClick={() => setActiveTab('catalog')}
          >
            <span>Algorithm Directory</span>
            <span className="seg-badge">{ALGORITHMS.length}</span>
          </button>
          <button
            className={`nav-segment ${activeTab === 'tracks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tracks')}
          >
            <span>Curriculum Tracks</span>
            <span className="seg-badge">{LEARNING_TRACKS.length}</span>
          </button>
          <button
            className={`nav-segment ${activeTab === 'duel' ? 'active' : ''}`}
            onClick={() => setActiveTab('duel')}
          >
            <span>⚔️ Battle Arena</span>
            <span className="seg-live">LIVE RACE</span>
          </button>
          <button
            className={`nav-segment ${activeTab === 'matrix' ? 'active' : ''}`}
            onClick={() => setActiveTab('matrix')}
          >
            <span>Big-O Matrix</span>
          </button>
          <button
            className={`nav-segment ${activeTab === 'growth' ? 'active' : ''}`}
            onClick={() => setActiveTab('growth')}
          >
            <span>Growth Curves</span>
          </button>
        </div>
      </nav>

      {/* ── 3. View: Battle Arena ── */}
      {activeTab === 'duel' && (
        <section className="section-block">
          <AlgorithmDuel />
        </section>
      )}

      {/* ── 4. View: Algorithm Directory ── */}
      {activeTab === 'catalog' && (
        <section className="section-block">
          <div className="catalog-header-bar">
            {/* Category Filter Pills */}
            <div className="cat-filter-pills">
              <button
                className={`filter-pill ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => setActiveCategory('all')}
              >
                All ({ALGORITHMS.length})
              </button>
              {Object.entries(CATEGORIES).map(([key, cat]) => {
                const count = ALGORITHMS.filter(a => a.category === key).length;
                return (
                  <button
                    key={key}
                    className={`filter-pill ${activeCategory === key ? 'active' : ''}`}
                    onClick={() => setActiveCategory(key)}
                  >
                    <span>{cat.label} ({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Clean Search Input */}
            <div className="search-wrapper">
              <SearchIcon size={14} className="search-ico" />
              <input
                type="text"
                className="search-field"
                placeholder="Search algorithms (e.g. quick, O(log n), queue)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="search-x" onClick={() => setSearchQuery('')}>✕</button>
              )}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="algo-cards-grid">
            {filteredAlgos.length === 0 ? (
              <div className="empty-results">
                <p>No algorithms match "{searchQuery}"</p>
                <button className="btn-hero-secondary" onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}>
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredAlgos.map(algo => {
                const catLabel = CATEGORIES[algo.category]?.label || algo.category;

                return (
                  <div
                    key={algo.slug}
                    className="algo-card"
                    onClick={() => onSelectAlgo(algo.slug)}
                  >
                    <div className="card-top-bar">
                      <div className="card-icon-badge">
                        {getAlgoIcon(algo.slug, 15)}
                      </div>
                      <span className="card-complexity-pill font-mono">
                        {algo.timeComplexity.average}
                      </span>
                    </div>

                    <div className="card-body">
                      <h3 className="card-title">{algo.name}</h3>
                      <span className="card-cat-label font-mono">{catLabel}</span>
                      <p className="card-desc">{algo.description}</p>
                    </div>

                    <div className="card-footer-row">
                      <span className="card-space-pill font-mono">Space {algo.spaceComplexity}</span>
                      <span className="card-action-trigger">
                        <span className="trigger-label">Visualize</span>
                        <span className="trigger-arrow-box">
                          <ArrowRightIcon size={11} className="trigger-arrow" />
                        </span>
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}

      {/* ── 5. View: Curriculum Tracks ── */}
      {activeTab === 'tracks' && (
        <section className="section-block">
          <div className="block-title-row">
            <h2 className="block-heading">Curriculum Tracks</h2>
            <p className="block-sub">Structured sequential learning pathways for semester exams and technical interview prep.</p>
          </div>

          <div className="tracks-grid-layout">
            {LEARNING_TRACKS.map(track => {
              const trackAlgos = track.algorithms.map(slug => ALGORITHMS.find(a => a.slug === slug)).filter(Boolean);
              return (
                <div key={track.id} className="track-box">
                  <div className="track-header-row">
                    <span className="track-num font-mono">{track.trackNum}</span>
                    <span className="track-diff-pill" style={{ color: track.diffColor, borderColor: `${track.diffColor}44`, background: `${track.diffColor}12` }}>
                      {track.difficulty}
                    </span>
                  </div>

                  <h3 className="track-box-title">{track.title}</h3>
                  <p className="track-box-desc">{track.description}</p>

                  <div className="track-items-list">
                    {trackAlgos.map(algo => (
                      <div
                        key={algo.slug}
                        className="track-algo-row"
                        onClick={() => onSelectAlgo(algo.slug)}
                      >
                        <div className="algo-row-left">
                          <span className="algo-glyph">{getAlgoIcon(algo.slug, 13)}</span>
                          <span className="algo-name">{algo.name}</span>
                        </div>
                        <span className="algo-comp font-mono">{algo.timeComplexity.average}</span>
                      </div>
                    ))}
                  </div>

                  <div className="track-footer-row">
                    <span className="track-time font-mono">⏱ {track.timeEst}</span>
                    <button
                      className="track-start-action"
                      onClick={() => onSelectAlgo(trackAlgos[0]?.slug || 'bubble-sort')}
                    >
                      <span>Start Track</span>
                      <ArrowRightIcon size={11} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── 6. View: Big-O Matrix ── */}
      {activeTab === 'matrix' && (
        <section className="section-block">
          <div className="block-title-row">
            <h2 className="block-heading">Complexity Matrix</h2>
            <p className="block-sub">Comprehensive theoretical bounds and auxiliary space constraints for all 19 modules.</p>
          </div>

          <div className="matrix-table-wrap">
            <table className="clean-table">
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
                  const catColor = CATEGORY_COLORS[algo.category] || '#3b82f6';
                  return (
                    <tr key={algo.slug}>
                      <td className="tbl-name">{algo.name}</td>
                      <td>
                        <span className="tbl-cat" style={{ color: catColor, borderColor: `${catColor}33` }}>
                          {catLabel}
                        </span>
                      </td>
                      <td className="tbl-code font-mono">{algo.timeComplexity.best}</td>
                      <td className="tbl-code tbl-highlight font-mono">{algo.timeComplexity.average}</td>
                      <td className="tbl-code font-mono">{algo.timeComplexity.worst}</td>
                      <td className="tbl-code font-mono">{algo.spaceComplexity}</td>
                      <td>
                        {algo.stable !== undefined ? (
                          <span className={`tbl-status ${algo.stable ? 'is-stable' : 'is-unstable'}`}>
                            {algo.stable ? 'Stable' : 'Unstable'}
                          </span>
                        ) : (
                          <span className="tbl-status is-na">N/A</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn-tbl-launch"
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

      {/* ── 7. View: Growth Curves ── */}
      {activeTab === 'growth' && (
        <section className="section-block">
          <div className="block-title-row">
            <h2 className="block-heading">Big-O Scalability Calculator</h2>
            <p className="block-sub">Adjust problem scale (N) to observe operation count divergence across time complexities.</p>
          </div>

          <div className="growth-box">
            <div className="slider-row">
              <span className="slider-lbl">Scale (N = {sliderN}):</span>
              <input
                type="range"
                min={4}
                max={1024}
                step={4}
                value={sliderN}
                onChange={e => setSliderN(parseInt(e.target.value))}
                className="slider-range"
              />
              <span className="slider-val font-mono">{sliderN} items</span>
            </div>

            <div className="growth-cards-row">
              {complexityResults.map(item => (
                <div key={item.name} className="growth-stat-card">
                  <span className="growth-bound font-mono">{item.name}</span>
                  <span className="growth-name">{item.label}</span>
                  <div className={`growth-count font-mono ${item.class}`}>
                    {item.ops.toLocaleString()} ops
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 8. Feature Spotlight Bento Grid ── */}
      <section className="spotlight-bento-grid">
        <div className="bento-feature-box" onClick={() => setActiveTab('duel')}>
          <div className="bento-box-top">
            <span className="bento-tag tag-blue">⚔️ PERFORMANCE RACE</span>
            <span className="bento-open-arrow">Open ➔</span>
          </div>
          <h4 className="bento-box-title">Algorithm Battle Arena</h4>
          <p className="bento-box-sub">
            Race two algorithms side-by-side on identical arrays to see O(n log n) vs O(n²) performance.
          </p>
          <div className="bento-duel-bars">
            <div className="d-lane">
              <div className="d-lane-head">
                <span>Bubble Sort</span>
                <span className="d-bad font-mono">O(n²)</span>
              </div>
              <div className="d-track"><div className="d-fill fill-bad" style={{ width: '38%' }} /></div>
            </div>
            <div className="d-lane">
              <div className="d-lane-head">
                <span>Quick Sort</span>
                <span className="d-good font-mono">O(n log n)</span>
              </div>
              <div className="d-track"><div className="d-fill fill-good" style={{ width: '92%' }} /></div>
            </div>
          </div>
        </div>

        <div className="bento-feature-box">
          <div className="bento-box-top">
            <span className="bento-tag tag-blue">⚡ 5 LANGUAGE STEPPERS</span>
            <div className="bento-lang-row">
              {LANG_OPTIONS.map(l => (
                <span
                  key={l.id}
                  className={`b-lang-pill ${selectedLang === l.id ? 'active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); setSelectedLang(l.id); }}
                >
                  {l.label}
                </span>
              ))}
            </div>
          </div>
          <h4 className="bento-box-title">Synchronized Code Steppers</h4>
          <p className="bento-box-sub">
            Line-by-line synchronized execution in Python, C, C++, Java, and JavaScript.
          </p>
          <div className="bento-code-box font-mono">
            <span className="c-kw">def</span> <span className="c-fn">quick_sort</span>(arr, low, high):<br />
            &nbsp;&nbsp;<span className="c-kw">if</span> low &lt; high:<br />
            &nbsp;&nbsp;&nbsp;&nbsp;p = partition(arr, low, high) <span className="c-active"># ◀ CURRENT</span>
          </div>
        </div>

        <div className="bento-feature-box">
          <div className="bento-box-top">
            <span className="bento-tag tag-green">📦 DATA STRUCTURES</span>
          </div>
          <h4 className="bento-box-title">Pointer Memory Models</h4>
          <p className="bento-box-sub">
            Inspect contiguous buffers, circular ring buffers, min-heaps, and linked list chains.
          </p>
          <div className="bento-ds-pills">
            <span className="ds-pill">Stack (LIFO)</span>
            <span className="ds-pill">Queue (FIFO)</span>
            <span className="ds-pill">Circular Buffer</span>
            <span className="ds-pill">Min-Heap</span>
            <span className="ds-pill">Linked Lists</span>
          </div>
        </div>
      </section>
    </div>
  );
}
