// src/components/LiveUserCounter.jsx — Top Header Live User Counter Component

import React, { useState, useEffect } from 'react';
import { fetchTotalUserCount } from '../utils/supabase.js';

export default function LiveUserCounter() {
  const [userCount, setUserCount] = useState(120);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadCount() {
      const count = await fetchTotalUserCount();
      if (isMounted && typeof count === 'number' && count > 0) {
        setUserCount(count);
      }
    }

    loadCount();

    // Poll count periodically (every 60s)
    const interval = setInterval(loadCount, 60000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className="live-user-counter-pill"
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
