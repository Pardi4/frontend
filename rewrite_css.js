const fs = require('fs');
let styles = fs.readFileSync('original_styles.css', 'utf8');

// The original CSS has:
// :host {
//   --bg-primary: #0f1115;
//   --bg-secondary: #161b22;
// ...

const modernVars = `:host {
      --bg-primary: #f8fafc;
      --bg-secondary: #ffffff;
      --border-glass: #e2e8f0;
      --text-primary: #0f172a;
      --text-secondary: #475569;
      --text-muted: #64748b;
      --accent-cyan: #2563eb;
      --accent-hover: #1d4ed8;
      --success: #16a34a;
      --warning: #ca8a04;
      --danger: #dc2626;
      --pending: #ea580c;
      
      --font-main: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      --font-heading: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      --font-mono: ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
      
      display: block;
      background-color: var(--bg-primary);
      color: var(--text-primary);
      font-family: var(--font-main);
      font-size: 14px;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }

    * { box-sizing: border-box; }

    /* Fix row actions overflowing */
    .row-actions {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .bug-meta {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .admin-brand {
      font-family: var(--font-heading) !important;
      font-weight: 700;
    }

    button {
      font-family: var(--font-main);
      font-size: 13px;
      font-weight: 500;
      border-radius: 4px;
    }
    
    .panel-head h2 {
      font-family: var(--font-heading);
    }
    
    /* Remove childish text-shadows or gradients if any */
    .glass-card, .admin-panel.glass, .mini-stat, .stat-card, article.glass {
      background: #ffffff !important;
      border: 1px solid var(--border-glass) !important;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
      border-radius: 8px !important;
      backdrop-filter: none !important;
    }
    
    .data-table th {
      background-color: #f1f5f9;
      color: #334155;
      font-weight: 600;
      text-transform: none; /* less childish than uppercase */
      letter-spacing: normal;
    }

    .status-pill {
      border-radius: 9999px;
      font-weight: 600;
      text-transform: none;
      padding: 0.125rem 0.625rem;
      font-size: 12px;
    }
`;

styles = styles.replace(/:host\s*{[\s\S]*?(?=\.admin-page)/, modernVars);

// Replace button colors to match light theme
styles = styles.replace(/background:\s*rgba\(0,\s*229,\s*255,\s*0\.1\)/g, 'background: #eff6ff');
styles = styles.replace(/color:\s*#00e5ff/g, 'color: #2563eb');
styles = styles.replace(/border:\s*1px\s*solid\s*rgba\(0,\s*229,\s*255,\s*0\.2\)/g, 'border: 1px solid #bfdbfe');
// Hover
styles = styles.replace(/background:\s*rgba\(0,\s*229,\s*255,\s*0\.2\)/g, 'background: #dbeafe');

let code = fs.readFileSync('src/app/pages/admin.component.ts', 'utf8');

const startIdx = code.indexOf('styles: [`');
const endIdx = code.indexOf('`]', startIdx);

if (startIdx !== -1 && endIdx !== -1) {
  code = code.substring(0, startIdx + 10) + "\n" + styles + "\n  " + code.substring(endIdx);
  fs.writeFileSync('src/app/pages/admin.component.ts', code);
  console.log('Successfully injected serious modern CSS.');
} else {
  console.error('Could not find CSS boundaries in admin.component.ts');
}
