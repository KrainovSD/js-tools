import fs from "fs";
import { join } from "path";
import type { PackageManager } from "../types";

const TARGET_PATH = "package.json";
const ROOT_PATH_PNPM = "pnpm-workspace.yaml";
const LOCK_PATH_PNPM = "pnpm-lock.yaml";

export function clearDependencies(root: string, pm: PackageManager) {
  switch (pm) {
    case "pnpm": {
      const clearedDirs: string[] = [];
      recursivelyFind({
        dir: root,
        rootPath: ROOT_PATH_PNPM,
        lockPath: LOCK_PATH_PNPM,
        clearedDirs,
      });

      console.log({ CLEARED_DIRS: clearedDirs });

      break;
    }
    default: {
      throw new Error("Package manager not supporting");
    }
  }
}

function recursivelyFind(opts: {
  dir: string;
  rootPath: string;
  lockPath: string;
  clearedDirs: string[];
}) {
  try {
    if (fs.existsSync(opts.dir)) {
      let files: string[] = [];
      try {
        files = fs.readdirSync(opts.dir);
      } catch {}

      if (files.includes(TARGET_PATH)) {
        const nodeModules = join(opts.dir, "node_modules");
        const lockFile = join(opts.dir, opts.lockPath);
        deleteRecursive(nodeModules);
        try {
          fs.unlinkSync(lockFile);
        } catch {}
        opts.clearedDirs.push(opts.dir);

        if (!files.includes(opts.rootPath)) return;
      }

      files.forEach((file) => {
        const filePath = join(opts.dir, file);
        recursivelyFind({ ...opts, dir: filePath });
      });
    }
  } catch (error) {
    if (error instanceof Error) console.log(error.message);
  }
}

function deleteRecursive(dir: string) {
  try {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  } catch (error) {
    if (error instanceof Error) console.log(error.message);
  }
}
