import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { initGoogleOneTap } from '../utils/googleAuth.js';
import { upsertUserProfile, fetchUserProfile } from '../utils/supabase.js';

const AuthContext = createContext(null);

const STORAGE_KEY_USER = 'algoflowx_auth_user';
const STORAGE_KEY_BOOKMARKS = 'algoflowx_bookmarks';
const STORAGE_KEY_COMPLETED = 'algoflowx_completed';
const STORAGE_KEY_C_COMPLETED = 'algoflowx_c_completed';
const STORAGE_KEY_C_QUIZ_SCORES = 'algoflowx_c_quiz_scores';
const STORAGE_KEY_USER_COINS = 'algoflowx_user_coins';
const STORAGE_KEY_UNLOCKED_HINTS = 'algoflowx_unlocked_hints';

export function AuthProvider({ children }) {
  // ── 1. User State & Session Restoration ──
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // ── 2. Coin Economy & Hints State (Initial Gift: 50 Coins) ──
  const [userCoins, setUserCoins] = useState(() => {
    if (typeof window === 'undefined') return 50;
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER_COINS);
      return saved !== null ? parseInt(saved, 10) : 50;
    } catch {
      return 50;
    }
  });

  const [unlockedHints, setUnlockedHints] = useState(() => {
    if (typeof window === 'undefined') return {};
    try {
      const saved = localStorage.getItem(STORAGE_KEY_UNLOCKED_HINTS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Save Coins to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USER_COINS, String(userCoins));
    } catch (e) {
      console.warn('Failed to save user coins:', e);
    }
  }, [userCoins]);

  // Save Unlocked Hints to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_UNLOCKED_HINTS, JSON.stringify(unlockedHints));
    } catch (e) {
      console.warn('Failed to save unlocked hints:', e);
    }
  }, [unlockedHints]);

  // ── 3. Progress, Quiz Scores & Bookmarks State ──
  const [bookmarkedAlgos, setBookmarkedAlgos] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
      return saved ? JSON.parse(saved) : ['quick-sort', 'dijkstra', 'bst'];
    } catch {
      return ['quick-sort', 'dijkstra', 'bst'];
    }
  });

  const [completedAlgos, setCompletedAlgos] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMPLETED);
      return saved ? JSON.parse(saved) : ['bubble-sort', 'binary-search'];
    } catch {
      return ['bubble-sort', 'binary-search'];
    }
  });

  const [cCompletedLessons, setCCompletedLessons] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY_C_COMPLETED);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [cQuizScores, setCQuizScores] = useState(() => {
    if (typeof window === 'undefined') return {};
    try {
      const saved = localStorage.getItem(STORAGE_KEY_C_QUIZ_SCORES);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Save Quiz Scores to LocalStorage & Cloud
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_C_QUIZ_SCORES, JSON.stringify(cQuizScores));
    } catch (e) {
      console.warn('Failed to save C quiz scores:', e);
    }
  }, [cQuizScores]);

  // Save Bookmarks to LocalStorage & Supabase
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(bookmarkedAlgos));
    } catch (e) {
      console.warn('Failed to save bookmarks:', e);
    }
    if (user) {
      upsertUserProfile(user, bookmarkedAlgos, completedAlgos, cCompletedLessons);
    }
  }, [bookmarkedAlgos, user, completedAlgos, cCompletedLessons]);

  // Save Completed algorithms to LocalStorage & Supabase
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify(completedAlgos));
    } catch (e) {
      console.warn('Failed to save completed algorithms:', e);
    }
    if (user) {
      upsertUserProfile(user, bookmarkedAlgos, completedAlgos, cCompletedLessons);
    }
  }, [completedAlgos, user, bookmarkedAlgos, cCompletedLessons]);

  // Save Completed C Lessons to LocalStorage & Supabase
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_C_COMPLETED, JSON.stringify(cCompletedLessons));
    } catch (e) {
      console.warn('Failed to save completed C lessons:', e);
    }
    if (user) {
      upsertUserProfile(user, bookmarkedAlgos, completedAlgos, cCompletedLessons);
    }
  }, [cCompletedLessons, user, bookmarkedAlgos, completedAlgos]);

  // ── 4. Google Sign-In & Login Handlers ──
  const handleGoogleSuccess = useCallback((userProfile, credentialToken) => {
    const fullUser = {
      ...userProfile,
      token: credentialToken || null,
      lastLogin: new Date().toISOString(),
    };
    setUser(fullUser);
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(fullUser));
    } catch (e) {
      console.warn('Failed to save user session:', e);
    }

    // Sync to Supabase & restore any existing cloud profile
    upsertUserProfile(fullUser, bookmarkedAlgos, completedAlgos, cCompletedLessons);
    fetchUserProfile(fullUser.sub || fullUser.email).then((remoteData) => {
      if (remoteData) {
        if (Array.isArray(remoteData.bookmarked_algos) && remoteData.bookmarked_algos.length > 0) {
          setBookmarkedAlgos(prev => Array.from(new Set([...prev, ...remoteData.bookmarked_algos])));
        }
        if (Array.isArray(remoteData.completed_algos) && remoteData.completed_algos.length > 0) {
          setCompletedAlgos(prev => Array.from(new Set([...prev, ...remoteData.completed_algos])));
        }
        if (Array.isArray(remoteData.c_completed_lessons) && remoteData.c_completed_lessons.length > 0) {
          setCCompletedLessons(prev => Array.from(new Set([...prev, ...remoteData.c_completed_lessons])));
        }
      }
    });

    setAuthModalOpen(false);
  }, [bookmarkedAlgos, completedAlgos, cCompletedLessons]);

  // Demo Sign-In for instant preview without Google credentials
  const signInWithDemo = useCallback((demoName = 'Algo Explorer', demoEmail = 'learner@algoflowx.dev') => {
    const demoUser = {
      sub: 'demo-' + Date.now(),
      name: demoName,
      email: demoEmail,
      email_verified: true,
      picture: '',
      provider: 'demo',
      lastLogin: new Date().toISOString(),
    };
    setUser(demoUser);
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(demoUser));
    } catch (e) {
      console.warn('Failed to save demo user session:', e);
    }
    upsertUserProfile(demoUser, bookmarkedAlgos, completedAlgos, cCompletedLessons);
    setAuthModalOpen(false);
  }, [bookmarkedAlgos, completedAlgos, cCompletedLessons]);

  // Sign Out Handler
  const signOut = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY_USER);
      if (window.google?.accounts?.id) {
        window.google.accounts.id.disableAutoSelect();
      }
    } catch (e) {
      console.warn('Failed to clear session:', e);
    }
  }, []);

  // ── 5. Automatic Google One Tap on Mount ──
  useEffect(() => {
    if (!user && typeof window !== 'undefined') {
      const timer = setTimeout(() => {
        initGoogleOneTap({
          onCredentialResponse: (userProfile, credential) => {
            handleGoogleSuccess(userProfile, credential);
          },
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user, handleGoogleSuccess]);

  // ── 6. Coin Economy Methods ──
  const addCoins = useCallback((amount, reason = '') => {
    if (!amount || amount <= 0) return;
    setUserCoins((prev) => prev + amount);
  }, []);

  const spendCoins = useCallback((amount) => {
    if (userCoins < amount) return false;
    setUserCoins((prev) => prev - amount);
    return true;
  }, [userCoins]);

  const unlockHint = useCallback((hintKey, cost = 5) => {
    if (!hintKey) return false;
    if (unlockedHints[hintKey]) return true; // Already unlocked!
    if (userCoins < cost) return false;      // Insufficient coins

    setUserCoins((prev) => prev - cost);
    setUnlockedHints((prev) => ({ ...prev, [hintKey]: true }));
    return true;
  }, [userCoins, unlockedHints]);

  const isHintUnlocked = useCallback((hintKey) => {
    return Boolean(unlockedHints[hintKey]);
  }, [unlockedHints]);

  // ── 7. Bookmark & Checklist Toggles ──
  const toggleBookmark = useCallback((slug) => {
    if (!slug) return;
    setBookmarkedAlgos((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }, []);

  const toggleCompleted = useCallback((slug) => {
    if (!slug) return;
    setCompletedAlgos((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }, []);

  const toggleCLessonCompleted = useCallback((slug) => {
    if (!slug) return;
    setCCompletedLessons((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }, []);

  const markCLessonCompleted = useCallback((slug) => {
    if (!slug) return;
    setCCompletedLessons((prev) => {
      if (!prev.includes(slug)) {
        addCoins(10, 'Chapter Lesson Completed');
        return [...prev, slug];
      }
      return prev;
    });
  }, [addCoins]);

  const saveCQuizScore = useCallback((slug, score, total = 10) => {
    if (!slug) return;
    const isFirstTime = !cQuizScores[slug];
    setCQuizScores((prev) => {
      const updated = {
        ...prev,
        [slug]: {
          score,
          total,
          percentage: Math.round((score / total) * 100),
          completedAt: new Date().toISOString(),
        },
      };
      setCCompletedLessons(Object.keys(updated));
      return updated;
    });

    // Reward coins on quiz completion
    if (isFirstTime) {
      if (score === 10) {
        addCoins(25, 'Perfect Quiz Score (100%)');
      } else if (score >= 7) {
        addCoins(15, 'Quiz Passed');
      } else {
        addCoins(5, 'Quiz Completed');
      }
    }
  }, [cQuizScores, addCoins]);

  const isBookmarked = useCallback((slug) => bookmarkedAlgos.includes(slug), [bookmarkedAlgos]);
  const isCompleted = useCallback((slug) => completedAlgos.includes(slug), [completedAlgos]);
  
  // Chapter is completed if quiz taken
  const isCLessonCompleted = useCallback((slug) => {
    return Boolean(cQuizScores[slug] && cQuizScores[slug].score !== undefined);
  }, [cQuizScores]);

  // Overall marks calculations across all 23 chapters
  const totalCChapters = 23;
  const totalCQuizMarksPossible = totalCChapters * 10; // 230 points total
  const completedQuizCount = Object.keys(cQuizScores).length;
  const totalCScoredMarks = Object.values(cQuizScores).reduce((acc, curr) => acc + (curr.score || 0), 0);
  const totalCQuestionsAnswered = Object.values(cQuizScores).reduce((acc, curr) => acc + (curr.total || 10), 0);
  const cOverallGradePct = totalCQuestionsAnswered > 0
    ? Math.round((totalCScoredMarks / totalCQuestionsAnswered) * 100)
    : 0;

  const isCCourseFullyCompleted = completedQuizCount >= totalCChapters;
  
  // ── Student Mastery Rank ──
  const userRank = useMemo(() => {
    const chapters = completedQuizCount;
    if (chapters >= 23) return { title: 'C Grandmaster & Architect', icon: '👑', color: '#f59e0b', level: 5 };
    if (chapters >= 15) return { title: 'Algorithm Master', icon: '🏆', color: '#38bdf8', level: 4 };
    if (chapters >= 8) return { title: 'Logic Knight', icon: '⚔️', color: '#818cf8', level: 3 };
    if (chapters >= 3) return { title: 'Syntax Apprentice', icon: '⚡', color: '#10b981', level: 2 };
    return { title: 'Novice Coder', icon: '🌱', color: '#94a3b8', level: 1 };
  }, [completedQuizCount]);

  // ── Custom Display Name Update ──
  const updateUserName = useCallback((newName) => {
    if (!newName || !newName.trim()) return;
    const trimmed = newName.trim();
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, name: trimmed, given_name: trimmed.split(' ')[0] };
      try {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to update user name:', e);
      }
      return updated;
    });
  }, []);

  // ── Reset All Learning Progress ──
  const resetAllProgress = useCallback(() => {
    setBookmarkedAlgos([]);
    setCompletedAlgos([]);
    setCCompletedLessons([]);
    setCQuizScores({});
    setUnlockedHints({});
    setUserCoins(50);
    try {
      localStorage.removeItem(STORAGE_KEY_BOOKMARKS);
      localStorage.removeItem(STORAGE_KEY_COMPLETED);
      localStorage.removeItem(STORAGE_KEY_C_COMPLETED);
      localStorage.removeItem(STORAGE_KEY_C_QUIZ_SCORES);
      localStorage.removeItem(STORAGE_KEY_UNLOCKED_HINTS);
      localStorage.setItem(STORAGE_KEY_USER_COINS, '50');
    } catch (e) {
      console.warn('Failed to reset storage:', e);
    }
  }, []);

  const value = {
    user,
    isAuthenticated: Boolean(user),
    loading,
    authModalOpen,
    setAuthModalOpen,
    openAuthModal: () => setAuthModalOpen(true),
    closeAuthModal: () => setAuthModalOpen(false),
    handleGoogleSuccess,
    signInWithDemo,
    signOut,
    updateUserName,
    resetAllProgress,
    userRank,
    userCoins,
    addCoins,
    spendCoins,
    unlockHint,
    isHintUnlocked,
    unlockedHints,
    bookmarkedAlgos,
    completedAlgos,
    cCompletedLessons: Object.keys(cQuizScores),
    cQuizScores,
    saveCQuizScore,
    totalCChapters,
    completedQuizCount,
    totalCQuizMarksPossible,
    totalCScoredMarks,
    totalCQuestionsAnswered,
    cOverallGradePct,
    isCCourseFullyCompleted,
    toggleBookmark,
    toggleCompleted,
    toggleCLessonCompleted,
    markCLessonCompleted,
    isBookmarked,
    isCompleted,
    isCLessonCompleted,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
