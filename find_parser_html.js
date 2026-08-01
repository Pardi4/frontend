const fs = require('fs');
const lines = fs.readFileSync('src/app/pages/admin.component.ts', 'utf8').split('\n');
const idx = lines.findIndex(l => l.includes('parserEvents()'));
if (idx !== -1) {
  console.log(lines.slice(idx - 5, idx + 25).join('\n'));
} else {
  console.log('not found');
}
