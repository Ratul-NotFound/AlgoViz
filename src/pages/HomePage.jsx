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
export default function HomePage({ onSelectAlgo, onOpenLearnC, onOpenPythonModal, initialTab = null }) {
  const { isBookmarked, toggleBookmark, isCompleted } = useAuth();

  /* Catalog state - closed by default */
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(initialTab || null); // null | 'catalog' | 'duel' | 'matrix'
  const [showAllAlgos, setShowAllAlgos] = useState(false);

  /* Academy state - closed by default */
  const [expandedCourse, setExpandedCourse] = useState(null); // null | 'c' | 'python' | 'java' | 'cpp'
  const [expandedModule, setExpandedModule] = useState(null);

  /* Big-O slider */
  const [sliderN, setSliderN] = useState(64);

  /* Hero sandbox state */
  const [heroMode, setHeroMode] = useState('quick'); // 'quick' | 'bubble' | 'binary'
  const [heroArray, setHeroArray] = useState([42, 18, 85, 29, 67, 12, 94, 38, 55, 73]);
  const [heroActiveIdx, setHeroActiveIdx] = useState({ i: -1, j: -1, pivot: -1, sorted: false, found: false });
  const [heroSorting, setHeroSorting] = useState(false);
  const [heroStats, setHeroStats] = useState({ step: 0, comps: 0, swaps: 0 });
  const heroTimerRef = useRef(null);
  const heroFramesRef = useRef([]);
  const heroFrameIdxRef = useRef(0);

  useEffect(() => {
    if (initialTab !== undefined) setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => () => clearInterval(heroTimerRef.current), []);

  /* Generate trace frames for accurate step-by-step playback */
  const generateFrames = (mode, arrInput) => {
    const arr = [...arrInput];
    const frames = [];
    let comps = 0;
    let swaps = 0;

    if (mode === 'bubble') {
      const n = arr.length;
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          comps++;
          frames.push({
            array: [...arr],
            active: { i: j, j: j + 1, pivot: -1 },
            stats: { step: frames.length + 1, comps, swaps },
          });
          if (arr[j] > arr[j + 1]) {
            swaps++;
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            frames.push({
              array: [...arr],
              active: { i: j, j: j + 1, pivot: -1 },
              stats: { step: frames.length + 1, comps, swaps },
            });
          }
        }
      }
      frames.push({
        array: [...arr],
        active: { i: -1, j: -1, pivot: -1, sorted: true },
        stats: { step: frames.length + 1, comps, swaps },
      });
    } else if (mode === 'binary') {
      const sortedArr = [...arr].sort((a, b) => a - b);
      const target = sortedArr[Math.floor(Math.random() * sortedArr.length)];
      let left = 0;
      let right = sortedArr.length - 1;

      while (left <= right) {
        comps++;
        const mid = Math.floor((left + right) / 2);
        frames.push({
          array: [...sortedArr],
          active: { i: left, j: right, pivot: mid },
          stats: { step: frames.length + 1, comps, swaps: 0 },
        });

        if (sortedArr[mid] === target) {
          frames.push({
            array: [...sortedArr],
            active: { i: mid, j: mid, pivot: mid, found: true, sorted: true },
            stats: { step: frames.length + 1, comps, swaps: 0 },
          });
          break;
        } else if (sortedArr[mid] < target) {
          left = mid + 1;
        } else {
          right = mid - 1;
        }
      }
    } else {
      // Quick sort trace
      function qs(low, high) {
        if (low < high) {
          const pivotVal = arr[high];
          let i = low - 1;

          for (let j = low; j < high; j++) {
            comps++;
            frames.push({
              array: [...arr],
              active: { i: Math.max(0, i), j, pivot: high },
              stats: { step: frames.length + 1, comps, swaps },
            });

            if (arr[j] < pivotVal) {
              i++;
              swaps++;
              [arr[i], arr[j]] = [arr[j], arr[i]];
              frames.push({
                array: [...arr],
                active: { i, j, pivot: high },
                stats: { step: frames.length + 1, comps, swaps },
              });
            }
          }
          swaps++;
          [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
          const pi = i + 1;
          frames.push({
            array: [...arr],
            active: { i: pi, j: pi, pivot: -1 },
            stats: { step: frames.length + 1, comps, swaps },
          });

          qs(low, pi - 1);
          qs(pi + 1, high);
        }
      }
      qs(0, arr.length - 1);
      frames.push({
        array: [...arr],
        active: { i: -1, j: -1, pivot: -1, sorted: true },
        stats: { step: frames.length + 1, comps, swaps },
      });
    }
    return frames;
  };

  /* Hero sandbox helpers */
  const shuffleHero = () => {
    clearInterval(heroTimerRef.current);
    setHeroSorting(false);
    setHeroActiveIdx({ i: -1, j: -1, pivot: -1, sorted: false, found: false });
    setHeroStats({ step: 0, comps: 0, swaps: 0 });
    heroFramesRef.current = [];
    heroFrameIdxRef.current = 0;
    const fresh = Array.from({ length: 10 }, () => Math.floor(Math.random() * 75) + 20);
    if (heroMode === 'binary') fresh.sort((a, b) => a - b);
    setHeroArray(fresh);
  };

  const handleSwitchHeroMode = (mode) => {
    clearInterval(heroTimerRef.current);
    setHeroSorting(false);
    setHeroActiveIdx({ i: -1, j: -1, pivot: -1, sorted: false, found: false });
    setHeroStats({ step: 0, comps: 0, swaps: 0 });
    setHeroMode(mode);
    heroFramesRef.current = [];
    heroFrameIdxRef.current = 0;
    const fresh = Array.from({ length: 10 }, () => Math.floor(Math.random() * 75) + 20);
    if (mode === 'binary') fresh.sort((a, b) => a - b);
    setHeroArray(fresh);
  };

  const runHeroAnimation = () => {
    if (heroSorting) {
      clearInterval(heroTimerRef.current);
      setHeroSorting(false);
      return;
    }

    if (!heroFramesRef.current.length || heroFrameIdxRef.current >= heroFramesRef.current.length) {
      heroFramesRef.current = generateFrames(heroMode, heroArray);
      heroFrameIdxRef.current = 0;
    }

    setHeroSorting(true);
    const speed = heroMode === 'binary' ? 320 : 100;

    heroTimerRef.current = setInterval(() => {
      if (heroFrameIdxRef.current < heroFramesRef.current.length) {
        const frame = heroFramesRef.current[heroFrameIdxRef.current];
        setHeroArray([...frame.array]);
        setHeroActiveIdx(frame.active);
        setHeroStats(frame.stats);
        heroFrameIdxRef.current++;
      } else {
        clearInterval(heroTimerRef.current);
        setHeroSorting(false);
        setHeroActiveIdx(prev => ({ ...prev, sorted: true }));
      }
    }, speed);
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
              <button className="hp-sb-icon-btn" onClick={shuffleHero} title="Shuffle Data">
                <ShuffleIcon size={12} />
              </button>
              <button className="hp-sb-play-btn" onClick={runHeroAnimation} title={heroSorting ? 'Pause Simulation' : 'Run Simulation'}>
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
              const isSorted = heroActiveIdx.sorted;
              const isActive = isI || isJ || isPivot;
              return (
                <div key={idx} className="hp-sb-col">
                  <div className="hp-sb-bar-track">
                    <div
                      className={`hp-sb-bar${isActive ? ' active' : ''}${isPivot ? ' pivot' : ''}${isSorted ? ' sorted' : ''}`}
                      style={{ height: `${Math.max(16, val)}%` }}
                    />
                  </div>
                  <span className="hp-sb-val font-mono">{val}</span>
                  {isI && <span className="hp-sb-ptr hp-ptr-i">{heroMode === 'binary' ? 'L' : 'i'}</span>}
                  {isJ && <span className="hp-sb-ptr hp-ptr-j">{heroMode === 'binary' ? 'R' : 'j'}</span>}
                  {isPivot && <span className="hp-sb-ptr hp-ptr-p">{heroMode === 'binary' ? 'M' : 'P'}</span>}
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
            Learn C from absolute basics to advanced memory mastery. Write code, compile in-browser, and master pointers through real physical mental models.
          </p>

          {/* Creative Conceptual C Learning Workbench */}
          <div className="hp-fc-canvas canvas-c-ide font-mono">
            {/* Editor Window Header */}
            <div className="c-ide-header">
              <div className="c-ide-tabs">
                <span className="c-ide-tab active">
                  <span className="tab-icon">📄</span>
                  <span>main.c</span>
                </span>
                <span className="c-ide-tab-dim">lesson_01.h</span>
              </div>
              <div className="c-ide-target">
                <span className="gcc-badge">gcc 13.2</span>
                <span className="wasm-badge">⚡ WASM</span>
              </div>
            </div>

            {/* Split Editor + Live Terminal Output */}
            <div className="c-ide-body">
              {/* Code Panel */}
              <div className="c-code-panel">
                <div className="code-line"><span className="ln">1</span><span><span className="kw-c">#include</span> <span className="str-c">&lt;stdio.h&gt;</span></span></div>
                <div className="code-line"><span className="ln">2</span><span><span className="kw-c">int</span> <span className="fn-c">main</span>() &#123;</span></div>
                <div className="code-line indent"><span className="ln">3</span><span><span className="fn-c">printf</span>(<span className="str-c">&quot;Hello, C!\n&quot;</span>);</span></div>
                <div className="code-line indent"><span className="ln">4</span><span><span className="kw-c">return</span> <span className="num-c">0</span>;</span></div>
                <div className="code-line"><span className="ln">5</span><span>&#125;</span></div>
              </div>

              {/* Terminal / Live Learning Output Panel */}
              <div className="c-term-panel">
                <div className="term-header">
                  <span className="term-dot green-dot" />
                  <span>TERMINAL OUTPUT</span>
                </div>
                <div className="term-body">
                  <div className="term-out-text">&gt; Hello, C!</div>
                  <div className="term-status-badge">✓ Exit 0 &bull; 0 Errors</div>
                  <div className="term-ch-track">
                    <span className="ch-prog-text">Chapter 1/23</span>
                    <div className="ch-prog-bar"><div className="ch-prog-fill" style={{ width: '15%' }} /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hp-fc-pills">
            <span className="hp-fc-pill">🟢 01 Basics</span>
            <span className="hp-fc-pill">🔵 05 Pointers &amp; RAM</span>
            <span className="hp-fc-pill">🟣 12 Structs &amp; Nodes</span>
            <span className="hp-fc-pill">🟠 20 Dynamic Memory</span>
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

          {/* Rich Graphical Multi-Visualizer Stage */}
          <div className="hp-fc-canvas canvas-dsa-stage font-mono">
            <div className="dsa-stage-top">
              <div className="dsa-telemetry-badge">
                <span className="tel-dot active" />
                <span>QuickSort &bull; Pivot [42] &bull; Step 14/28</span>
              </div>
              <span className="dsa-lang-tag">C &bull; Python &bull; Java &bull; JS</span>
            </div>

            <div className="dsa-visual-duo">
              {/* Mini Array Wave */}
              <div className="dsa-array-wave">
                {[
                  { v: 18, h: 35, type: 'sorted' },
                  { v: 29, h: 52, type: 'active' },
                  { v: 42, h: 76, type: 'pivot' },
                  { v: 67, h: 88, type: 'compare' },
                  { v: 85, h: 95, type: 'normal' },
                  { v: 94, h: 100, type: 'sorted' },
                ].map((b, i) => (
                  <div key={i} className="dsa-wave-col">
                    <div className={`dsa-wave-bar bar-${b.type}`} style={{ height: `${b.h}%` }} />
                    <span className="dsa-wave-num">{b.v}</span>
                  </div>
                ))}
              </div>

              {/* Mini Graph Nodes */}
              <div className="dsa-graph-mini">
                <svg viewBox="0 0 110 65" className="dsa-graph-svg" fill="none">
                  <line x1="20" y1="20" x2="55" y2="45" stroke="#3b82f6" strokeWidth="1.5" />
                  <line x1="55" y1="45" x2="90" y2="20" stroke="#10b981" strokeWidth="2" />
                  <line x1="20" y1="20" x2="90" y2="20" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="2 2" />

                  <circle cx="20" cy="20" r="10" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" />
                  <text x="20" y="24" textAnchor="middle" fill="#60a5fa" fontSize="8" fontWeight="700">A</text>

                  <circle cx="55" cy="45" r="10" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" />
                  <text x="55" y="49" textAnchor="middle" fill="#60a5fa" fontSize="8" fontWeight="700">B</text>

                  <circle cx="90" cy="20" r="11" fill="#10b981" fillOpacity="0.2" stroke="#10b981" strokeWidth="2" />
                  <text x="90" y="24" textAnchor="middle" fill="#10b981" fontSize="8.5" fontWeight="800">C</text>
                  <text x="90" y="38" textAnchor="middle" fill="#10b981" fontSize="6.5" fontWeight="700">PATH</text>
                </svg>
              </div>
            </div>
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

        {/* 3-Column Conceptual Cards Grid */}
        <div className="hp-hub-grid">
          {/* Card 1: Visualizations */}
          <div
            className={`hp-hub-card${activeTab === 'catalog' ? ' hp-hub-open' : ''}`}
            onClick={() => setActiveTab(t => t === 'catalog' ? null : 'catalog')}
          >
            <div className="hp-hub-card-top">
              <span className="hp-hub-status-pill hp-pill-green font-mono">● {ALGORITHMS.length} ALGORITHMS</span>
              <span className="hp-hub-badge font-mono">STEP-BY-STEP TRACE</span>
            </div>
            <div className="hp-hub-icon-row">
              <span className="hp-hub-icon hp-icon-green">⚡</span>
              <h3 className="hp-hub-title">Interactive Visualizations</h3>
            </div>
            <p className="hp-hub-desc">Step through sorting, searching, trees, and graphs with live pointers and variable trace.</p>

            {/* Creative Graphical SVG Preview: Tree & Array Visualizer */}
            <div className="hp-graphical-canvas canvas-visualizer">
              <svg viewBox="0 0 320 110" className="hp-svg-diagram" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Tree Branches */}
                <path d="M160 22 L100 56" stroke="rgba(59,130,246,0.4)" strokeWidth="2" strokeDasharray="3 3" />
                <path d="M160 22 L220 56" stroke="rgba(16,185,129,0.4)" strokeWidth="2" />
                <path d="M100 56 L65 88" stroke="rgba(59,130,246,0.3)" strokeWidth="1.5" />
                <path d="M100 56 L135 88" stroke="#10b981" strokeWidth="2" />
                <path d="M220 56 L255 88" stroke="rgba(16,185,129,0.3)" strokeWidth="1.5" />

                {/* Curved Swap Arc */}
                <path d="M65 92 Q 100 70 135 92" stroke="#f59e0b" strokeWidth="1.5" fill="none" strokeDasharray="2 2" />

                {/* Nodes */}
                <g className="svg-node">
                  <circle cx="160" cy="22" r="14" fill="#0284c7" fillOpacity="0.2" stroke="#0284c7" strokeWidth="1.5" />
                  <text x="160" y="26" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="700" fontFamily="monospace">50</text>
                </g>
                <g className="svg-node">
                  <circle cx="100" cy="56" r="12" fill="#2563eb" fillOpacity="0.2" stroke="#2563eb" strokeWidth="1.5" />
                  <text x="100" y="60" textAnchor="middle" fill="#60a5fa" fontSize="9.5" fontWeight="700" fontFamily="monospace">25</text>
                </g>
                <g className="svg-node">
                  <circle cx="220" cy="56" r="12" fill="#10b981" fillOpacity="0.2" stroke="#10b981" strokeWidth="1.5" />
                  <text x="220" y="60" textAnchor="middle" fill="#34d399" fontSize="9.5" fontWeight="700" fontFamily="monospace">75</text>
                </g>
                <g className="svg-node">
                  <circle cx="65" cy="88" r="11" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                  <text x="65" y="92" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="600" fontFamily="monospace">15</text>
                </g>
                <g className="svg-node target-node">
                  <circle cx="135" cy="88" r="12" fill="#10b981" fillOpacity="0.3" stroke="#10b981" strokeWidth="2" />
                  <text x="135" y="92" textAnchor="middle" fill="#10b981" fontSize="9.5" fontWeight="800" fontFamily="monospace">35</text>
                  <text x="135" y="105" textAnchor="middle" fill="#10b981" fontSize="7" fontWeight="700" fontFamily="sans-serif">FOUND</text>
                </g>
                <g className="svg-node">
                  <circle cx="255" cy="88" r="11" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                  <text x="255" y="92" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="600" fontFamily="monospace">90</text>
                </g>
              </svg>
              <div className="hp-canvas-footer font-mono">
                <span className="c-pill green-pill">● Binary Search Tree</span>
                <span className="c-pill blue-pill">40+ Simulators</span>
              </div>
            </div>

            <div className="hp-hub-footer">
              <button
                className="hp-btn-hub hp-btn-hub-green"
                onClick={e => { e.stopPropagation(); setActiveTab(t => t === 'catalog' ? null : 'catalog'); }}
              >
                <span>⚡ Explore Visualizers</span>
                <ArrowRightIcon size={12} />
              </button>
              <span className="hp-hub-hint font-mono">
                {activeTab === 'catalog' ? '▲ Close' : `▼ Open (${ALGORITHMS.length})`}
              </span>
            </div>
          </div>

          {/* Card 2: Battle Arena */}
          <div
            className={`hp-hub-card${activeTab === 'duel' ? ' hp-hub-open' : ''}`}
            onClick={() => setActiveTab(t => t === 'duel' ? null : 'duel')}
          >
            <div className="hp-hub-card-top">
              <span className="hp-hub-status-pill hp-pill-amber font-mono">● SPEED BENCHMARK</span>
              <span className="hp-hub-badge font-mono">SIDE-BY-SIDE RACE</span>
            </div>
            <div className="hp-hub-icon-row">
              <span className="hp-hub-icon hp-icon-amber">⚔️</span>
              <h3 className="hp-hub-title">Algorithm Battle Arena</h3>
            </div>
            <p className="hp-hub-desc">Race sorting algorithms head-to-head on identical arrays to see algorithmic speed in action.</p>

            {/* Creative Graphical SVG Preview: Race Telemetry Track */}
            <div className="hp-graphical-canvas canvas-duel">
              <div className="hp-race-hud font-mono">
                {/* Lane 1 */}
                <div className="race-lane-row">
                  <div className="lane-header">
                    <span className="lane-badge badge-winner">🏎️ QuickSort O(n log n)</span>
                    <span className="lane-time winner">1.2ms 🏆</span>
                  </div>
                  <div className="race-track">
                    <div className="race-boost-fill fill-quick" style={{ width: '96%' }} />
                    <span className="race-flag">🏁</span>
                  </div>
                </div>

                {/* Lane 2 */}
                <div className="race-lane-row">
                  <div className="lane-header">
                    <span className="lane-badge badge-slow">🐢 BubbleSort O(n²)</span>
                    <span className="lane-time slower">48.6ms (40x)</span>
                  </div>
                  <div className="race-track">
                    <div className="race-boost-fill fill-bubble" style={{ width: '28%' }} />
                    <span className="race-flag">🏁</span>
                  </div>
                </div>
              </div>

              <div className="hp-canvas-footer font-mono">
                <span className="c-pill amber-pill">⚡ 10K Elements Race</span>
                <span className="c-pill gray-pill">Live Delta HUD</span>
              </div>
            </div>

            <div className="hp-hub-footer">
              <button
                className="hp-btn-hub hp-btn-hub-amber"
                onClick={e => { e.stopPropagation(); setActiveTab(t => t === 'duel' ? null : 'duel'); }}
              >
                <span>⚔️ Launch Arena</span>
                <ArrowRightIcon size={12} />
              </button>
              <span className="hp-hub-hint font-mono">
                {activeTab === 'duel' ? '▲ Close Arena' : '▼ Open Race Arena'}
              </span>
            </div>
          </div>

          {/* Card 3: Big-O Matrix */}
          <div
            className={`hp-hub-card${activeTab === 'matrix' ? ' hp-hub-open' : ''}`}
            onClick={() => setActiveTab(t => t === 'matrix' ? null : 'matrix')}
          >
            <div className="hp-hub-card-top">
              <span className="hp-hub-status-pill hp-pill-blue font-mono">● GROWTH ANALYZER</span>
              <span className="hp-hub-badge font-mono">STEP CALCULATOR</span>
            </div>
            <div className="hp-hub-icon-row">
              <span className="hp-hub-icon hp-icon-blue">📈</span>
              <h3 className="hp-hub-title">Big-O Complexity Matrix</h3>
            </div>
            <p className="hp-hub-desc">Analyze performance curves and calculate exact CPU steps across logarithmic and quadratic scales.</p>

            {/* Creative Graphical SVG Preview: Big-O Coordinate Graph */}
            <div className="hp-graphical-canvas canvas-matrix">
              <svg viewBox="0 0 320 110" className="hp-svg-diagram" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Coordinate Grid */}
                <line x1="30" y1="95" x2="300" y2="95" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                <line x1="30" y1="10" x2="30" y2="95" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                <line x1="30" y1="55" x2="300" y2="55" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="165" y1="10" x2="165" y2="95" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3 3" />

                {/* O(1) Constant (Green) */}
                <line x1="30" y1="90" x2="300" y2="90" stroke="#10b981" strokeWidth="2" />
                <text x="260" y="86" fill="#10b981" fontSize="8" fontWeight="700" fontFamily="monospace">O(1)</text>

                {/* O(log n) (Teal) */}
                <path d="M30 92 Q 100 85 300 78" stroke="#06b6d4" strokeWidth="2" />
                <text x="260" y="74" fill="#06b6d4" fontSize="8" fontWeight="700" fontFamily="monospace">O(log n)</text>

                {/* O(n) Linear (Blue) */}
                <line x1="30" y1="95" x2="280" y2="45" stroke="#3b82f6" strokeWidth="2" />
                <text x="265" y="42" fill="#3b82f6" fontSize="8" fontWeight="700" fontFamily="monospace">O(n)</text>

                {/* O(n log n) (Amber) */}
                <path d="M30 95 Q 180 75 250 25" stroke="#f59e0b" strokeWidth="2" />
                <text x="220" y="20" fill="#f59e0b" fontSize="8" fontWeight="700" fontFamily="monospace">O(n log n)</text>

                {/* O(n^2) Quadratic (Red) with Danger Zone */}
                <path d="M30 95 Q 90 90 120 15" stroke="#ef4444" strokeWidth="2.5" />
                <text x="125" y="18" fill="#ef4444" fontSize="8.5" fontWeight="800" fontFamily="monospace">O(n²)</text>

                {/* Axis Labels */}
                <text x="15" y="55" fill="#64748b" fontSize="7" fontWeight="600" fontFamily="sans-serif">Ops</text>
                <text x="290" y="105" fill="#64748b" fontSize="7" fontWeight="600" fontFamily="sans-serif">N</text>
              </svg>
              <div className="hp-canvas-footer font-mono">
                <span className="c-pill purple-pill">📈 Coordinate Growth Graph</span>
                <span className="c-pill blue-pill">Interactive N-Slider</span>
              </div>
            </div>

            <div className="hp-hub-footer">
              <button
                className="hp-btn-hub hp-btn-hub-blue"
                onClick={e => { e.stopPropagation(); setActiveTab(t => t === 'matrix' ? null : 'matrix'); }}
              >
                <span>📈 Open Matrix</span>
                <ArrowRightIcon size={12} />
              </button>
              <span className="hp-hub-hint font-mono">
                {activeTab === 'matrix' ? '▲ Close Matrix' : '▼ Open Complexity Table'}
              </span>
            </div>
          </div>
        </div>

        {/* Dedicated Unfolded Drawer for Active Section */}
        {activeTab === 'catalog' && (
          <div className="hp-drawer hp-drawer-expanded" onClick={e => e.stopPropagation()}>
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
                  placeholder="Search algorithms (e.g. quick, binary search, tree)..."
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
                  {showAllAlgos ? '▲ Show Top 8 Featured' : `▼ Show All ${ALGORITHMS.length} Algorithms (+${ALGORITHMS.length - 8} more)`}
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'duel' && (
          <div className="hp-drawer hp-drawer-expanded" onClick={e => e.stopPropagation()}>
            <AlgorithmDuel />
          </div>
        )}

        {activeTab === 'matrix' && (
          <div className="hp-drawer hp-drawer-expanded" onClick={e => e.stopPropagation()}>
            {/* Live Calculator */}
            <div className="hp-calc-card">
              <div className="hp-calc-header">
                <div>
                  <span className="hp-calc-badge font-mono">⚡ LIVE SPEED CALCULATOR</span>
                  <h4 className="hp-calc-title">Big-O Speed &amp; Operations Calculator</h4>
                  <p className="hp-calc-sub">Move the slider to see how steps grow exponentially with input size.</p>
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
