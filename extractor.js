const fs = require('fs');
const code = fs.readFileSync('build_new_admin.js', 'utf8');

const tMatch = code.match(/const newTemplate = `([\s\S]*?)`;\s*const newStyles/);
if (tMatch) {
    fs.writeFileSync('admin_template.html', tMatch[1]);
    console.log('Extracted admin_template.html');
}

const sMatch = code.match(/const newStyles = `([\s\S]*?)`;\s*(?:const|let|var|if|try|console|fs)/);
if (sMatch) {
    fs.writeFileSync('admin_styles.css', sMatch[1]);
    console.log('Extracted admin_styles.css');
}
