import React, { useEffect, useState } from 'react';
import GraphViewer from './components/GraphViewer';
import { parseVault } from './utils/vaultParser.js';

function App() {
  const [data, setData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    parseVault().then(setData);
  }, []);

  return (
    <div className="App">
      <GraphViewer data={data} onNodeClick={node => alert(node.id)} />
    </div>
  );
}

export default App;
