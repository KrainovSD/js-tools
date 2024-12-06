import { type EditorView, WidgetType } from "@codemirror/view";
import type { GetSelectionDecorationOptions } from "./decoration-markdown-types";
import {
  getHideDecoration,
  getLineDecoration,
  getMarkDecoration,
  getWidgetDecorationOptions,
  isInRange,
  isRangeOverlap,
} from "./lib";
import styles from "./styles.module.scss";

const MARK_CODE = "FencedCode";
const MARK_INLINE = "InlineCode";
const CODE_OF_MARK = 96;

export function getCodeSelectionDecorations({
  decorations,
  node,
  view,
  isReadonly,
}: GetSelectionDecorationOptions) {
  if (node.name !== MARK_CODE && node.name !== MARK_INLINE) {
    return;
  }

  // let isOverlapLine = false;
  const startMarkPosition = { from: 0, to: 0 };
  const endMarkPosition = { from: 0, to: 0 };
  const lines = view.viewportLineBlocks.filter((line) => {
    const isOverlap = isRangeOverlap([node.from, node.to], [line.from, line.to]);
    // if (isOverlap && isInRange(view.state.selection.ranges, [line.from, line.to]))
    //   isOverlapLine = true;

    return isOverlap;
  });
  let languagePos: [number, number] | undefined;
  let language: string | undefined;

  const content = view.state.doc.sliceString(node.from, node.to);
  let pos = -1;
  while (
    (startMarkPosition.from === 0 || startMarkPosition.to === 0) &&
    pos >= -1 &&
    pos < content.length
  ) {
    pos++;
    const code = content.charCodeAt(pos);

    if (code !== CODE_OF_MARK && startMarkPosition.from === 0) continue;
    else if (code === CODE_OF_MARK && startMarkPosition.from === 0)
      startMarkPosition.from = node.from + pos;
    else if (code !== CODE_OF_MARK && startMarkPosition.from !== 0)
      startMarkPosition.to = node.from + pos;
  }

  pos = content.length;

  while (
    (endMarkPosition.from === 0 || endMarkPosition.to === 0) &&
    pos >= -1 &&
    pos <= content.length
  ) {
    pos--;
    const code = content.charCodeAt(pos);

    if (code !== CODE_OF_MARK && endMarkPosition.to === 0) continue;
    else if (code === CODE_OF_MARK && endMarkPosition.to === 0)
      endMarkPosition.to = node.from + pos + 1;
    else if (code !== CODE_OF_MARK && endMarkPosition.to !== 0)
      endMarkPosition.from = node.from + pos;
  }

  if (node.name === MARK_CODE) {
    const codeInfo = node.node.getChild("CodeInfo");
    const codeText = node.node.getChild("CodeText");
    if (!codeInfo || !codeText) return;

    language = view.state.doc.sliceString(codeInfo.from, codeInfo.to);
    languagePos = [codeInfo.from, codeInfo.to];
  }

  if (lines.length > 1)
    lines.forEach((line) => {
      decorations.push(getLineDecoration({ style: styles.code__line, range: [line.from] }));
    });
  else
    decorations.push(
      getMarkDecoration({ style: styles.code__single, range: [node.from, node.to] }),
    );

  if (
    isReadonly ||
    !view.hasFocus ||
    !isInRange(view.state.selection.ranges, [node.from, node.to])
  ) {
    if (lines.length > 1 && language && languagePos) {
      decorations.push(getHideDecoration({ range: languagePos }));
      decorations.push(
        getWidgetDecorationOptions({ widget: new CodeWidget(language), range: [node.from] }),
      );
    }
    decorations.push(getHideDecoration({ range: [startMarkPosition.from, startMarkPosition.to] }));
    decorations.push(getHideDecoration({ range: [endMarkPosition.from, endMarkPosition.to] }));
  }
}

class CodeWidget extends WidgetType {
  view: EditorView | undefined;

  constructor(private readonly language: string) {
    super();
  }

  toDOM(view: EditorView): HTMLElement {
    this.view = view;
    const button = document.createElement("button");
    button.classList.add(styles.code__button);
    button.textContent = this.language;

    return button;
  }

  // destroy(dom: HTMLElement): void {}
}
