const { execSync } = require("child_process");

const [command, packageName] = (process.argv[2] ?? "").split(":");
const PACKAGE_PREFIX = "@krainovsd";

if (!packageName || !command) {
  console.error(
    "Usage: node scripts/exec-package-command.js  <command>:<package-name>"
  );
  process.exit(1);
}

const fullPackageName = `${PACKAGE_PREFIX}/${packageName}`;

console.log(`Running "${command}" in package "${fullPackageName}"...`);
execSync(`pnpm --filter ${fullPackageName} run ${command}`, {
  stdio: "inherit",
});
