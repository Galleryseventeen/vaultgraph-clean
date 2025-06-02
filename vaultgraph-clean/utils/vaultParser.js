// utils/vaultParser.js
export async function parseVault() {
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
    }
    
    return { nodes, links };
  } catch (error) {
    console.warn('Could not load vault data, using sample data:', error);
    // Return sample data when vault is not available
    return {
      nodes: [
        { id: "Welcome", content: "# Welcome to VaultGraph\nThis is a sample note." },
        { id: "Getting Started", content: "# Getting Started\nAdd your vault files to see the real graph." },
        { id: "Features", content: "# Features\n- Interactive graph visualization\n- Link between notes" }
      ],
      links: [
        { source: "Welcome", target: "Getting Started" },
        { source: "Getting Started", target: "Features" }
      ]
    };
  }
}
