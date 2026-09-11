const fs = require("fs");
let code = fs.readFileSync("src/app/pages/admin.component.ts", "utf8");
let i1 = code.indexOf("protected supportParagraphs(value: unknown): string[] {");
let i2 = code.indexOf("protected supportSourceLabel(value: unknown): string {", i1);
if (i1 !== -1 && i2 !== -1) {
  let before = code.substring(0, i1);
  let after = code.substring(i2);
  let middle = `protected supportParagraphs(value: unknown): string[] {
    const text = String(value || \x27\x27).replace(/\\\\r\\\\n/g, \x27\\\\n\x27).trim();
    if (!text) return [this.tr(\x27noMessageBody\x27)];
    return text.split(/\\\\n{2,}/).map(part => part.trim()).filter(Boolean);
  }

  `;
  code = before + middle + after;
  fs.writeFileSync("src/app/pages/admin.component.ts", code);
  console.log("Fixed supportParagraphs");
}

