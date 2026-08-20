// src/context/AuthContext.jsx — Global Authentication & Learning Progress Context

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { initGoogleOneTap } from '../utils/googleAuth.js';

const AuthContext = createContext(null);

const STORAGE_KEY_USER = 'algoflowx_auth_user';
const STORAGE_KEY_BOOKMARKS = 'algoflowx_bookmarks';
const STORAGE_KEY_COMPLETED = 'algoflowx_completed';

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

  // ── 2. Progress & Bookmarks State ──
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

  // Save Bookmarks to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(bookmarkedAlgos));
    } catch (e) {
      console.warn('Failed to save bookmarks:', e);
    }
  }, [bookmarkedAlgos]);

  // Save Completed algorithms to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify(completedAlgos));
    } catch (e) {
      console.warn('Failed to save completed algorithms:', e);
    }
  }, [completedAlgos]);

  // ── 3. Google Sign-In & Login Handlers ──
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
    setAuthModalOpen(false);
  }, []);

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
    setAuthModalOpen(false);
  }, []);

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

  // ── 4. Automatic Google One Tap on Mount ──
  useEffect(() => {
    if (!user && typeof window !== 'undefined') {
      // Delay One Tap slightly for smooth page render
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

  // ── 5. Bookmark & Checklist Toggles ──
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

  const isBookmarked = useCallback((slug) => bookmarkedAlgos.includes(slug), [bookmarkedAlgos]);
  const isCompleted = useCallback((slug) => completedAlgos.includes(slug), [completedAlgos]);

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
    bookmarkedAlgos,
    completedAlgos,
    toggleBookmark,
    toggleCompleted,
    isBookmarked,
    isCompleted,
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
