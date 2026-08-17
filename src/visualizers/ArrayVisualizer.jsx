import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playNote, playComparisonSound, playSwapSound, playActionSound, playCompleteFanfare } from '../utils/sound.js';

/**
 * Maps algorithm internal frame state to semantic bar styling classes.
 */
function getBarState(idx, frame, type) {
  if (frame.sorted?.includes(idx))     return 'sorted';
  if (frame.swapping?.includes(idx))   return 'swapping';
  if (frame.comparing?.includes(idx))  return 'comparing';
  if (frame.pivot === idx)             return 'pivot';
  if (frame.current === idx)           return 'current';
  if (frame.leftHalf?.includes(idx))   return 'left-half';
  if (frame.rightHalf?.includes(idx))  return 'right-half';
  return 'default';
}

/**
 * Returns a human-friendly phase badge + description for the current step.
 */
function getBanner(frame) {
  if (!frame) return { label: 'IDLE', color: 'neutral', text: 'Ready to run.' };
  if (frame.swapping?.length === 2) {
    const [a, b] = frame.swapping;
    const arr = frame.array || [];
    return {
      label: '⇄ SWAPPING',
      color: 'swap',
      text: `Swapped! arr[${a}]=${arr[a]} ↔ arr[${b}]=${arr[b]} — exchanging positions`,
    };
  }
  if (frame.comparing?.length === 2) {
    const [a, b] = frame.comparing;
    const arr = frame.array || [];
    const gt = arr[a] > arr[b];
    return {
      label: '⚡ COMPARING',
      color: gt ? 'bad' : 'ok',
      text: `arr[${a}]=${arr[a]} ${gt ? '>' : '≤'} arr[${b}]=${arr[b]} — ${gt ? 'Swap needed.' : 'Already in order.'}`,
    };
  }
  if (
    frame.message?.toLowerCase().includes('sort') ||
    frame.message?.toLowerCase().includes('complete') ||
    frame.message?.toLowerCase().includes('finish')
  ) {
    return { label: '✅ COMPLETE', color: 'done', text: frame.message };
  }
  return { label: '🔍 RUNNING', color: 'neutral', text: frame.message || 'Executing algorithm step…' };
}

export default function ArrayVisualizer({ frame, type = 'sorting' }) {
  const canvasRef = useRef(null);
  const barsContainerRef = useRef(null);
  const colRefs = useRef({});
  const [dim, setDim] = useState({ w: 600, h: 240 });
  const [swapGeometry, setSwapGeometry] = useState(null);
  const [cmpGeometry, setCmpGeometry] = useState(null);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      if (height > 30 && width > 30) setDim({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const array    = frame?.array || [];
  const n        = array.length;
  const maxVal   = Math.max(...array, 1);
  const showLbl  = n <= 24;

  const isSwap   = frame?.swapping?.length === 2;
  const isCmp    = !isSwap && frame?.comparing?.length === 2;
  const pair     = isSwap ? frame.swapping : isCmp ? frame.comparing : [];
  const [pA, pB] = pair.length === 2 ? pair : [null, null];

  const banner   = getBanner(frame);

  const hasPointers = frame?.pointers && Object.keys(frame.pointers).length > 0;
  // Reserve space for labels: number on top (24px) + index below (18px) + pointers below (20px)
  const topPad  = showLbl ? 24 : 8;
  const botPad  = (showLbl ? 20 : 6) + (hasPointers ? 22 : 0);
  const trackH  = Math.max(50, dim.h - topPad - botPad);
  const barPxH  = (v) => Math.max(6, Math.round((v / maxVal) * trackH));

  // Compute exact pixel coordinates of swapping/comparing bars with instant mathematical sync
  useLayoutEffect(() => {
    if (!barsContainerRef.current) return;
    const parentRect = barsContainerRef.current.getBoundingClientRect();
    if (parentRect.width === 0) return;

    if (isSwap && pA != null && pB != null) {
      const idxA = Math.min(pA, pB);
      const idxB = Math.max(pA, pB);
      const elA  = colRefs.current[idxA];
      const elB  = colRefs.current[idxB];
      if (elA && elB) {
        const rectA = elA.getBoundingClientRect();
        const rectB = elB.getBoundingClientRect();
        const xA = (rectA.left + rectA.right) / 2 - parentRect.left;
        const xB = (rectB.left + rectB.right) / 2 - parentRect.left;

        // Calculate bar baseline relative to barsContainer
        const ptrsCount = frame.pointers ? Object.keys(frame.pointers).length : 0;
        const baseY     = parentRect.height - (showLbl ? 20 : 4) - (ptrsCount > 0 ? 22 : 0);
        const lift      = 14; // Swapping bars lift by 14px
        const hA        = barPxH(array[idxA]);
        const hB        = barPxH(array[idxB]);
        const yA        = baseY - hA - lift;
        const yB        = baseY - hB - lift;

        setSwapGeometry({ xA, xB, yA, yB });
      } else {
        setSwapGeometry(null);
      }
    } else {
      setSwapGeometry(null);
    }

    if (isCmp && pA != null && pB != null) {
      const idxA = Math.min(pA, pB);
      const idxB = Math.max(pA, pB);
      const elA  = colRefs.current[idxA];
      const elB  = colRefs.current[idxB];
      if (elA && elB) {
        const rectA = elA.getBoundingClientRect();
        const rectB = elB.getBoundingClientRect();
        const midX  = (rectA.left + rectA.right + rectB.left + rectB.right) / 4 - parentRect.left;
        const ptrsCount = frame.pointers ? Object.keys(frame.pointers).length : 0;
        const baseY     = parentRect.height - (showLbl ? 20 : 4) - (ptrsCount > 0 ? 22 : 0);
        const lift      = 6; // Comparing bars lift by 6px
        const maxH      = Math.max(barPxH(array[idxA]), barPxH(array[idxB]));
        const topY      = baseY - maxH - lift - 18;
        setCmpGeometry({ midX, topY });
      } else {
        setCmpGeometry(null);
      }
    } else {
      setCmpGeometry(null);
    }

    // Audio Sonification on Swaps, Comparisons & Completion
    if (frame) {
      if (isSwap && pA != null && pB != null) {
        playSwapSound(array[pA] || 50, array[pB] || 50, maxVal);
      } else if (isCmp && pA != null) {
        playComparisonSound(array[pA] || 50, maxVal);
      } else if (frame.found != null) {
        playActionSound('found');
      } else if (frame.message && (frame.message.toLowerCase().includes('complete') || frame.message.includes('✅') || frame.message.toLowerCase().includes('finished'))) {
        playCompleteFanfare();
      }
    }
  }, [frame, isSwap, isCmp, pA, pB, array, dim, maxVal]);

  if (!frame) return (
    <div className="avz-empty">
      <div className="avz-empty-icon">▶</div>
      <p>Select an algorithm and press Play</p>
    </div>
  );

  return (
    <div className="avz-root">
      {/* ── Phase Banner ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={banner.label}
          className={`avz-banner avz-banner-${banner.color}`}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.14 }}
        >
          <span className="avz-banner-label">{banner.label}</span>
          <span className="avz-banner-text">{banner.text}</span>
        </motion.div>
      </AnimatePresence>

      {/* ── Main Canvas (pinned to bottom baseline) ── */}
      <div className="avz-canvas" ref={canvasRef}>
        {/* ── Bars Row (strictly bottom-aligned baseline) ── */}
        <div className="avz-bars" ref={barsContainerRef}>
          {/* Dynamic Curved Swap Arrow connecting Bar A and Bar B */}
          {swapGeometry && (
            <svg className="avz-swap-arrow-svg">
              <defs>
                <marker
                  id="swap-arr-left"
                  viewBox="0 0 10 10"
                  refX="3"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto"
                >
                  <path d="M 10 1 L 1 5 L 10 9 z" fill="#38bdf8" />
                </marker>
                <marker
                  id="swap-arr-right"
                  viewBox="0 0 10 10"
                  refX="7"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto"
                >
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#38bdf8" />
                </marker>
              </defs>
              <motion.path
                d={`M ${swapGeometry.xA},${swapGeometry.yA - 4} C ${swapGeometry.xA},${Math.min(swapGeometry.yA, swapGeometry.yB) - 26} ${swapGeometry.xB},${Math.min(swapGeometry.yA, swapGeometry.yB) - 26} ${swapGeometry.xB},${swapGeometry.yB - 4}`}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeDasharray="5,3"
                markerStart="url(#swap-arr-left)"
                markerEnd="url(#swap-arr-right)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              />
            </svg>
          )}

          {/* Central Curved Swap Badge at Arch Apex */}
          {swapGeometry && (
            <AnimatePresence>
              <motion.div
                key={`swap-badge-${pA}-${pB}`}
                className="avz-swap-curved-badge"
                style={{
                  left: `${(swapGeometry.xA + swapGeometry.xB) / 2}px`,
                  top: `${Math.min(swapGeometry.yA, swapGeometry.yB) - 34}px`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 22 }}
              >
                <span>⇄</span>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Floating Comparison Operator */}
          {cmpGeometry && (
            <AnimatePresence>
              <motion.div
                key={`cmp-badge-${pA}-${pB}`}
                className={`avz-op ${array[pA] > array[pB] ? 'op-red' : 'op-green'}`}
                style={{
                  left: `${cmpGeometry.midX}px`,
                  top: `${cmpGeometry.topY}px`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 22 }}
              >
                {array[pA] > array[pB] ? '>' : array[pA] < array[pB] ? '<' : '='}
              </motion.div>
            </AnimatePresence>
          )}

          {array.map((val, i) => {
            const state  = getBarState(i, frame, type);
            const inPair = pair.includes(i);
            const isSwappingBar = isSwap && inPair;
            const isComparingBar = isCmp && inPair;
            const h      = barPxH(val);

            // On-bar badge only if bar is tall enough to avoid clutter
            let badge = null;
            if (isSwappingBar) {
              badge = { icon: '⇄', label: '', cls: 'bdg-sw' };
            } else if (isComparingBar) {
              badge = { icon: i === pA ? 'A' : 'B', label: '', cls: i === pA ? 'bdg-a' : 'bdg-b' };
            } else if (frame.pivot === i) {
              badge = { icon: '◆', label: 'P', cls: 'bdg-pv' };
            }

            // Pointers on this index (e.g. i, j, min)
            const ptrs = frame.pointers
              ? Object.entries(frame.pointers).filter(([, v]) => v === i)
              : [];

            return (
              <div
                key={i}
                ref={(el) => (colRefs.current[i] = el)}
                className={`avz-col ${isSwap && !inPair ? 'avz-col-dim' : ''}`}
              >
                {/* Number Value Label above the bar */}
                {showLbl && (
                  <motion.span
                    className={`avz-num${inPair ? ` nm-${state}` : ''}${isSwappingBar ? ' nm-swap-active' : ''}`}
                    animate={{
                      scale: isSwappingBar ? 1.25 : inPair ? 1.15 : 1,
                      y: isSwappingBar ? -8 : inPair ? -3 : 0,
                    }}
                    transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                  >
                    {val}
                  </motion.span>
                )}

                {/* The Histogram Bar with smooth spring morphing */}
                <motion.div
                  className={`avz-bar bar-${state}${isSwappingBar ? ' bar-swap-active' : ''}`}
                  animate={{
                    height: h,
                    y: isSwappingBar ? -14 : isCmp && inPair ? -6 : 0,
                  }}
                  transition={{
                    height: { type: 'spring', stiffness: 280, damping: 22 },
                    y:      { type: 'spring', stiffness: 360, damping: 20 },
                  }}
                >
                  {badge && h >= 32 && (
                    <AnimatePresence>
                      <motion.div
                        key={`b${i}${state}`}
                        className={`avz-badge ${badge.cls}`}
                        initial={{ opacity: 0, scale: 0.4 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.4 }}
                        transition={{ duration: 0.15 }}
                      >
                        <span className="bi">{badge.icon}</span>
                        {badge.label && <span className="bl">{badge.label}</span>}
                      </motion.div>
                    </AnimatePresence>
                  )}
                </motion.div>

                {/* Index Label below the bar (permanently fixed baseline) */}
                {showLbl && (
                  <span className={`avz-idx${inPair ? ' ai' : ''}${isSwappingBar ? ' avz-idx-swap' : ''}`}>{i}</span>
                )}

                {/* Pointer tags below index (e.g. i ▲, min ▲) */}
                {ptrs.length > 0 && (
                  <div className="avz-ptrs">
                    {ptrs.map(([name]) => (
                      <span key={name} className="avz-ptr-tag">
                        <span className="avz-ptr-arrow">▲</span>
                        <span className="avz-ptr-name">{name}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Variable Inspector ── */}
      {frame.variables && Object.keys(frame.variables).length > 0 && (
        <div className="avz-vars">
          {Object.entries(frame.variables).map(([k, v]) => (
            <span key={k} className="avz-var">
              <span className="vk">{k}</span>
              <span className="ve">=</span>
              <span className="vv">{String(v)}</span>
            </span>
          ))}
        </div>
      )}

      {/* ── Color Legend ── */}
      <div className="avz-legend">
        {[
          ['bar-comparing', 'Comparing'],
          ['bar-swapping',  'Swapping' ],
          ['bar-sorted',    'Sorted'   ],
          ['bar-pivot',     'Pivot / Min'],
          ['bar-current',   'Current'  ],
        ].map(([cls, lbl]) => (
          <div key={lbl} className="avz-leg-item">
            <div className={`avz-leg-dot ${cls}`} />
            <span>{lbl}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
