import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";
import type { HighlightConfig } from "../theme-types";

/**
 * t.processingInstruction, t.meta - # () []
 * t.url, t.link - links
 */

export function getHighlightTemplate(config: Required<HighlightConfig>) {
  return syntaxHighlighting(
    HighlightStyle.define([
      { tag: t.keyword, color: config.keyword },
      { tag: [t.name, t.deleted, t.character, t.macroName], color: config.variable },
      { tag: [t.propertyName], color: config.function },
      {
        tag: [t.string, t.inserted, t.special(t.string)],
        color: config.string,
      },
      { tag: [t.function(t.variableName), t.labelName], color: config.function },
      { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: config.constant },
      { tag: [t.definition(t.name), t.separator], color: config.variable },
      { tag: [t.className], color: config.class },
      {
        tag: [t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace],
        color: config.number,
      },
      { tag: [t.typeName], color: config.type, fontStyle: config.type },
      { tag: [t.operator, t.operatorKeyword], color: config.keyword },
      { tag: [t.escape, t.regexp], color: config.regexp },
      { tag: [t.comment], color: config.comment },
      { tag: [t.atom, t.bool, t.special(t.variableName)], color: config.variable },
      { tag: t.invalid, color: config.invalid },
    ]),
  );
}
