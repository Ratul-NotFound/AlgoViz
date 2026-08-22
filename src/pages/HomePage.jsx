/* Step 6: feat(catalog): implement categorized algorithm directory with real-time search */
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

/* ─── Helpers ─────────────────────────────────────── */
function calculateOperations(n) {
  const fmt = (x) => x >= 1_000_000 ? `${(x / 1_000_000).toFixed(1)}M` : x >= 1_000 ? `${(x / 1_000).toFixed(0)}K` : `${x}`;
  return [
    { notation: 'O(1)',      label: 'Constant',      color: '#10b981', opsFormatted: fmt(1) },
    { notation: 'O(log n)', label: 'Logarithmic',   color: '#10b981', opsFormatted: fmt(Math.max(1, Math.round(Math.log2(n || 1)))) },
    { notation: 'O(n)',      label: 'Linear',        color: '#3b82f6', opsFormatted: fmt(n) },
    { notation: 'O(n log n)', label: 'Linearithmic', color: '#f59e0b', opsFormatted: fmt(Math.round(n * Math.log2(n || 1))) },
    { notation: 'O(n²)',    label: 'Quadratic',     color: '#ef4444', opsFormatted: fmt(n * n) },
  ];
}

function getComplexityColor(comp = '') {
  if (comp.includes('O(1)') || comp.includes('O(log n)')) return '#10b981';
  if (comp.includes('O(n log n)') || comp === 'O(n)') return '#3b82f6';
  if (comp.includes('O(n²)') || comp.includes('O(V') || comp.includes('O(E')) return '#f59e0b';
  return '#8b5cf6';
}

/* ─── Component ─────────────────────────────────────── */
export default function HomePage({ onSelectAlgo, onOpenLearnC, onOpenPythonModal, initialTab = 'catalog' }) {
  const { isBookmarked, toggleBookmark, isCompleted } = useAuth();

  /* Catalog state */
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(initialTab); // 'catalog' | 'duel' | 'matrix'
  const [showAllAlgos, setShowAllAlgos] = useState(false);

  /* Academy state */
  const [expandedCourse, setExpandedCourse] = useState('c');
  const [expandedModule, setExpandedModule] = useState('module-1');

  /* Big-O slider */
  const [sliderN, setSliderN] = useState(64);

  /* Hero sandbox state */
  const [heroMode, setHeroMode] = useState('quick'); // 'quick' | 'bubble' | 'binary'
  const [heroArray, setHeroArray] = useState([42, 18, 85, 29, 67, 12, 94, 38, 55, 73]);
  const [heroActiveIdx, setHeroActiveIdx] = useState({ i: -1, j: -1, pivot: -1 });
  const [heroSorting, setHeroSorting] = useState(false);
  const [heroStats, setHeroStats] = useState({ step: 0, comps: 0, swaps: 0 });
  const heroTimerRef = useRef(null);

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => () => clearInterval(heroTimerRef.current), []);

  /* Hero sandbox helpers */
  const shuffleHero = () => {
    clearInterval(heroTimerRef.current);
    setHeroSorting(false);
    setHeroActiveIdx({ i: -1, j: -1, pivot: -1 });
    setHeroStats({ step: 0, comps: 0, swaps: 0 });
    const fresh = Array.from({ length: 10 }, () => Math.floor(Math.random() * 75) + 15);
    if (heroMode === 'binary') fresh.sort((a, b) => a - b);
    setHeroArray(fresh);
  };

  const handleSwitchHeroMode = (mode) => {
    clearInterval(heroTimerRef.current);
    setHeroSorting(false);
    setHeroActiveIdx({ i: -1, j: -1, pivot: -1 });
    setHeroStats({ step: 0, comps: 0, swaps: 0 });
    setHeroMode(mode);
    const fresh = Array.from({ length: 10 }, () => Math.floor(Math.random() * 75) + 15);
    if (mode === 'binary') fresh.sort((a, b) => a - b);
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
            compCount++; stepCount++;
            setHeroActiveIdx({ i: j, j: j + 1, pivot: -1 });
            if (arr[j] > arr[j + 1]) {
              swapCount++;
              [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
              setHeroArray([...arr]);
            }
            setHeroStats({ step: stepCount, comps: compCount, swaps: swapCount });
            j++;
          } else { j = 0; i++; }
        } else {
          clearInterval(heroTimerRef.current);
          setHeroSorting(false);
          setHeroActiveIdx({ i: -1, j: -1, pivot: -1 });
        }
      }, 90);
    } else if (heroMode === 'binary') {
      let left = 0, right = arr.length - 1;
      const target = arr[Math.floor(Math.random() * arr.length)];
      heroTimerRef.current = setInterval(() => {
        if (left <= right) {
          stepCount++; compCount++;
          const mid = Math.floor((left + right) / 2);
          setHeroActiveIdx({ i: left, j: right, pivot: mid });
          setHeroStats({ step: stepCount, comps: compCount, swaps: swapCount });
          if (arr[mid] === target) { clearInterval(heroTimerRef.current); setHeroSorting(false); }
          else if (arr[mid] < target) left = mid + 1;
          else right = mid - 1;
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
            compCount++; stepCount++;
            setHeroActiveIdx({ i: j, j: j + 1, pivot: n - 1 });
            if (arr[j] > arr[j + 1]) {
              swapCount++;
              [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
              setHeroArray([...arr]);
            }
            setHeroStats({ step: stepCount, comps: compCount, swaps: swapCount });
            j++;
          } else { j = 0; i++; }
        } else {
          clearInterval(heroTimerRef.current);
          setHeroSorting(false);
          setHeroActiveIdx({ i: -1, j: -1, pivot: -1 });
        }
      }, 80);
    }
  };

  /* Catalog filters */
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
    if (searchQuery || activeCategory !== 'all' || showAllAlgos) return filteredAlgos;
    return filteredAlgos.slice(0, 8);
  }, [filteredAlgos, searchQuery, activeCategory, showAllAlgos]);

  const complexityResults = useMemo(() => calculateOperations(sliderN), [sliderN]);

  /* ──────────────────────────────────────────────────────────────────── */
  return (
    <div className="hp-layout">

      {/* ══ SECTION 1: HERO WORKBENCH ══════════════════════════════════ */}
      <section className="hp-hero">

        {/* Left: Value proposition */}
        <div className="hp-hero-left">
          <div className="hp-eyebrow-pill">
            <span className="hp-eyebrow-dot" />
            <span>🎓 C Academy (23 Chapters) &bull; 40+ Interactive Visualizers</span>
          </div>

          <h1 className="hp-h1">
            Learn Coding &amp; Master Algorithms Through{' '}
            <span className="hp-h1-accent">Interactive Visuals.</span>
          </h1>

          <p className="hp-hero-desc">
            The simplest way to learn programming and data structures. Start C from scratch,
            run code in your browser, and watch every algorithm step-by-step — completely free.
          </p>

          <div className="hp-hero-actions">
            <button
              className="hp-btn-academy"
              onClick={() => onOpenLearnC && onOpenLearnC('hello-world-intro')}
            >
              🎓 Start Learning C (23 Chapters) →
            </button>
            <button
              className="hp-btn-studio"
              onClick={() => {
                setActiveTab('catalog');
                setTimeout(() => {
                  const el = document.getElementById('hp-dsa-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 50);
              }}
            >
              <PlayIcon size={13} />
              <span>Explore 40+ Visualizers</span>
            </button>
          </div>

          <div className="hp-hero-pills">
            {['100% Free & Open Access', '230 Quizzes & Labs', 'In-Browser C Compiler', 'Free Certificate'].map(t => (
              <div key={t} className="hp-hero-pill">
                <span className="hp-pill-check">✓</span>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live interactive sandbox */}
        <div className="hp-sandbox">
          <div className="hp-sb-header">
            <div className="hp-sb-dots">
              <span className="hp-dot dot-r" /><span className="hp-dot dot-y" /><span className="hp-dot dot-g" />
            </div>
            <div className="hp-sb-tabs">
              {[
                { id: 'quick', label: 'Quick Sort' },
                { id: 'bubble', label: 'Bubble Sort' },
                { id: 'binary', label: 'Binary Search' },
              ].map(m => (
                <button
                  key={m.id}
                  className={`hp-sb-tab${heroMode === m.id ? ' active' : ''}`}
                  onClick={() => handleSwitchHeroMode(m.id)}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <div className="hp-sb-controls">
              <button className="hp-sb-icon-btn" onClick={shuffleHero} title="Shuffle">
                <ShuffleIcon size={12} />
              </button>
              <button className="hp-sb-play-btn" onClick={runHeroAnimation}>
                {heroSorting ? <PauseIcon size={11} /> : <PlayIcon size={11} />}
                <span>{heroSorting ? 'Pause' : 'Run'}</span>
              </button>
            </div>
          </div>

          <div className="hp-sb-stage">
            {heroArray.map((val, idx) => {
              const isI = idx === heroActiveIdx.i;
              const isJ = idx === heroActiveIdx.j;
              const isPivot = idx === heroActiveIdx.pivot;
              const isActive = isI || isJ || isPivot;
              return (
                <div key={idx} className="hp-sb-col">
                  <div
                    className={`hp-sb-bar${isActive ? ' active' : ''}${isPivot ? ' pivot' : ''}`}
                    style={{ height: `${Math.max(12, val)}%` }}
                  />
                  <span className="hp-sb-val font-mono">{val}</span>
                  {isI && <span className="hp-sb-ptr hp-ptr-i">i</span>}
                  {isJ && <span className="hp-sb-ptr hp-ptr-j">j</span>}
                  {isPivot && <span className="hp-sb-ptr hp-ptr-p">p</span>}
                </div>
              );
            })}
          </div>

          <div className="hp-sb-footer">
            <div className="hp-telemetry">
              <span className="hp-t-chip font-mono">Step <b>{heroStats.step}</b></span>
              <span className="hp-t-chip font-mono">Comps <b>{heroStats.comps}</b></span>
              <span className="hp-t-chip font-mono">Swaps <b>{heroStats.swaps}</b></span>
            </div>
            <button
              className="hp-open-studio-btn"
              onClick={() => onSelectAlgo(heroMode === 'binary' ? 'binary-search' : heroMode === 'quick' ? 'quick-sort' : 'bubble-sort')}
            >
              <span>Open in Studio</span>
              <ArrowRightIcon size={11} />
            </button>
          </div>
        </div>
      </section>

      {/* ══ SECTION 2: DUAL FLAGSHIP GATEWAYS ═══════════════════════════ */}
      <section className="hp-flagship-grid">

        {/* C Academy Card */}
        <div
          className="hp-flagship-card hp-card-academy"
          onClick={() => onOpenLearnC && onOpenLearnC('hello-world-intro')}
        >
          <div className="hp-fc-header">
            <span className="hp-fc-badge hp-badge-green">🎓 C ACADEMY</span>
            <span className="hp-fc-meta font-mono">23 CHAPTERS • 230 QUIZZES</span>
          </div>
          <h2 className="hp-fc-title">C Programming Academy</h2>
          <p className="hp-fc-desc">
            Learn pointers, memory layout, structs, and dynamic memory with visual guides and an in-browser C compiler.
          </p>
          <div className="hp-fc-snippet font-mono">
            <span className="fc-kw">int</span> *ptr = &amp;val;<span className="fc-cm"> /* 0x7ffd14 → 42 */</span>
          </div>
          <div className="hp-fc-pills">
            <span className="hp-fc-pill">📦 23 Visual Chapters</span>
            <span className="hp-fc-pill">💻 In-Browser Compiler</span>
            <span className="hp-fc-pill">🎓 Free Certificate</span>
          </div>
          <div className="hp-fc-footer">
            <button className="hp-btn-fc hp-btn-fc-green">
              <span>Start Chapter 1</span>
              <ArrowRightIcon size={12} />
            </button>
            <span className="hp-fc-sub">100% Free &amp; Interactive</span>
          </div>
        </div>

        {/* DSA Studio Card */}
        <div
          className="hp-flagship-card hp-card-studio"
          onClick={() => {
            setActiveTab('catalog');
            setTimeout(() => {
              const el = document.getElementById('hp-dsa-section');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 50);
          }}
        >
          <div className="hp-fc-header">
            <span className="hp-fc-badge hp-badge-blue">⚡ DSA STUDIO</span>
            <span className="hp-fc-meta font-mono">40+ ALGORITHMS • SPEED RACE</span>
          </div>
          <h2 className="hp-fc-title">Data Structures &amp; Algorithm Visualizer</h2>
          <p className="hp-fc-desc">
            Watch sorting, searching, trees, and graphs execute step-by-step with real data and Big-O analytics.
          </p>
          <div className="hp-fc-snippet font-mono">
            <span className="fc-good">Quick: O(n log n) ⚡</span> <span className="fc-vs">vs</span> <span className="fc-bad">Bubble: O(n²)</span>
          </div>
          <div className="hp-fc-pills">
            <span className="hp-fc-pill">📊 Step Playback</span>
            <span className="hp-fc-pill">⚔️ Speed Race</span>
            <span className="hp-fc-pill">🌐 5 Languages</span>
          </div>
          <div className="hp-fc-footer">
            <button className="hp-btn-fc hp-btn-fc-blue">
              <span>Explore Visualizers</span>
              <ArrowRightIcon size={12} />
            </button>
            <span className="hp-fc-sub">40+ Algorithms Available</span>
          </div>
        </div>
      </section>

      {/* ══ SECTION 3: VALUE PILLARS ══════════════════════════════════════ */}
      <section className="hp-pillars">
        {[
          {
            icon: '🧠',
            title: 'Real-World Analogies',
            desc: 'Every concept is explained using physical analogies — RAM as a bookshelf, pointers as addresses — so mental models click fast.',
          },
          {
            icon: '🎬',
            title: 'Frame-by-Frame Tracing',
            desc: 'Watch every comparison, swap, and pointer move highlighted live. Pause, rewind, and replay any step you want.',
          },
          {
            icon: '🌐',
            title: 'Multi-Language Code',
            desc: 'See every algorithm in C, Python, C++, Java, and JavaScript side-by-side with the same visualizer running in sync.',
          },
        ].map(p => (
          <div key={p.title} className="hp-pillar-card">
            <div className="hp-pillar-icon">{p.icon}</div>
            <h3 className="hp-pillar-title">{p.title}</h3>
            <p className="hp-pillar-desc">{p.desc}</p>
          </div>
        ))}
      </section>

      {/* ══ SECTION 4: DSA VISUALIZER STUDIO ═══════════════════════════ */}
      <section className="hp-section" id="hp-dsa-section">
        <div className="hp-section-header">
          <div>
            <span className="hp-section-eyebrow font-mono">⚡ DSA VISUALIZER</span>
            <h2 className="hp-section-title">Algorithm Studio</h2>
            <p className="hp-section-sub">Watch algorithms execute step-by-step, race them head-to-head, and compare Big-O complexity.</p>
          </div>
        </div>

        <div className="hp-dsa-hub">
          {/* Card 1: Visualizations */}
          <div
            className={`hp-hub-card${activeTab === 'catalog' ? ' hp-hub-open' : ''}`}
            onClick={() => setActiveTab(t => t === 'catalog' ? null : 'catalog')}
          >
            <div className="hp-hub-card-top">
              <span className="hp-hub-status-pill hp-pill-green font-mono">● {ALGORITHMS.length} ALGORITHMS</span>
              <span className="hp-hub-badge font-mono">SORT • SEARCH • GRAPH • TREE</span>
            </div>
            <div className="hp-hub-icon-row">
              <span className="hp-hub-icon hp-icon-green">⚡</span>
              <h3 className="hp-hub-title">Interactive Visualizations</h3>
            </div>
            <p className="hp-hub-desc">Step through Sorting, Searching, Trees, Graphs with live step-by-step animation.</p>
            <div className="hp-mini-bars">
              {[35, 70, 45, 90, 60].map((h, i) => (
                <div key={i} className={`hp-mini-bar${i === 1 ? ' bar-active' : i === 3 ? ' bar-pivot' : ''}`} style={{ height: `${h}%` }} />
              ))}
            </div>
            <div className="hp-hub-footer">
              <button
                className="hp-btn-hub hp-btn-hub-green"
                onClick={e => { e.stopPropagation(); setActiveTab('catalog'); }}
              >
                <span>⚡ Explore Visualizers</span>
                <ArrowRightIcon size={12} />
              </button>
              <span className="hp-hub-hint font-mono">
                {activeTab === 'catalog' ? '▲ Close' : `▼ Open (${ALGORITHMS.length})`}
              </span>
            </div>

            {/* Catalog Drawer */}
            {activeTab === 'catalog' && (
              <div className="hp-drawer" onClick={e => e.stopPropagation()}>
                {/* Filter pills + search */}
                <div className="hp-drawer-header">
                  <div className="hp-cat-pills">
                    <button
                      className={`hp-cat-pill${activeCategory === 'all' ? ' active' : ''}`}
                      onClick={() => setActiveCategory('all')}
                    >
                      All ({ALGORITHMS.length})
                    </button>
                    {Object.entries(CATEGORIES).map(([key, cat]) => (
                      <button
                        key={key}
                        className={`hp-cat-pill${activeCategory === key ? ' active' : ''}`}
                        onClick={() => setActiveCategory(key)}
                      >
                        {cat.label} ({ALGORITHMS.filter(a => a.category === key).length})
                      </button>
                    ))}
                  </div>
                  <div className="hp-search-wrap">
                    <SearchIcon size={14} className="hp-search-ico" />
                    <input
                      type="text"
                      className="hp-search-field"
                      placeholder="Search algorithms..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button className="hp-search-x" onClick={() => setSearchQuery('')}>✕</button>
                    )}
                  </div>
                </div>

                {/* Algorithm cards grid */}
                <div className="hp-algo-grid">
                  {displayedAlgos.length === 0 ? (
                    <div className="hp-empty-state">
                      <p>No algorithms match "{searchQuery}"</p>
                      <button className="hp-btn-outline" onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}>
                        Reset Filters
                      </button>
                    </div>
                  ) : (
                    displayedAlgos.map(algo => {
                      const bookmarked = isBookmarked(algo.slug);
                      const completed = isCompleted(algo.slug);
                      const timeColor = getComplexityColor(algo.timeComplexity.average);
                      return (
                        <div
                          key={algo.slug}
                          className={`hp-algo-tile${completed ? ' tile-done' : ''}`}
                          onClick={() => onSelectAlgo(algo.slug)}
                        >
                          <div className="hp-tile-top">
                            <div className="hp-tile-identity">
                              <div className="hp-tile-icon">{getAlgoIcon(algo.slug, 15)}</div>
                              <div>
                                <h4 className="hp-tile-name">{algo.name}</h4>
                                <span className="hp-tile-cat font-mono">{CATEGORIES[algo.category]?.label}</span>
                              </div>
                            </div>
                            <button
                              className={`hp-bookmark-btn${bookmarked ? ' bookmarked' : ''}`}
                              onClick={e => { e.stopPropagation(); toggleBookmark(algo.slug); }}
                              aria-label="Bookmark"
                            >
                              <BookmarkIcon size={12} filled={bookmarked} />
                            </button>
                          </div>
                          <div className="hp-tile-metrics">
                            <span className="hp-metric-pill font-mono" style={{ color: timeColor }}>
                              <span className="metric-dot" style={{ background: timeColor }} />
                              {algo.timeComplexity.average}
                            </span>
                            <span className="hp-metric-pill font-mono">💾 {algo.spaceComplexity}</span>
                            {algo.stable && <span className="hp-metric-pill font-mono hp-stable">✓ Stable</span>}
                          </div>
                          <div className="hp-tile-footer">
                            <span className="hp-tile-hint font-mono">{algo.stable ? 'Preserves order' : 'In-place'}</span>
                            <span className="hp-tile-launch font-mono">Visualizer <ArrowRightIcon size={10} /></span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Show more */}
                {activeCategory === 'all' && !searchQuery && filteredAlgos.length > 8 && (
                  <div className="hp-show-more-row">
                    <button className="hp-btn-show-more font-mono" onClick={() => setShowAllAlgos(p => !p)}>
                      {showAllAlgos ? '▲ Show Top 8 Featured' : `▼ Show All ${ALGORITHMS.length} Algorithms`}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Card 2: Battle Arena */}
          <div
            className={`hp-hub-card${activeTab === 'duel' ? ' hp-hub-open' : ''}`}
            onClick={() => setActiveTab(t => t === 'duel' ? null : 'duel')}
          >
            <div className="hp-hub-card-top">
              <span className="hp-hub-status-pill hp-pill-amber font-mono">● LIVE DUEL</span>
              <span className="hp-hub-badge font-mono">SIDE-BY-SIDE SPEED RACE</span>
            </div>
            <div className="hp-hub-icon-row">
              <span className="hp-hub-icon hp-icon-amber">⚔️</span>
              <h3 className="hp-hub-title">Algorithm Battle Arena</h3>
            </div>
            <p className="hp-hub-desc">Race QuickSort, MergeSort, BubbleSort, and HeapSort against each other in real-time.</p>
            <div className="hp-duel-preview">
              <div className="hp-duel-lane">
                <span className="hp-lane-tag font-mono">MergeSort</span>
                <div className="hp-lane-bar"><div className="hp-lane-fill fill-blue" style={{ width: '85%' }} /></div>
                <span className="hp-lane-time font-mono">1.2ms</span>
              </div>
              <div className="hp-duel-lane">
                <span className="hp-lane-tag font-mono">QuickSort</span>
                <div className="hp-lane-bar"><div className="hp-lane-fill fill-amber" style={{ width: '100%' }} /></div>
                <span className="hp-lane-time font-mono">0.8ms 🏆</span>
              </div>
            </div>
            <div className="hp-hub-footer">
              <button
                className="hp-btn-hub hp-btn-hub-amber"
                onClick={e => { e.stopPropagation(); setActiveTab('duel'); }}
              >
                <span>⚔️ Launch Arena</span>
                <ArrowRightIcon size={12} />
              </button>
              <span className="hp-hub-hint font-mono">
                {activeTab === 'duel' ? '▲ Close Arena' : '▼ Open Race Arena'}
              </span>
            </div>

            {activeTab === 'duel' && (
              <div className="hp-drawer" onClick={e => e.stopPropagation()}>
                <AlgorithmDuel />
              </div>
            )}
          </div>

          {/* Card 3: Big-O Matrix */}
          <div
            className={`hp-hub-card${activeTab === 'matrix' ? ' hp-hub-open' : ''}`}
            onClick={() => setActiveTab(t => t === 'matrix' ? null : 'matrix')}
          >
            <div className="hp-hub-card-top">
              <span className="hp-hub-status-pill hp-pill-blue font-mono">● COMPLEXITY CHART</span>
              <span className="hp-hub-badge font-mono">LIVE SPEED CALCULATOR</span>
            </div>
            <div className="hp-hub-icon-row">
              <span className="hp-hub-icon hp-icon-blue">📈</span>
              <h3 className="hp-hub-title">Big-O Complexity Matrix</h3>
            </div>
            <p className="hp-hub-desc">Quick reference guide with a live calculator showing how input size affects performance.</p>
            <div className="hp-matrix-preview">
              {['O(1)', 'O(log n)', 'O(n)', 'O(n²)'].map((n, i) => (
                <span key={n} className={`hp-comp-chip font-mono comp-${['green', 'green', 'yellow', 'red'][i]}`}>{n}</span>
              ))}
            </div>
            <div className="hp-hub-footer">
              <button
                className="hp-btn-hub hp-btn-hub-blue"
                onClick={e => { e.stopPropagation(); setActiveTab('matrix'); }}
              >
                <span>📈 Open Matrix</span>
                <ArrowRightIcon size={12} />
              </button>
              <span className="hp-hub-hint font-mono">
                {activeTab === 'matrix' ? '▲ Close Matrix' : '▼ Open Complexity Table'}
              </span>
            </div>

            {activeTab === 'matrix' && (
              <div className="hp-drawer" onClick={e => e.stopPropagation()}>
                {/* Live Calculator */}
                <div className="hp-calc-card">
                  <div className="hp-calc-header">
                    <div>
                      <span className="hp-calc-badge font-mono">⚡ LIVE SPEED CALCULATOR</span>
                      <h4 className="hp-calc-title">Big-O Speed Calculator</h4>
                      <p className="hp-calc-sub">Move the slider to see how steps grow with input size.</p>
                    </div>
                    <div className="hp-slider-box">
                      <div className="hp-slider-label-row">
                        <span className="font-mono">Input Size (N):</span>
                        <span className="font-mono font-bold">{sliderN} items</span>
                      </div>
                      <input
                        type="range"
                        min="4" max="1024" step="4"
                        value={sliderN}
                        onChange={e => setSliderN(Number(e.target.value))}
                        className="hp-complexity-slider"
                      />
                    </div>
                  </div>
                  <div className="hp-calc-grid">
                    {complexityResults.map(d => (
                      <div key={d.notation} className="hp-calc-pill">
                        <div className="hp-calc-pill-head">
                          <span className="hp-calc-label">{d.label}</span>
                          <span className="hp-calc-notation font-mono" style={{ color: d.color }}>{d.notation}</span>
                        </div>
                        <span className="hp-calc-ops font-mono">{d.opsFormatted} steps</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Matrix Table */}
                <div className="hp-matrix-table-wrap">
                  <table className="hp-matrix-table">
                    <thead>
                      <tr>
                        <th>Algorithm</th>
                        <th>Category</th>
                        <th>Best</th>
                        <th>Average</th>
                        <th>Worst</th>
                        <th>Space</th>
                        <th>Stable</th>
                        <th>Run</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ALGORITHMS.map(algo => (
                        <tr key={algo.slug} onClick={() => onSelectAlgo(algo.slug)} className="hp-matrix-row">
                          <td className="font-mono font-bold">{algo.name}</td>
                          <td><span className="hp-mat-cat font-mono">{CATEGORIES[algo.category]?.label}</span></td>
                          <td><span className="font-mono" style={{ color: getComplexityColor(algo.timeComplexity.best) }}>{algo.timeComplexity.best}</span></td>
                          <td><span className="font-mono" style={{ color: getComplexityColor(algo.timeComplexity.average) }}>{algo.timeComplexity.average}</span></td>
                          <td><span className="font-mono" style={{ color: getComplexityColor(algo.timeComplexity.worst) }}>{algo.timeComplexity.worst}</span></td>
                          <td><span className="hp-mat-space font-mono">{algo.spaceComplexity}</span></td>
                          <td><span className={`hp-mat-stable${algo.stable ? ' is-stable' : ' is-unstable'}`}>{algo.stable ? '✓' : '✕'}</span></td>
                          <td>
                            <button className="hp-mat-run-btn" onClick={e => { e.stopPropagation(); onSelectAlgo(algo.slug); }}>
                              Run →
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══ SECTION 5: CODING ACADEMY HUB ═══════════════════════════════ */}
      <section className="hp-section" id="hp-academy-section">
        <div className="hp-section-header">
          <div>
            <span className="hp-section-eyebrow hp-eyebrow-green font-mono">🎓 CODING ACADEMY</span>
            <h2 className="hp-section-title">Coding Academy</h2>
            <p className="hp-section-sub">Learn programming step-by-step from beginner to advanced with interactive lessons and quizzes.</p>
          </div>
          <button
            className="hp-btn-academy"
            onClick={() => onOpenLearnC && onOpenLearnC('hello-world-intro')}
          >
            🎓 Start Chapter 1 →
          </button>
        </div>

        <div className="hp-courses-grid">
          {/* C Programming — LIVE */}
          <div
            className={`hp-course-card hp-course-c${expandedCourse === 'c' ? ' hp-course-open' : ''}`}
            onClick={() => setExpandedCourse(c => c === 'c' ? null : 'c')}
          >
            <div className="hp-course-top">
              <span className="hp-course-pill hp-pill-green font-mono">● LIVE & FREE</span>
              <span className="hp-course-meta font-mono">23 CHAPTERS • 230 QUIZZES</span>
            </div>
            <h3 className="hp-course-title">C Programming Academy</h3>
            <p className="hp-course-desc">Learn pointers, memory layout, structs, and dynamic memory with visual guides and a free certificate.</p>
            <div className="hp-course-footer">
              <button
                className="hp-btn-course hp-btn-course-c"
                onClick={e => { e.stopPropagation(); onOpenLearnC && onOpenLearnC('hello-world-intro'); }}
              >
                <span>Start Course</span>
                <ArrowRightIcon size={12} />
              </button>
              <span className="hp-course-hint font-mono">
                {expandedCourse === 'c' ? '▲ Close Details' : '▼ View Syllabus'}
              </span>
            </div>

            {expandedCourse === 'c' && (
              <div className="hp-drawer" onClick={e => e.stopPropagation()}>
                <div className="hp-drawer-banner">
                  <div>
                    <span className="hp-drawer-badge font-mono">11 CORE MODULES • 23 CHAPTERS</span>
                    <h4 className="hp-drawer-title">C Programming Course Outline</h4>
                    <p className="hp-drawer-sub">Select any module below to see its chapters.</p>
                  </div>
                  <button
                    className="hp-btn-sm-green"
                    onClick={() => onOpenLearnC && onOpenLearnC('hello-world-intro')}
                  >
                    🎓 Open Chapter 1 →
                  </button>
                </div>
                <div className="hp-modules-grid">
                  {C_MODULES.map((mod, mIdx) => {
                    const lessonsInMod = C_LESSONS.filter(l => l.moduleId === mod.id);
                    const isOpen = expandedModule === mod.id;
                    return (
                      <div key={mod.id} className={`hp-mod-card${isOpen ? ' mod-open' : ''}`}>
                        <div
                          className="hp-mod-header"
                          onClick={() => setExpandedModule(c => c === mod.id ? null : mod.id)}
                          role="button"
                          tabIndex={0}
                        >
                          <div className="hp-mod-left">
                            <span className="hp-mod-num font-mono">MODULE {mIdx + 1}</span>
                            <h5 className="hp-mod-title">{mod.name.replace(/^Module \d+:\s*/, '')}</h5>
                            <p className="hp-mod-desc">{mod.desc}</p>
                          </div>
                          <div className="hp-mod-right">
                            <span className="hp-mod-count font-mono">{lessonsInMod.length} Ch</span>
                            <span className="hp-mod-toggle font-mono">{isOpen ? '▲' : '▼'}</span>
                          </div>
                        </div>
                        {isOpen && (
                          <div className="hp-lessons-list">
                            {lessonsInMod.map(lesson => (
                              <div
                                key={lesson.slug}
                                className="hp-lesson-row"
                                onClick={() => onOpenLearnC && onOpenLearnC(lesson.slug)}
                                role="button"
                                tabIndex={0}
                              >
                                <span className="hp-lesson-num font-mono">{String(lesson.chapter).padStart(2, '0')}</span>
                                <div className="hp-lesson-info">
                                  <span className="hp-lesson-title">{lesson.title.replace(/^Chapter \d+:\s*/, '')}</span>
                                  <span className="hp-lesson-sub">{lesson.subtitle}</span>
                                </div>
                                <span className="hp-lesson-time font-mono">⏱ {lesson.readTime}</span>
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

          {/* Python — Preview */}
          <div
            className={`hp-course-card hp-course-python${expandedCourse === 'python' ? ' hp-course-open' : ''}`}
            onClick={() => { setExpandedCourse(c => c === 'python' ? null : 'python'); setExpandedModule('py-1'); }}
          >
            <div className="hp-course-top">
              <span className="hp-course-pill hp-pill-amber font-mono">● PREVIEW READY</span>
              <span className="hp-course-meta font-mono">12 MODULES</span>
            </div>
            <h3 className="hp-course-title">Python 3 Masterclass</h3>
            <p className="hp-course-desc">Learn Python basics, OOP, data structures, and solve problems directly in your browser.</p>
            <div className="hp-course-footer">
              <button
                className="hp-btn-course hp-btn-course-python"
                onClick={e => { e.stopPropagation(); onOpenPythonModal && onOpenPythonModal(); }}
              >
                <span>Preview Course</span>
                <ArrowRightIcon size={12} />
              </button>
              <span className="hp-course-hint font-mono">
                {expandedCourse === 'python' ? '▲ Close Details' : '▼ View Syllabus'}
              </span>
            </div>
            {expandedCourse === 'python' && (
              <div className="hp-drawer" onClick={e => e.stopPropagation()}>
                <div className="hp-drawer-banner">
                  <div>
                    <span className="hp-drawer-badge font-mono">12 PYTHON MODULES</span>
                    <h4 className="hp-drawer-title">Python 3 Course Outline</h4>
                  </div>
                  <button className="hp-btn-sm-amber" onClick={() => onOpenPythonModal && onOpenPythonModal()}>
                    🐍 Preview Syllabus →
                  </button>
                </div>
                <div className="hp-modules-grid">
                  {[
                    { id: 'py-1', num: 1, title: 'Python Core Syntax & Data Types', desc: 'Variables, basic types, list slicing, and dictionaries.', count: 2 },
                    { id: 'py-2', num: 2, title: 'Object-Oriented Python', desc: 'Classes, objects, functions, and reusable code patterns.', count: 2 },
                  ].map(m => (
                    <div key={m.id} className={`hp-mod-card${expandedModule === m.id ? ' mod-open' : ''}`}>
                      <div
                        className="hp-mod-header"
                        onClick={() => setExpandedModule(c => c === m.id ? null : m.id)}
                        role="button" tabIndex={0}
                      >
                        <div className="hp-mod-left">
                          <span className="hp-mod-num font-mono">MODULE {m.num}</span>
                          <h5 className="hp-mod-title">{m.title}</h5>
                          <p className="hp-mod-desc">{m.desc}</p>
                        </div>
                        <div className="hp-mod-right">
                          <span className="hp-mod-count font-mono">{m.count} Topics</span>
                          <span className="hp-mod-toggle font-mono">{expandedModule === m.id ? '▲' : '▼'}</span>
                        </div>
                      </div>
                      {expandedModule === m.id && (
                        <div className="hp-lessons-list">
                          <div className="hp-lesson-row" onClick={() => onOpenPythonModal && onOpenPythonModal()} role="button" tabIndex={0}>
                            <span className="hp-lesson-num font-mono">01</span>
                            <div className="hp-lesson-info">
                              <span className="hp-lesson-title">Python Setup & Running Scripts</span>
                              <span className="hp-lesson-sub">Getting started with Python</span>
                            </div>
                            <span className="hp-lesson-time font-mono">⏱ 15m</span>
                          </div>
                          <div className="hp-lesson-row" onClick={() => onOpenPythonModal && onOpenPythonModal()} role="button" tabIndex={0}>
                            <span className="hp-lesson-num font-mono">02</span>
                            <div className="hp-lesson-info">
                              <span className="hp-lesson-title">Lists, Tuples, Sets & Dictionaries</span>
                              <span className="hp-lesson-sub">Working with Python collections</span>
                            </div>
                            <span className="hp-lesson-time font-mono">⏱ 25m</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Java — Coming soon */}
          <div className="hp-course-card hp-course-java hp-course-soon">
            <div className="hp-course-top">
              <span className="hp-course-pill hp-pill-purple font-mono">● IN DEVELOPMENT</span>
              <span className="hp-course-meta font-mono">10 MODULES</span>
            </div>
            <h3 className="hp-course-title">Java &amp; OOP Foundations</h3>
            <p className="hp-course-desc">Learn Java basics, object-oriented design, Collections, and how Java runs programs efficiently.</p>
            <div className="hp-course-footer">
              <button className="hp-btn-course hp-btn-course-java" disabled>
                <span>Coming Soon</span>
              </button>
            </div>
          </div>

          {/* C++ — Coming soon */}
          <div className="hp-course-card hp-course-cpp hp-course-soon">
            <div className="hp-course-top">
              <span className="hp-course-pill hp-pill-purple font-mono">● IN DEVELOPMENT</span>
              <span className="hp-course-meta font-mono">10 MODULES</span>
            </div>
            <h3 className="hp-course-title">Modern C++ &amp; Fast Data Structures</h3>
            <p className="hp-course-desc">Learn modern C++, smart pointers, memory management, templates, and fast STL data structures.</p>
            <div className="hp-course-footer">
              <button className="hp-btn-course hp-btn-course-cpp" disabled>
                <span>Coming Soon</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SECTION 6: PLATFORM STATS STRIP ══════════════════════════════ */}
      <section className="hp-stats-strip">
        {[
          { value: '23', label: 'C Chapters', color: '#10b981' },
          { value: '230', label: 'Quizzes & Labs', color: '#2563eb' },
          { value: `${ALGORITHMS.length}+`, label: 'Algorithm Visualizers', color: '#8b5cf6' },
          { value: '100%', label: 'Free & Open Access', color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} className="hp-stat-item">
            <span className="hp-stat-value font-mono" style={{ color: s.color }}>{s.value}</span>
            <span className="hp-stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* ══ SECTION 7: FINAL CTA ══════════════════════════════════════════ */}
      <section className="hp-final-cta">
        <span className="hp-final-badge">🚀 START LEARNING TODAY</span>
        <h2 className="hp-final-title">Ready to Master Coding &amp; Algorithms?</h2>
        <p className="hp-final-desc">
          Join thousands of learners mastering programming and data structures through simple, step-by-step visual lessons.
        </p>
        <div className="hp-final-actions">
          <button
            className="hp-btn-academy"
            onClick={() => onOpenLearnC && onOpenLearnC('hello-world-intro')}
          >
            🎓 Start Learning C (23 Chapters) →
          </button>
          <button
            className="hp-btn-studio"
            onClick={() => onSelectAlgo('quick-sort')}
          >
            ⚡ Explore Algorithm Studio
          </button>
        </div>
      </section>
    </div>
  );
}
