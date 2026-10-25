import type { CompletionContext, CompletionResult } from "@codemirror/autocomplete";
import {
  CODE_OF_AT,
  CODE_OF_LINE_BREAK,
  CODE_OF_SPACE,
} from "@/extensions/markdown/markdown-model";

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
      if (code == CODE_OF_AT) break;

      pos--;
    }

    if (pos === -1) return null;

    return {
      from: line.from + pos,
      options,
    };
  };
};
