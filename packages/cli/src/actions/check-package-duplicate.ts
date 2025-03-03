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
};

export function checkPackageDuplicate(path: string, output: string) {
  const lockFile = fs.readFileSync(path, "utf8");
  const lockFileJSON: LockFile = yaml.parse(lockFile);
  const packages: Record<string, string> = {};
  const duplicate: Record<string, string[]> = {};
  const devDuplicate: Record<string, string[]> = {};

  for (const [, value] of Object.entries(lockFileJSON.importers || {})) {
    for (const [dep, { version }] of Object.entries(value.dependencies || {})) {
      if (packages[dep] && packages[dep] !== version) {
        if (!duplicate[dep]) duplicate[dep] = [packages[dep]];
        duplicate[dep].push(version);
      } else {
        packages[dep] = version;
      }
    }

    for (const [dep, { version }] of Object.entries(value.devDependencies || {})) {
      if (packages[dep] && packages[dep] !== version) {
        if (!devDuplicate[dep]) devDuplicate[dep] = [packages[dep]];
        devDuplicate[dep].push(version);
      } else {
        packages[dep] = version;
      }
    }
  }

  fs.writeFileSync(output, JSON.stringify({ duplicate, devDuplicate }), {
    encoding: "utf8",
  });
}
