const fs = require('fs');
let code = fs.readFileSync('src/app/pages/admin.component.ts', 'utf8');

const lightTheme = `:host {
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
      --pending: #ea580c;`;

const darkTheme = `:host {
      --bg-primary: #09090b;
      --bg-secondary: #18181b;
      --border-glass: #27272a;
      --text-primary: #f8fafc;
      --text-secondary: #a1a1aa;
      --text-muted: #71717a;
      --accent-cyan: #3b82f6;
      --accent-hover: #2563eb;
      --success: #22c55e;
      --warning: #eab308;
      --danger: #ef4444;
      --pending: #f97316;`;

code = code.replace(lightTheme, darkTheme);

// Also need to fix background overrides from my previous script
const oldStyles1 = 'background: #ffffff !important;';
const newStyles1 = 'background: #18181b !important;';
code = code.replace(oldStyles1, newStyles1);

const oldStyles2 = 'background-color: #f1f5f9;';
const newStyles2 = 'background-color: #27272a;';
code = code.replace(oldStyles2, newStyles2);

const oldStyles3 = 'color: #334155;';
const newStyles3 = 'color: #e2e8f0;';
code = code.replace(oldStyles3, newStyles3);

const oldStyles4 = 'background: #eff6ff';
const newStyles4 = 'background: rgba(59, 130, 246, 0.1)';
code = code.replace(/background:\s*#eff6ff/g, newStyles4);

const oldStyles5 = 'color: #2563eb';
const newStyles5 = 'color: #60a5fa';
code = code.replace(/color:\s*#2563eb/g, newStyles5);

const oldStyles6 = 'border: 1px solid #bfdbfe';
const newStyles6 = 'border: 1px solid rgba(59, 130, 246, 0.2)';
code = code.replace(/border:\s*1px\s*solid\s*#bfdbfe/g, newStyles6);

const oldStyles7 = 'background: #dbeafe';
const newStyles7 = 'background: rgba(59, 130, 246, 0.2)';
code = code.replace(/background:\s*#dbeafe/g, newStyles7);


fs.writeFileSync('src/app/pages/admin.component.ts', code);
console.log("Dark theme applied.");
