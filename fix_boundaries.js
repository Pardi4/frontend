const fs = require('fs');
let js = fs.readFileSync('build_new_admin.js', 'utf8');

js = js.replace('const templateEnd = "  `,\\n  styles: [\\n    `\\n";', 'const templateEnd = /  `,\\r?\\n  styles: \\[\\r?\\n    `\\r?\\n/;');
js = js.replace('const stylesEnd = "    `\\n  ]\\n})";', 'const stylesEnd = /    `\\r?\\n  \\]\\r?\\n}\\)/;');

js = js.replace('const tsCodeStart = code.indexOf(templateStart) + templateStart.length;', 'const tsCodeStart = code.indexOf("  template: `") + "  template: `".length;');
js = js.replace('const tsCodeMid1 = code.indexOf(templateEnd);', 'const tsCodeMid1 = code.search(templateEnd);');
js = js.replace('const tsCodeMid2 = tsCodeMid1 + templateEnd.length;', 'const tsCodeMid2 = tsCodeMid1 + code.match(templateEnd)[0].length;');
js = js.replace('const tsCodeEnd = code.indexOf(stylesEnd);', 'const tsCodeEnd = code.search(stylesEnd);');

fs.writeFileSync('build_new_admin.js', js);
console.log('Fixed boundaries in build_new_admin.js');
