const fs = require('fs');
let code = fs.readFileSync('build_new_admin.js', 'utf8');

// Replace the bad sEnd check
code = code.replace(
  "const sEnd = adminCode.indexOf('\\`]\\n})');", 
  "const sEnd = adminCode.search(/\\`\\]\\r?\\n}\\)/);"
);

// Replace the substring logic
code = code.replace(
  "adminCode.substring(sEnd + 5)", 
  "adminCode.substring(sEnd + adminCode.match(/\\`\\]\\r?\\n}\\)/)[0].length - 3)"
);

fs.writeFileSync('build_new_admin_fixed.js', code);
console.log("Created build_new_admin_fixed.js");
