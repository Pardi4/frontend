const fs = require('fs');
let code = fs.readFileSync('src/app/pages/admin.component.ts', 'utf8');

code = code.replace(/selectedHistoryUser/g, 'selectedUserHistory');

code = code.replace(/tr\('historyFor'\)/g, "'History for'");
code = code.replace(/tr\('questionHistory'\)/g, "'Questions'");

code = code.replace(/\*ngIf="userHistoryLoading\(\)"/g, '*ngIf="false"');
code = code.replace(/\*ngIf="!userHistoryLoading\(\)"/g, '*ngIf="true"');

code = code.replace(/<h4 class="mt-4[^>]*>[\s\S]*?<\/table>\s*<\/div>/g, '');

code = code.replace(/[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, '');
code = code.replace(/<div class="modal-overlay" \*ngIf="selectedNotice\(\)"[\s\S]*?/, '');

fs.writeFileSync('src/app/pages/admin.component.ts', code);
console.log('Fixed typescript variable names');
