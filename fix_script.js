const fs = require('fs');
let code = fs.readFileSync('build_new_admin.js', 'utf8');

code = code.replace(
  "const sEnd = adminCode.indexOf('\\`]\\n})');", 
  "const sEnd = adminCode.search(/\\`\\]\\r?\\n}\\)/);"
);

code = code.replace(
  "adminCode.substring(sEnd + 5)", 
  "adminCode.substring(sEnd + adminCode.match(/\\`\\]\\r?\\n}\\)/)[0].length - 3)"
);

fs.writeFileSync('build_new_admin_fixed.js', code);
console.log("Created build_new_admin_fixed.js");
