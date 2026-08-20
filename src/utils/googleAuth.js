// src/utils/googleAuth.js — Google Identity Services (GIS) & JWT Credential Engine

const GIS_SCRIPT_ID = 'google-identity-services-script';
const GIS_SCRIPT_URL = 'https://accounts.google.com/gsi/client';

/**
 * Dynamically loads the Google Identity Services SDK script if not already present.
 */
export function loadGoogleIdentityScript() {
  return new Promise((resolve, reject) => {
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
      existingScript.addEventListener('error', (err) => {
        reject(err);
      });
      return;
    }

    const script = document.createElement('script');
    script.id = GIS_SCRIPT_ID;
    script.src = GIS_SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      resolve(window.google?.accounts?.id || null);
    };
    script.onerror = (err) => {
      console.warn('[GoogleAuth] Failed to load Google Identity Services script:', err);
      reject(err);
    };
    document.head.appendChild(script);
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
    console.error('[GoogleAuth] Failed to parse JWT credential:', err);
    return null;
  }
}

/**
 * Checks if a real custom Google Client ID is configured in .env.
 */
export function hasCustomGoogleClientId() {
  const envId = import.meta.env?.VITE_GOOGLE_CLIENT_ID;
  return Boolean(envId && envId.trim() && envId !== 'your-google-client-id.apps.googleusercontent.com');
}

/**
 * Get Google Client ID from environment variables.
 */
export function getGoogleClientId() {
  const envId = import.meta.env?.VITE_GOOGLE_CLIENT_ID;
  if (hasCustomGoogleClientId()) {
    return envId.trim();
  }
  return null;
}

/**
 * Initialize Google One Tap & Google Accounts API.
 */
export async function initGoogleOneTap({ onCredentialResponse, promptParentId = null }) {
  try {
    const clientId = getGoogleClientId();
    if (!clientId) {
      // No real Google Client ID provided in .env, skip triggering Google's 401 prompt
      return false;
    }

    const googleId = await loadGoogleIdentityScript();
    if (!googleId) return false;

    const config = {
      client_id: clientId,
      callback: (response) => {
        if (response && response.credential) {
          const user = parseJwtCredential(response.credential);
          if (user && onCredentialResponse) {
            onCredentialResponse(user, response.credential);
          }
        }
      },
      auto_select: false,
      cancel_on_tap_outside: false,
    };

    if (promptParentId && document.getElementById(promptParentId)) {
      config.prompt_parent_id = promptParentId;
    }

    googleId.initialize(config);

    // Prompt Google One Tap popup
    googleId.prompt((notification) => {
      if (notification.isNotDisplayed()) {
        // One tap not displayed (e.g. opt-out or suppressed by browser)
      } else if (notification.isSkippedMoment()) {
        // One tap skipped
      } else if (notification.isDismissedMoment()) {
        // One tap dismissed
      }
    });

    return true;
  } catch (e) {
    console.warn('[GoogleAuth] One Tap initialization error:', e);
    return false;
  }
}

/**
 * Render official Google Sign-In Button inside a specified container element.
 */
export async function renderGoogleButton(containerElement, { onSuccess, theme = 'outline', size = 'large' }) {
  try {
    const googleId = await loadGoogleIdentityScript();
    if (!googleId || !containerElement) return false;

    const clientId = getGoogleClientId();
    googleId.initialize({
      client_id: clientId,
      callback: (response) => {
        if (response && response.credential) {
          const user = parseJwtCredential(response.credential);
          if (user && onSuccess) {
            onSuccess(user, response.credential);
          }
        }
      },
    });

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
  } catch (e) {
    console.warn('[GoogleAuth] Failed to render Google button:', e);
    return false;
  }
}
