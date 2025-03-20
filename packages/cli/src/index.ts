import { Option, program } from "commander";
import ora from "ora";
import { resolve } from "path";
import { checkPackageDuplicate, clearDependencies, execPackageCommand } from "./actions";
import type { PackageManager } from "./types";

program.name("ksd").description("Krainov CLI").version("0.0.1");
program
  .command("exec-package-command")
  .description("Exec package command into monorepo by command and package name")
  .argument("<command:package-name>", `Command and package name separated by ":" `)
  .addOption(
    new Option("--package-manager <pm>", "Package manager for execute command")
      .choices(["pnpm"])
      .default("pnpm"),
  )
  .option("-p --prefix <prefix>", "Prefix of packages", "")
  .action(
    async (
      args: string,
      options: {
        packageManager: PackageManager;
        prefix: string;
      },
    ) => {
      await execPackageCommand(args, options.prefix, options.packageManager);
    },
  );

program
  .command("check-package-duplicate")
  .description("Search duplicate packages in yaml file.")
  .addOption(new Option("-f, --file <path>", "Path to lock file").default("pnpm-lock.yaml"))
  .addOption(
    new Option("-o, --output <path>", "Path to result file").default("dependency-duplicates.json"),
  )
  .addOption(
    new Option("-p, --package-manager <pm>", "Package manager for execute command")
      .choices(["pnpm"])
      .default("pnpm"),
  )
  .action((options: { packageManager: PackageManager; file: string; output: string }) => {
    const file = resolve(process.cwd(), options.file);
    const output = resolve(process.cwd(), options.output);
    console.log({ file, output });

    const spinner = ora("Executing...").start();
    checkPackageDuplicate(file, output);
    spinner.stop();
  });

program
  .command("clear-dependencies")
  .description("Clear all dependencies in monorepo")
  .addOption(new Option("-s, --src <path>", "Path to root").default(""))
  .addOption(
    new Option("-p, --package-manager <pm>", "Package manager for execute command")
      .choices(["pnpm"])
      .default("pnpm"),
  )
  .action((options: { packageManager: PackageManager; src: string }) => {
    const root = resolve(process.cwd(), options.src);
    console.log({ root });

    const spinner = ora("Executing...").start();
    clearDependencies(root, options.packageManager);
    spinner.stop();
  });

program.parse(process.argv);
