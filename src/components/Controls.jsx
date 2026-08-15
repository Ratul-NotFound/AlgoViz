// src/components/Controls.jsx
// Playback controls bar

export default function Controls({
  isPlaying, isDone, speed, setSpeed,
  onPlay, onPause, onStepForward, onStepBackward, onReset,
  currentIdx, totalFrames, progress,
  // Array-specific
  arraySize, setArraySize,
  onRandomize, customInput, setCustomInput, onApplyCustom,
  // Search-specific
  searchTarget, setSearchTarget, onSearch,
  // Type
  type = 'sorting',
}) {
  return (
    <div className="controls-bar">
      {/* Progress bar */}
      <div className="step-progress">
        <div className="step-progress-bar" style={{ width: `${progress}%` }} />
      </div>

      {/* Main playback row */}
      <div className="controls-row">
        <button className="btn btn-icon tooltip" data-tip="Reset" onClick={onReset}>⏮</button>
        <button className="btn btn-icon tooltip" data-tip="Step Back" onClick={onStepBackward} disabled={currentIdx === 0}>
          ⏪
        </button>

        {isPlaying ? (
          <button className="btn btn-primary btn-icon" onClick={onPause} style={{ minWidth: 100 }}>
            ⏸ Pause
          </button>
        ) : (
          <button className="btn btn-primary btn-icon" onClick={onPlay} disabled={isDone} style={{ minWidth: 100 }}>
            {isDone ? '✅ Done' : '▶ Play'}
          </button>
        )}

        <button className="btn btn-icon tooltip" data-tip="Step Forward" onClick={onStepForward} disabled={isDone}>
          ⏩
        </button>

        <div style={{ fontFamily: 'var(--font-code)', fontSize: 12, color: 'var(--text-muted)' }}>
          {currentIdx + 1} / {totalFrames}
        </div>

        {/* Speed control */}
        <div className="speed-control">
          <span>🐢</span>
          <input
            type="range"
            className="slider"
            min={0.25} max={4} step={0.25}
            value={speed}
            onChange={e => setSpeed(parseFloat(e.target.value))}
          />
          <span>🐇</span>
          <span style={{ fontFamily: 'var(--font-code)', fontSize: 12, minWidth: 32 }}>{speed}x</span>
        </div>
      </div>

      {/* Array / Search controls */}
      {(type === 'sorting' || type === 'searching') && (
        <div className="controls-row">
          {type === 'sorting' && (
            <div className="size-control">
              <span>Size:</span>
              <input
                type="range"
                className="slider"
                min={5} max={50} step={1}
                value={arraySize}
                onChange={e => { setArraySize(parseInt(e.target.value)); onRandomize && onRandomize(parseInt(e.target.value)); }}
              />
              <span style={{ fontFamily: 'var(--font-code)', fontSize: 12 }}>{arraySize}</span>
            </div>
          )}

          <div className="input-row" style={{ flex: 1 }}>
            <input
              className="custom-input"
              placeholder={type === 'searching' ? "Enter array (e.g. 10,30,5,20,40)" : "Custom array (e.g. 64,34,25,12)"}
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
            <button className="btn btn-danger" onClick={onRandomize}>🎲 Random</button>
          </div>
        </div>
      )}
    </div>
  );
}
