import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import type { HighlightConfig } from "../theme-types";

/**
 * t.processingInstruction, t.meta - # () []
 * t.url, t.link - links
 */

export function getHighlightTemplate(config: Required<HighlightConfig>) {
  return syntaxHighlighting(
    HighlightStyle.define([
      { tag: tags.keyword, color: config.keyword },
      { tag: [tags.name, tags.deleted, tags.character, tags.macroName], color: config.variable },
      { tag: [tags.propertyName], color: config.function },
      {
        tag: [tags.string, tags.inserted, tags.special(tags.string)],
        color: config.string,
      },
      { tag: [tags.function(tags.variableName), tags.labelName], color: config.function },
      {
        tag: [tags.color, tags.constant(tags.name), tags.standard(tags.name)],
        color: config.constant,
      },
      { tag: [tags.definition(tags.name), tags.separator], color: config.variable },
      { tag: [tags.className], color: config.class },
      {
        tag: [tags.number, tags.changed, tags.annotation, tags.modifier, tags.self, tags.namespace],
        color: config.number,
      },
      { tag: [tags.typeName], color: config.type, fontStyle: config.type },
      { tag: [tags.operator, tags.operatorKeyword], color: config.keyword },
      { tag: [tags.escape, tags.regexp], color: config.regexp },
      { tag: [tags.comment], color: config.comment },
      { tag: [tags.atom, tags.bool, tags.special(tags.variableName)], color: config.variable },
      { tag: tags.invalid, color: config.invalid },
    ]),
  );
}
