// src/components/LiveUserCounter.jsx — Top Header Live User Counter Component

import React, { useState, useEffect } from 'react';
import { fetchTotalUserCount } from '../utils/database.js';

export default function LiveUserCounter({ className = '' }) {
  const [userCount, setUserCount] = useState(() => {
    try {
      const saved = localStorage.getItem('algoflowx_sim_user_count');
      const val = saved ? parseInt(saved, 10) : NaN;
      return !isNaN(val) && val >= 120 ? val : 120;
    } catch {
      return 120;
    }
  });
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadCount() {
      const count = await fetchTotalUserCount();
      if (isMounted && typeof count === 'number' && count >= 120) {
        setUserCount((prev) => {
          if (count !== prev) {
            setIsPulsing(true);
            setTimeout(() => {
              if (isMounted) setIsPulsing(false);
            }, 1000);
          }
          try {
            localStorage.setItem('algoflowx_sim_user_count', String(count));
          } catch {}
          return count;
        });
      }
    }

    loadCount();

    // Poll live MongoDB registered count every 20 seconds
    const pollInterval = setInterval(loadCount, 20000);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, []);

  return (
    <div
      className={`live-user-counter-pill ${isPulsing ? 'counter-updated-pulse' : ''} ${className}`}
      title={`${userCount.toLocaleString()} learners and engineers enrolled on AlgoFlowX`}
    >
      <span className="live-pulse-dot" aria-hidden="true" />
      <span className="live-counter-number font-mono">
        {userCount.toLocaleString()}
      </span>
      <span className="live-counter-label">Learners</span>
    </div>
  );
}

