const fs = require('fs');
let code = fs.readFileSync('src/app/pages/admin.component.ts', 'utf8');
const search = 'modal-body\" style=\"padding-top: 1rem;\">';
const replace = 'modal-body\" style=\"padding-top: 1rem;\">\\n' +
'              <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; padding: 1rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: var(--radius-md);\">\\n' +
'                <div>\\n' +
'                  <p class=\"muted-line\" style=\"margin: 0 0 0.25rem; font-size: 0.8rem;\">Account Created</p>\\n' +
'                  <strong>{{ formatDate(selectedUserHistory()?.createdAt) }}</strong>\\n' +
'                </div>\\n' +
'                <div>\\n' +
'                  <p class=\"muted-line\" style=\"margin: 0 0 0.25rem; font-size: 0.8rem;\">Auth Providers</p>\\n' +
'                  <strong style=\"text-transform: capitalize;\">{{ selectedUserHistory()?.authProviders?.join(\", \") || \"password\" }}</strong>\\n' +
'                </div>\\n' +
'                <div>\\n' +
'                  <p class=\"muted-line\" style=\"margin: 0 0 0.25rem; font-size: 0.8rem;\">Email Verified</p>\\n' +
'                  <strong>{{ selectedUserHistory()?.emailVerified ? \"Yes\" : \"No\" }}</strong>\\n' +
'                </div>\\n' +
'                <div *ngIf=\"selectedUserHistory()?.pendingNewEmail\">\\n' +
'                  <p class=\"muted-line\" style=\"margin: 0 0 0.25rem; font-size: 0.8rem; color: var(--accent-amber);\">Pending Email Change</p>\\n' +
'                  <strong>{{ selectedUserHistory()?.pendingNewEmail }}</strong>\\n' +
'                </div>\\n' +
'                <div *ngIf=\"selectedUserHistory()?.accountDeletionScheduledAt\">\\n' +
'                  <p class=\"muted-line\" style=\"margin: 0 0 0.25rem; font-size: 0.8rem; color: var(--accent-red);\">Deletion Scheduled</p>\\n' +
'                  <strong style=\"color: var(--accent-red);\">{{ formatDate(selectedUserHistory()?.accountDeletionScheduledAt) }}</strong>\\n' +
'                </div>\\n' +
'              </div>';
if (code.includes(search)) {
  fs.writeFileSync('src/app/pages/admin.component.ts', code.replace(search, replace));
  console.log('Patched');
} else {
  console.log('Still not found');
}
