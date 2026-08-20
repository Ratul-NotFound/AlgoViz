// src/components/Icons.jsx — Standard UI icons and official language & algorithm logos

import React from 'react';

// ── Standard UI Controls & Brand Logo ──
export function AlgoFlowXLogo({ size = 28, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="afxG1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="afxG2" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
        <linearGradient id="afxBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="10" fill="url(#afxBg)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.2" />
      <path
        d="M10 30 C 13 30, 17 24, 20 20 C 23 16, 27 10, 30 10"
        stroke="url(#afxG1)"
        strokeWidth="4.2"
        strokeLinecap="round"
      />
      <path
        d="M10 10 C 13 10, 17 16, 20 20 C 23 24, 27 30, 30 30"
        stroke="url(#afxG2)"
        strokeWidth="4.2"
        strokeLinecap="round"
      />
      <circle cx="20" cy="20" r="2.2" fill="#ffffff" />
    </svg>
  );
}

export function PlayIcon({ size = 14, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

export function PauseIcon({ size = 14, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  );
}

export function StepForwardIcon({ size = 14, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="5 4 15 12 5 20 5 4" fill="currentColor" />
      <line x1="19" y1="5" x2="19" y2="19" />
    </svg>
  );
}

export function StepBackIcon({ size = 14, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="19 20 9 12 19 4 19 20" fill="currentColor" />
      <line x1="5" y1="19" x2="5" y2="5" />
    </svg>
  );
}

export function ResetIcon({ size = 14, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

export function SunIcon({ size = 14, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

export function MoonIcon({ size = 14, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function CopyIcon({ size = 13, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

export function CheckIcon({ size = 13, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function SearchIcon({ size = 14, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export function ShuffleIcon({ size = 13, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="16 3 21 3 21 8" />
      <line x1="4" y1="20" x2="21" y2="3" />
      <polyline points="21 16 21 21 16 21" />
      <line x1="15" y1="15" x2="21" y2="21" />
      <line x1="4" y1="4" x2="9" y2="9" />
    </svg>
  );
}

export function CodeIcon({ size = 14, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

export function InfoIcon({ size = 14, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

export function ArrowRightIcon({ size = 14, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export function MenuIcon({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

// ── Official Programming Language Logos ──

export function PythonIcon({ size = 14, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M11.91 2C6.98 2 7.29 4.14 7.29 4.14L7.3 6.35H12V7.02H5.16C3.12 7.02 2 8.24 2 10.98C2 13.72 3.03 14.86 5.16 14.86H6.62V12.78C6.62 10.27 8.78 8.16 11.3 8.16H15.93C16.89 8.16 17.67 7.37 17.67 6.41V4.14C17.67 4.14 17.5 2 11.91 2ZM9.62 3.42C10.23 3.42 10.72 3.91 10.72 4.52C10.72 5.13 10.23 5.62 9.62 5.62C9.01 5.62 8.52 5.13 8.52 4.52C8.52 3.91 9.01 3.42 9.62 3.42Z"
        fill="#38bdf8"
      />
      <path
        d="M12.09 22C17.02 22 16.71 19.86 16.71 19.86L16.7 17.65H12V16.98H18.84C20.88 16.98 22 15.76 22 13.02C22 10.28 20.97 9.14 18.84 9.14H17.38V11.22C17.38 13.73 15.22 15.84 12.7 15.84H8.07C7.11 15.84 6.33 16.63 6.33 17.59V19.86C6.33 19.86 6.5 22 12.09 22ZM14.38 20.58C13.77 20.58 13.28 20.09 13.28 19.48C13.28 18.87 13.77 18.38 14.38 18.38C14.99 18.38 15.48 18.87 15.48 19.48C15.48 20.09 14.99 20.58 14.38 20.58Z"
        fill="#facc15"
      />
    </svg>
  );
}

export function CIcon({ size = 14, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect width="24" height="24" rx="5" fill="#1e3a8a" />
      <path
        d="M16.5 8.5C15.5 7 13.8 6.2 12 6.2C8.7 6.2 6.2 8.7 6.2 12C6.2 15.3 8.7 17.8 12 17.8C13.8 17.8 15.5 17 16.5 15.5"
        stroke="#60a5fa"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CppIcon({ size = 14, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect width="24" height="24" rx="5" fill="#0369a1" />
      <path
        d="M12.5 8C11.5 6.8 10 6.2 8.5 6.2C5.5 6.2 3.5 8.5 3.5 12C3.5 15.5 5.5 17.8 8.5 17.8C10 17.8 11.5 17.2 12.5 16"
        stroke="#38bdf8"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Plus 1 */}
      <path d="M15 10V14M13 12H17" stroke="#e0f2fe" strokeWidth="1.8" strokeLinecap="round" />
      {/* Plus 2 */}
      <path d="M20 10V14M18 12H22" stroke="#e0f2fe" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function JavaIcon({ size = 14, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect width="24" height="24" rx="5" fill="#450a0a" />
      {/* Coffee Steam */}
      <path d="M10 4C9 6 13 8 11 10M14 3C13 5 17 7 15 9" stroke="#f87171" strokeWidth="1.6" strokeLinecap="round" />
      {/* Cup Body */}
      <path d="M6 12H16V17C16 19.2 14.2 21 12 21H10C7.8 21 6 19.2 6 17V12Z" fill="#ef4444" />
      <path d="M16 13H18C19.1 13 20 13.9 20 15C20 16.1 19.1 17 18 17H16" stroke="#fca5a5" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function JSIcon({ size = 14, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect width="24" height="24" rx="5" fill="#facc15" />
      <path d="M8 11V16.5C8 17.3 7.3 18 6.5 18C5.7 18 5 17.3 5 16.5" stroke="#1e293b" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M13 18C15 18 17 17.2 17 15.5C17 13.2 13 13.5 13 12C13 11.2 14 10.5 15.5 10.5C16.5 10.5 17.5 11 17.8 11.5" stroke="#1e293b" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

// ── Algorithm Representing Logos / Visual Glyphs ──

export function getAlgoIcon(slug, size = 16) {
  switch (slug) {
    case 'bubble-sort':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="8" cy="14" r="5" fill="#fb7185" fillOpacity="0.4" stroke="#f43f5e" strokeWidth="1.8" />
          <circle cx="16" cy="9" r="6.5" fill="#f43f5e" stroke="#fda4af" strokeWidth="1.8" />
          <path d="M6 10L10 6M10 6L14 10" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'selection-sort':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="3" y="14" width="4" height="8" rx="1.5" fill="#f43f5e" />
          <rect x="9" y="10" width="4" height="12" rx="1.5" fill="#334155" />
          <rect x="15" y="6" width="4" height="16" rx="1.5" fill="#334155" />
          {/* Target Min Indicator */}
          <circle cx="5" cy="6" r="3.5" stroke="#38bdf8" strokeWidth="1.8" />
          <path d="M5 2V4M5 8V10M1 6H3M7 6H9" stroke="#38bdf8" strokeWidth="1.5" />
        </svg>
      );
    case 'insertion-sort':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="3" y="12" width="4" height="10" rx="1.5" fill="#10b981" />
          <rect x="9" y="8" width="4" height="14" rx="1.5" fill="#10b981" />
          <rect x="17" y="5" width="4" height="17" rx="1.5" fill="#fb7185" />
          <path d="M19 2L15 6M19 2L23 6" stroke="#fb7185" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'merge-sort':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="4" r="3" fill="#60a5fa" />
          <circle cx="6" cy="14" r="3" fill="#34d399" />
          <circle cx="18" cy="14" r="3" fill="#34d399" />
          <path d="M12 7L6 11M12 7L18 11" stroke="#60a5fa" strokeWidth="1.6" />
          <path d="M6 17L12 21L18 17" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'quick-sort':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="10" y="4" width="4" height="16" rx="1.5" fill="#a855f7" />
          <path d="M8 8L3 12L8 16" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 8L21 12L16 16" stroke="#f43f5e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'heap-sort':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <polygon points="12 3 3 20 21 20" stroke="#f59e0b" strokeWidth="1.8" fill="rgba(245, 158, 11, 0.2)" strokeLinejoin="round" />
          <circle cx="12" cy="8" r="2.5" fill="#f59e0b" />
          <circle cx="8" cy="16" r="2" fill="#fbbf24" />
          <circle cx="16" cy="16" r="2" fill="#fbbf24" />
        </svg>
      );
    case 'linear-search':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="2" y="16" width="3" height="6" rx="1" fill="#334155" />
          <rect x="7" y="13" width="3" height="9" rx="1" fill="#334155" />
          <rect x="12" y="9" width="3" height="13" rx="1" fill="#0ea5e9" />
          <rect x="17" y="15" width="3" height="7" rx="1" fill="#334155" />
          <circle cx="13.5" cy="6" r="4" stroke="#38bdf8" strokeWidth="1.8" />
          <path d="M16.5 9L20 12.5" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'binary-search':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="2" y="10" width="20" height="4" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="1.2" />
          <circle cx="12" cy="12" r="5" fill="#0ea5e9" stroke="#bae6fd" strokeWidth="2" />
          <path d="M4 6V18M20 6V18" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'bfs':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="3" fill="#10b981" />
          <circle cx="12" cy="12" r="7" stroke="#34d399" strokeWidth="1.4" strokeDasharray="3,2" />
          <circle cx="12" cy="12" r="10.5" stroke="#10b981" strokeWidth="1.2" strokeDasharray="4,3" />
        </svg>
      );
    case 'dfs':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="4" r="2.5" fill="#10b981" />
          <circle cx="6" cy="12" r="2.5" fill="#34d399" />
          <circle cx="6" cy="20" r="2.5" fill="#6ee7b7" />
          <path d="M12 6.5L6 10M6 14.5V17.5" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
          <path d="M12 6.5L18 12" stroke="#334155" strokeWidth="1.4" />
        </svg>
      );
    case 'dijkstra':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="4" cy="12" r="3" fill="#38bdf8" />
          <circle cx="20" cy="6" r="3" fill="#10b981" />
          <circle cx="12" cy="18" r="2.5" fill="#64748b" />
          <path d="M7 11L17 7" stroke="#38bdf8" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M6 14L10 17M14 17L18 8" stroke="#334155" strokeWidth="1.4" />
        </svg>
      );
    case 'bst':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="4" r="3" fill="#a855f7" stroke="#c084fc" strokeWidth="1.2" />
          <circle cx="6" cy="13" r="2.5" fill="#7c3aed" />
          <circle cx="18" cy="13" r="2.5" fill="#7c3aed" />
          <circle cx="3" cy="20" r="2" fill="#6d28d9" />
          <path d="M10 6L7 11M14 6L17 11M5 15L4 18" stroke="#a855f7" strokeWidth="1.5" />
        </svg>
      );
    case 'stack':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="4" y="16" width="16" height="4" rx="1.5" fill="#38bdf8" />
          <rect x="4" y="10" width="16" height="4" rx="1.5" fill="#818cf8" />
          <rect x="4" y="4" width="16" height="4" rx="1.5" fill="#c084fc" stroke="#e879f9" strokeWidth="1.2" />
        </svg>
      );
    case 'queue':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="3" y="6" width="5" height="12" rx="1.5" fill="#34d399" />
          <rect x="10" y="6" width="5" height="12" rx="1.5" fill="#38bdf8" />
          <rect x="17" y="6" width="5" height="12" rx="1.5" fill="#6366f1" />
        </svg>
      );
    case 'linked-list':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="2" y="7" width="8" height="10" rx="2" fill="#38bdf8" />
          <rect x="14" y="7" width="8" height="10" rx="2" fill="#818cf8" />
          <path d="M10 12H13.5M12 9.5L14.5 12L12 14.5" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'doubly-linked-list':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="2" y="7" width="7" height="10" rx="1.5" fill="#38bdf8" />
          <rect x="15" y="7" width="7" height="10" rx="1.5" fill="#818cf8" />
          <path d="M9 10H15M13 8L15 10L13 12" stroke="#38bdf8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15 14H9M11 12L9 14L11 16" stroke="#818cf8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'circular-queue':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="8" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="6 3" />
          <circle cx="12" cy="4" r="2" fill="#10b981" />
          <circle cx="18" cy="16" r="2" fill="#818cf8" />
        </svg>
      );
    case 'binary-heap':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="4" r="2.5" fill="#f59e0b" />
          <circle cx="6" cy="12" r="2.2" fill="#38bdf8" />
          <circle cx="18" cy="12" r="2.2" fill="#38bdf8" />
          <circle cx="4" cy="19" r="2" fill="#818cf8" />
          <circle cx="8" cy="19" r="2" fill="#818cf8" />
          <path d="M10.5 5.5L7.5 10M13.5 5.5L16.5 10M5.5 14L4.5 17M6.5 14L7.5 17" stroke="#64748b" strokeWidth="1.2" />
        </svg>
      );
    case 'hash-table':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="7" height="4" rx="1" fill="#38bdf8" />
          <rect x="3" y="10" width="7" height="4" rx="1" fill="#818cf8" />
          <rect x="3" y="16" width="7" height="4" rx="1" fill="#38bdf8" />
          <path d="M10 6H15M10 12H18M10 18H14" stroke="#64748b" strokeWidth="1.5" />
          <circle cx="17" cy="6" r="2" fill="#10b981" />
          <circle cx="20" cy="12" r="2" fill="#f43f5e" />
          <circle cx="16" cy="18" r="2" fill="#10b981" />
        </svg>
      );
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="#3b82f6" strokeWidth="1.8" />
          <polyline points="12 6 12 12 16 14" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
  }
}

// ── Google Brand & Auth Icons ──
export function GoogleIcon({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function BookmarkIcon({ size = 15, filled = false, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export function CheckCircleIcon({ size = 15, filled = false, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

export function UserIcon({ size = 16, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export function LogOutIcon({ size = 15, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

