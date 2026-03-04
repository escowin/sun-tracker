const fs = require("fs");
const path = require("path");

const pkg = require("../package.json");
const swPath = path.join(__dirname, "..", "service-worker.js");
let content = fs.readFileSync(swPath, "utf8");

content = content.replace(
  /const VERSION = "[^"]+";/,
  `const VERSION = "${pkg.version}";`
);
fs.writeFileSync(swPath, content);

console.log("service-worker.js version synced to", pkg.version);
