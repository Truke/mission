const fs = require('fs');
const path = require('path');

const skillRoot = path.join(process.env.HOME, '.agents/skills/guizang-ppt-skill');
const templatePath = path.join(skillRoot, 'assets/template-swiss.html');
const slidesPath = path.join(__dirname, 'slides.html');
const outPath = path.join(__dirname, 'index.html');
const motionSrc = path.join(skillRoot, 'assets/motion.min.js');
const motionDst = path.join(__dirname, 'assets', 'motion.min.js');

let html = fs.readFileSync(templatePath, 'utf8');
const slides = fs.readFileSync(slidesPath, 'utf8');

html = html.replace(
  /<title>.*?<\/title>/,
  '<title>使命必达 · 推广讲解 · Swiss Deck</title>'
);

const deckStart = html.indexOf('<div id="deck">');
const deckEnd = html.indexOf('</div>\n\n<div id="nav">');
if (deckStart === -1 || deckEnd === -1) {
  throw new Error('Could not locate deck region in template');
}

html =
  html.slice(0, deckStart) +
  '<div id="deck">\n\n' +
  slides +
  '\n</div>' +
  html.slice(deckEnd + 6);

fs.writeFileSync(outPath, html);
fs.mkdirSync(path.dirname(motionDst), { recursive: true });
if (fs.existsSync(motionSrc)) {
  fs.copyFileSync(motionSrc, motionDst);
}

console.log('Built', outPath);
