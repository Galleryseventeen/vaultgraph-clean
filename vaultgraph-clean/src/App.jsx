import React, { useState, useEffect } from 'react';
import GraphViewer from './components/GraphViewer.jsx';
import './style.css';
import vaultData from './utils/vaultParser.js'; // assume it exports data directly

const App = () => {
  const [graphData, setGraphData] = useState(null);

  useEffect(() => {
    // replace with your real data loader
    setGraphData(vaultData);
  }, []);

  const handleNodeClick = node => {
    alert(`Node clicked: ${node.id}`);
  };

  return (
    <div className="app">
      <h1>VaultGraph 🧠</h1>
      {graphData ? (
        <GraphViewer data={graphData} onNodeClick={handleNodeClick} />
      ) : (
        <p>Loading graph...</p>
      )}
    </div>
  );
};

export default App;
