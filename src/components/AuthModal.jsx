// src/components/AuthModal.jsx — Clean Google Sign-In & Authentication Modal Dialog

import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { GoogleIcon, BookmarkIcon, CheckCircleIcon, AlgoFlowXLogo } from './Icons.jsx';
import { launchGoogleOAuthRedirect, hasCustomGoogleClientId } from '../utils/googleAuth.js';

export default function AuthModal() {
  const { authModalOpen, closeAuthModal } = useAuth();
  const [hasClientId, setHasClientId] = useState(false);

  useEffect(() => {
    setHasClientId(hasCustomGoogleClientId());
  }, []);

  if (!authModalOpen) return null;

  return (
    <div className="auth-modal-backdrop" onClick={closeAuthModal}>
      <div
        className="auth-modal-card animate-scale-up"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        {/* Close Button */}
        <button
          type="button"
          className="auth-modal-close"
          onClick={closeAuthModal}
          aria-label="Close dialog"
        >
          ✕
        </button>

        {/* Brand Header */}
        <div className="auth-modal-header">
          <div className="auth-modal-logo">
            <AlgoFlowXLogo size={36} />
          </div>
          <h2 id="auth-modal-title" className="auth-modal-title">
            Sign In to AlgoFlow<span className="logo-x-accent">X</span>
          </h2>
          <p className="auth-modal-subtitle">
            Synchronize your DSA learning progress, pin bookmarks, and unlock custom benchmarks.
          </p>
        </div>

        {/* Features / Benefits Strip */}
        <div className="auth-benefits-grid">
          <div className="auth-benefit-item">
            <div className="benefit-icon-wrapper">
              <CheckCircleIcon size={16} className="benefit-icon" />
            </div>
            <div className="benefit-text">
              <strong>Progress Checklist</strong>
              <span>Track completed algorithms across 5 tracks</span>
            </div>
          </div>

          <div className="auth-benefit-item">
            <div className="benefit-icon-wrapper">
              <BookmarkIcon size={16} filled className="benefit-icon" />
            </div>
            <div className="benefit-text">
              <strong>Algorithm Bookmarks</strong>
              <span>Quickly jump back to your favorite modules</span>
            </div>
          </div>
        </div>

        {/* Actions Group — 100% Real Google OAuth */}
        <div className="auth-actions-group">
          <button
            type="button"
            className="btn-google-sign-in"
            onClick={() => launchGoogleOAuthRedirect()}
          >
            <GoogleIcon size={18} />
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Modal Footer Note */}
        <div className="auth-modal-footer">
          <span>Sign in with your Google account to sync your profile across devices.</span>
        </div>
      </div>
    </div>
  );
}

