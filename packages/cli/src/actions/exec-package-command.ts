#!/usr/bin/env node
import { execa } from "execa";
import type { PackageManager } from "../types";

export async function execPackageCommand(arg: string, prefix: string, pm: PackageManager) {
  const [command, packageName] = arg.split(":");

  if (!packageName || !command) {
    throw new Error("Hasn't command or package name");
  }

  const fullPackageName = `${prefix ? `${prefix}/` : ""}${packageName}`;

  if (pm === "pnpm") {
    const subprocess = execa({ all: true })`pnpm --filter ${fullPackageName} run ${command}`;
    subprocess.stdout.pipe(process.stdout);
    subprocess.stderr.pipe(process.stderr);
    await subprocess;
  }
}
