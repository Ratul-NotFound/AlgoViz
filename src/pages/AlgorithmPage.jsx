// src/pages/AlgorithmPage.jsx — Clean, user-friendly algorithm workspace

import { useState, useEffect, useCallback } from 'react';
import { useStepper } from '../engine/useStepper.js';
import { getAlgorithm, generateRandomArray, parseCustomArray } from '../data/algorithms.js';
import ArrayVisualizer  from '../visualizers/ArrayVisualizer.jsx';
import GraphVisualizer  from '../visualizers/GraphVisualizer.jsx';
import TreeVisualizer   from '../visualizers/TreeVisualizer.jsx';
import Controls         from '../components/Controls.jsx';
import CodePanel        from '../components/CodePanel.jsx';
import InfoPanel        from '../components/InfoPanel.jsx';
import { DEFAULT_GRAPH as BFS_GRAPH }      from '../algorithms/graphs/bfs.js';
import { DEFAULT_GRAPH as DIJKSTRA_GRAPH } from '../algorithms/graphs/dijkstra.js';

const LEGEND_ITEMS = {
  sorting: [
    { color: 'var(--bar-default)',   label: 'Default' },
    { color: 'var(--bar-comparing)', label: 'Comparing' },
    { color: 'var(--bar-swapping)',  label: 'Swapping' },
    { color: 'var(--bar-sorted)',    label: 'Sorted' },
    { color: 'var(--bar-pivot)',     label: 'Pivot' },
  ],
  searching: [
    { color: 'var(--bar-default)',   label: 'Unchecked' },
    { color: 'var(--bar-comparing)', label: 'Comparing' },
    { color: 'var(--bar-found)',     label: 'Found' },
    { color: 'var(--bar-sorted)',    label: 'Eliminated' },
  ],
};

const MOBILE_TABS = [
  { id: 'visual', label: 'Visualizer' },
  { id: 'code',   label: 'Code' },
  { id: 'info',   label: 'Explanation' },
];

export default function AlgorithmPage({ slug }) {
  const algo = getAlgorithm(slug);

  const [arraySize,    setArraySize]    = useState(15);
  const [inputArray,   setInputArray]   = useState(() => generateRandomArray(15));
  const [customInput,  setCustomInput]  = useState('');
  const [searchTarget, setSearchTarget] = useState('');
  const [inputData,    setInputData]    = useState(null);
  const [mobileTab,    setMobileTab]    = useState('visual');
  const [isMobile,     setIsMobile]     = useState(window.innerWidth <= 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const buildInputData = useCallback((arr, target) => {
    if (!algo) return null;
    const cat = algo.category;
    if (cat === 'sorting')   return [...arr];
    if (cat === 'searching') return { array: [...arr], target: parseInt(target) || arr[3] || arr[0] };
    if (cat === 'graphs')    return slug === 'dijkstra' ? DIJKSTRA_GRAPH : BFS_GRAPH;
    if (cat === 'trees')     return { values: [50, 30, 70, 20, 40, 60, 80], searchVal: 40 };
    return null;
  }, [algo, slug]);

  useEffect(() => {
    if (!algo) return;
    const arr = generateRandomArray(arraySize);
    setInputArray(arr);
    setCustomInput('');
    setSearchTarget('');
    setMobileTab('visual');
    const data = buildInputData(arr, '');
    setInputData(data);
  }, [slug]);

  const stepper = useStepper(algo?.module?.generate, inputData);

  const handleRandomize = useCallback((size) => {
    const n = size || arraySize;
    const arr = generateRandomArray(n);
    setInputArray(arr);
    const data = buildInputData(arr, searchTarget);
    setInputData(data);
    stepper.buildFrames(data);
    stepper.reset();
  }, [arraySize, searchTarget, buildInputData, stepper]);

  const handleApplyCustom = useCallback(() => {
    const arr = parseCustomArray(customInput);
    if (arr.length < 2) return;
    setInputArray(arr);
    setArraySize(arr.length);
    const data = buildInputData(arr, searchTarget);
    setInputData(data);
    stepper.buildFrames(data);
    stepper.reset();
  }, [customInput, searchTarget, buildInputData, stepper]);

  const handleSearch = useCallback(() => {
    const data = buildInputData(inputArray, searchTarget);
    setInputData(data);
    stepper.buildFrames(data);
    stepper.reset();
  }, [inputArray, searchTarget, buildInputData, stepper]);

  if (!algo) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
      Algorithm not found
    </div>
  );

  const frame   = stepper.currentFrame;
  const cat     = algo.category;
  const message = frame?.message || null;

  const leftVisible  = !isMobile || mobileTab === 'visual';
  const rightVisible = !isMobile || mobileTab === 'code' || mobileTab === 'info';

  return (
    <>
      <div className="algo-page">
        {/* ── Left Workspace: Visualizer & Controls ── */}
        <div className={`algo-page-left ${isMobile && !leftVisible ? 'tab-hidden' : ''}`}>
          {/* Step Message Status */}
          <div className="visualizer-message-bar">
            <span className="status-dot" />
            <span>{message || `Click Play to start ${algo.name}`}</span>
          </div>

          {/* Visualizer Area */}
          <div className="visualizer-area">
            {cat === 'sorting' && <ArrayVisualizer frame={frame} type="sorting" />}
            {cat === 'searching' && <ArrayVisualizer frame={frame} type="searching" />}
            {cat === 'graphs' && (
              <GraphVisualizer
                frame={frame}
                graph={slug === 'dijkstra' ? DIJKSTRA_GRAPH : BFS_GRAPH}
                type={slug}
              />
            )}
            {cat === 'trees' && <TreeVisualizer frame={frame} />}

            {stepper.isDone && (
              <div className="done-overlay">
                <div className="done-overlay-text">Algorithm Finished</div>
                <button className="btn btn-primary" onClick={stepper.reset}>
                  Reset & Run Again
                </button>
              </div>
            )}
          </div>

          {/* Legend */}
          {LEGEND_ITEMS[cat] && (
            <div className="legend">
              {LEGEND_ITEMS[cat].map(item => (
                <div className="legend-item" key={item.label}>
                  <div className="legend-dot" style={{ background: item.color }} />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Controls Bar */}
          <Controls
            isPlaying={stepper.isPlaying}
            isDone={stepper.isDone}
            speed={stepper.speed}
            setSpeed={stepper.setSpeed}
            onPlay={stepper.play}
            onPause={stepper.pause}
            onStepForward={stepper.stepForward}
            onStepBackward={stepper.stepBackward}
            onReset={stepper.reset}
            currentIdx={stepper.currentIdx}
            totalFrames={stepper.totalFrames}
            progress={stepper.progress}
            arraySize={arraySize}
            setArraySize={setArraySize}
            onRandomize={() => handleRandomize()}
            customInput={customInput}
            setCustomInput={setCustomInput}
            onApplyCustom={handleApplyCustom}
            searchTarget={searchTarget}
            setSearchTarget={setSearchTarget}
            onSearch={handleSearch}
            type={cat}
          />
        </div>

        {/* ── Right Workspace: Code & Details ── */}
        <div className={`algo-page-right ${isMobile && rightVisible ? 'tab-visible' : ''}`}>
          {(!isMobile || mobileTab === 'code') && (
            <CodePanel
              code={algo.module.CODE}
              activeLine={frame?.codeLine || null}
              title={algo.name}
            />
          )}
          {(!isMobile || mobileTab === 'info') && (
            <InfoPanel
              metadata={algo}
              currentMessage={message}
            />
          )}
        </div>
      </div>

      {/* ── Mobile Navigation Tabs ── */}
      <div className="mobile-tabs">
        <div className="mobile-tab-bar">
          {MOBILE_TABS.map(tab => (
            <button
              key={tab.id}
              className={`mobile-tab-btn ${mobileTab === tab.id ? 'active' : ''}`}
              onClick={() => setMobileTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
