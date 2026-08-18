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
      <div className="controls-row controls-row-main">
        <div className="controls-playback-group">
          <button className="btn btn-icon" title="Reset (R)" onClick={onReset}>
            <ResetIcon size={16} />
          </button>
          <button className="btn btn-icon" title="Step Back (Left Arrow)" onClick={onStepBackward} disabled={currentIdx === 0}>
            <StepBackIcon size={16} />
          </button>

          {isPlaying ? (
            <button className="btn btn-primary btn-play-main" onClick={onPause}>
              <PauseIcon size={16} />
              <span>Pause</span>
            </button>
          ) : (
            <button className="btn btn-primary btn-play-main" onClick={onPlay} disabled={isDone}>
              <PlayIcon size={16} />
              <span>{isDone ? 'Finished' : 'Play'}</span>
            </button>
          )}

          <button className="btn btn-icon" title="Step Forward (Right Arrow)" onClick={onStepForward} disabled={isDone}>
            <StepForwardIcon size={16} />
          </button>
        </div>

        <div className="controls-status-group">
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

      {(type === 'sorting' || type === 'searching' || type === 'datastructures' || type === 'trees') && (
        <div className="controls-row controls-row-config">
          <div className="size-control">
            <span>Size:</span>
            <input
              type="range"
              className="slider"
              min={type === 'datastructures' ? 2 : type === 'trees' ? 3 : 5}
              max={type === 'datastructures' ? 10 : type === 'trees' ? 15 : 35}
              step={1}
              value={arraySize}
              onChange={e => {
                const val = parseInt(e.target.value);
                setArraySize(val);
                onRandomize && onRandomize(val);
              }}
            />
            <span className="control-val-badge">{arraySize}</span>
          </div>

          <div className="config-inputs">
            <input
              className="custom-input"
              placeholder={
                type === 'searching'
                  ? 'Custom array (e.g. 10, 20, 30, 40, 50)'
                  : type === 'trees'
                  ? 'Node values (e.g. 50, 30, 70, 20, 40)'
                  : 'Custom elements (e.g. 50, 20, 80, 10, 40)'
              }
              value={customInput}
              onChange={e => setCustomInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onApplyCustom();
                }
              }}
            />
            {(type === 'searching' || type === 'trees') && (
              <input
                className="target-input"
                placeholder={type === 'trees' ? 'Search value' : 'Target'}
                type="number"
                value={searchTarget}
                onChange={e => setSearchTarget(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    onApplyCustom();
                  }
                }}
              />
            )}
            <div className="config-buttons-group">
              <button className="btn btn-action" onClick={onApplyCustom} title="Apply custom array (or press Enter)">
                Apply
              </button>
              <button className="btn btn-action btn-random" onClick={onRandomize} title="Generate random array">
                <ShuffleIcon size={15} />
                <span>Random</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
