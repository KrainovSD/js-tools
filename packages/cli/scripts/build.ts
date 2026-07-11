import { execFileSync } from "node:child_process";
import { chmodSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

type Target = {
  goos: string;
  goarch: string;
  output: string;
};

const targets: Target[] = [
  { goos: "linux", goarch: "amd64", output: "ksd-linux-amd64" },
  // { goos: "linux", goarch: "arm64", output: "ksd-linux-arm64" },
  { goos: "darwin", goarch: "amd64", output: "ksd-darwin-amd64" },
  // { goos: "darwin", goarch: "arm64", output: "ksd-darwin-arm64" },
  { goos: "windows", goarch: "amd64", output: "ksd-windows-amd64.exe" },
  // { goos: "windows", goarch: "arm64", output: "ksd-windows-arm64.exe" },
];

const binDir = resolve(__dirname, "..", "bin");
const cmdDir = resolve(__dirname, "..");

mkdirSync(binDir, { recursive: true });

for (const target of targets) {
  const outputPath = resolve(binDir, target.output);
  console.log(`Building ${target.output}...`);

  execFileSync("go", ["build", "-trimpath", "-ldflags=-s -w", "-o", outputPath, "."], {
    cwd: cmdDir,
    env: {
      ...process.env,
      GOOS: target.goos,
      GOARCH: target.goarch,
      CGO_ENABLED: "0",
    },
    stdio: "inherit",
  });

  if (!target.output.endsWith(".exe")) {
    chmodSync(outputPath, 0o755);
  }
}

console.log("All binaries built successfully.");
