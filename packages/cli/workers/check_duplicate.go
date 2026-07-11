package workers

import (
	"encoding/json"
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"gopkg.in/yaml.v3"
)

type LockFile struct {
	Importers map[string]Importer `yaml:"importers"`
	Packages  map[string]any      `yaml:"packages"`
}

type Importer struct {
	Dependencies    map[string]DepVersion `yaml:"dependencies"`
	DevDependencies map[string]DepVersion `yaml:"devDependencies"`
}

type DepVersion struct {
	Version string `yaml:"version"`
}

type DuplicateResult struct {
	Duplicates      map[string][]string `json:"duplicates"`
	InnerDuplicates map[string][]string `json:"innerDuplicates"`
}

type CheckDuplicateWorker struct{}

func (w *CheckDuplicateWorker) Run(args []string) error {
	var fs = flag.NewFlagSet("check-package-duplicate", flag.ContinueOnError)
	var filePath = fs.String("file", "pnpm-lock.yaml", "Path to lock file")
	var outputPath = fs.String("output", "dependency-duplicates.json", "Path to result file")

	if err := fs.Parse(args); err != nil {
		return err
	}

	var wd string
	var err error
	if wd, err = os.Getwd(); err != nil {
		return fmt.Errorf("failed to get working directory: %w", err)
	}

	var lockFilePath = *filePath
	if !filepath.IsAbs(lockFilePath) {
		lockFilePath = filepath.Join(wd, lockFilePath)
	}
	var outPath = *outputPath
	if !filepath.IsAbs(outPath) {
		outPath = filepath.Join(wd, outPath)
	}

	fmt.Printf("File: %s, Output: %s\n", lockFilePath, outPath)

	return w.checkPackageDuplicate(lockFilePath, outPath)
}

func (w *CheckDuplicateWorker) checkPackageDuplicate(lockFilePath string, outputPath string) error {
	var data []byte
	var err error
	if data, err = os.ReadFile(lockFilePath); err != nil {
		return fmt.Errorf("failed to read lock file: %w", err)
	}

	var lockFile LockFile
	if err = yaml.Unmarshal(data, &lockFile); err != nil {
		return fmt.Errorf("failed to parse lock file: %w", err)
	}

	var result = DuplicateResult{
		Duplicates:      make(map[string][]string),
		InnerDuplicates: make(map[string][]string),
	}

	var innerPackages = make(map[string][]string)
	var innerDuplicates = make(map[string][]string)

	for key := range lockFile.Packages {
		var idx = strings.LastIndex(key, "@")
		if idx < 0 {
			continue
		}

		var version string
		var packageName string
		var pkgPart = key[:idx]
		version = key[idx+1:]

		if strings.HasPrefix(pkgPart, "/") {
			packageName = pkgPart[1:]
		} else {
			packageName = pkgPart
		}

		if version == "" {
			continue
		}

		innerPackages[packageName] = append(innerPackages[packageName], version)
	}

	for name, versions := range innerPackages {
		var unique = w.dedup(versions)
		if len(unique) > 1 {
			innerDuplicates[name] = unique
		}
	}

	var packages = make(map[string][]string)
	var duplicates = make(map[string][]string)

	for _, importer := range lockFile.Importers {
		w.collectVersions(importer.Dependencies, packages)
		w.collectVersions(importer.DevDependencies, packages)
	}

	for name, versions := range packages {
		var unique = w.dedup(versions)
		if len(unique) > 1 {
			duplicates[name] = unique
		}
	}

	result.InnerDuplicates = innerDuplicates
	result.Duplicates = duplicates

	var jsonData []byte
	if jsonData, err = json.MarshalIndent(result, "", "  "); err != nil {
		return fmt.Errorf("failed to marshal result: %w", err)
	}

	if err = os.WriteFile(outputPath, jsonData, 0644); err != nil {
		return fmt.Errorf("failed to write output file: %w", err)
	}

	return nil
}

func (w *CheckDuplicateWorker) collectVersions(deps map[string]DepVersion, packages map[string][]string) {
	for name, dep := range deps {
		var version = strings.Split(dep.Version, "(")[0]
		if version == "" {
			continue
		}
		packages[name] = append(packages[name], version)
	}
}

func (w *CheckDuplicateWorker) dedup(slice []string) []string {
	var seen = make(map[string]bool, len(slice))
	var result []string
	for _, v := range slice {
		if !seen[v] {
			seen[v] = true
			result = append(result, v)
		}
	}
	return result
}
