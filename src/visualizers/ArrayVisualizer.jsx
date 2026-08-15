// src/visualizers/ArrayVisualizer.jsx — Fluid array visualizer with animated connecting comparison & swap arrows

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

  // Active comparison or swapping pair
  const isSwapping = Boolean(frame.swapping && frame.swapping.length === 2);
  const isComparing = !isSwapping && Boolean(frame.comparing && frame.comparing.length === 2);
  const activePair = isSwapping ? frame.swapping : isComparing ? frame.comparing : null;

  // Calculate coordinates for connecting bridge
  let bridge = null;
  if (activePair && n > 1) {
    const [idxA, idxB] = activePair;
    const minIdx = Math.min(idxA, idxB);
    const maxIdx = Math.max(idxA, idxB);
    const leftPercent = ((minIdx + 0.5) / n) * 100;
    const rightPercent = ((maxIdx + 0.5) / n) * 100;
    const widthPercent = Math.max(rightPercent - leftPercent, 2);
    const centerPercent = (leftPercent + rightPercent) / 2;
    const valA = array[minIdx];
    const valB = array[maxIdx];
    const operator = valA > valB ? '>' : valA < valB ? '<' : '=';

    bridge = {
      minIdx, maxIdx,
      left: leftPercent,
      right: rightPercent,
      width: widthPercent,
      center: centerPercent,
      isSwap: isSwapping,
      operator,
      label: isSwapping ? '⇄ SWAP' : `${valA} ${operator} ${valB}`,
      color: isSwapping ? '#f43f5e' : '#38bdf8',
    };
  }

  return (
    <div className="array-visualizer-container">
      {/* ── Prominent Comparison & Swap Indicator Header ── */}
      <div className="comparison-indicator-header">
        {bridge ? (
          <motion.div
            key={`chip-${bridge.minIdx}-${bridge.maxIdx}-${bridge.isSwap}`}
            className={`active-connection-pill ${bridge.isSwap ? 'swap-pill' : 'comp-pill'}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          >
            <span className="pill-action">{bridge.isSwap ? 'SWAPPING' : 'COMPARING'}</span>
            <span className="pill-indices">[{bridge.minIdx}] ↔ [{bridge.maxIdx}]</span>
            <span className="pill-expr">{bridge.label}</span>
          </motion.div>
        ) : (
          <span className="idle-indicator">Execution in progress</span>
        )}
      </div>

      {/* ── Bars Canvas with Direct Arrow Bridge Overlay ── */}
      <div className="visualizer-canvas">
        {bridge && (
          <motion.div
            key={`bridge-arch-${bridge.minIdx}-${bridge.maxIdx}-${bridge.isSwap}`}
            className={`canvas-bridge-arch ${bridge.isSwap ? 'swap-arch' : 'comp-arch'}`}
            style={{
              left: `${bridge.left}%`,
              width: `${bridge.width}%`,
            }}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 0.12 }}
          >
            <div className="bridge-arch-line" />
            <div className="bridge-arrow-left">◄</div>
            <div className="bridge-arrow-right">►</div>
          </motion.div>
        )}

        {array.map((value, i) => {
          const barState = getBarState(i, frame, type);
          const isBarComp = barState === 'comparing';
          const isBarSwap = barState === 'swapping';

          // Proportional percentage height
          const heightPercent = Math.max(8, (value / maxValue) * 78);

          return (
            <div key={i} className="bar-wrapper">
              {showValues && (
                <span className={`bar-value ${isBarComp ? 'highlight-comp' : ''} ${isBarSwap ? 'highlight-swap' : ''}`}>
                  {value}
                </span>
              )}
              <div className="bar-track">
                <motion.div
                  className={`bar ${barState}`}
                  animate={{
                    height: `${heightPercent}%`,
                    y: isBarSwap ? -6 : isBarComp ? -3 : 0,
                    scale: isBarSwap ? 1.05 : isBarComp ? 1.02 : 1,
                  }}
                  transition={{
                    height: { type: 'spring', stiffness: 350, damping: 28 },
                    y: { duration: 0.15 },
                    scale: { duration: 0.15 },
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

      {/* ── Pointer Arrows ── */}
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
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
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

      {/* ── Search Bounds Indicator ── */}
      {type === 'searching' && frame.pointers && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '4px 12px',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--text-muted)',
          background: 'var(--bg-card)',
          borderTop: '1px solid var(--border)',
        }}>
          {frame.pointers.left !== undefined && <span>left = {frame.pointers.left}</span>}
          {frame.pointers.mid !== undefined && <span style={{ color: 'var(--primary)', fontWeight: 600 }}>mid = {frame.pointers.mid}</span>}
          {frame.pointers.right !== undefined && <span>right = {frame.pointers.right}</span>}
        </div>
      )}

      {/* ── State / Variable Inspector ── */}
      {frame.variables && Object.keys(frame.variables).length > 0 && (
        <div className="variable-inspector">
          <span className="var-inspector-label">State:</span>
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
