// src/components/AnalogyIllustrations.jsx — Hyper-Visual Real-Life Analogies for All 23 C Chapters
import React, { useState } from 'react';

export default function AnalogyIllustrations({ chapter }) {
  // Shared interactive states
  const [boxName, setBoxName] = useState('studentAge');
  const [boxType, setBoxType] = useState('int');
  const [boxValue, setBoxValue] = useState('20');
  const [boxAddress] = useState('0x7ffd14');
  const [safeLocked, setSafeLocked] = useState(true);
  const [blendNumber, setBlendNumber] = useState(5);
  const [switchA, setSwitchA] = useState(true);
  const [switchB, setSwitchB] = useState(false);
  const [circuitMode, setCircuitMode] = useState('AND');
  const [trainScore, setTrainScore] = useState(88);
  const [nestDolls, setNestDolls] = useState(4);
  const [hotelRoom, setHotelRoom] = useState(101);

  return (
    <div className="real-life-analogy-scene-wrapper">
      {/* ── CHAPTER 1: Industrial Assembly Line ── */}
      {chapter === 1 && (
        <div className="real-scene-canvas">
          <div className="scene-badge">🏭 REAL-LIFE ANALOGY: The Industrial Manufacturing Assembly Line</div>
          <p className="scene-sub">
            Writing C code is like putting raw metal parts into an automated assembly factory. Your text passes through 4 specialized machines to produce a finished, roaring racecar engine!
          </p>

          <div className="factory-scene-grid">
            <div className="factory-step-card">
              <div className="step-graphic">
                <span className="graphic-icon">📋</span>
                <span className="step-tag">Raw Material</span>
              </div>
              <div className="step-name font-mono">1. source.c</div>
              <div className="step-expl">Human blueprints with headers and comments.</div>
            </div>

            <div className="factory-conveyor-arrow">
              <span className="conveyor-belt">⚙️⚙️</span>
              <span className="arrow-lbl">Preprocessor</span>
            </div>

            <div className="factory-step-card">
              <div className="step-graphic">
                <span className="graphic-icon">🧹</span>
                <span className="step-tag">Refined Parts</span>
              </div>
              <div className="step-name font-mono">2. source.i</div>
              <div className="step-expl">Headers expanded, comments cleaned away.</div>
            </div>

            <div className="factory-conveyor-arrow">
              <span className="conveyor-belt">⚙️⚙️</span>
              <span className="arrow-lbl">Compiler</span>
            </div>

            <div className="factory-step-card">
              <div className="step-graphic">
                <span className="graphic-icon">🔩</span>
                <span className="step-tag">Mechanical Specs</span>
              </div>
              <div className="step-name font-mono">3. source.s</div>
              <div className="step-expl">Architecture-specific Assembly blueprints.</div>
            </div>

            <div className="factory-conveyor-arrow">
              <span className="conveyor-belt">⚙️⚙️</span>
              <span className="arrow-lbl">Assembler</span>
            </div>

            <div className="factory-step-card">
              <div className="step-graphic">
                <span className="graphic-icon">📦</span>
                <span className="step-tag">Assembled Engine</span>
              </div>
              <div className="step-name font-mono">4. source.o</div>
              <div className="step-expl">Raw binary machine code object module.</div>
            </div>

            <div className="factory-conveyor-arrow">
              <span className="conveyor-belt">⚙️⚙️</span>
              <span className="arrow-lbl">Linker</span>
            </div>

            <div className="factory-step-card finished-engine">
              <div className="step-graphic">
                <span className="graphic-icon">🏎️</span>
                <span className="step-tag text-success">Finished Racecar!</span>
              </div>
              <div className="step-name font-mono">5. program.exe</div>
              <div className="step-expl">Standalone native binary ready to race on CPU!</div>
            </div>
          </div>
        </div>
      )}

      {/* ── CHAPTER 2: The Physical Delivery Storage Box ── */}
      {chapter === 2 && (
        <div className="real-scene-canvas">
          <div className="scene-badge">📦 REAL-LIFE ANALOGY: The Delivery Storage Box in the Memory Warehouse</div>
          <p className="scene-sub">
            A <strong>variable</strong> is a physical cardboard box with a shipping label (name), a container size limit (type), and actual items packed inside (value).
          </p>

          <div className="real-box-stage">
            <div className={`real-cardboard-box box-${boxType}`}>
              <div className="shipping-label-sticker">
                <div className="label-top-row">
                  <span className="courier-logo">📦 RAM EXPRESS</span>
                  <span className="tracking-no font-mono">{boxAddress}</span>
                </div>
                <div className="label-main-content">
                  <div className="label-field">
                    <span className="lbl-title">VARIABLE NAME:</span>
                    <strong className="lbl-val font-mono">{boxName}</strong>
                  </div>
                  <div className="label-field">
                    <span className="lbl-title">CONTAINER TYPE:</span>
                    <strong className="lbl-val font-mono">
                      {boxType} ({boxType === 'char' ? '1 Byte (8 bits)' : boxType === 'double' ? '8 Bytes (64 bits)' : '4 Bytes (32 bits)'})
                    </strong>
                  </div>
                </div>
                <div className="label-barcode">||| | |||| | ||||| ||| | ||</div>
              </div>

              <div className="cardboard-flaps-wrapper">
                <div className="box-cavity">
                  <div className="physical-item-token">
                    <span className="item-token-icon">
                      {boxType === 'char' ? '🔤' : boxType === 'float' || boxType === 'double' ? '💧' : '🔢'}
                    </span>
                    <span className="item-token-val font-mono">
                      {boxType === 'char' ? `'${boxValue[0] || 'A'}'` : boxValue}
                    </span>
                    <span className="item-token-label">Item Packed in RAM</span>
                  </div>
                </div>
              </div>

              <div className="warehouse-floor-tile font-mono">
                <span>📍 Warehouse Floor Coordinate: </span>
                <strong className="text-accent">{boxAddress}</strong>
              </div>
            </div>

            <div className="box-customizer-panel">
              <div className="panel-title">🎮 Pack Your Own Memory Box:</div>
              <div className="panel-input-group">
                <label>1. Shipping Label (Variable Name):</label>
                <input
                  type="text"
                  className="real-input font-mono"
                  value={boxName}
                  onChange={(e) => setBoxName(e.target.value || 'myVar')}
                  maxLength={16}
                />
              </div>

              <div className="panel-input-group">
                <label>2. Box Capacity &amp; Type:</label>
                <select
                  className="real-select font-mono"
                  value={boxType}
                  onChange={(e) => setBoxType(e.target.value)}
                >
                  <option value="int">int — Standard Box (4 Bytes, Whole Numbers)</option>
                  <option value="float">float — Fluid Container (4 Bytes, Decimals)</option>
                  <option value="double">double — Heavy Crate (8 Bytes, High Precision)</option>
                  <option value="char">char — Matchbox (1 Byte, Single Letter)</option>
                </select>
              </div>

              <div className="panel-input-group">
                <label>3. Pack Items Inside (Value):</label>
                <input
                  type="text"
                  className="real-input font-mono"
                  value={boxValue}
                  onChange={(e) => setBoxValue(e.target.value)}
                  maxLength={12}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CHAPTER 3 & 4: Padlocked Bank Safe vs Kitchen Juice Blender ── */}
      {(chapter === 3 || chapter === 4) && (
        <div className="real-scene-canvas">
          <div className="scene-badge">🗿 REAL-LIFE ANALOGY: Padlocked Bank Safe vs Kitchen Juice Blender</div>
          <p className="scene-sub">
            A <strong>constant</strong> is like a bank vault with a welded padlock (cannot be changed after locking). <strong>Type casting</strong> is like putting whole integer apples into a blender to pour smooth decimal juice.
          </p>

          <div className="safe-blender-grid">
            <div className="real-object-card safe-card">
              <div className="card-header-tag">🔒 THE IMMUTABLE BANK SAFE (const)</div>
              <div className="vault-door-graphic">
                <div className="vault-dial">⚙️</div>
                <div className="vault-plate font-mono">const float PI = 3.14159f;</div>
                <div className="vault-status font-mono text-warning">
                  {safeLocked ? '🔒 WELDED SHUT — READ ONLY' : 'ERROR: CANNOT UNLOCK CONST!'}
                </div>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-xs btn-block"
                style={{ marginTop: '12px' }}
                onClick={() => setSafeLocked((s) => !s)}
              >
                Try Reassigning: PI = 3.0 🚫
              </button>
            </div>

            <div className="real-object-card blender-card">
              <div className="card-header-tag">🍹 THE DECIMAL BLENDER ((float) Type Cast)</div>
              <div className="blender-body">
                <div className="blender-top font-mono">Whole Apples in: {blendNumber} 🍎</div>
                <div className="blender-blades">⚡ 🌀 BLENDING WITH (float) 🌀 ⚡</div>
                <div className="blender-pitcher font-mono text-success">
                  {blendNumber} / 2 = <strong>{(blendNumber / 2).toFixed(2)} cups</strong> of Juice! 🥤
                </div>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-xs btn-block"
                style={{ marginTop: '12px' }}
                onClick={() => setBlendNumber((n) => (n % 10) + 1)}
              >
                Blend Next Apple Count ({blendNumber + 1}) 🍎
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CHAPTER 5 & 6: Electrical Wall Switches & Lightbulb Circuits ── */}
      {(chapter === 5 || chapter === 6) && (
        <div className="real-scene-canvas">
          <div className="scene-badge">💡 REAL-LIFE ANALOGY: Electrical Wall Switches &amp; Lightbulb Circuits</div>
          <p className="scene-sub">
            Bitwise and logical operators are like electrical wall switches wired to a room ceiling bulb. In <strong>AND (Series)</strong>, both switches must be ON for the bulb to glow. In <strong>OR (Parallel)</strong>, either switch turns on the light!
          </p>

          <div className="switchboard-stage">
            <div className="circuit-mode-selector">
              <button
                type="button"
                className={`btn-mode-tab ${circuitMode === 'AND' ? 'active' : ''}`}
                onClick={() => setCircuitMode('AND')}
              >
                🔌 AND Circuit (&& / &amp;) — Series Wiring
              </button>
              <button
                type="button"
                className={`btn-mode-tab ${circuitMode === 'OR' ? 'active' : ''}`}
                onClick={() => setCircuitMode('OR')}
              >
                ⚡ OR Circuit (|| / |) — Parallel Wiring
              </button>
            </div>

            <div className="circuit-diagram-board">
              <div className="switches-row">
                <button
                  type="button"
                  className={`wall-switch-btn ${switchA ? 'switch-on' : 'switch-off'}`}
                  onClick={() => setSwitchA((s) => !s)}
                >
                  <span className="switch-lever" />
                  <span className="switch-name font-mono">Switch A ({switchA ? '1 / ON' : '0 / OFF'})</span>
                </button>

                <span className="circuit-connector">
                  {circuitMode === 'AND' ? '──[AND Wire]──' : '══[OR Rail]══'}
                </span>

                <button
                  type="button"
                  className={`wall-switch-btn ${switchB ? 'switch-on' : 'switch-off'}`}
                  onClick={() => setSwitchB((s) => !s)}
                >
                  <span className="switch-lever" />
                  <span className="switch-name font-mono">Switch B ({switchB ? '1 / ON' : '0 / OFF'})</span>
                </button>
              </div>

              {(() => {
                const bulbLit = circuitMode === 'AND' ? switchA && switchB : switchA || switchB;
                return (
                  <div className={`ceiling-bulb-box ${bulbLit ? 'bulb-glowing' : 'bulb-dark'}`}>
                    <span className="bulb-icon">{bulbLit ? '💡' : '🌑'}</span>
                    <span className="bulb-status font-mono">
                      Output Bulb: {bulbLit ? '✨ GLOWING (1 / TRUE)' : 'OFF (0 / FALSE)'}
                    </span>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ── CHAPTER 7: Stadium Megaphone vs Postal Mail Slot ── */}
      {chapter === 7 && (
        <div className="real-scene-canvas">
          <div className="scene-badge">📢 REAL-LIFE ANALOGY: Stadium Megaphone (printf) vs Postal Mail Funnel (scanf)</div>
          <p className="scene-sub">
            <strong>printf</strong> broadcasts messages to the screen. <strong>scanf</strong> drops incoming keyboard letters into a specific memory address (<strong>&amp;poBox</strong>).
          </p>

          <div className="real-io-scene-grid">
            <div className="io-real-card megaphone-card">
              <div className="card-top-icon">📢</div>
              <div className="card-headline">printf("Hello, %s!", name);</div>
              <div className="card-mockup-display">
                <div className="stadium-jumbotron font-mono">
                  [ STADIUM JUMBOTRON SCREEN ]<br />
                  &gt;&gt; WELCOME USER #1042 &lt;&lt;
                </div>
              </div>
              <p className="card-desc">Streams formatted text from RAM onto the monitor screen.</p>
            </div>

            <div className="io-real-card mailbox-card">
              <div className="card-top-icon">📮</div>
              <div className="card-headline">scanf("%d", &amp;age);</div>
              <div className="card-mockup-display">
                <div className="po-box-funnel font-mono">
                  Incoming Letter ✉️ [42]<br />
                  &darr; Drops into PO Box Slot &darr;<br />
                  <strong className="text-accent">Address: &amp;age (Slot #742)</strong>
                </div>
              </div>
              <p className="card-desc">Needs the exact postal address (&amp;) to store user inputs into RAM!</p>
            </div>
          </div>
        </div>
      )}

      {/* ── CHAPTER 8 & 9: Railway Track Switcher & Elevator Dispatcher ── */}
      {(chapter === 8 || chapter === 9) && (
        <div className="real-scene-canvas">
          <div className="scene-badge">🚂 REAL-LIFE ANALOGY: Railway Track Switcher &amp; Elevator Dispatcher</div>
          <p className="scene-sub">
            A conditional <strong>if-else</strong> statement is like a mechanical railway switch on a train line. An <strong>elevator button switch</strong> instantly routes directly to the requested floor!
          </p>

          <div className="railway-scene-wrapper">
            <div className="train-controller-bar">
              <label>Incoming Sensor Score: <span className="font-mono font-bold text-primary">{trainScore} pts</span></label>
              <input
                type="range"
                min="50"
                max="100"
                value={trainScore}
                onChange={(e) => setTrainScore(Number(e.target.value))}
              />
            </div>

            <div className="railway-tracks-visual">
              <div className="main-incoming-track font-mono">
                🚂 Train Approaching Switch ━━━━━━━━
              </div>

              <div className="track-branches-column">
                <div className={`rail-branch ${trainScore >= 90 ? 'rail-active' : ''}`}>
                  <span className="signal-light">{trainScore >= 90 ? '🟢' : '🔴'}</span>
                  <span className="branch-label font-mono">Track 1 (score &gt;= 90): 🏆 Platform A+ (Honors)</span>
                </div>
                <div className={`rail-branch ${trainScore >= 75 && trainScore < 90 ? 'rail-active' : ''}`}>
                  <span className="signal-light">{trainScore >= 75 && trainScore < 90 ? '🟢' : '🔴'}</span>
                  <span className="branch-label font-mono">Track 2 (score &gt;= 75): 🌟 Platform A (Passing)</span>
                </div>
                <div className={`rail-branch ${trainScore < 75 ? 'rail-active' : ''}`}>
                  <span className="signal-light">{trainScore < 75 ? '🟢' : '🔴'}</span>
                  <span className="branch-label font-mono">Track 3 (else): 🔄 Platform B (Review)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CHAPTER 10, 11 & 12: Treadmill Laps & Bricklayer Pattern ── */}
      {(chapter === 10 || chapter === 11 || chapter === 12) && (
        <div className="real-scene-canvas">
          <div className="scene-badge">🏃 REAL-LIFE ANALOGY: Treadmill Lap Runner &amp; Emergency Stop Key</div>
          <p className="scene-sub">
            A <strong>loop</strong> is running laps around a stadium track. <strong>break</strong> is pulling the emergency stop cord to end your workout early; <strong>continue</strong> is taking a shortcut past one hurdle to start the next lap!
          </p>

          <div className="scope-comparison-grid">
            <div className="scope-card local-card">
              <div className="scope-tag">🔁 Loop Iteration Cycle</div>
              <div className="scope-val font-mono">i++ Lap Counter</div>
              <div className="scope-desc">Repeats the exact same block of code automatically until the condition fails.</div>
            </div>

            <div className="scope-card static-card">
              <div className="scope-tag">🛑 Emergency Stop (break)</div>
              <div className="scope-val font-mono text-danger">Instant Exit</div>
              <div className="scope-desc">Aborts remaining iterations immediately and continues executing code below.</div>
            </div>
          </div>
        </div>
      )}

      {/* ── CHAPTER 13 & 14: Egg Carton Compartments & Chessboard Grid ── */}
      {(chapter === 13 || chapter === 14) && (
        <div className="real-scene-canvas">
          <div className="scene-badge">🥚 REAL-LIFE ANALOGY: Egg Carton Compartments &amp; Apartment Postboxes</div>
          <p className="scene-sub">
            An <strong>array</strong> is an egg carton where every egg gets its own indexed slot (0, 1, 2...). A <strong>2D matrix</strong> is an entire mailroom wall of apartment postboxes arranged in rows and columns!
          </p>

          <div className="scope-comparison-grid">
            <div className="scope-card local-card">
              <div className="scope-tag">📦 1D Array (Egg Carton)</div>
              <div className="scope-val font-mono">arr[i]</div>
              <div className="scope-desc">Sequential row of identical slots stored side-by-side in computer memory.</div>
            </div>

            <div className="scope-card static-card">
              <div className="scope-tag">🏢 2D Matrix (Apartment Mailbox)</div>
              <div className="scope-val font-mono text-success">matrix[row][col]</div>
              <div className="scope-desc">2D coordinate grid stored sequentially in RAM using row-major order.</div>
            </div>
          </div>
        </div>
      )}

      {/* ── CHAPTER 15 & 16: Freight Train with Red Caboose Stop Signal ── */}
      {(chapter === 15 || chapter === 16) && (
        <div className="real-scene-canvas">
          <div className="scene-badge">🚂 REAL-LIFE ANALOGY: The Freight Train with Red Caboose Stop Signal (\0)</div>
          <p className="scene-sub">
            A <strong>string in C</strong> is a train where each wagon carries one character letter. The final wagon is always a bright red <strong>Caboose ('\0')</strong> that tells the computer: <em>"Stop reading, string ends here!"</em>
          </p>

          <div className="string-tape-display">
            {['C', 'O', 'D', 'E'].map((c, i) => (
              <div key={i} className="char-cell">
                <div className="char-idx font-mono">Wagon #{i}</div>
                <div className="char-val font-mono">'{c}'</div>
                <div className="char-ascii font-mono">Letter</div>
              </div>
            ))}
            <div className="char-cell null-term-cell">
              <div className="char-idx font-mono">Wagon #4</div>
              <div className="char-val font-mono">'\0'</div>
              <div className="char-ascii font-mono">🔴 CABOOSE (STOP)</div>
            </div>
          </div>
        </div>
      )}

      {/* ── CHAPTER 17 & 18: Russian Matryoshka Nesting Dolls (Recursion) ── */}
      {(chapter === 17 || chapter === 18) && (
        <div className="real-scene-canvas">
          <div className="scene-badge">🪆 REAL-LIFE ANALOGY: Russian Matryoshka Nesting Dolls (Recursion)</div>
          <p className="scene-sub">
            <strong>Recursion</strong> is opening a large Russian doll only to find a smaller doll inside. You keep opening smaller dolls until you hit the solid wooden doll at the center (<strong>Base Case</strong>), then assemble them all back together!
          </p>

          <div className="slider-group" style={{ marginBottom: '14px' }}>
            <label>Nesting Depth: <span className="font-mono font-bold text-primary">{nestDolls} dolls</span></label>
            <input
              type="range"
              min="1"
              max="5"
              value={nestDolls}
              onChange={(e) => setNestDolls(Number(e.target.value))}
            />
          </div>

          <div className="call-stack-frames-wrapper">
            <div className="stack-container">
              {Array.from({ length: nestDolls }).map((_, idx) => (
                <div key={idx} className={`stack-frame-box ${idx === nestDolls - 1 ? 'base-frame' : ''}`}>
                  <span className="frame-func font-mono">🪆 Doll #{nestDolls - idx}</span>
                  <span className="frame-status">{idx === nestDolls - 1 ? '🎯 Solid Mini Doll (Base Case)' : 'Contains smaller doll inside'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── CHAPTER 19 & 20: Real Estate Address Card & Hotel Room Key ── */}
      {(chapter === 19 || chapter === 20) && (
        <div className="real-scene-canvas">
          <div className="scene-badge">🗝️ REAL-LIFE ANALOGY: Hotel Room Keycard &amp; GPS Address Card</div>
          <p className="scene-sub">
            A <strong>pointer</strong> does not store actual furniture; it stores the <em>Room Number</em> (memory address). Using the dereference operator (<strong>*p</strong>) is unlocking the door to sit on the furniture inside!
          </p>

          <div className="pointer-link-visual">
            <div className="pointer-box">
              <div className="box-title">🗝️ Keycard: int *p</div>
              <div className="box-val font-mono text-accent">Room #{hotelRoom}</div>
              <div className="box-sub">Holds address coordinate</div>
            </div>

            <div className="pointer-glowing-arrow">&rarr; Unlocks Door &rarr;</div>

            <div className="target-variable-box">
              <div className="box-title">🏨 Room #{hotelRoom}</div>
              <div className="box-addr font-mono">Address: 0x7ffd{hotelRoom}</div>
              <div className="box-val font-mono text-success">Value = 42</div>
              <div className="box-sub">Furniture stored in room</div>
            </div>
          </div>
        </div>
      )}

      {/* ── CHAPTER 21, 22 & 23: Identity Badge & Hotel Room Reservation Desk ── */}
      {(chapter >= 21) && (
        <div className="real-scene-canvas">
          <div className="scene-badge">🪪 REAL-LIFE ANALOGY: Employee Identity Badge &amp; Hotel Concierge (malloc/free)</div>
          <p className="scene-sub">
            A <strong>struct</strong> groups a person's photo, ID, and name onto one lanyard badge. <strong>malloc()</strong> asks the hotel concierge to rent a room for your stay; <strong>free()</strong> checks out and returns the key so the room can be cleaned for the next guest!
          </p>

          <div className="scope-comparison-grid">
            <div className="scope-card local-card">
              <div className="scope-tag">🪪 struct Record (Lanyard Badge)</div>
              <div className="scope-val font-mono">.id, .name, .gpa</div>
              <div className="scope-desc">Packages multiple variables into a single unified record block in memory.</div>
            </div>

            <div className="scope-card static-card">
              <div className="scope-tag">🛎️ malloc() &amp; free() Concierge</div>
              <div className="scope-val font-mono text-success">Heap Reservation</div>
              <div className="scope-desc">Rent dynamic memory during runtime and release it cleanly to avoid memory leaks.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
