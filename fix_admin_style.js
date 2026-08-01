const fs = require('fs');

const css = `
/* CSS */
:host {
  display: block;
  min-height: 100vh;
  background: #f4f6f8;
  color: #333333;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

h1, h2, h3, h4, h5 {
  color: #111827;
  margin-top: 0;
  font-weight: 600;
}

.dashboard-layout {
  display: flex;
  min-height: 100vh;
}

/* Sidebar */
.sidebar {
  width: 250px;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  padding: 1.5rem 0;
  display: flex;
  flex-direction: column;
}

.brand {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2563eb;
  padding: 0 1.5rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 1rem;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0 1rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  border-radius: 0.5rem;
  color: #4b5563;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
}

.nav-item:hover {
  background: #f3f4f6;
  color: #111827;
}

.nav-item.active {
  background: #eff6ff;
  color: #2563eb;
}

.nav-icon {
  font-size: 1.25rem;
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.8rem;
  margin: 0;
}

.top-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

/* Buttons */
button {
  cursor: pointer;
  font-family: inherit;
}

.btn-primary, .btn-primary-glow {
  background: #2563eb;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: background 0.2s;
}
.btn-primary:hover, .btn-primary-glow:hover {
  background: #1d4ed8;
}

.btn-secondary, .btn-ghost {
  background: #ffffff;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 0.6rem 1.2rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;
}
.btn-secondary:hover, .btn-ghost:hover {
  background: #f9fafb;
}

.btn-icon {
  background: transparent;
  border: none;
  font-size: 1.2rem;
  padding: 0.5rem;
  border-radius: 0.25rem;
  color: #6b7280;
}
.btn-icon:hover {
  background: #f3f4f6;
  color: #111827;
}

.text-danger { color: #dc2626 !important; }
.text-success, .text-ok { color: #16a34a !important; }
.text-warn { color: #d97706 !important; }

/* Cards & Containers */
.glass-card, .grid-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.stat-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-card .label {
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
}

.stat-card .val {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}

/* Forms & Inputs */
.action-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.glass-input, .glass-select, input[type="text"], input[type="search"], select {
  background: #ffffff;
  border: 1px solid #d1d5db;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  color: #111827;
  font-size: 0.95rem;
}
.glass-input:focus, .glass-select:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37,99,235,0.2);
}

/* Tables */
.table-container {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.glass-table {
  width: 100%;
  border-collapse: collapse;
}

.glass-table th {
  background: #f9fafb;
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  border-bottom: 1px solid #e5e7eb;
}

.glass-table td {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  color: #374151;
  font-size: 0.95rem;
}

.glass-table tr:last-child td {
  border-bottom: none;
}

.glass-table tbody tr:hover {
  background: #f9fafb;
}

/* Layout Grids */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.list-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}
.list-grid.single-col {
  grid-template-columns: 1fr;
}

/* Chips & Badges */
.chips-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.chip {
  background: #f3f4f6;
  color: #4b5563;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 500;
}
.chip.clickable {
  cursor: pointer;
  background: #eff6ff;
  color: #2563eb;
}
.chip.clickable:hover {
  background: #dbeafe;
}

.pill, .badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}
.pill.ok, .badge.success { background: #dcfce7; color: #166534; }
.pill.pending, .badge.warn { background: #fef9c3; color: #854d0e; }
.pill.danger, .badge.danger { background: #fee2e2; color: #991b1b; }

/* Modals */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: #ffffff;
  border-radius: 0.75rem;
  padding: 2rem;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
}

/* Utilities */
.anim-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
  background: #f9fafb;
  border: 1px dashed #d1d5db;
  border-radius: 0.75rem;
}

.clickable-row { cursor: pointer; }

/* Pagination */
.pagination-bar {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.page-btn {
  background: #ffffff;
  border: 1px solid #d1d5db;
  color: #374151;
  width: 32px;
  height: 32px;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
}
.page-btn.active {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}
`;

const file = 'src/app/pages/admin.component.ts';
let code = fs.readFileSync(file, 'utf8');

// Replace CSS
const cssStart = '/* CSS */';
const cssEnd = '</style>';
const startIdx = code.indexOf(cssStart);
const endIdx = code.indexOf(cssEnd, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
  code = code.substring(0, startIdx) + css + "\n  " + code.substring(endIdx);
}

// Add user email chip to Parser Events
// Search for <span class="chip">{{ formatDate(event.createdAt) }}</span> in parser tab
code = code.replace(
  /<span class="chip">{{ formatDate\(event\.createdAt\) }}<\/span>/g,
  '<span class="chip clickable" *ngIf="event.userEmail || event.email" (click)="openUserHistory({id: event.userId, email: event.userEmail || event.email})">👤 {{ event.userEmail || event.email }}</span>\n                      <span class="chip">{{ formatDate(event.createdAt) }}</span>'
);

fs.writeFileSync(file, code);
console.log('Successfully updated CSS and added clickable email chip.');
