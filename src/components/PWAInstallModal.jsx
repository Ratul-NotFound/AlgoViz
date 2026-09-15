import React, { useEffect } from 'react';
import { usePWA } from '../context/PWAContext.jsx';
import { AlgoFlowXLogo } from './Icons.jsx';

export default function PWAInstallModal() {
  const { isModalOpen, closeInstallModal, isInstallable, isInstalled, isIOS, promptInstall } = usePWA();

  // Close on Escape key
  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeInstallModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, closeInstallModal]);

  if (!isModalOpen) return null;

  return (
    <div className="pwa-modal-backdrop" onClick={closeInstallModal} role="dialog" aria-modal="true">
      <div className="pwa-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          type="button"
          className="pwa-modal-close-btn"
          onClick={closeInstallModal}
          aria-label="Close Install Dialog"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Header Hero */}
        <div className="pwa-modal-hero">
          <div className="pwa-modal-logo-wrapper">
            <AlgoFlowXLogo size={56} />
            <div className="pwa-modal-glow-ring" />
          </div>
          <div className="pwa-modal-title-group">
            <div className="pwa-badge-pill">
              <span className="pwa-pulse-dot" />
              Progressive Web App
            </div>
            <h2 className="pwa-modal-title">Get AlgoFlowX App</h2>
            <p className="pwa-modal-subtitle">
              Install the app on your device for lightning-fast access, native window controls, and 100% offline algorithm stepping.
            </p>
          </div>
        </div>

        {/* Action / Instructions Section */}
        <div className="pwa-modal-body">
          {isInstalled ? (
            <div className="pwa-status-box pwa-status-installed">
              <div className="pwa-status-icon">✓</div>
              <div>
                <strong>App is already installed!</strong>
                <p>You can launch AlgoFlowX directly from your desktop, dock, or home screen.</p>
              </div>
            </div>
          ) : isInstallable ? (
            <div className="pwa-action-box">
              <button
                type="button"
                className="pwa-modal-btn-install"
                onClick={promptInstall}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>Install AlgoFlowX Now</span>
              </button>
              <div className="pwa-action-hint">One-click installation • Zero download size • Native experience</div>
            </div>
          ) : isIOS ? (
            <div className="pwa-ios-instructions">
              <div className="pwa-instruction-title">How to Install on iPhone / iPad:</div>
              <ol className="pwa-steps-list">
                <li>
                  <span className="step-num">1</span>
                  <span>Tap the <strong>Share</strong> button <span className="pwa-inline-icon">📤</span> in the Safari navigation bar.</span>
                </li>
                <li>
                  <span className="step-num">2</span>
                  <span>Scroll down and select <strong>Add to Home Screen</strong> <span className="pwa-inline-icon">➕</span>.</span>
                </li>
                <li>
                  <span className="step-num">3</span>
                  <span>Tap <strong>Add</strong> in the top-right corner to finish.</span>
                </li>
              </ol>
            </div>
          ) : (
            <div className="pwa-browser-instructions">
              <div className="pwa-instruction-title">How to Install on Desktop / Mobile:</div>
              <div className="pwa-steps-grid">
                <div className="pwa-step-card">
                  <div className="step-card-header">
                    <span className="step-tag">Chrome &amp; Edge</span>
                  </div>
                  <p>Click the <strong>Install App</strong> icon (⤓ or ⊕) located in the right side of the address bar.</p>
                </div>
                <div className="pwa-step-card">
                  <div className="step-card-header">
                    <span className="step-tag">Android</span>
                  </div>
                  <p>Tap the three-dots menu (⋮) in Chrome and select <strong>Install app</strong> or <strong>Add to Home screen</strong>.</p>
                </div>
              </div>
            </div>
          )}

          {/* Feature Highlights Grid */}
          <div className="pwa-features-grid">
            <div className="pwa-feature-item">
              <div className="pwa-feature-icon">⚡</div>
              <div className="pwa-feature-text">
                <div className="pwa-feature-head">100% Offline Access</div>
                <div className="pwa-feature-desc">Practice DSA &amp; visualizers with zero internet connection.</div>
              </div>
            </div>
            <div className="pwa-feature-item">
              <div className="pwa-feature-icon">🚀</div>
              <div className="pwa-feature-text">
                <div className="pwa-feature-head">Instant Cold Start</div>
                <div className="pwa-feature-desc">Cached assets launch instantly with zero page-load latency.</div>
              </div>
            </div>
            <div className="pwa-feature-item">
              <div className="pwa-feature-icon">💻</div>
              <div className="pwa-feature-text">
                <div className="pwa-feature-head">Standalone Window</div>
                <div className="pwa-feature-desc">Distraction-free environment without browser URL bar or tabs.</div>
              </div>
            </div>
            <div className="pwa-feature-item">
              <div className="pwa-feature-icon">🔄</div>
              <div className="pwa-feature-text">
                <div className="pwa-feature-head">Auto Background Sync</div>
                <div className="pwa-feature-desc">Seamless updates and progress synchronization.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pwa-modal-footer">
          <button type="button" className="pwa-modal-btn-dismiss" onClick={closeInstallModal}>
            Got it, thanks
          </button>
        </div>
      </div>
    </div>
  );
}
