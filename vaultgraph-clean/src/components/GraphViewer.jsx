import React, { useEffect, useRef, useState } from 'react';

const GraphViewer = ({ data }) => {
  const svgRef = useRef();
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    if (!data || !data.nodes || data.nodes.length === 0) {
      console.log('No data available for graph');
      return;
    }

    console.log('Rendering graph with data:', data);

    // Simple D3-free implementation for testing
    const svg = svgRef.current;
    const width = 800;
    const height = 600;

    // Clear previous content
    svg.innerHTML = '';

    // Create simple circles for nodes
    data.nodes.forEach((node, i) => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      const x = 100 + (i % 5) * 150;
      const y = 100 + Math.floor(i / 5) * 150;
      
      circle.setAttribute('cx', x);
      circle.setAttribute('cy', y);
      circle.setAttribute('r', 30);
      circle.setAttribute('fill', node.group === 'external' ? '#ff6b6b' : '#4ecdc4');
      circle.setAttribute('stroke', '#fff');
      circle.setAttribute('stroke-width', 2);
      circle.style.cursor = 'pointer';
      
      circle.addEventListener('click', () => {
        setSelectedNode(node);
      });
      
      svg.appendChild(circle);

      // Add text labels
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', x);
      text.setAttribute('y', y + 5);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', 'white');
      text.setAttribute('font-size', '12');
      text.textContent = node.id.substring(0, 8) + (node.id.length > 8 ? '...' : '');
      
      svg.appendChild(text);
    });

    // Draw simple lines for links
    data.links.forEach(link => {
      const sourceIndex = data.nodes.findIndex(n => n.id === link.source);
      const targetIndex = data.nodes.findIndex(n => n.id === link.target);
      
      if (sourceIndex !== -1 && targetIndex !== -1) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        const sourceX = 100 + (sourceIndex % 5) * 150;
        const sourceY = 100 + Math.floor(sourceIndex / 5) * 150;
        const targetX = 100 + (targetIndex % 5) * 150;
        const targetY = 100 + Math.floor(targetIndex / 5) * 150;
        
        line.setAttribute('x1', sourceX);
        line.setAttribute('y1', sourceY);
        line.setAttribute('x2', targetX);
        line.setAttribute('y2', targetY);
        line.setAttribute('stroke', '#666');
        line.setAttribute('stroke-width', 2);
        
        svg.appendChild(line);
      }
    });

  }, [data]);

  if (!data || !data.nodes || data.nodes.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>No graph data available</p>
        <p>Make sure your vault files are in the public/vault directory</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div>
        <svg 
          ref={svgRef} 
          width={800} 
          height={600} 
          style={{ border: '1px solid #ccc', background: '#f9f9f9' }}
        />
      </div>
      
      {selectedNode && (
        <div style={{ 
          width: '300px', 
          padding: '20px', 
          background: '#f5f5f5', 
          borderRadius: '8px',
          color: '#333'
        }}>
          <h3>{selectedNode.id}</h3>
          <pre style={{ fontSize: '12px', whiteSpace: 'pre-wrap' }}>
            {selectedNode.content || 'No content available'}
          </pre>
          <button onClick={() => setSelectedNode(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default GraphViewer;
