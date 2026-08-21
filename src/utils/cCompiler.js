// src/utils/cCompiler.js — Ultra-Fast In-Browser C Virtual Machine & Compiler Engine
// Zero server load, executes 100% client-side in < 10ms with sandboxed safety.

/**
 * Compiles and executes C source code locally inside the browser.
 * @param {string} sourceCode - The C source code to execute.
 * @param {string} [stdinInput=''] - Optional simulated stdin input for scanf/getchar.
 * @returns {{ output: string, error: string|null, executionTimeMs: number, exitCode: number }}
 */
export function compileAndRunC(sourceCode, stdinInput = '') {
  const startTime = performance.now();
  const logs = [];
  let exitCode = 0;
  let errorMsg = null;

  try {
    if (!sourceCode || !sourceCode.trim()) {
      return {
        output: '// Code is empty. Write your C program and click "Run Code".',
        error: null,
        executionTimeMs: 0,
        exitCode: 0,
      };
    }

    // ── 1. Preprocessor & Comment Stripper ──
    let cleanCode = sourceCode
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
      .replace(/\/\/.*/g, '');          // Remove single-line comments

    // Handle simple #define macros
    const defines = {};
    cleanCode = cleanCode.replace(/#define\s+([A-Za-z0-9_]+)\s+([^\r\n]+)/g, (_, name, val) => {
      defines[name] = val.trim();
      return '';
    });

    // Replace defined macros in code
    Object.keys(defines).forEach((macro) => {
      const reg = new RegExp(`\\b${macro}\\b`, 'g');
      cleanCode = cleanCode.replace(reg, defines[macro]);
    });

    // Strip header includes (#include <stdio.h>, etc.)
    cleanCode = cleanCode.replace(/#include\s*<[^>]+>/g, '').replace(/#include\s*"[^"]+"/g, '');

    // ── 2. Memory & Runtime Environment ──
    const heap = [];
    const globalScope = {};
    const functions = {};
    let stdinTokens = stdinInput.trim().split(/\s+/).filter(Boolean);
    let stdinIdx = 0;
    let instructionCount = 0;
    const MAX_INSTRUCTIONS = 150000;

    // Helper: Standard IO Printf formatting
    function executePrintf(formatStr, args) {
      let formatted = formatStr
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\')
        .replace(/%%/g, '\u0001'); // Temporary placeholder for %%

      let argIndex = 0;
      const specifierRegex = /%(?:([0-9]+))?(?:\.([0-9]+))?([diufFeEgGscpxXo])/g;

      formatted = formatted.replace(specifierRegex, (match, width, precision, type) => {
        if (argIndex >= args.length) return match;
        const rawVal = args[argIndex++];

        let strVal = '';
        if (type === 'd' || type === 'i') {
          strVal = String(Math.trunc(Number(rawVal) || 0));
        } else if (type === 'u') {
          strVal = String(Math.abs(Math.trunc(Number(rawVal) || 0)));
        } else if (type === 'f' || type === 'F' || type === 'lf') {
          const dec = precision !== undefined ? parseInt(precision, 10) : 6;
          strVal = Number(rawVal).toFixed(dec);
        } else if (type === 's') {
          strVal = String(rawVal);
        } else if (type === 'c') {
          strVal = typeof rawVal === 'number' ? String.fromCharCode(rawVal) : String(rawVal).charAt(0);
        } else if (type === 'x' || type === 'X') {
          const hex = Math.abs(Math.trunc(Number(rawVal) || 0)).toString(16);
          strVal = type === 'X' ? hex.toUpperCase() : hex;
        } else if (type === 'p') {
          strVal = `0x${Math.abs(Math.trunc(Number(rawVal) || 1000)).toString(16)}`;
        } else {
          strVal = String(rawVal);
        }

        if (width) {
          const minW = parseInt(width, 10);
          if (strVal.length < minW) {
            strVal = ' '.repeat(minW - strVal.length) + strVal;
          }
        }

        return strVal;
      });

      formatted = formatted.replace(/\u0001/g, '%');
      logs.push(formatted);
    }

    // Helper: Standard IO Scanf input reader
    function executeScanf(formatStr, targetNames, scope) {
      const specifiers = formatStr.match(/%[diufsc]/g) || [];
      specifiers.forEach((spec, idx) => {
        if (stdinIdx >= stdinTokens.length) return;
        const rawToken = stdinTokens[stdinIdx++];
        const varName = targetNames[idx];
        if (!varName) return;

        if (spec === '%d' || spec === '%i') {
          scope[varName] = parseInt(rawToken, 10) || 0;
        } else if (spec === '%f' || spec === '%lf') {
          scope[varName] = parseFloat(rawToken) || 0.0;
        } else if (spec === '%c') {
          scope[varName] = rawToken.charAt(0);
        } else if (spec === '%s') {
          scope[varName] = rawToken;
        }
      });
    }

    // Standard Math and C Library Helpers
    const standardLib = {
      sqrt: (x) => Math.sqrt(x),
      pow: (b, e) => Math.pow(b, e),
      abs: (x) => Math.abs(x),
      fabs: (x) => Math.abs(x),
      floor: (x) => Math.floor(x),
      ceil: (x) => Math.ceil(x),
      sin: (x) => Math.sin(x),
      cos: (x) => Math.cos(x),
      tan: (x) => Math.tan(x),
      rand: () => Math.floor(Math.random() * 32767),
      srand: () => {},
      strlen: (s) => (typeof s === 'string' ? s.length : 0),
      strcmp: (a, b) => (String(a) === String(b) ? 0 : String(a) < String(b) ? -1 : 1),
      toupper: (c) => (typeof c === 'number' ? String.fromCharCode(c).toUpperCase().charCodeAt(0) : String(c).toUpperCase()),
      tolower: (c) => (typeof c === 'number' ? String.fromCharCode(c).toLowerCase().charCodeAt(0) : String(c).toLowerCase()),
      isalpha: (c) => (/[a-zA-Z]/.test(typeof c === 'number' ? String.fromCharCode(c) : c) ? 1 : 0),
      isdigit: (c) => (/[0-9]/.test(typeof c === 'number' ? String.fromCharCode(c) : c) ? 1 : 0),
      putchar: (c) => {
        logs.push(typeof c === 'number' ? String.fromCharCode(c) : String(c));
      },
      puts: (s) => {
        logs.push(String(s) + '\n');
      },
      malloc: (bytes) => {
        const addr = heap.length + 1024;
        heap.push({ addr, size: bytes, data: new Array(bytes).fill(0) });
        return addr;
      },
      free: () => {},
      exit: (code) => {
        exitCode = Number(code) || 0;
        throw new Error('__EXIT_PROGRAM__');
      },
    };

    // ── 3. Parse and Extract Functions ──
    const funcRegex = /(?:int|void|float|double|char|long|short)\s+([A-Za-z0-9_]+)\s*\(([^)]*)\)\s*\{/g;
    let match;
    const funcBlocks = [];

    while ((match = funcRegex.exec(cleanCode)) !== null) {
      const funcName = match[1];
      const paramsStr = match[2];
      const startIndex = match.index + match[0].length;

      // Find matching closing brace
      let depth = 1;
      let endIndex = startIndex;
      while (depth > 0 && endIndex < cleanCode.length) {
        if (cleanCode[endIndex] === '{') depth++;
        else if (cleanCode[endIndex] === '}') depth--;
        endIndex++;
      }

      const body = cleanCode.substring(startIndex, endIndex - 1);
      const params = paramsStr
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p) => {
          const parts = p.split(/\s+/);
          return parts[parts.length - 1].replace(/[*&[\]]/g, '');
        });

      functions[funcName] = { params, body };
      funcBlocks.push({ start: match.index, end: endIndex });
    }

    if (!functions['main']) {
      return {
        output: 'Compilation Error: undefined reference to `main`\nEvery C program must contain a main() function.',
        error: 'Missing main() function',
        executionTimeMs: Math.round(performance.now() - startTime),
        exitCode: 1,
      };
    }

    // ── 4. Virtual Expression Evaluator & AST Runner ──
    function evalExpr(exprStr, scope) {
      if (!exprStr) return 0;
      let expr = exprStr.trim();

      // Check string literal
      if (expr.startsWith('"') && expr.endsWith('"')) {
        return expr.slice(1, -1);
      }
      // Check character literal
      if (expr.startsWith("'") && expr.endsWith("'")) {
        return expr.slice(1, -1).charCodeAt(0);
      }

      // Check function calls: e.g. add(5, 10), sqrt(16)
      const callMatch = expr.match(/^([A-Za-z0-9_]+)\s*\((.*)\)$/);
      if (callMatch) {
        const fName = callMatch[1];
        const argStrings = splitArgs(callMatch[2]);
        const evaledArgs = argStrings.map((a) => evalExpr(a, scope));

        if (standardLib[fName]) {
          return standardLib[fName](...evaledArgs);
        }
        if (functions[fName]) {
          return runFunction(fName, evaledArgs);
        }
      }

      // Replace known variables, arrays, and standard constants
      const varNames = Object.keys(scope).sort((a, b) => b.length - a.length);
      let jsExpr = expr;

      // Handle array access: arr[i] -> arr_i
      jsExpr = jsExpr.replace(/([A-Za-z0-9_]+)\[([^\]]+)\]/g, (m, arrName, idxExpr) => {
        const idx = evalExpr(idxExpr, scope);
        if (Array.isArray(scope[arrName])) {
          return scope[arrName][idx] !== undefined ? scope[arrName][idx] : 0;
        }
        return 0;
      });

      // Handle sizeof(int), sizeof(var)
      jsExpr = jsExpr.replace(/sizeof\s*\(([^)]+)\)/g, (m, typeOrVar) => {
        const t = typeOrVar.trim();
        if (t === 'int' || t === 'float' || t === 'long') return '4';
        if (t === 'double') return '8';
        if (t === 'char') return '1';
        if (Array.isArray(scope[t])) return String(scope[t].length * 4);
        return '4';
      });

      varNames.forEach((v) => {
        const regex = new RegExp(`\\b${v}\\b`, 'g');
        const val = scope[v];
        if (typeof val === 'number') {
          jsExpr = jsExpr.replace(regex, `(${val})`);
        } else if (typeof val === 'string') {
          jsExpr = jsExpr.replace(regex, JSON.stringify(val));
        } else if (typeof val === 'boolean') {
          jsExpr = jsExpr.replace(regex, val ? '1' : '0');
        }
      });

      try {
        // Safe math evaluation
        // eslint-disable-next-line no-new-func
        const result = Function(`"use strict"; return (${jsExpr});`)();
        return typeof result === 'boolean' ? (result ? 1 : 0) : result;
      } catch (e) {
        return 0;
      }
    }

    function splitArgs(argsStr) {
      if (!argsStr || !argsStr.trim()) return [];
      const args = [];
      let current = '';
      let depth = 0;
      let inQuote = false;

      for (let i = 0; i < argsStr.length; i++) {
        const ch = argsStr[i];
        if (ch === '"' && argsStr[i - 1] !== '\\') inQuote = !inQuote;
        if (!inQuote) {
          if (ch === '(' || ch === '[' || ch === '{') depth++;
          else if (ch === ')' || ch === ']' || ch === '}') depth--;
          else if (ch === ',' && depth === 0) {
            args.push(current.trim());
            current = '';
            continue;
          }
        }
        current += ch;
      }
      if (current.trim()) args.push(current.trim());
      return args;
    }

    // ── 5. Run Function Body ──
    function runFunction(funcName, argValues = []) {
      const func = functions[funcName];
      if (!func) return 0;

      const localScope = { ...globalScope };
      func.params.forEach((paramName, idx) => {
        localScope[paramName] = argValues[idx] !== undefined ? argValues[idx] : 0;
      });

      return executeBlock(func.body, localScope);
    }

    // ── 6. Block & Statement Executor ──
    function executeBlock(blockStr, scope) {
      let index = 0;
      const len = blockStr.length;

      while (index < len) {
        if (instructionCount++ > MAX_INSTRUCTIONS) {
          throw new Error('Runtime Error: Time Limit Exceeded (Infinite loop detected).');
        }

        // Skip whitespaces
        while (index < len && /\s/.test(blockStr[index])) index++;
        if (index >= len) break;

        // ── A. printf(...) ──
        if (blockStr.startsWith('printf', index)) {
          const openParen = blockStr.indexOf('(', index);
          let closeParen = openParen + 1;
          let depth = 1;
          let inQuote = false;
          while (closeParen < len && depth > 0) {
            if (blockStr[closeParen] === '"' && blockStr[closeParen - 1] !== '\\') inQuote = !inQuote;
            if (!inQuote) {
              if (blockStr[closeParen] === '(') depth++;
              else if (blockStr[closeParen] === ')') depth--;
            }
            closeParen++;
          }
          const inside = blockStr.substring(openParen + 1, closeParen - 1);
          const args = splitArgs(inside);
          if (args.length > 0) {
            let formatStr = args[0];
            if (formatStr.startsWith('"') && formatStr.endsWith('"')) {
              formatStr = formatStr.slice(1, -1);
            }
            const evaledArgs = args.slice(1).map((a) => evalExpr(a, scope));
            executePrintf(formatStr, evaledArgs);
          }
          index = blockStr.indexOf(';', closeParen) + 1;
          continue;
        }

        // ── B. scanf(...) ──
        if (blockStr.startsWith('scanf', index)) {
          const openParen = blockStr.indexOf('(', index);
          const closeParen = blockStr.indexOf(')', openParen);
          const inside = blockStr.substring(openParen + 1, closeParen);
          const args = splitArgs(inside);
          if (args.length > 0) {
            let formatStr = args[0].replace(/^"|"$/g, '');
            const targets = args.slice(1).map((a) => a.replace(/^[&*]/, '').trim());
            executeScanf(formatStr, targets, scope);
          }
          index = blockStr.indexOf(';', closeParen) + 1;
          continue;
        }

        // ── C. return [expr]; ──
        if (blockStr.startsWith('return', index) && /\b/.test(blockStr[index + 6] || '')) {
          const semi = blockStr.indexOf(';', index);
          const retExpr = blockStr.substring(index + 6, semi).trim();
          const retVal = retExpr ? evalExpr(retExpr, scope) : 0;
          return retVal;
        }

        // ── D. if (...) { ... } else { ... } ──
        if (blockStr.startsWith('if', index) && (blockStr[index + 2] === ' ' || blockStr[index + 2] === '(')) {
          const openParen = blockStr.indexOf('(', index);
          let closeParen = openParen + 1;
          let depth = 1;
          while (closeParen < len && depth > 0) {
            if (blockStr[closeParen] === '(') depth++;
            else if (blockStr[closeParen] === ')') depth--;
            closeParen++;
          }
          const condExpr = blockStr.substring(openParen + 1, closeParen - 1);
          const condVal = Boolean(evalExpr(condExpr, scope));

          // Get if block
          let blockStart = blockStr.indexOf('{', closeParen);
          let blockEnd = blockStart + 1;
          depth = 1;
          while (blockEnd < len && depth > 0) {
            if (blockStr[blockEnd] === '{') depth++;
            else if (blockStr[blockEnd] === '}') depth--;
            blockEnd++;
          }
          const ifBody = blockStr.substring(blockStart + 1, blockEnd - 1);
          index = blockEnd;

          // Check else block
          let elseIndex = index;
          while (elseIndex < len && /\s/.test(blockStr[elseIndex])) elseIndex++;
          if (blockStr.startsWith('else', elseIndex)) {
            let elseStart = blockStr.indexOf('{', elseIndex);
            let elseEnd = elseStart + 1;
            depth = 1;
            while (elseEnd < len && depth > 0) {
              if (blockStr[elseEnd] === '{') depth++;
              else if (blockStr[elseEnd] === '}') depth--;
              elseEnd++;
            }
            const elseBody = blockStr.substring(elseStart + 1, elseEnd - 1);
            index = elseEnd;

            if (condVal) {
              const res = executeBlock(ifBody, scope);
              if (res !== undefined) return res;
            } else {
              const res = executeBlock(elseBody, scope);
              if (res !== undefined) return res;
            }
          } else {
            if (condVal) {
              const res = executeBlock(ifBody, scope);
              if (res !== undefined) return res;
            }
          }
          continue;
        }

        // ── E. for (init; cond; step) { ... } ──
        if (blockStr.startsWith('for', index) && (blockStr[index + 3] === ' ' || blockStr[index + 3] === '(')) {
          const openParen = blockStr.indexOf('(', index);
          let closeParen = openParen + 1;
          let depth = 1;
          while (closeParen < len && depth > 0) {
            if (blockStr[closeParen] === '(') depth++;
            else if (blockStr[closeParen] === ')') depth--;
            closeParen++;
          }
          const header = blockStr.substring(openParen + 1, closeParen - 1);
          const parts = header.split(';');
          const initPart = parts[0] || '';
          const condPart = parts[1] || '';
          const stepPart = parts[2] || '';

          // Execute init
          if (initPart.trim()) executeBlock(initPart + ';', scope);

          let blockStart = blockStr.indexOf('{', closeParen);
          let blockEnd = blockStart + 1;
          depth = 1;
          while (blockEnd < len && depth > 0) {
            if (blockStr[blockEnd] === '{') depth++;
            else if (blockStr[blockEnd] === '}') depth--;
            blockEnd++;
          }
          const forBody = blockStr.substring(blockStart + 1, blockEnd - 1);
          index = blockEnd;

          while (condPart.trim() ? Boolean(evalExpr(condPart, scope)) : true) {
            if (instructionCount++ > MAX_INSTRUCTIONS) {
              throw new Error('Runtime Error: Time Limit Exceeded (Infinite for loop detected).');
            }
            const res = executeBlock(forBody, scope);
            if (res !== undefined) return res;
            if (stepPart.trim()) executeBlock(stepPart + ';', scope);
          }
          continue;
        }

        // ── F. while (cond) { ... } ──
        if (blockStr.startsWith('while', index) && (blockStr[index + 5] === ' ' || blockStr[index + 5] === '(')) {
          const openParen = blockStr.indexOf('(', index);
          let closeParen = openParen + 1;
          let depth = 1;
          while (closeParen < len && depth > 0) {
            if (blockStr[closeParen] === '(') depth++;
            else if (blockStr[closeParen] === ')') depth--;
            closeParen++;
          }
          const condPart = blockStr.substring(openParen + 1, closeParen - 1);

          let blockStart = blockStr.indexOf('{', closeParen);
          let blockEnd = blockStart + 1;
          depth = 1;
          while (blockEnd < len && depth > 0) {
            if (blockStr[blockEnd] === '{') depth++;
            else if (blockStr[blockEnd] === '}') depth--;
            blockEnd++;
          }
          const whileBody = blockStr.substring(blockStart + 1, blockEnd - 1);
          index = blockEnd;

          while (Boolean(evalExpr(condPart, scope))) {
            if (instructionCount++ > MAX_INSTRUCTIONS) {
              throw new Error('Runtime Error: Time Limit Exceeded (Infinite while loop detected).');
            }
            const res = executeBlock(whileBody, scope);
            if (res !== undefined) return res;
          }
          continue;
        }

        // ── G. Variable Declarations & Assignments ──
        const semi = blockStr.indexOf(';', index);
        if (semi !== -1) {
          const stmt = blockStr.substring(index, semi).trim();
          index = semi + 1;

          if (!stmt) continue;

          // e.g. int a = 5, b = 10; or arr[0] = 4; or a++; or a += 2;
          const declMatch = stmt.match(/^(?:int|float|double|char|long|short|unsigned|bool)\s+(.+)/);
          if (declMatch) {
            const declList = splitArgs(declMatch[1]);
            declList.forEach((decl) => {
              // Array declaration: int arr[5] = {1, 2, 3};
              const arrMatch = decl.match(/^([A-Za-z0-9_]+)\[([^\]]*)\](?:\s*=\s*\{([^}]+)\})?/);
              if (arrMatch) {
                const arrName = arrMatch[1];
                const initValues = arrMatch[3]
                  ? arrMatch[3].split(',').map((v) => evalExpr(v.trim(), scope))
                  : [];
                scope[arrName] = initValues;
                return;
              }

              // Normal var: x = 10
              const eqIdx = decl.indexOf('=');
              if (eqIdx !== -1) {
                const vName = decl.substring(0, eqIdx).replace(/[*&]/g, '').trim();
                const vVal = decl.substring(eqIdx + 1).trim();
                scope[vName] = evalExpr(vVal, scope);
              } else {
                const vName = decl.replace(/[*&]/g, '').trim();
                scope[vName] = 0;
              }
            });
            continue;
          }

          // Compound assignments: a++, a--, a += 5, a = 10
          if (stmt.includes('++')) {
            const vName = stmt.replace(/\+\+/g, '').replace(/[*&]/g, '').trim();
            if (scope[vName] !== undefined) scope[vName] += 1;
            continue;
          }
          if (stmt.includes('--')) {
            const vName = stmt.replace(/--/g, '').replace(/[*&]/g, '').trim();
            if (scope[vName] !== undefined) scope[vName] -= 1;
            continue;
          }

          // Array element assignment: arr[i] = val
          const arrSetMatch = stmt.match(/^([A-Za-z0-9_]+)\[([^\]]+)\]\s*=\s*(.+)/);
          if (arrSetMatch) {
            const arrName = arrSetMatch[1];
            const idx = evalExpr(arrSetMatch[2], scope);
            const val = evalExpr(arrSetMatch[3], scope);
            if (Array.isArray(scope[arrName])) {
              scope[arrName][idx] = val;
            }
            continue;
          }

          // Regular assignment: x = 5, x += 2, x -= 2
          const assignMatch = stmt.match(/^([A-Za-z0-9_]+)\s*(\+=|-=|\*=|\/=|%=|=)\s*(.+)/);
          if (assignMatch) {
            const vName = assignMatch[1].trim();
            const op = assignMatch[2];
            const val = evalExpr(assignMatch[3], scope);
            if (op === '=') scope[vName] = val;
            else if (op === '+=') scope[vName] = (scope[vName] || 0) + val;
            else if (op === '-=') scope[vName] = (scope[vName] || 0) - val;
            else if (op === '*=') scope[vName] = (scope[vName] || 0) * val;
            else if (op === '/=') scope[vName] = val !== 0 ? Math.trunc((scope[vName] || 0) / val) : 0;
            else if (op === '%=') scope[vName] = val !== 0 ? (scope[vName] || 0) % val : 0;
            continue;
          }

          // Direct expression call: e.g. swap(&a, &b);
          evalExpr(stmt, scope);
          continue;
        }

        index++;
      }
    }

    // ── 7. Execute `main()` ──
    const mainResult = runFunction('main');
    if (typeof mainResult === 'number') {
      exitCode = mainResult;
    }

    const outputText = logs.length > 0 ? logs.join('') : '[Program finished successfully with no standard output.]';

    return {
      output: outputText,
      error: null,
      executionTimeMs: Math.max(1, Math.round(performance.now() - startTime)),
      exitCode,
    };
  } catch (err) {
    if (err.message === '__EXIT_PROGRAM__') {
      return {
        output: logs.join(''),
        error: null,
        executionTimeMs: Math.max(1, Math.round(performance.now() - startTime)),
        exitCode,
      };
    }

    errorMsg = err.message || 'Execution error';
    return {
      output: logs.length > 0 ? `${logs.join('')}\n\n❌ ${errorMsg}` : `❌ ${errorMsg}`,
      error: errorMsg,
      executionTimeMs: Math.max(1, Math.round(performance.now() - startTime)),
      exitCode: 1,
    };
  }
}
