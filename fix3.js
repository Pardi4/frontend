const fs = require("fs");
const c = fs.readFileSync("src/app/pages/admin.component.ts", "utf8");
const lines = c.split("\n");
let bad = false;
for (let i=0; i<lines.length; i++) {
  if (lines[i].endsWith("replace(/\\r") || lines[i].endsWith("replace(/\\r\\r")) {
    console.log("Broken at line " + i + ": " + lines[i]);
    lines[i] = lines[i].replace(/replace\(\/\\r\\r?$/, "replace(/\\\\r\\\\n/g, \x27\\\\n\x27).trim();");
    lines[i+1] = "";
    lines[i+2] = "";
    bad = true;
  }
}
if (bad) {
  fs.writeFileSync("src/app/pages/admin.component.ts", lines.filter(x => x !== "").join("\n"));
  console.log("Fixed remaining");
} else {
  console.log("No broken replace lines");
}
