import clsx from "clsx";
import { CLASSES } from "@/extensions/theme";
import { utils } from "@/lib";
import type { GetSelectionDecorationOptions } from "../markdown-types";
import styles from "../styles.module.scss";
import { CODE_OF_CODE_MARK, NAME_OF_FENCED_CODE, NAME_OF_INLINE_CODE } from "./code-constants";
import { CodeWidget } from "./code-widget";

export function getCodeSelectionDecorations({
  decorations,
  node,
  view,
  isReadonly,
}: GetSelectionDecorationOptions) {
  if (node.name !== NAME_OF_FENCED_CODE && node.name !== NAME_OF_INLINE_CODE) {
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

    if (code !== CODE_OF_CODE_MARK && startMarkPosition.from === -1) continue;
    else if (code === CODE_OF_CODE_MARK && startMarkPosition.from === -1)
      startMarkPosition.from = node.from + pos;
    else if (code !== CODE_OF_CODE_MARK && startMarkPosition.from !== -1)
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

    if (code !== CODE_OF_CODE_MARK && endMarkPosition.to === -1) continue;
    else if (code === CODE_OF_CODE_MARK && endMarkPosition.to === -1)
      endMarkPosition.to = node.from + pos + 1;
    else if (code !== CODE_OF_CODE_MARK && endMarkPosition.to !== -1)
      endMarkPosition.from = node.from + pos + 1;
  }

  if (node.name === NAME_OF_FENCED_CODE) {
    const codeInfo = node.node.getChild("CodeInfo");
    const codeText = node.node.getChild("CodeText");

    if (codeInfo) {
      language = view.state.doc.sliceString(codeInfo.from, codeInfo.to);
      languagePos = [codeInfo.from, codeInfo.to];
    }
    if (codeText) codeContent = view.state.doc.sliceString(codeText.from, codeText.to);
    else codeContent = "";
  }
  if (node.name === NAME_OF_INLINE_CODE) {
    codeContent = view.state.doc.sliceString(startMarkPosition.to, endMarkPosition.from).trim();
  }
  if (!language) language = "copy";

  if (lines.length > 1) {
    lines.forEach((line) => {
      decorations.push(
        utils.getLineDecoration({
          style: clsx(styles.code__line, CLASSES.code),
          range: [line.from],
        }),
      );
    });
  } else {
    decorations.push(
      utils.getMarkDecoration({
        style: clsx(styles.code__single, CLASSES.code),
        range: [node.from, node.to],
      }),
    );
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
