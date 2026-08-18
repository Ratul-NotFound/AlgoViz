// src/engine/useStepper.js
// Core animation engine — drives all algorithm visualizations

import { useState, useRef, useCallback, useEffect } from 'react';

export function useStepper(generatorFn, initialData) {
  const [frames, setFrames]           = useState([]);
  const [currentIdx, setCurrentIdx]   = useState(0);
  const [isPlaying, setIsPlaying]     = useState(false);
  const [speed, setSpeed]             = useState(1);
  const [isDone, setIsDone]           = useState(false);

  const intervalRef  = useRef(null);
  const framesRef    = useRef([]);
  const currentIdxRef = useRef(0);

  // Build all frames from the generator upfront
  const buildFrames = useCallback((data) => {
    if (!generatorFn || !data) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    const gen = generatorFn(data);
    const allFrames = [];
    let result = gen.next();
    while (!result.done) {
      allFrames.push(result.value);
      result = gen.next();
    }
    framesRef.current = allFrames;
    setFrames(allFrames);
    setCurrentIdx(0);
    currentIdxRef.current = 0;
    setIsPlaying(false);
    setIsDone(false);
  }, [generatorFn]);

  // Auto-rebuild when data changes
  useEffect(() => {
    if (initialData) buildFrames(initialData);
  }, [buildFrames, initialData]);

  // Playback interval
  useEffect(() => {
    if (isPlaying) {
      const delay = Math.max(100, 800 / speed);
      intervalRef.current = setInterval(() => {
        const next = currentIdxRef.current + 1;
        if (next >= framesRef.current.length) {
          setIsPlaying(false);
          setIsDone(true);
          clearInterval(intervalRef.current);
        } else {
          currentIdxRef.current = next;
          setCurrentIdx(next);
        }
      }, delay);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, speed]);

  const play    = () => { if (!isDone) setIsPlaying(true); };
  const pause   = () => setIsPlaying(false);

  const stepForward = () => {
    const next = currentIdxRef.current + 1;
    if (next < framesRef.current.length) {
      currentIdxRef.current = next;
      setCurrentIdx(next);
      if (next === framesRef.current.length - 1) setIsDone(true);
    }
  };

  const stepBackward = () => {
    const prev = currentIdxRef.current - 1;
    if (prev >= 0) {
      currentIdxRef.current = prev;
      setCurrentIdx(prev);
      setIsDone(false);
    }
  };

  const reset = useCallback(() => {
    clearInterval(intervalRef.current);
    setIsPlaying(false);
    setIsDone(false);
    currentIdxRef.current = 0;
    setCurrentIdx(0);
  }, []);

  const currentFrame = framesRef.current[currentIdx] || null;
  const progress = framesRef.current.length > 1
    ? (currentIdx / (framesRef.current.length - 1)) * 100
    : 0;

  return {
    currentFrame,
    currentIdx,
    totalFrames: framesRef.current.length,
    isPlaying,
    isDone,
    speed,
    progress,
    setSpeed,
    play,
    pause,
    stepForward,
    stepBackward,
    reset,
    buildFrames,
  };
}
