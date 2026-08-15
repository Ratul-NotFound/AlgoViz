// src/visualizers/GraphVisualizer.jsx
// SVG-based graph visualizer for BFS, DFS, Dijkstra

import { motion } from 'framer-motion';

function getNodeColor(nodeId, frame) {
  if (!frame) return { fill: 'var(--bar-default)', stroke: 'var(--border-bright)', glow: false };
  const { visited, current, frontier } = frame;
  if (current === nodeId)
    return { fill: '#a855f7', stroke: '#c084fc', glow: true, glowColor: 'rgba(168,85,247,0.7)' };
  if (visited?.has(nodeId))
    return { fill: '#10b981', stroke: '#34d399', glow: true, glowColor: 'rgba(16,185,129,0.5)' };
  if (frontier?.has(nodeId))
    return { fill: '#f59e0b', stroke: '#fbbf24', glow: true, glowColor: 'rgba(245,158,11,0.5)' };
  return { fill: '#1e1b4b', stroke: 'var(--border-bright)', glow: false };
}

function getEdgeColor(edge, frame) {
  if (!frame?.activeEdge) return { stroke: 'var(--border)', width: 2, glow: false };
  const { from, to } = frame.activeEdge;
  const matches =
    (edge.from === from && edge.to === to) ||
    (edge.from === to && edge.to === from);
  if (matches)
    return { stroke: 'var(--cyan)', width: 3, glow: true };
  if (frame.visited?.has(edge.from) && frame.visited?.has(edge.to))
    return { stroke: '#10b981', width: 2, glow: false };
  return { stroke: '#2d2b55', width: 2, glow: false };
}

export default function GraphVisualizer({ frame, graph, type = 'bfs' }) {
  if (!graph) return null;
  const { nodes, edges } = graph;

  // Determine if Dijkstra (show distances)
  const isDijkstra = type === 'dijkstra';

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <svg
        className="graph-svg"
        viewBox="0 0 600 440"
        style={{ flex: 1, width: '100%' }}
      >
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="var(--text-muted)" />
          </marker>
          {nodes.map(n => {
            const style = getNodeColor(n.id, frame);
            return style.glow ? (
              <filter key={`glow-${n.id}`} id={`glow-${n.id}`}>
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            ) : null;
          })}
        </defs>

        {/* Edges */}
        {edges.map((edge, i) => {
          const from = nodes.find(n => n.id === edge.from);
          const to   = nodes.find(n => n.id === edge.to);
          if (!from || !to) return null;
          const style = getEdgeColor(edge, frame);
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2;

          return (
            <g key={i}>
              <motion.line
                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke={style.stroke}
                strokeWidth={style.width}
                animate={{ stroke: style.stroke, strokeWidth: style.width }}
                transition={{ duration: 0.3 }}
                style={style.glow ? { filter: 'drop-shadow(0 0 6px var(--cyan))' } : {}}
              />
              {edge.weight !== undefined && (
                <text x={midX} y={midY - 6} className="graph-edge-weight" fill="var(--text-muted)">
                  {edge.weight}
                </text>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map(node => {
          const style = getNodeColor(node.id, frame);
          const dist = isDijkstra && frame?.dist ? frame.dist[node.id] : null;
          const isInPath = frame?.order?.includes(node.id);

          return (
            <g key={node.id}>
              <motion.circle
                cx={node.x} cy={node.y} r={28}
                fill={style.fill}
                stroke={style.stroke}
                strokeWidth={style.glow ? 3 : 2}
                animate={{ fill: style.fill, stroke: style.stroke }}
                transition={{ duration: 0.4, type: 'spring' }}
                style={style.glow ? { filter: `drop-shadow(0 0 10px ${style.glowColor})` } : {}}
              />
              <text x={node.x} y={node.y} className="graph-node-label">
                {node.id}
              </text>
              {/* BFS/DFS: show visit order */}
              {isInPath && frame?.order && (
                <text
                  x={node.x + 20} y={node.y - 20}
                  fill="var(--amber)"
                  fontSize="11"
                  fontFamily="var(--font-code)"
                  fontWeight="700"
                >
                  #{frame.order.indexOf(node.id) + 1}
                </text>
              )}
              {/* Dijkstra: distance label */}
              {isDijkstra && dist !== null && (
                <text
                  x={node.x} y={node.y + 42}
                  textAnchor="middle"
                  fill={dist === Infinity ? 'var(--text-muted)' : 'var(--cyan-light)'}
                  fontSize="12"
                  fontFamily="var(--font-code)"
                  fontWeight="700"
                >
                  {dist === Infinity ? '∞' : dist}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* BFS Queue / DFS Stack display */}
      {frame && (type === 'bfs' || type === 'dfs') && (
        <div className="graph-sidebar-panel">
          <div className="structure-display">
            <div className="structure-display-label">
              {type === 'bfs' ? '📦 Queue' : '📚 Stack'}
            </div>
            <div className="structure-items">
              {(type === 'bfs' ? frame.queue : frame.stack || []).map((item, i) => (
                <div key={i} className={`structure-item ${i === 0 ? 'highlight' : ''}`}>
                  {item}
                </div>
              ))}
              {(type === 'bfs' ? frame.queue : frame.stack || []).length === 0 && (
                <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Empty</span>
              )}
            </div>
          </div>
          <div className="structure-display">
            <div className="structure-display-label">✅ Visited</div>
            <div className="structure-items">
              {[...(frame.visited || [])].map((item, i) => (
                <div key={i} className="structure-item" style={{ borderColor: 'var(--green)', color: 'var(--green)' }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="structure-display">
            <div className="structure-display-label">🗺️ Order</div>
            <div style={{ fontFamily: 'var(--font-code)', fontSize: 14, color: 'var(--violet-light)' }}>
              {(frame.order || []).join(' → ') || '—'}
            </div>
          </div>
        </div>
      )}

      {/* Dijkstra Distance Table */}
      {isDijkstra && frame?.dist && (
        <div className="graph-sidebar-panel" style={{ flexWrap: 'wrap', gap: '8px' }}>
          <div className="structure-display-label" style={{ width: '100%', marginBottom: 4 }}>
            📊 Distance Table (from {graph.start})
          </div>
          {Object.entries(frame.dist).map(([node, d]) => (
            <div key={node} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)', padding: '6px 12px',
              borderColor: frame.current === node ? 'var(--violet)' : 'var(--border)',
            }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)' }}>{node}</div>
              <div style={{ fontFamily: 'var(--font-code)', fontSize: 14, color: d === Infinity ? 'var(--text-muted)' : 'var(--cyan-light)' }}>
                {d === Infinity ? '∞' : d}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
