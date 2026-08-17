// src/components/Sidebar.jsx — Sidebar navigation with creator profile card

import React from 'react';
import { ALGORITHMS, CATEGORIES } from '../data/algorithms.js';
import { getAlgoIcon, AlgoFlowXLogo } from './Icons.jsx';

export default function Sidebar({ currentSlug, onSelect }) {
  const grouped = Object.entries(CATEGORIES).map(([catKey, cat]) => ({
    ...cat,
    key: catKey,
    items: ALGORITHMS.filter(a => a.category === catKey),
  }));

  return (
    <aside className="sidebar">
      {/* Top Sidebar Brand Header */}
      <div className="sidebar-brand" onClick={() => onSelect(null)} role="button" tabIndex={0} title="AlgoFlowX Home">
        <div className="sidebar-brand-logo">
          <AlgoFlowXLogo size={26} />
        </div>
        <div className="sidebar-brand-info">
          <div className="sidebar-brand-title">
            <span>AlgoFlow</span>
            <span className="logo-x-accent">X</span>
          </div>
          <span className="sidebar-brand-badge">DSA Visualizer</span>
        </div>
      </div>

      {/* Scrollable Algorithm Navigation */}
      <div className="sidebar-scroll-content">
        {grouped.map(group => (
          <div className="sidebar-category" key={group.key}>
            <div className="sidebar-category-header">
              {group.label}
            </div>
            <div className="sidebar-items">
              {group.items.map(algo => (
                <div
                  key={algo.slug}
                  className={`sidebar-item ${currentSlug === algo.slug ? 'active' : ''}`}
                  onClick={() => onSelect(algo.slug)}
                >
                  <span className="sidebar-item-name">
                    <span className="sidebar-algo-glyph">{getAlgoIcon(algo.slug, 15)}</span>
                    <span>{algo.name}</span>
                  </span>
                  <span className="sidebar-item-complexity">
                    {algo.timeComplexity.average}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Premium Developer Profile Card */}
      <div className="sidebar-footer">
        <div className="dev-profile-card">
          {/* Top: Avatar & Title Header */}
          <a
            href="https://mh-ratul.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="dev-profile-header"
            title="Visit Ratul's Portfolio"
          >
            <div className="dev-avatar-glow-ring">
              <img
                src="/ratul.jpg"
                alt="Ratul"
                className="dev-avatar-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
              <span className="dev-online-beacon" />
            </div>
            <div className="dev-meta">
              <div className="dev-name-row">
                <span className="dev-name">Ratul</span>
                <span className="dev-badge-role">Developer</span>
              </div>
              <span className="dev-portfolio-tag">mh-ratul.vercel.app ↗</span>
            </div>
          </a>

          {/* Social Links Row (LinkedIn, Facebook, Portfolio - Circular Buttons) */}
          <div className="dev-social-row">
            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/mahmud-hasan-ratul-0831b9257"
              target="_blank"
              rel="noopener noreferrer"
              className="dev-social-btn"
              title="LinkedIn Profile"
              aria-label="LinkedIn"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
              </svg>
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/mahmud.hasan.ratul.76669"
              target="_blank"
              rel="noopener noreferrer"
              className="dev-social-btn"
              title="Facebook Profile"
              aria-label="Facebook"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z"/>
              </svg>
            </a>

            {/* Portfolio Website */}
            <a
              href="https://mh-ratul.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="dev-social-btn dev-social-portfolio"
              title="Portfolio Website"
              aria-label="Portfolio"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}
