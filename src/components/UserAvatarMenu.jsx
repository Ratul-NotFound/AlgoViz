// src/components/UserAvatarMenu.jsx — Header User Profile Avatar & Learning Progress Dropdown

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { GoogleIcon, BookmarkIcon, CheckCircleIcon, LogOutIcon, UserIcon } from './Icons.jsx';
import { ALGORITHMS } from '../data/algorithms.js';

export default function UserAvatarMenu({ onSelectAlgo }) {
  const { user, signOut, bookmarkedAlgos, completedAlgos } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  if (!user) return null;

  const totalAlgos = ALGORITHMS.length;
  const completedCount = completedAlgos.length;
  const progressPct = Math.round((completedCount / totalAlgos) * 100);

  const initial = (user.name || user.email || 'U').charAt(0).toUpperCase();

  return (
    <div className="user-avatar-container" ref={menuRef}>
      {/* ── Avatar Pill Button ── */}
      <button
        type="button"
        className={`user-avatar-pill ${open ? 'pill-active' : ''}`}
        onClick={() => setOpen((prev) => !prev)}
        title={`${user.name} (${user.email})`}
        aria-label="User profile and progress menu"
        aria-expanded={open}
      >
        {user.picture ? (
          <img
            src={user.picture}
            alt={user.name}
            className="user-avatar-img"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="user-avatar-fallback">{initial}</div>
        )}
        <span className="user-avatar-name">{user.given_name || user.name.split(' ')[0]}</span>
        <span className="user-avatar-badge">{completedCount}/{totalAlgos}</span>
      </button>

      {/* ── Dropdown Menu ── */}
      {open && (
        <div className="user-dropdown-card animate-fade-in">
          {/* Header Info */}
          <div className="user-dropdown-header">
            <div className="user-dropdown-profile">
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="dropdown-avatar-large"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="dropdown-avatar-fallback-large">{initial}</div>
              )}
              <div className="user-dropdown-details">
                <div className="user-dropdown-fullname">{user.name}</div>
                <div className="user-dropdown-email">{user.email}</div>
              </div>
            </div>
            <div className="user-verified-badge">
              <GoogleIcon size={13} />
              <span>{user.provider === 'google' ? 'Google Verified' : 'Demo Account'}</span>
            </div>
          </div>

          {/* DSA Mastery Progress Bar */}
          <div className="user-dropdown-section">
            <div className="dropdown-section-title">
              <span>DSA Mastery Progress</span>
              <span className="progress-fraction">{completedCount} / {totalAlgos} ({progressPct}%)</span>
            </div>
            <div className="dropdown-progress-track">
              <div className="dropdown-progress-fill" style={{ width: `${progressPct}%` }} />
            </div>
          </div>

          {/* Bookmarked Algorithms */}
          <div className="user-dropdown-section">
            <div className="dropdown-section-title">
              <span className="flex-center-gap">
                <BookmarkIcon size={12} filled />
                <span>Saved Bookmarks ({bookmarkedAlgos.length})</span>
              </span>
            </div>
            {bookmarkedAlgos.length === 0 ? (
              <div className="dropdown-empty-text">No bookmarks yet. Star algorithms in the catalog to pin them here!</div>
            ) : (
              <div className="dropdown-bookmarks-list">
                {bookmarkedAlgos.slice(0, 5).map((slug) => {
                  const algo = ALGORITHMS.find((a) => a.slug === slug);
                  if (!algo) return null;
                  return (
                    <button
                      key={slug}
                      type="button"
                      className="dropdown-bookmark-item"
                      onClick={() => {
                        if (onSelectAlgo) onSelectAlgo(slug);
                        setOpen(false);
                      }}
                    >
                      <span className="bookmark-algo-name">{algo.name}</span>
                      <span className="bookmark-algo-comp">{algo.timeComplexity?.average || 'O(n)'}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sign Out Button */}
          <div className="user-dropdown-footer">
            <button
              type="button"
              className="dropdown-logout-btn"
              onClick={() => {
                signOut();
                setOpen(false);
              }}
            >
              <LogOutIcon size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
