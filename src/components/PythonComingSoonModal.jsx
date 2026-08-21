// src/components/PythonComingSoonModal.jsx — Python Masterclass Preview Modal

import React from 'react';
import { PythonIcon } from './Icons.jsx';
import { PYTHON_PREVIEW_TOPICS } from '../data/cLessons.js';

export default function PythonComingSoonModal({ isOpen, onClose, onSwitchToC }) {
  if (!isOpen) return null;

  return (
    <div className="auth-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="auth-modal-card python-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="auth-modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="python-modal-header">
          <div className="python-logo-badge">
            <PythonIcon size={36} />
          </div>
          <div className="coming-soon-pill">
            <span className="live-pulse-dot" />
            <span>Coming Soon</span>
          </div>
          <h2 className="python-modal-title">Python Interactive Masterclass</h2>
          <p className="python-modal-desc">
            We are actively engineering an interactive Python playground with step-by-step visualizations, memory references, and algorithmic optimization.
          </p>
        </div>

        <div className="python-topics-preview">
          <div className="topics-preview-title">Upcoming Curriculum:</div>
          <div className="topics-preview-list">
            {PYTHON_PREVIEW_TOPICS.map((topic, idx) => (
              <div className="topic-preview-item" key={idx}>
                <span className="topic-num">{idx + 1}.</span>
                <span className="topic-name">{topic.title}</span>
                <span className="topic-tag">{topic.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="python-modal-actions">
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={() => {
              onClose();
              if (onSwitchToC) onSwitchToC();
            }}
          >
            Start Learning C Programming Now (Active) &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
