import { Decoration } from "@codemirror/view";
import clsx from "clsx";
import { utils } from "@/lib";
import { CLASSES } from "../classes-constants";
import {
  CODE_OF_SPACE,
  type ContentDecorationOptions,
  NAME_OF_HEADER_MARK,
  type SelectionDecorationOptions,
} from "../markdown-model";
import { MarkdownState } from "../markdown-state";

export function fillATXHeadingContentDecorations(opts: ContentDecorationOptions) {
  const { view, node } = opts;
  const header = view.state.field(MarkdownState).getHeaderAt(view.state, node.from);
  if (!header) {
    return;
  }
  if (view.state.doc.sliceString(node.from + header.level).charCodeAt(0) !== CODE_OF_SPACE) return;
  opts.decorations.push(
    Decoration.line({
      class: clsx(CLASSES.header, CLASSES.headerLevels[header.level - 1]),
      attributes: { id: header.id },
    }).range(view.state.doc.lineAt(node.from).from),
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
      class: clsx(CLASSES.header, CLASSES.headerLevels[header.level - 1]),
      attributes: { id: header.id },
    }).range(view.state.doc.lineAt(node.from).from),
  );
}

export function fillATXHeadingSelectionDecorations(opts: SelectionDecorationOptions) {
  const { view, node, decorations, readonly } = opts;
  const mark = node.node.getChild(NAME_OF_HEADER_MARK);
  if (!mark) return;
  const line = view.state.doc.lineAt(mark.from);
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
  const lineHeader = view.state.doc.lineAt(node.from);
  const lineMark = view.state.doc.lineAt(mark.from);
  if (
    readonly ||
    !view.hasFocus ||
    !utils.isInRange(view.state.selection.ranges, [lineHeader.from, lineMark.to])
  ) {
    decorations.push(Decoration.replace({}).range(lineMark.from, lineMark.to));
  }
}
