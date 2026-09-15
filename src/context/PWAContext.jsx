import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const PWAContext = createContext({
  isInstallable: false,
  isInstalled: false,
  isIOS: false,
  isModalOpen: false,
  openInstallModal: () => {},
  closeInstallModal: () => {},
  promptInstall: async () => {},
});

export function PWAProvider({ children }) {
  const [deferredPrompt, setDeferredPrompt] = useState(() => {
    if (typeof window !== 'undefined' && window.deferredPWAInstallPrompt) {
      return window.deferredPWAInstallPrompt;
    }
    return null;
  });
  const [isInstalled, setIsInstalled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true;

      if (isStandalone) {
        setIsInstalled(true);
      }

      const userAgent = window.navigator.userAgent.toLowerCase();
      const isApple = /iphone|ipad|ipod/.test(userAgent);
      setIsIOS(isApple);

      if (window.deferredPWAInstallPrompt) {
        setDeferredPrompt(window.deferredPWAInstallPrompt);
      }
    }

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      window.deferredPWAInstallPrompt = e;
      setDeferredPrompt(e);
    };

    const handleCustomPromptReady = (e) => {
      if (e.detail) {
        setDeferredPrompt(e.detail);
      } else if (window.deferredPWAInstallPrompt) {
        setDeferredPrompt(window.deferredPWAInstallPrompt);
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      window.deferredPWAInstallPrompt = null;
      setIsModalOpen(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('pwa-prompt-available', handleCustomPromptReady);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('pwa-installed-success', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('pwa-prompt-available', handleCustomPromptReady);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('pwa-installed-success', handleAppInstalled);
    };
  }, []);

  const openInstallModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeInstallModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const promptInstall = useCallback(async () => {
    const promptEvent = deferredPrompt || (typeof window !== 'undefined' ? window.deferredPWAInstallPrompt : null);
    
    if (promptEvent) {
      try {
        await promptEvent.prompt();
        const choiceResult = await promptEvent.userChoice;
        if (choiceResult && choiceResult.outcome === 'accepted') {
          setIsInstalled(true);
          setIsModalOpen(false);
        }
        setDeferredPrompt(null);
        if (typeof window !== 'undefined') {
          window.deferredPWAInstallPrompt = null;
        }
      } catch (err) {
        console.warn('PWA install prompt error:', err);
        setIsModalOpen(true);
      }
    } else {
      // If browser hasn't emitted beforeinstallprompt yet (or user already interacted), open popup
      setIsModalOpen(true);
    }
  }, [deferredPrompt]);

  return (
    <PWAContext.Provider
      value={{
        isInstallable: !!deferredPrompt || (typeof window !== 'undefined' && !!window.deferredPWAInstallPrompt),
        isInstalled,
        isIOS,
        isModalOpen,
        openInstallModal,
        closeInstallModal,
        promptInstall,
      }}
    >
      {children}
    </PWAContext.Provider>
  );
}

export function usePWA() {
  return useContext(PWAContext);
}
