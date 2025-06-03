import React, { useEffect, useState } from 'react';
import GraphViewer from './components/GraphViewer';

// parseVault function moved directly into App.jsx to avoid import issues
async function parseVault() {
  try {
    const response = await fetch('/vault/');
    if (!response.ok) {
      throw new Error('Vault directory not found');
    }
    
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const files = Array.from(doc.querySelectorAll('a'))
      .map(a => a.href)
      .filter(href => href.endsWith('.md'));
    
    const nodes = [];
    const links = [];
    
    for (let url of files) {
      try {
        const res = await fetch(url);
        const content = await res.text();
        const id = decodeURIComponent(url.split('/').pop().replace('.md', ''));
        nodes.push({ id, content });
        
        // [[Note Name]]
        const matches = [...content.matchAll(/\[\[(.*?)\]\]/g)];
        for (let m of matches) {
          const target = m[1].split('|')[0].trim();
          links.push({ source: id, target });
        }
        
        // [Text](https://example.com)
        const exts = [...content.matchAll(/\[(.*?)\]\((https?:.*?)\)/g)];
        exts.forEach(([_, label, link]) => {
          nodes.push({ id: link, url: link, group: 'external' });
          links.push({ source: id, target: link });
        });
      } catch (error) {
        console.warn(`Could not fetch ${url}:`, error);
      }
    }
    
    return { nodes, links };
  } catch (error) {
    console.warn('Could not load vault data, using sample data:', error);
    // Return sample data when vault is not available
    return {
      nodes: [
        { id: "Welcome", content: "# Welcome to VaultGraph\nThis is a sample note with [[Getting Started]]." },
        { id: "Getting Started", content: "# Getting Started\nAdd your vault files to see the real graph. Link to [[Features]]." },
        { id: "Features", content: "# Features\n- Interactive graph visualization\n- Link between notes\n- Supports [[Welcome]] back references" }
      ],
      links: [
        { source: "Welcome", target: "Getting Started" },
        { source: "Getting Started", target: "Features" },
        { source: "Features", target: "Welcome" }
      ]
    };
  }
}

function App() {
  const [data, setData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    parseVault()
      .then(setData)
      .catch(error => {
        console.error('Error parsing vault:', error);
        // Set sample data on error
        setData({
          nodes: [
            { id: "Error", content: "# Error Loading Vault\nCould not load vault data." }
          ],
          links: []
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div>Loading your vault...</div>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>VaultGraph</h1>
      <p>Interactive visualization of your knowledge vault</p>
      <GraphViewer data={data} />
    </div>
  );
}

export default App;
