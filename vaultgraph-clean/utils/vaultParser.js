// utils/vaultParser.js

export async function parseVault() {
  const response = await fetch('/vault/');
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
}
