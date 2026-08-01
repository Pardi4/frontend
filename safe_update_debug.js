const fs = require('fs');

let code = fs.readFileSync('src/app/pages/admin.component.ts', 'utf8');

// 1. Fix Users table
code = code.replace(
  '<button type="button" class="link-button primary-link" (click)="openUserHistory(user)">{{ user.email }}</button>\n                        <span>{{ user.displayName || tr(\'noDisplayName\') }}</span>',
  '<div style="display: flex; flex-direction: column; gap: 4px; align-items: flex-start;">\n                          <button type="button" class="link-button primary-link" (click)="openUserHistory(user)" style="font-weight: 600; font-size: 14px; padding: 0;">{{ user.email }}</button>\n                          <span style="font-size: 13px; color: var(--text-muted);">{{ user.displayName || tr(\'noDisplayName\') }}</span>\n                        </div>'
);

// 2. Fix Parser Clickable Email
code = code.replace(
  '<div class="parser-event-meta">\n                        <span>{{ formatPercent(event.confidence || 0) }}</span>',
  '<div class="parser-event-meta">\n                        <button type="button" class="link-button primary-link" *ngIf="event.userId || event.email" (click)="openUserHistory({id: event.userId, email: event.email || event.userId})" style="font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 4px; padding: 0;">\n                          👤 {{ event.email || event.userId }}\n                        </button>\n                        <span>{{ formatPercent(event.confidence || 0) }}</span>'
);

// 3. Extract Styles Block properly
const stylesStartTag = '  styles: [`';
const stylesEndTag = '  `]';
const startIdx = code.indexOf(stylesStartTag);
const endIdx = code.indexOf(stylesEndTag, startIdx);

if (startIdx === -1 || endIdx === -1) {
  console.error("COULD NOT FIND STYLES BLOCK!");
  process.exit(1);
}

let styles = code.substring(startIdx + stylesStartTag.length, endIdx);

// Apply Professional Theme overwrites
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
      text-transform: none !important;
      letter-spacing: normal !important;
    }

    .status-pill {
      border-radius: 9999px;
      font-weight: 600;
      text-transform: none;
      padding: 0.125rem 0.625rem;
      font-size: 12px;
    }
`;

// replace existing :host { ... }
styles = styles.replace(/:host\s*{[\s\S]*?(?=\.admin-page)/, modernVars);

// Replace button colors to match light theme
styles = styles.replace(/background:\s*rgba\(0,\s*229,\s*255,\s*0\.1\)/g, 'background: #eff6ff');
styles = styles.replace(/color:\s*#00e5ff/g, 'color: #2563eb');
styles = styles.replace(/border:\s*1px\s*solid\s*rgba\(0,\s*229,\s*255,\s*0\.2\)/g, 'border: 1px solid #bfdbfe');
styles = styles.replace(/background:\s*rgba\(0,\s*229,\s*255,\s*0\.2\)/g, 'background: #dbeafe'); // Hover

const finalCode = code.substring(0, startIdx + stylesStartTag.length) + "\n" + styles + "\n" + code.substring(endIdx);
fs.writeFileSync('src/app/pages/admin.component.ts', finalCode);

console.log("Replaced successfully. Let me check the start of styles block in the final file:");
const finalStylesStartIdx = finalCode.indexOf(stylesStartTag);
console.log(finalCode.substring(finalStylesStartIdx - 50, finalStylesStartIdx + 150));

