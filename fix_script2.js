const fs = require('fs');
let code = fs.readFileSync('build_new_admin_fixed.js', 'utf8');

// The line is: adminCode.substring(sEnd + adminCode.match(/`\]\r?\n}\)/)[0].length - 3)
code = code.replace(
  /adminCode\.substring\(sEnd \+ adminCode\.match\(\/\\`\\]\\r\?\\n}\\)\/\)\[0\]\.length - 3\)/g,
  "adminCode.substring(adminCode.indexOf('export class AdminComponent'))"
);

fs.writeFileSync('build_new_admin_fixed2.js', code);
console.log("Created build_new_admin_fixed2.js");
