import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playNodeVisitSound, playEdgeSound, playCompleteFanfare } from '../utils/sound.js';

function getGraphBanner(frame, type) {
  if (!frame) return { label: 'IDLE', color: 'neutral', text: 'Select start node and press Play' };
  if (frame.message?.includes('complete') || frame.message?.includes('Finish') || frame.message?.includes('✅')) {
    return { label: '✅ COMPLETE', color: 'done', text: frame.message };
  }
  if (frame.activeEdge) {
    return {
      label: '⚡ EXPLORING',
      color: 'active',
      text: frame.message || `Exploring edge ${frame.activeEdge.from} → ${frame.activeEdge.to}`,
    };
  }
  if (frame.current) {
    return {
      label: '● VISITING',
      color: 'current',
      text: frame.message || `Visiting node "${frame.current}"`,
    };
  }
  return { label: '◈ GRAPH', color: 'neutral', text: frame.message || 'Processing graph step…' };
}

function getNodeStyles(nodeId, frame, isStart) {
  if (!frame) return { fill: '#1e293b', stroke: '#475569', textColor: '#94a3b8', glow: false };
  const { visited, current, frontier } = frame;

  if (current === nodeId) {
    return {
      fill: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      stroke: '#93c5fd',
      strokeWidth: 3,
      textColor: '#ffffff',
      glow: true,
      glowColor: 'rgba(59, 130, 246, 0.8)',
      tag: 'ACTIVE',
    };
  }
  if (visited?.has(nodeId)) {
    return {
      fill: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      stroke: '#6ee7b7',
      strokeWidth: 2.5,
      textColor: '#ffffff',
      glow: true,
      glowColor: 'rgba(16, 185, 129, 0.5)',
      tag: '✓',
    };
  }
  if (frontier?.has(nodeId)) {
    return {
      fill: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
      stroke: '#fcd34d',
      strokeWidth: 2.5,
      textColor: '#ffffff',
      glow: true,
      glowColor: 'rgba(245, 158, 11, 0.6)',
      tag: 'QUEUED',
    };
  }
  return {
    fill: '#1e293b',
    stroke: isStart ? '#60a5fa' : '#334155',
    strokeWidth: isStart ? 2 : 1.5,
    textColor: '#cbd5e1',
    glow: false,
    tag: isStart ? 'START' : null,
  };
}

export default function GraphVisualizer({ frame, graph, type = 'bfs' }) {
  if (!graph) return null;
  const { nodes, edges, start } = graph;
  const isDijkstra = type === 'dijkstra';
  const banner = getGraphBanner(frame, type);

  // Audio Sonification synchronized on each frame
  useEffect(() => {
    if (!frame) return;
    if (frame.current) {
      playNodeVisitSound(frame.current);
    } else if (frame.activeEdge) {
      playEdgeSound();
    } else if (frame.message && (frame.message.toLowerCase().includes('complete') || frame.message.includes('✅') || frame.message.toLowerCase().includes('finish'))) {
      playCompleteFanfare();
    }
  }, [frame]);

  return (
    <div className="graph-viz-container">
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

      {/* ── Main SVG Graph Canvas ── */}
      <div className="graph-canvas-wrapper">
        <svg className="graph-svg" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid meet">
          <defs>
            <filter id="graph-node-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="active-edge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </defs>

          {/* ── Edges ── */}
          {edges.map((edge, i) => {
            const fromNode = nodes.find(n => n.id === edge.from);
            const toNode   = nodes.find(n => n.id === edge.to);
            if (!fromNode || !toNode) return null;

            const isMatch = frame?.activeEdge && (
              (edge.from === frame.activeEdge.from && edge.to === frame.activeEdge.to) ||
              (edge.from === frame.activeEdge.to && edge.to === frame.activeEdge.from)
            );
            const isTraversed = frame?.visited?.has(edge.from) && frame?.visited?.has(edge.to);
            const midX = (fromNode.x + toNode.x) / 2;
            const midY = (fromNode.y + toNode.y) / 2;

            return (
              <g key={`edge-${edge.from}-${edge.to}-${i}`}>
                {/* Glow underlay for active edge */}
                {isMatch && (
                  <line
                    x1={fromNode.x} y1={fromNode.y}
                    x2={toNode.x}   y2={toNode.y}
                    stroke="#38bdf8"
                    strokeWidth={8}
                    strokeOpacity={0.4}
                    strokeLinecap="round"
                  />
                )}

                <motion.line
                  x1={fromNode.x} y1={fromNode.y}
                  x2={toNode.x}   y2={toNode.y}
                  stroke={isMatch ? '#38bdf8' : isTraversed ? '#10b981' : '#334155'}
                  strokeWidth={isMatch ? 3.5 : isTraversed ? 2.5 : 1.5}
                  strokeDasharray={isMatch ? '6,4' : 'none'}
                  strokeLinecap="round"
                  animate={{
                    stroke: isMatch ? '#38bdf8' : isTraversed ? '#10b981' : '#334155',
                    strokeWidth: isMatch ? 3.5 : isTraversed ? 2.5 : 1.5,
                  }}
                  transition={{ duration: 0.2 }}
                />

                {/* Edge weight badge for weighted graphs (Dijkstra) */}
                {edge.weight !== undefined && (
                  <g transform={`translate(${midX}, ${midY})`}>
                    <circle r={11} fill="#0f172a" stroke={isMatch ? '#38bdf8' : '#334155'} strokeWidth={1.5} />
                    <text
                      textAnchor="middle"
                      dy="3.5"
                      fill={isMatch ? '#38bdf8' : '#94a3b8'}
                      fontSize="11"
                      fontWeight="700"
                      fontFamily="var(--font-mono)"
                    >
                      {edge.weight}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* ── Nodes ── */}
          {nodes.map(node => {
            const isStart = node.id === start;
            const style = getNodeStyles(node.id, frame, isStart);
            const dist = isDijkstra && frame?.dist ? frame.dist[node.id] : null;
            const isCurrent = frame?.current === node.id;

            return (
              <g key={`node-${node.id}`}>
                {/* Outer animated halo for active node */}
                {isCurrent && (
                  <motion.circle
                    cx={node.x} cy={node.y} r={32}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth={2}
                    strokeDasharray="4,3"
                    initial={{ scale: 0.8, opacity: 0.8 }}
                    animate={{ scale: [1, 1.15, 1], opacity: [0.8, 0.3, 0.8] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                  />
                )}

                {/* Main Node Circle */}
                <motion.circle
                  cx={node.x} cy={node.y} r={24}
                  fill={style.fill.startsWith('linear') ? '#2563eb' : style.fill}
                  stroke={style.stroke}
                  strokeWidth={style.strokeWidth}
                  filter={style.glow ? 'url(#graph-node-glow)' : 'none'}
                  animate={{
                    scale: isCurrent ? 1.12 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                />

                {/* Node Label */}
                <text
                  x={node.x} y={node.y + 4}
                  textAnchor="middle"
                  fill={style.textColor}
                  fontSize="15"
                  fontWeight="800"
                  fontFamily="var(--font-sans)"
                  pointerEvents="none"
                >
                  {node.id}
                </text>

                {/* Status Badge Tag on Top-Right */}
                {style.tag && (
                  <g transform={`translate(${node.x + 16}, ${node.y - 16})`}>
                    <rect
                      x={-16} y={-8}
                      width={style.tag.length > 2 ? 38 : 16} height={16}
                      rx={8}
                      fill={isCurrent ? '#3b82f6' : style.tag === '✓' ? '#059669' : style.tag === 'QUEUED' ? '#d97706' : '#475569'}
                      stroke="#ffffff"
                      strokeWidth={1}
                    />
                    <text
                      x={style.tag.length > 2 ? 3 : -8} y={3.5}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="8.5"
                      fontWeight="900"
                      fontFamily="var(--font-mono)"
                    >
                      {style.tag}
                    </text>
                  </g>
                )}

                {/* Dijkstra Distance Pill underneath */}
                {isDijkstra && dist !== null && (
                  <g transform={`translate(${node.x}, ${node.y + 36})`}>
                    <rect
                      x={-24} y={-9} width={48} height={18} rx={9}
                      fill="#0f172a"
                      stroke={isCurrent ? '#38bdf8' : dist !== Infinity ? '#10b981' : '#334155'}
                      strokeWidth={1.5}
                    />
                    <text
                      textAnchor="middle"
                      dy="3.5"
                      fill={isCurrent ? '#38bdf8' : dist !== Infinity ? '#34d399' : '#64748b'}
                      fontSize="10.5"
                      fontWeight="700"
                      fontFamily="var(--font-mono)"
                    >
                      {dist === Infinity ? 'd: ∞' : `d: ${dist}`}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* ── Data Structure Inspector Bar ── */}
      {frame && (
        <div className="graph-structure-panel">
          {/* Queue / Stack Container */}
          {(type === 'bfs' || type === 'dfs') && (
            <div className="structure-card">
              <span className="structure-card-title">
                {type === 'bfs' ? 'FIFO Queue' : 'LIFO Stack'}
              </span>
              <div className="structure-card-items">
                {(type === 'bfs' ? frame.queue : frame.stack || []).length > 0 ? (
                  (type === 'bfs' ? frame.queue : frame.stack || []).map((item, i) => (
                    <span key={i} className={`structure-item-chip ${i === 0 ? 'head-chip' : ''}`}>
                      {i === 0 && <span className="chip-badge">{type === 'bfs' ? 'FRONT' : 'TOP'}</span>}
                      {item}
                    </span>
                  ))
                ) : (
                  <span className="empty-text">Empty</span>
                )}
              </div>
            </div>
          )}

          {/* Visited Set */}
          <div className="structure-card">
            <span className="structure-card-title">Visited Set</span>
            <div className="structure-card-items">
              {frame.visited && frame.visited.size > 0 ? (
                [...frame.visited].map((item) => (
                  <span key={item} className="structure-item-chip visited-chip">
                    ✓ {item}
                  </span>
                ))
              ) : (
                <span className="empty-text">None</span>
              )}
            </div>
          </div>

          {/* Traversal Order Trail */}
          {frame.order && frame.order.length > 0 && (
            <div className="structure-card order-card">
              <span className="structure-card-title">Traversal Order</span>
              <div className="structure-order-trail">
                {frame.order.map((item, idx) => (
                  <React.Fragment key={item}>
                    <span className="trail-chip">{item}</span>
                    {idx < frame.order.length - 1 && <span className="trail-arrow">➔</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Graph Color Legend ── */}
      <div className="avz-legend">
        {[
          ['bar-comparing', 'Current Node'],
          ['bar-found',     type === 'bfs' ? 'In Queue' : 'In Stack'],
          ['bar-sorted',    'Visited'],
          ['bar-default',   'Unvisited'],
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
