const fs = require('fs');
const path = require('path');

let checkedPages = 0;
let checkedH3s = 0;
let violations = 0;

function checkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      checkDir(full);
    } else if (f.endsWith('.html')) {
      checkedPages++;
      const html = fs.readFileSync(full, 'utf8');
      const h3FaqMatches = html.match(/<h3[^>]*id="[^"]*faq-q[^"]*"[^>]*>[\s\S]*?<\/h3>/g);
      if (h3FaqMatches) {
        for (const m of h3FaqMatches) {
          checkedH3s++;
          if (/<button/i.test(m) || /<span/i.test(m)) {
            console.error('VIOLATION in', full, ':', m);
            violations++;
          }
        }
      }
    }
  }
}

checkDir('.next/server/pages');
console.log(`Audited ${checkedPages} HTML pages.`);
console.log(`Checked ${checkedH3s} FAQ <h3> elements.`);
if (violations === 0) {
  console.log('✅ PERFECT: ZERO <button> or <span> tags inside any FAQ <h3> across all pages!');
} else {
  console.error(`❌ Found ${violations} violations!`);
  process.exit(1);
}
