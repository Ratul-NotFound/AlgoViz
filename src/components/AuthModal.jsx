// src/components/AuthModal.jsx — Clean Google Sign-In & Authentication Modal Dialog

import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { GoogleIcon, BookmarkIcon, CheckCircleIcon, AlgoFlowXLogo } from './Icons.jsx';
import { renderGoogleButton, hasCustomGoogleClientId } from '../utils/googleAuth.js';

export default function AuthModal() {
  const { authModalOpen, closeAuthModal, handleGoogleSuccess, signInWithDemo } = useAuth();
  const googleBtnContainerRef = useRef(null);
  const [hasClientId, setHasClientId] = useState(false);

  useEffect(() => {
    const isConfigured = hasCustomGoogleClientId();
    setHasClientId(isConfigured);

    if (authModalOpen && isConfigured && googleBtnContainerRef.current) {
      renderGoogleButton(googleBtnContainerRef.current, {
        onSuccess: (userProfile, credential) => {
          handleGoogleSuccess(userProfile, credential);
        },
        size: 'large',
      });
    }
  }, [authModalOpen, handleGoogleSuccess]);

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

        {/* Actions Group */}
        <div className="auth-actions-group">
          {/* Official Google GSI Button Container */}
          <div className="google-btn-wrapper" ref={googleBtnContainerRef}>
            <button
              type="button"
              className="btn-google-sign-in"
              onClick={() => signInWithDemo('Mahmud Hasan Ratul', 'mhratul.dev@gmail.com')}
            >
              <GoogleIcon size={18} />
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="auth-divider-strip">
            <span className="auth-divider-line" />
            <span className="auth-divider-text">OR DIRECT ACCESS</span>
            <span className="auth-divider-line" />
          </div>

          <button
            type="button"
            className="btn-direct-profile-sync"
            onClick={() => signInWithDemo('Mahmud Hasan Ratul', 'mhratul.dev@gmail.com')}
            title="Instant sign-in if your browser adblocker suppresses Google popups"
          >
            <span className="direct-sync-avatar">⚡</span>
            <div className="direct-sync-text">
              <strong>Instant Profile Access</strong>
              <span>Bypass browser adblocker &amp; sync progress</span>
            </div>
          </button>
        </div>

        {/* Modal Footer Note */}
        <div className="auth-modal-footer">
          <span>We respect your privacy. Profile data is stored locally for session sync.</span>
        </div>
      </div>
    </div>
  );
}
