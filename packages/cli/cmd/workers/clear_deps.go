package workers

import (
	"flag"
	"fmt"
	"os"
	"path/filepath"
)

const targetPath = "package.json"
const rootPathPnpm = "pnpm-workspace.yaml"
const lockPathPnpm = "pnpm-lock.yaml"

func RunClearDependencies(args []string) error {
	var fs = flag.NewFlagSet("clear-dependencies", flag.ContinueOnError)
	var srcPath = fs.String("src", "", "Path to root")

	if err := fs.Parse(args); err != nil {
		return err
	}

	var root string
	var err error
	if *srcPath == "" {
		root, err = os.Getwd()
	} else {
		root = *srcPath
	}
	if err != nil {
		return fmt.Errorf("failed to resolve root path: %w", err)
	}

	fmt.Printf("Root: %s\n", root)

	var clearedDirs []string
	recursivelyFind(root, rootPathPnpm, lockPathPnpm, &clearedDirs)
	fmt.Printf("Cleared dirs: %v\n", clearedDirs)
	return nil
}

func recursivelyFind(dir string, rootPath string, lockPath string, clearedDirs *[]string) {
	var entries []os.DirEntry
	var err error
	if entries, err = os.ReadDir(dir); err != nil {
		fmt.Println(err.Error())
		return
	}

	var hasPackageJson bool
	var hasWorkspaceYaml bool

	for _, entry := range entries {
		switch entry.Name() {
		case targetPath:
			hasPackageJson = true
		case rootPath:
			hasWorkspaceYaml = true
		}
	}

	if hasPackageJson {
		var nodeModules = filepath.Join(dir, "node_modules")
		var lockFile = filepath.Join(dir, lockPath)

		if err = os.RemoveAll(nodeModules); err != nil {
			fmt.Println(err.Error())
		}
		if err = os.Remove(lockFile); err != nil && !os.IsNotExist(err) {
			fmt.Println(err.Error())
		}

		*clearedDirs = append(*clearedDirs, dir)

		if !hasWorkspaceYaml {
			return
		}
	}

	for _, entry := range entries {
		if entry.IsDir() {
			recursivelyFind(filepath.Join(dir, entry.Name()), rootPath, lockPath, clearedDirs)
		}
	}
}
