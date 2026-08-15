// src/components/CodePanel.jsx — Clean, VS Code-styled code viewer

import { useState, useEffect, useRef } from 'react';

const LANGUAGES = [
  { id: 'python', label: 'Python' },
  { id: 'c',      label: 'C' },
  { id: 'cpp',    label: 'C++' },
  { id: 'java',   label: 'Java' },
  { id: 'js',     label: 'JavaScript' },
];

function tokenize(line) {
  if (!line) return [{ text: ' ', color: 'var(--text-code)' }];

  const tokens = [];
  let rem = line;

  const rules = [
    { re: /^(\/\/.*|#.*)/, color: '#64748b' }, // comment
    { re: /^("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/, color: '#a5d6a7' }, // string
    {
      re: /^(def|class|return|if|else|elif|for|while|in|not|and|or|True|False|None|void|int|float|double|bool|char|struct|const|static|new|this|self|null|NULL|nullptr|public|private|function|let|const|var|typeof)\b/,
      color: '#f472b6', // keyword
    },
    { re: /^(vector|list|set|map|queue|stack|List|Set|Map|Queue|Stack|Arrays|Math|Node)\b/, color: '#38bdf8' }, // type
    { re: /^([a-zA-Z_][a-zA-Z0-9_]*)(?=\s*\()/, color: '#60a5fa' }, // function
    { re: /^(\d+\.?\d*|\.\d+)/, color: '#fbbf24' }, // number
    { re: /^([+\-*/<>=!&|^%~?:]+|={1,3}|!=|<=|>=|->|=>)/, color: '#94a3b8' }, // op
    { re: /^[^"'#/a-zA-Z0-9+\-*/<>=!&|^%~?:]+/, color: 'var(--text-code)' },
    { re: /^./, color: 'var(--text-code)' },
  ];

  while (rem.length > 0) {
    let matched = false;
    for (const rule of rules) {
      const m = rem.match(rule.re);
      if (m) {
        tokens.push({ text: m[0], color: rule.color });
        rem = rem.slice(m[0].length);
        matched = true;
        break;
      }
    }
    if (!matched) {
      tokens.push({ text: rem[0], color: 'var(--text-code)' });
      rem = rem.slice(1);
    }
  }
  return tokens;
}

export default function CodePanel({ code, activeLine, title }) {
  const [lang, setLang] = useState('python');
  const [copied, setCopied] = useState(false);
  const activeLineRef = useRef(null);

  const currentCode = code?.[lang] || [];
  const activeIdx = activeLine?.[lang] ?? -1;

  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [activeIdx]);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="code-panel">
      {/* Language Switcher */}
      <div className="code-panel-tabs">
        {LANGUAGES.map(l => (
          <div
            key={l.id}
            className={`lang-tab ${lang === l.id ? 'active' : ''}`}
            onClick={() => setLang(l.id)}
          >
            {l.label}
          </div>
        ))}
      </div>

      {/* Editor Header */}
      <div className="code-panel-header">
        <span className="code-panel-title">
          {title || 'Algorithm'} Implementation
        </span>
        <button className="btn-copy" onClick={handleCopy}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {/* Code Editor Body */}
      <div className="code-body">
        {currentCode.map((line, i) => {
          const isActive = i === activeIdx;
          const tokens = tokenize(line);
          return (
            <div
              key={i}
              ref={isActive ? activeLineRef : null}
              className={`code-line ${isActive ? 'active' : ''}`}
            >
              <span className="code-line-number">{i + 1}</span>
              <code className="code-content">
                {tokens.map((t, ti) => (
                  <span key={ti} style={{ color: t.color }}>{t.text}</span>
                ))}
              </code>
            </div>
          );
        })}
      </div>
    </div>
  );
}
