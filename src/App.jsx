import { useState, useEffect, useCallback } from 'react';
import Sidebar       from './components/Sidebar.jsx';
import HomePage      from './pages/HomePage.jsx';
import AlgorithmPage from './pages/AlgorithmPage.jsx';
import LearnCPage    from './pages/LearnCPage.jsx';
import PythonComingSoonModal from './components/PythonComingSoonModal.jsx';
import { ALGORITHMS } from './data/algorithms.js';
import { MenuIcon, PythonIcon, CIcon, CppIcon, JavaIcon, JSIcon, SunIcon, MoonIcon, AlgoFlowXLogo, GoogleIcon } from './components/Icons.jsx';
import { isAudioEnabled, toggleSound } from './utils/sound.js';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import AuthModal from './components/AuthModal.jsx';
import UserAvatarMenu from './components/UserAvatarMenu.jsx';
import LiveUserCounter from './components/LiveUserCounter.jsx';

function parseRouteFromHash() {
  if (typeof window === 'undefined') return { mode: 'algo', slug: null, lesson: null };
  const rawHash = window.location.hash.replace(/^#\/?/, '').trim();

  if (rawHash.startsWith('learn/c')) {
    const parts = rawHash.split('/');
    const lesson = parts[2] || 'hello-world-intro';
    return { mode: 'learn-c', slug: null, lesson };
  }

  if (rawHash) {
    const matched = ALGORITHMS.find(a => a.slug === rawHash);
    if (matched) return { mode: 'algo', slug: matched.slug, lesson: null };
  }

  return { mode: 'algo', slug: null, lesson: null };
}

function AppContent() {
  const initialRoute = parseRouteFromHash();
  const [viewMode, setViewMode] = useState(initialRoute.mode); // 'algo' | 'learn-c'
  const [currentSlug, setCurrentSlug] = useState(initialRoute.slug);
  const [learnLessonSlug, setLearnLessonSlug] = useState(initialRoute.lesson || 'hello-world-intro');
  const [homeTab, setHomeTab] = useState('catalog'); // 'catalog' | 'academy-preview'
  const [pythonModalOpen, setPythonModalOpen] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth <= 1024 : false);
  const [soundOn, setSoundOn] = useState(isAudioEnabled());
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('algoviz-theme') || 'light';
    }
    return 'light';
  });

  const { isAuthenticated, openAuthModal } = useAuth();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('algoviz-theme', theme);
  }, [theme]);

  // Synchronize URL hash whenever mode or slug changes
  useEffect(() => {
    if (viewMode === 'learn-c') {
      window.location.hash = `#learn/c/${learnLessonSlug}`;
    } else if (currentSlug) {
      window.location.hash = `#/${currentSlug}`;
    } else {
      if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }
  }, [viewMode, currentSlug, learnLessonSlug]);

  // Listen to browser Back / Forward navigation (hashchange & popstate)
  useEffect(() => {
    const handleHashChange = () => {
      const route = parseRouteFromHash();
      setViewMode(route.mode);
      setCurrentSlug(route.slug);
      if (route.lesson) setLearnLessonSlug(route.lesson);
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

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

  const handleVisualizersClick = useCallback(() => {
    setViewMode('algo');
    setCurrentSlug(null);
    setHomeTab('catalog');
    if (typeof window !== 'undefined' && window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    setTimeout(() => {
      const el = document.querySelector('.platform-nav-bar') || document.querySelector('.catalog-header-bar');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
    setSidebarOpen(false);
  }, []);

  const handleCodingAcademyClick = useCallback(() => {
    setViewMode('algo');
    setCurrentSlug(null);
    setHomeTab('academy-preview');
    if (typeof window !== 'undefined' && window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    setTimeout(() => {
      const el = document.querySelector('.platform-nav-bar') || document.querySelector('.courses-hub-grid');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
    setSidebarOpen(false);
  }, []);

  const handleGoHome = useCallback(() => {
    setViewMode('algo');
    setCurrentSlug(null);
    setHomeTab('catalog');
    setSidebarOpen(false);
    if (typeof window !== 'undefined' && window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleOpenLearnC = useCallback((slug) => {
    setViewMode('learn-c');
    setCurrentSlug(null);
    setLearnLessonSlug(slug || 'hello-world-intro');
    setSidebarOpen(false);
  }, []);

  const handleSelectAlgo = useCallback((slug) => {
    setCurrentSlug(slug);
    setSidebarOpen(false);
  }, []);

  const algoName = currentSlug
    ? currentSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : null;

  return (
    <div className={`app-shell ${viewMode === 'learn-c' || !currentSlug ? 'app-shell-fullwidth' : ''}`}>
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

        <a
          className="header-logo"
          href="#/"
          onClick={(e) => {
            e.preventDefault();
            handleGoHome();
          }}
        >
          <AlgoFlowXLogo size={32} />
          <div className="header-logo-group">
            <div className="header-logo-text">AlgoFlow<span className="logo-x-accent">X</span></div>
            <span className="header-logo-sub">Code &amp; Algorithm Mastery</span>
          </div>
        </a>

        {/* Header Mode Navigation: 1. DSA Visualization | 2. Coding Academy */}
        <div className="header-mode-nav">
          <button
            type="button"
            className={`header-mode-btn ${viewMode === 'algo' && homeTab === 'catalog' ? 'active' : ''}`}
            onClick={handleVisualizersClick}
          >
            <span>⚡ DSA Visualization</span>
          </button>
          <button
            type="button"
            className={`header-mode-btn ${viewMode === 'algo' && homeTab === 'academy-preview' ? 'active' : ''}`}
            onClick={handleCodingAcademyClick}
          >
            <CIcon size={13} />
            <span>Coding Academy</span>
            <span className="badge-learn-chapters">23 Ch</span>
          </button>
        </div>

        {algoName && viewMode === 'algo' && (
          <div className="header-breadcrumb">
            <span>/</span>
            <span>{algoName}</span>
          </div>
        )}

        {/* Live Total User Counter */}
        <LiveUserCounter />

        <div className="header-spacer" />

        {/* Google Sign In / User Profile Avatar */}
        {isAuthenticated ? (
          <UserAvatarMenu onSelectAlgo={handleSelectAlgo} onOpenLearnC={handleOpenLearnC} />
        ) : (
          <button
            type="button"
            className="header-signin-btn"
            onClick={openAuthModal}
            title="Sign in with Google to sync progress & bookmarks"
            aria-label="Sign in with Google"
          >
            <GoogleIcon size={14} />
            <span>Sign In</span>
          </button>
        )}

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

        <div className="header-badge">v1.0</div>
      </header>

      {/* ── Sidebar (Desktop - only when inside an algorithm studio workspace) ── */}
      {viewMode === 'algo' && currentSlug && (
        <div className="desktop-sidebar-wrapper">
          <Sidebar
            viewMode={viewMode}
            currentSlug={currentSlug}
            learnLessonSlug={learnLessonSlug}
            onSelect={handleSelectAlgo}
            onOpenLearnC={handleOpenLearnC}
            onOpenPythonModal={() => setPythonModalOpen(true)}
            onSwitchToVisualizers={handleVisualizersClick}
            onSwitchToAcademy={() => handleOpenLearnC('hello-world-intro')}
          />
        </div>
      )}

      {/* ── Mobile / Tablet Drawer (Synced with active viewMode) ── */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />
      <div className={`sidebar-drawer ${sidebarOpen ? 'open' : ''}`}>
        <Sidebar
          viewMode={viewMode}
          currentSlug={currentSlug}
          learnLessonSlug={learnLessonSlug}
          onSelect={(slug) => {
            handleSelectAlgo(slug);
            setSidebarOpen(false);
          }}
          onClose={() => setSidebarOpen(false)}
          onOpenLearnC={(slug) => {
            handleOpenLearnC(slug);
            setSidebarOpen(false);
          }}
          onOpenPythonModal={() => {
            setPythonModalOpen(true);
            setSidebarOpen(false);
          }}
          onSwitchToVisualizers={() => {
            handleVisualizersClick();
            setSidebarOpen(false);
          }}
          onSwitchToAcademy={() => {
            handleOpenLearnC('hello-world-intro');
            setSidebarOpen(false);
          }}
        />
      </div>

      {/* ── Main Content ── */}
      <main className={`main ${viewMode === 'learn-c' ? 'main-fullwidth' : ''}`}>
        {viewMode === 'learn-c' ? (
          <LearnCPage
            initialLessonSlug={learnLessonSlug}
            onSelectAlgo={(slug) => {
              setViewMode('algo');
              setCurrentSlug(slug);
            }}
            onOpenPythonModal={() => setPythonModalOpen(true)}
          />
        ) : currentSlug ? (
          <AlgorithmPage key={currentSlug} slug={currentSlug} />
        ) : (
          <HomePage
            onSelectAlgo={handleSelectAlgo}
            onOpenLearnC={handleOpenLearnC}
            onOpenPythonModal={() => setPythonModalOpen(true)}
            initialTab={homeTab}
          />
        )}
      </main>

      {/* ── Global Google Auth Modal ── */}
      <AuthModal />

      {/* ── Python Coming Soon Preview Modal ── */}
      <PythonComingSoonModal
        isOpen={pythonModalOpen}
        onClose={() => setPythonModalOpen(false)}
        onSwitchToC={() => {
          handleOpenLearnC('hello-world-intro');
          setPythonModalOpen(false);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
