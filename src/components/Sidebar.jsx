// src/components/Sidebar.jsx — Clean, minimalist sidebar navigation

import { ALGORITHMS, CATEGORIES } from '../data/algorithms.js';

export default function Sidebar({ currentSlug, onSelect }) {
  const grouped = Object.entries(CATEGORIES).map(([catKey, cat]) => ({
    ...cat,
    key: catKey,
    items: ALGORITHMS.filter(a => a.category === catKey),
  }));

  return (
    <aside className="sidebar">
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
    </aside>
  );
}
