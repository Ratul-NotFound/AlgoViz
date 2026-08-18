// src/components/CodePanel.jsx — Clean, professional multi-language code inspector

import { useState, useEffect, useRef } from 'react';
import { CopyIcon, CheckIcon, PythonIcon, CIcon, CppIcon, JavaIcon, JSIcon } from './Icons.jsx';

const LANGUAGES = [
  { id: 'python', label: 'Python',     icon: PythonIcon },
  { id: 'c',      label: 'C',          icon: CIcon },
  { id: 'cpp',    label: 'C++',        icon: CppIcon },
  { id: 'java',   label: 'Java',       icon: JavaIcon },
  { id: 'js',     label: 'JavaScript', icon: JSIcon },
];

function tokenize(line) {
  if (!line) return [{ text: ' ', cls: 'tok-plain' }];

  const tokens = [];
  let rem = line;

  const rules = [
    { re: /^(\/\/.*|#.*)/, cls: 'tok-comment' }, // comment
    { re: /^("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/, cls: 'tok-string' }, // string
    {
      re: /^(def|class|return|if|else|elif|for|while|in|not|and|or|True|False|None|void|int|float|double|bool|char|struct|const|static|new|this|self|null|NULL|nullptr|public|private|function|let|const|var|typeof|import|from|as|include)\b/,
      cls: 'tok-keyword',
    },
    { re: /^(vector|list|set|map|queue|stack|List|Set|Map|Queue|Stack|Arrays|Math|Node|heapq)\b/, cls: 'tok-type' }, // type
    { re: /^([a-zA-Z_][a-zA-Z0-9_]*)(?=\s*\()/, cls: 'tok-fn' }, // function
    { re: /^(\d+\.?\d*|\.\d+)/, cls: 'tok-number' }, // number
    { re: /^([+\-*/<>=!&|^%~?:]+|={1,3}|!=|<=|>=|->|=>)/, cls: 'tok-op' }, // op
    { re: /^[^"'#/a-zA-Z0-9+\-*/<>=!&|^%~?:]+/, cls: 'tok-plain' },
    { re: /^./, cls: 'tok-plain' },
  ];

  while (rem.length > 0) {
    let matched = false;
    for (const rule of rules) {
      const m = rem.match(rule.re);
      if (m) {
        tokens.push({ text: m[0], cls: rule.cls });
        rem = rem.slice(m[0].length);
        matched = true;
        break;
      }
    }
    if (!matched) {
      tokens.push({ text: rem[0], cls: 'tok-plain' });
      rem = rem.slice(1);
    }
  }
  return tokens;
}

export default function CodePanel({ code, activeLine, title }) {
  const [lang, setLang] = useState('python');
  const [copied, setCopied] = useState(false);
  const activeLineRef = useRef(null);
  const codeBodyRef = useRef(null);

  const currentCode = code?.[lang] || [];
  const activeIdx = activeLine?.[lang] ?? -1;

  useEffect(() => {
    if (activeLineRef.current && codeBodyRef.current) {
      const container = codeBodyRef.current;
      const line = activeLineRef.current;
      const containerTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const lineTop = line.offsetTop;
      const lineHeight = line.offsetHeight;

      // Scroll strictly within the code editor container without affecting page/window scroll
      if (lineTop < containerTop) {
        container.scrollTo({ top: Math.max(0, lineTop - 10), behavior: 'smooth' });
      } else if (lineTop + lineHeight > containerTop + containerHeight) {
        container.scrollTo({
          top: lineTop + lineHeight - containerHeight + 20,
          behavior: 'smooth',
        });
      }
    }
  }, [activeIdx]);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="code-panel">
      {/* ── Language Tabs ── */}
      <div className="code-panel-tabs">
        {LANGUAGES.map(l => {
          const Icon = l.icon;
          const isActive = lang === l.id;
          return (
            <button
              key={l.id}
              className={`lang-tab ${isActive ? 'active' : ''}`}
              onClick={() => setLang(l.id)}
              type="button"
            >
              <Icon size={14} />
              <span>{l.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Editor Toolbar ── */}
      <div className="code-panel-header">
        <span className="code-panel-title">
          {title || 'Algorithm'} Implementation
        </span>
        <button className="btn-copy" onClick={handleCopy} title="Copy code to clipboard">
          {copied ? (
            <>
              <CheckIcon size={12} />
              <span>Copied</span>
            </>
          ) : (
            <>
              <CopyIcon size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* ── Code Gutter & Content ── */}
      <div className="code-body" ref={codeBodyRef}>
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
                  <span key={ti} className={`code-tok ${t.cls}`}>{t.text}</span>
                ))}
              </code>
            </div>
          );
        })}
      </div>
    </div>
  );
}
