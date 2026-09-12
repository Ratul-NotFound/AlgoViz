// src/utils/database.js — Unified MongoDB Atlas & Local Synchronization Engine

const BASE_USER_OFFSET = 120;
const STORAGE_KEY_LOCAL_COUNT = 'algoflowx_sim_user_count';
const STORAGE_KEY_PROFILES = 'algoflowx_saved_profiles';

/**
 * Upsert user profile, Google authentication details, bookmarks, checklist, and C lessons.
 * Syncs with MongoDB Atlas via serverless API with graceful localStorage offline fallback.
 */
export async function upsertUserProfile(userObj, bookmarkedAlgos = [], completedAlgos = [], cCompletedLessons = []) {
  if (!userObj) return false;

  const userId = userObj.sub || userObj.id || userObj.email;

  const payload = {
    id: String(userId),
    email: userObj.email || null,
    name: userObj.name || null,
    picture: userObj.picture || null,
    provider: userObj.provider || 'google',
    bookmarked_algos: Array.isArray(bookmarkedAlgos) ? bookmarkedAlgos : [],
    completed_algos: Array.isArray(completedAlgos) ? completedAlgos : [],
    c_completed_lessons: Array.isArray(cCompletedLessons) ? cCompletedLessons : [],
    last_login: new Date().toISOString(),
  };

  // Always save locally first for instant, offline-first snappy responsiveness
  try {
    const existing = localStorage.getItem(STORAGE_KEY_PROFILES);
    const parsed = existing ? JSON.parse(existing) : {};
    parsed[userId] = payload;
    localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(parsed));
  } catch (e) {
    console.warn('[Database] Local cache save failed:', e);
  }

  // Sync with MongoDB Cloud
  try {
    const res = await fetch('/api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      // Backend not running / offline mode
      return true;
    }
    return true;
  } catch (err) {
    // Graceful offline fallback
    return true;
  }
}

/**
 * Fetch registered user count from MongoDB Atlas database synced on top of base offset.
 */
export async function fetchTotalUserCount() {
  try {
    const res = await fetch('/api/stats');
    if (res.ok) {
      const data = await res.json();
      if (typeof data.count === 'number') {
        try {
          localStorage.setItem(STORAGE_KEY_LOCAL_COUNT, String(data.count));
        } catch {}
        return data.count;
      }
    }
  } catch (err) {
    // API offline, fallback to local
  }

  // Local fallback: count locally saved profiles + offset
  try {
    const savedProfiles = localStorage.getItem(STORAGE_KEY_PROFILES);
    if (savedProfiles) {
      const count = Object.keys(JSON.parse(savedProfiles)).length;
      return BASE_USER_OFFSET + count;
    }
  } catch {}

  return BASE_USER_OFFSET;
}

/**
 * Fetch user profile from MongoDB Atlas to restore bookmarks and progress across devices.
 */
export async function fetchUserProfile(userId) {
  if (!userId) return null;

  try {
    const res = await fetch(`/api/user?id=${encodeURIComponent(userId)}`);
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    // API offline, fallback to local
  }

  // Fallback to local profile cache
  try {
    const savedProfiles = localStorage.getItem(STORAGE_KEY_PROFILES);
    if (savedProfiles) {
      const parsed = JSON.parse(savedProfiles);
      return parsed[userId] || null;
    }
  } catch {}

  return null;
}
