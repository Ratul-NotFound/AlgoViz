// src/components/InfoPanel.jsx
// Algorithm info: complexity table, description, current step explanation

function complexityClass(val) {
  if (val.includes('1)')) return 'good';
  if (val.includes('log')) return 'good';
  if (val.includes('n²') || val.includes('n^2') || val.includes('V²')) return 'bad';
  return 'med';
}

export default function InfoPanel({ metadata, currentMessage }) {
  if (!metadata) return null;
  const { name, description, fact, timeComplexity, spaceComplexity, stable } = metadata;

  return (
    <div className="info-panel">
      <div className="info-panel-title">{name}</div>

      {/* Current step message */}
      {currentMessage && (
        <div className="info-step-box">
          💡 {currentMessage}
        </div>
      )}

      {/* Complexity Table */}
      <table className="complexity-table">
        <thead>
          <tr>
            <th>Case</th>
            <th>Time</th>
            <th>Space</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Best</td>
            <td className={complexityClass(timeComplexity.best)}>{timeComplexity.best}</td>
            <td rowSpan={3} className={complexityClass(spaceComplexity)} style={{ verticalAlign: 'middle' }}>{spaceComplexity}</td>
          </tr>
          <tr>
            <td>Average</td>
            <td className={complexityClass(timeComplexity.average)}>{timeComplexity.average}</td>
          </tr>
          <tr>
            <td>Worst</td>
            <td className={complexityClass(timeComplexity.worst)}>{timeComplexity.worst}</td>
          </tr>
          <tr>
            <td>Stable</td>
            <td colSpan={2} className={stable ? 'good' : 'bad'}>{stable ? '✅ Yes' : '❌ No'}</td>
          </tr>
        </tbody>
      </table>

      <p className="info-description">{description}</p>

      {fact && (
        <div className="info-fact-box">
          <span>💡</span>
          <span>{fact}</span>
        </div>
      )}
    </div>
  );
}
