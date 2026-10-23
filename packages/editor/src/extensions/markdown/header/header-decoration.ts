import { Decoration } from "@codemirror/view";
import clsx from "clsx";
import { utils } from "@/lib";
import { CLASSES } from "../classes-constants";
import type { ContentDecorationOptions, SelectionDecorationOptions } from "../markdown-model";
import { MarkdownState } from "../markdown-state";
import styles from "../styles.module.scss";
import { NAME_OF_HEADER_MARK } from "./header-model";

export function fillATXHeadingContentDecorations(opts: ContentDecorationOptions) {
  const { view, node } = opts;
  const header = view.state.field(MarkdownState).getHeaderAt(view.state, node.from);
  if (!header) {
    return;
  }
  if (view.state.doc.sliceString(node.from + header.level).charCodeAt(0) !== 32) return;
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
