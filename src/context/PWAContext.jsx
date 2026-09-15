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
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if running in standalone mode (installed PWA)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
    }

    // Detect iOS devices
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isAppleDevice);

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setIsModalOpen(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const openInstallModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeInstallModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const promptInstall = useCallback(async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setIsModalOpen(false);
      }
      setDeferredPrompt(null);
    } else {
      // If native deferred prompt is not directly ready, open the install guide modal
      setIsModalOpen(true);
    }
  }, [deferredPrompt]);

  return (
    <PWAContext.Provider
      value={{
        isInstallable: !!deferredPrompt,
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
