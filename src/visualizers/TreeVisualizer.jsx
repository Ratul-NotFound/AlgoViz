// src/visualizers/TreeVisualizer.jsx
// SVG-based BST visualizer

import { motion } from 'framer-motion';

const NODE_R = 24;
const LEVEL_H = 80;

// Calculate node positions in the tree
function layoutTree(node, x, y, dx) {
  if (!node) return [];
  const result = [{ ...node, x, y }];
  if (node.left)  result.push(...layoutTree(node.left,  x - dx, y + LEVEL_H, dx / 2));
  if (node.right) result.push(...layoutTree(node.right, x + dx, y + LEVEL_H, dx / 2));
  return result;
}

function getEdges(node) {
  if (!node) return [];
  const edges = [];
  if (node.left)  { edges.push({ from: node, to: node.left  }); edges.push(...getEdges(node.left)); }
  if (node.right) { edges.push({ from: node, to: node.right }); edges.push(...getEdges(node.right)); }
  return edges;
}

function getNodeColor(node, frame) {
  if (!frame) return { fill: '#1e1b4b', stroke: 'var(--border-bright)', glow: false };
  if (frame.currentNodeId === node.id)
    return { fill: '#7c3aed', stroke: '#a855f7', glow: true, glowColor: 'rgba(124,58,237,0.8)' };
  if (frame.path?.includes(node.id))
    return { fill: '#0e7490', stroke: '#06b6d4', glow: true, glowColor: 'rgba(6,182,212,0.5)' };
  return { fill: '#1e1b4b', stroke: '#3730a3', glow: false };
}

function flattenTree(node) {
  if (!node) return [];
  return [node, ...flattenTree(node.left), ...flattenTree(node.right)];
}

export default function TreeVisualizer({ frame }) {
  if (!frame?.tree) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🌳</div>
        <div>Build the BST by pressing Play</div>
      </div>
    </div>
  );

  const root = frame.tree;
  const nodes = layoutTree(root, 300, 60, 120);
  const flatNodes = flattenTree(root);
  const edges = getEdges(root).map(e => {
    const fromPos = nodes.find(n => n.id === e.from.id);
    const toPos   = nodes.find(n => n.id === e.to.id);
    return { ...e, fromPos, toPos };
  });

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      <svg
        viewBox="0 0 600 420"
        style={{ width: '100%', minHeight: 300 }}
      >
        <defs>
          <filter id="node-glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Edges */}
        {edges.map((e, i) => (
          e.fromPos && e.toPos && (
            <motion.line
              key={i}
              x1={e.fromPos.x} y1={e.fromPos.y}
              x2={e.toPos.x}  y2={e.toPos.y}
              className="tree-edge-line"
              animate={{ stroke: frame.path?.includes(e.to.id) ? 'var(--cyan)' : 'var(--border-bright)' }}
              transition={{ duration: 0.3 }}
            />
          )
        ))}

        {/* Nodes */}
        {nodes.map(node => {
          const style = getNodeColor(node, frame);
          return (
            <g key={node.id}>
              <motion.circle
                cx={node.x} cy={node.y} r={NODE_R}
                fill={style.fill}
                stroke={style.stroke}
                strokeWidth={style.glow ? 3 : 2}
                animate={{ fill: style.fill, stroke: style.stroke, r: style.glow ? NODE_R + 2 : NODE_R }}
                transition={{ duration: 0.4, type: 'spring' }}
                style={style.glow ? { filter: 'url(#node-glow)' } : {}}
              />
              <text
                x={node.x} y={node.y}
                className="tree-node-label"
                style={{ fill: style.glow ? 'white' : 'var(--text-secondary)' }}
              >
                {node.val}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Variable Inspector for Tree */}
      <div className="variable-inspector">
        <span className="var-inspector-label">phase:</span>
        <div className="var-item">
          <span className="var-value" style={{ color: 'var(--violet-light)' }}>
            {frame.phase || 'build'}
          </span>
        </div>
        {frame.currentNodeId !== null && frame.currentNodeId !== undefined && (
          <div className="var-item">
            <span className="var-name">current</span>
            <span className="var-equals"> = </span>
            <span className="var-value">
              {flatNodes.find(n => n.id === frame.currentNodeId)?.val ?? '?'}
            </span>
          </div>
        )}
        {frame.path?.length > 0 && (
          <div className="var-item">
            <span className="var-name">path</span>
            <span className="var-equals"> = </span>
            <span className="var-value">
              [{frame.path.map(id => flatNodes.find(n => n.id === id)?.val ?? '?').join(' → ')}]
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
