# @krainovsd/cli

## translates

### gen

Extracts translation keys from source code and merges them into a translation JSON file.

The search function (`extractTranslationsContent`) processes each file's content in two passes:

**First pass — `pattern`** — matches `t()` calls with a default value. The format depends on the framework:

- **vue**: `t("key", {}, { default: "value" })` — three arguments: key, options object, object with `default`
- **react**: `t("key", { defaultValue: "value" })` — two arguments: key and object with `defaultValue`

On a match, the key and default value are extracted. The key is added to the result if it hasn't been seen before. If the key was already found with a different value, a conflict warning is printed.

**Second pass — `patternSimple`** — matches `t()` calls without a default value. The format also depends on the framework:

- **vue**: `t("key")`, `t("key", { options })`, `t("key", { opt }, { opt })` — a broad pattern that matches calls with any number of object arguments
- **react**: `t("key")`, `t("key", { count: 5 })`, `t("key", { some: 0 }, { other: 1 })` — same broad pattern as vue

Since both `patternSimple` variants are broad and partially overlap with `pattern`, an additional filter `patternSimpleInner` is applied. It checks whether the matched call contains an object with `default:` (vue) or `defaultValue:` (react) — if so, the call was already handled by the first pass and is skipped.

On a match, the key is added with an empty value. If the key was already found by the first pass (with a non-empty value), a warning is printed.

**Deduplication** — `seenKeys` tracks all already processed keys. The first encountered key wins: if `pattern` found a key with a value and then `patternSimple` finds the same key, the simple variant is ignored. The reverse situation is also controlled via warnings, but priority remains with the first found occurrence.

After scanning all files, the collected entries (`key` + `value`) are converted from a flat list into a nested JSON object via `makeTranslationJSON` (key `a.b.c` becomes `{ "a": { "b": { "c": "value" } } }`), then recursively merged into the existing translation file via `mergeKeysRecursively` — new keys are added, existing ones with the same type are overwritten, and a warning is printed on type mismatch.

### diff

Compares two translation files (source and target) using SHA256 hashes. Creates a lock file to track changes: on the first run, an initial hash snapshot of the source file is generated; on subsequent runs, current hashes are compared against the saved ones. Keys with changed hashes are highlighted in green, keys with mismatched types in yellow. The result is written to `result.json`.

### merge

Recursively merges source into target: new keys are added, existing strings are overwritten. On type mismatch (e.g. string vs object), a warning is printed and the source value overwrites the target.

## exec-package-command

Runs a pnpm script in a specific package within a monorepo. Accepts an argument in the format `<command:package-name>` and an optional `--prefix` flag to scope the package name. Executes `pnpm --filter <package> run <command>` with stdin/stdout/stderr connected to the terminal.

## check-package-duplicate

Parses `pnpm-lock.yaml` and finds duplicate packages across the monorepo. Two types of duplicates are detected: across importers (the same direct dependency resolved to different versions in different workspace packages) and within the lockfile itself (the same package resolved to multiple versions). The result is written to a JSON file with unique versions per package.

## clear-dependencies

Recursively traverses a directory tree looking for `package.json` files and removes the associated `node_modules` and `pnpm-lock.yaml`. Stops recursing into subdirectories for packages without a `pnpm-workspace.yaml` (leaf packages). Silently ignores errors when trying to delete the running binary from its own `node_modules`.
