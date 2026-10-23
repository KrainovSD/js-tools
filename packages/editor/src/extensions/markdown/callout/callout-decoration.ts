import type { Text } from "@codemirror/state";
import { Decoration } from "@codemirror/view";
import type { SyntaxNodeRef } from "@lezer/common";
import clsx from "clsx";
import { utils } from "@/lib";
import { CLASSES } from "../classes-constants";
import type { ContentDecorationOptions, SelectionDecorationOptions } from "../markdown-model";
import { type CalloutType, getCalloutDefaultTitle, getCalloutType } from "./callout-constants";
import { CalloutWidget } from "./callout-widget";

const NAME_OF_BLOCKQUOTE = "Blockquote";

const CODE_OF_SPACE = " ".codePointAt(0);
const CODE_OF_TAB = "\t".codePointAt(0);
const CODE_OF_OPEN_BRACKET = "[".codePointAt(0);
const CODE_OF_EXCLAMATION = "!".codePointAt(0);
const CODE_OF_CLOSE_BRACKET = "]".codePointAt(0);
const CODE_OF_MINUS = "-".codePointAt(0);
const CODE_OF_PLUS = "+".codePointAt(0);

function isWordCode(code: number) {
  return (
    (code >= 97 && code <= 122) || // a-z
    (code >= 65 && code <= 90) || // A-Z
    (code >= 48 && code <= 57) || // 0-9
    code === 95 // _
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
  if (foldCode === CODE_OF_MINUS || foldCode === CODE_OF_PLUS) pos++;
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
