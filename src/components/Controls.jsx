// src/components/Controls.jsx — Structured, properly aligned playback controls

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
      {/* ── Progress Track ── */}
      <div className="step-progress">
        <div className="step-progress-bar" style={{ width: `${progress}%` }} />
      </div>

      {/* ── Row 1: Playback Navigation ── */}
      <div className="controls-row" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button className="btn btn-icon" title="Reset to Start" onClick={onReset}>
            ⏮
          </button>
          <button className="btn btn-icon" title="Step Back" onClick={onStepBackward} disabled={currentIdx === 0}>
            ⏪
          </button>

          {isPlaying ? (
            <button className="btn btn-primary" onClick={onPause} style={{ minWidth: 84 }}>
              Pause
            </button>
          ) : (
            <button className="btn btn-primary" onClick={onPlay} disabled={isDone} style={{ minWidth: 84 }}>
              {isDone ? 'Finished' : 'Play'}
            </button>
          )}

          <button className="btn btn-icon" title="Step Forward" onClick={onStepForward} disabled={isDone}>
            ⏩
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
            {currentIdx + 1} / {totalFrames}
          </span>

          <div className="speed-control">
            <span>Speed</span>
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

      {/* ── Row 2: Array / Data Controls ── */}
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
              placeholder="Custom array (e.g. 50, 20, 80, 10, 40)"
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
            <button className="btn" onClick={onRandomize}>Randomize</button>
          </div>
        </div>
      )}
    </div>
  );
}
