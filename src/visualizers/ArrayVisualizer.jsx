// src/visualizers/ArrayVisualizer.jsx — Intuitive, high-clarity DSA visualizer with step breakdown and expressive physics

import { motion } from 'framer-motion';

function getBarState(i, frame, type) {
  if (!frame) return 'default';
  if (type === 'searching') {
    if (frame.found === i) return 'found';
    if (frame.comparing?.includes(i)) return 'comparing';
    if (frame.checked?.[i] === 'found') return 'found';
    if (frame.checked?.[i] || frame.eliminated?.[i]) return 'sorted';
    return 'default';
  }
  if (frame.swapping?.includes(i))  return 'swapping';
  if (frame.comparing?.includes(i)) return 'comparing';
  if (frame.sorted?.[i])            return 'sorted';
  if (frame.pivot === i)            return 'pivot';
  if (frame.current === i)          return 'current';
  return 'default';
}

function getDetailedBreakdown(frame, type) {
  if (!frame) return { title: 'Ready', explanation: 'Click Play or Step Forward to begin execution.', type: 'info' };

  const array = frame.array || [];
  const { comparing = [], swapping = [], pointers = {} } = frame;

  if (swapping.length === 2) {
    const [a, b] = swapping;
    return {
      title: 'Swap Execution',
      badge: 'SWAP',
      badgeType: 'danger',
      explanation: `Exchanging elements: arr[${a}]=${array[a]} and arr[${b}]=${array[b]}. The larger value moves rightward towards its sorted position.`,
      condition: `Swap triggered because arr[${a}] was greater than arr[${b}]`,
    };
  }

  if (comparing.length === 2) {
    const [a, b] = comparing;
    const isGreater = array[a] > array[b];
    return {
      title: 'Conditional Comparison',
      badge: 'COMPARE',
      badgeType: 'primary',
      explanation: `Evaluating arr[${a}] (${array[a]}) ${isGreater ? '>' : '≤'} arr[${b}] (${array[b]}). ${
        isGreater
          ? 'Condition TRUE: elements are out of order, preparing swap.'
          : 'Condition FALSE: elements are in correct relative order, skipping swap.'
      }`,
      condition: `if arr[${a}] > arr[${b}]: -> ${isGreater ? 'TRUE (Swap)' : 'FALSE (Keep)'}`,
    };
  }

  if (frame.message && frame.message.includes('sorted')) {
    return {
      title: 'Pass Complete',
      badge: 'SORTED',
      badgeType: 'success',
      explanation: frame.message,
      condition: 'Element placed in guaranteed final position',
    };
  }

  return {
    title: 'Pointer Inspection',
    badge: 'SCANNING',
    badgeType: 'neutral',
    explanation: frame.message || 'Advancing scanning indices across problem array.',
    condition: pointers.i !== undefined ? `Loop index i = ${pointers.i}` : 'Scanning elements',
  };
}

export default function ArrayVisualizer({ frame, type = 'sorting' }) {
  if (!frame) return (
    <div style={{ height: '100%', minHeight: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', fontSize: 13 }}>
      Select an algorithm and click Play to start
    </div>
  );

  const array = frame.array || [];
  const maxValue = Math.max(...array, 1);
  const showValues = array.length <= 25;
  const n = array.length;

  const isSwapping = Boolean(frame.swapping && frame.swapping.length === 2);
  const isComparing = !isSwapping && Boolean(frame.comparing && frame.comparing.length === 2);
  const activePair = isSwapping ? frame.swapping : isComparing ? frame.comparing : null;
  const breakdown = getDetailedBreakdown(frame, type);

  // Calculate coordinates for SVG connecting bridge
  let bridge = null;
  if (activePair && n > 1) {
    const [idxA, idxB] = activePair;
    const minIdx = Math.min(idxA, idxB);
    const maxIdx = Math.max(idxA, idxB);
    const leftPercent = ((minIdx + 0.5) / n) * 100;
    const rightPercent = ((maxIdx + 0.5) / n) * 100;
    const widthPercent = Math.max(rightPercent - leftPercent, 2);
    const valA = array[minIdx];
    const valB = array[maxIdx];
    const operator = valA > valB ? '>' : valA < valB ? '<' : '=';

    bridge = {
      minIdx, maxIdx,
      left: leftPercent,
      width: widthPercent,
      isSwap: isSwapping,
      operator,
      label: isSwapping ? '⇄ SWAPPING' : `${valA} ${operator} ${valB}`,
      color: isSwapping ? '#f43f5e' : '#38bdf8',
    };
  }

  return (
    <div className="array-visualizer-container">
      {/* ── 1. Interactive Step Breakdown Card ── */}
      <div className="step-breakdown-card">
        <div className="breakdown-header">
          <span className={`breakdown-badge badge-${breakdown.badgeType}`}>
            {breakdown.badge}
          </span>
          <span className="breakdown-title">{breakdown.title}</span>
          <span className="breakdown-condition-chip">{breakdown.condition}</span>
        </div>
        <p className="breakdown-explanation">{breakdown.explanation}</p>
      </div>

      {/* ── 2. Connecting Bridge Arc ── */}
      <div className="bridge-track-area">
        {bridge && (
          <motion.div
            key={`bridge-${bridge.minIdx}-${bridge.maxIdx}-${bridge.isSwap}`}
            className={`connecting-bridge-arch ${bridge.isSwap ? 'swap-arch' : 'comp-arch'}`}
            style={{
              left: `${bridge.left}%`,
              width: `${bridge.width}%`,
            }}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ type: 'spring', stiffness: 450, damping: 25 }}
          >
            <span className="bridge-arrow-start">▼</span>
            <div className={`bridge-chip ${bridge.isSwap ? 'swap-chip' : 'comp-chip'}`}>
              {bridge.label}
            </div>
            <span className="bridge-arrow-end">▼</span>
          </motion.div>
        )}
      </div>

      {/* ── 3. Bars Canvas with Rich Gradients & Physical Motion ── */}
      <div className="visualizer-canvas">
        {array.map((value, i) => {
          const barState = getBarState(i, frame, type);
          const isBarComp = barState === 'comparing';
          const isBarSwap = barState === 'swapping';
          const isBarSorted = barState === 'sorted';

          // Proportional percentage height
          const heightPercent = Math.max(8, (value / maxValue) * 75);

          return (
            <div key={i} className="bar-wrapper">
              {showValues && (
                <span className={`bar-value ${isBarComp ? 'highlight-comp' : ''} ${isBarSwap ? 'highlight-swap' : ''} ${isBarSorted ? 'highlight-sorted' : ''}`}>
                  {value}
                </span>
              )}
              <div className="bar-track">
                <motion.div
                  className={`bar ${barState}`}
                  animate={{
                    height: `${heightPercent}%`,
                    y: isBarSwap ? -8 : isBarComp ? -4 : 0,
                    scale: isBarSwap ? [1, 1.08, 1.04] : isBarComp ? 1.03 : 1,
                  }}
                  transition={{
                    height: { type: 'spring', stiffness: 320, damping: 26 },
                    y: { duration: 0.18 },
                    scale: { duration: 0.18 },
                  }}
                />
              </div>
              {showValues && (
                <span className="bar-index">{i}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* ── 4. Pointer Arrows with Spring Glide ── */}
      {frame.pointers && Object.keys(frame.pointers).length > 0 && (
        <div className="pointers-row">
          {array.map((_, i) => {
            const ptrs = Object.entries(frame.pointers).filter(([, v]) => v === i);
            return (
              <div key={i} className="pointer-cell">
                {ptrs.map(([name]) => (
                  <motion.div
                    key={name}
                    className="pointer-tag"
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                  >
                    <span>{name}</span>
                    <span style={{ fontSize: 9 }}>▲</span>
                  </motion.div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* ── 5. State / Variable Inspector Strip ── */}
      {frame.variables && Object.keys(frame.variables).length > 0 && (
        <div className="variable-inspector">
          <span className="var-inspector-label">Memory:</span>
          {Object.entries(frame.variables).map(([name, value]) => (
            <div key={name} className="var-item">
              <span className="var-name">{name}</span>
              <span className="var-equals">=</span>
              <span className="var-value">{String(value)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
