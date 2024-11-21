import type { GetDecorationsOptions } from "./decoration-markdown-types";
import { getHideDecoration, getMarkDecoration, isInRange } from "./lib";
import styles from "./styles.module.scss";

const MARK_FULL = "Emphasis";
const MARKS = new Set([95, 42]);

export function getItalicDecorations({ decorations, node }: GetDecorationsOptions) {
  if (node.name !== MARK_FULL) {
    return;
  }

  decorations.push(
    getMarkDecoration({
      style: styles.italic,
      range: [node.from, node.to],
    }),
  );
}

export function getItalicHideDecorations({ decorations, node, view }: GetDecorationsOptions) {
  if (node.name !== MARK_FULL) {
    return;
  }

  if (checkIsSeveralEmphasis({ decorations, node, view })) {
    return void splitEmphasis({ decorations, node, view });
  }

  let step = 1;
  const startText = view.state.doc.sliceString(node.from, node.from + 3);
  if (
    MARKS.has(startText.charCodeAt(0)) &&
    MARKS.has(startText.charCodeAt(1)) &&
    MARKS.has(startText.charCodeAt(2))
  )
    step = 3;

  if (isInRange(view.state.selection.ranges, [node.from, node.to]) && view.hasFocus) {
    return;
  }

  decorations.push(getHideDecoration({ range: [node.from, node.from + step] }));
  decorations.push(getHideDecoration({ range: [node.to - step, node.to] }));
}

/** Fixed wide italic + italic */
export function checkIsSeveralEmphasis({ node, view }: GetDecorationsOptions) {
  let marks = 0;
  let pos = 0;

  const text = view.state.doc.sliceString(node.from, node.to);

  while (pos <= text.length) {
    if (MARKS.has(text.charCodeAt(pos))) marks++;
    pos++;
  }

  if (marks === 8) return true;

  return false;
}

export function splitEmphasis({ decorations, node, view }: GetDecorationsOptions) {
  const text = view.state.doc.sliceString(node.from, node.to);
  let marks = 0;
  let pos = 0;

  while (pos <= text.length && marks < 6) {
    if (MARKS.has(text.charCodeAt(pos))) marks++;
    pos++;
  }

  getItalicHideDecorations({
    decorations,
    view,
    node: { ...node, name: node.name, from: node.from, to: node.from + pos },
  });
  getItalicHideDecorations({
    decorations,
    view,
    node: { ...node, name: node.name, from: node.from + pos, to: node.to },
  });
}
