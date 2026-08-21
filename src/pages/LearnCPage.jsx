// src/pages/LearnCPage.jsx — C Programming Academy with 23 Chapters, Real-World Practice Labs & Coin Economy

import React, { useState, useEffect, useMemo } from 'react';
import { C_LESSONS, C_MODULES } from '../data/cLessons.js';
import { C_CHAPTER_QUIZZES } from '../data/cQuizzes.js';
import { C_CHAPTER_PRACTICES } from '../data/cPractices.js';
import { useAuth } from '../context/AuthContext.jsx';
import { CIcon, PythonIcon, CheckCircleIcon, SparklesIcon, AwardIcon, GoogleIcon, ArrowRightIcon, AlgoFlowXLogo } from '../components/Icons.jsx';
import CodePlayground from '../components/CodePlayground.jsx';
import InteractiveMemoryVisualizer from '../components/InteractiveMemoryVisualizer.jsx';
import AnalogyIllustrations from '../components/AnalogyIllustrations.jsx';
import CourseCertificateModal from '../components/CourseCertificateModal.jsx';

export default function LearnCPage({
  initialLessonSlug = 'hello-world-intro',
  onSelectAlgo,
  onOpenPythonModal,
}) {
  const {
    isAuthenticated,
    openAuthModal,
    signInWithDemo,
    user,
    cCompletedLessons,
    markCLessonCompleted,
    isCLessonCompleted,
    cQuizScores,
    saveCQuizScore,
    totalCScoredMarks,
    totalCQuizMarksPossible,
    cOverallGradePct,
    isCCourseFullyCompleted,
    userCoins,
    addCoins,
    spendCoins,
    unlockHint,
    isHintUnlocked,
  } = useAuth();

  const [currentSlug, setCurrentSlug] = useState(initialLessonSlug);
  const [mobileSyllabusOpen, setMobileSyllabusOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [copiedCodeId, setCopiedCodeId] = useState(null);
  const [certModalOpen, setCertModalOpen] = useState(false);

  // Coin Economy Modals & Toast State
  const [coinModalOpen, setCoinModalOpen] = useState(false);
  const [insufficientCoinsModal, setInsufficientCoinsModal] = useState(false);
  const [coinToast, setCoinToast] = useState({ visible: false, text: '' });

  // Real-World Practice Lab State (Drawer System)
  const [openDrawerIds, setOpenDrawerIds] = useState({});

  const toggleDrawer = (probId) => {
    setOpenDrawerIds((prev) => ({
      ...prev,
      [probId]: !prev[probId],
    }));
  };

  // 10-Question Chapter Quiz State
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [qId]: selectedOptIndex }
  const [revealedQuestions, setRevealedQuestions] = useState({}); // { [qId]: true }
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  // Show floating coin toast helper
  const triggerCoinToast = (text) => {
    setCoinToast({ visible: true, text });
    setTimeout(() => {
      setCoinToast({ visible: false, text: '' });
    }, 3500);
  };

  // Sync slug if prop changes
  useEffect(() => {
    if (initialLessonSlug && C_LESSONS.some((l) => l.slug === initialLessonSlug)) {
      setCurrentSlug(initialLessonSlug);
    }
  }, [initialLessonSlug]);

  // Reset quiz and practice state when switching lesson
  useEffect(() => {
    setCurrentQIndex(0);
    setUserAnswers({});
    setRevealedQuestions({});
    setIsQuizCompleted(false);
    const practices = C_CHAPTER_PRACTICES[currentSlug] || [];
    if (practices.length > 0) {
      setOpenDrawerIds({ [practices[0].id]: true });
    } else {
      setOpenDrawerIds({});
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      window.location.hash = `#learn/c/${currentSlug}`;
    } catch {}
  }, [currentSlug]);

  const activeLesson = useMemo(() => {
    return C_LESSONS.find((l) => l.slug === currentSlug) || C_LESSONS[0];
  }, [currentSlug]);

  const currentIndex = useMemo(() => {
    return C_LESSONS.findIndex((l) => l.slug === currentSlug);
  }, [currentSlug]);

  const prevLesson = currentIndex > 0 ? C_LESSONS[currentIndex - 1] : null;
  const nextLesson = currentIndex < C_LESSONS.length - 1 ? C_LESSONS[currentIndex + 1] : null;

  const completedCount = cCompletedLessons.length;
  const progressPercent = Math.round((completedCount / C_LESSONS.length) * 100);

  // Chapter Real-World Practice Problems
  const chapterPractices = useMemo(() => {
    return C_CHAPTER_PRACTICES[activeLesson.slug] || [];
  }, [activeLesson.slug]);

  const filteredLessons = useMemo(() => {
    if (!searchFilter.trim()) return C_LESSONS;
    const q = searchFilter.toLowerCase();
    return C_LESSONS.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q) ||
        (l.subtitle && l.subtitle.toLowerCase().includes(q))
    );
  }, [searchFilter]);

  // Group filtered lessons by module
  const modulesWithLessons = useMemo(() => {
    return C_MODULES.map((mod) => {
      const lessons = filteredLessons.filter((l) => l.moduleId === mod.id);
      const doneCount = lessons.filter((l) => isCLessonCompleted(l.slug)).length;
      return {
        ...mod,
        lessons,
        doneCount,
      };
    }).filter((mod) => mod.lessons.length > 0);
  }, [filteredLessons, isCLessonCompleted]);

  // 10-Question Examination Data & Handlers
  const chapterQuestions = useMemo(() => {
    return C_CHAPTER_QUIZZES[activeLesson.slug] || [];
  }, [activeLesson.slug]);

  const activeQuestion = chapterQuestions[currentQIndex] || chapterQuestions[0];
  const savedChapterScore = cQuizScores[activeLesson.slug];

  const currentQuizScore = useMemo(() => {
    return chapterQuestions.reduce((acc, q) => {
      return acc + (userAnswers[q.id] === q.correctIndex ? 1 : 0);
    }, 0);
  }, [chapterQuestions, userAnswers]);

  const handleSelectQuizOption = (optIdx) => {
    if (!activeQuestion) return;
    const qId = activeQuestion.id;
    if (revealedQuestions[qId]) return; // already answered

    const newAnswers = { ...userAnswers, [qId]: optIdx };
    const newRevealed = { ...revealedQuestions, [qId]: true };
    setUserAnswers(newAnswers);
    setRevealedQuestions(newRevealed);

    // Calculate score
    let correctCount = 0;
    chapterQuestions.forEach((q) => {
      if (newAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });

    // Check if this was the last question answered
    const answeredCount = Object.keys(newAnswers).length;
    if (answeredCount === chapterQuestions.length) {
      setIsQuizCompleted(true);
      saveCQuizScore(activeLesson.slug, correctCount, chapterQuestions.length);
      if (correctCount === 10) {
        triggerCoinToast('🪙 +25 Coins: Perfect 10/10 Score!');
      } else if (correctCount >= 7) {
        triggerCoinToast('🪙 +15 Coins: Quiz Passed!');
      } else {
        triggerCoinToast('🪙 +5 Coins: Quiz Completed!');
      }
    }
  };

  const handleNextQuizQuestion = () => {
    if (currentQIndex < chapterQuestions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      setIsQuizCompleted(true);
      let correctCount = 0;
      chapterQuestions.forEach((q) => {
        if (userAnswers[q.id] === q.correctIndex) {
          correctCount += 1;
        }
      });
      saveCQuizScore(activeLesson.slug, correctCount, chapterQuestions.length);
      if (correctCount === 10) {
        triggerCoinToast('🪙 +25 Coins: Perfect 10/10 Score!');
      } else if (correctCount >= 7) {
        triggerCoinToast('🪙 +15 Coins: Quiz Passed!');
      } else {
        triggerCoinToast('🪙 +5 Coins: Quiz Completed!');
      }
    }
  };

  const handleRetakeQuiz = () => {
    setUserAnswers({});
    setRevealedQuestions({});
    setCurrentQIndex(0);
    setIsQuizCompleted(false);
  };

  const handleNext = () => {
    if (nextLesson) {
      setCurrentSlug(nextLesson.slug);
    }
  };

  const handlePrev = () => {
    if (prevLesson) {
      setCurrentSlug(prevLesson.slug);
    }
  };

  const handleCopySnippet = (text, id) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedCodeId(id);
      setTimeout(() => setCopiedCodeId(null), 2000);
    }
  };

  const handleUnlockHint = (hintKey, cost, label) => {
    if (isHintUnlocked(hintKey)) return;
    const success = unlockHint(hintKey, cost);
    if (success) {
      triggerCoinToast(`🔓 Unlocked ${label} (-${cost} Coins)`);
    } else {
      setInsufficientCoinsModal(true);
    }
  };

  const getDifficultyBadgeClass = (level) => {
    if (level === 'Beginner' || level === 'Easy') return 'level-badge-green';
    if (level === 'Intermediate' || level === 'Medium') return 'level-badge-blue';
    return 'level-badge-purple';
  };

  return (
    <div className="learn-c-container">
      {/* ── Floating Coin Toast Notification ── */}
      {coinToast.visible && (
        <div className="coin-reward-toast animate-slide-up">
          <span className="toast-sparkle">✨</span>
          <span className="toast-text font-bold">{coinToast.text}</span>
        </div>
      )}

      {/* ── 1. Left Course Syllabus Sidebar ── */}
      <aside className="learn-c-sidebar">
        {/* Top Sidebar Brand Header */}
        <div className="sidebar-brand" style={{ display: 'flex' }}>
          <div
            className="sidebar-brand-left"
            onClick={() => {
              if (onSelectAlgo) onSelectAlgo(null);
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
        </div>

        {/* Synced Mode Switcher Bar */}
        <div className="sidebar-mode-switcher-bar">
          <button
            type="button"
            className="sidebar-mode-tab-btn"
            onClick={() => {
              if (onSelectAlgo) onSelectAlgo(null);
            }}
          >
            <span>⚡ DSA Studio</span>
          </button>
          <button
            type="button"
            className="sidebar-mode-tab-btn active"
          >
            <span>🎓 C Academy</span>
          </button>
        </div>

        {/* Track Header with Progress & Search */}
        <div className="sidebar-track-header">
          <div className="track-title-row">
            <div className="track-icon-c">
              <CIcon size={22} />
            </div>
            <div className="track-title-info">
              <div className="track-title-flex">
                <h2 className="track-title">C Learning Path</h2>
                <span className="track-percent-pill font-mono">{progressPercent}%</span>
              </div>
              <span className="track-subtitle">{completedCount} of {C_LESSONS.length} Completed</span>
            </div>
          </div>

          {/* Glowing Animated Progress Bar */}
          <div className="track-progress-track">
            <div
              className="track-progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Quick Search Filter */}
          <div className="sidebar-search-box">
            <span className="sidebar-search-icon">🔍</span>
            <input
              type="text"
              className="sidebar-search-input"
              placeholder="Search chapters & topics..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              aria-label="Filter chapters"
            />
            {searchFilter && (
              <button
                type="button"
                className="sidebar-search-clear"
                onClick={() => setSearchFilter('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Clean Module-by-Module Syllabus List */}
        <nav className="learn-syllabus-list" aria-label="C Course Syllabus">
          {modulesWithLessons.length === 0 ? (
            <div className="sidebar-empty-state">
              <span className="empty-icon">🔍</span>
              <p>No chapters match &ldquo;{searchFilter}&rdquo;</p>
              <button
                type="button"
                className="btn-clear-filter"
                onClick={() => setSearchFilter('')}
              >
                Clear Search
              </button>
            </div>
          ) : (
            modulesWithLessons.map((mod, mIdx) => (
              <div className="syllabus-module-section" key={mod.id}>
                {/* Module Header */}
                <div className={`module-header-row ${mod.doneCount === mod.lessons.length ? 'module-done' : ''}`}>
                  <div className="module-title-text">
                    <span className="module-num font-mono">M{mIdx + 1}</span>
                    <span className="module-name-str">{mod.name.replace(/^Module \d+:\s*/, '')}</span>
                  </div>
                  <div className={`module-count-badge font-mono ${mod.doneCount === mod.lessons.length ? 'badge-all-done' : ''}`}>
                    {mod.doneCount === mod.lessons.length ? '✓' : `${mod.doneCount}/${mod.lessons.length}`}
                  </div>
                </div>

                {/* Lessons within this Module */}
                <div className="module-lessons-list">
                  {mod.lessons.map((lesson) => {
                    const isActive = lesson.slug === currentSlug;
                    const isDone = isCLessonCompleted(lesson.slug);

                    return (
                      <button
                        key={lesson.slug}
                        type="button"
                        className={`syllabus-item ${isActive ? 'active' : ''} ${isDone ? 'completed' : ''}`}
                        onClick={() => setCurrentSlug(lesson.slug)}
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
        </nav>

        {/* ── Common Premium Developer Profile Card (Footer) ── */}
        <div className="sidebar-footer">
          <div className="dev-profile-card">
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

            <div className="dev-social-row">
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

      {/* ── Mobile Chapter Navigation Bar (Visible on Mobile/Tablet) ── */}
      <div className="mobile-chapter-selector-bar">
        <button
          type="button"
          className="btn-mobile-syllabus-toggle"
          onClick={() => setMobileSyllabusOpen(!mobileSyllabusOpen)}
        >
          <span className="mobile-ch-icon">📖</span>
          <span className="mobile-ch-name">Ch {activeLesson.chapter}: {activeLesson.title.replace(/^Chapter \d+:\s*/, '')}</span>
          <span className="mobile-ch-caret">{mobileSyllabusOpen ? '▲' : '▼'}</span>
        </button>
        <div className="mobile-header-right">
          <div className="academy-coin-pill font-mono cursor-pointer" onClick={() => setCoinModalOpen(true)}>
            <span>🪙 {userCoins}</span>
          </div>
          <span className="mobile-progress-badge font-mono">
            {completedCount}/{C_LESSONS.length} Done
          </span>
        </div>
      </div>

      {/* ── Mobile Syllabus Slideout Drawer / Dropdown ── */}
      {mobileSyllabusOpen && (
        <div className="mobile-syllabus-drawer animate-fade-in">
          <div className="mobile-syllabus-drawer-header">
            <div className="track-title-row">
              <div className="track-icon-c"><CIcon size={18} /></div>
              <div>
                <strong className="track-title">C Learning Path</strong>
                <span className="track-subtitle">{completedCount} of {C_LESSONS.length} Completed ({progressPercent}%)</span>
              </div>
            </div>
            <button
              type="button"
              className="btn-close-mobile-syllabus"
              onClick={() => setMobileSyllabusOpen(false)}
            >
              ✕
            </button>
          </div>

          <nav className="mobile-syllabus-list" aria-label="Mobile Course Syllabus">
            {modulesWithLessons.map((mod, mIdx) => (
              <div className="syllabus-module-section" key={mod.id}>
                <div className="module-header-row">
                  <span className="module-name-str font-bold">Module {mIdx + 1}: {mod.name.replace(/^Module \d+:\s*/, '')}</span>
                  <span className="module-count-badge font-mono">{mod.doneCount}/{mod.lessons.length}</span>
                </div>
                <div className="module-lessons-list">
                  {mod.lessons.map((lesson) => {
                    const isActive = lesson.slug === currentSlug;
                    const isDone = isCLessonCompleted(lesson.slug);
                    return (
                      <button
                        key={lesson.slug}
                        type="button"
                        className={`syllabus-item ${isActive ? 'active' : ''} ${isDone ? 'completed' : ''}`}
                        onClick={() => {
                          setCurrentSlug(lesson.slug);
                          setMobileSyllabusOpen(false);
                        }}
                      >
                        <div className="syllabus-item-status font-mono">
                          {isDone ? '✓' : String(lesson.chapter).padStart(2, '0')}
                        </div>
                        <div className="syllabus-item-content">
                          <div className="syllabus-item-title">{lesson.title.replace(/^Chapter \d+:\s*/, '')}</div>
                          <div className="syllabus-item-meta">
                            {isDone ? <span className="text-success font-bold">Completed ✓</span> : <span>{lesson.readTime}</span>}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>
      )}

      {/* ── 2. Main Lesson Article & Playground Area ── */}
      <main className="learn-c-main">
        {/* Top Header & Breadcrumb */}
        <div className="lesson-top-nav">
          <div className="lesson-breadcrumbs">
            <a
              href="#/"
              onClick={(e) => {
                e.preventDefault();
                if (onSelectAlgo) onSelectAlgo(null);
              }}
            >
              AlgoFlowX
            </a>
            <span>/</span>
            <span>Learn C</span>
            <span>/</span>
            <span>{activeLesson.moduleName}</span>
            <span>/</span>
            <span className="current-crumb">Chapter {activeLesson.chapter}</span>
          </div>

          <div className="lesson-top-badges">
            {/* Interactive Coin Economy Pill */}
            <div
              className="academy-coin-pill font-mono cursor-pointer"
              onClick={() => setCoinModalOpen(true)}
              title="Click to view Coin Rewards & Economy"
            >
              <span className="coin-icon">🪙</span>
              <span className="coin-amount">{userCoins} Coins</span>
              <span className="coin-plus-btn">+Earn</span>
            </div>

            <div
              className={`btn-lesson-complete ${isCLessonCompleted(activeLesson.slug) ? 'is-complete' : 'is-pending'}`}
              title={
                isCLessonCompleted(activeLesson.slug)
                  ? `Chapter Examination Passed (${savedChapterScore?.score || 10}/10 Marks)`
                  : 'Complete the 10-Question Chapter Examination to mark as Completed'
              }
            >
              {isCLessonCompleted(activeLesson.slug) ? (
                <>
                  <CheckCircleIcon size={14} />
                  <span>Passed ({savedChapterScore?.score || 10}/10 Marks)</span>
                </>
              ) : (
                <>
                  <span>🧠 Take Quiz to Complete</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Lesson Hero Header */}
        <div className="lesson-hero-header">
          <div className="lesson-tag-row">
            <span className={`level-pill-badge ${getDifficultyBadgeClass(activeLesson.level)}`}>
              {activeLesson.level}
            </span>
            <span className="lesson-cat-badge">{activeLesson.category}</span>
            <span className="lesson-time-badge">⏱ {activeLesson.readTime} read</span>
            <span className="lesson-step-badge">Chapter {activeLesson.chapter} of {C_LESSONS.length}</span>
          </div>
          <h1 className="lesson-main-title">{activeLesson.title}</h1>
          <p className="lesson-main-desc">{activeLesson.subtitle}</p>
        </div>

        {/* ── 0. Interactive Memory / Graphical Visualizer ── */}
        <section className="lesson-interactive-visualizer-section">
          <InteractiveMemoryVisualizer
            chapter={activeLesson.chapter}
            slug={activeLesson.slug}
          />
        </section>

        {/* ── 1. Intuitive Analogy Card ── */}
        {activeLesson.analogy && (
          <section className="lesson-analogy-card">
            <div className="analogy-header">
              <span className="analogy-icon">💡</span>
              <h2 className="analogy-title">{activeLesson.analogy.title}</h2>
            </div>
            <p className="analogy-text">{activeLesson.analogy.text}</p>

            {activeLesson.analogy.properties && (
              <div className="analogy-props-grid">
                {activeLesson.analogy.properties.map((prop, pIdx) => (
                  <div className="analogy-prop-item" key={pIdx}>
                    <div className="prop-badge">{prop.label}</div>
                    <div className="prop-desc">{prop.desc}</div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── 2. Interactive Analogy Illustrations ── */}
        <section className="lesson-analogy-illustration-wrapper">
          <AnalogyIllustrations
            chapter={activeLesson.chapter}
            slug={activeLesson.slug}
          />
        </section>

        {/* ── 2b. Core Comparison & Knowledge Tables (Why C, Real World Use, 4 Stages) ── */}
        {activeLesson.tables && activeLesson.tables.length > 0 && (
          <section className="lesson-tables-section">
            {activeLesson.tables.map((tbl, tIdx) => (
              <div className="lesson-table-card" key={tIdx}>
                <div className="table-card-header">
                  <h3 className="table-card-title">📊 {tbl.title}</h3>
                </div>
                <div className="lesson-table-wrapper">
                  <table className="lesson-data-table">
                    <thead>
                      <tr>
                        {tbl.headers.map((h, hIdx) => (
                          <th key={hIdx}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tbl.rows.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {row.map((cell, cIdx) => (
                            <td key={cIdx}>
                              {cIdx === 0 ? <strong>{cell}</strong> : cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* ── 3. Structured Lesson Sections ── */}
        {activeLesson.sections && activeLesson.sections.map((sec, sIdx) => {
          const rawTitle = sec.heading || sec.title || '';
          const displayTitle = rawTitle.replace(/^\d+\.\s*/, '');
          const bodyContent = sec.explanation || sec.text || '';

          return (
            <section className="lesson-content-block" key={sIdx}>
              <h2 className="lesson-section-h2">
                <span className="h2-index">{sIdx + 1}.</span> {displayTitle}
              </h2>

              {bodyContent && (
                <p className="lesson-body-text">
                  {bodyContent.split(/(`[^`]+`)/g).map((part, pIdx) => {
                    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
                      return (
                        <code key={pIdx} className="inline-code-badge">
                          {part.slice(1, -1)}
                        </code>
                      );
                    }
                    return part;
                  })}
                </p>
              )}

              {sec.table && (
                <div className="lesson-table-wrapper">
                  <table className="lesson-data-table">
                    <thead>
                      <tr>
                        {sec.table.headers.map((h, hIdx) => (
                          <th key={hIdx}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sec.table.rows.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {row.map((cell, cIdx) => (
                            <td key={cIdx}>
                              {cIdx === 0 ? <code>{cell}</code> : cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {sec.codeSnippet && (
                <div className="lesson-code-snippet-card">
                  <div className="code-snippet-top-bar">
                    <span className="code-lang-label font-mono">C SOURCE CODE</span>
                    <button
                      type="button"
                      className="btn-copy-snippet"
                      onClick={() => handleCopySnippet(sec.codeSnippet, `sec-${sIdx}`)}
                    >
                      {copiedCodeId === `sec-${sIdx}` ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                  <pre className="code-snippet-pre"><code>{sec.codeSnippet}</code></pre>
                </div>
              )}

              {sec.tip && (
                <div className="lesson-callout-tip">
                  <span className="tip-badge">💡 PRO TIP:</span>
                  <span className="tip-text">{sec.tip}</span>
                </div>
              )}
            </section>
          );
        })}

        {/* ── 3b. Common Beginner Mistakes & Gotchas ── */}
        {activeLesson.commonMistakes && activeLesson.commonMistakes.length > 0 && (
          <section className="lesson-mistakes-section">
            <h3 className="mistakes-section-title">⚠️ Common Mistakes & How to Avoid Them</h3>
            <div className="mistakes-grid">
              {activeLesson.commonMistakes.map((m, mIdx) => (
                <div className="mistake-item-card" key={mIdx}>
                  <div className="mistake-title">❌ {m.mistake}</div>
                  <div className="mistake-why"><strong>Why it happens:</strong> {m.why}</div>
                  <div className="mistake-fix"><strong>The Fix:</strong> {m.fix}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 4. "Try It Yourself" Live C Code Playground ── */}
        <section className="lesson-playground-section">
          <div className="playground-section-header">
            <div className="playground-header-title-group">
              <h2 className="playground-section-title">
                💻 Live Interactive C Playground
              </h2>
              <span className="playground-chapter-tag">
                Chapter {activeLesson.chapter} Sandbox
              </span>
            </div>
            <p className="playground-section-desc">
              Edit the working code below, experiment with variables, and hit <strong>"Run Code"</strong> to test compilation and inspect real terminal output!
            </p>
          </div>

          <CodePlayground
            lesson={activeLesson}
            onRunSuccess={() => markCLessonCompleted(activeLesson.slug)}
          />
        </section>

        {/* ── 5. REAL-WORLD PRACTICE LAB (Practice Challenges with Tiered Coin Hints) ── */}
        {chapterPractices.length > 0 && (
          <section className="practice-lab-section">
            <div className="practice-lab-header">
              <div className="lab-title-group">
                <span className="lab-badge font-mono">🛠️ INDUSTRY LAB</span>
                <div>
                  <h3 className="practice-lab-title">Real-World Practice Challenges</h3>
                  <span className="practice-lab-subtitle">
                    Chapter {activeLesson.chapter} • {chapterPractices.length} Practical Challenges
                  </span>
                </div>
              </div>
              <div className="lab-coins-info">
                <button
                  type="button"
                  className="academy-coin-pill font-mono cursor-pointer"
                  onClick={() => setCoinModalOpen(true)}
                  title="View Coin Balance & Rewards"
                >
                  <span className="coin-icon">🪙</span>
                  <span className="coin-amount">{userCoins} Coins</span>
                  <span className="coin-plus-btn">+Earn</span>
                </button>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="drawers-control-bar">
              <span className="drawers-count-hint font-mono">
                {chapterPractices.length} Challenges Available • Click any drawer to expand &amp; solve
              </span>
              <button
                type="button"
                className="btn-toggle-all-drawers font-mono"
                onClick={() => {
                  const allOpen = chapterPractices.every((p) => openDrawerIds[p.id]);
                  const newMap = {};
                  chapterPractices.forEach((p) => {
                    newMap[p.id] = !allOpen;
                  });
                  setOpenDrawerIds(newMap);
                }}
              >
                {chapterPractices.every((p) => openDrawerIds[p.id]) ? '▲ Collapse All' : '▼ Expand All'}
              </button>
            </div>

            {/* Expandable Problem Drawers List */}
            <div className="practice-drawers-list">
              {chapterPractices.map((prob, pIdx) => {
                const isOpen = !!openDrawerIds[prob.id];

                return (
                  <div
                    key={prob.id}
                    className={`problem-drawer-item ${isOpen ? 'drawer-is-open' : 'drawer-is-closed'}`}
                  >
                    {/* Drawer Header Accordion Button */}
                    <button
                      type="button"
                      className="drawer-header-btn"
                      onClick={() => toggleDrawer(prob.id)}
                      aria-expanded={isOpen}
                    >
                      <div className="drawer-header-left">
                        <span className="drawer-index-pill font-mono font-bold">
                          #{pIdx + 1}
                        </span>
                        <span className={`prob-diff-pill ${getDifficultyBadgeClass(prob.difficulty)} font-mono`}>
                          {prob.difficulty}
                        </span>
                        <span className="drawer-title-text font-bold">
                          {prob.title}
                        </span>
                      </div>

                      <div className="drawer-header-right">
                        {prob.hints && prob.hints.length > 0 && (
                          <span className="drawer-hints-pill font-mono">
                            💡 {prob.hints.length} Hints
                          </span>
                        )}
                        <span className="drawer-state-action font-mono">
                          {isOpen ? 'Close' : 'Open Drawer'}
                        </span>
                        <span className="drawer-chevron-icon">
                          {isOpen ? '▲' : '▼'}
                        </span>
                      </div>
                    </button>

                    {/* Drawer Expandable Body */}
                    {isOpen && (
                      <div className="drawer-body-content animate-fade-in">
                        {/* Challenge Problem Statement & Description */}
                        <div className="challenge-problem-body">
                          <div className="problem-description-box">
                            <p className="problem-statement-text">{prob.description || prob.scenario}</p>
                          </div>

                          {/* Input & Output Specifications Grid */}
                          <div className="challenge-spec-grid">
                            <div className="spec-card">
                              <div className="spec-header">
                                <span className="spec-title font-mono font-bold">📥 INPUT SPECIFICATION</span>
                              </div>
                              <p className="spec-desc">{prob.inputSpec || 'Standard console input stream.'}</p>
                              {prob.sampleInput && (
                                <div className="sample-io-box">
                                  <span className="sample-label font-mono">Sample Input:</span>
                                  <pre className="sample-pre font-mono"><code>{prob.sampleInput}</code></pre>
                                </div>
                              )}
                            </div>

                            <div className="spec-card">
                              <div className="spec-header">
                                <span className="spec-title font-mono font-bold">📤 OUTPUT SPECIFICATION</span>
                              </div>
                              <p className="spec-desc">{prob.outputSpec || 'Print according to expected format.'}</p>
                              {prob.sampleOutput && (
                                <div className="sample-io-box">
                                  <span className="sample-label font-mono">Sample Output:</span>
                                  <pre className="sample-pre font-mono"><code>{prob.sampleOutput}</code></pre>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Tiered Coin Hints Unlocker */}
                        {prob.hints && prob.hints.length > 0 && (
                          <div className="practice-hints-container">
                            <div className="hints-header-row">
                              <div className="hints-title-box">
                                <span className="hints-icon">💡</span>
                                <span className="hints-heading font-bold">Guided Hints &amp; Solutions</span>
                              </div>
                              <span className="hints-sub font-mono">Unlock hints with your coins (Balance: 🪙 {userCoins})</span>
                            </div>

                            <div className="hints-list-grid">
                              {prob.hints.map((hint, hIdx) => {
                                const hintKey = `${prob.id}_hint_${hIdx}`;
                                const unlocked = isHintUnlocked(hintKey);

                                return (
                                  <div
                                    key={hIdx}
                                    className={`practice-hint-card ${unlocked ? 'hint-is-unlocked' : 'hint-is-locked'}`}
                                  >
                                    <div className="hint-card-header">
                                      <div className="hint-label-group">
                                        <span className="hint-state-icon">{unlocked ? '🔓' : '🔒'}</span>
                                        <span className="hint-card-label font-bold">{hint.label}</span>
                                      </div>
                                      {!unlocked ? (
                                        <button
                                          type="button"
                                          className="btn-unlock-hint-action font-mono"
                                          onClick={() => handleUnlockHint(hintKey, hint.cost, hint.label)}
                                        >
                                          <span>Unlock Hint</span>
                                          <span className="hint-cost-tag font-mono">🪙 {hint.cost} Coins</span>
                                        </button>
                                      ) : (
                                        <span className="hint-unlocked-tag font-mono">✓ Unlocked</span>
                                      )}
                                    </div>
                                    {unlocked ? (
                                      <p className="hint-revealed-text">{hint.text}</p>
                                    ) : (
                                      <p className="hint-locked-preview font-mono">
                                        Spend 🪙 {hint.cost} coins to unlock this step-by-step guidance.
                                      </p>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Direct Interactive Code Playground for this Challenge */}
                        <div className="practice-playground-wrapper">
                          <div className="practice-pg-header">
                            <span className="pg-title font-mono">💻 Live Challenge Sandbox — Challenge #{pIdx + 1}</span>
                          </div>
                          <CodePlayground
                            starterCode={prob.starterCode}
                            expectedOutput={prob.sampleOutput}
                            onRunSuccess={() => {
                              addCoins(15, `Practice Challenge #${pIdx + 1} Solved!`);
                              triggerCoinToast('🪙 +15 Coins: Challenge Solved! 🎉');
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── 7. Interactive 10-Question Examination & Knowledge Check ── */}
        <section className="lesson-quiz-card">
          {!isAuthenticated ? (
            /* Authentication Gate for Quiz */
            <div className="quiz-auth-gate-card animate-fade-in">
              <div className="quiz-gate-icon">🔐</div>
              <h3 className="quiz-gate-title">Sign In to Take Chapter {activeLesson.chapter} Examination</h3>
              <p className="quiz-gate-desc">
                Chapter quizzes and total marks tracking require authentication so your scores, coin rewards, and official <strong>Certificate of Completion</strong> are securely tied to your profile.
              </p>
              <div className="quiz-gate-perks">
                <div className="gate-perk-item">
                  <span className="perk-check">✓</span>
                  <span>Track your 23-chapter progress across all devices</span>
                </div>
                <div className="gate-perk-item">
                  <span className="perk-check">✓</span>
                  <span>Earn coins for perfect quiz scores to unlock hints</span>
                </div>
                <div className="gate-perk-item">
                  <span className="perk-check">✓</span>
                  <span>Earn your verified AlgoFlowX Course Completion Certificate</span>
                </div>
              </div>
              <div className="quiz-gate-actions">
                <button
                  type="button"
                  className="btn btn-primary btn-md"
                  onClick={openAuthModal}
                >
                  <GoogleIcon size={16} />
                  <span>Sign In with Google to Start Quiz &rarr;</span>
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => signInWithDemo('Explorer Learner')}
                >
                  Quick Demo Sign-In
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Quiz Top Header & Score Tracker */}
              <div className="quiz-top-status-bar">
                <div className="quiz-status-left">
                  <span className="quiz-badge">
                    🧠 Chapter {activeLesson.chapter} Examination (10 Questions)
                  </span>
                  <span className="quiz-step-text font-mono">
                    Question {currentQIndex + 1} of {chapterQuestions.length}
                  </span>
                </div>
                <div className="quiz-status-right">
                  <span className="quiz-marks-badge font-mono">
                    Best Score: <strong>{savedChapterScore ? `${savedChapterScore.score}/10` : 'Not Taken'}</strong>
                  </span>
                </div>
              </div>

              {/* Question Step Pills (1 to 10) */}
              <div className="quiz-step-pills-row">
                {chapterQuestions.map((q, idx) => {
                  const isCurrent = idx === currentQIndex;
                  const isAnswered = userAnswers[q.id] !== undefined;
                  const isCorrect = userAnswers[q.id] === q.correctIndex;
                  let pillClass = 'step-pill';
                  if (isCurrent) pillClass += ' pill-current';
                  if (isAnswered) pillClass += isCorrect ? ' pill-correct' : ' pill-wrong';

                  return (
                    <button
                      key={q.id}
                      type="button"
                      className={pillClass}
                      onClick={() => setCurrentQIndex(idx)}
                      title={`Question ${idx + 1}`}
                    >
                      {isAnswered ? (isCorrect ? '✓' : '✗') : idx + 1}
                    </button>
                  );
                })}
              </div>

              {!isQuizCompleted ? (
                /* Active Question View */
                activeQuestion && (
                  <div className="active-question-container">
                    <h3 className="quiz-question-title font-mono">
                      <span className="q-number-prefix">Q{currentQIndex + 1}:</span> {activeQuestion.question}
                    </h3>

                    <div className="quiz-options-grid">
                      {activeQuestion.options.map((opt, optIdx) => {
                        const isAnswered = userAnswers[activeQuestion.id] !== undefined;
                        const isSelected = userAnswers[activeQuestion.id] === optIdx;
                        const isCorrect = optIdx === activeQuestion.correctIndex;

                        let btnClass = 'quiz-option-btn';
                        if (isAnswered) {
                          if (isCorrect) {
                            btnClass += ' correct';
                          } else if (isSelected) {
                            btnClass += ' incorrect';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            className={btnClass}
                            onClick={() => handleSelectQuizOption(optIdx)}
                            disabled={isAnswered}
                          >
                            <span className="opt-letter">{String.fromCharCode(65 + optIdx)}</span>
                            <span className="opt-text">{opt}</span>
                            {isAnswered && isCorrect && (
                              <span className="opt-feedback">✓ Correct</span>
                            )}
                            {isAnswered && isSelected && !isCorrect && (
                              <span className="opt-feedback opt-wrong">✗ Incorrect</span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Immediate Explanation Card */}
                    {userAnswers[activeQuestion.id] !== undefined && (
                      <div
                        className={`quiz-explanation ${
                          userAnswers[activeQuestion.id] === activeQuestion.correctIndex
                            ? 'success'
                            : 'retry'
                        }`}
                      >
                        <div className="explanation-title">
                          {userAnswers[activeQuestion.id] === activeQuestion.correctIndex
                            ? '🎉 Correct! Well done.'
                            : '💡 Not quite right! Here is the explanation:'}
                        </div>
                        <p className="explanation-text">{activeQuestion.explanation}</p>
                      </div>
                    )}

                    {/* Question Footer Navigation */}
                    <div className="quiz-question-actions">
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        disabled={currentQIndex === 0}
                        onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                      >
                        &larr; Previous Question
                      </button>
                      {currentQIndex < chapterQuestions.length - 1 ? (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={handleNextQuizQuestion}
                          disabled={userAnswers[activeQuestion.id] === undefined}
                        >
                          Next Question &rarr;
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={handleNextQuizQuestion}
                          disabled={userAnswers[activeQuestion.id] === undefined}
                        >
                          Finish Examination & Check Score 🎯
                        </button>
                      )}
                    </div>
                  </div>
                )
              ) : (
                /* End-of-Quiz Result Scorecard */
                <div className="quiz-result-scorecard animate-fade-in">
                  <div className="result-badge-icon">
                    {currentQuizScore >= 8 ? '🏆' : currentQuizScore >= 5 ? '🌟' : '📚'}
                  </div>
                  <h3 className="result-card-title">Chapter {activeLesson.chapter} Examination Complete!</h3>
                  <p className="result-score-highlight font-mono">
                    You Scored: <strong>{currentQuizScore} / 10 Marks</strong> ({Math.round((currentQuizScore / 10) * 100)}%)
                  </p>
                  <p className="result-card-feedback">
                    {currentQuizScore >= 9
                      ? 'Outstanding! You earned +25 Coins and thoroughly mastered this topic.'
                      : currentQuizScore >= 7
                      ? 'Great job! You earned +15 Coins with a solid grasp of these core concepts.'
                      : 'Good attempt! You earned +5 Coins. Review the lessons above and retake the quiz anytime to boost your score.'}
                  </p>

                  <div className="result-actions-row">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={handleRetakeQuiz}
                    >
                      🔄 Retake Chapter Quiz
                    </button>
                    {nextLesson && (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={handleNext}
                      >
                        Continue to Chapter {nextLesson.chapter} &rarr;
                      </button>
                    )}
                    {isCCourseFullyCompleted && (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm btn-gold-cert"
                        onClick={() => setCertModalOpen(true)}
                      >
                        🎓 View &amp; Download Completion Certificate
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        {/* ── 8. Lesson Navigation Controls Footer ── */}
        <div className="lesson-footer-nav">
          {prevLesson ? (
            <button
              type="button"
              className="btn btn-secondary btn-nav-prev"
              onClick={handlePrev}
            >
              &larr; Chapter {prevLesson.chapter}: {prevLesson.title.replace(/^Chapter \d+:\s*/, '')}
            </button>
          ) : (
            <div />
          )}

          {nextLesson ? (
            <button
              type="button"
              className="btn btn-primary btn-nav-next"
              onClick={handleNext}
            >
              Next: Chapter {nextLesson.chapter} &rarr;
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary btn-nav-next btn-gold-cert"
              onClick={() => setCertModalOpen(true)}
            >
              🎓 Course 100% Completed! Claim Official Certificate &rarr;
            </button>
          )}
        </div>
      </main>

      {/* ── Official Course Completion Certificate Modal ── */}
      <CourseCertificateModal
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
      />

      {/* ── Coin Economy Explanation Modal ── */}
      {coinModalOpen && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setCoinModalOpen(false)}>
          <div className="modal-card coin-info-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-row">
                <span className="modal-icon">🪙</span>
                <h3 className="modal-title font-bold">AlgoFlowX Coin Economy</h3>
              </div>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setCoinModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="coin-current-balance-banner">
                <span className="balance-label font-mono">YOUR CURRENT COINS</span>
                <span className="balance-amount font-mono">🪙 {userCoins} Coins</span>
                <p className="balance-sub">Every new learner receives 50 free gift coins to kickstart their journey!</p>
              </div>

              <h4 className="coin-rules-title font-bold">🎯 How to Earn More Coins:</h4>
              <div className="coin-earn-rules-grid">
                <div className="coin-rule-card">
                  <span className="rule-badge font-mono">+25 Coins</span>
                  <strong className="rule-title">Perfect Quiz Score (100%)</strong>
                  <p className="rule-desc">Answer all 10 questions correctly in any chapter examination.</p>
                </div>
                <div className="coin-rule-card">
                  <span className="rule-badge font-mono">+15 Coins</span>
                  <strong className="rule-title">Quiz Passing Grade (&gt;= 70%)</strong>
                  <p className="rule-desc">Score 7/10 or higher in any chapter quiz.</p>
                </div>
                <div className="coin-rule-card">
                  <span className="rule-badge font-mono">+15 Coins</span>
                  <strong className="rule-title">Solve Practice Problem</strong>
                  <p className="rule-desc">Run working code in the Real-World Practice Lab.</p>
                </div>
                <div className="coin-rule-card">
                  <span className="rule-badge font-mono">+10 Coins</span>
                  <strong className="rule-title">Complete Chapter Lesson</strong>
                  <p className="rule-desc">Read through and finish a core lesson chapter.</p>
                </div>
              </div>

              <h4 className="coin-rules-title font-bold" style={{ marginTop: '1.25rem' }}>🔓 How to Spend Coins:</h4>
              <p className="coin-spend-desc">
                Use your coins in the <strong>Real-World Practice Lab</strong> to unlock concept hints (5 coins), logic blueprints (10 coins), and solution skeletons (15 coins) whenever you need guidance!
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setCoinModalOpen(false)}
              >
                Got It, Let's Code! &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Insufficient Coins Modal ── */}
      {insufficientCoinsModal && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setInsufficientCoinsModal(false)}>
          <div className="modal-card coin-alert-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-row">
                <span className="modal-icon">⚠️</span>
                <h3 className="modal-title font-bold">Need More Coins!</h3>
              </div>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setInsufficientCoinsModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body text-center">
              <div className="coin-alert-icon">🪙</div>
              <p className="coin-alert-msg">
                You currently have <strong>{userCoins} Coins</strong>, which is not enough to unlock this hint.
              </p>
              <div className="coin-alert-ways">
                <span className="ways-label font-bold">Earn coins quickly by:</span>
                <ul>
                  <li>🧠 Taking a Chapter Quiz (Earn up to <strong>+25 Coins</strong>)</li>
                  <li>💻 Solving another practice problem in the Sandbox (Earn <strong>+15 Coins</strong>)</li>
                  <li>📖 Completing new chapter lessons (Earn <strong>+10 Coins</strong>)</li>
                </ul>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setInsufficientCoinsModal(false);
                  const quizElem = document.querySelector('.lesson-quiz-card');
                  if (quizElem) quizElem.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Take Chapter Quiz to Earn Coins &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
