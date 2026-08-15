// src/App.jsx — Root application with mobile-responsive drawer sidebar

import { useState, useEffect, useCallback } from 'react';
import Sidebar       from './components/Sidebar.jsx';
import HomePage      from './pages/HomePage.jsx';
import AlgorithmPage from './pages/AlgorithmPage.jsx';

export default function App() {
  const [currentSlug, setCurrentSlug] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Detect mobile breakpoint
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Close sidebar on route change
  const handleSelectAlgo = useCallback((slug) => {
    setCurrentSlug(slug);
    setSidebarOpen(false);
  }, []);

  // Prevent background scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setSidebarOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const algoName = currentSlug
    ? currentSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : null;

  return (
    <div className="app-shell">
      {/* ── Header ── */}
      <header className="header">
        {/* Hamburger — mobile only */}
        <button
          className={`hamburger-btn ${sidebarOpen ? 'open' : ''}`}
          onClick={() => setSidebarOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>

        <a className="header-logo" href="#" onClick={() => { setCurrentSlug(null); setSidebarOpen(false); }}>
          <div className="header-logo-icon">Σ</div>
          <div className="header-logo-text">
            Algo<span style={{ color: 'var(--orange)' }}>Viz</span>
          </div>
        </a>

        {algoName && (
          <span className="header-algo-name">/ {algoName}</span>
        )}

        <div className="header-spacer" />

        {/* Language badges — desktop */}
        <div className="header-langs">
          {[
            { l: 'Python', c: '#60a5fa' },
            { l: 'C',      c: 'var(--sky)' },
            { l: 'C++',    c: '#a5b4fc' },
            { l: 'Java',   c: 'var(--amber-light)' },
            { l: 'JS',     c: 'var(--lime-light)' },
          ].map(({ l, c }) => (
            <span key={l} className="header-lang-pill" style={{ borderColor: `${c}55`, color: c }}>
              {l}
            </span>
          ))}
        </div>

        <div className="header-badge">v1.0</div>
      </header>

      {/* ── Desktop Sidebar ── */}
      <Sidebar currentSlug={currentSlug} onSelect={handleSelectAlgo} />

      {/* ── Mobile Drawer Sidebar ── */}
      {isMobile && (
        <>
          {/* Backdrop */}
          <div
            className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
            onClick={() => setSidebarOpen(false)}
          />
          {/* Drawer */}
          <div className={`sidebar-drawer ${sidebarOpen ? 'open' : ''}`}>
            {/* Close button inside drawer */}
            <div style={{
              position: 'absolute', top: 12, right: 12,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>
                Algo<span style={{ color: 'var(--orange)' }}>Viz</span>
              </span>
              <button
                onClick={() => setSidebarOpen(false)}
                style={{
                  background: 'none', border: '1px solid var(--border-mid)',
                  borderRadius: 6, color: 'var(--text-muted)',
                  cursor: 'pointer', padding: '4px 8px', fontSize: 12,
                  marginLeft: 'auto',
                }}
              >✕</button>
            </div>
            <Sidebar currentSlug={currentSlug} onSelect={handleSelectAlgo} />
          </div>
        </>
      )}

      {/* ── Main content ── */}
      <main className="main">
        {currentSlug
          ? <AlgorithmPage key={currentSlug} slug={currentSlug} />
          : <HomePage onSelectAlgo={handleSelectAlgo} />
        }
      </main>
    </div>
  );
}
