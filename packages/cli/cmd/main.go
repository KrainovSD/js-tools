package main

import (
	"flag"
	"fmt"
	"ksd/workers"
	"os"
	"os/exec"
)

func main() {
	var err error

	if len(os.Args) < 2 {
		printUsage()
		os.Exit(1)
	}

	switch os.Args[1] {
	case "exec-package-command":
		err = workers.RunExecPackageCommand(os.Args[2:])
	case "check-package-duplicate":
		err = workers.RunCheckPackageDuplicate(os.Args[2:])
	case "clear-dependencies":
		err = workers.RunClearDependencies(os.Args[2:])
	default:
		fmt.Fprintf(os.Stderr, "Unknown command: %s\n", os.Args[1])
		printUsage()
		os.Exit(1)
	}

	if err != nil {
		if err == flag.ErrHelp {
			os.Exit(0)
		}
		var exitErr *exec.ExitError
		var ok bool
		if exitErr, ok = err.(*exec.ExitError); ok {
			os.Exit(exitErr.ExitCode())
		}
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}
}

func printUsage() {
	fmt.Fprintln(os.Stderr, "Krainov CLI (ksd)")
	fmt.Fprintln(os.Stderr, "")
	fmt.Fprintln(os.Stderr, "Commands:")
	fmt.Fprintln(os.Stderr, "  exec-package-command <command:package-name>  Execute package command in monorepo")
	fmt.Fprintln(os.Stderr, "  check-package-duplicate                     Search duplicate packages in lock file")
	fmt.Fprintln(os.Stderr, "  clear-dependencies                         Clear all dependencies in monorepo")
}
