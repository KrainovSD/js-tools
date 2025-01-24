import { join } from "path";

export function transportGetter(ext?: string) {
  if (ext) return join(__dirname, `./transport.${ext.replace(/^./, "")}`);

  try {
    void import("fs").then(() => {
      return join(__dirname, "./transport.js");
    });
  } catch {
    return join(__dirname, "./transport.cjs");
  }

  return join(__dirname, "./transport.cjs");
}
