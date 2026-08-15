// src/visualizers/ArrayVisualizer.jsx — Rich, expressive, animated array visualizer with comparison & swap cues

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
  const comparingIndices = frame.comparing || [];
  const isComparingTwo = comparingIndices.length === 2;

  return (
    <div className="array-visualizer-container">
      {/* ── Active Comparison Comparison Badge ── */}
      {isComparingTwo && (
        <div className="comparison-banner">
          <span className="comp-tag">Comparing</span>
          <span className="comp-expr">
            arr[{comparingIndices[0]}] ({array[comparingIndices[0]]})
            {' '}
            <strong style={{ color: array[comparingIndices[0]] > array[comparingIndices[1]] ? 'var(--danger)' : 'var(--success)' }}>
              {array[comparingIndices[0]] > array[comparingIndices[1]] ? '>' : '≤'}
            </strong>
            {' '}
            arr[{comparingIndices[1]}] ({array[comparingIndices[1]]})
          </span>
          {array[comparingIndices[0]] > array[comparingIndices[1]] && (
            <span className="comp-swap-badge">Needs Swap</span>
          )}
        </div>
      )}

      {/* ── Bars Canvas ── */}
      <div className="visualizer-canvas">
        {array.map((value, i) => {
          const barState = getBarState(i, frame, type);
          const isComparing = barState === 'comparing';
          const isSwapping = barState === 'swapping';
          const isPivot = barState === 'pivot';
          const isFound = barState === 'found';
          const isSorted = barState === 'sorted';

          // Proportional percentage height
          const heightPercent = Math.max(8, (value / maxValue) * 88);

          return (
            <div key={i} className="bar-wrapper">
              {showValues && (
                <span className={`bar-value ${isComparing ? 'highlight-comp' : ''} ${isSwapping ? 'highlight-swap' : ''}`}>
                  {value}
                </span>
              )}
              <div className="bar-track">
                <motion.div
                  className={`bar ${barState}`}
                  animate={{
                    height: `${heightPercent}%`,
                    y: isSwapping ? -6 : isComparing ? -3 : 0,
                    scale: isSwapping ? 1.05 : isComparing ? 1.02 : 1,
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
