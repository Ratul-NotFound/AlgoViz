// src/visualizers/DataStructureVisualizer.jsx — Universal Sleek Data Structure Visualizer

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
    message = '',
  } = frame || {};

  // Play subtle sound on operation
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

  return (
    <div className="ds-viz-main">
      {/* ── Action Header Banner ── */}
      <div className={`ds-status-bar ds-status-${action}`}>
        <div className="ds-action-badge">
          {action.startsWith('push') && 'PUSH (LIFO)'}
          {action.startsWith('pop') && 'POP (LIFO)'}
          {action === 'peek' && 'PEEK (INSPECT)'}
          {action.startsWith('enqueue') && 'ENQUEUE'}
          {action.startsWith('dequeue') && 'DEQUEUE'}
          {action.startsWith('insert_head') && 'INSERT HEAD (O(1))'}
          {action.startsWith('insert_tail') && 'INSERT TAIL (O(1))'}
          {action.startsWith('insert') && 'INSERT'}
          {action === 'traverse' && (direction === 'backward' ? 'BACKWARD TRAVERSE ⬅' : 'FORWARD TRAVERSE ➔')}
          {action.startsWith('sift_up') && 'SIFT UP (BUBBLE)'}
          {action.startsWith('sift_down') && 'SIFT DOWN (BUBBLE)'}
          {action.startsWith('extract_min') && 'EXTRACT MIN (O(log n))'}
          {action === 'collision' && 'COLLISION DETECTED'}
          {action === 'lookup' && 'O(1) HASH LOOKUP'}
          {action === 'idle' && 'READY'}
          {action === 'complete' && 'COMPLETED'}
        </div>
        <div className="ds-action-text">{message || 'Step through the animation to inspect operations'}</div>

        <button
          className="ds-sound-toggle-btn"
          onClick={handleToggleSound}
          title={muted ? 'Enable Sound FX' : 'Mute Sound FX'}
        >
          {muted ? '🔇 Sound: Off' : '🔊 Sound: On'}
        </button>
      </div>

      {/* ── Main Canvas Viewport ── */}
      <div className="ds-viewport">
        {/* 1. STACK (LIFO) */}
        {type === 'stack' && (
          <div className="ds-clean-stack-stage">
            <div className="stack-flow-guide">
              <span className="flow-pill flow-in">⬇ PUSH (Top Entry)</span>
              <span className="flow-pill flow-out">⬆ POP (Top Exit)</span>
            </div>

            <div className="stack-glass-column">
              <div className="stack-column-inner">
                <AnimatePresence initial={false}>
                  {items.length === 0 ? (
                    <div className="ds-stage-empty-state">
                      <span className="empty-title">Stack is Empty</span>
                      <span className="empty-sub">Push elements to build the stack</span>
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
                          initial={{ y: -80, opacity: 0, scale: 0.92 }}
                          animate={{ y: 0, opacity: 1, scale: 1 }}
                          exit={{
                            y: -90,
                            opacity: 0,
                            scale: 0.88,
                            transition: { duration: 0.22, ease: 'easeOut' },
                          }}
                          transition={{ type: 'spring', stiffness: 350, damping: 24 }}
                        >
                          <div className="tile-slot-idx">[{actualIdx}]</div>
                          <div className="tile-value">{val}</div>

                          {isTop && (
                            <motion.div
                              className="stack-top-badge"
                              layoutId="stack-top-pointer"
                              transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                            >
                              <span className="badge-arrow">👈</span>
                              <span className="badge-label">TOP (idx: {actualIdx})</span>
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })
                  )}
                </AnimatePresence>
              </div>

              <div className="stack-column-base">
                <span>STACK BASE (LIFO)</span>
              </div>
            </div>

            <div className="ds-quick-stats">
              <div className="stat-pill">
                <span className="stat-label">Size:</span>
                <span className="stat-value">{items.length} items</span>
              </div>
              <div className="stat-pill">
                <span className="stat-label">Top Value:</span>
                <span className="stat-value highlight">
                  {items.length > 0 ? getItemData(items[items.length - 1], items.length - 1).val : 'Empty'}
                </span>
              </div>
              <div className="stat-pill">
                <span className="stat-label">Access Mode:</span>
                <span className="stat-value">LIFO (Last-In, First-Out)</span>
              </div>
            </div>
          </div>
        )}

        {/* 2. QUEUE (FIFO) */}
        {type === 'queue' && (
          <div className="ds-clean-queue-stage">
            <div className="queue-direction-bar">
              <div className="flow-end-box exit-box">
                <span className="flow-tag">⬅ 📤 EXIT / DEQUEUE</span>
                <span className="flow-sub">Front element leaves first</span>
              </div>

              <div className="flow-arrow-indicator">
                <span>FLOW DIRECTION ⬅ ⬅ ⬅</span>
              </div>

              <div className="flow-end-box entry-box">
                <span className="flow-tag">📥 ENQUEUE / ENTRY ⬅</span>
                <span className="flow-sub">New element joins rear</span>
              </div>
            </div>

            <div className="queue-glass-track">
              <div className="queue-track-inner">
                <AnimatePresence initial={false}>
                  {items.length === 0 ? (
                    <div className="ds-stage-empty-state">
                      <span className="empty-title">Queue is Empty</span>
                      <span className="empty-sub">Enqueue elements to build the queue</span>
                    </div>
                  ) : (
                    items.map((item, idx) => {
                      const isFront = idx === 0;
                      const isRear = idx === items.length - 1;
                      const { id, val } = getItemData(item, idx);

                      return (
                        <motion.div
                          key={id}
                          layout
                          className={`queue-card-tile ${isFront ? 'tile-is-front' : ''} ${isRear ? 'tile-is-rear' : ''}`}
                          initial={{ x: 80, opacity: 0, scale: 0.9 }}
                          animate={{ x: 0, opacity: 1, scale: 1 }}
                          exit={{
                            x: -80,
                            opacity: 0,
                            scale: 0.85,
                            transition: { duration: 0.2, ease: 'easeIn' },
                          }}
                          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                        >
                          {isFront && (
                            <motion.div
                              className="queue-pointer-badge badge-front"
                              layoutId="queue-front-badge"
                            >
                              <span>▲ FRONT (idx: 0)</span>
                            </motion.div>
                          )}

                          {isRear && (
                            <motion.div
                              className="queue-pointer-badge badge-rear"
                              layoutId="queue-rear-badge"
                            >
                              <span>▲ REAR (idx: {idx})</span>
                            </motion.div>
                          )}

                          <div className="tile-value">{val}</div>
                          <div className="tile-slot-idx">idx: {idx}</div>
                        </motion.div>
                      );
                    })
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="ds-quick-stats">
              <div className="stat-pill">
                <span className="stat-label">Length:</span>
                <span className="stat-value">{items.length} items</span>
              </div>
              <div className="stat-pill">
                <span className="stat-label">Front Element:</span>
                <span className="stat-value highlight-front">
                  {items.length > 0 ? getItemData(items[0], 0).val : 'Empty'}
                </span>
              </div>
              <div className="stat-pill">
                <span className="stat-label">Rear Element:</span>
                <span className="stat-value highlight-rear">
                  {items.length > 0 ? getItemData(items[items.length - 1], items.length - 1).val : 'Empty'}
                </span>
              </div>
              <div className="stat-pill">
                <span className="stat-label">Access Mode:</span>
                <span className="stat-value">FIFO (First-In, First-Out)</span>
              </div>
            </div>
          </div>
        )}

        {/* 3. SINGLY LINKED LIST */}
        {type === 'linked-list' && (
          <div className="ds-clean-ll-stage">
            <div className="ll-track-wrapper">
              <div className="ll-head-label">
                <span className="head-text">HEAD ➔</span>
              </div>

              <div className="ll-chain-row">
                <AnimatePresence initial={false}>
                  {nodes.length === 0 ? (
                    <div className="ds-stage-empty-state">
                      <span className="empty-title">Linked List is Empty</span>
                      <span className="empty-sub">HEAD ➔ NULL</span>
                    </div>
                  ) : (
                    nodes.map((node, idx) => {
                      const isHead = idx === 0;
                      const isActive = node.id === activeNodeId;
                      const isTraversing = node.id === traversingId;
                      const val = node.data ?? node.val ?? node;
                      const keyId = node.id || `node-${idx}-${val}`;

                      return (
                        <React.Fragment key={keyId}>
                          <motion.div
                            layout
                            className={`ll-node-card ${isHead ? 'node-is-head' : ''} ${isActive ? 'node-is-active' : ''} ${isTraversing ? 'node-is-traversing' : ''}`}
                            initial={{ scale: 0.85, opacity: 0, y: 15 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {isHead && <span className="ll-indicator-tag tag-head">HEAD</span>}
                            {isTraversing && <span className="ll-indicator-tag tag-curr">curr ⬇</span>}

                            <div className="node-data-slot">
                              <span className="slot-lbl">DATA</span>
                              <span className="slot-val">{val}</span>
                            </div>

                            <div className="node-next-slot">
                              <span className="slot-lbl">NEXT</span>
                              <span className="slot-dot">•</span>
                            </div>
                          </motion.div>

                          <div className="ll-arrow-connector">
                            <svg width="44" height="24" viewBox="0 0 44 24" fill="none">
                              <path
                                d="M 2 12 L 36 12 M 30 6 L 38 12 L 30 18"
                                stroke={isTraversing ? '#f43f5e' : '#38bdf8'}
                                strokeWidth={isTraversing ? '2.8' : '2'}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        </React.Fragment>
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

            <div className="ds-quick-stats">
              <div className="stat-pill">
                <span className="stat-label">Total Nodes:</span>
                <span className="stat-value">{nodes.length} nodes</span>
              </div>
              <div className="stat-pill">
                <span className="stat-label">Head:</span>
                <span className="stat-value highlight">{(nodes[0]?.data ?? nodes[0]?.val ?? nodes[0]) ?? 'NULL'}</span>
              </div>
              <div className="stat-pill">
                <span className="stat-label">Head Insert:</span>
                <span className="stat-value">O(1)</span>
              </div>
              <div className="stat-pill">
                <span className="stat-label">Traversal:</span>
                <span className="stat-value">O(n)</span>
              </div>
            </div>
          </div>
        )}

        {/* 4. DOUBLY LINKED LIST */}
        {type === 'doubly-linked-list' && (
          <div className="ds-clean-dll-stage">
            <div className="dll-track-wrapper">
              <div className="dll-null-terminal">
                <span className="null-symbol">NULL ⏚</span>
              </div>

              <div className="dll-chain-row">
                <AnimatePresence initial={false}>
                  {nodes.map((node, idx) => {
                    const isHead = node.id === headId || idx === 0;
                    const isTail = node.id === tailId || idx === nodes.length - 1;
                    const isActive = node.id === activeNodeId;
                    const isTraversing = node.id === traversingId;
                    const val = node.data ?? node.val ?? node;

                    return (
                      <React.Fragment key={node.id || idx}>
                        {/* Connecting Bidirectional Arrow */}
                        <div className="dll-double-arrow">
                          <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
                            <path
                              d="M 2 8 L 32 8 M 26 4 L 34 8 L 26 12"
                              stroke={isTraversing && direction === 'forward' ? '#38bdf8' : '#64748b'}
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M 38 16 L 8 16 M 14 12 L 6 16 L 14 20"
                              stroke={isTraversing && direction === 'backward' ? '#a855f7' : '#64748b'}
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>

                        {/* Doubly Linked Node Card */}
                        <motion.div
                          layout
                          className={`dll-node-card ${isHead ? 'node-is-head' : ''} ${isTail ? 'node-is-tail' : ''} ${isActive ? 'node-is-active' : ''} ${isTraversing ? 'node-is-traversing' : ''}`}
                          initial={{ scale: 0.85, opacity: 0, y: 15 }}
                          animate={{ scale: 1, opacity: 1, y: 0 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                        >
                          {isHead && <span className="dll-flag-pill pill-head">HEAD</span>}
                          {isTail && <span className="dll-flag-pill pill-tail">TAIL</span>}
                          {isTraversing && (
                            <span className="dll-flag-pill pill-curr">
                              {direction === 'backward' ? '⯇ curr' : 'curr ⯈'}
                            </span>
                          )}

                          <div className="dll-slot-prev">
                            <span className="slot-mini-lbl">PREV</span>
                            <span className="slot-dot">⯇</span>
                          </div>

                          <div className="dll-slot-data">
                            <span className="slot-mini-lbl">DATA</span>
                            <span className="dll-val">{val}</span>
                          </div>

                          <div className="dll-slot-next">
                            <span className="slot-mini-lbl">NEXT</span>
                            <span className="slot-dot">⯈</span>
                          </div>
                        </motion.div>
                      </React.Fragment>
                    );
                  })}
                </AnimatePresence>

                <div className="dll-double-arrow">
                  <svg width="36" height="24" viewBox="0 0 36 24" fill="none">
                    <path d="M 2 8 L 30 8 M 24 4 L 32 8 L 24 12" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M 34 16 L 6 16 M 12 12 L 4 16 L 12 20" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                <div className="dll-null-terminal">
                  <span className="null-symbol">⏚ NULL</span>
                </div>
              </div>
            </div>

            <div className="ds-quick-stats">
              <div className="stat-pill">
                <span className="stat-label">Nodes:</span>
                <span className="stat-value">{nodes.length}</span>
              </div>
              <div className="stat-pill">
                <span className="stat-label">HEAD:</span>
                <span className="stat-value highlight">{nodes[0]?.data ?? 'NULL'}</span>
              </div>
              <div className="stat-pill">
                <span className="stat-label">TAIL:</span>
                <span className="stat-value highlight-rear">{nodes[nodes.length - 1]?.data ?? 'NULL'}</span>
              </div>
              <div className="stat-pill">
                <span className="stat-label">Traversal:</span>
                <span className="stat-value">Bidirectional (⇄ O(n))</span>
              </div>
            </div>
          </div>
        )}

        {/* 5. CIRCULAR QUEUE (RING BUFFER) */}
        {type === 'circular-queue' && (
          <div className="ds-clean-cqueue-stage">
            <div className="cqueue-ring-container">
              <div className="cqueue-slots-grid">
                {slots.map((val, idx) => {
                  const isFront = idx === front;
                  const isRear = idx === rear;
                  const isOccupied = val !== null;

                  return (
                    <motion.div
                      key={idx}
                      layout
                      className={`cqueue-slot-cell ${isOccupied ? 'slot-occupied' : 'slot-free'} ${isFront ? 'slot-front' : ''} ${isRear ? 'slot-rear' : ''}`}
                    >
                      <div className="cqueue-slot-header">
                        <span className="slot-idx-tag">[{idx}]</span>
                        {isFront && <span className="cq-badge cq-front">FRONT</span>}
                        {isRear && <span className="cq-badge cq-rear">REAR</span>}
                      </div>

                      <div className="cqueue-slot-body">
                        {isOccupied ? (
                          <span className="cqueue-slot-val">{val}</span>
                        ) : (
                          <span className="cqueue-slot-empty">Empty</span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="cqueue-modulo-formula">
                <span className="formula-lbl">Formula:</span>
                <span className="formula-code">rear = (rear + 1) % {capacity}</span>
              </div>
            </div>

            <div className="ds-quick-stats">
              <div className="stat-pill">
                <span className="stat-label">Capacity:</span>
                <span className="stat-value">{capacity} slots</span>
              </div>
              <div className="stat-pill">
                <span className="stat-label">FRONT Index:</span>
                <span className="stat-value highlight-front">Slot [{front}]</span>
              </div>
              <div className="stat-pill">
                <span className="stat-label">REAR Index:</span>
                <span className="stat-value highlight-rear">Slot [{rear}]</span>
              </div>
              <div className="stat-pill">
                <span className="stat-label">Wrap-Around:</span>
                <span className="stat-value">Modulo (%) O(1)</span>
              </div>
            </div>
          </div>
        )}

        {/* 6. BINARY HEAP (MIN-HEAP) */}
        {type === 'binary-heap' && (
          <div className="ds-clean-heap-stage">
            {/* Array Representation */}
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

            {/* Tree Hierarchy Representation */}
            <div className="heap-tree-section">
              <div className="section-title-tag">COMPLETE BINARY TREE HIERARCHY</div>
              <div className="heap-tree-levels">
                {/* Level 0: Root */}
                {heap.length > 0 && (
                  <div className="tree-level level-0">
                    <div className={`tree-node-circle ${highlightIndices.includes(0) ? 'node-highlight' : ''}`}>
                      <span className="node-idx-sub">0</span>
                      <span className="node-val">{heap[0]}</span>
                    </div>
                  </div>
                )}

                {/* Level 1: Indices 1, 2 */}
                {heap.length > 1 && (
                  <div className="tree-level level-1">
                    {[1, 2].map(idx => (
                      idx < heap.length ? (
                        <div
                          key={idx}
                          className={`tree-node-circle ${highlightIndices.includes(idx) ? 'node-highlight' : ''}`}
                        >
                          <span className="node-idx-sub">{idx}</span>
                          <span className="node-val">{heap[idx]}</span>
                        </div>
                      ) : null
                    ))}
                  </div>
                )}

                {/* Level 2: Indices 3, 4, 5, 6 */}
                {heap.length > 3 && (
                  <div className="tree-level level-2">
                    {[3, 4, 5, 6].map(idx => (
                      idx < heap.length ? (
                        <div
                          key={idx}
                          className={`tree-node-circle ${highlightIndices.includes(idx) ? 'node-highlight' : ''}`}
                        >
                          <span className="node-idx-sub">{idx}</span>
                          <span className="node-val">{heap[idx]}</span>
                        </div>
                      ) : null
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="ds-quick-stats">
              <div className="stat-pill">
                <span className="stat-label">Min Root [0]:</span>
                <span className="stat-value highlight">{heap[0] ?? 'Empty'}</span>
              </div>
              <div className="stat-pill">
                <span className="stat-label">Heap Size:</span>
                <span className="stat-value">{heap.length} elements</span>
              </div>
              <div className="stat-pill">
                <span className="stat-label">Insert / Extract:</span>
                <span className="stat-value">O(log n)</span>
              </div>
              <div className="stat-pill">
                <span className="stat-label">Peek Min:</span>
                <span className="stat-value">O(1)</span>
              </div>
            </div>
          </div>
        )}

        {/* 7. HASH TABLE (CHAINING) */}
        {type === 'hash-table' && (
          <div className="ds-clean-hash-stage">
            {hashComputation && (
              <div className="hash-calc-banner">
                <span className="calc-icon">⚡</span>
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

            <div className="ds-quick-stats">
              <div className="stat-pill">
                <span className="stat-label">Buckets:</span>
                <span className="stat-value">{buckets.length} slots</span>
              </div>
              <div className="stat-pill">
                <span className="stat-label">Collision Resolution:</span>
                <span className="stat-value">Separate Chaining</span>
              </div>
              <div className="stat-pill">
                <span className="stat-label">Average Lookup:</span>
                <span className="stat-value highlight">O(1)</span>
              </div>
              <div className="stat-pill">
                <span className="stat-label">Worst Case:</span>
                <span className="stat-value">O(n)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
