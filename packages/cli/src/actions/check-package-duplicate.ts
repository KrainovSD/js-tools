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
  const duplicate: Record<string, string[]> = {};

  for (const packageInfo of Object.keys(lockFileJSON.packages)) {
    const packageInfoArray = packageInfo.split("@");
    const version = packageInfoArray.pop();
    const packageName = packageInfoArray.join("@");
    if (!version) continue;

    if (!packages[packageName]) packages[packageName] = [];
    const prev = packages[packageName];
    if (!prev.includes(version)) prev.push(version);
    if (prev.length > 1) duplicate[packageName] = prev;
  }

  fs.writeFileSync(output, JSON.stringify(duplicate), {
    encoding: "utf8",
  });
}
