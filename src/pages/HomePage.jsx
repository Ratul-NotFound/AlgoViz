import { useState, useMemo, useEffect, useRef } from 'react';
import { ALGORITHMS, CATEGORIES } from '../data/algorithms.js';
import { C_LESSONS, C_MODULES } from '../data/cLessons.js';
import AlgorithmDuel from '../components/AlgorithmDuel.jsx';
import {
  SearchIcon, ArrowRightIcon, PlayIcon, PauseIcon, ShuffleIcon,
  PythonIcon, CIcon, CppIcon, JavaIcon, JSIcon, getAlgoIcon,
  BookmarkIcon, CheckCircleIcon
} from '../components/Icons.jsx';
import { useAuth } from '../context/AuthContext.jsx';

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

export default function HomePage({ onSelectAlgo, onOpenLearnC, onOpenPythonModal, initialTab = 'catalog' }) {
  const { isBookmarked, toggleBookmark, isCompleted, isAuthenticated, openAuthModal } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(initialTab); // 'catalog' | 'academy-preview' | 'duel' | 'matrix'
  const [showAllAlgos, setShowAllAlgos] = useState(false);
  const [expandedCourse, setExpandedCourse] = useState('c'); // 'c' | 'python' | 'java' | 'cpp' | null
  const [expandedModule, setExpandedModule] = useState('module-1'); // moduleId or null for 2-tier disclosure
  const [selectedLang, setSelectedLang] = useState('python');
  const [sliderN, setSliderN] = useState(64);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

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

  const displayedAlgos = useMemo(() => {
    if (searchQuery || activeCategory !== 'all' || showAllAlgos) {
      return filteredAlgos;
    }
    return filteredAlgos.slice(0, 8);
  }, [filteredAlgos, searchQuery, activeCategory, showAllAlgos]);

  const complexityResults = useMemo(() => calculateOperations(sliderN), [sliderN]);

  return (
    <div className="home-layout">
      {/* ── 1. World-Class Hero Section ── */}
      <section className="hero-workbench">
        {/* Left: Value Proposition */}
        <div className="hero-content">
          <div className="hero-badge-pill">
            <span className="badge-glow-dot" />
            <span className="badge-pill-text">🎓 C Academy (23 Chapters) &bull; 40+ Interactive Visualizers</span>
          </div>

          <h1 className="hero-title">
            Learn Coding &amp; Master Algorithms Through <span className="hero-highlight-text">Interactive Visuals</span>.
          </h1>

          <p className="hero-description">
            The easy way to learn programming and data structures. Start C coding from scratch with simple visual guides, run real code in your browser, and watch every algorithm step-by-step.
          </p>

          {/* Primary Action Buttons */}
          <div className="hero-actions">
            <button
              className="btn-hero-academy"
              onClick={() => onOpenLearnC && onOpenLearnC('hello-world-intro')}
            >
              🎓 Start Learning C (23 Chapters) &rarr;
            </button>
            <button
              className="btn-hero-primary"
              onClick={() => {
                setActiveTab('catalog');
                const el = document.querySelector('.platform-nav-bar') || document.querySelector('.catalog-header-bar');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              <PlayIcon size={14} />
              <span>Explore 40+ Visualizers</span>
            </button>
          </div>

          {/* Clean Quick Features Pill List */}
          <div className="hero-simple-highlights">
            <div className="simple-highlight-pill">
              <span className="pill-check">✓</span>
              <span>100% Free &amp; Open Access</span>
            </div>
            <div className="simple-highlight-pill">
              <span className="pill-check">✓</span>
              <span>230 Practice Quizzes &amp; Labs</span>
            </div>
            <div className="simple-highlight-pill">
              <span className="pill-check">✓</span>
              <span>In-Browser C Compiler &amp; Sandbox</span>
            </div>
            <div className="simple-highlight-pill">
              <span className="pill-check">✓</span>
              <span>Free Certificate of Completion</span>
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
                Quick Sort
              </button>
              <button
                className={`s-tab ${heroMode === 'bubble' ? 'active' : ''}`}
                onClick={() => handleSwitchHeroMode('bubble')}
              >
                Bubble Sort
              </button>
              <button
                className={`s-tab ${heroMode === 'binary' ? 'active' : ''}`}
                onClick={() => handleSwitchHeroMode('binary')}
              >
                Binary Search
              </button>
            </div>

            <div className="sandbox-btns">
              <button
                className="s-btn-icon"
                onClick={shuffleHero}
                title="Shuffle Data"
              >
                <ShuffleIcon size={12} />
              </button>
              <button
                className="s-btn-play"
                onClick={runHeroAnimation}
                title="Run / Pause Animation"
              >
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

      {/* ── 2. Dual-Mission Gateways (Choose Your Path) ── */}
      <section className="dual-flagship-section">
        <div className="flagship-card card-learn-c" onClick={() => onOpenLearnC && onOpenLearnC('hello-world-intro')}>
          <div className="flagship-top-header">
            <span className="flagship-badge badge-c-learn">🎓 C ACADEMY</span>
            <span className="flagship-pill-ch font-mono">23 CHAPTERS • 230 QUIZZES &amp; LABS</span>
          </div>
          <h2 className="flagship-title">C Programming Academy</h2>
          <p className="flagship-desc">
            Learn pointers, memory layout, structs, and how computers store data with clear visual examples and an in-browser C compiler.
          </p>

          <div className="flagship-code-snippet font-mono">
            <span className="c-kw">int</span> *ptr = &amp;val; <span className="c-cm">/* 0x7ffd14 ➔ 42 */</span>
          </div>

          <div className="flagship-feature-pills">
            <span className="feat-pill">📦 23 Visual Chapters</span>
            <span className="feat-pill">💻 In-Browser Compiler</span>
            <span className="feat-pill">🎓 Gold Certificate</span>
          </div>

          <div className="flagship-action-row">
            <button className="btn-flagship-c">
              <span>Start Chapter 1</span>
              <ArrowRightIcon size={12} />
            </button>
            <span className="flagship-meta-text">100% Free &amp; Interactive</span>
          </div>
        </div>

        <div
          className="flagship-card card-dsa-studio"
          onClick={() => {
            setActiveTab('catalog');
            const el = document.querySelector('.platform-nav-bar') || document.querySelector('.catalog-header-bar');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        >
          <div className="flagship-top-header">
            <span className="flagship-badge badge-dsa-engine">⚡ DSA STUDIO</span>
            <span className="flagship-pill-dsa font-mono">40+ ALGORITHMS • SPEED RACE</span>
          </div>
          <h2 className="flagship-title">Data Structures &amp; Algorithm Visualizer</h2>
          <p className="flagship-desc">
            Watch sorting, searching, trees, and graphs execute step-by-step with real data and Big-O analytics.
          </p>

          <div className="flagship-duel-snippet font-mono">
            <span className="f-good">Quick: O(n log n) ⚡</span> <span className="f-vs">vs</span> <span className="f-bad">Bubble: O(n²)</span>
          </div>

          <div className="flagship-feature-pills">
            <span className="feat-pill">📊 Step Playback</span>
            <span className="feat-pill">⚔️ Speed Race</span>
            <span className="feat-pill">🌐 5 Languages</span>
          </div>

          <div className="flagship-action-row">
            <button className="btn-flagship-dsa">
              <span>Explore Visualizers</span>
              <ArrowRightIcon size={12} />
            </button>
            <span className="flagship-meta-text">40+ Algorithms Available</span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 1: ⚡ DSA VISUALIZER (1. VISUALIZATIONS | 2. BATTLE ARENA | 3. BIG-O)
      ══════════════════════════════════════════════════════════════════ */}
      <section className="section-block algo-studio-section" id="visualizers-section">
        <div className="section-header-row">
          <div className="section-header-left">
            <span className="section-eyebrow font-mono">⚡ DSA VISUALIZER</span>
            <h2 className="section-main-title">DSA Visualizer</h2>
            <p className="section-main-sub">
              Watch algorithms run step-by-step, see variables change in real-time, and race algorithms head-to-head.
            </p>
          </div>
        </div>

        {/* 3 Creative Interactive Flagship Cards with Direct In-Card Unfolding Drawers */}
        <div className="courses-hub-grid dsa-hub-grid">
          {/* Card 1: ⚡ Visualizations (19) */}
          <div
            className={`course-card dsa-flagship-card card-visualizers ${activeTab === 'catalog' ? 'active-course-card drawer-open' : ''}`}
            onClick={() => setActiveTab(curr => curr === 'catalog' ? null : 'catalog')}
          >
            <div className="course-card-top">
              <span className="course-status-pill status-live font-mono">● {ALGORITHMS.length} ALGORITHMS</span>
              <span className="course-badge-ch font-mono">SORT • SEARCH • GRAPH • TREE • DP</span>
            </div>
            
            <div className="flagship-title-row">
              <div className="flagship-icon-badge icon-green">⚡</div>
              <h3 className="course-card-title">Interactive Visualizations</h3>
            </div>

            <p className="course-card-desc">
              Step through Sorting, Searching, Trees, Graphs, and Dynamic Programming with live step-by-step animation.
            </p>

            {/* Creative Micro Visual Graphic Preview */}
            <div className="card-mini-preview preview-bars">
              <div className="mini-bar" style={{ height: '35%', background: '#3b82f6' }} />
              <div className="mini-bar active-bar" style={{ height: '70%', background: '#10b981' }} />
              <div className="mini-bar" style={{ height: '45%', background: '#3b82f6' }} />
              <div className="mini-bar active-bar-swap" style={{ height: '90%', background: '#f59e0b' }} />
              <div className="mini-bar" style={{ height: '60%', background: '#3b82f6' }} />
              <span className="mini-preview-tag font-mono">Step-by-Step Tracing</span>
            </div>

            <div className="course-card-footer">
              <button
                type="button"
                className="btn-course-launch"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab('catalog');
                }}
              >
                <span>⚡ Explore Visualizers</span>
                <ArrowRightIcon size={12} />
              </button>
              <span className="course-click-hint font-mono">
                {activeTab === 'catalog' ? '▲ Close Visualizers' : `▼ Open Visualizers (${ALGORITHMS.length})`}
              </span>
            </div>

            {/* Direct In-Card Unfolded Drawer: Visualizations Catalog */}
            {activeTab === 'catalog' && (
              <div className="card-nested-drawer" onClick={(e) => e.stopPropagation()}>
                <div className="catalog-header-bar">
                  {/* Horizontally Scrollable Category Filter Pills */}
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
                      placeholder="Search algorithms (e.g. quick, O(log n))..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button className="search-x" onClick={() => setSearchQuery('')}>✕</button>
                    )}
                  </div>
                </div>

                {/* Creative Compact Algorithm Showcase Grid */}
                <div className="algo-cards-grid creative-micro-grid">
                  {displayedAlgos.length === 0 ? (
                    <div className="empty-results">
                      <p>No algorithms match "{searchQuery}"</p>
                      <button className="btn-hero-secondary" onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}>
                        Reset Filters
                      </button>
                    </div>
                  ) : (
                    displayedAlgos.map(algo => {
                      const catLabel = CATEGORIES[algo.category]?.label || algo.category;
                      const bookmarked = isBookmarked(algo.slug);
                      const completed = isCompleted(algo.slug);
                      const timeColor = getComplexityColor(algo.timeComplexity.average);

                      return (
                        <div
                          key={algo.slug}
                          className={`micro-algo-tile cat-tile-${algo.category} ${completed ? 'tile-completed' : ''}`}
                          onClick={() => onSelectAlgo(algo.slug)}
                        >
                          {/* Top Row: Icon + Name + Category + Bookmark */}
                          <div className="micro-tile-top">
                            <div className="micro-tile-identity">
                              <div className="micro-tile-icon">
                                {getAlgoIcon(algo.slug, 15)}
                              </div>
                              <div className="micro-tile-names">
                                <h4 className="micro-tile-title">{algo.name}</h4>
                                <span className="micro-tile-cat font-mono">{catLabel}</span>
                              </div>
                            </div>

                            <div className="micro-tile-actions">
                              <button
                                type="button"
                                className={`micro-bookmark-btn ${bookmarked ? 'star-active' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleBookmark(algo.slug);
                                }}
                                title={bookmarked ? 'Remove Bookmark' : 'Bookmark this algorithm'}
                                aria-label="Bookmark"
                              >
                                <BookmarkIcon size={12} filled={bookmarked} />
                              </button>
                            </div>
                          </div>

                          {/* Middle: Micro Metrics Capsule Bar */}
                          <div className="micro-metrics-capsule">
                            <span className="micro-metric-pill font-mono" style={{ color: timeColor }}>
                              <span className="metric-dot" style={{ background: timeColor }} />
                              {algo.timeComplexity.average}
                            </span>
                            <span className="micro-metric-pill font-mono metric-space">
                              💾 {algo.spaceComplexity}
                            </span>
                            {algo.stable && (
                              <span className="micro-metric-pill font-mono metric-stable">
                                ✓ Stable
                              </span>
                            )}
                          </div>

                          {/* Bottom: Fast Micro-Hint + Launch CTA */}
                          <div className="micro-tile-footer">
                            <span className="micro-insight-text font-mono">
                              {algo.stable ? 'Preserves order' : 'In-place partition'}
                            </span>
                            <span className="micro-launch-pill">
                              <span>Visualizer</span>
                              <ArrowRightIcon size={10} className="micro-arrow-icon" />
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Show More / Progressive Disclosure Trigger */}
                {activeCategory === 'all' && !searchQuery && filteredAlgos.length > 8 && (
                  <div className="show-more-row">
                    <button
                      type="button"
                      className="btn-show-more font-mono"
                      onClick={() => setShowAllAlgos(prev => !prev)}
                    >
                      <span>{showAllAlgos ? '▲ Show Top 8 Featured' : `▼ Show All ${ALGORITHMS.length} Algorithms (+${ALGORITHMS.length - 8} more)`}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Card 2: ⚔️ Battle Arena */}
          <div
            className={`course-card dsa-flagship-card card-duel ${activeTab === 'duel' ? 'active-course-card drawer-open' : ''}`}
            onClick={() => setActiveTab(curr => curr === 'duel' ? null : 'duel')}
          >
            <div className="course-card-top">
              <span className="course-status-pill status-soon font-mono">● LIVE DUEL</span>
              <span className="course-badge-py font-mono">SIDE-BY-SIDE SPEED RACE</span>
            </div>

            <div className="flagship-title-row">
              <div className="flagship-icon-badge icon-amber">⚔️</div>
              <h3 className="course-card-title">Algorithm Battle Arena</h3>
            </div>

            <p className="course-card-desc">
              Race QuickSort, MergeSort, BubbleSort, and HeapSort against each other to see which is faster in real-time.
            </p>

            {/* Creative Micro Visual Graphic Preview */}
            <div className="card-mini-preview preview-duel">
              <div className="mini-duel-lane">
                <span className="lane-tag font-mono">MergeSort</span>
                <div className="lane-progress"><div className="lane-bar-fill fill-blue" style={{ width: '85%' }} /></div>
                <span className="lane-time font-mono">1.2ms</span>
              </div>
              <div className="mini-duel-lane">
                <span className="lane-tag font-mono">QuickSort</span>
                <div className="lane-progress"><div className="lane-bar-fill fill-amber" style={{ width: '100%' }} /></div>
                <span className="lane-time font-mono">0.8ms 🏆</span>
              </div>
            </div>

            <div className="course-card-footer">
              <button
                type="button"
                className="btn-course-launch btn-course-py-launch"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab('duel');
                }}
              >
                <span>⚔️ Launch Arena</span>
                <ArrowRightIcon size={12} />
              </button>
              <span className="course-click-hint font-mono">
                {activeTab === 'duel' ? '▲ Close Arena' : '▼ Open Race Arena'}
              </span>
            </div>

            {/* Direct In-Card Unfolded Drawer: Battle Arena */}
            {activeTab === 'duel' && (
              <div className="card-nested-drawer" onClick={(e) => e.stopPropagation()}>
                <div className="duel-content-block">
                  <AlgorithmDuel />
                </div>
              </div>
            )}
          </div>

          {/* Card 3: 📈 Big-O Matrix */}
          <div
            className={`course-card dsa-flagship-card card-matrix ${activeTab === 'matrix' ? 'active-course-card drawer-open' : ''}`}
            onClick={() => setActiveTab(curr => curr === 'matrix' ? null : 'matrix')}
          >
            <div className="course-card-top">
              <span className="course-status-pill status-dev font-mono">● COMPLEXITY CHART</span>
              <span className="course-badge-java font-mono">LIVE SPEED CALCULATOR</span>
            </div>

            <div className="flagship-title-row">
              <div className="flagship-icon-badge icon-blue">📈</div>
              <h3 className="course-card-title">Big-O Complexity Matrix</h3>
            </div>

            <p className="course-card-desc">
              Quick reference guide for Best, Average, and Worst speeds, plus a live calculator to see how input size affects speed.
            </p>

            {/* Creative Micro Visual Graphic Preview */}
            <div className="card-mini-preview preview-matrix">
              <span className="comp-dot-tag font-mono comp-green">O(1)</span>
              <span className="comp-dot-arrow font-mono">→</span>
              <span className="comp-dot-tag font-mono comp-cyan">O(log n)</span>
              <span className="comp-dot-arrow font-mono">→</span>
              <span className="comp-dot-tag font-mono comp-yellow">O(n)</span>
              <span className="comp-dot-arrow font-mono">→</span>
              <span className="comp-dot-tag font-mono comp-red">O(n²)</span>
            </div>

            <div className="course-card-footer">
              <button
                type="button"
                className="btn-course-launch btn-course-java-launch"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab('matrix');
                }}
              >
                <span>📈 Open Matrix</span>
                <ArrowRightIcon size={12} />
              </button>
              <span className="course-click-hint font-mono">
                {activeTab === 'matrix' ? '▲ Close Matrix' : '▼ Open Complexity Table'}
              </span>
            </div>

            {/* Direct In-Card Unfolded Drawer: Big-O Matrix */}
            {activeTab === 'matrix' && (
              <div className="card-nested-drawer" onClick={(e) => e.stopPropagation()}>
                <div className="matrix-content-block">
                  {/* Dynamic Scalability Calculator */}
                  <div className="scalability-calc-card">
                    <div className="calc-header-row">
                      <div className="calc-left">
                        <span className="calc-badge font-mono">⚡ LIVE SPEED CALCULATOR</span>
                        <h4 className="calc-title">Big-O Speed &amp; Steps Calculator</h4>
                        <p className="calc-sub">Move the slider to see how the number of steps grows as you add more items.</p>
                      </div>
                      <div className="slider-control-box">
                        <div className="slider-label-row">
                          <span className="s-label font-mono">Input Size (N):</span>
                          <span className="s-val font-mono font-bold">{sliderN} items</span>
                        </div>
                        <input
                          type="range"
                          min="4"
                          max="1024"
                          step="4"
                          value={sliderN}
                          onChange={(e) => setSliderN(Number(e.target.value))}
                          className="complexity-slider"
                        />
                      </div>
                    </div>

                    <div className="calc-bars-grid">
                      {Object.entries(complexityResults).map(([key, data]) => (
                        <div key={key} className="calc-stat-pill">
                          <div className="c-head">
                            <span className="c-name">{data.label}</span>
                            <span className="c-notation font-mono" style={{ color: data.color }}>{data.notation}</span>
                          </div>
                          <span className="c-ops font-mono">{data.opsFormatted} steps</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Matrix Table */}
                  <div className="matrix-table-card">
                    <div className="matrix-table-wrap">
                      <table className="matrix-table">
                        <thead>
                          <tr>
                            <th className="col-algo">Algorithm</th>
                            <th className="col-cat">Category</th>
                            <th className="col-best">Best Time</th>
                            <th className="col-avg">Average Time</th>
                            <th className="col-worst">Worst Time</th>
                            <th className="col-space">Space</th>
                            <th className="col-stable">Stable</th>
                            <th className="col-action">Launch</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ALGORITHMS.map(algo => (
                            <tr key={algo.slug} onClick={() => onSelectAlgo(algo.slug)} className="bigo-matrix-row matrix-row">
                              <td className="col-algo font-bold font-mono matrix-name-cell">
                                {algo.name}
                              </td>
                              <td className="col-cat">
                                <span className="matrix-cat-pill font-mono">{CATEGORIES[algo.category]?.label || algo.category}</span>
                              </td>
                              <td className="col-best">
                                <span className="complexity-badge font-mono" style={{ color: getComplexityColor(algo.timeComplexity.best) }}>
                                  {algo.timeComplexity.best}
                                </span>
                              </td>
                              <td className="col-avg">
                                <span className="complexity-badge font-mono" style={{ color: getComplexityColor(algo.timeComplexity.average) }}>
                                  {algo.timeComplexity.average}
                                </span>
                              </td>
                              <td className="col-worst">
                                <span className="complexity-badge font-mono" style={{ color: getComplexityColor(algo.timeComplexity.worst) }}>
                                  {algo.timeComplexity.worst}
                                </span>
                              </td>
                              <td className="col-space">
                                <span className="matrix-space-pill font-mono">{algo.spaceComplexity}</span>
                              </td>
                              <td className="col-stable">
                                <span className={`matrix-stable-pill ${algo.stable ? 'is-stable' : 'is-unstable'}`}>
                                  {algo.stable ? '✓ Yes' : '✕ No'}
                                </span>
                              </td>
                              <td className="col-action">
                                <button className="matrix-action-btn" onClick={(e) => { e.stopPropagation(); onSelectAlgo(algo.slug); }}>
                                  <span>Run</span>
                                  <ArrowRightIcon size={10} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 2: 🎓 CODING ACADEMY (C, PYTHON, JAVA, C++)
      ══════════════════════════════════════════════════════════════════ */}
      <section className="section-block coding-academy-section" id="academy-section">
        <div className="section-header-row">
          <div className="section-header-left">
            <span className="section-eyebrow eyebrow-green font-mono">🎓 CODING ACADEMY</span>
            <h2 className="section-main-title">Coding Academy</h2>
            <p className="section-main-sub">
              Learn programming step-by-step from beginner to advanced with interactive lessons, in-browser code practice, and quizzes.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-md"
            onClick={() => onOpenLearnC && onOpenLearnC('hello-world-intro')}
          >
            🎓 Start Learning C (Chapter 1) &rarr;
          </button>
        </div>

        {/* Multi-Language Available Courses Grid with Direct In-Card Drawers */}
        <div className="courses-hub-grid multi-lang-grid">
          {/* 1. C Master Academy */}
          <div
            className={`course-card course-card-c ${expandedCourse === 'c' ? 'active-course-card drawer-open' : ''}`}
            onClick={() => setExpandedCourse(curr => curr === 'c' ? null : 'c')}
          >
            <div className="course-card-top">
              <span className="course-status-pill status-live font-mono">● LIVE &amp; FREE</span>
              <span className="course-badge-ch font-mono">23 CHAPTERS • 230 QUIZZES</span>
            </div>
            <h3 className="course-card-title">C Programming Academy</h3>
            <p className="course-card-desc">
              Learn pointers, memory layout, structs, and dynamic memory with visual guides and a free certificate.
            </p>
            <div className="course-card-footer">
              <button
                type="button"
                className="btn-course-launch"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenLearnC && onOpenLearnC('hello-world-intro');
                }}
              >
                <span>Start Course</span>
                <ArrowRightIcon size={12} />
              </button>
              <span className="course-click-hint font-mono">
                {expandedCourse === 'c' ? '▲ Close Details' : '▼ View Syllabus & Chapters'}
              </span>
            </div>

            {/* Direct In-Card Unfolded Drawer for C */}
            {expandedCourse === 'c' && (
              <div className="card-nested-drawer" onClick={(e) => e.stopPropagation()}>
                <div className="drawer-quick-banner">
                  <div className="banner-left">
                    <span className="banner-badge font-mono">11 CORE MODULES • 23 CHAPTERS</span>
                    <h4 className="banner-title">C Programming Course Outline</h4>
                    <p className="banner-sub">Select any module below to see its chapters, practice quizzes, and interactive code exercises.</p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => onOpenLearnC && onOpenLearnC('hello-world-intro')}
                  >
                    <span>🎓 Open Chapter 1</span>
                    <ArrowRightIcon size={12} />
                  </button>
                </div>

                <div className="roadmap-modules-grid">
                  {C_MODULES.map((mod, mIdx) => {
                    const lessonsInMod = C_LESSONS.filter(l => l.moduleId === mod.id);
                    const isModOpen = expandedModule === mod.id;
                    return (
                      <div
                        key={mod.id}
                        className={`roadmap-module-card ${isModOpen ? 'module-open' : 'module-collapsed'}`}
                      >
                        <div
                          className="rm-mod-header cursor-pointer"
                          onClick={() => setExpandedModule(curr => curr === mod.id ? null : mod.id)}
                          role="button"
                          tabIndex={0}
                        >
                          <div className="rm-header-left">
                            <span className="rm-mod-num font-mono">MODULE {mIdx + 1}</span>
                            <h5 className="rm-mod-title">{mod.name.replace(/^Module \d+:\s*/, '')}</h5>
                            <p className="rm-mod-desc">{mod.desc}</p>
                          </div>
                          <div className="rm-header-right">
                            <span className="mod-count-pill font-mono">
                              {lessonsInMod.length} Chapters
                            </span>
                            <span className="mod-toggle-arrow font-mono">
                              {isModOpen ? '▲' : '▼'}
                            </span>
                          </div>
                        </div>

                        {isModOpen && (
                          <div className="rm-lessons-list animated-lessons">
                            {lessonsInMod.map(lesson => (
                              <div
                                key={lesson.slug}
                                className="rm-lesson-row"
                                onClick={() => onOpenLearnC && onOpenLearnC(lesson.slug)}
                                role="button"
                                tabIndex={0}
                              >
                                <span className="rm-ch-num font-mono">{String(lesson.chapter).padStart(2, '0')}</span>
                                <div className="rm-ch-info">
                                  <span className="rm-ch-title">{lesson.title.replace(/^Chapter \d+:\s*/, '')}</span>
                                  <span className="rm-ch-sub">{lesson.subtitle}</span>
                                </div>
                                <span className="rm-ch-meta font-mono">⏱ {lesson.readTime}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 2. Python 3 Masterclass */}
          <div
            className={`course-card course-card-python ${expandedCourse === 'python' ? 'active-course-card drawer-open' : ''}`}
            onClick={() => {
              setExpandedCourse(curr => curr === 'python' ? null : 'python');
              setExpandedModule('py-mod-1');
            }}
          >
            <div className="course-card-top">
              <span className="course-status-pill status-soon font-mono">● PREVIEW READY</span>
              <span className="course-badge-py font-mono">12 MODULES</span>
            </div>
            <h3 className="course-card-title">Python 3 Masterclass</h3>
            <p className="course-card-desc">
              Learn Python basics, object-oriented programming, data structures, and solve coding problems directly in your browser.
            </p>
            <div className="course-card-footer">
              <button
                type="button"
                className="btn-course-launch btn-course-py-launch"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenPythonModal && onOpenPythonModal();
                }}
              >
                <span>Start Course</span>
                <ArrowRightIcon size={12} />
              </button>
              <span className="course-click-hint font-mono">
                {expandedCourse === 'python' ? '▲ Close Details' : '▼ View Syllabus & Modules'}
              </span>
            </div>

            {/* Direct In-Card Unfolded Drawer for Python */}
            {expandedCourse === 'python' && (
              <div className="card-nested-drawer" onClick={(e) => e.stopPropagation()}>
                <div className="drawer-quick-banner">
                  <div className="banner-left">
                    <span className="banner-badge font-mono">12 PYTHON MODULES</span>
                    <h4 className="banner-title">Python 3 Course Outline</h4>
                    <p className="banner-sub">Select any module below to see topics and practice exercises.</p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm btn-course-py-launch"
                    onClick={() => onOpenPythonModal && onOpenPythonModal()}
                  >
                    <span>🐍 Preview Syllabus</span>
                    <ArrowRightIcon size={12} />
                  </button>
                </div>

                <div className="roadmap-modules-grid">
                  <div className={`roadmap-module-card ${expandedModule === 'py-mod-1' ? 'module-open' : 'module-collapsed'}`}>
                    <div
                      className="rm-mod-header cursor-pointer"
                      onClick={() => setExpandedModule(curr => curr === 'py-mod-1' ? null : 'py-mod-1')}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="rm-header-left">
                        <span className="rm-mod-num font-mono">MODULE 1</span>
                        <h5 className="rm-mod-title">Python Core Syntax &amp; Data Types</h5>
                        <p className="rm-mod-desc">Variables, basic types, list slicing, and dictionaries.</p>
                      </div>
                      <div className="rm-header-right">
                        <span className="mod-count-pill font-mono">2 Topics</span>
                        <span className="mod-toggle-arrow font-mono">{expandedModule === 'py-mod-1' ? '▲' : '▼'}</span>
                      </div>
                    </div>

                    {expandedModule === 'py-mod-1' && (
                      <div className="rm-lessons-list animated-lessons">
                        <div className="rm-lesson-row" onClick={() => onOpenPythonModal && onOpenPythonModal()}>
                          <span className="rm-ch-num font-mono">01</span>
                          <div className="rm-ch-info">
                            <span className="rm-ch-title">Python Setup &amp; Running Scripts</span>
                            <span className="rm-ch-sub">Getting started with Python and running code</span>
                          </div>
                          <span className="rm-ch-meta font-mono">⏱ 15m</span>
                        </div>
                        <div className="rm-lesson-row" onClick={() => onOpenPythonModal && onOpenPythonModal()}>
                          <span className="rm-ch-num font-mono">02</span>
                          <div className="rm-ch-info">
                            <span className="rm-ch-title">Lists, Tuples, Sets &amp; Dictionaries</span>
                            <span className="rm-ch-sub">Working with collections and list operations</span>
                          </div>
                          <span className="rm-ch-meta font-mono">⏱ 25m</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className={`roadmap-module-card ${expandedModule === 'py-mod-2' ? 'module-open' : 'module-collapsed'}`}>
                    <div
                      className="rm-mod-header cursor-pointer"
                      onClick={() => setExpandedModule(curr => curr === 'py-mod-2' ? null : 'py-mod-2')}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="rm-header-left">
                        <span className="rm-mod-num font-mono">MODULE 2</span>
                        <h5 className="rm-mod-title">Object-Oriented Python</h5>
                        <p className="rm-mod-desc">Classes, objects, functions, and reusable code patterns.</p>
                      </div>
                      <div className="rm-header-right">
                        <span className="mod-count-pill font-mono">2 Topics</span>
                        <span className="mod-toggle-arrow font-mono">{expandedModule === 'py-mod-2' ? '▲' : '▼'}</span>
                      </div>
                    </div>

                    {expandedModule === 'py-mod-2' && (
                      <div className="rm-lessons-list animated-lessons">
                        <div className="rm-lesson-row" onClick={() => onOpenPythonModal && onOpenPythonModal()}>
                          <span className="rm-ch-num font-mono">03</span>
                          <div className="rm-ch-info">
                            <span className="rm-ch-title">Classes &amp; Objects</span>
                            <span className="rm-ch-sub">Creating classes and managing object properties</span>
                          </div>
                          <span className="rm-ch-meta font-mono">⏱ 20m</span>
                        </div>
                        <div className="rm-lesson-row" onClick={() => onOpenPythonModal && onOpenPythonModal()}>
                          <span className="rm-ch-num font-mono">04</span>
                          <div className="rm-ch-info">
                            <span className="rm-ch-title">Iterators &amp; Generators</span>
                            <span className="rm-ch-sub">Writing clean memory-efficient loops</span>
                          </div>
                          <span className="rm-ch-meta font-mono">⏱ 25m</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. Java & OOP Architecture */}
          <div
            className={`course-card course-card-java ${expandedCourse === 'java' ? 'active-course-card drawer-open' : ''}`}
            onClick={() => {
              setExpandedCourse(curr => curr === 'java' ? null : 'java');
              setExpandedModule('java-mod-1');
            }}
          >
            <div className="course-card-top">
              <span className="course-status-pill status-dev font-mono">● IN DEVELOPMENT</span>
              <span className="course-badge-java font-mono">10 MODULES</span>
            </div>
            <h3 className="course-card-title">Java &amp; OOP Foundations</h3>
            <p className="course-card-desc">
              Learn Java basics, object-oriented design, Collections, and how Java runs programs efficiently.
            </p>
            <div className="course-card-footer">
              <button
                type="button"
                className="btn-course-launch btn-course-java-launch"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedCourse('java');
                  setExpandedModule('java-mod-1');
                }}
              >
                <span>Start Course</span>
                <ArrowRightIcon size={12} />
              </button>
              <span className="course-click-hint font-mono">
                {expandedCourse === 'java' ? '▲ Close Details' : '▼ View Syllabus & Modules'}
              </span>
            </div>

            {/* Direct In-Card Unfolded Drawer for Java */}
            {expandedCourse === 'java' && (
              <div className="card-nested-drawer" onClick={(e) => e.stopPropagation()}>
                <div className="drawer-quick-banner">
                  <div className="banner-left">
                    <span className="banner-badge font-mono">10 JAVA MODULES</span>
                    <h4 className="banner-title">Java Programming Course Outline</h4>
                    <p className="banner-sub">Object-oriented programming and Java foundations.</p>
                  </div>
                </div>

                <div className="roadmap-modules-grid">
                  <div className={`roadmap-module-card ${expandedModule === 'java-mod-1' ? 'module-open' : 'module-collapsed'}`}>
                    <div
                      className="rm-mod-header cursor-pointer"
                      onClick={() => setExpandedModule(curr => curr === 'java-mod-1' ? null : 'java-mod-1')}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="rm-header-left">
                        <span className="rm-mod-num font-mono">MODULE 1</span>
                        <h5 className="rm-mod-title">Java Platform &amp; OOP Basics</h5>
                        <p className="rm-mod-desc">Classes, objects, variables, and basic program structure.</p>
                      </div>
                      <div className="rm-header-right">
                        <span className="mod-count-pill font-mono">2 Topics</span>
                        <span className="mod-toggle-arrow font-mono">{expandedModule === 'java-mod-1' ? '▲' : '▼'}</span>
                      </div>
                    </div>

                    {expandedModule === 'java-mod-1' && (
                      <div className="rm-lessons-list animated-lessons">
                        <div className="rm-lesson-row">
                          <span className="rm-ch-num font-mono">01</span>
                          <div className="rm-ch-info">
                            <span className="rm-ch-title">Java Basics &amp; Memory</span>
                            <span className="rm-ch-sub">How Java executes code and manages memory</span>
                          </div>
                          <span className="rm-ch-meta font-mono">Coming Soon</span>
                        </div>
                        <div className="rm-lesson-row">
                          <span className="rm-ch-num font-mono">02</span>
                          <div className="rm-ch-info">
                            <span className="rm-ch-title">Java Collections</span>
                            <span className="rm-ch-sub">Lists, Sets, and Maps in Java</span>
                          </div>
                          <span className="rm-ch-meta font-mono">Coming Soon</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4. C++ Modern Systems & STL */}
          <div
            className={`course-card course-card-cpp ${expandedCourse === 'cpp' ? 'active-course-card drawer-open' : ''}`}
            onClick={() => {
              setExpandedCourse(curr => curr === 'cpp' ? null : 'cpp');
              setExpandedModule('cpp-mod-1');
            }}
          >
            <div className="course-card-top">
              <span className="course-status-pill status-dev font-mono">● IN DEVELOPMENT</span>
              <span className="course-badge-cpp font-mono">10 MODULES</span>
            </div>
            <h3 className="course-card-title">Modern C++ &amp; Fast Data Structures</h3>
            <p className="course-card-desc">
              Learn modern C++, smart pointers, memory management, templates, and fast data structures (STL).
            </p>
            <div className="course-card-footer">
              <button
                type="button"
                className="btn-course-launch btn-course-cpp-launch"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedCourse('cpp');
                  setExpandedModule('cpp-mod-1');
                }}
              >
                <span>Start Course</span>
                <ArrowRightIcon size={12} />
              </button>
              <span className="course-click-hint font-mono">
                {expandedCourse === 'cpp' ? '▲ Close Details' : '▼ View Syllabus & Modules'}
              </span>
            </div>

            {/* Direct In-Card Unfolded Drawer for C++ */}
            {expandedCourse === 'cpp' && (
              <div className="card-nested-drawer" onClick={(e) => e.stopPropagation()}>
                <div className="drawer-quick-banner">
                  <div className="banner-left">
                    <span className="banner-badge font-mono">10 C++ MODULES</span>
                    <h4 className="banner-title">Modern C++ Course Outline</h4>
                    <p className="banner-sub">Safe memory management and fast C++ containers.</p>
                  </div>
                </div>

                <div className="roadmap-modules-grid">
                  <div className={`roadmap-module-card ${expandedModule === 'cpp-mod-1' ? 'module-open' : 'module-collapsed'}`}>
                    <div
                      className="rm-mod-header cursor-pointer"
                      onClick={() => setExpandedModule(curr => curr === 'cpp-mod-1' ? null : 'cpp-mod-1')}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="rm-header-left">
                        <span className="rm-mod-num font-mono">MODULE 1</span>
                        <h5 className="rm-mod-title">Modern C++ &amp; Safe Memory</h5>
                        <p className="rm-mod-desc">Pointers, memory safety, and standard C++ containers.</p>
                      </div>
                      <div className="rm-header-right">
                        <span className="mod-count-pill font-mono">2 Topics</span>
                        <span className="mod-toggle-arrow font-mono">{expandedModule === 'cpp-mod-1' ? '▲' : '▼'}</span>
                      </div>
                    </div>

                    {expandedModule === 'cpp-mod-1' && (
                      <div className="rm-lessons-list animated-lessons">
                        <div className="rm-lesson-row">
                          <span className="rm-ch-num font-mono">01</span>
                          <div className="rm-ch-info">
                            <span className="rm-ch-title">Smart Pointers &amp; Memory</span>
                            <span className="rm-ch-sub">Automatic memory cleanup and leak prevention</span>
                          </div>
                          <span className="rm-ch-meta font-mono">Coming Soon</span>
                        </div>
                        <div className="rm-lesson-row">
                          <span className="rm-ch-num font-mono">02</span>
                          <div className="rm-ch-info">
                            <span className="rm-ch-title">C++ Standard Library (STL)</span>
                            <span className="rm-ch-sub">Vectors, maps, sets, and algorithms</span>
                          </div>
                          <span className="rm-ch-meta font-mono">Coming Soon</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>



      {/* ── 10. Final Call to Action ── */}
      <section className="home-final-cta-card">
        <div className="final-cta-content">
          <span className="final-cta-badge">🚀 START LEARNING TODAY</span>
          <h2 className="final-cta-title">Ready to Master Coding &amp; Algorithms?</h2>
          <p className="final-cta-desc">
            Join thousands of learners mastering programming and data structures through simple, step-by-step visual lessons.
          </p>
          <div className="final-cta-buttons">
            <button
              className="btn-final-academy"
              onClick={() => onOpenLearnC && onOpenLearnC('hello-world-intro')}
            >
              🎓 Start Learning C (23 Chapters) &rarr;
            </button>
            <button
              className="btn-final-studio"
              onClick={() => onSelectAlgo('quick-sort')}
            >
              ⚡ Explore Algorithm Studio
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
