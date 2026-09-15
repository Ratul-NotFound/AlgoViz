import React, { useState, useCallback } from 'react';
import { usePWA } from '../context/PWAContext.jsx';
import { AlgoFlowXLogo } from './Icons.jsx';

export default function PWAInstallBanner() {
  const { isInstalled, promptInstall } = usePWA();
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('algoviz-pwa-dismissed');
      if (stored) {
        const time = parseInt(stored, 10);
        return Date.now() - time < 3 * 24 * 60 * 60 * 1000;
      }
    }
    return false;
  });

  const handleDismiss = useCallback(() => {
    setDismissed(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('algoviz-pwa-dismissed', Date.now().toString());
    }
  }, []);

  // If already installed or dismissed, do not show floating banner
  if (isInstalled || dismissed) {
    return null;
  }

  return (
    <div className="pwa-install-banner" role="banner" aria-label="Install AlgoFlowX App">
      <div className="pwa-banner-content">
        <div className="pwa-banner-icon-wrap">
          <AlgoFlowXLogo size={34} />
          <div className="pwa-badge-offline">Offline Ready</div>
        </div>
        <div className="pwa-banner-text">
          <div className="pwa-banner-title">Install AlgoFlowX App</div>
          <p className="pwa-banner-desc">
            Practice DSA algorithms with instant loading &amp; 100% offline access.
          </p>
        </div>
      </div>
      <div className="pwa-banner-actions">
        <button
          type="button"
          className="pwa-btn-install"
          onClick={promptInstall}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>Get App</span>
        </button>
        <button
          type="button"
          className="pwa-btn-dismiss"
          onClick={handleDismiss}
          aria-label="Dismiss install banner"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
