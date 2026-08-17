// src/components/AlgorithmDuel.jsx — Advanced Real-Time Algorithm Duel & Benchmark Arena

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ALGORITHMS } from '../data/algorithms.js';
import { PlayIcon, PauseIcon, ShuffleIcon, ResetIcon, getAlgoIcon } from './Icons.jsx';
import { playNote, playSwapChime, playCompleteFanfare } from '../utils/sound.js';

// Algorithms available for Duel
const DUEL_ALGOS = [
  { slug: 'bubble-sort',    name: 'Bubble Sort',    comp: 'O(n²)',       type: 'quadratic', color: '#818cf8', icon: '🫧' },
  { slug: 'selection-sort', name: 'Selection Sort', comp: 'O(n²)',       type: 'quadratic', color: '#a78bfa', icon: '🎯' },
  { slug: 'insertion-sort', name: 'Insertion Sort', comp: 'O(n²)',       type: 'quadratic', color: '#c084fc', icon: '📥' },
  { slug: 'merge-sort',     name: 'Merge Sort',     comp: 'O(n log n)',  type: 'log',       color: '#38bdf8', icon: '🔀' },
  { slug: 'quick-sort',     name: 'Quick Sort',     comp: 'O(n log n)',  type: 'log',       color: '#60a5fa', icon: '⚡' },
  { slug: 'heap-sort',      name: 'Heap Sort',      comp: 'O(n log n)',  type: 'log',       color: '#2dd4bf', icon: '🏔️' },
];

function generateDataset(size = 18, type = 'random') {
  if (type === 'reversed') {
    return Array.from({ length: size }, (_, i) => Math.round(((size - i) / size) * 85) + 15);
  }
  if (type === 'nearly-sorted') {
    const arr = Array.from({ length: size }, (_, i) => Math.round(((i + 1) / size) * 85) + 15);
    // Swap 2 random pairs
    for (let k = 0; k < 2; k++) {
      const i1 = Math.floor(Math.random() * size);
      const i2 = Math.floor(Math.random() * size);
      const tmp = arr[i1];
      arr[i1] = arr[i2];
      arr[i2] = tmp;
    }
    return arr;
  }
  return Array.from({ length: size }, () => Math.floor(Math.random() * 80) + 15);
}

function formatPhaseMessage(msg) {
  if (!msg) return 'Executing steps…';
  if (msg.includes('=[')) {
    return msg.split('=[')[0].trim();
  }
  return msg;
}

export default function AlgorithmDuel() {
  const [algoA, setAlgoA] = useState('bubble-sort');
  const [algoB, setAlgoB] = useState('quick-sort');
  const [dataPreset, setDataPreset] = useState('random');
  const [arraySize, setArraySize] = useState(16);
  const [initialArray, setInitialArray] = useState(() => generateDataset(16, 'random'));

  // States for Racer A
  const [framesA, setFramesA] = useState([]);
  const [idxA, setIdxA] = useState(0);
  const [statsA, setStatsA] = useState({ comps: 0, swaps: 0 });

  // States for Racer B
  const [framesB, setFramesB] = useState([]);
  const [idxB, setIdxB] = useState(0);
  const [statsB, setStatsB] = useState({ comps: 0, swaps: 0 });

  const [isRunning, setIsRunning] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1); // 0.5x | 1x | 2x | 4x
  const [winner, setWinner] = useState(null); // 'A' | 'B' | 'TIE' | null

  const timerRef = useRef(null);

  // Interval speed calculation
  const intervalMs = useMemo(() => {
    const base = arraySize > 25 ? 40 : 60;
    return Math.max(10, Math.round(base / speedMultiplier));
  }, [speedMultiplier, arraySize]);

  // Regenerate dataset and load frames
  const loadFrames = (arr = initialArray, slugA = algoA, slugB = algoB) => {
    const modA = ALGORITHMS.find(a => a.slug === slugA);
    const modB = ALGORITHMS.find(a => a.slug === slugB);

    if (modA?.module?.generate && modB?.module?.generate) {
      const gA = modA.module.generate([...arr]);
      const gB = modB.module.generate([...arr]);

      const allA = [];
      for (const f of gA) allA.push(f);

      const allB = [];
      for (const f of gB) allB.push(f);

      setFramesA(allA);
      setFramesB(allB);
    }
  };

  const resetRace = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    setIdxA(0);
    setIdxB(0);
    setStatsA({ comps: 0, swaps: 0 });
    setStatsB({ comps: 0, swaps: 0 });
    setWinner(null);
    loadFrames(initialArray, algoA, algoB);
  };

  useEffect(() => {
    resetRace();
  }, [algoA, algoB, initialArray]);

  const handleShuffle = (type = dataPreset, size = arraySize) => {
    const newArr = generateDataset(size, type);
    setInitialArray(newArr);
  };

  const handleSizeChange = (newSize) => {
    setArraySize(newSize);
    handleShuffle(dataPreset, newSize);
  };

  const handlePresetChange = (preset) => {
    setDataPreset(preset);
    handleShuffle(preset, arraySize);
  };

  const handleStartPause = () => {
    if (isRunning) {
      clearInterval(timerRef.current);
      setIsRunning(false);
    } else {
      if (winner) {
        resetRace();
      }
      setIsRunning(true);
    }
  };

  // Execution Step Loop
  useEffect(() => {
    if (!isRunning) return;

    timerRef.current = setInterval(() => {
      let nextA = 0;
      let nextB = 0;
      let doneA = false;
      let doneB = false;

      setIdxA(prevA => {
        if (prevA < framesA.length - 1) {
          const next = prevA + 1;
          const frame = framesA[next];
          if (frame?.comparing?.length > 0 || frame?.isComparing) {
            setStatsA(s => ({ ...s, comps: s.comps + 1 }));
            playNote(frame.array?.[frame.comparing?.[0]] || 50, 0.04);
          }
          if (frame?.swapping?.length > 0 || frame?.isSwapping) {
            setStatsA(s => ({ ...s, swaps: s.swaps + 1 }));
            playSwapChime();
          }
          return next;
        }
        doneA = true;
        return prevA;
      });

      setIdxB(prevB => {
        if (prevB < framesB.length - 1) {
          const next = prevB + 1;
          const frame = framesB[next];
          if (frame?.comparing?.length > 0 || frame?.isComparing) {
            setStatsB(s => ({ ...s, comps: s.comps + 1 }));
            playNote(frame.array?.[frame.comparing?.[0]] || 50, 0.04);
          }
          if (frame?.swapping?.length > 0 || frame?.isSwapping) {
            setStatsB(s => ({ ...s, swaps: s.swaps + 1 }));
            playSwapChime();
          }
          return next;
        }
        doneB = true;
        return prevB;
      });

      // Victory evaluation
      if (doneA && !doneB && !winner) {
        setWinner('A');
        setIsRunning(false);
        playCompleteFanfare();
      } else if (doneB && !doneA && !winner) {
        setWinner('B');
        setIsRunning(false);
        playCompleteFanfare();
      } else if (doneA && doneB && !winner) {
        setWinner('TIE');
        setIsRunning(false);
        playCompleteFanfare();
      }
    }, intervalMs);

    return () => clearInterval(timerRef.current);
  }, [isRunning, framesA, framesB, intervalMs, winner]);

  const currentFrameA = framesA[idxA] || { array: initialArray };
  const currentFrameB = framesB[idxB] || { array: initialArray };

  const progressA = framesA.length > 1 ? Math.round((idxA / (framesA.length - 1)) * 100) : 0;
  const progressB = framesB.length > 1 ? Math.round((idxB / (framesB.length - 1)) * 100) : 0;

  const infoA = DUEL_ALGOS.find(a => a.slug === algoA);
  const infoB = DUEL_ALGOS.find(a => a.slug === algoB);
  const maxVal = Math.max(...initialArray, 100);

  return (
    <div className="duel-arena-container">
      {/* ── Duel Header & Controls Bar ── */}
      <div className="duel-header">
        <div className="duel-header-top">
          <div className="duel-badge-pill">
            <span className="duel-badge-icon">⚔️</span>
            <span>Real-Time Algorithm Battle Arena</span>
            <span className="duel-live-indicator">
              <span className={`live-dot ${isRunning ? 'pulse' : ''}`} />
              {isRunning ? 'Race in Progress' : 'Ready to Duel'}
            </span>
          </div>
          <h2 className="duel-title">Side-by-Side Execution Race</h2>
          <p className="duel-subtitle">
            Witness firsthand how O(n log n) divide-and-conquer algorithms vastly outpace O(n²) quadratic algorithms on the exact same dataset!
          </p>
        </div>

        {/* ── Interactive Preset & Race Controls Bar ── */}
        <div className="duel-controls-bar">
          {/* Dataset Preset Selector */}
          <div className="duel-preset-group">
            <span className="ctrl-lbl">Data:</span>
            <button
              className={`preset-btn ${dataPreset === 'random' ? 'active' : ''}`}
              onClick={() => handlePresetChange('random')}
              disabled={isRunning}
            >
              🎲 Random
            </button>
            <button
              className={`preset-btn ${dataPreset === 'reversed' ? 'active' : ''}`}
              onClick={() => handlePresetChange('reversed')}
              disabled={isRunning}
            >
              📉 Reversed
            </button>
            <button
              className={`preset-btn ${dataPreset === 'nearly-sorted' ? 'active' : ''}`}
              onClick={() => handlePresetChange('nearly-sorted')}
              disabled={isRunning}
            >
              🔄 Nearly Sorted
            </button>
          </div>

          {/* Array Size Selector */}
          <div className="duel-preset-group">
            <span className="ctrl-lbl">Size:</span>
            {[12, 16, 24, 32].map(sz => (
              <button
                key={sz}
                className={`preset-btn ${arraySize === sz ? 'active' : ''}`}
                onClick={() => handleSizeChange(sz)}
                disabled={isRunning}
              >
                {sz}
              </button>
            ))}
          </div>

          {/* Speed Multiplier */}
          <div className="duel-preset-group">
            <span className="ctrl-lbl">Speed:</span>
            {[0.5, 1, 2, 4].map(s => (
              <button
                key={s}
                className={`preset-btn ${speedMultiplier === s ? 'active' : ''}`}
                onClick={() => setSpeedMultiplier(s)}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="duel-actions-row">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => handleShuffle()}
              disabled={isRunning}
            >
              <ShuffleIcon size={12} />
              <span>Shuffle</span>
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={resetRace}
            >
              <ResetIcon size={12} />
              <span>Reset</span>
            </button>
            <button
              className={`btn btn-primary duel-play-btn ${isRunning ? 'running' : ''}`}
              onClick={handleStartPause}
            >
              {isRunning ? <PauseIcon size={14} /> : <PlayIcon size={14} />}
              <span>{isRunning ? 'Pause Race' : 'Start Algorithm Race!'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Victory Celebration Banner ── */}
      {winner && (
        <div className={`duel-victory-banner victory-${winner.toLowerCase()}`}>
          <div className="victory-icon">
            {winner === 'A' ? '🥇' : winner === 'B' ? '🥇' : '🤝'}
          </div>
          <div className="victory-details">
            <h3 className="victory-title">
              {winner === 'A'
                ? `🏆 ${infoA?.name} WON THE RACE!`
                : winner === 'B'
                ? `🏆 ${infoB?.name} WON THE RACE!`
                : '🤝 PERFECT TIE!'}
            </h3>
            <p className="victory-desc">
              {winner === 'A'
                ? `${infoA?.name} completed in ${idxA} steps vs ${infoB?.name}'s ${idxB} steps (${statsA.comps} vs ${statsB.comps} comparisons).`
                : winner === 'B'
                ? `${infoB?.name} completed in ${idxB} steps vs ${infoA?.name}'s ${idxA} steps (${statsB.comps} vs ${statsA.comps} comparisons).`
                : `Both algorithms sorted the dataset with comparable step counts.`}
            </p>
          </div>
        </div>
      )}

      {/* ── Synchronized Arena Race Track (Side-by-Side) ── */}
      <div className="duel-arena-grid">
        {/* ── Competitor A (Team Indigo) ── */}
        <div className={`duel-card card-racer-a ${winner === 'A' ? 'winner-card' : ''}`}>
          <div className="duel-card-header">
            <div className="racer-select-group">
              <div className="racer-tag racer-a">
                <span>RACER A</span>
              </div>
              <div className="racer-select-wrapper">
                <span className="racer-algo-icon">{getAlgoIcon(algoA, 16)}</span>
                <select
                  value={algoA}
                  onChange={e => setAlgoA(e.target.value)}
                  disabled={isRunning}
                  className="duel-select"
                >
                  {DUEL_ALGOS.map(a => (
                    <option key={a.slug} value={a.slug}>{a.name} ({a.comp})</option>
                  ))}
                </select>
              </div>
            </div>
            {winner === 'A' && <span className="winner-trophy trophy-a">🏆 WINNER</span>}
          </div>

          <div className="racer-phase-pill pill-a">
            <span className="phase-lbl">
              {((currentFrameA.swapping?.length > 0) || currentFrameA.isSwapping)
                ? '🔄 SWAPPING'
                : ((currentFrameA.comparing?.length > 0) || currentFrameA.isComparing)
                ? '🔍 COMPARING'
                : '⚡ RUNNING'}
            </span>
            <span className="phase-txt">{formatPhaseMessage(currentFrameA.message)}</span>
          </div>

          {/* Vibrant Canvas A */}
          <div className="duel-canvas">
            {(currentFrameA.array || initialArray).map((val, i) => {
              const isSwp = currentFrameA.swapping?.includes(i);
              const isCmp = currentFrameA.comparing?.includes(i);
              const isSorted = currentFrameA.sortedIndices?.includes(i);
              const heightPct = Math.max(6, Math.round((val / maxVal) * 100));

              return (
                <div key={i} className="duel-bar-col">
                  <span className="duel-bar-val">{val}</span>
                  <div
                    className={`duel-bar bar-a ${isSwp ? 'bar-a-swap' : isCmp ? 'bar-a-cmp' : isSorted ? 'bar-sorted' : ''}`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
              );
            })}
          </div>

          {/* Progress Bar A */}
          <div className="duel-progress-track">
            <div className="duel-progress-fill fill-a" style={{ width: `${progressA}%` }} />
          </div>

          {/* Metrics A */}
          <div className="duel-metrics">
            <div className="metric-box">
              <span className="metric-lbl">Steps</span>
              <span className="metric-val">{idxA}</span>
            </div>
            <div className="metric-box">
              <span className="metric-lbl">Comps</span>
              <span className="metric-val">{statsA.comps}</span>
            </div>
            <div className="metric-box">
              <span className="metric-lbl">Swaps</span>
              <span className="metric-val">{statsA.swaps}</span>
            </div>
          </div>
        </div>

        {/* ── VS Badge in Middle ── */}
        <div className="duel-vs-badge">
          <div className="vs-glow-ring" />
          <span>VS</span>
        </div>

        {/* ── Competitor B (Team Cyan) ── */}
        <div className={`duel-card card-racer-b ${winner === 'B' ? 'winner-card' : ''}`}>
          <div className="duel-card-header">
            <div className="racer-select-group">
              <div className="racer-tag racer-b">
                <span>RACER B</span>
              </div>
              <div className="racer-select-wrapper">
                <span className="racer-algo-icon">{getAlgoIcon(algoB, 16)}</span>
                <select
                  value={algoB}
                  onChange={e => setAlgoB(e.target.value)}
                  disabled={isRunning}
                  className="duel-select"
                >
                  {DUEL_ALGOS.map(a => (
                    <option key={a.slug} value={a.slug}>{a.name} ({a.comp})</option>
                  ))}
                </select>
              </div>
            </div>
            {winner === 'B' && <span className="winner-trophy trophy-b">🏆 WINNER</span>}
          </div>

          <div className="racer-phase-pill pill-b">
            <span className="phase-lbl">
              {((currentFrameB.swapping?.length > 0) || currentFrameB.isSwapping)
                ? '🔄 SWAPPING'
                : ((currentFrameB.comparing?.length > 0) || currentFrameB.isComparing)
                ? '🔍 COMPARING'
                : '⚡ RUNNING'}
            </span>
            <span className="phase-txt">{formatPhaseMessage(currentFrameB.message)}</span>
          </div>

          {/* Vibrant Canvas B */}
          <div className="duel-canvas">
            {(currentFrameB.array || initialArray).map((val, i) => {
              const isSwp = currentFrameB.swapping?.includes(i);
              const isCmp = currentFrameB.comparing?.includes(i);
              const isSorted = currentFrameB.sortedIndices?.includes(i);
              const heightPct = Math.max(6, Math.round((val / maxVal) * 100));

              return (
                <div key={i} className="duel-bar-col">
                  <span className="duel-bar-val">{val}</span>
                  <div
                    className={`duel-bar bar-b ${isSwp ? 'bar-b-swap' : isCmp ? 'bar-b-cmp' : isSorted ? 'bar-sorted' : ''}`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
              );
            })}
          </div>

          {/* Progress Bar B */}
          <div className="duel-progress-track">
            <div className="duel-progress-fill fill-b" style={{ width: `${progressB}%` }} />
          </div>

          {/* Metrics B */}
          <div className="duel-metrics">
            <div className="metric-box">
              <span className="metric-lbl">Steps</span>
              <span className="metric-val">{idxB}</span>
            </div>
            <div className="metric-box">
              <span className="metric-lbl">Comps</span>
              <span className="metric-val">{statsB.comps}</span>
            </div>
            <div className="metric-box">
              <span className="metric-lbl">Swaps</span>
              <span className="metric-val">{statsB.swaps}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
