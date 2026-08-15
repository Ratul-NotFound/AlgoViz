// src/components/Controls.jsx — Clean, user-friendly playback controls

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
      {/* Progress Bar */}
      <div className="step-progress">
        <div className="step-progress-bar" style={{ width: `${progress}%` }} />
      </div>

      {/* Main Playback Row */}
      <div className="controls-row">
        <button className="btn btn-icon" title="Reset" onClick={onReset}>
          ⏮
        </button>
        <button className="btn btn-icon" title="Previous Step" onClick={onStepBackward} disabled={currentIdx === 0}>
          ⏪
        </button>

        {isPlaying ? (
          <button className="btn btn-primary" onClick={onPause} style={{ minWidth: 90 }}>
            Pause
          </button>
        ) : (
          <button className="btn btn-primary" onClick={onPlay} disabled={isDone} style={{ minWidth: 90 }}>
            {isDone ? 'Completed' : 'Play'}
          </button>
        )}

        <button className="btn btn-icon" title="Next Step" onClick={onStepForward} disabled={isDone}>
          ⏩
        </button>

        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
          {currentIdx + 1} / {totalFrames}
        </span>

        {/* Speed Slider */}
        <div className="speed-control" style={{ marginLeft: 'auto' }}>
          <span>Speed:</span>
          <input
            type="range"
            className="slider"
            min={0.25} max={4} step={0.25}
            value={speed}
            onChange={e => setSpeed(parseFloat(e.target.value))}
          />
          <span style={{ fontFamily: 'var(--font-mono)', minWidth: 28 }}>{speed}x</span>
        </div>
      </div>

      {/* Array Configuration Row */}
      {(type === 'sorting' || type === 'searching') && (
        <div className="controls-row">
          {type === 'sorting' && (
            <div className="size-control">
              <span>Size:</span>
              <input
                type="range"
                className="slider"
                min={5} max={40} step={1}
                value={arraySize}
                onChange={e => {
                  const val = parseInt(e.target.value);
                  setArraySize(val);
                  onRandomize && onRandomize(val);
                }}
              />
              <span style={{ fontFamily: 'var(--font-mono)', minWidth: 20 }}>{arraySize}</span>
            </div>
          )}

          <div style={{ display: 'flex', gap: 6, flex: 1, alignItems: 'center' }}>
            <input
              className="custom-input"
              placeholder="Custom array (e.g. 45, 12, 89, 23)"
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
