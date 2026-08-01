const fs = require('fs');
let code = fs.readFileSync('src/app/pages/admin.component.ts', 'utf8');

const target = `                      <button type="button" (click)="openGrantModal(linkedUser, tr('supportAdjustment'))">{{ tr('grantCredits') }}</button>
                      <button type="button" (click)="linkedUser.isBanned ? unbanUser(linkedUser.id) : banUser(linkedUser.id)">
                        {{ linkedUser.isBanned ? tr('unban') : tr('ban') }}
                      </button>
                    </div>
                  </div>`;

const replacement = `                    <div class="row-actions">
                      <button type="button" (click)="openGrantModal(linkedUser, tr('supportAdjustment'))">{{ tr('grantCredits') }}</button>
                      <button type="button" (click)="linkedUser.isBanned ? unbanUser(linkedUser.id) : banUser(linkedUser.id)">
                        {{ linkedUser.isBanned ? tr('unban') : tr('ban') }}
                      </button>
                    </div>
                  </div>`;

code = code.replace(target, replacement);
fs.writeFileSync('src/app/pages/admin.component.ts', code);
console.log("Fixed HTML syntax.");
