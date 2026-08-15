// src/pages/HomePage.jsx — Clean, compact, user-friendly algorithm directory

import { useState, useMemo } from 'react';
import { ALGORITHMS, CATEGORIES } from '../data/algorithms.js';
import { SearchIcon, ArrowRightIcon } from '../components/Icons.jsx';

export default function HomePage({ onSelectAlgo }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter algorithms by category and query
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
      {/* ── Hero Section ── */}
      <section className="hero-compact">
        <div className="hero-compact-header">
          <span className="hero-compact-badge">Algorithm Visualizer</span>
          <h1 className="hero-compact-title">
            Interactive Data Structures & Algorithms
          </h1>
          <p className="hero-compact-sub">
            Step-by-step visual execution with real-time memory tracking and synchronized code in Python, C, C++, Java, and JavaScript.
          </p>
        </div>

        {/* ── Search & Category Filter Toolbar ── */}
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
      </section>

      {/* ── Compact Cards Grid ── */}
      <section className="compact-grid">
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
      </section>
    </div>
  );
}
