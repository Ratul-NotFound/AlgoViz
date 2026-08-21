// src/components/Sidebar.jsx — Synced Sidebar navigation (DSA Studio & Coding Academy) with creator profile card

import React, { useState, useMemo } from 'react';
import { ALGORITHMS, CATEGORIES } from '../data/algorithms.js';
import { C_LESSONS, C_MODULES } from '../data/cLessons.js';
import { getAlgoIcon, AlgoFlowXLogo, BookmarkIcon, CIcon } from './Icons.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Sidebar({
  viewMode = 'algo', // 'algo' | 'learn-c'
  currentSlug,
  learnLessonSlug,
  onSelect,
  onClose,
  onOpenLearnC,
  onOpenPythonModal,
  onSwitchToVisualizers,
  onSwitchToAcademy,
}) {
  const { isBookmarked, toggleBookmark, isCompleted, cCompletedLessons, isCLessonCompleted } = useAuth();
  const [academySearch, setAcademySearch] = useState('');
  const [algoSearch, setAlgoSearch] = useState('');

  // ── DSA Studio Groups ──
  const groupedAlgos = useMemo(() => {
    const q = algoSearch.trim().toLowerCase();
    return Object.entries(CATEGORIES).map(([catKey, cat]) => {
      const items = ALGORITHMS.filter(a => {
        if (a.category !== catKey) return false;
        if (!q) return true;
        return a.name.toLowerCase().includes(q) || a.category.toLowerCase().includes(q);
      });
      return {
        ...cat,
        key: catKey,
        items,
      };
    }).filter(g => g.items.length > 0);
  }, [algoSearch]);

  // ── C Academy Modules & Lessons ──
  const modulesWithLessons = useMemo(() => {
    const q = academySearch.trim().toLowerCase();
    const filtered = q
      ? C_LESSONS.filter(
          l =>
            l.title.toLowerCase().includes(q) ||
            l.category.toLowerCase().includes(q) ||
            (l.subtitle && l.subtitle.toLowerCase().includes(q))
        )
      : C_LESSONS;

    return C_MODULES.map(mod => {
      const lessons = filtered.filter(l => l.moduleId === mod.id);
      const doneCount = lessons.filter(l => isCLessonCompleted(l.slug)).length;
      return {
        ...mod,
        lessons,
        doneCount,
      };
    }).filter(mod => mod.lessons.length > 0);
  }, [academySearch, isCLessonCompleted]);

  const completedCount = (cCompletedLessons || []).length;
  const progressPercent = Math.round((completedCount / C_LESSONS.length) * 100);

  const isAcademy = viewMode === 'learn-c';

  return (
    <aside className="sidebar">
      {/* ── Top Sidebar Brand Header & Close Button ── */}
      <div className="sidebar-brand">
        <div
          className="sidebar-brand-left"
          onClick={() => {
            if (onSelect) onSelect(null);
            if (onClose) onClose();
          }}
          role="button"
          tabIndex={0}
          title="AlgoFlowX Home"
        >
          <div className="sidebar-brand-logo">
            <AlgoFlowXLogo size={24} />
          </div>
          <div className="sidebar-brand-info">
            <div className="sidebar-brand-title">
              <span>AlgoFlow</span>
              <span className="logo-x-accent">X</span>
            </div>
            <span className="sidebar-brand-badge">DSA & Academy</span>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close sidebar"
            title="Close menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
      </div>

      {/* ── Synced Mode Switcher Tabs (DSA Studio vs Coding Academy) ── */}
      <div className="sidebar-mode-switcher-bar">
        <button
          type="button"
          className={`sidebar-mode-tab-btn ${!isAcademy ? 'active' : ''}`}
          onClick={() => {
            if (onSwitchToVisualizers) onSwitchToVisualizers();
            else if (onSelect) onSelect(null);
          }}
        >
          <span>⚡ DSA Studio</span>
        </button>
        <button
          type="button"
          className={`sidebar-mode-tab-btn ${isAcademy ? 'active' : ''}`}
          onClick={() => {
            if (onSwitchToAcademy) onSwitchToAcademy();
            else if (onOpenLearnC) onOpenLearnC('hello-world-intro');
          }}
        >
          <span>🎓 C Academy</span>
        </button>
      </div>

      {/* ── Main Scroll Content (Synced by Mode) ── */}
      <div className="sidebar-scroll-content">
        {isAcademy ? (
          /* ══════════════════════════════════════════════════════════════════
             MODE A: CODING ACADEMY (LEARN C)
             ══════════════════════════════════════════════════════════════════ */
          <div className="sidebar-academy-view">
            {/* Track Progress & Search */}
            <div className="sidebar-track-subbox">
              <div className="sidebar-track-row">
                <div className="track-icon-c"><CIcon size={18} /></div>
                <div className="track-title-info">
                  <div className="track-title-flex">
                    <strong className="track-title-sm">C Learning Path</strong>
                    <span className="track-percent-pill font-mono">{progressPercent}%</span>
                  </div>
                  <span className="track-subtitle-sm">{completedCount} of {C_LESSONS.length} Done</span>
                </div>
              </div>

              {/* Glowing Progress Bar */}
              <div className="track-progress-track">
                <div className="track-progress-fill" style={{ width: `${progressPercent}%` }} />
              </div>

              {/* Search Box */}
              <div className="sidebar-search-box">
                <span className="sidebar-search-icon">🔍</span>
                <input
                  type="text"
                  className="sidebar-search-input"
                  placeholder="Search chapters..."
                  value={academySearch}
                  onChange={(e) => setAcademySearch(e.target.value)}
                  aria-label="Filter chapters"
                />
                {academySearch && (
                  <button
                    type="button"
                    className="sidebar-search-clear"
                    onClick={() => setAcademySearch('')}
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Module-by-Module Chapters List */}
            <div className="learn-syllabus-list">
              {modulesWithLessons.length === 0 ? (
                <div className="sidebar-empty-state">
                  <span>🔍 No chapters match search</span>
                </div>
              ) : (
                modulesWithLessons.map((mod, mIdx) => (
                  <div className="syllabus-module-section" key={mod.id}>
                    <div className={`module-header-row ${mod.doneCount === mod.lessons.length ? 'module-done' : ''}`}>
                      <div className="module-title-text">
                        <span className="module-num font-mono">M{mIdx + 1}</span>
                        <span className="module-name-str">{mod.name.replace(/^Module \d+:\s*/, '')}</span>
                      </div>
                      <div className={`module-count-badge font-mono ${mod.doneCount === mod.lessons.length ? 'badge-all-done' : ''}`}>
                        {mod.doneCount === mod.lessons.length ? '✓' : `${mod.doneCount}/${mod.lessons.length}`}
                      </div>
                    </div>

                    <div className="module-lessons-list">
                      {mod.lessons.map((lesson) => {
                        const isActive = lesson.slug === learnLessonSlug;
                        const isDone = isCLessonCompleted(lesson.slug);

                        return (
                          <button
                            key={lesson.slug}
                            type="button"
                            className={`syllabus-item ${isActive ? 'active' : ''} ${isDone ? 'completed' : ''}`}
                            onClick={() => {
                              if (onOpenLearnC) onOpenLearnC(lesson.slug);
                              if (onClose) onClose();
                            }}
                          >
                            <div className="syllabus-item-status font-mono">
                              {isDone ? '✓' : String(lesson.chapter).padStart(2, '0')}
                            </div>
                            <div className="syllabus-item-content">
                              <div className="syllabus-item-title">
                                {lesson.title.replace(/^Chapter \d+:\s*/, '')}
                              </div>
                              <div className="syllabus-item-meta">
                                {isDone ? (
                                  <span className="meta-completed font-mono">Completed ✓</span>
                                ) : (
                                  <span className="meta-time">⏱ {lesson.readTime}</span>
                                )}
                              </div>
                            </div>
                            {isActive && <span className="active-item-indicator" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Python Teaser Card */}
            <div className="python-teaser-box">
              <div className="python-teaser-header">
                <span className="teaser-title">🐍 Python Path</span>
                <span className="teaser-badge">Coming Soon</span>
              </div>
              <p className="python-teaser-desc">Modern Python syntax with interactive playground & algorithms.</p>
              <button
                type="button"
                className="btn-teaser-preview"
                onClick={() => {
                  if (onOpenPythonModal) onOpenPythonModal();
                  if (onClose) onClose();
                }}
              >
                View Syllabus
              </button>
            </div>
          </div>
        ) : (
          /* ══════════════════════════════════════════════════════════════════
             MODE B: DSA STUDIO (ALGORITHM VISUALIZERS)
             ══════════════════════════════════════════════════════════════════ */
          <div className="sidebar-algo-view">
            {/* Quick Algo Search Filter */}
            <div className="sidebar-search-box" style={{ marginBottom: '12px' }}>
              <span className="sidebar-search-icon">🔍</span>
              <input
                type="text"
                className="sidebar-search-input"
                placeholder="Search algorithms..."
                value={algoSearch}
                onChange={(e) => setAlgoSearch(e.target.value)}
                aria-label="Filter algorithms"
              />
              {algoSearch && (
                <button
                  type="button"
                  className="sidebar-search-clear"
                  onClick={() => setAlgoSearch('')}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Academy Launch Card */}
            <div className="sidebar-category sidebar-academy-box" style={{ marginBottom: '14px' }}>
              <div className="sidebar-category-header">
                🎓 Interactive Academy
              </div>
              <div className="sidebar-items">
                <button
                  type="button"
                  className="sidebar-academy-btn"
                  onClick={() => {
                    if (onOpenLearnC) onOpenLearnC();
                    if (onClose) onClose();
                  }}
                >
                  <span className="academy-btn-left">
                    <span className="academy-c-dot" />
                    <span>Learn C (23 Chapters)</span>
                  </span>
                  <span className="academy-badge-live">Live</span>
                </button>
                <button
                  type="button"
                  className="sidebar-academy-btn academy-python-btn"
                  onClick={() => {
                    if (onOpenPythonModal) onOpenPythonModal();
                    if (onClose) onClose();
                  }}
                >
                  <span className="academy-btn-left">
                    <span className="academy-py-dot" />
                    <span>Learn Python</span>
                  </span>
                  <span className="academy-badge-soon">Soon</span>
                </button>
              </div>
            </div>

            {/* Grouped Algorithm Categories */}
            {groupedAlgos.map(group => (
              <div className="sidebar-category" key={group.key}>
                <div className="sidebar-category-header">
                  {group.label}
                </div>
                <div className="sidebar-items">
                  {group.items.map(algo => {
                    const bookmarked = isBookmarked(algo.slug);
                    const completed = isCompleted(algo.slug);

                    return (
                      <div
                        key={algo.slug}
                        className={`sidebar-item ${currentSlug === algo.slug ? 'active' : ''} ${completed ? 'item-completed' : ''}`}
                        onClick={() => {
                          if (onSelect) onSelect(algo.slug);
                          if (onClose) onClose();
                        }}
                      >
                        <span className="sidebar-item-name">
                          <span className="sidebar-algo-glyph">{getAlgoIcon(algo.slug, 15)}</span>
                          <span>{algo.name}</span>
                        </span>
                        <div className="sidebar-item-meta">
                          <span className="sidebar-item-complexity">
                            {algo.timeComplexity.average}
                          </span>
                          <button
                            type="button"
                            className={`sidebar-star-btn ${bookmarked ? 'star-active' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleBookmark(algo.slug);
                            }}
                            title={bookmarked ? 'Remove Bookmark' : 'Bookmark this algorithm'}
                            aria-label="Bookmark"
                          >
                            <BookmarkIcon size={12} filled={bookmarked} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Common Premium Developer Profile Card (Footer) ── */}
      <div className="sidebar-footer">
        <div className="dev-profile-card">
          {/* Top: Avatar & Creator Header */}
          <a
            href="https://mh-ratul.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="dev-profile-header"
            title="Visit Ratul's Portfolio"
          >
            <div className="dev-avatar-glow-ring">
              <img
                src="/ratul.jpg"
                alt="Ratul"
                className="dev-avatar-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
              <span className="dev-online-beacon" />
            </div>
            <div className="dev-meta">
              <span className="dev-name">Ratul</span>
              <span className="dev-role-label">Creator & Engineer</span>
            </div>
          </a>

          {/* Social Links Row (LinkedIn, Facebook, Portfolio - Circular Buttons) */}
          <div className="dev-social-row">
            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/mahmud-hasan-ratul-0831b9257"
              target="_blank"
              rel="noopener noreferrer"
              className="dev-social-btn"
              title="LinkedIn Profile"
              aria-label="LinkedIn"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
              </svg>
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/mahmud.hasan.ratul.76669"
              target="_blank"
              rel="noopener noreferrer"
              className="dev-social-btn"
              title="Facebook Profile"
              aria-label="Facebook"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z"/>
              </svg>
            </a>

            {/* Portfolio Website */}
            <a
              href="https://ratul-dev.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="dev-social-btn dev-social-portfolio"
              title="Portfolio Website"
              aria-label="Portfolio"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}

