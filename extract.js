const fs = require('fs');
const code = fs.readFileSync('src/app/pages/admin.component.ts', 'utf8');

const htmlStart = code.indexOf('<section class="admin-panel glass" *ngIf="activeTab() === \\'users\\'">');
let htmlEnd = htmlStart;
let depth = 0;
const tagRegex = /<\\/?section[^>]*>/g;
tagRegex.lastIndex = htmlStart;
let match;
while ((match = tagRegex.exec(code)) !== null) {
    if (match[0].startsWith('</section')) {
        depth--;
        if (depth === 0) {
            htmlEnd = match.index + match[0].length;
            break;
        }
    } else if (match[0].startsWith('<section')) {
        depth++;
    }
}

console.log('HTML for users:');
console.log(code.substring(htmlStart, htmlEnd).length);
