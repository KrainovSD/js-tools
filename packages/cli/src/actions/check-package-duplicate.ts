#!/usr/bin/env node
import fs from "fs";
import yaml from "yaml";

type LockFile = {
  importers: Record<
    string,
    {
      dependencies: Record<
        string,
        {
          version: string;
        }
      >;
      devDependencies: Record<
        string,
        {
          version: string;
        }
      >;
    }
  >;
  packages: Record<string, unknown>;
};

export function checkPackageDuplicate(path: string, output: string) {
  const lockFile = fs.readFileSync(path, "utf8");
  const lockFileJSON: LockFile = yaml.parse(lockFile);
  const packages: Record<string, string[]> = {};
  const duplicates: Record<string, string[]> = {};
  const innerPackages: Record<string, string[]> = {};
  const innerDuplicates: Record<string, string[]> = {};

  /** all inner packages */
  for (const packageInfo of Object.keys(lockFileJSON.packages)) {
    const packageInfoArray = packageInfo.split("@");
    const version = packageInfoArray.pop();
    const packageName = packageInfoArray.join("@");
    if (!version) continue;

    if (!innerPackages[packageName]) innerPackages[packageName] = [];
    const prev = innerPackages[packageName];
    if (!prev.includes(version)) prev.push(version);
    if (prev.length > 1) innerDuplicates[packageName] = prev;
  }

  /** root packages */
  for (const [, value] of Object.entries(lockFileJSON.importers || {})) {
    for (const [packageName, { version: longVersion }] of Object.entries(
      value.dependencies || {},
    )) {
      const version = longVersion.split("(").shift();

      if (!version) continue;

      if (!packages[packageName]) packages[packageName] = [];
      const prev = packages[packageName];
      if (!prev.includes(version)) prev.push(version);
      if (prev.length > 1) duplicates[packageName] = prev;
    }
    for (const [packageName, { version: longVersion }] of Object.entries(
      value.devDependencies || {},
    )) {
      const version = longVersion.split("(").shift();
      if (!version) continue;

      if (!packages[packageName]) packages[packageName] = [];
      const prev = packages[packageName];
      if (!prev.includes(version)) prev.push(version);
      if (prev.length > 1) duplicates[packageName] = prev;
    }
  }

  fs.writeFileSync(output, JSON.stringify({ duplicates, innerDuplicates }), {
    encoding: "utf8",
  });
}
