#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { arch, platform } from "node:os";
import { resolve } from "node:path";

const platformMap: Record<string, string> = {
  linux: "linux",
  darwin: "darwin",
  win32: "windows",
};

const archMap: Record<string, string> = {
  x64: "amd64",
  arm64: "arm64",
};

const osName = platformMap[platform()];
const cpuArch = archMap[arch()];

if (!osName || !cpuArch) {
  console.error(`Unsupported platform: ${platform()}-${arch()}`);
  process.exit(1);
}

let binaryName = `ksd-${osName}-${cpuArch}`;
if (platform() === "win32") {
  binaryName += ".exe";
}

const binaryPath = resolve(import.meta.dirname, "..", "..", "bin", binaryName);

const result = spawnSync(binaryPath, process.argv.slice(2), {
  stdio: "inherit",
  env: process.env,
});

if (result.status !== null) {
  process.exit(result.status);
}
process.exit(1);
