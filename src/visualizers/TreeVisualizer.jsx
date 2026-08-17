import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NODE_R = 24;
const LEVEL_H = 75;

// Calculate node positions in the tree
function layoutTree(node, x, y, dx) {
  if (!node) return [];
  const result = [{ ...node, x, y }];
  if (node.left)  result.push(...layoutTree(node.left,  x - dx, y + LEVEL_H, Math.max(35, dx / 1.9)));
  if (node.right) result.push(...layoutTree(node.right, x + dx, y + LEVEL_H, Math.max(35, dx / 1.9)));
  return result;
}

function getEdges(node) {
  if (!node) return [];
  const edges = [];
  if (node.left)  { edges.push({ from: node, to: node.left,  dir: 'L (<)' }); edges.push(...getEdges(node.left)); }
  if (node.right) { edges.push({ from: node, to: node.right, dir: 'R (>)' }); edges.push(...getEdges(node.right)); }
  return edges;
}

function getNodeColor(node, frame, isRoot) {
  if (!frame) return { fill: '#1e293b', stroke: '#475569', textColor: '#cbd5e1', glow: false };
  if (frame.currentNodeId === node.id) {
    return {
      fill: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
      stroke: '#c084fc',
      strokeWidth: 3,
      textColor: '#ffffff',
      glow: true,
      glowColor: 'rgba(124, 58, 237, 0.8)',
      tag: 'CURRENT',
    };
  }
  if (frame.path?.includes(node.id)) {
    return {
      fill: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
      stroke: '#38bdf8',
      strokeWidth: 2.5,
      textColor: '#ffffff',
      glow: true,
      glowColor: 'rgba(56, 189, 248, 0.6)',
      tag: 'PATH',
    };
  }
  return {
    fill: '#1e293b',
    stroke: isRoot ? '#a855f7' : '#334155',
    strokeWidth: isRoot ? 2 : 1.5,
    textColor: '#cbd5e1',
    glow: false,
    tag: isRoot ? 'ROOT' : null,
  };
}

function getInorderTraversal(node) {
  if (!node) return [];
  return [...getInorderTraversal(node.left), node.val, ...getInorderTraversal(node.right)];
}

function getTreeBanner(frame) {
  if (!frame) return { label: 'IDLE', color: 'neutral', text: 'Select elements and press Play' };
  if (frame.message?.includes('Found') || frame.message?.includes('🎯')) {
    return { label: '🎯 FOUND', color: 'done', text: frame.message };
  }
  if (frame.message?.includes('Insert') || frame.message?.includes('attach')) {
    return { label: '➕ INSERTING', color: 'swap', text: frame.message };
  }
  if (frame.message?.includes('Compare') || frame.message?.includes('go')) {
    return { label: '⚡ COMPARING', color: 'active', text: frame.message };
  }
  return { label: '🌳 BST TREE', color: 'neutral', text: frame.message || 'Processing tree step…' };
}

export default function TreeVisualizer({ frame }) {
  if (!frame?.tree) {
    return (
      <div className="avz-empty">
        <div className="avz-empty-icon">🌳</div>
        <p>Press Play to build the Binary Search Tree</p>
      </div>
    );
  }

  const root = frame.tree;
  const nodes = layoutTree(root, 300, 60, 130);
  const edges = getEdges(root).map(e => {
    const fromPos = nodes.find(n => n.id === e.from.id);
    const toPos   = nodes.find(n => n.id === e.to.id);
    return { ...e, fromPos, toPos };
  });

  const inorder = getInorderTraversal(root);
  const banner = getTreeBanner(frame);
  const currentNode = nodes.find(n => n.id === frame.currentNodeId);

  return (
    <div className="tree-viz-container">
      {/* ── Phase Banner ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={banner.text}
          className={`avz-banner avz-banner-${banner.color}`}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.14 }}
        >
          <span className="avz-banner-label">{banner.label}</span>
          <span className="avz-banner-text">{banner.text}</span>
        </motion.div>
      </AnimatePresence>

      {/* ── Main SVG Tree Canvas ── */}
      <div className="tree-canvas-wrapper">
        <svg className="tree-svg" viewBox="0 0 600 380" preserveAspectRatio="xMidYMid meet">
          <defs>
            <filter id="tree-node-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ── Edges with Directional Branch Pills ── */}
          {edges.map((e, i) => {
            if (!e.fromPos || !e.toPos) return null;
            const inPath = frame.path?.includes(e.to.id) || (frame.currentNodeId === e.to.id && frame.path?.includes(e.from.id));
            const midX = (e.fromPos.x + e.toPos.x) / 2;
            const midY = (e.fromPos.y + e.toPos.y) / 2;

            return (
              <g key={`edge-${i}`}>
                {inPath && (
                  <line
                    x1={e.fromPos.x} y1={e.fromPos.y}
                    x2={e.toPos.x}   y2={e.toPos.y}
                    stroke="#38bdf8"
                    strokeWidth={7}
                    strokeOpacity={0.35}
                    strokeLinecap="round"
                  />
                )}

                <motion.line
                  x1={e.fromPos.x} y1={e.fromPos.y}
                  x2={e.toPos.x}   y2={e.toPos.y}
                  stroke={inPath ? '#38bdf8' : '#334155'}
                  strokeWidth={inPath ? 3 : 1.5}
                  strokeLinecap="round"
                  animate={{
                    stroke: inPath ? '#38bdf8' : '#334155',
                    strokeWidth: inPath ? 3 : 1.5,
                  }}
                  transition={{ duration: 0.2 }}
                />

                {/* Subtree branch label (e.g. L < or R >) */}
                <g transform={`translate(${midX}, ${midY})`}>
                  <rect
                    x={-14} y={-7} width={28} height={14} rx={7}
                    fill="#0f172a"
                    stroke={inPath ? '#38bdf8' : '#334155'}
                    strokeWidth={1}
                  />
                  <text
                    textAnchor="middle"
                    dy="3"
                    fill={inPath ? '#38bdf8' : '#64748b'}
                    fontSize="8.5"
                    fontWeight="800"
                    fontFamily="var(--font-mono)"
                  >
                    {e.dir}
                  </text>
                </g>
              </g>
            );
          })}

          {/* ── Nodes ── */}
          {nodes.map(node => {
            const isRoot = node.id === root.id;
            const isCurrent = frame.currentNodeId === node.id;
            const style = getNodeColor(node, frame, isRoot);

            return (
              <g key={`node-${node.id}`}>
                {/* Active Pulsing Halo */}
                {isCurrent && (
                  <motion.circle
                    cx={node.x} cy={node.y} r={32}
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth={2}
                    strokeDasharray="4,3"
                    initial={{ scale: 0.8, opacity: 0.8 }}
                    animate={{ scale: [1, 1.15, 1], opacity: [0.8, 0.3, 0.8] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                  />
                )}

                {/* Node Circle */}
                <motion.circle
                  cx={node.x} cy={node.y} r={NODE_R}
                  fill={isCurrent ? '#7c3aed' : frame.path?.includes(node.id) ? '#0284c7' : '#1e293b'}
                  stroke={style.stroke}
                  strokeWidth={style.strokeWidth}
                  filter={style.glow ? 'url(#tree-node-glow)' : 'none'}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: isCurrent ? 1.12 : 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                />

                {/* Value Label */}
                <text
                  x={node.x} y={node.y + 5}
                  textAnchor="middle"
                  fill={style.textColor}
                  fontSize="14"
                  fontWeight="800"
                  fontFamily="var(--font-sans)"
                  pointerEvents="none"
                >
                  {node.val}
                </text>

                {/* Tag Badge */}
                {style.tag && (
                  <g transform={`translate(${node.x + 16}, ${node.y - 16})`}>
                    <rect
                      x={-18} y={-8}
                      width={style.tag.length > 4 ? 42 : 28} height={16}
                      rx={8}
                      fill={isCurrent ? '#7c3aed' : style.tag === 'PATH' ? '#0284c7' : '#475569'}
                      stroke="#ffffff"
                      strokeWidth={1}
                    />
                    <text
                      x={style.tag.length > 4 ? 3 : -4} y={3.5}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="8"
                      fontWeight="900"
                      fontFamily="var(--font-mono)"
                    >
                      {style.tag}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* ── Tree Inspector Bar ── */}
      <div className="tree-structure-panel">
        {/* In-Order Traversal (Sorted Property of BST) */}
        <div className="structure-card">
          <span className="structure-card-title">In-Order Traversal (BST Sorted)</span>
          <div className="structure-order-trail">
            {inorder.map((val, idx) => (
              <React.Fragment key={idx}>
                <span className="trail-chip sorted-chip">{val}</span>
                {idx < inorder.length - 1 && <span className="trail-arrow">➔</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Search / Insert Path */}
        {frame.path && frame.path.length > 0 && (
          <div className="structure-card">
            <span className="structure-card-title">Traversed Path</span>
            <div className="structure-order-trail">
              {frame.path.map((nodeId, idx) => {
                const nodeObj = nodes.find(n => n.id === nodeId);
                return (
                  <React.Fragment key={idx}>
                    <span className="trail-chip path-chip">{nodeObj?.val ?? nodeId}</span>
                    {idx < frame.path.length - 1 && <span className="trail-arrow">➔</span>}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Tree Color Legend ── */}
      <div className="avz-legend">
        {[
          ['bar-pivot',     'Current / Comparing'],
          ['bar-comparing', 'Path Traversed'],
          ['bar-sorted',    'In-Order Nodes'],
          ['bar-default',   'Tree Nodes'],
        ].map(([cls, lbl]) => (
          <div key={lbl} className="avz-leg-item">
            <div className={`avz-leg-dot ${cls}`} />
            <span>{lbl}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
