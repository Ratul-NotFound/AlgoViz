// src/utils/googleAuth.js — Google Identity Services (GIS) & JWT Credential Engine

const GIS_SCRIPT_ID = 'google-identity-services-script';
const GIS_SCRIPT_URL = 'https://accounts.google.com/gsi/client';

let isGsiInitialized = false;
let gsiCallbackRegistry = new Set();

/**
 * Dynamically loads the Google Identity Services SDK script if not already present.
 */
export function loadGoogleIdentityScript() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      return resolve(null);
    }
    if (window.google?.accounts?.id) {
      return resolve(window.google.accounts.id);
    }

    const existingScript = document.getElementById(GIS_SCRIPT_ID);
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        resolve(window.google?.accounts?.id || null);
      });
      existingScript.addEventListener('error', () => {
        // Blocked by ad-blocker or client extension
        resolve(null);
      });
      return;
    }

    try {
      const script = document.createElement('script');
      script.id = GIS_SCRIPT_ID;
      script.src = GIS_SCRIPT_URL;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        resolve(window.google?.accounts?.id || null);
      };
      script.onerror = (err) => {
        // Silently handled: adblocker / privacy extension blocked GSI script
        resolve(null);
      };
      document.head.appendChild(script);
    } catch {
      resolve(null);
    }
  });
}

/**
 * Decodes a Google JWT Credential string without external libraries.
 * Google Identity Services returns a signed JWT containing payload with user info.
 */
export function parseJwtCredential(token) {
  try {
    if (!token || typeof token !== 'string') return null;
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const parsed = JSON.parse(jsonPayload);
    return {
      sub: parsed.sub || String(Date.now()),
      email: parsed.email || '',
      email_verified: Boolean(parsed.email_verified),
      name: parsed.name || parsed.email?.split('@')[0] || 'AlgoFlow User',
      given_name: parsed.given_name || '',
      family_name: parsed.family_name || '',
      picture: parsed.picture || '',
      provider: 'google',
    };
  } catch (err) {
    console.warn('[GoogleAuth] Failed to parse JWT credential:', err);
    return null;
  }
}

const DEFAULT_GOOGLE_CLIENT_ID = '951225872440-o7k8vd736m03bgi13q5v679l79p821f1.apps.googleusercontent.com';

/**
 * Checks if a custom Google Client ID is configured in .env or default fallback.
 */
export function hasCustomGoogleClientId() {
  return Boolean(getGoogleClientId());
}

/**
 * Get Google Client ID from environment variables or default fallback.
 */
export function getGoogleClientId() {
  const envId = import.meta.env?.VITE_GOOGLE_CLIENT_ID;
  if (envId && envId.trim() && envId !== 'your-google-client-id.apps.googleusercontent.com') {
    return envId.trim();
  }
  return DEFAULT_GOOGLE_CLIENT_ID;
}

/**
 * Global single-point dispatcher for Google OAuth responses to avoid multiple initialize() warnings.
 */
function ensureGsiInitialized(googleId, clientId) {
  if (isGsiInitialized) return;

  try {
    googleId.initialize({
      client_id: clientId,
      callback: (response) => {
        if (response && response.credential) {
          const user = parseJwtCredential(response.credential);
          if (user) {
            gsiCallbackRegistry.forEach((cb) => {
              try { cb(user, response.credential); } catch {}
            });
          }
        }
      },
      auto_select: false,
      cancel_on_tap_outside: false,
      use_fedcm_for_prompt: true,
    });
    isGsiInitialized = true;
  } catch (err) {
    console.warn('[GoogleAuth] GSI initialize suppressed:', err);
  }
}

/**
 * Initialize Google One Tap & Google Accounts API.
 */
export async function initGoogleOneTap({ onCredentialResponse }) {
  try {
    const clientId = getGoogleClientId();
    if (!clientId) return false;

    const googleId = await loadGoogleIdentityScript();
    if (!googleId) return false;

    if (onCredentialResponse) {
      gsiCallbackRegistry.add(onCredentialResponse);
    }

    ensureGsiInitialized(googleId, clientId);

    // Prompt Google One Tap popup gracefully
    googleId.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // One tap skipped or blocked by browser/client
      }
    });

    return true;
  } catch {
    // Graceful fallback if One Tap is blocked or FedCM is suppressed
    return false;
  }
}

/**
 * Render official Google Sign-In Button inside a specified container element.
 */
export async function renderGoogleButton(containerElement, { onSuccess, theme = 'outline', size = 'large' }) {
  try {
    if (!containerElement) return false;
    const googleId = await loadGoogleIdentityScript();
    if (!googleId) return false;

    const clientId = getGoogleClientId();
    if (!clientId) return false;

    if (onSuccess) {
      gsiCallbackRegistry.add(onSuccess);
    }

    ensureGsiInitialized(googleId, clientId);

    googleId.renderButton(containerElement, {
      type: 'standard',
      shape: 'pill',
      theme: theme === 'dark' ? 'filled_black' : 'outline',
      text: 'signin_with',
      size: size,
      logo_alignment: 'left',
      width: 250,
    });

    return true;
  } catch {
    return false;
  }
}

