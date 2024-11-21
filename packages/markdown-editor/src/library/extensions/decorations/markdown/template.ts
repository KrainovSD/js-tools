import type { GetDecorationsOptions } from "./decoration-markdown-types";
import { getHideDecoration } from "./lib";
import styles from "./styles.module.scss";

const MARK_FULL = "";
const MARK = "";

export function getTemplateDecorations({ decorations, node, view }: GetDecorationsOptions) {
  if (node.name !== MARK_FULL) {
    return;
  }
}

export function getTemplateHideDecorations({ decorations, node, view }: GetDecorationsOptions) {
  if (node.name !== MARK_FULL) {
    return;
  }
}

// console.log(node.name, view.state.doc.sliceString(node.from, node.to), node.from, node.to)
