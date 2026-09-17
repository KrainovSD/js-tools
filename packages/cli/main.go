package main

import (
	"flag"
	"fmt"
	"io"
	"ksd/workers"
	"os"
	"os/exec"
)

func main() {
	var err error

	if len(os.Args) < 2 {
		printUsage(os.Stderr)
		os.Exit(1)
	}

	switch os.Args[1] {
	case "help", "--help", "-h":
		printUsage(os.Stdout)
		os.Exit(0)
	case "exec-package-command":
		var worker = workers.ExecPackageWorker{}
		err = worker.Run(os.Args[2:])
	case "check-package-duplicate":
		var worker = workers.CheckDuplicateWorker{}
		err = worker.Run(os.Args[2:])
	case "clear-dependencies":
		var worker = workers.ClearDepsWorker{}
		err = worker.Run(os.Args[2:])
	case "translates":
		var worker = workers.TranslateWorker{}
		err = worker.Run(os.Args[2:])
	default:
		fmt.Fprintf(os.Stderr, "Unknown command: %s\n", os.Args[1])
		printUsage(os.Stderr)
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

func printUsage(out io.Writer) {
	fmt.Fprintln(out, "Krainov CLI (ksd)")
	fmt.Fprintln(out, "")
	fmt.Fprintln(out, "Commands:")
	fmt.Fprintln(out, "  exec-package-command <command:package-name>  Execute package command in monorepo")
	fmt.Fprintln(out, "  check-package-duplicate                     Search duplicate packages in lock file")
	fmt.Fprintln(out, "  clear-dependencies                         Clear all dependencies in monorepo")
	fmt.Fprintln(out, "  translates <gen|diff|merge>                 Translation management tools")
	fmt.Fprintln(out, "  help                                        Show this help")
}
