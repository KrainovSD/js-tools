import type { AnnotationType, Extension } from "@codemirror/state";
import type { MarkdownOptions } from "../markdown";
import type { JSONOptions } from "./json-language";

export type LanguageOptions = { extension?: Extension[]; formatter?: LanguageFormatter } & (
  | MarkdownOptions
  | JSONOptions
);
export type LanguageFormatter = (text: string) => string;

export async function NewLanguage(
  opts: LanguageOptions,
  ySyncAnnotation: AnnotationType<unknown> | undefined,
  signal: AbortSignal,
): Promise<[Extension[], LanguageFormatter | undefined]> {
  switch (opts.name) {
    case "markdown": {
      const { NewMarkdownLanguage } = await import("../markdown/new-markdown");
      const extensions = NewMarkdownLanguage(opts, ySyncAnnotation, signal);
      return [[extensions, ...(opts.extension ?? [])], opts.formatter];
    }
    case "json": {
      const { NewJSON, jsonFormatter } = await import("./json-language");
      const extensions = NewJSON(opts);
      return [[extensions, ...(opts.extension ?? [])], opts.formatter ?? jsonFormatter];
    }
    default: {
      return [opts.extension ?? [], opts.formatter];
    }
  }
}
