import React, { useEffect, useState } from 'react';
import GraphViewer from './components/GraphViewer';

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
        
        const matches = [...content.matchAll(/\[\[(.*?)\]\]/g)];
        for (let m of matches) {
          const target = m[1].split('|')[0].trim();
          links.push({ source: id, target });
        }
        
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
    return {
      nodes: [
        { id: "Welcome", content: "# Welcome to VaultGraph" },
        { id: "Getting Started", content: "# Getting Started" },
        { id: "Features", content: "# Features" }
      ],
      links: [
        { source: "Welcome", target: "Getting Started" },
        { source: "Getting Started", target: "Features" }
      ]
    };
  }
}

function App() {
  const [data, setData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    parseVault().then(setData);
  }, []);

  return (
    <div className="App">
      <h1>VaultGraph</h1>
      <GraphViewer data={data} />
    </div>
  );
}

export default App;
