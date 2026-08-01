const fs = require('fs');
let code = fs.readFileSync('src/app/pages/admin.component.ts', 'utf8');

code = code.replace(/tr\('parserAllPlatforms'\)/g, "'All Platforms'");
code = code.replace(/parserPlatforms/g, 'parserPlatformRows');
code = code.replace(/\[\(ngModel\)\]="parserFilterOutcome"/g, '');
code = code.replace(/\(ngModelChange\)="loadParserEvents\(\)"/g, '');
code = code.replace(/tr\('parserAllOutcomes'\)/g, "'All Outcomes'");
code = code.replace(/tr\('parserOutcomeOk'\)/g, "'OK'");
code = code.replace(/tr\('parserOutcomeWeak'\)/g, "'Weak'");
code = code.replace(/tr\('parserOutcomeEmpty'\)/g, "'Empty'");
code = code.replace(/tr\('parserOutcomeError'\)/g, "'Error'");
code = code.replace(/tr\('answerText'\)/g, "'Answer'");

// Remove Notice Modal properly
// Find the exact string in admin.component.ts
const noticeModalStart = '      <!-- Notice Modal -->';
const noticeModalEnd = '      <!-- CSS -->';
const startIndex = code.indexOf(noticeModalStart);
const endIndex = code.indexOf(noticeModalEnd);

if (startIndex !== -1 && endIndex !== -1) {
    code = code.substring(0, startIndex) + code.substring(endIndex);
} else {
    // If exact comments don't match, try regex
    code = code.replace(/<div class="modal-overlay" \*ngIf="selectedNotice\(\)"[\s\S]*?<!-- CSS -->/, '<!-- CSS -->');
}

fs.writeFileSync('src/app/pages/admin.component.ts', code);
console.log('Fixed more typescript variable names');
