// src/components/CodePanel.jsx
// Multi-language code display with synchronized line highlighting

import { useState, useEffect, useRef } from 'react';

const LANGUAGES = [
  { id: 'python', label: 'Python',     color: '#60a5fa' },
  { id: 'c',      label: 'C',          color: 'var(--sky)' },
  { id: 'cpp',    label: 'C++',        color: '#a5b4fc' },
  { id: 'java',   label: 'Java',       color: 'var(--amber-light)' },
  { id: 'js',     label: 'JavaScript', color: 'var(--lime-light)' },
];

// Simple syntax token colorizer
function tokenizeLine(line, lang) {
  if (!line) return [{ text: ' ', type: 'plain' }];

  const tokens = [];
  let remaining = line;

  const rules = [
    // Comments
    { re: /^(\/\/.*|#.*)/, type: 'comment' },
    // Strings
    { re: /^("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/, type: 'string' },
    // Keywords
    {
      re: /^(def|class|return|if|else|elif|for|while|in|not|and|or|True|False|None|import|from|pass|break|continue|void|int|float|double|bool|char|string|struct|const|static|new|this|self|null|NULL|nullptr|public|private|protected|override|extends|implements|interface|function|let|const|var|of|typeof|instanceof|throw|try|catch|finally|include|using|namespace|template|auto|size_t|unsigned)\b/,
      type: 'keyword',
    },
    // Types
    { re: /^(vector|list|set|map|queue|stack|deque|pair|array|List|Set|Map|Queue|Stack|Dict|tuple|LinkedList|HashMap|HashSet|PriorityQueue|heapq|deque|ArrayList|Scanner|System|Arrays|Math|Collections)\b/, type: 'type' },
    // Functions/methods
    { re: /^([a-zA-Z_][a-zA-Z0-9_]*)(?=\s*\()/, type: 'function' },
    // Numbers
    { re: /^(\d+\.?\d*|\.\d+)/, type: 'number' },
    // Operators
    { re: /^([+\-*/<>=!&|^%~?:]+|={1,3}|!=|<=|>=|->|=>|::)/, type: 'operator' },
    // Plain text
    { re: /^[^"'#/a-zA-Z0-9+\-*/<>=!&|^%~?:]+/, type: 'plain' },
    { re: /^./, type: 'plain' },
  ];

  while (remaining.length > 0) {
    let matched = false;
    for (const rule of rules) {
      const m = remaining.match(rule.re);
      if (m) {
        tokens.push({ text: m[0], type: rule.type });
        remaining = remaining.slice(m[0].length);
        matched = true;
        break;
      }
    }
    if (!matched) { tokens.push({ text: remaining[0], type: 'plain' }); remaining = remaining.slice(1); }
  }
  return tokens;
}

function TokenSpan({ token }) {
  const colors = {
    keyword:  'var(--violet-light)',
    function: 'var(--cyan-light)',
    string:   '#86efac',
    number:   'var(--amber)',
    comment:  'var(--text-muted)',
    type:     'var(--pink)',
    operator: '#94a3b8',
    plain:    'var(--text-code)',
  };
  return <span style={{ color: colors[token.type] || 'var(--text-code)' }}>{token.text}</span>;
}

export default function CodePanel({ code, activeLine, title }) {
  const [lang, setLang] = useState('python');
  const [copied, setCopied] = useState(false);
  const activeLineRef = useRef(null);

  const currentCode = code?.[lang] || [];
  const activeIdx = activeLine?.[lang] ?? -1;

  // Auto-scroll to active line
  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [activeIdx]);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-panel">
      {/* Language tabs */}
      <div className="code-panel-tabs">
        {LANGUAGES.map(l => (
          <div
            key={l.id}
            className={`lang-tab ${lang === l.id ? 'active' : ''}`}
            onClick={() => setLang(l.id)}
            style={lang === l.id ? { borderBottomColor: l.color, color: l.color } : {}}
          >
            {l.label}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="code-panel-header">
        <span className="code-panel-title">
          {title || 'Code'} — {LANGUAGES.find(l => l.id === lang)?.label}
        </span>
        <button className="btn-copy" onClick={handleCopy}>
          {copied ? '✅ Copied!' : '📋 Copy'}
        </button>
      </div>

      {/* Code body */}
      <div className="code-body">
        {currentCode.map((line, i) => {
          const isActive = i === activeIdx;
          const tokens = tokenizeLine(line, lang);
          return (
            <div
              key={i}
              ref={isActive ? activeLineRef : null}
              className={`code-line ${isActive ? 'active' : ''}`}
            >
              <span className="code-line-number">{i + 1}</span>
              <code className="code-content">
                {tokens.map((t, ti) => <TokenSpan key={ti} token={t} />)}
              </code>
            </div>
          );
        })}
      </div>
    </div>
  );
}
