// src/visualizers/ArrayVisualizer.jsx — Fluid, properly proportioned array visualizer

import { motion } from 'framer-motion';

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
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', fontSize: 13 }}>
      Select an algorithm and click Play to start
    </div>
  );

  const array = frame.array || [];
  const maxValue = Math.max(...array, 1);
  const showValues = array.length <= 25;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
      {/* ── Bars Canvas (Flex-1 fluid container) ── */}
      <div className="visualizer-canvas">
        {array.map((value, i) => {
          const barClass = getBarClass(i, frame, type);
          // Scale height fluidly up to 92% of canvas height
          const heightPercent = Math.max(6, (value / maxValue) * 88);

          return (
            <div key={i} className="bar-wrapper" style={{ height: '100%', justifyContent: 'flex-end' }}>
              {showValues && (
                <span className="bar-value">{value}</span>
              )}
              <motion.div
                className={`bar ${barClass}`}
                animate={{ height: `${heightPercent}%` }}
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
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
                    <span style={{ fontSize: 9 }}>▲</span>
                  </div>
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
