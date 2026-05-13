#!/usr/bin/env node
import { chmodSync, existsSync } from "node:fs";
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

const currentPlatform = process.platform;
const currentArch = process.arch;

const osName = platformMap[currentPlatform];
const cpuArch = archMap[currentArch];

if (!osName || !cpuArch) {
  console.error(`@krainovsd/cli: unsupported platform ${currentPlatform}-${currentArch}`);
  process.exit(0);
}

let binaryName = `ksd-${osName}-${cpuArch}`;
if (currentPlatform === "win32") {
  binaryName += ".exe";
}

const binaryPath = resolve(import.meta.dirname, "..", "bin", binaryName);

if (!existsSync(binaryPath)) {
  console.error(`@krainovsd/cli: binary ${binaryName} not found`);
  process.exit(0);
}

if (currentPlatform !== "win32") {
  chmodSync(binaryPath, 0o755);
}
