const fs = require('fs');
let code = fs.readFileSync('src/app/pages/admin.component.ts', 'utf8');

code = code.replace(/marketing: 'marketingTitle'/g, "marketing: 'marketingTitle',\n      dataset: 'search' as any");
code = code.replace(/marketing: 'marketingDescription'/g, "marketing: 'marketingDescription',\n      dataset: 'search' as any");

fs.writeFileSync('src/app/pages/admin.component.ts', code);
