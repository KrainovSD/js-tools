import { Decoration } from "@codemirror/view";
import clsx from "clsx";
import { utils } from "@/lib";
import { CLASSES } from "../classes-constants";
import type { ContentDecorationOptions, SelectionDecorationOptions } from "../markdown-model";
import styles from "../styles.module.scss";

export const NAME_OF_ITALIC = "Emphasis";
const LIST_OF_ITALIC_MARKS = new Set([95, 42]); // _  *

export function fillItalicContentDecorations(opts: ContentDecorationOptions) {
  opts.decorations.push(
    Decoration.mark({
      class: clsx(styles.italic, CLASSES.italic),
    }).range(opts.node.from, opts.node.to),
  );
}

export function fillItalicSelectionDecorations(opts: SelectionDecorationOptions) {
  const { view, node, decorations, readonly } = opts;
  if (checkIsSeveralEmphasis(opts)) {
    return void splitEmphasis(opts);
  }
  let step = 1;
  const startText = view.state.doc.sliceString(node.from, node.from + 3);
  if (
    LIST_OF_ITALIC_MARKS.has(startText.charCodeAt(0)) &&
    LIST_OF_ITALIC_MARKS.has(startText.charCodeAt(1)) &&
    LIST_OF_ITALIC_MARKS.has(startText.charCodeAt(2))
  )
    step = 3;

  if (
    readonly ||
    !view.hasFocus ||
    !utils.isInRange(view.state.selection.ranges, [node.from, node.to])
  ) {
    decorations.push(Decoration.replace({}).range(node.from, node.from + step));
    decorations.push(Decoration.replace({}).range(node.to - step, node.to));
  }
}

function checkIsSeveralEmphasis({ view, node }: SelectionDecorationOptions) {
  let marks = 0;
  let pos = 0;
  const text = view.state.doc.sliceString(node.from, node.to);
  while (pos <= text.length) {
    if (LIST_OF_ITALIC_MARKS.has(text.charCodeAt(pos))) marks++;
    pos++;
  }
  if (marks === 8) return true;
  return false;
}

function splitEmphasis(opts: SelectionDecorationOptions) {
  const { view, node } = opts;
  const text = view.state.doc.sliceString(node.from, node.to);
  let marks = 0;
  let pos = 0;
  while (pos <= text.length && marks < 6) {
    if (LIST_OF_ITALIC_MARKS.has(text.charCodeAt(pos))) marks++;
    pos++;
  }
  fillItalicSelectionDecorations({
    ...opts,
    node: { ...opts.node, from: node.from, to: node.from + pos },
  });
  fillItalicSelectionDecorations({
    ...opts,
    node: { ...opts.node, from: node.from + pos, to: node.to },
  });
}
