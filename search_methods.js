const fs = require('fs');
const code = fs.readFileSync('src/app/pages/admin.component.ts', 'utf8');

let m = code.match(/showUserHistory\([\s\S]*?\)/g);
if (m) console.log("showUserHistory calls:", Array.from(new Set(m)));

m = code.match(/click.*?(user)/ig);
if (m) console.log("clicks involving user:", Array.from(new Set(m)).slice(0, 5));
