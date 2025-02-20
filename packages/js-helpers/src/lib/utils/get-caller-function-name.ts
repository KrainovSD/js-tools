export function getCallerFunctionName() {
  try {
    const error = new Error();
    if (!error.stack) throw error;
    const stack = error.stack.split("\n");

    if (stack[2]) {
      const callerLine = stack[2].trim();
      const match = callerLine.match(/at (\w+)/);
      if (match) {
        return match[1];
      }
    }
  } catch {}

  return null;
}
