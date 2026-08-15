// src/App.jsx — Clean, minimalist navigation and app shell

import { useState, useEffect, useCallback } from 'react';
import Sidebar       from './components/Sidebar.jsx';
import HomePage      from './pages/HomePage.jsx';
import AlgorithmPage from './pages/AlgorithmPage.jsx';
import { MenuIcon }  from './components/Icons.jsx';

export default function App() {
  const [currentSlug, setCurrentSlug] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleSelectAlgo = useCallback((slug) => {
    setCurrentSlug(slug);
    setSidebarOpen(false);
  }, []);

  const algoName = currentSlug
    ? currentSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : null;

  return (
    <div className="app-shell">
      {/* ── Header ── */}
      <header className="header">
        <button
          className="hamburger-btn"
          onClick={() => setSidebarOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <MenuIcon size={16} />
        </button>

        <a className="header-logo" href="#" onClick={() => { setCurrentSlug(null); setSidebarOpen(false); }}>
          <div className="header-logo-icon">AV</div>
          <div className="header-logo-text">AlgoViz</div>
        </a>

        {algoName && (
          <div className="header-breadcrumb">
            <span>/</span>
            <span>{algoName}</span>
          </div>
        )}

        <div className="header-spacer" />

        <div className="header-langs">
          <span className="header-lang-pill">Python</span>
          <span className="header-lang-pill">C</span>
          <span className="header-lang-pill">C++</span>
          <span className="header-lang-pill">Java</span>
          <span className="header-lang-pill">JS</span>
        </div>

        <div className="header-badge">v1.0</div>
      </header>

      {/* ── Sidebar (Desktop) ── */}
      <Sidebar currentSlug={currentSlug} onSelect={handleSelectAlgo} />

      {/* ── Mobile Drawer ── */}
      {isMobile && (
        <>
          <div
            className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
            onClick={() => setSidebarOpen(false)}
          />
          <div className={`sidebar-drawer ${sidebarOpen ? 'open' : ''}`}>
            <Sidebar currentSlug={currentSlug} onSelect={handleSelectAlgo} />
          </div>
        </>
      )}

      {/* ── Main Content ── */}
      <main className="main">
        {currentSlug
          ? <AlgorithmPage key={currentSlug} slug={currentSlug} />
          : <HomePage onSelectAlgo={handleSelectAlgo} />
        }
      </main>
    </div>
  );
}
