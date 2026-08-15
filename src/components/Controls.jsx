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
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button className="btn btn-icon" title="Reset (R)" onClick={onReset}>
            <ResetIcon size={13} />
          </button>
          <button className="btn btn-icon" title="Step Back (Left Arrow)" onClick={onStepBackward} disabled={currentIdx === 0}>
            <StepBackIcon size={13} />
          </button>

          {isPlaying ? (
            <button className="btn btn-primary" onClick={onPause} style={{ minWidth: 84 }}>
              <PauseIcon size={13} />
              <span>Pause</span>
            </button>
          ) : (
            <button className="btn btn-primary" onClick={onPlay} disabled={isDone} style={{ minWidth: 84 }}>
              <PlayIcon size={13} />
              <span>{isDone ? 'Finished' : 'Play'}</span>
            </button>
          )}

          <button className="btn btn-icon" title="Step Forward (Right Arrow)" onClick={onStepForward} disabled={isDone}>
            <StepForwardIcon size={13} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
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
            <span style={{ fontFamily: 'var(--font-mono)', minWidth: 26, color: 'var(--text-main)' }}>{speed}x</span>
          </div>
        </div>
      </div>

      {/* ── Row 2: Array & Data Configuration ── */}
      {(type === 'sorting' || type === 'searching') && (
        <div className="controls-row" style={{ borderTop: '1px solid var(--border)', paddingTop: 8 }}>
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
              <span style={{ fontFamily: 'var(--font-mono)', minWidth: 18, color: 'var(--text-main)' }}>{arraySize}</span>
            </div>
          )}

          <div style={{ display: 'flex', gap: 6, flex: 1, alignItems: 'center' }}>
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
            <button className="btn" onClick={onApplyCustom}>Apply</button>
            <button className="btn" onClick={onRandomize}>
              <ShuffleIcon size={12} />
              <span>Random</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
