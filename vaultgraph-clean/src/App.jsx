async function parseVault() {
  try {
    const files = ['/vault/Aest.md']; // hardcoded list of your .md files

    const nodes = [];
    const links = [];

    for (let url of files) {
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
    }

    return { nodes, links };
  } catch (err) {
    console.error('Vault error, fallback to sample', err);
    return {
      nodes: [
        { id: "Sample", content: "# Sample note fallback\nVercel could not load markdown file." }
      ],
      links: []
    };
  }
}
