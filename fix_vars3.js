const fs = require('fs');
let code = fs.readFileSync('src/app/pages/admin.component.ts', 'utf8');

code = code.replace(/tr\('parserHealthTitle'\)/g, "'Parser Health'");
code = code.replace(/tr\('mostHits'\)/g, "'Most Hits'");
code = code.replace(/tr\('weakEntries'\)/g, "'Weak'");
code = code.replace(/tr\('clearAll'\)/g, "'Clear'");
code = code.replace(/\[class\.text-danger\]="s\.danger"/g, '');

fs.writeFileSync('src/app/pages/admin.component.ts', code);
console.log('Fixed final TS errors');
