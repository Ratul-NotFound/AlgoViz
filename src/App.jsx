// src/App.jsx — Clean, minimalist navigation and app shell

import { useState, useEffect, useCallback } from 'react';
import Sidebar       from './components/Sidebar.jsx';
import HomePage      from './pages/HomePage.jsx';
import AlgorithmPage from './pages/AlgorithmPage.jsx';
import { MenuIcon, PythonIcon, CIcon, CppIcon, JavaIcon, JSIcon, SunIcon, MoonIcon } from './components/Icons.jsx';
import { isAudioEnabled, toggleSound } from './utils/sound.js';

export default function App() {
  const [currentSlug, setCurrentSlug] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
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
          title={soundOn ? 'Mute Sonification' : 'Enable Audio Sonification'}
        >
          <span>{soundOn ? '🔊 Audio ON' : '🔇 Audio OFF'}</span>
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
