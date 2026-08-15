// src/pages/HomePage.jsx — World-class DSA learning platform home & curriculum

import { useState, useMemo } from 'react';
import { ALGORITHMS, CATEGORIES } from '../data/algorithms.js';
import { SearchIcon, ArrowRightIcon, CodeIcon, PlayIcon } from '../components/Icons.jsx';

// Learning Tracks Curriculum
const LEARNING_TRACKS = [
  {
    id: 'sorting-foundations',
    title: 'Sorting Fundamentals',
    description: 'Learn iterative sorting mechanisms, adjacent swaps, and index partitioning.',
    difficulty: 'Beginner',
    diffColor: 'var(--success)',
    timeEst: '25 mins',
    algorithms: ['bubble-sort', 'selection-sort', 'insertion-sort'],
  },
  {
    id: 'divide-and-conquer',
    title: 'Divide & Conquer Sorting',
    description: 'Master logarithmic decompositions, recursive merges, pivot partitioning, and binary heaps.',
    difficulty: 'Intermediate',
    diffColor: 'var(--warning)',
    timeEst: '35 mins',
    algorithms: ['merge-sort', 'quick-sort', 'heap-sort'],
  },
  {
    id: 'searching-algorithms',
    title: 'Search Strategies',
    description: 'Understand sequential scans vs logarithmic interval bisection in sorted data.',
    difficulty: 'Beginner',
    diffColor: 'var(--success)',
    timeEst: '15 mins',
    algorithms: ['linear-search', 'binary-search'],
  },
  {
    id: 'graph-traversals',
    title: 'Graph Theory & Shortest Path',
    description: 'Traverse complex topologies using queues, recursion stacks, and greedy edge relaxation.',
    difficulty: 'Advanced',
    diffColor: 'var(--primary)',
    timeEst: '45 mins',
    algorithms: ['bfs', 'dfs', 'dijkstra'],
  },
  {
    id: 'tree-structures',
    title: 'Hierarchical Trees',
    description: 'Binary Search Tree property, dynamic subtree insertions, and logarithmic lookups.',
    difficulty: 'Intermediate',
    diffColor: 'var(--warning)',
    timeEst: '20 mins',
    algorithms: ['bst'],
  },
];

export default function HomePage({ onSelectAlgo }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('tracks'); // 'tracks' | 'catalog' | 'matrix'
  const [selectedLang, setSelectedLang] = useState('python');

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

  return (
    <div className="home-container">
      {/* ── 1. Platform Hero Header ── */}
      <section className="platform-hero">
        <div className="hero-badge-pill">
          <span>Interactive DSA Learning Platform</span>
        </div>

        <h1 className="platform-hero-title">
          Master Data Structures & Algorithms <br />
          <span className="hero-gradient-text">Through Visual Execution</span>
        </h1>

        <p className="platform-hero-sub">
          Bridge the gap between theoretical pseudocode and practical implementation.
          Observe pointer states, variable mutations, and line-by-line synchronized code execution across 5 programming languages.
        </p>

        <div className="platform-hero-actions">
          <button className="btn btn-primary btn-lg" onClick={() => onSelectAlgo('bubble-sort')}>
            <PlayIcon size={13} />
            <span>Start Learning Track</span>
          </button>
          <button className="btn btn-secondary btn-lg" onClick={() => setActiveTab('matrix')}>
            <span>View Big-O Matrix</span>
            <ArrowRightIcon size={13} />
          </button>
        </div>

        {/* ── Learning Metric Strip ── */}
        <div className="platform-stats-strip">
          <div className="platform-stat">
            <span className="stat-value">{ALGORITHMS.length}</span>
            <span className="stat-label">Core Algorithms</span>
          </div>
          <div className="platform-stat">
            <span className="stat-value">5</span>
            <span className="stat-label">Language Targets</span>
          </div>
          <div className="platform-stat">
            <span className="stat-value">5</span>
            <span className="stat-label">Structured Tracks</span>
          </div>
          <div className="platform-stat">
            <span className="stat-value">100%</span>
            <span className="stat-label">Step-by-Step Control</span>
          </div>
        </div>
      </section>

      {/* ── 2. Platform Navigation Tabs ── */}
      <div className="platform-view-tabs">
        <button
          className={`platform-tab ${activeTab === 'tracks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tracks')}
        >
          Curriculum Tracks
        </button>
        <button
          className={`platform-tab ${activeTab === 'catalog' ? 'active' : ''}`}
          onClick={() => setActiveTab('catalog')}
        >
          Algorithm Directory ({ALGORITHMS.length})
        </button>
        <button
          className={`platform-tab ${activeTab === 'matrix' ? 'active' : ''}`}
          onClick={() => setActiveTab('matrix')}
        >
          Big-O Complexity Matrix
        </button>
      </div>

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
                  <div className="track-card-header">
                    <span className="track-step-num">Track {idx + 1}</span>
                    <span className="track-difficulty" style={{ color: track.diffColor, borderColor: `${track.diffColor}44` }}>
                      {track.difficulty}
                    </span>
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
                        <span className="module-name">{algo.name}</span>
                        <span className="module-comp">{algo.timeComplexity.average}</span>
                      </div>
                    ))}
                  </div>

                  <div className="track-card-footer">
                    <span className="track-time-est">Est: {track.timeEst}</span>
                    <button
                      className="btn btn-sm btn-primary"
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
                    {cat.label} ({count})
                  </button>
                );
              })}
            </div>

            <div className="search-box-compact">
              <SearchIcon size={13} className="search-icon" />
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
                <button className="btn btn-sm" onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}>
                  Clear Search
                </button>
              </div>
            ) : (
              filteredAlgos.map(algo => {
                const catLabel = CATEGORIES[algo.category]?.label || algo.category;
                return (
                  <div
                    key={algo.slug}
                    className="compact-card"
                    onClick={() => onSelectAlgo(algo.slug)}
                  >
                    <div className="compact-card-top">
                      <span className="compact-card-name">{algo.name}</span>
                      <span className="compact-card-cat">{catLabel}</span>
                    </div>

                    <p className="compact-card-desc">{algo.description}</p>

                    <div className="compact-card-bottom">
                      <div className="compact-tags">
                        <span className="tag-time">{algo.timeComplexity.average}</span>
                        <span className="tag-space">Space {algo.spaceComplexity}</span>
                      </div>
                      <span className="compact-arrow">
                        <ArrowRightIcon size={12} />
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
                  return (
                    <tr key={algo.slug} className="matrix-row">
                      <td className="matrix-algo-name">{algo.name}</td>
                      <td><span className="matrix-cat-tag">{catLabel}</span></td>
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

      {/* ── 6. Multi-Language Interactive Showcase ── */}
      <section className="lang-showcase-section">
        <div className="lang-showcase-card">
          <div className="lang-showcase-content">
            <span className="hero-compact-badge">Multi-Language Code Engine</span>
            <h3 className="showcase-title">Study in Your Preferred Programming Language</h3>
            <p className="showcase-desc">
              Whether you are preparing for coding interviews in Python, competitive programming in C++, or systems coursework in C/Java, AlgoViz synchronizes execution across all five language targets.
            </p>
            <div className="lang-pills-row">
              {['Python', 'C', 'C++', 'Java', 'JavaScript'].map(lang => (
                <span
                  key={lang}
                  className={`lang-select-chip ${selectedLang.toLowerCase() === lang.toLowerCase() ? 'active' : ''}`}
                  onClick={() => setSelectedLang(lang.toLowerCase())}
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
