const fs = require('fs');

const code = fs.readFileSync('src/app/pages/admin.component.ts', 'utf-8');
const template = fs.readFileSync('admin_template.html', 'utf-8');
const styles = fs.readFileSync('admin_styles.css', 'utf-8');

// Find template start
const startIdx = code.indexOf('  template: `\n');
if (startIdx === -1) throw new Error("Could not find template start");

// Find styles start
const midIdx = code.indexOf('\n  `,\n  styles: [`\n');
if (midIdx === -1) {
    // try with \r\n
    const midIdx2 = code.indexOf('\r\n  `,\r\n  styles: [`\r\n');
    if (midIdx2 === -1) {
        console.error("Could not find styles start");
        process.exit(1);
    }
}
const actualMidIdx = code.indexOf('\n  `,\n  styles: [`\n') !== -1 ? code.indexOf('\n  `,\n  styles: [`\n') : code.indexOf('\r\n  `,\r\n  styles: [`\r\n');
const midLength = code.indexOf('\n  `,\n  styles: [`\n') !== -1 ? '\n  `,\n  styles: [`\n'.length : '\r\n  `,\r\n  styles: [`\r\n'.length;

// Find styles end
const endIdx = code.indexOf('\n  `]\n})\nexport class AdminComponent');
const actualEndIdx = endIdx !== -1 ? endIdx : code.indexOf('\r\n  `]\r\n})\r\nexport class AdminComponent');

if (actualEndIdx === -1) {
    console.error("Could not find styles end");
    process.exit(1);
}

const beforeTemplate = code.substring(0, startIdx + '  template: `\n'.length);
const betweenTemplateAndStyles = code.substring(actualMidIdx, actualMidIdx + midLength);
const afterStyles = code.substring(actualEndIdx);

const newCode = beforeTemplate + template + betweenTemplateAndStyles + styles + afterStyles;

fs.writeFileSync('src/app/pages/admin.component.ts', newCode);
console.log("Admin rewrite applied successfully with correct boundaries.");
