// src/utils/supabase.js — Supabase Client & User Data Synchronization Engine

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const BASELINE_USER_COUNT = 1480;
const STORAGE_KEY_LOCAL_COUNT = 'algoflowx_sim_user_count';

// Initialize Supabase client if valid credentials exist
let supabaseInstance = null;

export function isSupabaseConfigured() {
  return Boolean(
    SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    SUPABASE_URL.startsWith('https://') &&
    SUPABASE_ANON_KEY.length > 20
  );
}

export function getSupabase() {
  if (!supabaseInstance && isSupabaseConfigured()) {
    try {
      supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: false,
        },
      });
    } catch (e) {
      console.warn('[Supabase] Failed to initialize Supabase client:', e);
      supabaseInstance = null;
    }
  }
  return supabaseInstance;
}

/**
 * Upsert user profile, Google authentication details, bookmarks, checklist, and C lessons to Supabase.
 */
export async function upsertUserProfile(userObj, bookmarkedAlgos = [], completedAlgos = [], cCompletedLessons = []) {
  if (!userObj) return false;

  const supabase = getSupabase();
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

  if (!supabase) {
    // Graceful offline mock sync
    try {
      const existing = localStorage.getItem('algoflowx_saved_profiles');
      const parsed = existing ? JSON.parse(existing) : {};
      parsed[userId] = payload;
      localStorage.setItem('algoflowx_saved_profiles', JSON.stringify(parsed));
    } catch (e) {
      console.warn('[Supabase Mock] Local save failed:', e);
    }
    return true;
  }

  try {
    const { error } = await supabase.from('users').upsert(payload, {
      onConflict: 'id',
    });

    if (error) {
      console.warn('[Supabase] Upsert user profile error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase] Network error during upsert:', err);
    return false;
  }
}

const BASE_USER_OFFSET = 120;

/**
 * Fetch registered user count from Supabase database synced on top of base offset (120).
 */
export async function fetchTotalUserCount() {
  const supabase = getSupabase();

  if (supabase) {
    try {
      const { count, error } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      if (!error && typeof count === 'number') {
        const total = BASE_USER_OFFSET + count;
        try {
          localStorage.setItem(STORAGE_KEY_LOCAL_COUNT, String(total));
        } catch {}
        return total;
      }
    } catch (err) {
      console.warn('[Supabase] Failed to fetch live count:', err);
    }
  }

  // If Supabase is not yet connected, count users stored locally + base offset
  try {
    const savedProfiles = localStorage.getItem('algoflowx_saved_profiles');
    if (savedProfiles) {
      const count = Object.keys(JSON.parse(savedProfiles)).length;
      return BASE_USER_OFFSET + count;
    }
  } catch {}

  return BASE_USER_OFFSET;
}

/**
 * Fetch user profile from Supabase to restore bookmarks across devices.
 */
export async function fetchUserProfile(userId) {
  if (!userId) return null;
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', String(userId))
      .single();

    if (error) return null;
    return data;
  } catch {
    return null;
  }
}
