// src/App.jsx — Clean, minimalist navigation and app shell

import { useState, useEffect, useCallback } from 'react';
import Sidebar       from './components/Sidebar.jsx';
import HomePage      from './pages/HomePage.jsx';
import AlgorithmPage from './pages/AlgorithmPage.jsx';
import { MenuIcon, PythonIcon, CIcon, CppIcon, JavaIcon, JSIcon, SunIcon, MoonIcon, AlgoFlowXLogo } from './components/Icons.jsx';
import { isAudioEnabled, toggleSound } from './utils/sound.js';

export default function App() {
  const [currentSlug, setCurrentSlug] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth <= 1024 : false);
  const [soundOn, setSoundOn] = useState(isAudioEnabled());
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('algoviz-theme') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('algoviz-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleToggleSound = () => {
    const nextState = toggleSound();
    setSoundOn(nextState);
  };

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 1024);
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
          type="button"
          className="hamburger-btn"
          onClick={(e) => {
            e.stopPropagation();
            setSidebarOpen(v => !v);
          }}
          aria-label="Toggle menu"
        >
          <MenuIcon size={18} />
        </button>

        <a className="header-logo" href="#" onClick={() => { setCurrentSlug(null); setSidebarOpen(false); }}>
          <AlgoFlowXLogo size={32} />
          <div className="header-logo-text">AlgoFlow<span className="logo-x-accent">X</span></div>
        </a>

        {algoName && (
          <div className="header-breadcrumb">
            <span>/</span>
            <span>{algoName}</span>
          </div>
        )}

        <div className="header-spacer" />

        {/* Theme Toggle Button */}
        <button
          className="header-theme-pill"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Clean Light Theme' : 'Switch to Deep Dark Theme'}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <SunIcon size={13} /> : <MoonIcon size={13} />}
          <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>

        {/* Audio Sonification Toggle */}
        <button
          className={`header-sound-pill ${soundOn ? 'sound-active' : ''}`}
          onClick={handleToggleSound}
          title={soundOn ? 'Audio Sonification Enabled (Click to Mute)' : 'Enable Audio Sonification (Live Audio Feedback)'}
          aria-label="Toggle Audio"
        >
          {soundOn ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
              </svg>
              <span className="sound-pill-text">Audio ON</span>
              <span className="sound-wave-bars">
                <span className="wave-bar bar-1" />
                <span className="wave-bar bar-2" />
                <span className="wave-bar bar-3" />
              </span>
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <line x1="23" y1="9" x2="17" y2="15"/>
                <line x1="17" y1="9" x2="23" y2="15"/>
              </svg>
              <span className="sound-pill-text">Muted</span>
            </>
          )}
        </button>

        <div className="header-langs">
          <span className="header-lang-pill">
            <PythonIcon size={13} />
            <span>Python</span>
          </span>
          <span className="header-lang-pill">
            <CIcon size={13} />
            <span>C</span>
          </span>
          <span className="header-lang-pill">
            <CppIcon size={13} />
            <span>C++</span>
          </span>
          <span className="header-lang-pill">
            <JavaIcon size={13} />
            <span>Java</span>
          </span>
          <span className="header-lang-pill">
            <JSIcon size={13} />
            <span>JS</span>
          </span>
        </div>

        <div className="header-badge">v1.0</div>
      </header>

      {/* ── Sidebar (Desktop) ── */}
      <div className="desktop-sidebar-wrapper">
        <Sidebar currentSlug={currentSlug} onSelect={handleSelectAlgo} />
      </div>

      {/* ── Mobile / Tablet Drawer ── */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />
      <div className={`sidebar-drawer ${sidebarOpen ? 'open' : ''}`}>
        <Sidebar
          currentSlug={currentSlug}
          onSelect={handleSelectAlgo}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

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
