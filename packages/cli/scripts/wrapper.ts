#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { arch, platform } from "node:os";
import { resolve } from "node:path";

const supportMap: Record<string, Record<string, boolean>> = {
  linux: {
    x64: true,
  },
  darwin: {
    x64: true,
    arm64: true,
  },
  win32: {
    x64: true,
  },
};

const currentPlatform = platform();
const currentArch = arch();
const supported = supportMap[currentPlatform]?.[currentArch];
if (!supported) {
  console.error(`Unsupported platform: ${currentPlatform}-${currentArch}`);
  process.exit(1);
}

const platformMap: Record<string, string> = {
  linux: "linux",
  darwin: "darwin",
  win32: "windows",
};

const archMap: Record<string, string> = {
  x64: "amd64",
  arm64: "arm64",
};

const osName = platformMap[currentPlatform];
const cpuArch = archMap[currentArch];

let binaryName = `ksd-${osName}-${cpuArch}`;
if (currentPlatform === "win32") {
  binaryName += ".exe";
}

const binaryPath = resolve(import.meta.dirname, "..", "bin", binaryName);

const result = spawnSync(binaryPath, process.argv.slice(2), {
  stdio: "inherit",
  env: process.env,
});

if (result.error) {
  console.error(`ksd: failed to launch ${binaryName}: ${result.error.message}`);
  process.exit(1);
}

if (result.status !== null) {
  process.exit(result.status);
}
process.exit(1);
