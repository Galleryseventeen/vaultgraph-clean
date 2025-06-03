import React, { useEffect, useState } from 'react';
import GraphViewer from './components/GraphViewer';

// Parse vault function
async function parseVault() {
  try {
    console.log('Attempting to fetch vault directory...');
    const response = await fetch('/vault/');
    
    if (!response.ok) {
      console.log('Vault directory not found, using sample data');
      throw new Error('Vault directory not found');
    }
    
    const html = await response.text();
    console.log('Vault directory response received');
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const files = Array.from(doc.querySelectorAll('a'))
      .map(a => a.href)
      .filter(href => href.endsWith('.md'));
    
    console.log('Found markdown files:', files);
    
    const nodes = [];
    const links = [];
    
    for (let url of files) {
      try {
        const res = await fetch(url);
        const content = await res.text();
        const id = decodeURIComponent(url.split('/').pop().replace('.md', ''));
        nodes.push({ id, content });
        
        // Find [[Note Name]] links
        const matches = [...content.matchAll(/\[\[(.*?)\]\]/g)];
        for (let m of matches) {
          const target = m[1].split('|')[0].trim();
          links.push({ source: id, target });
        }
        
        // Find [Text](https://example.com) external links
        const exts = [...content.matchAll(/\[(.*?)\]\((https?:.*?)\)/g)];
        exts.forEach(([_, label, link]) => {
          nodes.push({ id: link, url: link, group: 'external' });
          links.push({ source: id, target: link });
        });
      } catch (error) {
        console.warn(`Could not fetch ${url}:`, error);
      }
    }
    
    console.log('Parsed data:', { nodes: nodes.length, links: links.length });
    return { nodes, links };
    
  } catch (error) {
    console.log('Using sample data due to error:', error);
    // Return sample data when vault is not available
    return {
      nodes: [
        { id: "Welcome", content: "# Welcome to VaultGraph\nThis is a sample note with connections." },
        { id: "Getting Started", content: "# Getting Started\nLearn how to use VaultGraph effectively." },
        { id: "Features", content: "# Features\n- Interactive graph visualization\n- Link between notes\n- Real-time updates" }
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
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('App component mounted, loading vault...');
    parseVault()
      .then(result => {
        console.log('Vault loaded successfully:', result);
        setData(result);
      })
      .catch(error => {
        console.error('Error parsing vault:', error);
        setError(error.message);
        // Set sample data on error
        setData({
          nodes: [
            { id: "Error", content: "# Error Loading Vault\nCould not load vault data." }
          ],
          links: []
        });
      })
      .finally(() => {
        setLoading(false);
      });
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
      {error && <p style={{color: 'orange'}}>Note: Using sample data ({error})</p>}
      <GraphViewer data={data} />
    </div>
  );
}

export default App;
