import clsx from "clsx";
import { utils } from "@/lib";
import { CLASSES } from "../classes-constants";
import type {
  DecorationPlugin,
  GetDecorationOptions,
  GetSelectionDecorationOptions,
} from "../markdown-types";
import styles from "../styles.module.scss";
import {
  CODE_OF_CODE_MARK,
  CODE_OF_SPACE,
  CODE_OF_TILDE_MARK,
  NAME_OF_BLOCK_CODE,
  NAME_OF_FENCED_CODE,
  NAME_OF_INLINE_CODE,
} from "./code-constants";
import { CodeWidget } from "./code-widget";

function isCodeMark(code: number) {
  return code === CODE_OF_CODE_MARK || code === CODE_OF_TILDE_MARK;
}

function getCodeSelectionDecorations({
  decorations,
  node,
  view,
  forceActive,
}: GetSelectionDecorationOptions) {
  if (node.name !== NAME_OF_FENCED_CODE && node.name !== NAME_OF_INLINE_CODE) {
    return;
  }
  let isOverlapSelection = false;
  let startMarkRange: [number, number] | undefined = [-1, -1];
  let endMarkRange: [number, number] | undefined = [-1, -1];
  const lines = view.viewportLineBlocks.filter((line) => {
    const isOverlap = utils.isRangeOverlap([node.from, node.to], [line.from, line.to]);
    if (isOverlap) {
    }
    if (isOverlap && utils.isInRange(view.state.selection.ranges, [line.from, line.to])) {
      isOverlapSelection = true;
    }
    return isOverlap;
  });
  let languagePos: [number, number] | undefined;
  let language: string | undefined;
  let codeContent: string | undefined;
  const content = view.state.doc.sliceString(node.from, node.to);
  let pos = 0;
  while ((startMarkRange[0] === -1 || startMarkRange[1] === -1) && pos < content.length) {
    const code = content.charCodeAt(pos);
    if (!isCodeMark(code) && startMarkRange[0] === -1) {
      continue;
    } else if (isCodeMark(code) && startMarkRange[0] === -1) {
      startMarkRange[0] = node.from + pos;
    } else if (!isCodeMark(code) && startMarkRange[0] !== -1) {
      startMarkRange[1] = node.from + pos;
    }
    pos++;
  }
  if (startMarkRange[0] === -1 || startMarkRange[1] === -1) {
    startMarkRange = undefined;
  }
  pos = content.length - 1;
  while ((endMarkRange[0] === -1 || endMarkRange[1] === -1) && pos > -1) {
    const code = content.charCodeAt(pos);
    if (!isCodeMark(code) && endMarkRange[1] === -1) {
      continue;
    } else if (isCodeMark(code) && endMarkRange[1] === -1) {
      endMarkRange[1] = node.from + pos + 1;
    } else if (!isCodeMark(code) && endMarkRange[1] !== -1) {
      endMarkRange[0] = node.from + pos + 1;
    }
    pos--;
  }
  if (endMarkRange[0] === -1 || endMarkRange[1] === -1) {
    endMarkRange = undefined;
  }
  if (node.name === NAME_OF_FENCED_CODE) {
    const codeInfo = node.node.getChild("CodeInfo");
    const codeText = node.node.getChild("CodeText");
    if (codeInfo) {
      language = view.state.doc.sliceString(codeInfo.from, codeInfo.to);
      languagePos = [codeInfo.from, codeInfo.to];
    }
    if (codeText) {
      codeContent = view.state.doc.sliceString(codeText.from, codeText.to);
    } else {
      codeContent = "";
    }
  }
  if (node.name === NAME_OF_INLINE_CODE) {
    codeContent =
      startMarkRange && endMarkRange
        ? view.state.doc.sliceString(startMarkRange[1], endMarkRange[0]).trim()
        : "";
  }
  language ??= "copy";

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
        style: clsx(CLASSES.code),
        range: [node.from, node.to],
      }),
    );
  }

  if (
    forceActive ||
    !view.hasFocus ||
    (lines.length > 1 && !isOverlapSelection) ||
    (lines.length === 1 && !utils.isInRange(view.state.selection.ranges, [node.from, node.to]))
  ) {
    if (lines.length > 1 && language) {
      if (languagePos && languagePos[0] < languagePos[1])
        decorations.push(utils.getHideDecoration({ range: languagePos }));
      decorations.push(
        utils.getWidgetDecorationOptions({
          widget: new CodeWidget(language, codeContent),
          range: [node.from],
        }),
      );
    }
    if (startMarkRange) decorations.push(utils.getHideDecoration({ range: startMarkRange }));
    if (endMarkRange) decorations.push(utils.getHideDecoration({ range: endMarkRange }));
  }
}

function getCodeBlockDecorations({ decorations, node, view }: GetDecorationOptions) {
  if (node.name !== NAME_OF_BLOCK_CODE) return;

  const lines = view.viewportLineBlocks.filter((line) => {
    const isOverlap = utils.isRangeOverlap([node.from, node.to], [line.from, line.to]);

    return isOverlap;
  });

  lines.forEach((line) => {
    const content = view.state.sliceDoc(line.from, line.to);
    let startContent = 0;
    let pos = 0;

    while (pos < content.length) {
      if (content.codePointAt(pos) === CODE_OF_SPACE) {
        pos++;
      } else {
        startContent = pos;
        break;
      }
    }

    decorations.push(
      utils.getMarkDecoration({
        range: [line.from + startContent, line.to],
        style: clsx(styles.code__block, CLASSES.codeBlock),
      }),
    );

    decorations.push(
      utils.getLineDecoration({
        range: [line.from],
        style: clsx(styles.code__block_line, CLASSES.codeBlockLine),
      }),
    );
  });
}

export const codeDecorationPlugin: DecorationPlugin = {
  selectionDecorations: [getCodeSelectionDecorations],
  decorations: [getCodeBlockDecorations],
};
