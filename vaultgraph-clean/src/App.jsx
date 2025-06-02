import React from 'react';
import GraphViewer from './components/GraphViewer.jsx';
import './style.css';

const App = () => {
  return (
    <div className="app">
      <h1>VaultGraph 🧠</h1>
      <GraphViewer />
    </div>
  );
};

export default App;

