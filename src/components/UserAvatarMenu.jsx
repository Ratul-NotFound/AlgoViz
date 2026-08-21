// src/components/UserAvatarMenu.jsx — Header User Profile Avatar, Rank Badges & Learning Progress Dropdown

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { GoogleIcon, BookmarkIcon, CheckCircleIcon, LogOutIcon, UserIcon, CIcon } from './Icons.jsx';
import { ALGORITHMS } from '../data/algorithms.js';
import { C_LESSONS } from '../data/cLessons.js';
import CourseCertificateModal from './CourseCertificateModal.jsx';

export default function UserAvatarMenu({ onSelectAlgo, onOpenLearnC }) {
  const {
    user,
    signOut,
    updateUserName,
    resetAllProgress,
    userRank,
    userCoins,
    bookmarkedAlgos,
    completedAlgos,
    cCompletedLessons,
    totalCScoredMarks,
    totalCQuizMarksPossible,
    cOverallGradePct,
    isCCourseFullyCompleted,
  } = useAuth();

  const [open, setOpen] = useState(false);
  const [certOpen, setCertOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
        setIsEditingName(false);
        setConfirmReset(false);
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

  const totalCChapters = C_LESSONS.length; // 23 chapters
  const cDoneCount = (cCompletedLessons || []).length;
  const cProgressPct = Math.round((cDoneCount / totalCChapters) * 100);

  const initial = (user.name || user.email || 'U').charAt(0).toUpperCase();

  const handleSaveName = () => {
    if (nameInput.trim()) {
      updateUserName(nameInput.trim());
    }
    setIsEditingName(false);
  };

  return (
    <div className="user-avatar-container" ref={menuRef}>
      {/* ── Avatar Pill Button (Header) ── */}
      <button
        type="button"
        className={`user-avatar-pill ${open ? 'pill-active' : ''}`}
        onClick={() => {
          setOpen((prev) => !prev);
          setNameInput(user.name || '');
          setConfirmReset(false);
        }}
        title={`${user.name} • ${userRank.title}`}
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
        <span className="user-avatar-badge" style={{ color: userRank.color }}>
          {userRank.icon} {cDoneCount}/{totalCChapters}
        </span>
      </button>

      {/* ── Dropdown Card ── */}
      {open && (
        <div className="user-dropdown-card animate-fade-in">
          {/* Header User Identity Card */}
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
                {isEditingName ? (
                  <div className="inline-name-edit-box">
                    <input
                      type="text"
                      className="inline-name-input"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                      autoFocus
                      maxLength={40}
                    />
                    <button type="button" className="btn-save-name" onClick={handleSaveName}>✓</button>
                    <button type="button" className="btn-cancel-name" onClick={() => setIsEditingName(false)}>✕</button>
                  </div>
                ) : (
                  <div className="user-name-edit-row">
                    <span className="user-dropdown-fullname">{user.name}</span>
                    <button
                      type="button"
                      className="btn-edit-pencil"
                      title="Edit certificate name"
                      onClick={() => {
                        setNameInput(user.name || '');
                        setIsEditingName(true);
                      }}
                    >
                      ✏️
                    </button>
                  </div>
                )}
                <div className="user-dropdown-email">{user.email}</div>
              </div>
            </div>

            {/* Rank & Verification Pills */}
            <div className="user-dropdown-pills-row">
              <div className="user-rank-pill" style={{ borderColor: `${userRank.color}40`, background: `${userRank.color}15` }}>
                <span>{userRank.icon}</span>
                <span style={{ color: userRank.color, fontWeight: 700 }}>{userRank.title}</span>
              </div>
              <div className="user-coin-wallet-pill font-mono" title="Coins earned via chapter completion and perfect quiz scores">
                <span>🪙 {userCoins} Coins</span>
              </div>
            </div>
          </div>

          {/* C Master Academy Track (23 Chapters & Marks) */}
          <div className="user-dropdown-section">
            <div className="dropdown-section-title">
              <span className="flex-center-gap">
                <CIcon size={14} />
                <span>C Master Academy Track</span>
              </span>
              <span className="progress-fraction font-mono">
                {cDoneCount} / {totalCChapters} ({cProgressPct}%)
              </span>
            </div>
            <div className="dropdown-progress-track">
              <div
                className="dropdown-progress-fill"
                style={{
                  width: `${cProgressPct}%`,
                  background: 'linear-gradient(90deg, #3b82f6, #10b981)',
                }}
              />
            </div>

            {/* Total Marks & Grade Scorecard */}
            <div className="user-academy-marks-row font-mono">
              <span>Exam Marks: <strong>{totalCScoredMarks} / {totalCQuizMarksPossible || 230}</strong></span>
              <span>Grade: <strong>{cOverallGradePct}%</strong></span>
            </div>

            {isCCourseFullyCompleted ? (
              <button
                type="button"
                className="btn-cert-launch-gold"
                onClick={() => {
                  setCertOpen(true);
                  setOpen(false);
                }}
              >
                🎓 View Official Gold Certificate
              </button>
            ) : (
              <button
                type="button"
                className="btn-resume-academy"
                onClick={() => {
                  if (onOpenLearnC) onOpenLearnC();
                  setOpen(false);
                }}
              >
                📖 Jump to Next Chapter
              </button>
            )}
          </div>

          {/* DSA Studio Mastery Progress */}
          <div className="user-dropdown-section">
            <div className="dropdown-section-title">
              <span>⚡ DSA Studio Mastery</span>
              <span className="progress-fraction">{completedCount} / {totalAlgos} ({progressPct}%)</span>
            </div>
            <div className="dropdown-progress-track">
              <div className="dropdown-progress-fill" style={{ width: `${progressPct}%` }} />
            </div>
          </div>

          {/* Saved Bookmarks */}
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
                {bookmarkedAlgos.slice(0, 4).map((slug) => {
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

          {/* Account Options & Reset Data Footer */}
          <div className="user-dropdown-footer">
            {confirmReset ? (
              <div className="reset-confirm-box">
                <span className="reset-warning-text">Reset all progress, quiz scores & coins?</span>
                <div className="reset-btn-row">
                  <button
                    type="button"
                    className="btn-confirm-yes"
                    onClick={() => {
                      resetAllProgress();
                      setConfirmReset(false);
                    }}
                  >
                    Yes, Reset
                  </button>
                  <button
                    type="button"
                    className="btn-confirm-no"
                    onClick={() => setConfirmReset(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="footer-actions-split">
                <button
                  type="button"
                  className="dropdown-action-btn-subtle"
                  onClick={() => setConfirmReset(true)}
                  title="Reset completed chapters, bookmarks, and quiz scores"
                >
                  🔄 Reset Data
                </button>
                <button
                  type="button"
                  className="dropdown-logout-btn"
                  onClick={() => {
                    signOut();
                    setOpen(false);
                  }}
                >
                  <LogOutIcon size={13} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Certificate Modal ── */}
      <CourseCertificateModal
        isOpen={certOpen}
        onClose={() => setCertOpen(false)}
      />
    </div>
  );
}
