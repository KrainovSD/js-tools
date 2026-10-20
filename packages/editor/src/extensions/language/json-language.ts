import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { json, jsonParseLinter } from "@codemirror/lang-json";
import { codeFolding, foldGutter, foldKeymap, indentUnit } from "@codemirror/language";
import { lintGutter, lintKeymap, linter } from "@codemirror/lint";
import type { Extension } from "@codemirror/state";
import { keymap } from "@codemirror/view";
import type { LanguageFormatter } from "./new-language";

export type JSONOptions = {
  name?: "json";
  fold?: boolean;
  linter?: boolean;
  closeBrackets?: boolean;
};

export function NewJSON(opts: JSONOptions | undefined): Extension[] {
  const extensions: Extension[] = [
    json(),
    indentUnit.of("  "),
    keymap.of([...closeBracketsKeymap, ...foldKeymap, ...lintKeymap]),
  ];
  if (opts?.fold !== false) {
    extensions.push(foldGutter(), codeFolding());
  }
  if (opts?.linter !== false) {
    extensions.push(linter(jsonParseLinter(), { delay: 300 }), lintGutter());
  }
  if (opts?.closeBrackets !== false) {
    extensions.push(closeBrackets());
  }
  return extensions;
}

export const jsonFormatter: LanguageFormatter = (content) => {
  try {
    return JSON.stringify(JSON.parse(content), null, 2);
  } catch {
    return content;
  }
};
