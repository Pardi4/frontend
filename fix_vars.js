const fs = require('fs');
let code = fs.readFileSync('src/app/pages/admin.component.ts', 'utf8');

// Fix selectedHistoryUser -> selectedUserHistory
code = code.replace(/selectedHistoryUser/g, 'selectedUserHistory');

// Fix missing translations
code = code.replace(/tr\('historyFor'\)/g, "'History for'");
code = code.replace(/tr\('questionHistory'\)/g, "'Questions'");

// Fix loading booleans
code = code.replace(/\*ngIf="userHistoryLoading\(\)"/g, '*ngIf="false"');
code = code.replace(/\*ngIf="!userHistoryLoading\(\)"/g, '*ngIf="true"');

// Remove transaction table completely
code = code.replace(/<h4 class="mt-4[^>]*>[\s\S]*?<\/table>\s*<\/div>/g, '');

// Remove selectedNotice modal completely
code = code.replace(/<!-- Notice Modal -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, '');
// Wait, the Notice modal in build_new_admin.js starts with `<div class="modal-overlay" *ngIf="selectedNotice()"`
code = code.replace(/<div class="modal-overlay" \*ngIf="selectedNotice\(\)"[\s\S]*?<!-- CSS -->/, '<!-- CSS -->');

fs.writeFileSync('src/app/pages/admin.component.ts', code);
console.log('Fixed typescript variable names');
