const fs = require('fs');
let js = fs.readFileSync('build_new_admin.js', 'utf8');

js = js.replace(/userHistory\(\)\?.questions/g, 'userQuestions()');
js = js.replace(/userHistory\(\)\?.transactions/g, '[]');
js = js.replace(/userHistory\(\)/g, 'selectedUserHistory()');

js = js.replace(/grantModalUser/g, 'selectedGrantUser');
js = js.replace(/submitGrant/g, 'grantCustomCredits');

js = js.replace(/noQuestionsHistory/g, 'noSolvedQuestions');
js = js.replace(/tr\('transactionHistory'\)/g, "'Transactions'");
js = js.replace(/tr\('noTransactionsHistory'\)/g, "'No Transactions'");
js = js.replace(/tr\('grantCreditsTo'\)/g, "tr('grantCredits')");
js = js.replace(/tr\('amount'\)/g, "'Amount'");
js = js.replace(/tr\('viewDetails'\)/g, "tr('details')");
js = js.replace(/tr\('details'\)/g, "''"); // just empty string for now, or change to showQuestionDetails

// Remove the selectedNotice modal HTML
js = js.replace(/<div class="modal-overlay" \*ngIf="selectedNotice\(\)"[\s\S]*?<!-- CSS -->/, '<!-- CSS -->');

// Fix openAdminNotice
js = js.replace(/selectedNotice\.set\(notice\)/g, 'openAdminNotice(notice)');

// Also fix transaction history HTML to just remove it
js = js.replace(/<h4 class="mt-4">.*?<\/h4>\s*<div class="table-container">[\s\S]*?<\/div>/, '');

// Make sure closeUserHistory works instead of selectedUserHistory.set(null)
js = js.replace(/selectedUserHistory.set\(null\)/g, 'closeUserHistory()');
js = js.replace(/selectedGrantUser.set\(null\)/g, 'closeGrantModal()');

fs.writeFileSync('build_new_admin.js', js);
console.log('Fixed build_new_admin.js');
