import type { CompletionContext, CompletionResult } from "@codemirror/autocomplete";

const CODE_OF_START_MENTION = "@".codePointAt(0); // @
const CODE_OF_SPACE = " ".codePointAt(0);
const CODE_OF_LINE_BREAK = "\n".codePointAt(0);

export const tagAutoComplete = (tagOptions: string[]) => {
  const options = tagOptions.map((user) => ({
    label: `@${user}`,
    type: "text",
  }));

  return (context: CompletionContext): CompletionResult | null => {
    const line = context.view?.lineBlockAt?.(context.pos);

    if (!line) return null;

    const content = context.state.sliceDoc(line.from, context.pos);
    let pos = content.length - 1;

    while (pos > -1) {
      const code = content.codePointAt(pos);
      if (!code || code === CODE_OF_SPACE || code === CODE_OF_LINE_BREAK) return null;
      if (code == CODE_OF_START_MENTION) break;

      pos--;
    }

    if (pos === -1) return null;

    return {
      from: line.from + pos,
      options,
    };
  };
};
