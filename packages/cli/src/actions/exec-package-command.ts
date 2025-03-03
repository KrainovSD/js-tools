#!/usr/bin/env node
import { execa } from "execa";

export async function execPackageCommand(arg: string, pm: "npm" | "pnpm" | "yarn") {
  const [command, packageName] = arg.split(":");
  const PACKAGE_PREFIX = "@krainovsd";

  if (!packageName || !command) {
    throw new Error("Hasn't command or package name");
  }

  const fullPackageName = `${PACKAGE_PREFIX}/${packageName}`;

  if (pm === "pnpm") {
    const subprocess = execa({ all: true })`pnpm --filter ${fullPackageName} run ${command}`;
    subprocess.stdout.pipe(process.stdout);
    subprocess.stderr.pipe(process.stderr);
    await subprocess;
  }
}
