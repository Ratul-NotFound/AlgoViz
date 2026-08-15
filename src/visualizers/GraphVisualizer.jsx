// src/visualizers/GraphVisualizer.jsx — Clean, minimalist graph visualizer

import { motion } from 'framer-motion';

function getNodeColors(nodeId, frame) {
  if (!frame) return { fill: '#1e293b', stroke: '#475569' };
  const { visited, current, frontier } = frame;
  if (current === nodeId)
    return { fill: '#2563eb', stroke: '#60a5fa' };
  if (visited?.has(nodeId))
    return { fill: '#059669', stroke: '#34d399' };
  if (frontier?.has(nodeId))
    return { fill: '#d97706', stroke: '#fbbf24' };
  return { fill: '#1e293b', stroke: '#334155' };
}

function getEdgeColors(edge, frame) {
  if (!frame?.activeEdge) return { stroke: '#334155', width: 2 };
  const { from, to } = frame.activeEdge;
  const isMatch = (edge.from === from && edge.to === to) || (edge.from === to && edge.to === from);
  if (isMatch) return { stroke: '#3b82f6', width: 3 };
  if (frame.visited?.has(edge.from) && frame.visited?.has(edge.to))
    return { stroke: '#059669', width: 2 };
  return { stroke: '#334155', width: 2 };
}

export default function GraphVisualizer({ frame, graph, type = 'bfs' }) {
  if (!graph) return null;
  const { nodes, edges } = graph;
  const isDijkstra = type === 'dijkstra';

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <svg className="graph-svg" viewBox="0 0 600 420">
        {/* Edges */}
        {edges.map((edge, i) => {
          const from = nodes.find(n => n.id === edge.from);
          const to   = nodes.find(n => n.id === edge.to);
          if (!from || !to) return null;
          const style = getEdgeColors(edge, frame);
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2;

          return (
            <g key={i}>
              <line
                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke={style.stroke}
                strokeWidth={style.width}
              />
              {edge.weight !== undefined && (
                <text x={midX} y={midY - 6} className="graph-edge-weight">
                  {edge.weight}
                </text>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map(node => {
          const style = getNodeColors(node.id, frame);
          const dist = isDijkstra && frame?.dist ? frame.dist[node.id] : null;

          return (
            <g key={node.id}>
              <circle
                cx={node.x} cy={node.y} r={24}
                fill={style.fill}
                stroke={style.stroke}
                strokeWidth={2}
              />
              <text x={node.x} y={node.y} className="graph-node-label">
                {node.id}
              </text>
              {isDijkstra && dist !== null && (
                <text
                  x={node.x} y={node.y + 36}
                  textAnchor="middle"
                  fill="var(--text-muted)"
                  fontSize="11"
                  fontFamily="var(--font-mono)"
                >
                  {dist === Infinity ? '∞' : dist}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Queue / Stack Status */}
      {frame && (type === 'bfs' || type === 'dfs') && (
        <div className="graph-sidebar-panel">
          <div className="structure-display">
            <span className="structure-display-label">{type === 'bfs' ? 'Queue' : 'Stack'}</span>
            <div className="structure-items">
              {(type === 'bfs' ? frame.queue : frame.stack || []).map((item, i) => (
                <span key={i} className={`structure-item ${i === 0 ? 'highlight' : ''}`}>{item}</span>
              ))}
              {(type === 'bfs' ? frame.queue : frame.stack || []).length === 0 && (
                <span style={{ color: 'var(--text-subtle)', fontSize: 11 }}>Empty</span>
              )}
            </div>
          </div>
          <div className="structure-display">
            <span className="structure-display-label">Visited</span>
            <div className="structure-items">
              {[...(frame.visited || [])].map((item, i) => (
                <span key={i} className="structure-item">{item}</span>
              ))}
            </div>
          </div>
          <div className="structure-display">
            <span className="structure-display-label">Order</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--primary)' }}>
              {(frame.order || []).join(' → ') || '—'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
