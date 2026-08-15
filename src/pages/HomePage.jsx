// src/pages/HomePage.jsx

import { ALGORITHMS, CATEGORIES } from '../data/algorithms.js';

export default function HomePage({ onSelectAlgo }) {
  const grouped = Object.entries(CATEGORIES).map(([catKey, cat]) => ({
    ...cat, key: catKey,
    items: ALGORITHMS.filter(a => a.category === catKey),
  }));

  return (
    <div className="home">
      {/* Hero */}
      <div className="home-hero">
        <div className="home-hero-badge">
          ✨ Interactive DSA Visualizer
        </div>
        <h1>Understand <em>Algorithms</em><br />by Seeing Them</h1>
        <p>
          Watch sorting, searching, graph, and tree algorithms execute
          step-by-step with animated visuals and live multi-language code highlighting.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => onSelectAlgo('bubble-sort')} style={{ fontSize: 15, padding: '12px 24px' }}>
            ▶ Start Visualizing
          </button>
          <button className="btn" onClick={() => onSelectAlgo('bfs')} style={{ fontSize: 15, padding: '12px 24px' }}>
            🕸️ Explore Graphs
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 48, flexWrap: 'wrap' }}>
        {[
          { label: 'Algorithms', value: ALGORITHMS.length, icon: '⚙️' },
          { label: 'Languages',  value: '5',               icon: '💻' },
          { label: 'Categories', value: Object.keys(CATEGORIES).length, icon: '📚' },
          { label: 'Step Control', value: '∞',             icon: '🎮' },
        ].map(stat => (
          <div key={stat.label} style={{
            flex: 1, minWidth: 120,
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px 24px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          }}>
            <div style={{ fontSize: 28 }}>{stat.icon}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--violet-light)' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Algorithm categories */}
      {grouped.map(group => (
        <div key={group.key} style={{ marginBottom: 40 }}>
          <div className="home-section-title">
            {group.icon} {group.label}
          </div>
          <div className="algo-grid">
            {group.items.map(algo => (
              <div
                key={algo.slug}
                className="algo-card"
                onClick={() => onSelectAlgo(algo.slug)}
              >
                <div
                  className="algo-card-icon"
                  style={{ background: algo.bgColor, border: `1px solid ${algo.color}40` }}
                >
                  {algo.icon}
                </div>
                <div className="algo-card-name">{algo.name}</div>
                <div className="algo-card-desc" style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {algo.description}
                </div>
                <div className="algo-card-footer">
                  <span className="complexity-badge time">⏱ {algo.timeComplexity.average}</span>
                  <span className="complexity-badge space">💾 {algo.spaceComplexity}</span>
                  {algo.stable !== undefined && (
                    <span className="complexity-badge" style={{
                      background: algo.stable ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.1)',
                      color: algo.stable ? 'var(--green)' : 'var(--red)',
                      border: `1px solid ${algo.stable ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                    }}>
                      {algo.stable ? '✅ Stable' : '⚠️ Unstable'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Language support banner */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '32px',
        textAlign: 'center',
        marginTop: 16,
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
          Multi-Language Code Support
        </div>
        <div style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
          Every algorithm shows live synchronized code in 5 languages
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { lang: 'Python',     color: '#3b82f6', emoji: '🐍' },
            { lang: 'C',          color: '#06b6d4', emoji: '⚙️' },
            { lang: 'C++',        color: '#8b5cf6', emoji: '🔷' },
            { lang: 'Java',       color: '#f59e0b', emoji: '☕' },
            { lang: 'JavaScript', color: '#10b981', emoji: '🟨' },
          ].map(l => (
            <div key={l.lang} style={{
              background: `${l.color}20`,
              border: `1px solid ${l.color}50`,
              borderRadius: 'var(--radius-sm)',
              padding: '10px 20px',
              fontFamily: 'var(--font-code)',
              fontWeight: 600,
              color: l.color,
              fontSize: 14,
            }}>
              {l.emoji} {l.lang}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
