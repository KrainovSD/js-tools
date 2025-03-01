const fs = require("fs");
const yaml = require("yaml");

const lockFile = yaml.parse(fs.readFileSync("pnpm-lock.yaml", "utf8"));

const packages = {};

for (const [key, value] of Object.entries(lockFile.importers || {})) {
  for (const [dep, version] of Object.entries(value.dependencies || {})) {
    if (packages[dep]) {
      console.log(`Дубликат найден: ${dep} (${version})`);
    } else {
      packages[dep] = version;
    }
  }
}
