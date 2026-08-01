const fs = require('fs');
const code = fs.readFileSync('admin_template.html', 'utf8');
const classes = [...code.matchAll(/class="([^"]+)"/g)].map(m => m[1]);
const uniqueClasses = [...new Set(classes.join(' ').split(/\s+/))];
console.log(uniqueClasses.sort().join(' '));
