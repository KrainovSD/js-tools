import { utils } from "@/lib";
import type { GetDecorationOptions, GetSelectionDecorationOptions } from "../markdown-types";
import styles from "../styles.module.scss";
import { LIST_OF_ITALIC_MARKS, NAME_OF_ITALIC } from "./italic-constants";

export function getItalicDecorations({ decorations, node }: GetDecorationOptions) {
  if (node.name !== NAME_OF_ITALIC) {
    return;
  }

  decorations.push(
    utils.getMarkDecoration({
      style: styles.italic,
      range: [node.from, node.to],
    }),
  );
}

export function getItalicSelectionDecorations({
  decorations,
  node,
  view,
  isReadonly,
}: GetSelectionDecorationOptions) {
  if (node.name !== NAME_OF_ITALIC) {
    return;
  }

  if (checkIsSeveralEmphasis({ decorations, node, view, isReadonly })) {
    return void splitEmphasis({ decorations, node, view, isReadonly });
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
    isReadonly ||
    !view.hasFocus ||
    !utils.isInRange(view.state.selection.ranges, [node.from, node.to])
  ) {
    decorations.push(utils.getHideDecoration({ range: [node.from, node.from + step] }));
    decorations.push(utils.getHideDecoration({ range: [node.to - step, node.to] }));
  }
}

/** Fixed wide italic + italic */
export function checkIsSeveralEmphasis({ node, view }: GetSelectionDecorationOptions) {
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

export function splitEmphasis({
  decorations,
  node,
  view,
  isReadonly,
}: GetSelectionDecorationOptions) {
  const text = view.state.doc.sliceString(node.from, node.to);
  let marks = 0;
  let pos = 0;

  while (pos <= text.length && marks < 6) {
    if (LIST_OF_ITALIC_MARKS.has(text.charCodeAt(pos))) marks++;
    pos++;
  }

  getItalicSelectionDecorations({
    decorations,
    view,
    node: { ...node, name: node.name, from: node.from, to: node.from + pos },
    isReadonly,
  });
  getItalicSelectionDecorations({
    decorations,
    view,
    node: { ...node, name: node.name, from: node.from + pos, to: node.to },
    isReadonly,
  });
}
