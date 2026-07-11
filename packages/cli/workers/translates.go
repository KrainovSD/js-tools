package workers

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"io/fs"
	"ksd/helpers"
	"os"
	"path/filepath"
	"regexp"
	"slices"
	"strings"
)

type translationEntry struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

type TranslateWorker struct{}

func (w *TranslateWorker) Run(args []string) error {
	if len(args) < 2 {
		fmt.Fprintln(os.Stderr, "Usage: ksd translates <command> [options]")
		fmt.Fprintln(os.Stderr, "")
		fmt.Fprintln(os.Stderr, "Commands:")
		fmt.Fprintln(os.Stderr, "  gen <framework> <translate-file> <scan-dir>  Generate translations from source code")
		fmt.Fprintln(os.Stderr, "  diff <source-file> <target-file>      Compare source and target translations")
		fmt.Fprintln(os.Stderr, "  merge <source-file> <target-file>     Merge source into target translations")
		return flag.ErrHelp
	}

	var err error
	switch args[0] {
	case "gen":
		err = w.runTranslatesGen(args[1:])
	case "diff":
		err = w.runTranslatesDiff(args[1:])
	case "merge":
		err = w.runTranslatesMerge(args[1:])
	default:
		fmt.Fprintf(os.Stderr, "Unknown translates command: %s\n", args[0])
		fmt.Fprintln(os.Stderr, "")
		fmt.Fprintln(os.Stderr, "Commands:")
		fmt.Fprintln(os.Stderr, "  gen <framework> <translate-file> <scan-dir>  Generate translations from source code")
		fmt.Fprintln(os.Stderr, "  diff <source-file> <target-file>      Compare source and target translations")
		fmt.Fprintln(os.Stderr, "  merge <source-file> <target-file>     Merge source into target translations")
		return flag.ErrHelp
	}

	return err
}

func (w *TranslateWorker) runTranslatesGen(args []string) error {
	var fs = flag.NewFlagSet("translates gen", flag.ContinueOnError)
	fs.Usage = func() {
		fmt.Fprintln(os.Stderr, "Usage: ksd translates gen <framework> <translate-file> <scan-dir>")
		fmt.Fprintln(os.Stderr, "")
		fmt.Fprintln(os.Stderr, "  framework       Framework type: vue or react")
		fmt.Fprintln(os.Stderr, "  translate-file  Path to translation JSON file")
		fmt.Fprintln(os.Stderr, "  scan-dir        Path to root directory to scan for translations")
	}

	if err := fs.Parse(args); err != nil {
		if err == flag.ErrHelp {
			return err
		}
		return err
	}

	var remaining = fs.Args()
	if len(remaining) < 3 {
		fs.Usage()
		return flag.ErrHelp
	}

	var framework = remaining[0]
	var targetPath = remaining[1]
	var rootDir = remaining[2]

	var target map[string]any
	var err error
	if target, err = getTranslationJSON[map[string]any](targetPath); err != nil {
		if errors.Is(err, os.ErrNotExist) {
			target = make(map[string]any)
		} else {
			return fmt.Errorf("get target file: %w", err)
		}
	}

	var extensions []string
	var pattern *regexp.Regexp
	var patternSimple *regexp.Regexp
	var patternSimpleInner *regexp.Regexp

	switch framework {
	case "react":
		extensions = []string{".js", ".jsx", ".ts", ".tsx"}
		pattern = regexp.MustCompile(`\bt\(['"]([^'"]+)['"][\s,]*{[^}]*defaultValue:\s*['"]([^'"]+)['"][^}]*}\)`)
		patternSimple = regexp.MustCompile(`\bt\(\s*['"]([^'"]+)['"]\s*,?\s*({[^}]*})?\s*,?\s*({[^}]*})?\s*,?\s*\)`)
		patternSimpleInner = regexp.MustCompile(`\{\s*[^}]*defaultValue:\s*['"][^'"]*['"][^}]*\s*\}`)
	case "vue":
		extensions = []string{".ts", ".vue"}
		pattern = regexp.MustCompile(`t\(\s*['"]([^'"]+)['"]\s*,\s*{[^}]*}\s*,\s*{[^}]*default:\s*['"]([^'"]*)['"][^}]*},?\s*\)`)
		patternSimple = regexp.MustCompile(`\bt\(\s*['"]([^'"]+)['"]\s*,?\s*({[^}]*})?\s*,?\s*({[^}]*})?\s*,?\s*\)`)
		patternSimpleInner = regexp.MustCompile(`\{\s*default:\s*['"][^'"]*['"][^}]*\s*\}`)
	default:
		return fmt.Errorf("unknown framework: %s (expected vue or react)", framework)
	}

	fmt.Printf("Framework: %s\n", framework)
	fmt.Printf("Target: %s\n", targetPath)
	fmt.Printf("Root: %s\n", rootDir)

	var entries []translationEntry
	if entries, err = w.extractTranslations(rootDir, extensions, pattern, patternSimple, patternSimpleInner); err != nil {
		return fmt.Errorf("extract translations: %w", err)
	}

	var extracted = w.makeTranslationJSON(entries)
	w.mergeKeysRecursively(extracted, target, "")

	if err = writeTranslationJSON(targetPath, target); err != nil {
		return fmt.Errorf("write target: %w", err)
	}

	fmt.Println("Done")
	return nil
}

func (w *TranslateWorker) runTranslatesDiff(args []string) error {
	var fs = flag.NewFlagSet("translates diff", flag.ContinueOnError)
	fs.Usage = func() {
		fmt.Fprintln(os.Stderr, "Usage: ksd translates diff <source-file> <target-file>")
		fmt.Fprintln(os.Stderr, "")
		fmt.Fprintln(os.Stderr, "  source-file  Path to source translation JSON file")
		fmt.Fprintln(os.Stderr, "  target-file  Path to target translation JSON file")
	}

	if err := fs.Parse(args); err != nil {
		if err == flag.ErrHelp {
			return err
		}
		return err
	}

	var remaining = fs.Args()
	if len(remaining) < 2 {
		fs.Usage()
		return flag.ErrHelp
	}

	var sourcePath = remaining[0]
	var targetPath = remaining[1]

	fmt.Printf("Source: %s\n", sourcePath)
	fmt.Printf("Target: %s\n", targetPath)

	var targetSplitPath = strings.Split(targetPath, "/")
	var targetFileName = targetSplitPath[len(targetSplitPath)-1]
	var targetLockSplitPath = slices.Clone(targetSplitPath)
	targetLockSplitPath[len(targetLockSplitPath)-1] = "lock-" + targetFileName
	var targetLockPath = strings.Join(targetLockSplitPath, "/")

	var source map[string]any
	var target map[string]any
	var lock map[string]string
	var err error

	if source, err = getTranslationJSON[map[string]any](sourcePath); err != nil {
		return fmt.Errorf("get source file: %w", err)
	}
	if target, err = getTranslationJSON[map[string]any](targetPath); err != nil {
		return fmt.Errorf("get target file: %w", err)
	}
	if lock, err = getTranslationJSON[map[string]string](targetLockPath); err != nil {
		lock = w.getTranslationLock(source)
	}

	var result = w.getTranslationDiff(source, target, lock, "")
	var newLock = w.getTranslationLock(source)

	if err = writeTranslationJSON("result.json", result); err != nil {
		return fmt.Errorf("write result: %w", err)
	}
	if err = writeTranslationJSON(targetLockPath, newLock); err != nil {
		return fmt.Errorf("write lock: %w", err)
	}

	fmt.Println("Done")
	return nil
}

func (w *TranslateWorker) runTranslatesMerge(args []string) error {
	var fs = flag.NewFlagSet("translates merge", flag.ContinueOnError)
	fs.Usage = func() {
		fmt.Fprintln(os.Stderr, "Usage: ksd translates merge <source-file> <target-file>")
		fmt.Fprintln(os.Stderr, "")
		fmt.Fprintln(os.Stderr, "  source-file  Path to source translation JSON file")
		fmt.Fprintln(os.Stderr, "  target-file  Path to target translation JSON file")
	}

	if err := fs.Parse(args); err != nil {
		if err == flag.ErrHelp {
			return err
		}
		return err
	}

	var remaining = fs.Args()
	if len(remaining) < 2 {
		fs.Usage()
		return flag.ErrHelp
	}

	var sourcePath = remaining[0]
	var targetPath = remaining[1]

	fmt.Printf("Source: %s\n", sourcePath)
	fmt.Printf("Target: %s\n", targetPath)

	var source map[string]any
	var target map[string]any
	var err error

	if source, err = getTranslationJSON[map[string]any](sourcePath); err != nil {
		return fmt.Errorf("get source file: %w", err)
	}
	if target, err = getTranslationJSON[map[string]any](targetPath); err != nil {
		return fmt.Errorf("get target file: %w", err)
	}

	w.mergeKeysRecursively(source, target, "")

	if err = writeTranslationJSON(targetPath, target); err != nil {
		return fmt.Errorf("write target: %w", err)
	}

	fmt.Println("Done")
	return nil
}

func (w *TranslateWorker) getTranslationLock(source map[string]any) map[string]string {
	var lock = make(map[string]string, 200)
	w.extractHashRecursively(source, "", lock)
	return lock
}

func (w *TranslateWorker) extractHashRecursively(source map[string]any, prevKey string, lock map[string]string) {
	for key, value := range source {
		var currentPath = key
		if prevKey != "" {
			currentPath = prevKey + "." + key
		}

		var stringValue, isString = value.(string)
		var mapValue, isMap = value.(map[string]any)

		if isString {
			lock[currentPath] = w.computeHash(stringValue)
		} else if isMap {
			w.extractHashRecursively(mapValue, currentPath, lock)
		}
	}
}

func (w *TranslateWorker) computeHash(str string) string {
	var hash = sha256.New()
	hash.Write([]byte(str))
	return hex.EncodeToString(hash.Sum(nil))
}

func (w *TranslateWorker) getTranslationDiff(source, target map[string]any, lock map[string]string, prevKey string) map[string]any {
	var result = make(map[string]any)

	for key, sourceValue := range source {
		var targetValue, existTargetValue = target[key]

		if !existTargetValue {
			result[key] = sourceValue
		} else {
			var sourceSubValue, sourceSubValueOk = sourceValue.(map[string]any)
			var targetSubValue, targetSubValueOk = targetValue.(map[string]any)
			var currentPath = key
			if prevKey != "" {
				currentPath = prevKey + "." + key
			}

			if sourceSubValueOk && targetSubValueOk {
				var subResult = w.getTranslationDiff(sourceSubValue, targetSubValue, lock, currentPath)
				if len(subResult) > 0 {
					result[key] = subResult
				}
			} else if !sourceSubValueOk && !targetSubValueOk {
				var sourceStrValue, isString = sourceValue.(string)
				if isString && (w.computeHash(sourceStrValue) != lock[currentPath]) {
					fmt.Printf("key \033[1m\033[32m%s\033[0m hash has changed\n", currentPath)
					result[key] = sourceStrValue
				}
			} else {
				result[key] = sourceValue
				fmt.Printf("key \033[1m\033[33m%s\033[0m has a different type\n", currentPath)
			}
		}
	}

	return result
}

func (w *TranslateWorker) mergeKeysRecursively(source, target map[string]any, prevKey string) {
	for key, sourceValue := range source {
		if targetValue, exists := target[key]; !exists {
			target[key] = sourceValue
		} else {
			var targetMap, targetIsMap = targetValue.(map[string]any)
			var sourceMap, sourceIsMap = sourceValue.(map[string]any)
			var currentPath = key
			if len(prevKey) > 0 {
				currentPath = prevKey + "." + key
			}

			if targetIsMap && sourceIsMap {
				w.mergeKeysRecursively(sourceMap, targetMap, currentPath)
			} else if !sourceIsMap && !targetIsMap {
				target[key] = sourceValue
			} else {
				fmt.Printf("key \033[1m\033[33m%s\033[0m has a different type\n", currentPath)
			}
		}
	}
}

func (w *TranslateWorker) extractTranslations(rootDir string, extensions []string, pattern, patternSimple, patternSimpleInner *regexp.Regexp) ([]translationEntry, error) {
	var seenKeys = make(map[string]bool, 200)
	var entries = make([]translationEntry, 0, 200)

	var walkErr = filepath.WalkDir(rootDir, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}

		if d.IsDir() {
			if d.Name() == "node_modules" || d.Name() == ".git" {
				return filepath.SkipDir
			}
			return nil
		}

		var ext string
		if ext = strings.ToLower(filepath.Ext(path)); !slices.Contains(extensions, ext) {
			return nil
		}

		var content []byte
		if content, err = os.ReadFile(path); err != nil {
			fmt.Printf("can't read file %s: %v\n", path, err)
			return nil
		}

		w.extractTranslationsContent(string(content), pattern, patternSimple, patternSimpleInner, seenKeys, &entries)
		return nil
	})

	return entries, walkErr
}

func (w *TranslateWorker) extractTranslationsContent(content string, pattern, patternSimple, patternSimpleInner *regexp.Regexp, seenKeys map[string]bool, entries *[]translationEntry) {
	var matches = pattern.FindAllStringSubmatch(content, -1)

	for _, match := range matches {
		if len(match) >= 2 {
			var key = match[1]
			var value = ""

			if len(match) > 2 && match[2] != "" {
				value = match[2]
			}

			if !seenKeys[key] {
				*entries = append(*entries, translationEntry{Key: key, Value: value})
				seenKeys[key] = true
			} else {
				var entryIndex = slices.IndexFunc(*entries, func(e translationEntry) bool {
					return e.Key == key
				})
				if entryIndex != -1 {
					var entry = (*entries)[entryIndex]
					if entry.Value != value {
						fmt.Printf("key \033[1m\033[33m%s\033[0m has different values [%s != %s]\n", key, value, entry.Value)
					}
				}
			}
		}
	}

	var simpleMatches = patternSimple.FindAllStringSubmatch(content, -1)
	for _, match := range simpleMatches {
		if len(match) >= 2 {
			if patternSimpleInner != nil {
				var innerMatch = patternSimpleInner.FindAllStringSubmatch(match[0], -1)
				if len(innerMatch) > 0 {
					continue
				}
			}

			var key = match[1]

			if !seenKeys[key] {
				*entries = append(*entries, translationEntry{Key: key, Value: ""})
				seenKeys[key] = true
			} else {
				var entryIndex = slices.IndexFunc(*entries, func(e translationEntry) bool {
					return e.Key == key
				})
				if entryIndex != -1 {
					var entry = (*entries)[entryIndex]
					if entry.Value != "" {
						fmt.Printf("key \033[1m\033[33m%s\033[0m has different values [%s != empty]\n", key, entry.Value)
					}
				}
			}
		}
	}
}

func (w *TranslateWorker) makeTranslationJSON(entries []translationEntry) map[string]any {
	var result = make(map[string]any, len(entries))

	for _, entry := range entries {
		var paths = strings.Split(entry.Key, ".")
		var object map[string]any = result

		for index, path := range paths {
			if len(paths)-1 == index {
				object[path] = entry.Value
				continue
			}

			var temp, exist = object[path]
			if !exist {
				temp = make(map[string]any)
			}
			var tempObject map[string]any
			var isObject bool
			if tempObject, isObject = temp.(map[string]any); !isObject {
				var conflictPath = strings.Join(paths[:index+1], ".")
				fmt.Printf("key \033[1m\033[33m%s\033[0m has a different type\n", conflictPath)
				tempObject = make(map[string]any)
			}

			object[path] = tempObject
			object = tempObject
		}
	}

	return result
}

func getTranslationJSON[T map[string]any | map[string]string](path string) (T, error) {
	var err error
	var jsonData T

	var data []byte
	if data, err = os.ReadFile(path); err != nil {
		return jsonData, fmt.Errorf("read file %s: %w", path, err)
	}
	if err = json.Unmarshal(data, &jsonData); err != nil {
		return jsonData, fmt.Errorf("unmarshal file %s: %w", path, err)
	}

	return jsonData, nil
}

func writeTranslationJSON[T map[string]any | map[string]string](path string, data T) error {
	var err error
	var sortedData []byte

	if sortedData, err = helpers.MarshalSortedIndent(data, "", "  "); err != nil {
		return fmt.Errorf("marshal file %s: %w", path, err)
	}
	var dir = filepath.Dir(path)
	if err = os.MkdirAll(dir, 0755); err != nil {
		return fmt.Errorf("create directory %s: %w", dir, err)
	}
	if err = os.WriteFile(path, sortedData, 0666); err != nil {
		return fmt.Errorf("write file %s: %w", path, err)
	}

	return nil
}
