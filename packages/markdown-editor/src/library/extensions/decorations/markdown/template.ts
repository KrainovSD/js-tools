import type { GetDecorationOptions } from "./decoration-markdown-types";
import { getHideDecoration } from "./lib";
import styles from "./styles.module.scss";

const MARK_FULL = "";
const MARK = "";

export function getTemplateDecorations({ decorations, node, view }: GetDecorationOptions) {
  if (node.name !== MARK_FULL) {
    return;
  }
}

export function getTemplateSelectionDecorations({ decorations, node, view }: GetDecorationOptions) {
  if (node.name !== MARK_FULL) {
    return;
  }
}

// console.log(node.name, view.state.doc.sliceString(node.from, node.to), node.from, node.to)
