// src/utils/sound.js — High-fidelity Web Audio API algorithm sonification engine

let audioCtx = null;
let isSoundMuted = true; // Muted by default for polite user experience

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
    const ctx = getAudioContext();
    if (ctx) {
      // Play brief polite activation chime
      playActionSound('enable');
    }
  }
  return !isSoundMuted;
}

export function isAudioEnabled() {
  return !isSoundMuted;
}

/**
 * Plays a smooth synth note mapped to element value.
 * Uses smooth gain envelope to eliminate audio clicks/pops.
 */
export function playNote(value, maxVal = 100, waveType = 'sine', duration = 0.06, volume = 0.08) {
  if (isSoundMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Map value linearly to musical frequency 220Hz (A3) .. 1320Hz (E6)
    const normalized = Math.max(0, Math.min(1, (Number(value) || 30) / (Number(maxVal) || 100)));
    const freq = 220 + normalized * 1100;

    osc.type = waveType; // 'sine' | 'triangle' | 'square' | 'sawtooth'
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    const startTime = ctx.currentTime;
    const stopTime = startTime + duration;

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, stopTime);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(stopTime);
  } catch (e) {
    // Ignore audio context errors gracefully
  }
}

/**
 * Specialized Comparison Tone
 */
export function playComparisonSound(val, maxVal = 100) {
  if (isSoundMuted) return;
  playNote(val, maxVal, 'sine', 0.045, 0.06);
}

/**
 * Specialized Dual-Tone Swap Sound
 */
export function playSwapSound(valA, valB, maxVal = 100) {
  if (isSoundMuted) return;
  playNote(valA, maxVal, 'triangle', 0.06, 0.08);
  setTimeout(() => {
    playNote(valB, maxVal, 'triangle', 0.06, 0.08);
  }, 35);
}

/**
 * Generic Data Structure & Graph Action Sounds
 */
export function playActionSound(action = 'insert') {
  if (isSoundMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (action === 'enable') {
      playNote(40, 100, 'sine', 0.08, 0.07);
      setTimeout(() => playNote(80, 100, 'sine', 0.1, 0.08), 80);
    } else if (action === 'push' || action === 'enqueue' || action === 'insert') {
      playNote(65, 100, 'triangle', 0.08, 0.08);
    } else if (action === 'pop' || action === 'dequeue' || action === 'delete') {
      playNote(35, 100, 'sine', 0.09, 0.07);
    } else if (action === 'visit' || action === 'traverse') {
      playNote(55, 100, 'sine', 0.05, 0.05);
    } else if (action === 'found' || action === 'success') {
      playNote(85, 100, 'triangle', 0.12, 0.09);
    }
  } catch (e) {
    // Ignore
  }
}

/**
 * Swap chime for duel and sorting algorithms
 */
export function playSwapChime() {
  if (isSoundMuted) return;
  playNote(70, 100, 'triangle', 0.07, 0.08);
}

/**
 * Victory fanfare when algorithm finishes successfully
 */
export function playCompleteFanfare() {
  if (isSoundMuted) return;
  const chord = [40, 60, 75, 95];
  chord.forEach((n, idx) => {
    setTimeout(() => {
      playNote(n, 100, 'sine', 0.16, 0.09);
    }, idx * 75);
  });
}
