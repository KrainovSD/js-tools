import clsx from "clsx";
import { CLASSES } from "@/extensions/theme";
import { utils } from "@/lib";
import type {
  DecorationMap,
  DecorationPlugin,
  GetDecorationOptions,
  GetSelectionDecorationOptions,
  SelectionDecorationMap,
} from "../markdown-types";
import styles from "../styles.module.scss";
import {
  CODE_OF_BLOCKQUOTE_MARK,
  CODE_OF_SPACE,
  NAME_OF_BLOCKQUOTE_MARK,
} from "./blockquote-constants";
import { BlockquoteWidget } from "./blockquote-widget";

export function getBlockquoteDecorations({ decorations, node, view }: GetDecorationOptions) {
  const line = view.lineBlockAt(node.from);
  let isInner = false;

  if (line.from !== node.from) {
    const content = view.state.doc.sliceString(line.from, node.to);
    let pos = content.length - 1;
    let isHasMark = false;

    while (pos >= 0) {
      pos--;
      const currentCode = content.charCodeAt(pos);
      if (currentCode === CODE_OF_SPACE) continue;
      if (currentCode === CODE_OF_BLOCKQUOTE_MARK) {
        if (!isHasMark) {
          isHasMark = true;
          continue;
        }
        if (!isInner) {
          isInner = true;
          break;
        }
      }
      pos = -1;
    }
  }

  if (!isInner) {
    decorations.push(
      utils.getLineDecoration({
        style: clsx(styles.blockquote, CLASSES.blockquote),
        range: [line.from],
      }),
    );
  }
}

export function getBlockquoteSelectionDecorations({
  decorations,
  node,
  view,
  isReadonly,
}: GetSelectionDecorationOptions) {
  const line = view.lineBlockAt(node.from);
  let isInner = false;
  let isDeepInner = false;

  if (line.from !== node.from) {
    const content = view.state.doc.sliceString(line.from, node.to);
    let pos = content.length;
    let isHasMark = false;

    while (pos >= 0) {
      pos--;
      const currentCode = content.charCodeAt(pos);

      if (currentCode === CODE_OF_SPACE) continue;
      if (currentCode === CODE_OF_BLOCKQUOTE_MARK) {
        if (!isHasMark) {
          isHasMark = true;
          continue;
        }
        if (!isInner) {
          isInner = true;
          continue;
        }
        if (!isDeepInner) {
          isDeepInner = true;
          break;
        }
      }
      pos = -1;
    }
  }

  if (
    isReadonly ||
    !view.hasFocus ||
    !utils.isInRange(view.state.selection.ranges, [line.from, line.to])
  ) {
    if (!isInner) decorations.push(utils.getHideDecoration({ range: [node.from, node.to] }));
    else
      decorations.push(
        utils.getReplaceDecoration({
          widget: new BlockquoteWidget(isDeepInner),
          range: [node.from, node.to],
        }),
      );
  }
}

const decorations: DecorationMap = {
  [NAME_OF_BLOCKQUOTE_MARK]: getBlockquoteDecorations,
};
const selectionDecorations: SelectionDecorationMap = {
  [NAME_OF_BLOCKQUOTE_MARK]: getBlockquoteSelectionDecorations,
};
export const blockquoteDecorationPlugin: DecorationPlugin = {
  decorations,
  selectionDecorations,
};
