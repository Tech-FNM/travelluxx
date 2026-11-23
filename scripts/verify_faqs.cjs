const fs = require('fs');
const path = require('path');

function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results = results.concat(getHtmlFiles(full));
    } else if (file.endsWith('.html') && !file.includes('404') && !file.includes('500') && !file.includes('admin') && !file.includes('[slug]')) {
      results.push(full);
    }
  });
  return results;
}

const baseDir = path.join(process.cwd(), '.next', 'server', 'pages');
const files = getHtmlFiles(baseDir);

console.log('Total public static HTML pages checked:', files.length);

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const rel = f.replace(baseDir, '');
  
  // Extract all h1, h2, h3
  const h1s = content.match(/<h1[^>]*>[\s\S]*?<\/h1>/gi) || [];
  const h2s = content.match(/<h2[^>]*>[\s\S]*?<\/h2>/gi) || [];
  const h3s = content.match(/<h3[^>]*>[\s\S]*?<\/h3>/gi) || [];
  const hasFaqSchema = content.includes('"FAQPage"');

  console.log('PAGE:', rel);
  console.log('  H1 count:', h1s.length, '| H2 count:', h2s.length, '| H3 count:', h3s.length, '| FAQ Schema:', hasFaqSchema ? 'YES' : 'NO');
  h3s.forEach(h => {
    const text = h.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    if (text.length > 0) {
      console.log('    [H3] ' + text.substring(0, 80));
    }
  });
  console.log('--------------------------------------------------');
});
