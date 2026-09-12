// src/utils/supabase.js — Backwards Compatibility Bridge for Database Synchronization
// Migrated to MongoDB Atlas (M0 Free Tier) & Local Storage Engine

export {
  upsertUserProfile,
  fetchTotalUserCount,
  fetchUserProfile,
} from './database.js';

export function isSupabaseConfigured() {
  return false;
}

export function getSupabase() {
  return null;
}

