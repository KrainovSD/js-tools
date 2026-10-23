import type { EditorState } from "@codemirror/state";
import { Decoration } from "@codemirror/view";
import type { SyntaxNodeRef } from "@lezer/common";
import clsx from "clsx";
import { utils } from "@/lib";
import { getHeaderId } from "@/lib/utils";
import { CLASSES } from "../classes-constants";
import type { ContentDecorationOptions, SelectionDecorationOptions } from "../markdown-model";
import { MarkdownState } from "../markdown-state";
import styles from "../styles.module.scss";

export const NAME_OF_HEADER = "ATXHeading";
export const NAME_OF_HEADER_UNDER = "SetextHeading";
export const NAME_OF_HEADER_MARK = "HeaderMark";

export type HeaderEntry = {
  lineStart: number;
  from: number;
  to: number;
  id: string;
  slug: string;
  level: number;
};

export function fillATXHeadingContentDecorations(opts: ContentDecorationOptions) {
  const { view, node } = opts;
  const header = view.state.field(MarkdownState).getHeaderAt(view.state, node.from);
  if (!header) {
    return;
  }
  // if (view.state.doc.sliceString(node.from + +level).charCodeAt(0) !== 32) return;
  opts.decorations.push(
    Decoration.line({
      class: clsx(
        styles.header,
        styles[`level_${header.level}`],
        CLASSES.header,
        CLASSES.headerLevels[header.level - 1],
      ),
      attributes: { id: header.id },
    }).range(view.lineBlockAt(node.from).from),
  );
}

export function fillSetextHeadingContentDecorations(opts: ContentDecorationOptions) {
  const { view, node } = opts;
  const header = view.state.field(MarkdownState).getHeaderAt(view.state, node.from);
  if (!header) {
    return;
  }
  opts.decorations.push(
    Decoration.line({
      class: clsx(
        styles.header,
        styles[`level_${header.level}`],
        CLASSES.header,
        CLASSES.headerLevels[header.level - 1],
      ),
      attributes: { id: header.id },
    }).range(view.lineBlockAt(node.from).from),
  );
}

export function fillATXHeadingSelectionDecorations(opts: SelectionDecorationOptions) {
  const { view, node, decorations, readonly } = opts;
  const mark = node.node.getChild(NAME_OF_HEADER_MARK);
  if (!mark) return;
  const line = view.lineBlockAt(mark.from);
  if (line.length < mark.to - mark.from + 1) return;
  if (
    readonly ||
    !view.hasFocus ||
    !utils.isInRange(view.state.selection.ranges, [line.from, line.to])
  ) {
    decorations.push(Decoration.replace({}).range(mark.from, mark.to + 1));
  }
}

export function fillSetextHeadingSelectionDecorations(opts: SelectionDecorationOptions) {
  const { view, node, decorations, readonly } = opts;
  const mark = node.node.getChild(NAME_OF_HEADER_MARK);
  if (!mark) return;
  const lineHeader = view.lineBlockAt(node.from);
  const lineMark = view.lineBlockAt(mark.from);
  if (
    readonly ||
    !view.hasFocus ||
    !utils.isInRange(view.state.selection.ranges, [lineHeader.from, lineMark.to])
  ) {
    decorations.push(Decoration.replace({}).range(lineMark.from, lineMark.to));
  }
}

export function parseHeader(
  state: EditorState,
  node: SyntaxNodeRef,
  slugs: Map<string, number>,
): HeaderEntry | undefined {
  const mark = node.node.getChild(NAME_OF_HEADER_MARK);
  if (!mark) {
    return;
  }
  const slug = getHeaderId(state.doc.sliceString(mark.to, state.doc.lineAt(node.from).to).trim());
  const index = slugs.get(slug) ?? 0;
  slugs.set(slug, index + 1);
  return {
    lineStart: state.doc.lineAt(node.from).from,
    from: node.from,
    to: node.to,
    id: index > 0 ? `${slug}-${index}` : slug,
    slug,
    level: Number(node.name.slice(NAME_OF_HEADER.length)),
  };
}

export function parseSetextHeader(
  state: EditorState,
  node: SyntaxNodeRef,
  slugs: Map<string, number>,
): HeaderEntry {
  const textLine = state.doc.lineAt(node.from);
  const slug = getHeaderId(state.doc.sliceString(textLine.from, textLine.to).trim());
  const index = slugs.get(slug) ?? 0;
  slugs.set(slug, index + 1);
  return {
    lineStart: state.doc.lineAt(node.from).from,
    from: node.from,
    to: node.to,
    id: index > 0 ? `${slug}-${index}` : slug,
    slug,
    level: Number(node.name.slice(NAME_OF_HEADER_UNDER.length)),
  };
}
