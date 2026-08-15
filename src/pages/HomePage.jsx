// src/pages/HomePage.jsx — Clean, user-friendly documentation and visualizer catalog

import { ALGORITHMS, CATEGORIES } from '../data/algorithms.js';

export default function HomePage({ onSelectAlgo }) {
  const grouped = Object.entries(CATEGORIES).map(([catKey, cat]) => ({
    ...cat,
    key: catKey,
    items: ALGORITHMS.filter(a => a.category === catKey),
  }));

  return (
    <div className="home">
      {/* ── Hero Section ── */}
      <div className="home-hero">
        <div className="home-hero-badge">Data Structures & Algorithms</div>
        <h1>Interactive Algorithm Visualizer</h1>
        <p>
          Step through sorting, searching, graph traversal, and tree operations.
          Inspect variables and observe synchronized code execution across 5 programming languages.
        </p>
        <div className="home-hero-actions">
          <button className="btn btn-primary" onClick={() => onSelectAlgo('bubble-sort')}>
            Start Sorting
          </button>
          <button className="btn" onClick={() => onSelectAlgo('bfs')}>
            Explore Graphs
          </button>
        </div>
      </div>

      {/* ── Overview Statistics ── */}
      <div className="home-stats">
        <div className="stat-card">
          <div className="stat-value">{ALGORITHMS.length}</div>
          <div className="stat-label">Algorithms</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">5</div>
          <div className="stat-label">Languages (C, C++, Java, Py, JS)</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{Object.keys(CATEGORIES).length}</div>
          <div className="stat-label">Categories</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">100%</div>
          <div className="stat-label">Step Control & Inspection</div>
        </div>
      </div>

      {/* ── Algorithm Categories ── */}
      {grouped.map(group => (
        <div key={group.key} style={{ marginBottom: 32 }}>
          <div className="home-section-title">
            {group.label}
          </div>
          <div className="algo-grid">
            {group.items.map(algo => (
              <div
                key={algo.slug}
                className="algo-card"
                onClick={() => onSelectAlgo(algo.slug)}
              >
                <div>
                  <div className="algo-card-name">{algo.name}</div>
                  <div className="algo-card-desc">{algo.description}</div>
                </div>
                <div className="algo-card-footer">
                  <span className="complexity-tag">Time: {algo.timeComplexity.average}</span>
                  <span className="complexity-tag">Space: {algo.spaceComplexity}</span>
                  {algo.stable !== undefined && (
                    <span className="complexity-tag">{algo.stable ? 'Stable' : 'Unstable'}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
