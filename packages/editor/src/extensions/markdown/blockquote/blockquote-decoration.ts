import { Decoration } from "@codemirror/view";
import clsx from "clsx";
import { utils } from "@/lib";
import { CLASSES } from "../classes-constants";
import {
  CODE_OF_GREATER_THAN,
  CODE_OF_SPACE,
  type ContentDecorationOptions,
  type SelectionDecorationOptions,
} from "../markdown-model";
import styles from "../styles.module.scss";
import { BlockquoteWidget } from "./blockquote-widget";

export function fillBlockquoteContentDecorations(opts: ContentDecorationOptions) {
  const { view, node, decorations } = opts;
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
      if (currentCode === CODE_OF_GREATER_THAN) {
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
      Decoration.line({
        class: clsx(styles.blockquote, CLASSES.blockquote),
      }).range(line.from),
    );
  }
}

export function fillBlockquoteSelectionDecorations(opts: SelectionDecorationOptions) {
  const { view, node, decorations, readonly } = opts;
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
      if (currentCode === CODE_OF_GREATER_THAN) {
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
    readonly ||
    !view.hasFocus ||
    !utils.isInRange(view.state.selection.ranges, [line.from, line.to])
  ) {
    if (!isInner) {
      decorations.push(Decoration.replace({}).range(node.from, node.to));
    } else {
      decorations.push(
        Decoration.replace({
          widget: new BlockquoteWidget(isDeepInner),
        }).range(node.from, node.to),
      );
    }
  }
}
