// src/pages/HomePage.jsx — Modern, interactive landing page for AlgoViz

import { useState, useEffect, useMemo } from 'react';
import { ALGORITHMS, CATEGORIES } from '../data/algorithms.js';

// Mini Interactive Demo for Hero Section
function HeroInteractiveDemo({ onSelectAlgo }) {
  const [bars, setBars] = useState([35, 75, 20, 90, 50, 65, 30, 85, 45]);
  const [comparing, setComparing] = useState([1, 2]);
  const [currentStep, setCurrentStep] = useState(1);

  // Subtle automatic cycle for demo preview
  useEffect(() => {
    const timer = setInterval(() => {
      setBars(prev => {
        const next = [...prev];
        const i = Math.floor(Math.random() * (next.length - 1));
        setComparing([i, i + 1]);
        if (next[i] > next[i + 1]) {
          const tmp = next[i];
          next[i] = next[i + 1];
          next[i + 1] = tmp;
        }
        return next;
      });
      setCurrentStep(s => (s % 42) + 1);
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hero-preview-card" onClick={() => onSelectAlgo('quick-sort')}>
      <div className="hero-preview-header">
        <div className="preview-dots">
          <span className="dot red" />
          <span className="dot yellow" />
          <span className="dot green" />
        </div>
        <span className="preview-title">Quick Sort — Visual Demo</span>
        <span className="preview-badge">Live</span>
      </div>

      <div className="hero-preview-canvas">
        {bars.map((val, idx) => {
          const isComp = comparing.includes(idx);
          return (
            <div key={idx} className="preview-bar-wrapper">
              <div
                className={`preview-bar ${isComp ? 'comparing' : ''}`}
                style={{ height: `${val}%` }}
              />
              <span className="preview-bar-val">{val}</span>
            </div>
          );
        })}
      </div>

      <div className="hero-preview-footer">
        <div className="preview-status">
          <span className="pulse-dot" />
          <span>Step {currentStep}: Comparing pivot with partition elements</span>
        </div>
        <button className="btn btn-sm btn-primary">
          Launch Visualizer →
        </button>
      </div>
    </div>
  );
}

export default function HomePage({ onSelectAlgo }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered algorithms
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
      {/* ── 1. Hero Section with Interactive Preview ── */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge-pill">
            <span className="badge-icon">⚡</span>
            <span>Interactive Data Structures & Algorithms</span>
          </div>

          <h1 className="hero-heading">
            Master Algorithms by <br />
            <span className="hero-gradient-text">Seeing Them in Action</span>
          </h1>

          <p className="hero-subtext">
            Step through sorting, searching, graph traversal, and tree operations.
            Observe real-time pointer shifts, variable states, and synchronized
            code execution across <strong>5 programming languages</strong>.
          </p>

          <div className="hero-cta-group">
            <button className="btn btn-primary btn-lg" onClick={() => onSelectAlgo('quick-sort')}>
              Explore Quick Sort
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => onSelectAlgo('bfs')}>
              Explore Graphs
            </button>
          </div>

          <div className="hero-feature-tags">
            <span>✓ 5-Language Code Sync</span>
            <span>✓ Step-by-Step Stepper</span>
            <span>✓ Custom Array Inputs</span>
            <span>✓ Complexity Breakdown</span>
          </div>
        </div>

        <div className="hero-preview-wrapper">
          <HeroInteractiveDemo onSelectAlgo={onSelectAlgo} />
        </div>
      </section>

      {/* ── 2. Metric Statistics Strip ── */}
      <section className="stats-strip">
        <div className="stat-item">
          <div className="stat-num">{ALGORITHMS.length}</div>
          <div className="stat-desc">Core DSA Algorithms</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">5</div>
          <div className="stat-desc">Languages (C, C++, Java, Py, JS)</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">100%</div>
          <div className="stat-desc">Step-by-Step Frame Control</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">4</div>
          <div className="stat-desc">Algorithmic Categories</div>
        </div>
      </section>

      {/* ── 3. Search & Filter Bar ── */}
      <section className="catalog-header">
        <div className="catalog-header-top">
          <div>
            <h2 className="section-heading">Algorithm Catalog</h2>
            <p className="section-subheading">Select any algorithm below to launch the interactive visualization workspace.</p>
          </div>

          {/* Search Input */}
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search algorithm or complexity (e.g. quick, O(log n))..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => setSearchQuery('')}>✕</button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="category-pills">
          <button
            className={`category-pill ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All Algorithms ({ALGORITHMS.length})
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

      {/* ── 4. Algorithm Grid ── */}
      <section className="algo-catalog-grid">
        {filteredAlgos.length === 0 ? (
          <div className="no-results-box">
            <div style={{ fontSize: 28, marginBottom: 8 }}>🔍</div>
            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>No algorithms found</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
              Try searching for "bubble", "graph", or "dijkstra"
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
                    Avg: {algo.timeComplexity.average}
                  </span>
                </div>

                <h3 className="catalog-card-title">{algo.name}</h3>
                <p className="catalog-card-desc">{algo.description}</p>

                <div className="catalog-card-details">
                  <div className="detail-row">
                    <span className="detail-label">Worst Time:</span>
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
                  <span>Launch Visualizer</span>
                  <span className="action-arrow">→</span>
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* ── 5. Features Showcase ── */}
      <section className="features-grid">
        <div className="feature-box">
          <div className="feature-icon">💻</div>
          <h4 className="feature-title">5-Language Synchronized Code</h4>
          <p className="feature-desc">
            See the exact line of code highlighted as algorithms run. Switch between Python, C, C++, Java, and JavaScript instantly.
          </p>
        </div>

        <div className="feature-box">
          <div className="feature-icon">⏱️</div>
          <h4 className="feature-title">Step-by-Step Playback</h4>
          <p className="feature-desc">
            Step forward, step backward, or pause at any moment. Inspect variables, loop indices, and pointer states in real time.
          </p>
        </div>

        <div className="feature-box">
          <div className="feature-icon">🎲</div>
          <h4 className="feature-title">Custom Data & Sizing</h4>
          <p className="feature-desc">
            Type your own custom arrays or test edge cases with randomized datasets from 5 to 40 elements.
          </p>
        </div>
      </section>
    </div>
  );
}
