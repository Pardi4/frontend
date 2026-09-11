const fs = require("fs");
let code = fs.readFileSync("src/app/pages/admin.component.ts", "utf8");
code = code.replace(/supportParagraphs\\(value: unknown\\): string\\[\\] \\{[\\s\\S]*?\\}/m,
`supportParagraphs(value: unknown): string[] {
    const text = String(value || \x27\x27).replace(/\\\\r\\\\n/g, \x27\\\\n\x27).trim();
    if (!text) return [this.tr(\x27noMessageBody\x27)];
    return text.split(/\\\\n{2,}/).map(part => part.trim()).filter(Boolean);
  }`);
fs.writeFileSync("src/app/pages/admin.component.ts", code);
