// src/pages/HomePage.jsx — Professional technical catalog for AlgoViz

import { useState, useMemo } from 'react';
import { ALGORITHMS, CATEGORIES } from '../data/algorithms.js';
import { SearchIcon, ArrowRightIcon } from '../components/Icons.jsx';

export default function HomePage({ onSelectAlgo }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter algorithms by category and search query
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
      {/* ── 1. Hero Documentation Header ── */}
      <section className="hero-section" style={{ gridTemplateColumns: '1fr' }}>
        <div className="hero-content" style={{ maxWidth: '820px' }}>
          <div className="hero-badge-pill">
            <span>Algorithm Visualization & Analysis Platform</span>
          </div>

          <h1 className="hero-heading">
            Data Structures & <span className="hero-gradient-text">Algorithms Visualizer</span>
          </h1>

          <p className="hero-subtext">
            Step-by-step visual execution engine with real-time pointer tracking,
            variable state inspection, and synchronized code execution across
            <strong> Python, C, C++, Java, and JavaScript</strong>.
          </p>

          <div className="hero-cta-group">
            <button className="btn btn-primary btn-lg" onClick={() => onSelectAlgo('bubble-sort')}>
              <span>Quick Start: Bubble Sort</span>
              <ArrowRightIcon size={14} />
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => onSelectAlgo('dijkstra')}>
              <span>Graph Search: Dijkstra</span>
            </button>
          </div>

          <div className="hero-feature-tags">
            <span>Synchronized Code Editor</span>
            <span>•</span>
            <span>Variable State Inspector</span>
            <span>•</span>
            <span>Step-by-Step Playback</span>
            <span>•</span>
            <span>Custom Datasets</span>
          </div>
        </div>
      </section>

      {/* ── 2. Metric Overview Strip ── */}
      <section className="stats-strip">
        <div className="stat-item">
          <div className="stat-num">{ALGORITHMS.length}</div>
          <div className="stat-desc">Supported Algorithms</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">5</div>
          <div className="stat-desc">Language Implementations</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">4</div>
          <div className="stat-desc">Algorithm Domains</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">O(1) – O(V²)</div>
          <div className="stat-desc">Complexity Spectrum</div>
        </div>
      </section>

      {/* ── 3. Search & Filter Bar ── */}
      <section className="catalog-header">
        <div className="catalog-header-top">
          <div>
            <h2 className="section-heading">Algorithm Directory</h2>
            <p className="section-subheading">Select an algorithm to launch the interactive visualization workspace.</p>
          </div>

          {/* Search Box */}
          <div className="search-box">
            <SearchIcon size={14} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by name or complexity (e.g. quick, O(log n))..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => setSearchQuery('')}>✕</button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="category-pills">
          <button
            className={`category-pill ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All ({ALGORITHMS.length})
          </button>
          {Object.entries(CATEGORIES).map(([key, cat]) => {
            const count = ALGORITHMS.filter(a => a.category === key).length;
            return (
              <button
                key={key}
                className={`category-pill ${activeCategory === key ? 'active' : ''}`}
                onClick={() => setActiveCategory(key)}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>
      </section>

      {/* ── 4. Algorithm Catalog Grid ── */}
      <section className="algo-catalog-grid">
        {filteredAlgos.length === 0 ? (
          <div className="no-results-box">
            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>No matching algorithms</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
              Try searching for "sort", "search", "dijkstra", or "bst"
            </div>
            <button className="btn btn-sm" style={{ marginTop: 12 }} onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}>
              Reset Filters
            </button>
          </div>
        ) : (
          filteredAlgos.map(algo => {
            const catLabel = CATEGORIES[algo.category]?.label || algo.category;
            return (
              <div
                key={algo.slug}
                className="catalog-card"
                onClick={() => onSelectAlgo(algo.slug)}
              >
                <div className="catalog-card-header">
                  <span className="category-tag-sm">{catLabel}</span>
                  <span className="complexity-badge-sm">
                    {algo.timeComplexity.average}
                  </span>
                </div>

                <h3 className="catalog-card-title">{algo.name}</h3>
                <p className="catalog-card-desc">{algo.description}</p>

                <div className="catalog-card-details">
                  <div className="detail-row">
                    <span className="detail-label">Worst Case:</span>
                    <span className="detail-val">{algo.timeComplexity.worst}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Space:</span>
                    <span className="detail-val">{algo.spaceComplexity}</span>
                  </div>
                  {algo.stable !== undefined && (
                    <div className="detail-row">
                      <span className="detail-label">Stability:</span>
                      <span className="detail-val">{algo.stable ? 'Stable' : 'Unstable'}</span>
                    </div>
                  )}
                </div>

                <div className="catalog-card-action">
                  <span>Launch Workspace</span>
                  <ArrowRightIcon size={13} className="action-arrow" />
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* ── 5. Technical Specifications Grid ── */}
      <section className="features-grid">
        <div className="feature-box">
          <h4 className="feature-title">Multi-Language Code Synchronization</h4>
          <p className="feature-desc">
            Observe line-by-line active execution mappings across Python, C, C++, Java, and JavaScript during each step of the animation.
          </p>
        </div>

        <div className="feature-box">
          <h4 className="feature-title">Deterministic Step Engine</h4>
          <p className="feature-desc">
            Inspect pointer movements and variable memory states with bidirectional step forward and backward controls at adjustable clock speeds.
          </p>
        </div>

        <div className="feature-box">
          <h4 className="feature-title">Dynamic Dataset Inputs</h4>
          <p className="feature-desc">
            Supply arbitrary comma-separated numerical arrays or generate randomized problem instances with custom length parameters.
          </p>
        </div>
      </section>
    </div>
  );
}
