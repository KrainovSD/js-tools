import { WidgetType } from "@codemirror/view";
import { utils } from "@/lib";
import type { GetDecorationOptions, GetSelectionDecorationOptions } from "../markdown-types";
import styles from "../styles.module.scss";

const MARK = "QuoteMark";
const CODE_OF_SPACE = 32;
const CODE_OF_MARK = 62;

export function getBlockquoteDecorations({ decorations, node, view }: GetDecorationOptions) {
  if (node.name !== MARK) {
    return;
  }

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
      if (currentCode === CODE_OF_MARK) {
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

  if (!isInner)
    decorations.push(
      utils.getLineDecoration({
        style: styles.blockquote,
        range: [line.from],
      }),
    );
}

export function getBlockquoteSelectionDecorations({
  decorations,
  node,
  view,
  isReadonly,
}: GetSelectionDecorationOptions) {
  if (node.name !== MARK) {
    return;
  }

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
      if (currentCode === CODE_OF_MARK) {
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

class BlockquoteWidget extends WidgetType {
  constructor(private readonly deep: boolean) {
    super();
  }

  toDOM(): HTMLElement {
    const span = document.createElement("span");
    span.classList.add(styles.blockquote__inner);
    if (this.deep) span.classList.add(styles["blockquote__inner-deep"]);

    return span;
  }
}
