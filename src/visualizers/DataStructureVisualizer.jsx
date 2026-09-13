// src/visualizers/DataStructureVisualizer.jsx — Interactive, Conceptually Synced Data Structure Visualizer

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playImpactSound, playLiftSound, playChimeSound, toggleMute, getIsMuted } from '../utils/audioFX';

function SpringCoilSVG({ height = 50, width = 140 }) {
  const turns = 5;
  const h = Math.max(20, height);
  const step = h / turns;
  let path = `M ${width * 0.5} 0 `;
  for (let i = 0; i < turns; i++) {
    const y1 = i * step + step * 0.25;
    const y2 = i * step + step * 0.75;
    const y3 = (i + 1) * step;
    path += `C ${width * 0.88} ${y1}, ${width * 0.12} ${y2}, ${width * 0.5} ${y3} `;
  }
  return (
    <svg width={width} height={h} viewBox={`0 0 ${width} ${h}`} className="stack-spring-svg">
      <defs>
        <linearGradient id="springMetalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="25%" stopColor="#94a3b8" />
          <stop offset="50%" stopColor="#f8fafc" />
          <stop offset="75%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
      </defs>
      <path d={path} fill="none" stroke="url(#springMetalGrad)" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export default function DataStructureVisualizer({ frame, type = 'stack' }) {
  const [muted, setMuted] = useState(getIsMuted());

  const handleToggleSound = () => {
    const nextMuted = toggleMute();
    setMuted(nextMuted);
  };

  const {
    items = [],
    nodes = [],
    slots = [],
    heap = [],
    buckets = [],
    front = -1,
    rear = -1,
    capacity = 6,
    highlightIndices = [],
    swapIndices = [],
    headId = null,
    tailId = null,
    activeNodeId = null,
    traversingId = null,
    activeBucketIdx = null,
    hashComputation = null,
    direction = 'forward',
    action = 'idle',
    topIndex = items.length - 1,
    incomingItem = null,
    poppingItem = null,
    leavingItem = null,
    inputStream = [],
    inputIndex = -1,
    message = '',
  } = frame || {};

  // Audio cues — strictly synchronized on each step frame
  useEffect(() => {
    if (!frame || !action || action === 'idle') return;
    if (
      action.startsWith('push') ||
      action.startsWith('enqueue') ||
      action.startsWith('insert') ||
      action.startsWith('sift_up')
    ) {
      playImpactSound(340);
    } else if (action.startsWith('pop') || action.startsWith('dequeue') || action.startsWith('extract')) {
      playLiftSound();
    } else if (action === 'peek' || action === 'traverse' || action === 'lookup' || action === 'collision') {
      playChimeSound();
    }
  }, [frame]);

  if (!frame) {
    return (
      <div className="ds-empty-placeholder">
        <div className="ds-empty-icon">📦</div>
        <div className="ds-empty-text">Click <strong>Play</strong> below to start visualizing {type.toUpperCase()}</div>
      </div>
    );
  }

  const getItemData = (item, fallbackIdx) => {
    if (item !== null && typeof item === 'object') {
      return {
        id: item.id || `item-${fallbackIdx}-${item.val}`,
        val: item.val !== undefined ? item.val : JSON.stringify(item),
      };
    }
    return {
      id: `item-${fallbackIdx}-${item}`,
      val: item,
    };
  };

  const getSlotAngle = (idx, total = (capacity || slots.length || 6)) => {
    return (idx * (360 / total)) - 90;
  };

  return (
    <div className="ds-viz-main">
      {/* ── 1. Live Pointer & Variable Dashboard (For Trees, Graphs, LL) ── */}
      {type !== 'stack' && type !== 'queue' && (
        <div className="ds-variables-dashboard">

        {type === 'linked-list' && (
          <>
            <div className="var-badge">
              <span className="var-name">HEAD pointer:</span>
              <span className="var-val highlight">{nodes[0] ? `Node @ 0x400 (${nodes[0].data ?? nodes[0].val ?? nodes[0]})` : 'NULL'}</span>
            </div>
            <div className="var-badge">
              <span className="var-name">Total Nodes:</span>
              <span className="var-val">{nodes.length}</span>
            </div>
            <div className="var-badge">
              <span className="var-name">Structure:</span>
              <span className="var-rule">Singly Chained (Data + .next pointer)</span>
            </div>
          </>
        )}

        {type === 'doubly-linked-list' && (
          <>
            <div className="var-badge">
              <span className="var-name">HEAD:</span>
              <span className="var-val highlight">{nodes[0]?.data ?? 'NULL'}</span>
            </div>
            <div className="var-badge">
              <span className="var-name">TAIL:</span>
              <span className="var-val highlight-rear">{nodes[nodes.length - 1]?.data ?? 'NULL'}</span>
            </div>
            <div className="var-badge">
              <span className="var-name">Pointers:</span>
              <span className="var-rule">Bidirectional (.prev ⯇ and .next ➔)</span>
            </div>
          </>
        )}

        {type === 'circular-queue' && (
          <>
            <div className="var-badge">
              <span className="var-name">FRONT:</span>
              <span className="var-val highlight-front">Slot [{front}]</span>
            </div>
            <div className="var-badge">
              <span className="var-name">REAR:</span>
              <span className="var-val highlight-rear">Slot [{rear}]</span>
            </div>
            <div className="var-badge">
              <span className="var-name">Modulo Formula:</span>
              <span className="var-formula">rear = (rear + 1) % {capacity}</span>
            </div>
          </>
        )}

        {type === 'binary-heap' && (
          <>
            <div className="var-badge">
              <span className="var-name">Min Root [0]:</span>
              <span className="var-val highlight">{heap[0] ?? 'Empty'}</span>
            </div>
            <div className="var-badge">
              <span className="var-name">Heap Property:</span>
              <span className="var-rule">Parent ≤ Children</span>
            </div>
            <div className="var-badge">
              <span className="var-name">Formulas:</span>
              <span className="var-formula">parent = (i-1)//2, left = 2i+1, right = 2i+2</span>
            </div>
          </>
        )}

        {type === 'hash-table' && (
          <>
            <div className="var-badge">
              <span className="var-name">Hash Buckets:</span>
              <span className="var-val">{buckets.length} slots [0..4]</span>
            </div>
            <div className="var-badge">
              <span className="var-name">Collision Method:</span>
              <span className="var-rule">Separate Chaining (Linked Lists in Buckets)</span>
            </div>
          </>
        )}
      </div>
      )}

      {/* ── 3. Main Stage Canvas ── */}
      <div className="ds-viewport">
        {/* ========================================================
            1. REALISTIC 3D MECHANICAL STACK CHAMBER (LIFO)
            ======================================================== */}
        {type === 'stack' && (
          <div className="ds-realistic-stack-workspace">
            {/* Centered 3D Chamber Assembly */}
            <div className="stack-chamber-assembly">
              {/* Top Overhead Flight Deck / Gantry Area */}
              <div className="stack-3d-gantry-bay">
                <AnimatePresence mode="wait">
                  {incomingItem !== null && (
                    <motion.div
                      key={`incoming-${incomingItem}`}
                      className="stack-3d-flying-block push-incoming"
                      initial={{ y: -60, scale: 0.7, opacity: 0, rotateX: 35 }}
                      animate={{
                        y: 0,
                        scale: 1,
                        opacity: 1,
                        rotateX: 0,
                        transition: { type: 'spring', stiffness: 420, damping: 20 },
                      }}
                      exit={{
                        y: 80,
                        opacity: 0,
                        scale: 0.9,
                        transition: { duration: 0.18, ease: 'easeIn' },
                      }}
                    >
                      <div className="flying-block-top-bevel" />
                      <div className="flying-block-body">
                        <span className="flying-tag">⬇ INCOMING PUSH</span>
                        <span className="flying-val">{incomingItem}</span>
                      </div>
                      <div className="gravity-beam-guide" />
                    </motion.div>
                  )}

                  {action.startsWith('pop') && poppingItem !== null && (
                    <motion.div
                      key={`popping-${poppingItem}`}
                      className="stack-3d-flying-block pop-ejecting"
                      initial={{ y: 50, scale: 0.9, opacity: 0 }}
                      animate={{
                        y: 0,
                        scale: 1.08,
                        opacity: 1,
                        transition: { type: 'spring', stiffness: 380, damping: 18 },
                      }}
                      exit={{
                        y: -70,
                        scale: 0.75,
                        opacity: 0,
                        transition: { duration: 0.2, ease: 'easeOut' },
                      }}
                    >
                      <div className="flying-block-top-bevel gold-bevel" />
                      <div className="flying-block-body gold-body">
                        <span className="flying-tag gold-tag">⬆ POPPED (LIFO RETURN)</span>
                        <span className="flying-val gold-val">{poppingItem}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 3D Top Aperture Intake Funnel Mouth */}
              <div className="stack-3d-aperture-mouth">
                <div className="mouth-bevel-ring">
                  <div className="mouth-interior-glow" />
                  <div className="mouth-gate-badges">
                    <span className={`mouth-badge ${action.startsWith('push') ? 'active-push' : ''}`}>⬇ PUSH TOP</span>
                    <span className="mouth-dot">●</span>
                    <span className={`mouth-badge ${action.startsWith('pop') ? 'active-pop' : ''}`}>⬆ POP TOP</span>
                  </div>
                </div>
              </div>

              {/* 3D Volumetric Glass Chamber Shaft */}
              <div className="stack-3d-shaft-container">
                {/* 3D Fixed Vertical Slots [5..0] */}
                <div className="stack-3d-slots-stack">
                  {[5, 4, 3, 2, 1, 0].map(slotIdx => {
                    const isOccupied = slotIdx < items.length;
                    const item = isOccupied ? items[slotIdx] : null;
                    const isTop = slotIdx === topIndex;
                    const isPeeking = isTop && action === 'peek';
                    const isLifting = isTop && action === 'pop_lift';
                    const { id, val } = item ? getItemData(item, slotIdx) : {};
                    const memHex = `0x7FFEE${slotIdx}0`;

                    // Distinct metallic block colors per slot
                    const colorVariants = [
                      'brick-blue',
                      'brick-emerald',
                      'brick-violet',
                      'brick-amber',
                      'brick-cyan',
                      'brick-rose',
                    ];
                    const blockTheme = colorVariants[slotIdx % colorVariants.length];

                    return (
                      <div
                        key={slotIdx}
                        className={`stack-3d-slot-row ${isOccupied ? 'row-occupied' : 'row-empty'} ${isTop ? 'row-top' : ''}`}
                      >
                        {/* Left Ruler Tick */}
                        <div className="slot-3d-ruler-tag">
                          <span className="ruler-slot-label">[{slotIdx}]</span>
                          <div className={`ruler-slot-led ${isOccupied ? 'led-on' : ''}`} />
                        </div>

                        {/* Center: 3D Volumetric Block or Translucent Ghost Tray */}
                        <div className="slot-3d-stage-cell">
                          {isOccupied ? (
                            <motion.div
                              key={id}
                              layout
                              className={`stack-3d-volumetric-brick ${blockTheme} ${isTop ? 'is-top-brick' : ''} ${isPeeking ? 'is-peeking-brick' : ''} ${isLifting ? 'is-lifting-brick' : ''}`}
                              initial={{ y: -90, scale: 0.85, opacity: 0, rotateX: 20 }}
                              animate={{
                                y: isLifting ? -20 : 0,
                                scale: isLifting ? 1.05 : 1,
                                opacity: 1,
                                rotateX: 0,
                              }}
                              exit={{
                                y: -110,
                                scale: 0.8,
                                opacity: 0,
                                transition: { duration: 0.22, ease: 'easeInOut' },
                              }}
                              transition={{
                                type: 'spring',
                                stiffness: 500,
                                damping: 22,
                                mass: 0.9,
                              }}
                            >
                              {/* 3D Top Bevel Face */}
                              <div className="brick-top-facet">
                                <div className="brick-gloss-sheen" />
                              </div>

                              {/* 3D Front Face */}
                              <div className="brick-front-facet">
                                <div className="brick-meta-left">
                                  <span className="brick-slot-idx">SLOT {slotIdx}</span>
                                  <span className="brick-mem-addr">{memHex}</span>
                                </div>

                                <div className="brick-core-value">
                                  <span className="brick-value-text">{val}</span>
                                </div>

                                <div className="brick-meta-right">
                                  {isLifting ? (
                                    <span className="brick-status-pill pill-extracting">⚡ LIFT</span>
                                  ) : isPeeking ? (
                                    <span className="brick-status-pill pill-peeking">👁️ PEEK</span>
                                  ) : isTop ? (
                                    <span className="brick-status-pill pill-top">👉 TOP</span>
                                  ) : (
                                    <span className="brick-status-pill pill-locked">LOCKED</span>
                                  )}
                                </div>
                              </div>

                              {/* Peeking Laser Scanner Sweep */}
                              {isPeeking && (
                                <motion.div
                                  className="brick-scanner-beam"
                                  animate={{ left: ['-20%', '120%'] }}
                                  transition={{ duration: 0.85, repeat: Infinity, ease: 'easeInOut' }}
                                />
                              )}
                            </motion.div>
                          ) : (
                            <div className="stack-3d-empty-ghost-tray">
                              <span className="ghost-socket-notch">╌╌</span>
                              <span className="ghost-socket-text">Slot [{slotIdx}] Ready</span>
                              <span className="ghost-socket-notch">╌╌</span>
                            </div>
                          )}
                        </div>

                        {/* Right: Active TOP Pointer Caliper */}
                        <div className="slot-3d-pointer-col">
                          {isTop && (
                            <motion.div
                              className="stack-top-caliper-pointer"
                              initial={{ opacity: 0, x: -12, scale: 0.8 }}
                              animate={{ opacity: 1, x: 0, scale: 1 }}
                              transition={{ type: 'spring', stiffness: 480, damping: 20 }}
                            >
                              <span className="caliper-arrow">◀</span>
                              <span className="caliper-tag">TOP</span>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 3D Hydraulic Suspension Base & Parametric Coil Spring */}
                <motion.div
                  className="stack-3d-piston-assembly"
                  animate={{
                    y: Math.min(22, items.length * 3),
                  }}
                  transition={{ type: 'spring', stiffness: 350, damping: 18 }}
                >
                  <div className="piston-3d-top-plate">
                    <div className="piston-bolt-icon">🔩</div>
                    <span className="piston-plate-text">HYDRAULIC SUSPENSION BASE</span>
                    <div className="piston-bolt-icon">🔩</div>
                  </div>

                  <div className="piston-3d-spring-box">
                    <SpringCoilSVG
                      height={Math.max(28, 80 - items.length * 9)}
                      width={150}
                    />
                  </div>
                </motion.div>
              </div>

              {/* Heavy Pedestal Base */}
              <div className="stack-3d-pedestal-stand">
                <div className="pedestal-metal-slab" />
                <div className="pedestal-engraved-text">MEMORY BUFFER ALLOCATION BED</div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            2. QUEUE (FIFO - 3D Hyperloop Pneumatic Transit Tube)
            ======================================================== */}
        {type === 'queue' && (
          <div className="ds-3d-queue-workspace">
            {/* Top Operational Direction Guide */}
            <div className="queue-3d-header-ribbon">
              <div className="ribbon-exit-pill">
                <span className="ribbon-icon">🚪</span>
                <span className="ribbon-text-full">DEQUEUE (Leaves from FRONT)</span>
                <span className="ribbon-text-mobile">DEQUEUE (FRONT)</span>
              </div>
              <div className="ribbon-flow-text">
                <span className="flow-chevron">⬅</span>
                <span className="flow-label">FIFO TRANSIT</span>
                <span className="flow-chevron">⬅</span>
              </div>
              <div className="ribbon-entry-pill">
                <span className="ribbon-icon">📥</span>
                <span className="ribbon-text-full">ENQUEUE (Enters at REAR)</span>
                <span className="ribbon-text-mobile">ENQUEUE (REAR)</span>
              </div>
            </div>

            {/* Main 3D Hyperloop Chamber Tube Assembly */}
            <div className="queue-3d-transit-assembly">
              {/* Left: 3D Discharge / Dequeue Air-Lock Port */}
              <div className="queue-3d-port port-exit">
                <div className="port-arch-ring">
                  <div className="port-sign sign-exit">
                    <span className="port-sign-icon">🚪</span>
                    <span className="port-sign-text">EXIT</span>
                  </div>
                  <div className="port-laser-beam beam-exit" />
                </div>

                {/* Ejected Pod Flying Bay */}
                <div className="port-flying-bay">
                  <AnimatePresence>
                    {(action.startsWith('dequeue') || leavingItem !== null) && leavingItem !== null && (
                      <motion.div
                        key={`deq-${leavingItem}`}
                        className="flying-queue-pod pod-discharged"
                        initial={{ x: 20, scale: 0.9, opacity: 0 }}
                        animate={{
                          x: -12,
                          scale: 1.05,
                          opacity: 1,
                          transition: { type: 'spring', stiffness: 380, damping: 18 },
                        }}
                        exit={{
                          x: -40,
                          scale: 0.7,
                          opacity: 0,
                          transition: { duration: 0.2, ease: 'easeIn' },
                        }}
                      >
                        <div className="flying-pod-bevel gold-bevel" />
                        <div className="flying-pod-front gold-front">
                          <span className="flying-pod-tag">SERVED</span>
                          <span className="flying-pod-val">{leavingItem}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Central 3D Glass Transit Tube (Fixed 6 Docking Slots [0..5]) */}
              <div className="queue-3d-tube-chassis">
                <div className="queue-3d-tube-glass">
                  {/* Top Pointer Calipers Track */}
                  <div className="queue-3d-calipers-track">
                    {[0, 1, 2, 3, 4, 5].map(slotIdx => {
                      const isOccupied = slotIdx < items.length;
                      const isFront = isOccupied && slotIdx === 0;
                      const isRear = isOccupied && slotIdx === items.length - 1;

                      return (
                        <div key={slotIdx} className="caliper-slot-anchor">
                          {isFront && isRear && (
                            <motion.div
                              className="queue-caliper-badge badge-both"
                              initial={{ y: -6, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                            >
                              <span className="badge-text-full">FRONT & REAR ⬇</span>
                              <span className="badge-text-mobile">F & R ⬇</span>
                            </motion.div>
                          )}
                          {isFront && !isRear && (
                            <motion.div
                              className="queue-caliper-badge badge-front"
                              initial={{ y: -6, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                            >
                              <span className="badge-text-full">FRONT ⬇ [0]</span>
                              <span className="badge-text-mobile">FRONT ⬇</span>
                            </motion.div>
                          )}
                          {isRear && !isFront && (
                            <motion.div
                              className="queue-caliper-badge badge-rear"
                              initial={{ y: -6, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                            >
                              <span className="badge-text-full">REAR ⬇ [{slotIdx}]</span>
                              <span className="badge-text-mobile">REAR ⬇</span>
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Horizontal Pods Docking Grid (Fixed 6 Slots) */}
                  <div className="queue-3d-slots-track">
                    {[0, 1, 2, 3, 4, 5].map(slotIdx => {
                      const isOccupied = slotIdx < items.length;
                      const item = isOccupied ? items[slotIdx] : null;
                      const isFront = isOccupied && slotIdx === 0;
                      const isRear = isOccupied && slotIdx === items.length - 1;
                      const isPeeking = isFront && action === 'peek';
                      const isLeaving = isFront && action === 'dequeue_ready';
                      const { id, val } = item ? getItemData(item, slotIdx) : {};
                      const memHex = `0x7FFEE${slotIdx}0`;

                      // Distinct color theme per queue position
                      const podColors = [
                        'pod-emerald', // FRONT
                        'pod-cyan',
                        'pod-blue',
                        'pod-violet',
                        'pod-amber',
                        'pod-rose',
                      ];
                      const podTheme = podColors[slotIdx % podColors.length];

                      return (
                        <div key={slotIdx} className={`queue-3d-dock-slot ${isOccupied ? 'dock-occupied' : 'dock-empty'}`}>
                          {isOccupied ? (
                            <motion.div
                              key={id}
                              layout
                              className={`queue-3d-volumetric-pod ${podTheme} ${isFront ? 'is-front-pod' : ''} ${isRear ? 'is-rear-pod' : ''} ${isPeeking ? 'is-peeking-pod' : ''} ${isLeaving ? 'is-leaving-pod' : ''}`}
                              initial={{ x: 40, scale: 0.85, opacity: 0 }}
                              animate={{
                                x: isLeaving ? -8 : 0,
                                scale: isLeaving ? 1.05 : 1,
                                opacity: 1,
                              }}
                              exit={{
                                x: -40,
                                scale: 0.75,
                                opacity: 0,
                                transition: { duration: 0.2, ease: 'easeIn' },
                              }}
                              transition={{
                                type: 'spring',
                                stiffness: 460,
                                damping: 22,
                                mass: 0.9,
                              }}
                            >
                              {/* 3D Top Bevel Facet */}
                              <div className="pod-top-facet">
                                <div className="pod-gloss-sheen" />
                              </div>

                              {/* 3D Front Facet */}
                              <div className="pod-front-facet">
                                <div className="pod-meta-top">
                                  <span className="pod-pos-tag">#{slotIdx + 1}</span>
                                  <span className="pod-mem-addr">{memHex}</span>
                                </div>

                                <div className="pod-core-value">
                                  <span className="pod-val-num">{val}</span>
                                </div>

                                <div className="pod-meta-bottom">
                                  {isLeaving ? (
                                    <span className="pod-status-pill pill-dequeueing">⚡ DEQ</span>
                                  ) : isPeeking ? (
                                    <span className="pod-status-pill pill-peeking">👁️ PEEK</span>
                                  ) : isFront ? (
                                    <span className="pod-status-pill pill-front">FRONT</span>
                                  ) : isRear ? (
                                    <span className="pod-status-pill pill-rear">REAR</span>
                                  ) : (
                                    <span className="pod-status-pill pill-queued">IN LINE</span>
                                  )}
                                </div>
                              </div>

                              {/* Peeking Laser Scanner Sweep */}
                              {isPeeking && (
                                <motion.div
                                  className="pod-scanner-beam"
                                  animate={{ top: ['-20%', '120%'] }}
                                  transition={{ duration: 0.85, repeat: Infinity, ease: 'easeInOut' }}
                                />
                              )}
                            </motion.div>
                          ) : (
                            <div className="queue-3d-empty-dock">
                              <span className="empty-dock-idx">[{slotIdx}]</span>
                              <span className="empty-dock-dash">╌╌</span>
                              <span className="empty-dock-label">Dock</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* 3D Illuminated Runner Rails & Mag-Track */}
                  <div className="queue-3d-mag-rails">
                    <div className="mag-rail-line left-line" />
                    <div className="mag-track-pulses">
                      <span className="mag-text-full">• • • MAGNETIC CONVEYOR PROPULSION TRACK • • •</span>
                      <span className="mag-text-mobile">• • • MAGNETIC PROPULSION • • •</span>
                    </div>
                    <div className="mag-rail-line right-line" />
                  </div>
                </div>
              </div>

              {/* Right: 3D Ingestion / Enqueue Air-Lock Port */}
              <div className="queue-3d-port port-entry">
                <div className="port-arch-ring">
                  <div className="port-sign sign-entry">
                    <span className="port-sign-icon">📥</span>
                    <span className="port-sign-text">INTAKE</span>
                  </div>
                  <div className="port-laser-beam beam-entry" />
                </div>

                {/* Incoming Pod Flying Bay */}
                <div className="port-flying-bay">
                  <AnimatePresence>
                    {(action.startsWith('enqueue') || incomingItem !== null) && incomingItem !== null && (
                      <motion.div
                        key={`enq-${incomingItem}`}
                        className="flying-queue-pod pod-incoming"
                        initial={{ x: 40, scale: 0.8, opacity: 0 }}
                        animate={{
                          x: 0,
                          scale: 1,
                          opacity: 1,
                          transition: { type: 'spring', stiffness: 400, damping: 20 },
                        }}
                        exit={{
                          x: -20,
                          scale: 0.9,
                          opacity: 0,
                          transition: { duration: 0.18, ease: 'easeIn' },
                        }}
                      >
                        <div className="flying-pod-bevel cyan-bevel" />
                        <div className="flying-pod-front cyan-front">
                          <span className="flying-pod-tag">INCOMING</span>
                          <span className="flying-pod-val">{incomingItem}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Heavy Base Stand for Queue Chassis */}
            <div className="queue-3d-base-pedestal">
              <div className="queue-pedestal-bar" />
              <div className="queue-pedestal-sub">PNEUMATIC LINEAR MEMORY REGISTER</div>
            </div>
          </div>
        )}

        {/* ========================================================
            3. SINGLY LINKED LIST (Memory Addresses & Pointer Cables)
            ======================================================== */}
        {type === 'linked-list' && (
          <div className="ds-clean-ll-stage">
            <div className="ll-track-wrapper">
              <div className="ll-chain-row">
                <AnimatePresence initial={false}>
                  {nodes.length === 0 ? (
                    <div className="ds-stage-empty-state">
                      <span className="empty-title">Linked List is Empty</span>
                      <span className="empty-sub">HEAD points to NULL</span>
                    </div>
                  ) : (
                    nodes.map((node, idx) => {
                      const isHead = idx === 0;
                      const isActive = node.id === activeNodeId;
                      const isTraversing = node.id === traversingId;
                      const val = node.data ?? node.val ?? node;
                      const keyId = node.id || `node-${idx}-${val}`;
                      const memoryAddress = `0x${(1024 + idx * 32).toString(16).toUpperCase()}`;

                      return (
                        <div key={keyId} className="ll-node-unit">
                          {/* Node Card */}
                          <div className="ll-node-wrapper">
                            {isHead && (
                              <div className="floating-ptr-badge ptr-head">
                                <span>HEAD ⬇</span>
                              </div>
                            )}
                            {isTraversing && (
                              <div className="floating-ptr-badge ptr-curr">
                                <span>curr ⬇</span>
                              </div>
                            )}

                            <motion.div
                              layout
                              className={`ll-node-card ${isHead ? 'node-is-head' : ''} ${isActive ? 'node-is-active' : ''} ${isTraversing ? 'node-is-traversing' : ''}`}
                              initial={{ scale: 0.85, opacity: 0, y: 15 }}
                              animate={{ scale: 1, opacity: 1, y: 0 }}
                              exit={{ scale: 0.8, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="node-mem-bar">
                                <span>{memoryAddress}</span>
                              </div>

                              <div className="node-content-row">
                                <div className="node-data-slot">
                                  <span className="slot-lbl">DATA</span>
                                  <span className="slot-val">{val}</span>
                                </div>

                                <div className="node-next-slot">
                                  <span className="slot-lbl">NEXT</span>
                                  <span className="slot-dot">•</span>
                                </div>
                              </div>
                            </motion.div>
                          </div>

                          {/* Arrow Cable */}
                          <div className="ll-arrow-connector">
                            <svg width="48" height="20" viewBox="0 0 48 20" fill="none">
                              <path
                                d="M 2 10 L 40 10 M 34 4 L 42 10 L 34 16"
                                stroke={isTraversing ? '#f43f5e' : '#38bdf8'}
                                strokeWidth={isTraversing ? '2.5' : '2'}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        </div>
                      );
                    })
                  )}
                </AnimatePresence>

                <div className="ll-null-badge">
                  <span className="null-symbol">⏚</span>
                  <span className="null-word">NULL</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            4. DOUBLY LINKED LIST (True Bidirectional Cables)
            ======================================================== */}
        {type === 'doubly-linked-list' && (
          <div className="ds-clean-dll-stage">
            <div className="dll-track-wrapper">
              <div className="dll-chain-row">
                {/* Left NULL Terminal */}
                <div className="dll-null-box">
                  <span className="null-symbol">⏚</span>
                  <span className="null-word">NULL</span>
                </div>

                {/* Left Terminal Arrow: Node 0 .prev ➔ Left NULL */}
                <div className="dll-terminal-arrow">
                  <svg width="36" height="16" viewBox="0 0 36 16" fill="none">
                    <path
                      d="M 34 8 L 4 8 M 10 3 L 2 8 L 10 13"
                      stroke="#a855f7"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {/* Node Chain */}
                <AnimatePresence initial={false}>
                  {nodes.map((node, idx) => {
                    const isHead = node.id === headId || idx === 0;
                    const isTail = node.id === tailId || idx === nodes.length - 1;
                    const isActive = node.id === activeNodeId;
                    const isTraversing = node.id === traversingId;
                    const val = node.data ?? node.val ?? node;
                    const memAddr = `0x${(2048 + idx * 32).toString(16).toUpperCase()}`;

                    return (
                      <React.Fragment key={node.id || idx}>
                        <div className="dll-node-unit">
                          <div className="dll-node-wrapper">
                            {isHead && (
                              <div className="floating-ptr-badge ptr-head">
                                <span>HEAD ⬇</span>
                              </div>
                            )}
                            {isTail && (
                              <div className="floating-ptr-badge ptr-tail">
                                <span>TAIL ⬇</span>
                              </div>
                            )}
                            {isTraversing && (
                              <div className="floating-ptr-badge ptr-curr">
                                <span>{direction === 'backward' ? '⯇ curr' : 'curr ⯈'}</span>
                              </div>
                            )}

                            <motion.div
                              layout
                              className={`dll-node-card ${isHead ? 'node-is-head' : ''} ${isTail ? 'node-is-tail' : ''} ${isActive ? 'node-is-active' : ''} ${isTraversing ? 'node-is-traversing' : ''}`}
                              initial={{ scale: 0.85, opacity: 0, y: 15 }}
                              animate={{ scale: 1, opacity: 1, y: 0 }}
                              exit={{ scale: 0.8, opacity: 0 }}
                            >
                              <div className="node-mem-bar">
                                <span>{memAddr}</span>
                              </div>

                              <div className="dll-content-row">
                                <div className={`dll-slot-prev ${isTraversing && direction === 'backward' ? 'slot-active-prev' : ''}`}>
                                  <span className="slot-mini-lbl">PREV</span>
                                  <span className="slot-dot">⯇</span>
                                </div>

                                <div className="dll-slot-data">
                                  <span className="slot-mini-lbl">DATA</span>
                                  <span className="dll-val">{val}</span>
                                </div>

                                <div className={`dll-slot-next ${isTraversing && direction === 'forward' ? 'slot-active-next' : ''}`}>
                                  <span className="slot-mini-lbl">NEXT</span>
                                  <span className="slot-dot">⯈</span>
                                </div>
                              </div>
                            </motion.div>
                          </div>
                        </div>

                        {/* Bidirectional Twin Cables between nodes */}
                        {idx < nodes.length - 1 && (
                          <div className="dll-cables-connector">
                            {/* Top Cable: .next (Blue) */}
                            <div className="cable-line cable-next">
                              <svg width="44" height="14" viewBox="0 0 44 14" fill="none">
                                <path
                                  d="M 2 7 L 36 7 M 30 2 L 38 7 L 30 12"
                                  stroke={isTraversing && direction === 'forward' ? '#38bdf8' : '#38bdf8'}
                                  strokeWidth={isTraversing && direction === 'forward' ? '2.5' : '1.8'}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <span className="cable-lbl lbl-next">.next</span>
                            </div>

                            {/* Bottom Cable: .prev (Purple) */}
                            <div className="cable-line cable-prev">
                              <svg width="44" height="14" viewBox="0 0 44 14" fill="none">
                                <path
                                  d="M 42 7 L 8 7 M 14 2 L 6 7 L 14 12"
                                  stroke={isTraversing && direction === 'backward' ? '#c084fc' : '#a855f7'}
                                  strokeWidth={isTraversing && direction === 'backward' ? '2.5' : '1.8'}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <span className="cable-lbl lbl-prev">.prev</span>
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </AnimatePresence>

                {/* Right Terminal Arrow: Tail .next ➔ Right NULL */}
                <div className="dll-terminal-arrow">
                  <svg width="36" height="16" viewBox="0 0 36 16" fill="none">
                    <path
                      d="M 2 8 L 32 8 M 26 3 L 34 8 L 26 13"
                      stroke="#38bdf8"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {/* Right NULL Terminal */}
                <div className="dll-null-box">
                  <span className="null-symbol">⏚</span>
                  <span className="null-word">NULL</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            5. CIRCULAR QUEUE (Dual Ring + Array Representation)
            ======================================================== */}
        {type === 'circular-queue' && (
          <div className="ds-clean-cqueue-stage">
            {/* Top: Modulo Wrap Equation Card */}
            <div className="cqueue-equation-card">
              <div className="eq-header">
                <span className="eq-icon">🔄</span>
                <span className="eq-title">MODULO WRAP-AROUND MECHANISM</span>
              </div>
              <div className="eq-body">
                <div className="eq-pill">
                  <span className="eq-pill-label">Next REAR:</span>
                  <span className="eq-pill-val">
                    ({rear >= 0 ? rear : 0} + 1) % {capacity} = <strong>{rear >= 0 ? (rear + 1) % capacity : 0}</strong>
                  </span>
                </div>
                <div className="eq-pill">
                  <span className="eq-pill-label">Next FRONT:</span>
                  <span className="eq-pill-val">
                    ({front >= 0 ? front : 0} + 1) % {capacity} = <strong>{front >= 0 ? (front + 1) % capacity : 0}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Middle: 360° Radial Clock Dial */}
            <div className="cqueue-radial-assembly">
              {/* Circular Orbit Track with Clockwise Flow Indicators */}
              <svg className="cqueue-orbit-svg" viewBox="0 0 360 360">
                <circle cx="180" cy="180" r="130" fill="none" stroke="rgba(56, 189, 248, 0.15)" strokeWidth="2" strokeDasharray="6 6" />
                <path d="M 310 180 A 130 130 0 0 1 180 310" fill="none" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="2" />
                <polygon points="180,314 172,306 188,306" fill="#38bdf8" />
              </svg>

              {/* Central Circular Dial Hub */}
              <div className="cqueue-center-hub">
                <div className="hub-inner-core">
                  <span className="hub-core-title">RING BUFFER</span>
                  <span className="hub-core-formula">Capacity: {capacity}</span>
                  <span className="hub-flow-dir">↻ CLOCKWISE ↻</span>
                </div>

                {/* Rotating Needle Indicators */}
                {front >= 0 && (
                  <div
                    className="hub-needle needle-front"
                    style={{ transform: `rotate(${getSlotAngle(front) + 90}deg)` }}
                  >
                    <span className="needle-head front-head">FRONT</span>
                  </div>
                )}

                {rear >= 0 && (
                  <div
                    className="hub-needle needle-rear"
                    style={{ transform: `rotate(${getSlotAngle(rear) + 90}deg)` }}
                  >
                    <span className="needle-head rear-head">REAR</span>
                  </div>
                )}
              </div>

              {/* 6 Radial Circular Slots */}
              <div className="cqueue-slots-radial-ring">
                {slots.map((val, idx) => {
                  const isFront = idx === front;
                  const isRear = idx === rear;
                  const isOccupied = val !== null;
                  const angle = getSlotAngle(idx);
                  const radius = 130; // px
                  const rad = (angle * Math.PI) / 180;
                  const x = Math.cos(rad) * radius;
                  const y = Math.sin(rad) * radius;

                  return (
                    <motion.div
                      key={idx}
                      className={`cqueue-radial-slot ${isOccupied ? 'radial-occupied' : 'radial-empty'} ${isFront ? 'radial-front' : ''} ${isRear ? 'radial-rear' : ''}`}
                      style={{
                        transform: `translate(${x}px, ${y}px)`,
                      }}
                      animate={{ scale: isFront || isRear ? 1.08 : 1 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                    >
                      {isFront && isRear && (
                        <span className="radial-badge-float badge-both">FRONT & REAR</span>
                      )}
                      {isFront && !isRear && (
                        <span className="radial-badge-float badge-front">▲ FRONT</span>
                      )}
                      {isRear && !isFront && (
                        <span className="radial-badge-float badge-rear">▲ REAR</span>
                      )}

                      <span className="radial-slot-idx">Slot [{idx}]</span>
                      <span className="radial-slot-val">{isOccupied ? val : '—'}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Bottom: Synchronized Linear Memory Strip with Wrap-Around Cable */}
            <div className="cqueue-linear-strip-wrapper">
              <div className="linear-strip-header">
                <span className="strip-title">PHYSICAL MEMORY ARRAY VIEW:</span>
                <span className="strip-subtitle">Demonstrates how slot [5] wraps around to slot [0] in fixed contiguous memory</span>
              </div>

              <div className="cqueue-linear-grid">
                {slots.map((val, idx) => {
                  const isFront = idx === front;
                  const isRear = idx === rear;
                  const isOccupied = val !== null;

                  return (
                    <div
                      key={idx}
                      className={`cqueue-linear-cell ${isOccupied ? 'cell-occupied' : 'cell-empty'} ${isFront ? 'cell-front' : ''} ${isRear ? 'cell-rear' : ''}`}
                    >
                      <div className="linear-cell-header">
                        <span className="cell-idx">[{idx}]</span>
                        {isFront && <span className="cell-tag tag-front">FRONT</span>}
                        {isRear && <span className="cell-tag tag-rear">REAR</span>}
                      </div>
                      <div className="linear-cell-val">{isOccupied ? val : '—'}</div>
                    </div>
                  );
                })}
              </div>

              <div className="linear-wrap-cable">
                <svg width="100%" height="24" viewBox="0 0 400 24" fill="none" preserveAspectRatio="none">
                  <path
                    d="M 370 4 C 370 20, 30 20, 30 4"
                    stroke="#fbbf24"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                  <polygon points="30,2 25,10 35,10" fill="#fbbf24" />
                </svg>
                <span className="wrap-cable-label">↻ WRAP-AROUND LOOP: (rear + 1) % 6 ↻</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            6. BINARY HEAP (Dual Representation: Array + SVG Connected Tree)
            ======================================================== */}
        {type === 'binary-heap' && (
          <div className="ds-clean-heap-stage">
            {/* Top: Contiguous Array Representation */}
            <div className="heap-array-section">
              <div className="heap-array-header">
                <span className="section-title-tag">CONTIGUOUS ARRAY REPRESENTATION</span>
                <span className="heap-formula-tag font-mono">parent(i) = (i-1)//2 • left = 2i+1 • right = 2i+2</span>
              </div>

              <div className="heap-array-strip">
                {heap.length === 0 ? (
                  <div className="ds-stage-empty-state">
                    <span className="empty-title">Heap is Empty</span>
                    <span className="empty-sub">Push elements to build the Min-Heap</span>
                  </div>
                ) : (
                  heap.map((val, idx) => {
                    const isRoot = idx === 0;
                    const isHighlighted = highlightIndices.includes(idx);
                    const isSwapping = swapIndices.includes(idx);

                    return (
                      <motion.div
                        key={idx}
                        layout
                        className={`heap-cell-box ${isRoot ? 'cell-is-root' : ''} ${isHighlighted ? 'cell-highlighted' : ''} ${isSwapping ? 'cell-swapping' : ''}`}
                      >
                        <span className="heap-cell-idx">[{idx}]</span>
                        <span className="heap-cell-val font-mono">{val}</span>
                        {isRoot && <span className="heap-root-tag">MIN ROOT</span>}
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Bottom: Visual Binary Tree Canvas with Dynamic SVG Connecting Branches */}
            <div className="heap-tree-section">
              <div className="heap-tree-header">
                <span className="section-title-tag">COMPLETE BINARY TREE HIERARCHY (Min-Heap Property: Parent ≤ Children)</span>
                <span className="heap-property-pill">ROOT = MINIMUM (O(1) PEEK)</span>
              </div>

              <div className="heap-tree-canvas-wrapper">
                {heap.length === 0 ? (
                  <div className="ds-stage-empty-state">
                    <span className="empty-icon">🌳</span>
                    <span className="empty-title">Empty Min-Heap Tree</span>
                    <span className="empty-sub">Step through execution to see nodes bubble up via Sift-Up</span>
                  </div>
                ) : (
                  <div className="heap-tree-stage-canvas">
                    {/* SVG Connecting Branch Lines */}
                    <svg className="heap-tree-svg-branches" viewBox="0 0 700 280">
                      {heap.map((_, idx) => {
                        if (idx === 0) return null;
                        const parentIdx = Math.floor((idx - 1) / 2);

                        // Coordinates calculation
                        const getPos = (i) => {
                          const level = Math.floor(Math.log2(i + 1));
                          const count = Math.pow(2, level);
                          const pos = i - (count - 1);
                          const y = 36 + level * 72;
                          const sectionWidth = 700 / count;
                          const x = sectionWidth * (pos + 0.5);
                          return { x, y };
                        };

                        const pPos = getPos(parentIdx);
                        const cPos = getPos(idx);

                        const isBranchActive =
                          (highlightIndices.includes(idx) && highlightIndices.includes(parentIdx)) ||
                          (swapIndices.includes(idx) && swapIndices.includes(parentIdx));

                        return (
                          <g key={`branch-${idx}`}>
                            <line
                              x1={pPos.x}
                              y1={pPos.y}
                              x2={cPos.x}
                              y2={cPos.y}
                              stroke={isBranchActive ? '#38bdf8' : 'rgba(255, 255, 255, 0.18)'}
                              strokeWidth={isBranchActive ? '3' : '1.8'}
                              strokeDasharray={isBranchActive ? 'none' : '3 3'}
                            />
                          </g>
                        );
                      })}
                    </svg>

                    {/* Dynamic Tree Node Discs */}
                    <div className="heap-tree-nodes-layer">
                      {heap.map((val, idx) => {
                        const level = Math.floor(Math.log2(idx + 1));
                        const count = Math.pow(2, level);
                        const pos = idx - (count - 1);
                        const y = 36 + level * 72;
                        const sectionWidth = 700 / count;
                        const x = sectionWidth * (pos + 0.5);

                        const isRoot = idx === 0;
                        const isHighlighted = highlightIndices.includes(idx);
                        const isSwapping = swapIndices.includes(idx);

                        return (
                          <motion.div
                            key={idx}
                            layout
                            className={`tree-node-circle ${isRoot ? 'node-is-root' : ''} ${isHighlighted ? 'node-highlight' : ''} ${isSwapping ? 'node-swapping' : ''}`}
                            style={{
                              left: `${x}px`,
                              top: `${y}px`,
                              transform: 'translate(-50%, -50%)',
                              position: 'absolute',
                            }}
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: isSwapping ? 1.15 : isHighlighted ? 1.08 : 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                          >
                            <span className="node-idx-sub">[{idx}]</span>
                            <span className="node-val font-mono">{val}</span>
                            {isRoot && <span className="tree-root-crown">MIN ROOT</span>}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            7. HASH TABLE (Collision Resolution with Chaining)
            ======================================================== */}
        {type === 'hash-table' && (
          <div className="ds-clean-hash-stage">
            {hashComputation && (
              <div className="hash-calc-banner">
                <span className="calc-icon">⚡ HASH COMPUTATION:</span>
                <span className="calc-text">{hashComputation}</span>
              </div>
            )}

            <div className="hash-buckets-container">
              {buckets.map((bucket, bIdx) => {
                const isActive = bIdx === activeBucketIdx;

                return (
                  <div
                    key={bIdx}
                    className={`hash-bucket-row ${isActive ? 'bucket-is-active' : ''}`}
                  >
                    <div className="bucket-index-tag">
                      <span className="tag-label">Bucket</span>
                      <span className="tag-num">[{bIdx}]</span>
                    </div>

                    <div className="bucket-chain-list">
                      {bucket.length === 0 ? (
                        <span className="bucket-empty-tag">empty ⏚</span>
                      ) : (
                        bucket.map((entry, eIdx) => (
                          <React.Fragment key={eIdx}>
                            <motion.div
                              layout
                              className="hash-entry-card"
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                            >
                              <span className="entry-key">"{entry.key}"</span>
                              <span className="entry-colon">:</span>
                              <span className="entry-val">{entry.val}</span>
                            </motion.div>

                            {eIdx < bucket.length - 1 && (
                              <span className="chain-link-arrow">➔</span>
                            )}
                          </React.Fragment>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
