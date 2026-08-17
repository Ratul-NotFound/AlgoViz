// src/utils/sound.js — Web Audio API algorithm sonification synthesizer

let audioCtx = null;
let isSoundMuted = true; // Muted by default for clean user experience

function getAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function toggleSound() {
  isSoundMuted = !isSoundMuted;
  if (!isSoundMuted) {
    getAudioContext();
  }
  return !isSoundMuted;
}

export function isAudioEnabled() {
  return !isSoundMuted;
}

export function playNote(value, maxVal = 100, type = 'sine', duration = 0.05) {
  if (isSoundMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Map value 0..maxVal to frequency range 220Hz (A3) .. 1200Hz (D6)
    const normalized = Math.max(0, Math.min(1, value / (maxVal || 100)));
    const freq = 220 + normalized * 980;

    osc.type = type; // 'sine' | 'triangle' | 'square'
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Ignore audio errors gracefully
  }
}

export function playSwapChime() {
  if (isSoundMuted) return;
  playNote(70, 100, 'triangle', 0.08);
}

export function playCompleteFanfare() {
  if (isSoundMuted) return;
  const notes = [30, 50, 70, 95];
  notes.forEach((n, idx) => {
    setTimeout(() => playNote(n, 100, 'sine', 0.12), idx * 70);
  });
}
