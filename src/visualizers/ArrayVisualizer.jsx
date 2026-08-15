// src/visualizers/ArrayVisualizer.jsx
// Richly animated bars with comparison bracket overlay, swap arc, and variable inspector

import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useEffect } from 'react';

const MAX_HEIGHT = 240;

/* ─── Bar state classifier ─── */
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

/* ─── Pointer color map ─── */
const PTR_COLORS = {
  i:     'var(--amber-light)',
  j:     'var(--sky)',
  mid:   'var(--indigo)',
  left:  'var(--lime)',
  right: 'var(--rose-light)',
  pivot: 'var(--amber)',
  min:   'var(--teal)',
  key:   'var(--orange)',
};

/* ─── Comparison bracket SVG overlay ─── */
function ComparisonBracket({ comparing, array, canvasRef }) {
  if (!comparing || comparing.length < 2 || !canvasRef.current) return null;

  const canvas = canvasRef.current;
  const bars = canvas.querySelectorAll('.bar-wrapper');
  if (!bars.length) return null;

  const [a, b] = comparing;
  if (a < 0 || b < 0 || a >= bars.length || b >= bars.length) return null;

  const canvasRect = canvas.getBoundingClientRect();
  const barA = bars[a]?.getBoundingClientRect();
  const barB = bars[b]?.getBoundingClientRect();
  if (!barA || !barB) return null;

  const x1 = barA.left - canvasRect.left + barA.width / 2;
  const x2 = barB.left - canvasRect.left + barB.width / 2;
  const y  = canvasRect.height - 42; // near top of pointers area

  const cx = (x1 + x2) / 2;
  const cy = y - 30;
  const op = array[a] > array[b] ? '>' : array[a] < array[b] ? '<' : '=';

  return (
    <svg
      className="comparison-overlay"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}
    >
      {/* Arc line */}
      <path
        d={`M ${x1} ${y} Q ${cx} ${cy - 16} ${x2} ${y}`}
        fill="none" stroke="rgba(56,189,248,0.55)" strokeWidth="1.5"
        strokeDasharray="4 3"
      />
      {/* Operator bubble */}
      <rect x={cx - 12} y={cy - 32} width={24} height={18} rx={4}
        fill="rgba(56,189,248,0.15)" stroke="rgba(56,189,248,0.5)" strokeWidth={1} />
      <text x={cx} y={cy - 19} textAnchor="middle"
        fill="var(--sky-light)" fontSize="13" fontFamily="var(--font-code)" fontWeight="700">
        {op}
      </text>
      {/* Value dots */}
      <circle cx={x1} cy={y} r={3} fill="var(--sky)" />
      <circle cx={x2} cy={y} r={3} fill="var(--sky)" />
    </svg>
  );
}

/* ─── Swap arc SVG overlay ─── */
function SwapArc({ swapping, canvasRef }) {
  if (!swapping || swapping.length < 2 || !canvasRef.current) return null;

  const canvas = canvasRef.current;
  const bars = canvas.querySelectorAll('.bar-wrapper');
  if (!bars.length) return null;

  const [a, b] = swapping;
  if (a < 0 || b < 0 || a >= bars.length || b >= bars.length) return null;

  const rect = canvas.getBoundingClientRect();
  const barA = bars[a]?.getBoundingClientRect();
  const barB = bars[b]?.getBoundingClientRect();
  if (!barA || !barB) return null;

  const x1 = barA.left - rect.left + barA.width / 2;
  const x2 = barB.left - rect.left + barB.width / 2;
  const y  = rect.height - 42;
  const cx = (x1 + x2) / 2;
  const cy = y - 50;

  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}
    >
      {/* Arrow A→B */}
      <path
        d={`M ${x1} ${y - 4} Q ${cx} ${cy} ${x2} ${y - 4}`}
        fill="none" stroke="rgba(244,63,94,0.7)" strokeWidth="2"
        markerEnd="url(#arrowRose)"
      />
      {/* Arrow B→A */}
      <path
        d={`M ${x2} ${y + 4} Q ${cx} ${cy + 20} ${x1} ${y + 4}`}
        fill="none" stroke="rgba(244,63,94,0.5)" strokeWidth="1.5"
        strokeDasharray="3 2"
        markerEnd="url(#arrowRoseDim)"
      />
      {/* SWAP label */}
      <rect x={cx - 18} y={cy - 14} width={36} height={16} rx={4}
        fill="rgba(244,63,94,0.2)" stroke="rgba(244,63,94,0.5)" />
      <text x={cx} y={cy - 2} textAnchor="middle"
        fill="var(--rose-light)" fontSize="9" fontFamily="var(--font-code)" fontWeight="700"
        letterSpacing="0.08em">SWAP</text>
      <defs>
        <marker id="arrowRose" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="rgba(244,63,94,0.8)" />
        </marker>
        <marker id="arrowRoseDim" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L0,5 L5,2.5 z" fill="rgba(244,63,94,0.5)" />
        </marker>
      </defs>
    </svg>
  );
}

/* ─── Sorted wall indicator ─── */
function SortedWall({ sorted, count }) {
  if (!sorted) return null;
  // Find the leftmost sorted index from the right side
  let wallStart = count;
  for (let i = count - 1; i >= 0; i--) {
    if (sorted[i]) wallStart = i;
    else break;
  }
  if (wallStart >= count) return null;

  const pct = ((count - wallStart) / count) * 100;

  return (
    <div style={{
      position: 'absolute', bottom: 0, right: 0,
      width: `${pct}%`, height: '100%',
      background: 'linear-gradient(to right, transparent, rgba(163,230,53,0.04))',
      borderLeft: '1px dashed rgba(163,230,53,0.25)',
      pointerEvents: 'none', zIndex: 1,
      transition: 'width 0.2s ease',
    }} />
  );
}

/* ─── Main Component ─── */
export default function ArrayVisualizer({ frame, type = 'sorting' }) {
  const canvasRef = useRef(null);

  if (!frame) return (
    <div className="canvas-wrapper" style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', flex: 1 }}>
      <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: 52, marginBottom: 12, opacity: 0.5 }}>▷</div>
        <div style={{ fontFamily: 'var(--font-code)', fontSize: 13 }}>Press Play to start</div>
      </div>
    </div>
  );

  const array    = frame.array || [];
  const maxValue = Math.max(...array, 1);
  const showValues = array.length <= 22;

  return (
    <div className="canvas-wrapper" style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>

      {/* ── Bar canvas ── */}
      <div
        ref={canvasRef}
        className="visualizer-canvas"
        style={{ position: 'relative', flex: 1 }}
      >
        {/* Sorted-region shading */}
        {type === 'sorting' && <SortedWall sorted={frame.sorted} count={array.length} />}

        {/* Comparison arc overlay */}
        {type === 'sorting' && frame.comparing?.length === 2 && (
          <ComparisonBracket comparing={frame.comparing} array={array} canvasRef={canvasRef} />
        )}

        {/* Swap arc overlay */}
        {type === 'sorting' && frame.swapping?.length === 2 && (
          <SwapArc swapping={frame.swapping} canvasRef={canvasRef} />
        )}

        {/* Bars */}
        {array.map((value, i) => {
          const state = getBarState(i, frame, type);
          const h = Math.max(10, (value / maxValue) * MAX_HEIGHT);

          return (
            <div key={i} className="bar-wrapper" style={{ zIndex: 2 }}>
              {showValues && (
                <div className="bar-value">{value}</div>
              )}
              <motion.div
                className={`bar ${state}`}
                layoutId={`bar-${i}-${value}`}
                animate={{ height: h }}
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                style={{
                  width: '100%',
                  minWidth: array.length > 40 ? '4px' : '6px',
                  maxWidth: '56px',
                }}
              />
              {showValues && (
                <div className="bar-index">{i}</div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Pointer arrow row ── */}
      {frame.pointers && Object.keys(frame.pointers).length > 0 && (
        <div className="pointers-row" style={{ paddingLeft: 6, paddingRight: 6 }}>
          {array.map((_, i) => {
            const ptrs = Object.entries(frame.pointers).filter(([, v]) => v === i);
            return (
              <div key={i} className="pointer-cell">
                {ptrs.map(([name]) => (
                  <motion.div
                    key={name}
                    className={`pointer-tag ${name}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ color: PTR_COLORS[name] || 'var(--text-muted)' }}
                  >
                    <span>{name}</span>
                    <span style={{ fontSize: 11, lineHeight: 1 }}>▲</span>
                  </motion.div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Binary Search: eliminated region labels ── */}
      {type === 'searching' && frame.pointers && (
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          padding: '2px 8px',
          fontFamily: 'var(--font-code)', fontSize: '11px', fontWeight: 700,
        }}>
          {frame.pointers.left !== undefined && (
            <span style={{ color: 'var(--lime)' }}>L={frame.pointers.left}</span>
          )}
          {frame.pointers.mid !== undefined && (
            <span style={{ color: 'var(--indigo)' }}>MID={frame.pointers.mid}</span>
          )}
          {frame.pointers.right !== undefined && (
            <span style={{ color: 'var(--rose-light)' }}>R={frame.pointers.right}</span>
          )}
        </div>
      )}

      {/* ── Variable Inspector ── */}
      {frame.variables && Object.keys(frame.variables).length > 0 && (
        <div className="variable-inspector">
          <span className="var-inspector-label">dbg</span>
          {Object.entries(frame.variables).map(([name, value]) => (
            <motion.div
              key={name}
              className="var-item"
              animate={{ borderColor: value !== undefined ? 'rgba(249,115,22,0.2)' : 'var(--border-mid)' }}
            >
              <span className="var-name">{name}</span>
              <span className="var-equals">=</span>
              <span className="var-value">{String(value)}</span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
