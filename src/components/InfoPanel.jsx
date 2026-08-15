// src/components/InfoPanel.jsx — Clean algorithm complexity and description panel

function getComplexityClass(val) {
  if (!val) return '';
  if (val.includes('1)') || val.includes('log')) return 'good';
  if (val.includes('n²') || val.includes('n^2') || val.includes('V²')) return 'bad';
  return 'med';
}

export default function InfoPanel({ metadata, currentMessage }) {
  if (!metadata) return null;
  const { name, description, fact, timeComplexity, spaceComplexity, stable } = metadata;

  return (
    <div className="info-panel">
      <div className="info-panel-title">{name}</div>

      {/* Complexity Breakdown */}
      <table className="complexity-table">
        <thead>
          <tr>
            <th>Scenario</th>
            <th>Time Complexity</th>
            <th>Space Complexity</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Best Case</td>
            <td className={getComplexityClass(timeComplexity.best)}>{timeComplexity.best}</td>
            <td rowSpan={3} style={{ verticalAlign: 'middle' }}>{spaceComplexity}</td>
          </tr>
          <tr>
            <td>Average</td>
            <td className={getComplexityClass(timeComplexity.average)}>{timeComplexity.average}</td>
          </tr>
          <tr>
            <td>Worst Case</td>
            <td className={getComplexityClass(timeComplexity.worst)}>{timeComplexity.worst}</td>
          </tr>
          <tr>
            <td>Stability</td>
            <td colSpan={2}>{stable ? 'Stable' : 'Unstable'}</td>
          </tr>
        </tbody>
      </table>

      {/* Description */}
      <p className="info-description">{description}</p>

      {/* Key Insight */}
      {fact && (
        <div className="info-fact-box">
          <strong>Note:</strong> {fact}
        </div>
      )}
    </div>
  );
}
