const fs = require('fs');
const lines = fs.readFileSync('index.html', 'utf8').split('\n');
lines.forEach((l, i) => {
  if (l.includes('profile.png') || l.includes('hero-img') || l.includes('<body') || l.includes('class="layout"')) {
    console.log(i + 1 + ': ' + l.trim());
  }
});
