// src/pages/AlgorithmPage.jsx — Resizable, fully dynamic desktop & mobile algorithm workspace

import { useState, useEffect, useCallback, useRef } from 'react';
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

export default function AlgorithmPage({ slug }) {
  const algo = getAlgorithm(slug);

  const [arraySize,    setArraySize]    = useState(15);
  const [inputArray,   setInputArray]   = useState(() => generateRandomArray(15));
  const [customInput,  setCustomInput]  = useState('');
  const [searchTarget, setSearchTarget] = useState('');
  const [inputData,    setInputData]    = useState(null);

  // ── Resizable Splitter State ──
  const [panelWidth, setPanelWidth]     = useState(420);
  const isDraggingRef = useRef(false);

  const startResizing = useCallback((e) => {
    e.preventDefault();
    isDraggingRef.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const onMouseMove = (moveEvent) => {
      if (!isDraggingRef.current) return;
      const newWidth = window.innerWidth - moveEvent.clientX;
      if (newWidth >= 280 && newWidth <= Math.min(window.innerWidth * 0.65, 800)) {
        setPanelWidth(newWidth);
      }
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
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

  return (
    <div
      className="algo-page"
      style={{
        '--right-panel-width': `${panelWidth}px`,
      }}
    >
      {/* ── Left Workspace: Visualizer & Controls ── */}
      <div className="algo-page-left">
        {/* Step Message Status */}
        <div className="visualizer-message-bar">
          <span className="status-dot" />
          <span className="message-text">{message || `Click Play to start ${algo.name}`}</span>
        </div>

        {/* Visualizer Area (Takes full flexible height) */}
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

      {/* ── Draggable Splitter Handle (Desktop) ── */}
      <div
        className="workspace-resizer"
        onMouseDown={startResizing}
        onDoubleClick={() => setPanelWidth(420)}
        title="Drag left/right to resize panels (Double-click to reset)"
      >
        <div className="resizer-handle-line" />
      </div>

      {/* ── Right Workspace: Code & Details ── */}
      <div className="algo-page-right">
        <CodePanel
          code={algo.module.CODE}
          activeLine={frame?.codeLine || null}
          title={algo.name}
        />
        <InfoPanel
          metadata={algo}
          currentMessage={message}
        />
      </div>
    </div>
  );
}
