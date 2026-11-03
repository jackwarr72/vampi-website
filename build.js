// build.js — produces a production-ready dist/ folder for the El Vampi site.
// Usage: npm run build
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SRC = 'src';
const DIST = 'public';

function walk(dir, base = '') {
  const full = path.join(dir, base);
  return fs.readdirSync(full, { withFileTypes: true }).flatMap(d => {
    const rel = path.join(base, d.name);
    return d.isDirectory() ? walk(dir, rel) : [rel];
  });
}

function minifyCSS(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')          // comments
    .replace(/\s*([{}:;,>])\s*/g, '$1')        // whitespace
    .replace(/;}/g, '}')                        // trailing semicolons
    .trim();
}

function minifyJS(js) {
  return js
    .replace(/\/\*[\s\S]*?\*\//g, '')          // block comments
    .replace(/\/\/[^\n\r]*/g, '')               // line comments
    .replace(/\s+/g, ' ')                       // collapse whitespace
    .trim();
}

function copy(src, dst) {
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(src, dst);
}

// Clean the dist folder, tolerant of locked/missing dirs.
const distPath = path.join(ROOT, DIST);
try { fs.rmSync(distPath, { recursive: true, force: true }); }
catch (e) {
  // Fallback: wipe contents only.
  for (const f of fs.readdirSync(distPath)) {
    fs.rmSync(path.join(distPath, f), { recursive: true, force: true });
  }
}

// Copy static assets (images + vendored libs) as-is
walk(path.join(ROOT, SRC)).forEach(f => {
  copy(path.join(ROOT, SRC, f), path.join(ROOT, DIST, f));
});

// Parse src/precios.md (pipe table) into <tr> rows for the prices table.
function parsePrecios() {
  const md = fs.readFileSync(path.join(ROOT, SRC, 'precios.md'), 'utf8');
  const rows = md.split('\n')
    .map(l => l.trim())
    .filter(l => l.startsWith('|'))
    .map(l => l.split('|').slice(1, -1).map(c => c.trim()))
    .filter(r => r.length === 3 && !/^[-:]+$/.test(r[1]));
  return rows.map(r => `          <tr><th>${r[0]}</th><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('\n');
}

// Inline CSS and JS into HTML (production: fewer requests)
let html = fs.readFileSync(path.join(ROOT, SRC, 'index.html'), 'utf8');
html = html.replace(/<!-- PRECIOS -->/, parsePrecios());
const css = minifyCSS(fs.readFileSync(path.join(ROOT, SRC, 'style.css'), 'utf8'));
const js = minifyJS(fs.readFileSync(path.join(ROOT, SRC, 'app.js'), 'utf8'));

const out = html
  .replace(/<link rel="stylesheet" href="style\.css">/, `<style>${css}</style>`)
  .replace(/<script src="vendor\/gsap\.min\.js"><\/script>/,
    `<script>${minifyJS(fs.readFileSync(path.join(ROOT, SRC, 'vendor', 'gsap.min.js'), 'utf8'))}</script>`)
  .replace(/<script src="vendor\/ScrollTrigger\.min\.js"><\/script>/,
    `<script>${minifyJS(fs.readFileSync(path.join(ROOT, SRC, 'vendor', 'ScrollTrigger.min.js'), 'utf8'))}</script>`)
  .replace(/<script src="app\.js"><\/script>/, `<script>${js}</script>`);

fs.writeFileSync(path.join(ROOT, DIST, 'index.html'), out);

const files = walk(path.join(ROOT, DIST));
console.log(`build: ${files.length} files in ${DIST}/`);
console.log('  ' + files.map(f => f).join('\n  '));
