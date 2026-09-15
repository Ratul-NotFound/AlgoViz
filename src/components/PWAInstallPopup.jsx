import React, { useState, useEffect, useCallback } from 'react';
import { usePWA } from '../context/PWAContext.jsx';
import { AlgoFlowXLogo } from './Icons.jsx';

export default function PWAInstallPopup() {
  const { isInstalled, promptInstall } = usePWA();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('algoviz_pwa_popup_dismissed');
      return stored === 'true';
    }
    return false;
  });

  useEffect(() => {
    // If already installed or dismissed this session, do nothing
    if (isInstalled || dismissed) {
      setVisible(false);
      return;
    }

    // Auto show popup after a brief delay for a clean entrance
    const timer = setTimeout(() => {
      setVisible(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, [isInstalled, dismissed]);

  const handleInstallClick = useCallback(async () => {
    await promptInstall();
  }, [promptInstall]);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    setDismissed(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('algoviz_pwa_popup_dismissed', 'true');
    }
  }, []);

  // Do nothing if app is already installed, dismissed, or not visible yet
  if (isInstalled || dismissed || !visible) {
    return null;
  }

  return (
    <div className="pwa-auto-popup-overlay" role="dialog" aria-modal="true" aria-label="Install App">
      <div className="pwa-auto-popup-card">
        {/* Close Button */}
        <button
          type="button"
          className="pwa-popup-close-btn"
          onClick={handleDismiss}
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Top App Identity */}
        <div className="pwa-popup-header">
          <div className="pwa-popup-logo-wrap">
            <AlgoFlowXLogo size={44} />
            <div className="pwa-popup-glow" />
          </div>
          <div className="pwa-popup-meta">
            <div className="pwa-popup-badge">App Available</div>
            <h3 className="pwa-popup-title">Install AlgoFlowX App</h3>
            <p className="pwa-popup-subtitle">
              Install directly to your device for instant offline access &amp; native desktop window.
            </p>
          </div>
        </div>

        {/* Action Button - 1 click triggers native install */}
        <div className="pwa-popup-actions">
          <button
            type="button"
            className="pwa-popup-btn-install"
            onClick={handleInstallClick}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Install App</span>
          </button>
          <button
            type="button"
            className="pwa-popup-btn-later"
            onClick={handleDismiss}
          >
            Not Now
          </button>
        </div>
      </div>
    </div>
  );
}
