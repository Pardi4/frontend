const fs = require("fs");
let code = fs.readFileSync("src/app/pages/admin.component.ts", "utf8");
let i1 = code.indexOf("protected async exportUsersToCsv(): Promise<void> {");
let i2 = code.indexOf("protected async bulkDeleteUsers(): Promise<void> {", i1);
if (i1 !== -1 && i2 !== -1) {
  let before = code.substring(0, i1);
  let after = code.substring(i2);
  let middle = `protected async exportUsersToCsv(): Promise<void> {
    const result = await this.api(\x27/api/admin/users?limit=10000\x27);
    if (!result.success) {
      this.error.set(this.tr(\x27exportFailed\x27));
      return;
    }
    const users = result.users || [];
    const rows = [
      [\x27ID\x27, \x27Email\x27, \x27Role\x27, \x27Credits\x27, \x27Solved\x27, \x27Current Streak\x27, \x27Banned\x27, \x27Ext Active\x27, \x27Last Seen\x27, \x27Created At\x27],
      ...users.map((user: any) => [
        user.id,
        user.email,
        user.role,
        user.credits,
        user.stats?.totalQuestionsSolved || 0,
        user.streak?.current || 0,
        user.isBanned ? \x27Yes\x27 : \x27No\x27,
        user.isExtensionActive ? \x27Yes\x27 : \x27No\x27,
        user.extensionLastSeenAt ? this.formatDate(user.extensionLastSeenAt) : \x27\x27,
        user.createdAt ? this.formatDate(user.createdAt) : \x27\x27
      ])
    ];
    const csv = rows.map(row => row.map(cell => this.csvCell(cell)).join(\x27,\x27)).join(\x27\\\\r\\\\n\x27);
    const blob = new Blob([\`\\uFEFF\${csv}\`], { type: \x27text/csv;charset=utf-8\x27 });
    const url = URL.createObjectURL(blob);
    const link = document.createElement(\x27a\x27);
    link.href = url;
    link.download = \`quizsolver-users-\${new Date().toISOString().split(\x27T\x27)[0]}.csv\`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  `;
  code = before + middle + after;
  fs.writeFileSync("src/app/pages/admin.component.ts", code);
  console.log("Fixed exportUsersToCsv");
} else { console.log(i1, i2); }

