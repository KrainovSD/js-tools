import type { Text } from "@codemirror/state";
import { Decoration } from "@codemirror/view";
import type { SyntaxNodeRef } from "@lezer/common";
import clsx from "clsx";
import { utils } from "@/lib";
import { CLASSES } from "../classes-constants";
import {
  CODE_OF_CLOSE_BRACKET,
  CODE_OF_DIGIT_END,
  CODE_OF_DIGIT_START,
  CODE_OF_EXCLAMATION,
  CODE_OF_HYPHEN,
  CODE_OF_LATIN_LOWER_END,
  CODE_OF_LATIN_LOWER_START,
  CODE_OF_LATIN_UPPER_END,
  CODE_OF_LATIN_UPPER_START,
  CODE_OF_OPEN_BRACKET,
  CODE_OF_PLUS,
  CODE_OF_SPACE,
  CODE_OF_TAB,
  CODE_OF_UNDERSCORE,
  type ContentDecorationOptions,
  NAME_OF_BLOCKQUOTE,
  type SelectionDecorationOptions,
} from "../markdown-model";
import { type CalloutType, getCalloutDefaultTitle, getCalloutType } from "./callout-constants";
import { CalloutWidget } from "./callout-widget";

function isWordCode(code: number) {
  return (
    (code >= CODE_OF_LATIN_LOWER_START && code <= CODE_OF_LATIN_LOWER_END) ||
    (code >= CODE_OF_LATIN_UPPER_START && code <= CODE_OF_LATIN_UPPER_END) ||
    (code >= CODE_OF_DIGIT_START && code <= CODE_OF_DIGIT_END) ||
    code === CODE_OF_UNDERSCORE
  );
}

type CalloutInfo = {
  type: CalloutType;
  rawType: string;
  from: number;
  to: number;
  hasTitle: boolean;
};

export function fillCalloutContentDecorations(opts: ContentDecorationOptions) {
  const { view, node, decorations } = opts;
  const doc = view.state.doc;
  const callout = getCallout(doc, node);
  if (!callout) return;
  const firstLine = doc.lineAt(node.from);
  const lastLine = doc.lineAt(Math.max(node.from, node.to - 1));
  for (let number = firstLine.number; number <= lastLine.number; number++) {
    const isTitle = number === firstLine.number;
    decorations.push(
      Decoration.line({
        class: clsx(
          CLASSES.callout,
          CLASSES.calloutTypes[callout.type],
          isTitle && CLASSES.calloutTitle,
        ),
      }).range(doc.line(number).from),
    );
  }
}

export function fillCalloutSelectionDecorations(opts: SelectionDecorationOptions) {
  const { view, node, decorations, readonly } = opts;
  const doc = view.state.doc;
  const callout = getCallout(doc, node);
  if (!callout) return;
  const line = doc.lineAt(callout.from);
  if (
    readonly ||
    !view.hasFocus ||
    !utils.isInRange(view.state.selection.ranges, [line.from, line.to])
  ) {
    decorations.push(
      Decoration.replace({
        widget: new CalloutWidget(
          callout.type,
          callout.hasTitle ? undefined : getCalloutDefaultTitle(callout.rawType),
        ),
      }).range(callout.from, callout.to),
    );
  }
}

function getCallout(doc: Text, node: SyntaxNodeRef): CalloutInfo | undefined {
  if (node.node.parent?.name === NAME_OF_BLOCKQUOTE) return undefined;
  const line = doc.lineAt(node.from);
  const text = line.text;
  const length = text.length;
  let pos = node.from - line.from + 1;
  while (pos < length) {
    const code = text.charCodeAt(pos);
    if (code !== CODE_OF_SPACE && code !== CODE_OF_TAB) break;
    pos++;
  }
  if (
    text.charCodeAt(pos) !== CODE_OF_OPEN_BRACKET ||
    text.charCodeAt(pos + 1) !== CODE_OF_EXCLAMATION
  ) {
    return undefined;
  }
  pos += 2;
  const typeFrom = pos;

  while (pos < length && isWordCode(text.charCodeAt(pos))) pos++;
  if (pos === typeFrom || text.charCodeAt(pos) !== CODE_OF_CLOSE_BRACKET) return undefined;
  const rawType = text.slice(typeFrom, pos);
  pos++;

  const foldCode = text.charCodeAt(pos);
  if (foldCode === CODE_OF_HYPHEN || foldCode === CODE_OF_PLUS) pos++;
  if (text.charCodeAt(pos) === CODE_OF_SPACE) pos++;

  let hasTitle = false;
  for (let rest = pos; rest < length; rest++) {
    const code = text.charCodeAt(rest);
    if (code !== CODE_OF_SPACE && code !== CODE_OF_TAB) {
      hasTitle = true;
      break;
    }
  }

  return {
    type: getCalloutType(rawType),
    rawType,
    from: line.from + typeFrom - 2,
    to: line.from + pos,
    hasTitle,
  };
}
