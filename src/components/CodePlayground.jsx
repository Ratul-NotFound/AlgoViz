// src/components/CodePlayground.jsx — In-Browser C Compiler & Execution Playground
import React, { useState, useEffect } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { PlayIcon, ResetIcon, CheckCircleIcon } from './Icons.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { compileAndRunC } from '../utils/cCompiler.js';

export default function CodePlayground({ lesson, starterCode, expectedOutput, onRunSuccess }) {
  const { isAuthenticated, openAuthModal, addCoins } = useAuth();
  
  const getInitialCode = () => {
    return starterCode || lesson?.starterCode || lesson?.codePlayground || lesson?.initialCode || '';
  };

  const [code, setCode] = useState(getInitialCode());
  const [stdinInput, setStdinInput] = useState('');
  const [showStdin, setShowStdin] = useState(false);
  const [output, setOutput] = useState('// Press "Run Code" to compile and execute your program.');
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [testPassed, setTestPassed] = useState(false);
  const [execStats, setExecStats] = useState({ timeMs: 0, exitCode: 0 });

  // Update initial code when lesson or starterCode changes
  useEffect(() => {
    setCode(getInitialCode());
    setOutput('// Press "Run Code" to compile and execute your program.');
    setTestPassed(false);
  }, [lesson, starterCode]);

  const handleRunCode = () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    setIsRunning(true);

    setTimeout(() => {
      // Execute 100% in-browser on client runtime with zero backend server overhead
      const result = compileAndRunC(code, stdinInput);

      setIsRunning(false);
      setExecStats({
        timeMs: result.executionTimeMs,
        exitCode: result.exitCode,
      });
      setOutput(result.output);

      // Check if output matches expected output
      const cleanSim = (result.output || '').replace(/\r\n/g, '\n').trim();
      const cleanExp = (expectedOutput || '').replace(/\r\n/g, '\n').trim();

      if (cleanExp && cleanSim.includes(cleanExp)) {
        if (!testPassed) {
          setTestPassed(true);
          addCoins(15, 'Code Output Test Passed');
        }
        if (onRunSuccess) onRunSuccess();
      } else if (!cleanExp) {
        if (onRunSuccess) onRunSuccess();
      }
    }, 180);
  };

  const handleReset = () => {
    setCode(getInitialCode());
    setOutput('// Press "Run Code" to compile and execute your program.');
    setTestPassed(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-playground-box">
      {/* Top Playground Header Bar */}
      <div className="playground-header">
        <div className="playground-header-left">
          <span className="playground-badge">
            <span className="c-lang-dot" /> main.c
          </span>
          <span className="playground-sandbox-badge font-mono">
            GCC 14.2.0 &bull; x86_64
          </span>
        </div>

        <div className="playground-header-actions">
          <button
            type="button"
            className={`btn btn-secondary btn-sm ${showStdin ? 'active' : ''}`}
            onClick={() => setShowStdin(!showStdin)}
            title="Provide custom inputs for scanf() or getchar()"
          >
            <span>📥 Custom Input</span>
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleCopy}
            title="Copy Code"
          >
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleReset}
            title="Reset to original lesson code"
          >
            <ResetIcon size={13} />
            <span>Reset</span>
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm btn-run-playground"
            onClick={handleRunCode}
            disabled={isRunning}
            title={!isAuthenticated ? 'Sign in with Google to run C code' : 'Execute C Code'}
          >
            <PlayIcon size={13} />
            <span>{isRunning ? 'Compiling…' : !isAuthenticated ? 'Run (Sign In)' : 'Run Code'}</span>
          </button>
        </div>
      </div>

      {/* Optional Custom Stdin Drawer */}
      {showStdin && (
        <div className="playground-stdin-bar animate-fade-in">
          <div className="stdin-header-label">
            <span>📥 Standard Input (stdin for scanf / getchar):</span>
            <span className="stdin-hint">Separate space or newline-separated values (e.g. <code>10 25</code>)</span>
          </div>
          <input
            type="text"
            className="stdin-input-field font-mono"
            placeholder="Enter input values here..."
            value={stdinInput}
            onChange={(e) => setStdinInput(e.target.value)}
          />
        </div>
      )}

      {/* Main Sandbox Grid: Editor & Output */}
      <div className="playground-body">
        {/* Editor Area */}
        <div className="playground-editor-wrapper">
          <textarea
            className="playground-textarea"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck="false"
            autoCapitalize="off"
            autoComplete="off"
            placeholder="Write your C code here..."
            onKeyDown={(e) => {
              if (e.key === 'Tab') {
                e.preventDefault();
                const start = e.target.selectionStart;
                const end = e.target.selectionEnd;
                setCode(code.substring(0, start) + '    ' + code.substring(end));
                setTimeout(() => {
                  e.target.selectionStart = e.target.selectionEnd = start + 4;
                }, 0);
              }
            }}
          />
          <div className="code-highlight-underlay" aria-hidden="true">
            <Highlight theme={themes.nightOwl} code={code} language="c">
              {({ tokens, getLineProps, getTokenProps }) => (
                <pre>
                  {tokens.map((line, i) => (
                    <div key={i} {...getLineProps({ line })}>
                      <span className="line-number">{i + 1}</span>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </div>
                  ))}
                </pre>
              )}
            </Highlight>
          </div>
        </div>

        {/* Output Console / stdout */}
        <div className="playground-terminal">
          <div className="terminal-top">
            <div className="terminal-title">
              <span className="terminal-prompt">&gt;</span> Terminal Output (stdout)
              {testPassed && (
                <span className="test-passed-badge font-mono">
                  ✓ Output Matches Test Case (+15 Coins)
                </span>
              )}
            </div>
            {output && (
              <span className="terminal-status-tag font-mono">
                Exit {execStats.exitCode} &bull; {execStats.timeMs}ms
              </span>
            )}
          </div>
          <pre className="terminal-body font-mono">
            {isRunning ? (
              <span className="terminal-loading">Compiling & executing C program…</span>
            ) : output ? (
              output
            ) : (
              <span className="terminal-empty">Click "Run Code" to compile and view output.</span>
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}
