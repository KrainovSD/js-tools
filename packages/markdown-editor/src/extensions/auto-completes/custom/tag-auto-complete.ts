import type { CompletionContext, CompletionResult } from "@codemirror/autocomplete";

export const tagAutoComplete = (tagOptions: string[]) => {
  const options = tagOptions.map((user) => ({
    label: `@${user}`,
    type: "text",
  }));

  return (context: CompletionContext): CompletionResult | null => {
    const word = context.matchBefore(/@\w*/);

    if (!word || (word.from === word.to && !context.explicit)) return null;

    return {
      from: word.from,
      options,
    };
  };
};
