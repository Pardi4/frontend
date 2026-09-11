const fs = require('fs');
let code = fs.readFileSync('src/app/pages/admin.component.ts', 'utf8');
const search = 'modal-body\" style=\"padding-top: 1rem;\">\\n              <div style=\"display: grid;';
const replace = 'modal-body\" style=\"padding-top: 1rem;\">\n              <div style=\"display: grid;';
code = code.replace(/\\n/g, '\n');
fs.writeFileSync('src/app/pages/admin.component.ts', code);
