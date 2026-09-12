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

/**
 * Launch Standard Google OAuth 2.0 Top-Level Redirect Flow.
 * Bypasses all browser popup blockers and ad-blockers completely.
 */
export function launchGoogleOAuthRedirect() {
  if (typeof window === 'undefined') return;

  const clientId = getGoogleClientId();
  if (!clientId) {
    console.warn('[GoogleAuth] No Google Client ID configured.');
    return;
  }

  const origin = window.location.origin;
  const currentHash = window.location.hash || '#/';
  const state = encodeURIComponent(currentHash);
  const nonce = String(Date.now());

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${encodeURIComponent(clientId)}&` +
    `redirect_uri=${encodeURIComponent(origin)}&` +
    `response_type=token%20id_token&` +
    `scope=${encodeURIComponent('openid email profile')}&` +
    `nonce=${nonce}&` +
    `state=${state}&` +
    `prompt=select_account`;

  window.location.href = authUrl;
}

/**
 * Check if the current URL contains OAuth tokens after a redirect return.
 */
export function checkOAuthRedirectCallback() {
  if (typeof window === 'undefined') return null;

  try {
    const rawHash = window.location.hash || '';
    const rawSearch = window.location.search || '';

    let params = null;
    if (rawHash.includes('id_token=') || rawHash.includes('access_token=')) {
      params = new URLSearchParams(rawHash.replace(/^#\/?/, ''));
    } else if (rawSearch.includes('id_token=') || rawSearch.includes('credential=')) {
      params = new URLSearchParams(rawSearch.replace(/^\?/, ''));
    }

    if (!params) return null;

    const idToken = params.get('id_token') || params.get('credential');
    if (idToken) {
      const user = parseJwtCredential(idToken);
      if (user) {
        const returnState = params.get('state');
        const targetHash = returnState ? decodeURIComponent(returnState) : '#/';
        
        // Clean URL without tokens
        try {
          window.history.replaceState(null, '', window.location.pathname + targetHash);
        } catch {}

        return { user, credential: idToken };
      }
    }
  } catch (err) {
    console.warn('[GoogleAuth] Error parsing OAuth redirect callback:', err);
  }

  return null;
}

/**
 * Trigger authentic Google Account selection prompt on click.
 */
export async function triggerGooglePrompt({ onSuccess } = {}) {
  // First try Google Identity Services prompt
  try {
    const googleId = await loadGoogleIdentityScript();
    if (googleId) {
      const clientId = getGoogleClientId();
      if (onSuccess) {
        gsiCallbackRegistry.add(onSuccess);
      }
      ensureGsiInitialized(googleId, clientId);
      googleId.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // If popup is suppressed by browser, automatically fall back to standard redirect
          launchGoogleOAuthRedirect();
        }
      });
      return true;
    }
  } catch {}

  // Fallback to top-level redirect flow
  launchGoogleOAuthRedirect();
  return true;
}

