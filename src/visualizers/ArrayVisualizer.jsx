// src/visualizers/ArrayVisualizer.jsx — Clean, professional array visualizer

import { motion } from 'framer-motion';

const MAX_HEIGHT = 240;

function getBarClass(i, frame, type) {
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
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-subtle)' }}>
      Select an algorithm and click Play
    </div>
  );

  const array = frame.array || [];
  const maxValue = Math.max(...array, 1);
  const showValues = array.length <= 25;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* ── Bars Canvas ── */}
      <div className="visualizer-canvas">
        {array.map((value, i) => {
          const barClass = getBarClass(i, frame, type);
          const height = Math.max(12, (value / maxValue) * MAX_HEIGHT);

          return (
            <div key={i} className="bar-wrapper">
              {showValues && (
                <span className="bar-value">{value}</span>
              )}
              <motion.div
                className={`bar ${barClass}`}
                animate={{ height }}
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              />
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
                  <div key={name} className="pointer-tag">
                    <span>{name}</span>
                    <span>▲</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Search Bounds ── */}
      {type === 'searching' && frame.pointers && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '4px 8px',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--text-muted)',
          borderTop: '1px solid var(--border)',
        }}>
          {frame.pointers.left !== undefined && <span>left = {frame.pointers.left}</span>}
          {frame.pointers.mid !== undefined && <span style={{ color: 'var(--primary)' }}>mid = {frame.pointers.mid}</span>}
          {frame.pointers.right !== undefined && <span>right = {frame.pointers.right}</span>}
        </div>
      )}

      {/* ── Variable Inspector ── */}
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
