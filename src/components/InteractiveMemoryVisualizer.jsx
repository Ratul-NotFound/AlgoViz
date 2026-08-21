// src/components/InteractiveMemoryVisualizer.jsx — Rich, Interactive Graphical Visualizer for All 23 C Chapters
import React, { useState } from 'react';

export default function InteractiveMemoryVisualizer({ chapter, slug }) {
  // Shared interactive states
  const [pipelineStage, setPipelineStage] = useState(0);
  const [ramType, setRamType] = useState('int');
  const [castNum, setCastNum] = useState(7);
  const [castDenom, setCastDenom] = useState(2);
  const [bitRegA, setBitRegA] = useState([0, 0, 0, 0, 1, 1, 0, 1]); // 13
  const [bitRegB, setBitRegB] = useState([0, 0, 0, 0, 0, 1, 1, 0]); // 6
  const [bitOp, setBitOp] = useState('AND');
  const [flowScore, setFlowScore] = useState(85);
  const [switchVal, setSwitchVal] = useState(2);
  const [loopStep, setLoopStep] = useState(0);
  const [loopMax] = useState(5);
  const [matrixHoverCell, setMatrixHoverCell] = useState(null);
  const [stringText, setStringText] = useState('AlgoFlowX');
  const [scopeCallCount, setScopeCallCount] = useState(1);
  const [recurseN, setRecurseN] = useState(4);
  const [pointerVal, setPointerVal] = useState(42);
  const [pointerAddr] = useState('0x7ffd24');
  const [ptrOffset, setPtrOffset] = useState(0);
  const [heapBlocks, setHeapBlocks] = useState([
    { id: 1, size: '16 bytes', type: 'int[4]', freed: false },
    { id: 2, size: '32 bytes', type: 'double[4]', freed: false },
  ]);
  const [fileMode, setFileMode] = useState('w');

  // Compilation Pipeline definitions
  const compilationStages = [
    {
      name: '1. Source Code (.c)',
      desc: 'Human-readable C code with #include headers and comments.',
      badge: 'C Text',
      code: '#include <stdio.h>\nint main() {\n    // Print greeting\n    printf("Hello C!\\n");\n    return 0;\n}',
      color: '#3b82f6',
    },
    {
      name: '2. Preprocessed (.i)',
      desc: 'Headers expanded, macros replaced, comments stripped away.',
      badge: 'Expanded C',
      code: '// <stdio.h> declarations inserted here (1000+ lines)\nextern int printf(const char *format, ...);\n\nint main() {\n    printf("Hello C!\\n");\n    return 0;\n}',
      color: '#eab308',
    },
    {
      name: '3. Assembly (.s)',
      desc: 'Translated to low-level CPU assembly language instructions.',
      badge: 'Assembly',
      code: '.globl  main\nmain:\n    pushq   %rbp\n    movq    %rsp, %rbp\n    leaq    .LC0(%rip), %rdi\n    call    printf@PLT\n    movl    $0, %eax\n    popq    %rbp\n    ret',
      color: '#a855f7',
    },
    {
      name: '4. Binary Object (.o)',
      desc: 'Assembled into raw CPU binary machine code.',
      badge: 'Machine Code',
      code: '01111111 01000101 01001100 01000110 (ELF Header)\n01010101 01001000 10001001 11100101 (push %rbp)\n01001000 10001101 00111101 00000000 (lea .LC0)\n11101000 00000000 00000000 00000000 (call printf)',
      color: '#06b6d4',
    },
    {
      name: '5. Executable Binary (.exe)',
      desc: 'Linked with libc runtime library into a final standalone executable.',
      badge: 'Runnable Binary',
      code: '=== READY TO EXECUTE BY OS LOADER ===\nMemory Address: 0x00400000 (Entry Point)\nLinked with: libc.so.6 / msvcrt.dll\nOutput: "Hello C!"',
      color: '#10b981',
    },
  ];

  // Helper for Bitwise calculations
  const bitsToNum = (bits) => bits.reduce((acc, bit, idx) => acc + bit * Math.pow(2, 7 - idx), 0);
  const numA = bitsToNum(bitRegA);
  const numB = bitsToNum(bitRegB);

  const getAluResultBits = () => {
    return bitRegA.map((bitA, idx) => {
      const bitB = bitRegB[idx];
      if (bitOp === 'AND') return bitA & bitB;
      if (bitOp === 'OR') return bitA | bitB;
      if (bitOp === 'XOR') return bitA ^ bitB;
      return 0;
    });
  };

  const aluResultBits = getAluResultBits();
  const aluResultNum = bitsToNum(aluResultBits);

  const toggleBitA = (idx) => {
    setBitRegA((prev) => {
      const copy = [...prev];
      copy[idx] = copy[idx] === 1 ? 0 : 1;
      return copy;
    });
  };

  const toggleBitB = (idx) => {
    setBitRegB((prev) => {
      const copy = [...prev];
      copy[idx] = copy[idx] === 1 ? 0 : 1;
      return copy;
    });
  };

  return (
    <div className="memory-visualizer-container">
      {/* ── CHAPTER 1: Compilation Pipeline Visualizer ── */}
      {chapter === 1 && (
        <div className="vis-widget-card">
          <div className="vis-widget-header">
            <span className="vis-widget-icon">⚡</span>
            <div>
              <h3 className="vis-widget-title">Interactive C Compilation Pipeline</h3>
              <p className="vis-widget-desc">Click any stage below to inspect the transformation of your C code into executable machine binary.</p>
            </div>
          </div>

          <div className="pipeline-stepper-bar">
            {compilationStages.map((stg, idx) => (
              <button
                key={idx}
                type="button"
                className={`pipeline-step-node ${pipelineStage === idx ? 'active' : ''}`}
                onClick={() => setPipelineStage(idx)}
                style={{ borderColor: pipelineStage === idx ? stg.color : 'var(--border)' }}
              >
                <span className="step-num font-mono">{idx + 1}</span>
                <span className="step-label">{stg.badge}</span>
              </button>
            ))}
          </div>

          <div className="pipeline-stage-viewer">
            <div className="stage-info-bar">
              <span className="stage-title" style={{ color: compilationStages[pipelineStage].color }}>
                {compilationStages[pipelineStage].name}
              </span>
              <span className="stage-desc">{compilationStages[pipelineStage].desc}</span>
            </div>
            <div className="stage-code-window">
              <pre className="font-mono"><code>{compilationStages[pipelineStage].code}</code></pre>
            </div>
          </div>
        </div>
      )}

      {/* ── CHAPTER 2: Escape Characters & Execution Lifecycle ── */}
      {chapter === 2 && (
        <div className="vis-widget-card">
          <div className="vis-widget-header">
            <span className="vis-widget-icon">⚙️</span>
            <div>
              <h3 className="vis-widget-title">C Program Execution Lifecycle &amp; Escape Sequences</h3>
              <p className="vis-widget-desc">See how main() initiates, prints escape characters to terminal, and signals completion via return 0.</p>
            </div>
          </div>

          <div className="io-pipeline-visual">
            <div className="io-node io-stdin">
              <div className="io-node-title">🚀 OS Loader</div>
              <div className="io-data font-mono">Calls main()</div>
              <div className="io-note">Entry point</div>
            </div>
            <div className="io-arrow">&rarr; printf("Line 1\\n\\tLine 2") &rarr;</div>
            <div className="io-node io-stdout">
              <div className="io-node-title">🖥️ Terminal (stdout)</div>
              <div className="io-data font-mono">Line 1<br />&nbsp;&nbsp;&nbsp;&nbsp;Line 2</div>
              <div className="io-note">Tab + Newline applied</div>
            </div>
            <div className="io-arrow">&rarr; return 0; &rarr;</div>
            <div className="io-node io-memory">
              <div className="io-node-title">✅ Exit Status</div>
              <div className="io-data font-mono text-success">Code: 0</div>
              <div className="io-note">SUCCESS to OS</div>
            </div>
          </div>
        </div>
      )}

      {/* ── CHAPTER 3: RAM Memory Byte Grid & Data Types ── */}
      {chapter === 3 && (
        <div className="vis-widget-card">
          <div className="vis-widget-header">
            <span className="vis-widget-icon">🧠</span>
            <div>
              <h3 className="vis-widget-title">Interactive RAM Byte Grid &amp; Data Type Layout</h3>
              <p className="vis-widget-desc">Select a data type to see how many contiguous bytes it occupies in computer RAM.</p>
            </div>
          </div>

          <div className="vis-type-selector-row">
            {['char', 'int', 'float', 'double', 'unsigned int'].map((t) => (
              <button
                key={t}
                type="button"
                className={`btn-type-pill ${ramType === t ? 'active' : ''}`}
                onClick={() => setRamType(t)}
              >
                {t} ({t === 'char' ? '1B' : t === 'double' ? '8B' : '4B'})
              </button>
            ))}
          </div>

          <div className="ram-memory-grid">
            {Array.from({ length: 8 }).map((_, byteIdx) => {
              const occupiedBytes = ramType === 'char' ? 1 : ramType === 'double' ? 8 : 4;
              const isOccupied = byteIdx < occupiedBytes;
              return (
                <div
                  key={byteIdx}
                  className={`ram-byte-cell ${isOccupied ? 'occupied' : 'empty'}`}
                >
                  <div className="byte-addr font-mono">0x100{byteIdx}</div>
                  <div className="byte-content font-mono">
                    {isOccupied ? (ramType === 'char' ? "'A'" : `B${byteIdx}`) : '0x00'}
                  </div>
                  <div className="byte-label">
                    {isOccupied ? `Byte ${byteIdx + 1}` : 'Free RAM'}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="ram-summary-callout">
            <span className="font-mono text-primary font-bold">{ramType}</span> occupies{' '}
            <strong>{ramType === 'char' ? '1 byte (8 bits)' : ramType === 'double' ? '8 bytes (64 bits)' : '4 bytes (32 bits)'}</strong> in memory.
          </div>
        </div>
      )}

      {/* ── CHAPTER 4: Integer Division vs Type Casting Scale ── */}
      {chapter === 4 && (
        <div className="vis-widget-card">
          <div className="vis-widget-header">
            <span className="vis-widget-icon">⚖️</span>
            <div>
              <h3 className="vis-widget-title">Live Integer Division vs Type Casting Comparison</h3>
              <p className="vis-widget-desc">Adjust numerator and denominator to see why integer division truncates decimals in C.</p>
            </div>
          </div>

          <div className="vis-slider-controls">
            <div className="slider-group">
              <label>Numerator (a): <span className="font-mono font-bold text-primary">{castNum}</span></label>
              <input
                type="range"
                min="1"
                max="20"
                value={castNum}
                onChange={(e) => setCastNum(Number(e.target.value))}
              />
            </div>
            <div className="slider-group">
              <label>Denominator (b): <span className="font-mono font-bold text-primary">{castDenom}</span></label>
              <input
                type="range"
                min="1"
                max="10"
                value={castDenom}
                onChange={(e) => setCastDenom(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="casting-comparison-grid">
            <div className="cast-box wrong-box">
              <div className="cast-box-tag text-danger">⚠️ Raw Integer Division: a / b</div>
              <div className="cast-code font-mono">int res = {castNum} / {castDenom};</div>
              <div className="cast-result-val font-mono text-danger">
                {Math.floor(castNum / castDenom)}
              </div>
              <div className="cast-note">Decimal part dropped! Truncated to whole integer.</div>
            </div>

            <div className="cast-box correct-box">
              <div className="cast-box-tag text-success">✅ Explicit Type Cast: (float)a / b</div>
              <div className="cast-code font-mono">float res = (float){castNum} / {castDenom};</div>
              <div className="cast-result-val font-mono text-success">
                {(castNum / castDenom).toFixed(2)}
              </div>
              <div className="cast-note">Full floating-point decimal precision preserved!</div>
            </div>
          </div>
        </div>
      )}

      {/* ── CHAPTER 5: 8-Bit Bitwise ALU Sandbox ── */}
      {chapter === 5 && (
        <div className="vis-widget-card">
          <div className="vis-widget-header">
            <span className="vis-widget-icon">⚡</span>
            <div>
              <h3 className="vis-widget-title">Live 8-Bit Bitwise ALU &amp; Arithmetic Sandbox</h3>
              <p className="vis-widget-desc">Click any bit to toggle (0 or 1) and select an operator to inspect hardware bit calculation.</p>
            </div>
          </div>

          <div className="alu-register-row">
            <span className="reg-label font-mono">Reg A ({numA}):</span>
            <div className="bits-strip">
              {bitRegA.map((b, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`bit-toggle-btn ${b === 1 ? 'bit-on' : 'bit-off'}`}
                  onClick={() => toggleBitA(idx)}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div className="alu-op-selector">
            {['AND', 'OR', 'XOR'].map((op) => (
              <button
                key={op}
                type="button"
                className={`btn-alu-op ${bitOp === op ? 'active' : ''}`}
                onClick={() => setBitOp(op)}
              >
                {op} ({op === 'AND' ? '&' : op === 'OR' ? '|' : '^'})
              </button>
            ))}
          </div>

          <div className="alu-register-row">
            <span className="reg-label font-mono">Reg B ({numB}):</span>
            <div className="bits-strip">
              {bitRegB.map((b, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`bit-toggle-btn ${b === 1 ? 'bit-on' : 'bit-off'}`}
                  onClick={() => toggleBitB(idx)}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div className="alu-result-card">
            <div className="result-header">
              <span>ALU Output: A {bitOp === 'AND' ? '&' : bitOp === 'OR' ? '|' : '^'} B = </span>
              <strong className="font-mono text-primary">{aluResultNum}</strong>
            </div>
            <div className="bits-strip">
              {aluResultBits.map((b, idx) => (
                <div key={idx} className={`bit-toggle-btn ${b === 1 ? 'bit-on' : 'bit-off'} bit-res`}>
                  {b}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── CHAPTER 6: Relational & Logical Operators ── */}
      {chapter === 6 && (
        <div className="vis-widget-card">
          <div className="vis-widget-header">
            <span className="vis-widget-icon">🌲</span>
            <div>
              <h3 className="vis-widget-title">Relational Logic Gates &amp; Short-Circuit Evaluation</h3>
              <p className="vis-widget-desc">Test compound logical expressions (&&, ||, !) with instant boolean resolution.</p>
            </div>
          </div>

          <div className="decision-tree-grid">
            <div className="tree-branch-node active">
              <div className="branch-cond font-mono">(A &gt; 5) &amp;&amp; (B &lt; 10)</div>
              <div className="branch-result">Both must be TRUE for entire expression to pass (1)</div>
            </div>
            <div className="tree-branch-node active">
              <div className="branch-cond font-mono">(A == 0) || (B != 0)</div>
              <div className="branch-result">If first condition is TRUE, second is skipped! (Short-Circuit)</div>
            </div>
          </div>
        </div>
      )}

      {/* ── CHAPTER 7: Formatted I/O Stream Simulator ── */}
      {chapter === 7 && (
        <div className="vis-widget-card">
          <div className="vis-widget-header">
            <span className="vis-widget-icon">📥</span>
            <div>
              <h3 className="vis-widget-title">I/O Stream Buffer &amp; Address Pointer Flow</h3>
              <p className="vis-widget-desc">Visualizes how scanf reads bytes into memory addresses and printf writes formatted text to stdout.</p>
            </div>
          </div>

          <div className="io-pipeline-visual">
            <div className="io-node io-stdin">
              <div className="io-node-title">⌨️ stdin Buffer</div>
              <div className="io-data font-mono">"42\n"</div>
              <div className="io-note">Keyboard stream</div>
            </div>
            <div className="io-arrow">&rarr; scanf("%d", &amp;age) &rarr;</div>
            <div className="io-node io-memory">
              <div className="io-node-title">🧠 Memory Cell (&amp;age)</div>
              <div className="io-addr font-mono text-accent">0x7ffd18</div>
              <div className="io-data font-mono text-success">42</div>
              <div className="io-note">4 bytes stored</div>
            </div>
            <div className="io-arrow">&rarr; printf("%04d", age) &rarr;</div>
            <div className="io-node io-stdout">
              <div className="io-node-title">🖥️ stdout Terminal</div>
              <div className="io-data font-mono text-warning">0042</div>
              <div className="io-note">Formatted output</div>
            </div>
          </div>
        </div>
      )}

      {/* ── CHAPTER 8: Decision Flowchart Tree ── */}
      {chapter === 8 && (
        <div className="vis-widget-card">
          <div className="vis-widget-header">
            <span className="vis-widget-icon">🌲</span>
            <div>
              <h3 className="vis-widget-title">Interactive Decision Logic Flowchart</h3>
              <p className="vis-widget-desc">Drag the score slider to watch the active decision branch light up in real time!</p>
            </div>
          </div>

          <div className="slider-group" style={{ marginBottom: '16px' }}>
            <label>Student Score: <span className="font-mono font-bold text-primary">{flowScore}</span></label>
            <input
              type="range"
              min="0"
              max="100"
              value={flowScore}
              onChange={(e) => setFlowScore(Number(e.target.value))}
            />
          </div>

          <div className="decision-tree-grid">
            <div className={`tree-branch-node ${flowScore >= 90 ? 'active' : ''}`}>
              <div className="branch-cond font-mono">if (score &gt;= 90)</div>
              <div className="branch-result">🏆 Grade A+ (Honors)</div>
            </div>
            <div className={`tree-branch-node ${flowScore >= 80 && flowScore < 90 ? 'active' : ''}`}>
              <div className="branch-cond font-mono">else if (score &gt;= 80)</div>
              <div className="branch-result">🌟 Grade A (Distinction)</div>
            </div>
            <div className={`tree-branch-node ${flowScore >= 70 && flowScore < 80 ? 'active' : ''}`}>
              <div className="branch-cond font-mono">else if (score &gt;= 70)</div>
              <div className="branch-result">👍 Grade B (Proficient)</div>
            </div>
            <div className={`tree-branch-node ${flowScore < 70 ? 'active' : ''}`}>
              <div className="branch-cond font-mono">else</div>
              <div className="branch-result">🔄 Grade C / Retake</div>
            </div>
          </div>
        </div>
      )}

      {/* ── CHAPTER 9: Switch-Case Dispatcher ── */}
      {chapter === 9 && (
        <div className="vis-widget-card">
          <div className="vis-widget-header">
            <span className="vis-widget-icon">🎛️</span>
            <div>
              <h3 className="vis-widget-title">Switch-Case Jump Table Dispatcher</h3>
              <p className="vis-widget-desc">Select a case value to see the CPU perform an instant O(1) jump table branch!</p>
            </div>
          </div>

          <div className="vis-type-selector-row">
            {[1, 2, 3, 99].map((val) => (
              <button
                key={val}
                type="button"
                className={`btn-type-pill ${switchVal === val ? 'active' : ''}`}
                onClick={() => setSwitchVal(val)}
              >
                {val === 99 ? 'Other (default)' : `Case ${val}`}
              </button>
            ))}
          </div>

          <div className="decision-tree-grid">
            <div className={`tree-branch-node ${switchVal === 1 ? 'active' : ''}`}>
              <div className="branch-cond font-mono">case 1: printf("Start Engine\\n"); break;</div>
              <div className="branch-result">🚀 Engine Started</div>
            </div>
            <div className={`tree-branch-node ${switchVal === 2 ? 'active' : ''}`}>
              <div className="branch-cond font-mono">case 2: printf("Diagnostic Check\\n"); break;</div>
              <div className="branch-result">🔍 All Systems Nominal</div>
            </div>
            <div className={`tree-branch-node ${switchVal === 3 ? 'active' : ''}`}>
              <div className="branch-cond font-mono">case 3: printf("Shutdown\\n"); break;</div>
              <div className="branch-result">🛑 Power Terminated</div>
            </div>
            <div className={`tree-branch-node ${switchVal === 99 ? 'active' : ''}`}>
              <div className="branch-cond font-mono">default: printf("Unknown Command\\n");</div>
              <div className="branch-result">⚠️ Default Fallback Handler</div>
            </div>
          </div>
        </div>
      )}

      {/* ── CHAPTER 10: While & Do-While Loops ── */}
      {chapter === 10 && (
        <div className="vis-widget-card">
          <div className="vis-widget-header">
            <span className="vis-widget-icon">🔄</span>
            <div>
              <h3 className="vis-widget-title">While vs Do-While Execution Order</h3>
              <p className="vis-widget-desc">See the fundamental difference: while checks first; do-while executes at least once!</p>
            </div>
          </div>

          <div className="scope-comparison-grid">
            <div className="scope-card local-card">
              <div className="scope-tag">while (condition) &#123; body &#125;</div>
              <div className="scope-val font-mono">Pre-Check</div>
              <div className="scope-desc">If condition is initially FALSE, the body runs 0 times.</div>
            </div>

            <div className="scope-card static-card">
              <div className="scope-tag">do &#123; body &#125; while (condition);</div>
              <div className="scope-val font-mono text-success">Post-Check</div>
              <div className="scope-desc">Always guaranteed to execute at least once before testing!</div>
            </div>
          </div>
        </div>
      )}

      {/* ── CHAPTER 11: For Loops & Nested Patterns ── */}
      {chapter === 11 && (
        <div className="vis-widget-card">
          <div className="vis-widget-header">
            <span className="vis-widget-icon">🔁</span>
            <div>
              <h3 className="vis-widget-title">For Loop Stepper &amp; Variable Tracker</h3>
              <p className="vis-widget-desc">Click "Step Loop" to watch loop variables update on each iteration.</p>
            </div>
          </div>

          <div className="loop-stepper-controls">
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setLoopStep((prev) => (prev < loopMax ? prev + 1 : 0))}
            >
              {loopStep < loopMax ? `Step Loop (${loopStep + 1}/${loopMax}) ▶` : 'Reset Loop ↺'}
            </button>
            <span className="loop-status-pill font-mono">
              Loop condition `i &lt; {loopMax}`: <strong className={loopStep < loopMax ? 'text-success' : 'text-danger'}>{loopStep < loopMax ? 'TRUE' : 'FALSE (Terminated)'}</strong>
            </span>
          </div>

          <div className="loop-timeline-strip">
            {Array.from({ length: loopMax }).map((_, idx) => (
              <div
                key={idx}
                className={`loop-step-cell ${idx === loopStep ? 'current' : idx < loopStep ? 'completed' : 'pending'}`}
              >
                <div className="step-idx font-mono">i = {idx}</div>
                <div className="step-val font-mono">{idx * 2}</div>
                <div className="step-tag">{idx < loopStep ? '✓ Done' : idx === loopStep ? '▶ Active' : 'Waiting'}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CHAPTER 12: Loop Control (Break & Continue) ── */}
      {chapter === 12 && (
        <div className="vis-widget-card">
          <div className="vis-widget-header">
            <span className="vis-widget-icon">🛑</span>
            <div>
              <h3 className="vis-widget-title">Break vs Continue Execution Flow</h3>
              <p className="vis-widget-desc">Break terminates the loop immediately; Continue jumps directly to the next loop step!</p>
            </div>
          </div>

          <div className="scope-comparison-grid">
            <div className="scope-card local-card">
              <div className="scope-tag">break;</div>
              <div className="scope-val font-mono text-danger">EXIT LOOP</div>
              <div className="scope-desc">Immediately breaks out of the loop and jumps to code below.</div>
            </div>

            <div className="scope-card static-card">
              <div className="scope-tag">continue;</div>
              <div className="scope-val font-mono text-warning">SKIP STEP</div>
              <div className="scope-desc">Skips remainder of current iteration and jumps to `i++`.</div>
            </div>
          </div>
        </div>
      )}

      {/* ── CHAPTER 13: 1D Arrays (Lists of Data) ── */}
      {chapter === 13 && (
        <div className="vis-widget-card">
          <div className="vis-widget-header">
            <span className="vis-widget-icon">📊</span>
            <div>
              <h3 className="vis-widget-title">1D Array Contiguous Memory Map</h3>
              <p className="vis-widget-desc">Each element sits side-by-side in RAM. Index 0 is at offset +0 bytes, Index 1 is at +4 bytes.</p>
            </div>
          </div>

          <div className="ram-tape-strip">
            {[10, 20, 30, 40, 50].map((val, idx) => (
              <div key={idx} className="ram-tape-cell">
                <div className="tape-addr font-mono">0x10{idx * 4}</div>
                <div className="tape-val font-mono">{val}</div>
                <div className="tape-offset font-mono">arr[{idx}]</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CHAPTER 14: 2D Matrix Row-Major Memory Map ── */}
      {chapter === 14 && (
        <div className="vis-widget-card">
          <div className="vis-widget-header">
            <span className="vis-widget-icon">📊</span>
            <div>
              <h3 className="vis-widget-title">2D Matrix &rarr; Contiguous 1D RAM Flattener</h3>
              <p className="vis-widget-desc">Hover over any cell in the 2D grid to see its exact sequential position in computer RAM.</p>
            </div>
          </div>

          <div className="matrix-to-ram-layout">
            <div className="matrix-2d-view">
              <div className="view-title">2D Code Grid: matrix[2][3]</div>
              <div className="matrix-grid-2x3">
                {[
                  [10, 20, 30],
                  [40, 50, 60],
                ].map((row, r) => (
                  <div key={r} className="matrix-row">
                    {row.map((val, c) => (
                      <div
                        key={c}
                        className={`matrix-cell ${matrixHoverCell === r * 3 + c ? 'hovered' : ''}`}
                        onMouseEnter={() => setMatrixHoverCell(r * 3 + c)}
                        onMouseLeave={() => setMatrixHoverCell(null)}
                      >
                        <div className="cell-pos font-mono">[{r}][{c}]</div>
                        <div className="cell-val font-mono">{val}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="ram-1d-view">
              <div className="view-title">Physical Sequential RAM Layout (Row-Major)</div>
              <div className="ram-tape-strip">
                {[10, 20, 30, 40, 50, 60].map((val, idx) => (
                  <div
                    key={idx}
                    className={`ram-tape-cell ${matrixHoverCell === idx ? 'hovered' : ''}`}
                  >
                    <div className="tape-addr font-mono">0x10{idx * 4}</div>
                    <div className="tape-val font-mono">{val}</div>
                    <div className="tape-offset font-mono">[{Math.floor(idx / 3)}][{idx % 3}]</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CHAPTER 15: String Character Tape & Null Terminator ── */}
      {chapter === 15 && (
        <div className="vis-widget-card">
          <div className="vis-widget-header">
            <span className="vis-widget-icon">🧵</span>
            <div>
              <h3 className="vis-widget-title">Interactive String Memory Tape &amp; Null Terminator (\0)</h3>
              <p className="vis-widget-desc">Type any text below to see how C stores characters followed by the red `\0` stop barrier.</p>
            </div>
          </div>

          <div className="string-input-box">
            <label>Test String:</label>
            <input
              type="text"
              maxLength={10}
              value={stringText}
              onChange={(e) => setStringText(e.target.value)}
              className="curriculum-search-input font-mono"
            />
          </div>

          <div className="string-tape-display">
            {stringText.split('').map((char, idx) => (
              <div key={idx} className="char-cell">
                <div className="char-idx font-mono">[{idx}]</div>
                <div className="char-val font-mono">{char}</div>
                <div className="char-ascii font-mono">ASCII {char.charCodeAt(0)}</div>
              </div>
            ))}
            <div className="char-cell null-term-cell">
              <div className="char-idx font-mono">[{stringText.length}]</div>
              <div className="char-val font-mono">\0</div>
              <div className="char-ascii font-mono">STOP (0)</div>
            </div>
          </div>

          <div className="string-stats-row font-mono">
            <span>strlen("{stringText}") = <strong>{stringText.length}</strong> chars</span>
            <span>sizeof(buffer) required = <strong>{stringText.length + 1}</strong> bytes (including \0)</span>
          </div>
        </div>
      )}

      {/* ── CHAPTER 16: String Library Functions ── */}
      {chapter === 16 && (
        <div className="vis-widget-card">
          <div className="vis-widget-header">
            <span className="vis-widget-icon">🧰</span>
            <div>
              <h3 className="vis-widget-title">&lt;string.h&gt; Core Functions Comparison</h3>
              <p className="vis-widget-desc">Overview of the essential string manipulation functions in the C standard library.</p>
            </div>
          </div>

          <div className="decision-tree-grid">
            <div className="tree-branch-node active">
              <div className="branch-cond font-mono">strlen(s)</div>
              <div className="branch-result">Counts characters until '\0' (excludes null terminator).</div>
            </div>
            <div className="tree-branch-node active">
              <div className="branch-cond font-mono">strcpy(dest, src)</div>
              <div className="branch-result">Copies src into dest including '\0'. Dest must be large enough!</div>
            </div>
            <div className="tree-branch-node active">
              <div className="branch-cond font-mono">strcmp(s1, s2)</div>
              <div className="branch-result">Returns 0 if identical, &lt;0 if s1 &lt; s2, &gt;0 if s1 &gt; s2.</div>
            </div>
            <div className="tree-branch-node active">
              <div className="branch-cond font-mono">strcat(dest, src)</div>
              <div className="branch-result">Appends src to the end of dest, overwriting dest's '\0'.</div>
            </div>
          </div>
        </div>
      )}

      {/* ── CHAPTER 17: Scope & Static Lifetime ── */}
      {chapter === 17 && (
        <div className="vis-widget-card">
          <div className="vis-widget-header">
            <span className="vis-widget-icon">📦</span>
            <div>
              <h3 className="vis-widget-title">Local Scope vs Persistent Static Variable Memory</h3>
              <p className="vis-widget-desc">Click "Call Function" to see how normal local variables reset while static variables persist!</p>
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setScopeCallCount((c) => c + 1)}
            >
              Call counterFunction() ▶ (Total Calls: {scopeCallCount})
            </button>
          </div>

          <div className="scope-comparison-grid">
            <div className="scope-card local-card">
              <div className="scope-tag">Local Variable: int normal = 0;</div>
              <div className="scope-val font-mono">1</div>
              <div className="scope-desc">Destroyed on function return! Resets to 1 on every single call.</div>
            </div>

            <div className="scope-card static-card">
              <div className="scope-tag">Static Variable: static int count = 0;</div>
              <div className="scope-val font-mono text-success">{scopeCallCount}</div>
              <div className="scope-desc">Lives in Data Segment! Retains its value across all {scopeCallCount} calls.</div>
            </div>
          </div>
        </div>
      )}

      {/* ── CHAPTER 18: Recursive Call Stack Tree ── */}
      {chapter === 18 && (
        <div className="vis-widget-card">
          <div className="vis-widget-header">
            <span className="vis-widget-icon">🥞</span>
            <div>
              <h3 className="vis-widget-title">Recursive Call Stack Frames (factorial(n))</h3>
              <p className="vis-widget-desc">Adjust n to watch the call stack push frames down to the base case and unwind back up!</p>
            </div>
          </div>

          <div className="slider-group" style={{ marginBottom: '14px' }}>
            <label>Input (n): <span className="font-mono font-bold text-primary">{recurseN}</span></label>
            <input
              type="range"
              min="1"
              max="5"
              value={recurseN}
              onChange={(e) => setRecurseN(Number(e.target.value))}
            />
          </div>

          <div className="call-stack-frames-wrapper">
            <div className="stack-container">
              <div className="stack-title">Call Stack Memory (LIFO)</div>
              {Array.from({ length: recurseN }).map((_, idx) => {
                const curN = recurseN - idx;
                return (
                  <div key={idx} className={`stack-frame-box ${curN === 1 ? 'base-frame' : ''}`}>
                    <span className="frame-func font-mono">factorial({curN})</span>
                    <span className="frame-status">{curN === 1 ? '🎯 BASE CASE: return 1' : `Waiting for factorial(${curN - 1})`}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── CHAPTER 19: Interactive Pointer & Address Visualizer ── */}
      {chapter === 19 && (
        <div className="vis-widget-card">
          <div className="vis-widget-header">
            <span className="vis-widget-icon">📍</span>
            <div>
              <h3 className="vis-widget-title">Interactive Pointer &amp; Memory Address Linker</h3>
              <p className="vis-widget-desc">See how pointer `int *p` holds the memory address of variable `x`, and modify `x` directly via `*p`.</p>
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setPointerVal((v) => v + 10)}
            >
              Execute: *p = *p + 10; (Direct Memory Write) ⚡
            </button>
          </div>

          <div className="pointer-link-visual">
            <div className="pointer-box">
              <div className="box-title">Pointer: int *p</div>
              <div className="box-val font-mono text-accent">{pointerAddr}</div>
              <div className="box-sub">Holds memory address of x</div>
            </div>

            <div className="pointer-glowing-arrow">&rarr; Points to &rarr;</div>

            <div className="target-variable-box">
              <div className="box-title">Variable: int x</div>
              <div className="box-addr font-mono">Address: {pointerAddr}</div>
              <div className="box-val font-mono text-success">{pointerVal}</div>
              <div className="box-sub">Value in RAM</div>
            </div>
          </div>
        </div>
      )}

      {/* ── CHAPTER 20: Pointers, Arrays & Pointer Math ── */}
      {chapter === 20 && (
        <div className="vis-widget-card">
          <div className="vis-widget-header">
            <span className="vis-widget-icon">📐</span>
            <div>
              <h3 className="vis-widget-title">Pointer Arithmetic &amp; Array Decay Offset</h3>
              <p className="vis-widget-desc">Click "p++" to advance the pointer by sizeof(int) (4 bytes) to the next array element!</p>
            </div>
          </div>

          <div style={{ marginBottom: '14px', display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setPtrOffset((o) => (o < 3 ? o + 1 : 0))}
            >
              Execute: p++ (Offset: +{ptrOffset * 4} bytes) ▶
            </button>
          </div>

          <div className="ram-tape-strip">
            {[10, 20, 30, 40].map((val, idx) => (
              <div key={idx} className={`ram-tape-cell ${ptrOffset === idx ? 'hovered' : ''}`}>
                <div className="tape-addr font-mono">0x100{idx * 4}</div>
                <div className="tape-val font-mono">{val}</div>
                <div className="tape-offset font-mono">{ptrOffset === idx ? '📍 *p (ACTIVE)' : `*(arr + ${idx})`}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CHAPTER 21: Struct Byte Layout & Arrow Operator ── */}
      {chapter === 21 && (
        <div className="vis-widget-card">
          <div className="vis-widget-header">
            <span className="vis-widget-icon">🪪</span>
            <div>
              <h3 className="vis-widget-title">Struct Memory Layout &amp; Member Offsets</h3>
              <p className="vis-widget-desc">Visualizes how different data types sit side-by-side inside a single compound struct record.</p>
            </div>
          </div>

          <div className="struct-memory-block">
            <div className="struct-header-bar font-mono">struct Student (Offset 0x00 to 0x14)</div>
            <div className="struct-fields-strip">
              <div className="struct-field int-field">
                <span className="field-name font-mono">.id (int)</span>
                <span className="field-size">4 Bytes</span>
                <span className="field-val font-mono">101</span>
              </div>
              <div className="struct-field char-field">
                <span className="field-name font-mono">.grade (char)</span>
                <span className="field-size">1 Byte</span>
                <span className="field-val font-mono">'A'</span>
              </div>
              <div className="struct-field float-field">
                <span className="field-name font-mono">.gpa (float)</span>
                <span className="field-size">4 Bytes</span>
                <span className="field-val font-mono">3.95</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CHAPTER 22: Stack vs Heap & Memory Leak Gauge ── */}
      {chapter === 22 && (
        <div className="vis-widget-card">
          <div className="vis-widget-header">
            <span className="vis-widget-icon">🏗️</span>
            <div>
              <h3 className="vis-widget-title">Heap Memory Allocator (malloc / free) &amp; Leak Detector</h3>
              <p className="vis-widget-desc">Allocate memory on the heap and click "free()" to release RAM and avoid memory leaks.</p>
            </div>
          </div>

          <div className="heap-actions-bar">
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                setHeapBlocks((prev) => [
                  ...prev,
                  { id: Date.now(), size: '16 bytes', type: 'int[4]', freed: false },
                ]);
              }}
            >
              + malloc(16 bytes)
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setHeapBlocks((prev) => prev.map((b) => ({ ...b, freed: true })));
              }}
            >
              free() All Blocks 🧹
            </button>
          </div>

          <div className="heap-blocks-grid">
            {heapBlocks.map((b) => (
              <div
                key={b.id}
                className={`heap-block-item ${b.freed ? 'freed' : 'allocated'}`}
              >
                <div className="block-type font-mono">{b.type}</div>
                <div className="block-size font-mono">{b.size}</div>
                <div className="block-status">
                  {b.freed ? '✅ Freed (Safe)' : '⚠️ Allocated (Requires free)'}
                </div>
              </div>
            ))}
          </div>

          <div className="leak-status-bar">
            <span>Memory Status: </span>
            {heapBlocks.some((b) => !b.freed) ? (
              <span className="text-warning font-bold">
                ⚠️ {heapBlocks.filter((b) => !b.freed).length} Unfreed Block(s) — Call free(ptr) before exiting!
              </span>
            ) : (
              <span className="text-success font-bold">
                ✅ 0 Memory Leaks! All heap buffers cleanly returned to OS.
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── CHAPTER 23: File Handling & Disk Buffers ── */}
      {chapter === 23 && (
        <div className="vis-widget-card">
          <div className="vis-widget-header">
            <span className="vis-widget-icon">💾</span>
            <div>
              <h3 className="vis-widget-title">File Stream Modes &amp; Persistent Disk Buffer</h3>
              <p className="vis-widget-desc">Select a file mode to see how C interacts with the operating system filesystem.</p>
            </div>
          </div>

          <div className="vis-type-selector-row">
            {['w', 'a', 'r', 'rb'].map((m) => (
              <button
                key={m}
                type="button"
                className={`btn-type-pill ${fileMode === m ? 'active' : ''}`}
                onClick={() => setFileMode(m)}
              >
                Mode "{m}" ({m === 'w' ? 'Overwrite' : m === 'a' ? 'Append' : m === 'r' ? 'Read' : 'Binary Read'})
              </button>
            ))}
          </div>

          <div className="decision-tree-grid">
            <div className="tree-branch-node active">
              <div className="branch-cond font-mono">FILE *fp = fopen("data.txt", "{fileMode}");</div>
              <div className="branch-result">
                {fileMode === 'w' && '⚠️ Truncates file to 0 bytes and creates a new write stream.'}
                {fileMode === 'a' && '➕ Keeps existing data intact and appends new records at EOF.'}
                {fileMode === 'r' && '📖 Reads text from file. Returns NULL if file does not exist!'}
                {fileMode === 'rb' && '📦 Reads raw binary bytes directly into memory without line translation.'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
