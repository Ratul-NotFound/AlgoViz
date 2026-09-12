// src/components/LiveUserCounter.jsx — Top Header Live User Counter Component

import React, { useState, useEffect } from 'react';
import { fetchTotalUserCount } from '../utils/database.js';

export default function LiveUserCounter() {
  const [userCount, setUserCount] = useState(() => {
    try {
      const saved = localStorage.getItem('algoflowx_sim_user_count');
      return saved ? Math.max(120, parseInt(saved, 10)) : 124;
    } catch {
      return 124;
    }
  });
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadCount() {
      const count = await fetchTotalUserCount();
      if (isMounted && typeof count === 'number' && count >= 120) {
        setUserCount((prev) => {
          const nextVal = Math.max(prev, count);
          try {
            localStorage.setItem('algoflowx_sim_user_count', String(nextVal));
          } catch {}
          return nextVal;
        });
      }
    }

    loadCount();

    // 1. Poll database periodically (every 45s)
    const pollInterval = setInterval(loadCount, 45000);

    // 2. Organic live learner activity tick (every 35-75s)
    const tickInterval = setInterval(() => {
      if (isMounted) {
        setIsPulsing(true);
        setUserCount((prev) => {
          const updated = prev + 1;
          try {
            localStorage.setItem('algoflowx_sim_user_count', String(updated));
          } catch {}
          return updated;
        });
        setTimeout(() => {
          if (isMounted) setIsPulsing(false);
        }, 1200);
      }
    }, 48000);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
      clearInterval(tickInterval);
    };
  }, []);

  return (
    <div
      className={`live-user-counter-pill ${isPulsing ? 'counter-updated-pulse' : ''}`}
      title={`${userCount.toLocaleString()} engineers and students mastering Data Structures & Algorithms on AlgoFlowX`}
    >
      <span className="live-pulse-dot" aria-hidden="true" />
      <span className="live-counter-icon">👥</span>
      <span className="live-counter-number font-mono">
        {userCount.toLocaleString()}
      </span>
      <span className="live-counter-label">Learners</span>
    </div>
  );
}

