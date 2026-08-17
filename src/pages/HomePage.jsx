import { useState, useMemo, useEffect, useRef } from 'react';
import { ALGORITHMS, CATEGORIES } from '../data/algorithms.js';
import AlgorithmDuel from '../components/AlgorithmDuel.jsx';
import {
  SearchIcon, ArrowRightIcon, PlayIcon, PauseIcon, ShuffleIcon, CodeIcon,
  PythonIcon, CIcon, CppIcon, JavaIcon, JSIcon, getAlgoIcon, AlgoFlowXLogo
} from '../components/Icons.jsx';

const LANG_OPTIONS = [
  { id: 'python', label: 'Python', icon: PythonIcon },
  { id: 'c',      label: 'C',      icon: CIcon },
  { id: 'cpp',    label: 'C++',    icon: CppIcon },
  { id: 'java',   label: 'Java',   icon: JavaIcon },
  { id: 'js',     label: 'JavaScript', icon: JSIcon },
];

// Learning Tracks Curriculum
const LEARNING_TRACKS = [
  {
    id: 'sorting-foundations',
    title: 'Sorting Fundamentals',
    category: 'sorting',
    description: 'Learn iterative sorting mechanisms, adjacent swaps, and index partitioning.',
    difficulty: 'Beginner',
    diffColor: '#34d399',
    timeEst: '25 mins',
    icon: '📊',
    algorithms: ['bubble-sort', 'selection-sort', 'insertion-sort'],
  },
  {
    id: 'divide-and-conquer',
    title: 'Divide & Conquer Sorting',
    category: 'sorting',
    description: 'Master logarithmic decompositions, recursive merges, pivot partitioning, and binary heaps.',
    difficulty: 'Intermediate',
    diffColor: '#fbbf24',
    timeEst: '35 mins',
    icon: '⚡',
    algorithms: ['merge-sort', 'quick-sort', 'heap-sort'],
  },
  {
    id: 'searching-algorithms',
    title: 'Search Strategies',
    category: 'searching',
    description: 'Understand sequential scans vs logarithmic interval bisection in sorted data.',
    difficulty: 'Beginner',
    diffColor: '#34d399',
    timeEst: '15 mins',
    icon: '🔍',
    algorithms: ['linear-search', 'binary-search'],
  },
  {
    id: 'graph-traversals',
    title: 'Graph Theory & Paths',
    category: 'graphs',
    description: 'Traverse complex topologies using queues, recursion stacks, and greedy edge relaxation.',
    difficulty: 'Advanced',
    diffColor: '#38bdf8',
    timeEst: '45 mins',
    icon: '🕸️',
    algorithms: ['bfs', 'dfs', 'dijkstra'],
  },
  {
    id: 'tree-structures',
    title: 'Hierarchical Trees',
    category: 'trees',
    description: 'Binary Search Tree property, dynamic subtree insertions, and logarithmic lookups.',
    difficulty: 'Intermediate',
    diffColor: '#a855f7',
    timeEst: '20 mins',
    icon: '🌳',
    algorithms: ['bst'],
  },
  {
    id: 'linear-data-structures',
    title: 'Linear Data Structures',
    category: 'datastructures',
    description: 'Master LIFO stacks, FIFO queues, circular ring buffers, and singly/doubly linked lists.',
    difficulty: 'Beginner',
    diffColor: '#34d399',
    timeEst: '30 mins',
    icon: '📦',
    algorithms: ['stack', 'queue', 'linked-list', 'doubly-linked-list', 'circular-queue'],
  },
  {
    id: 'advanced-data-structures',
    title: 'Priority Heaps & Hash Tables',
    category: 'datastructures',
    description: 'Master binary min-heaps with sift-up/down and hash tables with separate chaining collisions.',
    difficulty: 'Intermediate',
    diffColor: '#f59e0b',
    timeEst: '35 mins',
    icon: '⚡',
    algorithms: ['binary-heap', 'hash-table'],
  },
];

// Interactive Big-O Growth Curves
function calculateOperations(n) {
  return [
    { name: 'O(1)', label: 'Constant', ops: 1, class: 'good' },
    { name: 'O(log n)', label: 'Logarithmic', ops: Math.round(Math.log2(n || 1)), class: 'good' },
    { name: 'O(n)', label: 'Linear', ops: n, class: 'med' },
    { name: 'O(n log n)', label: 'Linearithmic', ops: Math.round(n * Math.log2(n || 1)), class: 'med' },
    { name: 'O(n²)', label: 'Quadratic', ops: n * n, class: 'bad' },
  ];
}

const CATEGORY_ICONS = {
  sorting: '📊',
  searching: '🔍',
  datastructures: '📦',
  graphs: '🕸️',
  trees: '🌳',
};

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
  const [activeTab, setActiveTab] = useState('tracks'); // 'tracks' | 'catalog' | 'matrix' | 'growth'
  const [selectedLang, setSelectedLang] = useState('python');
  const [sliderN, setSliderN] = useState(64);

  // ── Hero Interactive Mini-Playground State ──
  const [heroArray, setHeroArray] = useState([45, 12, 89, 34, 67, 23, 90, 15, 52, 78]);
  const [heroActiveIdx, setHeroActiveIdx] = useState({ i: -1, j: -1 });
  const [heroSorting, setHeroSorting] = useState(false);
  const heroTimerRef = useRef(null);

  const shuffleHero = () => {
    clearInterval(heroTimerRef.current);
    setHeroSorting(false);
    setHeroActiveIdx({ i: -1, j: -1 });
    setHeroArray(Array.from({ length: 10 }, () => Math.floor(Math.random() * 80) + 20));
  };

  const runHeroBubbleSort = () => {
    if (heroSorting) {
      clearInterval(heroTimerRef.current);
      setHeroSorting(false);
      return;
    }

    setHeroSorting(true);
    let arr = [...heroArray];
    let i = 0, j = 0;
    const n = arr.length;

    heroTimerRef.current = setInterval(() => {
      if (i < n) {
        if (j < n - i - 1) {
          setHeroActiveIdx({ i: j, j: j + 1 });
          if (arr[j] > arr[j + 1]) {
            const temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
            setHeroArray([...arr]);
          }
          j++;
        } else {
          j = 0;
          i++;
        }
      } else {
        clearInterval(heroTimerRef.current);
        setHeroSorting(false);
        setHeroActiveIdx({ i: -1, j: -1 });
      }
    }, 120);
  };

  useEffect(() => {
    return () => clearInterval(heroTimerRef.current);
  }, []);

  // Filtered algorithms for catalog & matrix
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
      {/* ── 1. Creative Hero Section with Interactive Sandbox ── */}
      <section className="creative-hero-grid">
        <div className="platform-hero">
          <div className="hero-badge-pill">
            <AlgoFlowXLogo size={16} />
            <span className="hero-pulse-dot" />
            <span className="hero-badge-text">AlgoFlowX • Interactive DSA Engine</span>
          </div>

          <h1 className="platform-hero-title">
            Master Algorithms <br className="hero-title-br" />
            <span className="hero-title-accent">Through Visual Execution</span>
          </h1>

          <p className="platform-hero-sub">
            Observe pointer mutations, real-time swapping trajectories, and synchronized code execution line-by-line across 5 programming languages.
          </p>

          <div className="platform-stats-strip">
            <div className="stat-card">
              <div className="stat-card-head">
                <span className="stat-dot dot-cyan" />
                <span className="stat-val">{ALGORITHMS.length}</span>
              </div>
              <span className="stat-lbl">Algorithms</span>
            </div>
            <div className="stat-card">
              <div className="stat-card-head">
                <span className="stat-dot dot-indigo" />
                <span className="stat-val">5</span>
              </div>
              <span className="stat-lbl">Languages</span>
            </div>
            <div className="stat-card">
              <div className="stat-card-head">
                <span className="stat-dot dot-emerald" />
                <span className="stat-val">O(1) → O(n²)</span>
              </div>
              <span className="stat-lbl">Complexities</span>
            </div>
            <div className="stat-card">
              <div className="stat-card-head">
                <span className="stat-dot dot-violet" />
                <span className="stat-val">Step Trace</span>
              </div>
              <span className="stat-lbl">Execution</span>
            </div>
          </div>

          <div className="platform-hero-actions">
            <button className="btn btn-primary btn-hero-cta" onClick={() => onSelectAlgo('bubble-sort')}>
              <PlayIcon size={14} />
              <span>Start Visualizer</span>
            </button>
            <button className="btn btn-secondary btn-hero-cta" onClick={() => setActiveTab('matrix')}>
              <span>Big-O Matrix</span>
              <ArrowRightIcon size={14} />
            </button>
          </div>
        </div>

        {/* ── Live Hero Interactive Sandbox ── */}
        <div className="hero-sandbox-card">
          <div className="sandbox-header">
            <div className="sandbox-title-group">
              <span className="sandbox-live-dot" />
              <span className="sandbox-label">Live Interactive Sandbox</span>
            </div>
            <div className="sandbox-controls">
              <button className="btn btn-sm btn-icon" onClick={shuffleHero} title="Randomize Array">
                <ShuffleIcon size={13} />
              </button>
              <button className="btn btn-sm btn-primary" onClick={runHeroBubbleSort}>
                {heroSorting ? <PauseIcon size={12} /> : <PlayIcon size={12} />}
                <span>{heroSorting ? 'Pause' : 'Sort'}</span>
              </button>
            </div>
          </div>

          <div className="sandbox-canvas">
            {heroArray.map((val, idx) => {
              const isActive = idx === heroActiveIdx.i || idx === heroActiveIdx.j;
              return (
                <div key={idx} className="sandbox-bar-col">
                  <div
                    className={`sandbox-bar ${isActive ? 'active' : ''}`}
                    style={{ height: `${val}%` }}
                  />
                  <span className="sandbox-val">{val}</span>
                </div>
              );
            })}
          </div>

          <div className="sandbox-footer">
            <span className="sandbox-note">Bubble Sort • Adjacent Comparison</span>
            <button className="btn-link" onClick={() => onSelectAlgo('bubble-sort')}>
              Open Debugger →
            </button>
          </div>
        </div>
      </section>

      {/* ── 2. Platform Navigation View Tabs ── */}
      <div className="platform-view-tabs-wrapper">
        <div className="platform-view-tabs">
          <button
            className={`platform-tab ${activeTab === 'tracks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tracks')}
          >
            📚 Curriculum Tracks ({LEARNING_TRACKS.length})
          </button>
          <button
            className={`platform-tab ${activeTab === 'catalog' ? 'active' : ''}`}
            onClick={() => setActiveTab('catalog')}
          >
            ⚡ Algorithm Directory ({ALGORITHMS.length})
          </button>
          <button
            className={`platform-tab ${activeTab === 'duel' ? 'active' : ''}`}
            onClick={() => setActiveTab('duel')}
          >
            ⚔️ Algorithm Battle Arena
          </button>
          <button
            className={`platform-tab ${activeTab === 'matrix' ? 'active' : ''}`}
            onClick={() => setActiveTab('matrix')}
          >
            📊 Big-O Matrix
          </button>
          <button
            className={`platform-tab ${activeTab === 'growth' ? 'active' : ''}`}
            onClick={() => setActiveTab('growth')}
          >
            📈 Growth Calculator
          </button>
        </div>
      </div>

      {/* ── View: Algorithm Battle Arena ── */}
      {activeTab === 'duel' && (
        <section className="duel-arena-section">
          <AlgorithmDuel />
        </section>
      )}

      {/* ── 3. View A: Structured Learning Tracks ── */}
      {activeTab === 'tracks' && (
        <section className="learning-tracks-section">
          <div className="section-header-row">
            <div>
              <h2 className="section-title">Structured Curriculum Tracks</h2>
              <p className="section-subtitle">Progressive learning paths designed for university exams and technical interview preparation.</p>
            </div>
          </div>

          <div className="tracks-grid">
            {LEARNING_TRACKS.map((track, idx) => {
              const trackAlgos = track.algorithms.map(slug => ALGORITHMS.find(a => a.slug === slug)).filter(Boolean);
              return (
                <div key={track.id} className="track-card">
                  <div className="track-card-top-bar">
                    <div className="track-icon-badge">{track.icon}</div>
                    <div className="track-meta-badges">
                      <span className="track-step-pill">Track {idx + 1}</span>
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
                          <span className="track-module-glyph">{getAlgoIcon(algo.slug, 15)}</span>
                          <span className="module-name">{algo.name}</span>
                        </div>
                        <span className="module-comp">{algo.timeComplexity.average}</span>
                      </div>
                    ))}
                  </div>

                  <div className="track-card-footer">
                    <span className="track-time-est">⏱️ {track.timeEst}</span>
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

      {/* ── 4. View B: Algorithm Directory & Search ── */}
      {activeTab === 'catalog' && (
        <section className="catalog-section">
          <div className="catalog-toolbar">
            <div className="category-tabs">
              <button
                className={`category-tab ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => setActiveCategory('all')}
              >
                All ({ALGORITHMS.length})
              </button>
              {Object.entries(CATEGORIES).map(([key, cat]) => {
                const count = ALGORITHMS.filter(a => a.category === key).length;
                return (
                  <button
                    key={key}
                    className={`category-tab ${activeCategory === key ? 'active' : ''}`}
                    onClick={() => setActiveCategory(key)}
                  >
                    <span>{CATEGORY_ICONS[key] || '📁'}</span>
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
                placeholder="Filter algorithms (e.g. quick, O(log n))..."
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
                  Clear Search
                </button>
              </div>
            ) : (
              filteredAlgos.map(algo => {
                const catLabel = CATEGORIES[algo.category]?.label || algo.category;
                const catColor = CATEGORY_COLORS[algo.category] || '#3b82f6';

                return (
                  <div
                    key={algo.slug}
                    className="compact-card"
                    onClick={() => onSelectAlgo(algo.slug)}
                  >
                    <div className="compact-card-top">
                      <div className="compact-card-title-group">
                        <span className="compact-card-glyph">{getAlgoIcon(algo.slug, 17)}</span>
                        <span className="compact-card-name">{algo.name}</span>
                      </div>
                      <span className="compact-card-cat" style={{ color: catColor, borderColor: `${catColor}33`, background: `${catColor}12` }}>
                        {catLabel}
                      </span>
                    </div>

                    <p className="compact-card-desc">{algo.description}</p>

                    <div className="compact-card-bottom">
                      <div className="compact-tags">
                        <span className="tag-time">{algo.timeComplexity.average}</span>
                        <span className="tag-space">Space {algo.spaceComplexity}</span>
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

      {/* ── 5. View C: Big-O Complexity Matrix ── */}
      {activeTab === 'matrix' && (
        <section className="matrix-section">
          <div className="section-header-row">
            <div>
              <h2 className="section-title">Big-O Complexity Comparison Matrix</h2>
              <p className="section-subtitle">Complete theoretical bounds, auxiliary space requirements, and algorithmic stability across all modules.</p>
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
                  const catColor = CATEGORY_COLORS[algo.category] || '#3b82f6';
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
                          Visualize →
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

      {/* ── 6. View D: Interactive Big-O Growth Calculator ── */}
      {activeTab === 'growth' && (
        <section className="growth-section">
          <div className="section-header-row">
            <div>
              <h2 className="section-title">Interactive Big-O Growth Calculator</h2>
              <p className="section-subtitle">Adjust problem size (N) to observe why logarithmic and linearithmic algorithms drastically outperform quadratic approaches.</p>
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
              <span className="growth-slider-val">{sliderN} elements</span>
            </div>

            <div className="growth-metrics-grid">
              {complexityResults.map(item => (
                <div key={item.name} className="growth-metric-box">
                  <span className="growth-comp-tag">{item.name}</span>
                  <span className="growth-label">{item.label}</span>
                  <div className={`growth-ops-count ${item.class}`}>
                    {item.ops.toLocaleString()} ops
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 7. Multi-Language Interactive Showcase ── */}
      <section className="lang-showcase-section">
        <div className="lang-showcase-card">
          <div className="lang-showcase-content">
            <div className="hero-compact-badge">Multi-Language Code Engine</div>
            <h3 className="showcase-title">Study in Your Preferred Programming Language</h3>
            <p className="showcase-desc">
              Whether you are preparing for coding interviews in Python, competitive programming in C++, or systems coursework in C/Java, AlgoFlowX synchronizes execution across all five language targets.
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
