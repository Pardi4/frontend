const fs = require('fs');
let code = fs.readFileSync('build_new_admin.js', 'utf8');
code = code.replace('process.exit(1);', '');
code = code.replace(/fs\.writeFileSync\(adminFilePath,.*?\);/g, "fs.writeFileSync('admin_template.html', newTemplate); fs.writeFileSync('admin_styles.css', newStyles);");
fs.writeFileSync('dump_final.js', code);
