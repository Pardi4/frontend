const fs = require('fs');
let styles = fs.readFileSync('admin_styles.css', 'utf8');

// The original CSS has:
// :host {
//   --bg-color: #0b0f19; ...
// }

const lightVars = `:host {
      --bg-color: #f1f5f9;
      --bg-glass: #ffffff;
      --bg-glass-hover: #f8fafc;
      --border-glass: #e2e8f0;
      --text-main: #0f172a;
      --text-muted: #64748b;
      --accent: #2563eb;
      --accent-glow: rgba(37, 99, 235, 0.2);
      --success: #16a34a;
      --danger: #dc2626;
      --warning: #d97706;
      
      display: block;
      min-height: 100vh;
      background-color: var(--bg-color);
      color: var(--text-main);
      font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
    }`;

styles = styles.replace(/:host\s*{[^}]+}/, lightVars);
// Remove text-shadow if it exists to keep it flat
styles = styles.replace(/text-shadow:[^;]+;/g, '');
// Change box-shadow to be dark instead of light
styles = styles.replace(/box-shadow:\s*0\s*4px\s*24px\s*rgba\(0,\s*0,\s*0,\s*0\.2\)/g, 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)');
styles = styles.replace(/box-shadow:\s*0\s*0\s*12px\s*var\(--accent-glow\)/g, ''); // removed glow shadow on hover

let code = fs.readFileSync('src/app/pages/admin.component.ts', 'utf8');

const cssStart = '/* CSS */';
const cssEnd = '</style>';
const startIdx = code.indexOf(cssStart);
const endIdx = code.indexOf(cssEnd, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
  // Need to strip the `styles: [\`` from admin_styles.css since it already has it, 
  // or just extract everything between `styles: [\`` and `\n  \`]`
  let pureCss = styles.replace(/styles:\s*\[`/, '').replace(/`\]\s*$/, '').trim();
  code = code.substring(0, startIdx) + "/* CSS */\n" + pureCss + "\n  " + code.substring(endIdx);
  fs.writeFileSync('src/app/pages/admin.component.ts', code);
  console.log('Successfully injected light mode CSS.');
} else {
  console.error('Could not find CSS boundaries in admin.component.ts');
}
