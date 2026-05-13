package workers

import (
	"flag"
	"fmt"
	"ksd/helpers"
	"os"
	"os/exec"
	"strings"
)

func RunExecPackageCommand(args []string) error {
	var prefix string
	var prefixAlias = &helpers.AliasValue{Value: &prefix}

	var fs = flag.NewFlagSet("exec-package-command", flag.ContinueOnError)
	fs.Var(prefixAlias, "prefix", "Prefix of packages")
	fs.Var(prefixAlias, "p", "Prefix of packages (shorthand)")

	if err := fs.Parse(args); err != nil {
		return err
	}

	var remaining = fs.Args()
	if len(remaining) == 0 {
		return fmt.Errorf("command:package-name argument is required")
	}

	var command string
	var packageName string
	var parts = strings.SplitN(remaining[0], ":", 2)
	if len(parts) == 2 {
		command = parts[0]
		packageName = parts[1]
	}
	if packageName == "" || command == "" {
		return fmt.Errorf("invalid format: expected <command:package-name>, got %s", remaining[0])
	}

	var fullPackageName string
	if prefix != "" {
		fullPackageName = prefix + "/" + packageName
	} else {
		fullPackageName = packageName
	}

	var cmd = exec.Command("pnpm", "--filter", fullPackageName, "run", command)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Stdin = os.Stdin
	return cmd.Run()
}
