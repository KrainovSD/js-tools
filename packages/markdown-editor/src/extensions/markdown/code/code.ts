import { CLASSES } from "@/extensions/theme";
import { utils } from "@/lib";
import type { GetSelectionDecorationOptions } from "../markdown-types";
import styles from "../styles.module.scss";
import { CodeWidget } from "./code-widget";

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

  let isOverlapLine = false;
  const startMarkPosition = { from: -1, to: -1 };
  const endMarkPosition = { from: -1, to: -1 };
  const lines = view.viewportLineBlocks.filter((line) => {
    const isOverlap = utils.isRangeOverlap([node.from, node.to], [line.from, line.to]);
    if (isOverlap && utils.isInRange(view.state.selection.ranges, [line.from, line.to]))
      isOverlapLine = true;

    return isOverlap;
  });
  let languagePos: [number, number] | undefined;
  let language: string | undefined;
  let codeContent: string | undefined;

  const content = view.state.doc.sliceString(node.from, node.to);
  let pos = -1;
  while (
    (startMarkPosition.from === -1 || startMarkPosition.to === -1) &&
    pos >= -1 &&
    pos < content.length
  ) {
    pos++;
    const code = content.charCodeAt(pos);

    if (code !== CODE_OF_MARK && startMarkPosition.from === -1) continue;
    else if (code === CODE_OF_MARK && startMarkPosition.from === -1)
      startMarkPosition.from = node.from + pos;
    else if (code !== CODE_OF_MARK && startMarkPosition.from !== -1)
      startMarkPosition.to = node.from + pos;
  }

  pos = content.length;

  while (
    (endMarkPosition.from === -1 || endMarkPosition.to === -1) &&
    pos >= -1 &&
    pos <= content.length
  ) {
    pos--;
    const code = content.charCodeAt(pos);

    if (code !== CODE_OF_MARK && endMarkPosition.to === -1) continue;
    else if (code === CODE_OF_MARK && endMarkPosition.to === -1)
      endMarkPosition.to = node.from + pos + 1;
    else if (code !== CODE_OF_MARK && endMarkPosition.to !== -1)
      endMarkPosition.from = node.from + pos + 1;
  }

  if (node.name === MARK_CODE) {
    const codeInfo = node.node.getChild("CodeInfo");
    const codeText = node.node.getChild("CodeText");

    if (codeInfo) {
      language = view.state.doc.sliceString(codeInfo.from, codeInfo.to);
      languagePos = [codeInfo.from, codeInfo.to];
    }
    if (codeText) codeContent = view.state.doc.sliceString(codeText.from, codeText.to);
    else codeContent = "";
  }
  if (node.name === MARK_INLINE) {
    codeContent = view.state.doc.sliceString(startMarkPosition.to, endMarkPosition.from).trim();
  }
  if (!language) language = "copy";

  if (lines.length > 1) {
    lines.forEach((line) => {
      decorations.push(utils.getLineDecoration({ style: styles.code__line, range: [line.from] }));
      decorations.push(utils.getLineDecoration({ style: CLASSES.code, range: [line.from] }));
    });
  } else {
    decorations.push(
      utils.getMarkDecoration({ style: styles.code__single, range: [node.from, node.to] }),
    );
    decorations.push(utils.getMarkDecoration({ style: CLASSES.code, range: [node.from, node.to] }));
  }

  if (
    isReadonly ||
    !view.hasFocus ||
    (lines.length > 1 && !isOverlapLine) ||
    (lines.length === 1 && !utils.isInRange(view.state.selection.ranges, [node.from, node.to]))
  ) {
    if (lines.length > 1 && language) {
      if (languagePos) decorations.push(utils.getHideDecoration({ range: languagePos }));
      decorations.push(
        utils.getWidgetDecorationOptions({
          widget: new CodeWidget(language, codeContent),
          range: [node.from],
        }),
      );
    }
    decorations.push(
      utils.getHideDecoration({ range: [startMarkPosition.from, startMarkPosition.to] }),
    );
    decorations.push(
      utils.getHideDecoration({ range: [endMarkPosition.from, endMarkPosition.to] }),
    );
  }
}
