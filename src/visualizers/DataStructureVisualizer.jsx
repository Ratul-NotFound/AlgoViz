// src/visualizers/DataStructureVisualizer.jsx — Interactive, Conceptually Synced Data Structure Visualizer

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playImpactSound, playLiftSound, playChimeSound, toggleMute, getIsMuted } from '../utils/audioFX';

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
    message = '',
  } = frame || {};

  // Audio cues
  useEffect(() => {
    if (!action || action === 'idle') return;
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
  }, [action, items.length, nodes.length, heap.length]);

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

  const getSlotAngle = (idx, total = 6) => {
    return (idx * (360 / total)) - 90;
  };

  return (
    <div className="ds-viz-main">
      {/* ── 1. Synced Concept & Operation Header ── */}
      <div className={`ds-status-bar ds-status-${action}`}>
        <div className="ds-action-badge">
          {action.startsWith('push') && '⬇ PUSH (LIFO)'}
          {action.startsWith('pop') && '⬆ POP (LIFO)'}
          {action === 'peek' && '🔍 PEEK (TOP ELEMENT)'}
          {action.startsWith('enqueue') && '📥 ENQUEUE (FIFO)'}
          {action.startsWith('dequeue') && '📤 DEQUEUE (FIFO)'}
          {action.startsWith('insert_head') && '➕ INSERT AT HEAD (O(1))'}
          {action.startsWith('insert_tail') && '➕ INSERT AT TAIL (O(1))'}
          {action.startsWith('append') && '➕ APPEND TO TAIL'}
          {action.startsWith('insert') && '➕ INSERT ELEMENT'}
          {action === 'traverse' && (direction === 'backward' ? '⬅ BACKWARD TRAVERSAL' : '➔ FORWARD TRAVERSAL')}
          {action.startsWith('sift_up') && '🔼 SIFT UP (BUBBLE UP)'}
          {action.startsWith('sift_down') && '🔽 SIFT DOWN (BUBBLE DOWN)'}
          {action.startsWith('extract_min') && '⭐ EXTRACT MIN (O(log n))'}
          {action === 'collision' && '⚠️ HASH COLLISION (SEPARATE CHAINING)'}
          {action === 'lookup' && '⚡ HASH LOOKUP (O(1) AVERAGE)'}
          {action === 'idle' && 'READY'}
          {action === 'complete' && 'COMPLETED'}
        </div>

        <div className="ds-action-text">{message || 'Step through the animation to inspect memory operations'}</div>

        <button
          className="ds-sound-toggle-btn"
          onClick={handleToggleSound}
          title={muted ? 'Enable Sound FX' : 'Mute Sound FX'}
        >
          {muted ? '🔇 Sound: Off' : '🔊 Sound: On'}
        </button>
      </div>

      {/* ── 2. Live Pointer & Variable Dashboard ── */}
      <div className="ds-variables-dashboard">
        {type === 'stack' && (
          <>
            <div className="var-badge">
              <span className="var-name">top index:</span>
              <span className="var-val highlight">{topIndex >= 0 ? `[${topIndex}]` : '-1 (Empty)'}</span>
            </div>
            <div className="var-badge">
              <span className="var-name">stack[top]:</span>
              <span className="var-val">{topIndex >= 0 && items[topIndex] ? getItemData(items[topIndex], topIndex).val : 'null'}</span>
            </div>
            <div className="var-badge">
              <span className="var-name">Rule:</span>
              <span className="var-rule">LIFO (Push/Pop at TOP only)</span>
            </div>
          </>
        )}

        {type === 'queue' && (
          <>
            <div className="var-badge">
              <span className="var-name">front index:</span>
              <span className="var-val highlight-front">{items.length > 0 ? '[0]' : '-1'}</span>
            </div>
            <div className="var-badge">
              <span className="var-name">rear index:</span>
              <span className="var-val highlight-rear">{items.length > 0 ? `[${items.length - 1}]` : '-1'}</span>
            </div>
            <div className="var-badge">
              <span className="var-name">Rule:</span>
              <span className="var-rule">FIFO (Enqueue at REAR, Dequeue at FRONT)</span>
            </div>
          </>
        )}

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

      {/* ── 3. Main Stage Canvas ── */}
      <div className="ds-viewport">
        {/* ========================================================
            1. STACK (LIFO - Vertical Spring Dispenser Well)
            ======================================================== */}
        {type === 'stack' && (
          <div className="ds-clean-stack-stage">
            <div className="stack-aperture-guide">
              <span className="flow-pill flow-in">⬇ PUSH (Enters at TOP)</span>
              <span className="flow-pill flow-out">⬆ POP (Leaves from TOP)</span>
            </div>

            {/* Vertical Glass Column Container */}
            <div className="stack-glass-column">
              <div className="stack-column-inner">
                <AnimatePresence initial={false}>
                  {items.length === 0 ? (
                    <div className="ds-stage-empty-state">
                      <span className="empty-icon">📭</span>
                      <span className="empty-title">Stack is Empty</span>
                      <span className="empty-sub">top = -1. Push an item to start.</span>
                    </div>
                  ) : (
                    [...items].reverse().map((item, revIdx) => {
                      const actualIdx = items.length - 1 - revIdx;
                      const isTop = actualIdx === topIndex;
                      const { id, val } = getItemData(item, actualIdx);

                      return (
                        <motion.div
                          key={id}
                          layout
                          className={`stack-card-tile ${isTop ? 'tile-is-top' : ''}`}
                          initial={{ y: -90, opacity: 0, scale: 0.9 }}
                          animate={{ y: 0, opacity: 1, scale: 1 }}
                          exit={{
                            y: -100,
                            opacity: 0,
                            scale: 0.85,
                            transition: { duration: 0.22, ease: 'easeOut' },
                          }}
                          transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                        >
                          <div className="tile-slot-pill">Slot [{actualIdx}]</div>
                          <div className="tile-value">{val}</div>

                          {isTop && (
                            <motion.div
                              className="stack-top-badge"
                              layoutId="stack-top-pointer"
                              transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                            >
                              <span className="badge-arrow">👈</span>
                              <span className="badge-label">TOP OF STACK (idx: {actualIdx})</span>
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })
                  )}
                </AnimatePresence>
              </div>

              {/* Physical Spring Dispenser Base */}
              <div className="stack-spring-base">
                <div className="spring-plate">DISPENSER WELL BASE</div>
                <div className="spring-coils-line">~~~~~</div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            2. QUEUE (FIFO - Checkout Service Counter Lane)
            ======================================================== */}
        {type === 'queue' && (
          <div className="ds-clean-queue-stage">
            {/* Top: FIFO Principle & Gate Direction Bar */}
            <div className="queue-direction-bar">
              <div className="flow-end-box exit-box">
                <span className="flow-tag">🚪 SERVICE COUNTER / DEQUEUE</span>
                <span className="flow-sub">1st arrived is 1st served (FIFO)</span>
              </div>

              <div className="flow-arrow-indicator">
                <span className="animated-flow-text">⬅ ⬅ QUEUE PROGRESSION ⬅ ⬅</span>
              </div>

              <div className="flow-end-box entry-box">
                <span className="flow-tag">📥 INTAKE GATE / ENQUEUE</span>
                <span className="flow-sub">New arrivals join at the back</span>
              </div>
            </div>

            {/* Service Lane with Physical Entry & Exit Gates */}
            <div className="queue-lane-wrapper">
              {/* Left Exit / Service Counter Gate */}
              <div className="queue-gate-post exit-gate-post">
                <div className="gate-sign sign-exit">
                  <span className="gate-icon">🚪</span>
                  <span className="gate-label">EXIT / SERVED</span>
                </div>
                <div className="gate-beam beam-exit" />
              </div>

              {/* Central Queue Track */}
              <div className="queue-glass-track">
                <div className="queue-track-inner">
                  <AnimatePresence initial={false}>
                    {items.length === 0 ? (
                      <div className="ds-stage-empty-state">
                        <span className="empty-icon">📭</span>
                        <span className="empty-title">Queue is Empty</span>
                        <span className="empty-sub">front = -1, rear = -1. Waiting for new arrivals at REAR.</span>
                      </div>
                    ) : (
                      items.map((item, idx) => {
                        const isFront = idx === 0;
                        const isRear = idx === items.length - 1;
                        const { id, val } = getItemData(item, idx);

                        return (
                          <div key={id} className="queue-item-slot-wrapper">
                            {/* Floating Pointers */}
                            {isFront && isRear && (
                              <div className="queue-float-ptr ptr-both">
                                <span>FRONT & REAR ⬇</span>
                              </div>
                            )}
                            {isFront && !isRear && (
                              <div className="queue-float-ptr ptr-front">
                                <span>FRONT ⬇ (1st to Serve)</span>
                              </div>
                            )}
                            {isRear && !isFront && (
                              <div className="queue-float-ptr ptr-rear">
                                <span>REAR ⬇ (Back of Line)</span>
                              </div>
                            )}

                            <motion.div
                              layout
                              className={`queue-card-tile ${isFront ? 'tile-is-front' : ''} ${isRear ? 'tile-is-rear' : ''}`}
                              initial={{ x: 100, opacity: 0, scale: 0.88 }}
                              animate={{ x: 0, opacity: 1, scale: 1 }}
                              exit={{
                                x: -100,
                                opacity: 0,
                                scale: 0.85,
                                transition: { duration: 0.22, ease: 'easeIn' },
                              }}
                              transition={{ type: 'spring', stiffness: 360, damping: 24 }}
                            >
                              <div className="queue-tile-header">
                                <span className="tile-pos-badge">Pos #{idx + 1}</span>
                                <span className="tile-idx-sub">idx: [{idx}]</span>
                              </div>
                              <div className="tile-value">{val}</div>
                            </motion.div>
                          </div>
                        );
                      })
                    )}
                  </AnimatePresence>
                </div>

                {/* Floor Flow Guideline */}
                <div className="queue-floor-track">
                  <span className="floor-guideline">----------------------- ➔ FLOW TOWARDS SERVICE DESK -----------------------</span>
                </div>
              </div>

              {/* Right Entry / Intake Gate */}
              <div className="queue-gate-post entry-gate-post">
                <div className="gate-sign sign-entry">
                  <span className="gate-icon">📥</span>
                  <span className="gate-label">INTAKE / ENQUEUE</span>
                </div>
                <div className="gate-beam beam-entry" />
              </div>
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
            6. BINARY HEAP (Dual Representation: Array + Tree)
            ======================================================== */}
        {type === 'binary-heap' && (
          <div className="ds-clean-heap-stage">
            {/* Top: Contiguous Array View */}
            <div className="heap-array-section">
              <div className="section-title-tag">ARRAY REPRESENTATION</div>
              <div className="heap-array-strip">
                {heap.map((val, idx) => {
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
                      <span className="heap-cell-val">{val}</span>
                      {isRoot && <span className="heap-root-tag">MIN ROOT</span>}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Bottom: Visual Binary Tree */}
            <div className="heap-tree-section">
              <div className="section-title-tag">BINARY TREE HIERARCHY (Min-Heap Property: Parent ≤ Children)</div>
              <div className="heap-tree-levels">
                {/* Level 0: Root */}
                {heap.length > 0 && (
                  <div className="tree-level level-0">
                    <div className={`tree-node-circle ${highlightIndices.includes(0) ? 'node-highlight' : ''}`}>
                      <span className="node-idx-sub">[0]</span>
                      <span className="node-val">{heap[0]}</span>
                    </div>
                  </div>
                )}

                {/* Level 1 */}
                {heap.length > 1 && (
                  <div className="tree-level level-1">
                    {[1, 2].map(idx => (
                      idx < heap.length ? (
                        <div
                          key={idx}
                          className={`tree-node-circle ${highlightIndices.includes(idx) ? 'node-highlight' : ''}`}
                        >
                          <span className="node-idx-sub">[{idx}]</span>
                          <span className="node-val">{heap[idx]}</span>
                        </div>
                      ) : null
                    ))}
                  </div>
                )}

                {/* Level 2 */}
                {heap.length > 3 && (
                  <div className="tree-level level-2">
                    {[3, 4, 5, 6].map(idx => (
                      idx < heap.length ? (
                        <div
                          key={idx}
                          className={`tree-node-circle ${highlightIndices.includes(idx) ? 'node-highlight' : ''}`}
                        >
                          <span className="node-idx-sub">[{idx}]</span>
                          <span className="node-val">{heap[idx]}</span>
                        </div>
                      ) : null
                    ))}
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
