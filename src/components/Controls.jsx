// src/components/Controls.jsx — Professional playback controls with standard SVG icons

import {
  PlayIcon,
  PauseIcon,
  StepForwardIcon,
  StepBackIcon,
  ResetIcon,
  ShuffleIcon,
} from './Icons.jsx';

export default function Controls({
  isPlaying, isDone, speed, setSpeed,
  onPlay, onPause, onStepForward, onStepBackward, onReset,
  currentIdx, totalFrames, progress,
  arraySize, setArraySize,
  onRandomize, customInput, setCustomInput, onApplyCustom,
  searchTarget, setSearchTarget,
  type = 'sorting',
}) {
  return (
    <div className="controls-bar">
      {/* ── Step Progress Track ── */}
      <div className="step-progress">
        <div className="step-progress-bar" style={{ width: `${progress}%` }} />
      </div>

      {/* ── Row 1: Playback Controls & Frame Status ── */}
      <div className="controls-row" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="btn btn-icon" title="Reset (R)" onClick={onReset}>
            <ResetIcon size={18} />
          </button>
          <button className="btn btn-icon" title="Step Back (Left Arrow)" onClick={onStepBackward} disabled={currentIdx === 0}>
            <StepBackIcon size={18} />
          </button>

          {isPlaying ? (
            <button className="btn btn-primary" onClick={onPause}>
              <PauseIcon size={18} />
              <span>Pause</span>
            </button>
          ) : (
            <button className="btn btn-primary" onClick={onPlay} disabled={isDone}>
              <PlayIcon size={18} />
              <span>{isDone ? 'Finished' : 'Play'}</span>
            </button>
          )}

          <button className="btn btn-icon" title="Step Forward (Right Arrow)" onClick={onStepForward} disabled={isDone}>
            <StepForwardIcon size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span className="step-counter-text">
            Step {currentIdx + 1} / {totalFrames}
          </span>

          <div className="speed-control">
            <span>Speed:</span>
            <input
              type="range"
              className="slider"
              min={0.25} max={4} step={0.25}
              value={speed}
              onChange={e => setSpeed(parseFloat(e.target.value))}
            />
            <span className="control-val-badge">{speed}x</span>
          </div>
        </div>
      </div>

      {/* ── Row 2: Array & Data Configuration ── */}
      {(type === 'sorting' || type === 'searching' || type === 'datastructures') && (
        <div className="controls-row" style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
          {type === 'sorting' && (
            <div className="size-control">
              <span>Size:</span>
              <input
                type="range"
                className="slider"
                min={5} max={35} step={1}
                value={arraySize}
                onChange={e => {
                  const val = parseInt(e.target.value);
                  setArraySize(val);
                  onRandomize && onRandomize(val);
                }}
              />
              <span className="control-val-badge">{arraySize}</span>
            </div>
          )}

          <div className="config-inputs">
            <input
              className="custom-input"
              placeholder="Custom elements (e.g. 50, 20, 80, 10, 40)"
              value={customInput}
              onChange={e => setCustomInput(e.target.value)}
            />
            {type === 'searching' && (
              <input
                className="target-input"
                placeholder="Target"
                type="number"
                value={searchTarget}
                onChange={e => setSearchTarget(e.target.value)}
              />
            )}
            <button className="btn btn-action" onClick={onApplyCustom}>Apply</button>
            <button className="btn btn-action btn-random" onClick={onRandomize}>
              <ShuffleIcon size={16} />
              <span>Random</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
