import { Decoration, type EditorView } from "@codemirror/view";
import clsx from "clsx";
import { utils } from "@/lib";
import { CLASSES } from "../classes-constants";
import {
  CODE_OF_BACKTICK,
  CODE_OF_SPACE,
  CODE_OF_TILDE,
  type ContentDecorationOptions,
  NAME_OF_CODE_INFO,
  NAME_OF_CODE_TEXT,
  type SelectionDecorationOptions,
} from "../markdown-model";
import { CodeWidget } from "./code-widget";

function isCodeMark(code: number) {
  return code === CODE_OF_BACKTICK || code === CODE_OF_TILDE;
}

export function fillFencedCodeSelectionDecorations(opts: SelectionDecorationOptions) {
  const { view, node } = opts;
  const ctx = getCodeMarksContext(view, node);
  let language: string | undefined;
  let languagePos: [number, number] | undefined;
  let codeContent: string | undefined;

  const codeInfo = node.node.getChild(NAME_OF_CODE_INFO);
  const codeText = node.node.getChild(NAME_OF_CODE_TEXT);
  if (codeInfo) {
    language = view.state.doc.sliceString(codeInfo.from, codeInfo.to);
    languagePos = [codeInfo.from, codeInfo.to];
  }
  if (codeText) {
    codeContent = view.state.doc.sliceString(codeText.from, codeText.to);
  } else {
    codeContent = "";
  }

  pushCodeSelectionDecorations(opts, {
    ...ctx,
    language: language ?? "copy",
    languagePos,
    codeContent,
  });
}

export function fillInlineCodeSelectionDecorations(opts: SelectionDecorationOptions) {
  const { view, node } = opts;
  const ctx = getCodeMarksContext(view, node);
  const codeContent =
    ctx.startMarkRange && ctx.endMarkRange
      ? view.state.doc.sliceString(ctx.startMarkRange[1], ctx.endMarkRange[0]).trim()
      : "";

  pushCodeSelectionDecorations(opts, {
    ...ctx,
    language: "copy",
    languagePos: undefined,
    codeContent,
  });
}

export function fillCodeBlockContentDecorations(opts: ContentDecorationOptions) {
  const { view, node, decorations } = opts;

  const lines = view.viewportLineBlocks.filter((line) =>
    utils.isRangeOverlap([node.from, node.to], [line.from, line.to]),
  );

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
      Decoration.mark({
        class: CLASSES.codeBlock,
      }).range(line.from + startContent, line.to),
    );

    decorations.push(
      Decoration.line({
        class: CLASSES.codeBlockLine,
      }).range(line.from),
    );
  });
}

type CodeMarksContext = {
  lines: ReturnType<EditorView["lineBlockAt"]>[];
  isOverlapSelection: boolean;
  startMarkRange: [number, number] | undefined;
  endMarkRange: [number, number] | undefined;
};

function getCodeMarksContext(
  view: SelectionDecorationOptions["view"],
  node: SelectionDecorationOptions["node"],
): CodeMarksContext {
  let isOverlapSelection = false;
  const lines = view.viewportLineBlocks.filter((line) => {
    const isOverlap = utils.isRangeOverlap([node.from, node.to], [line.from, line.to]);
    if (isOverlap && utils.isInRange(view.state.selection.ranges, [line.from, line.to])) {
      isOverlapSelection = true;
    }
    return isOverlap;
  });

  const content = view.state.doc.sliceString(node.from, node.to);
  const startMarkRange: [number, number] = [-1, -1];
  const endMarkRange: [number, number] = [-1, -1];
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

  return {
    lines,
    isOverlapSelection,
    startMarkRange:
      startMarkRange[0] === -1 || startMarkRange[1] === -1 ? undefined : startMarkRange,
    endMarkRange: endMarkRange[0] === -1 || endMarkRange[1] === -1 ? undefined : endMarkRange,
  };
}

type CodeSelectionContext = CodeMarksContext & {
  language: string | undefined;
  languagePos: [number, number] | undefined;
  codeContent: string | undefined;
};

function pushCodeSelectionDecorations(opts: SelectionDecorationOptions, ctx: CodeSelectionContext) {
  const { view, node, decorations, readonly } = opts;
  const { lines, isOverlapSelection, startMarkRange, endMarkRange, language, languagePos } = ctx;

  if (lines.length > 1) {
    lines.forEach((line) => {
      decorations.push(
        Decoration.line({
          class: CLASSES.code,
        }).range(line.from),
      );
    });
  } else {
    decorations.push(
      Decoration.mark({
        class: clsx(CLASSES.code),
      }).range(node.from, node.to),
    );
  }

  if (
    readonly ||
    !view.hasFocus ||
    (lines.length > 1 && !isOverlapSelection) ||
    (lines.length === 1 && !utils.isInRange(view.state.selection.ranges, [node.from, node.to]))
  ) {
    if (lines.length > 1 && language) {
      if (languagePos && languagePos[0] < languagePos[1]) {
        decorations.push(Decoration.replace({}).range(languagePos[0], languagePos[1]));
      }
      decorations.push(
        Decoration.widget({
          widget: new CodeWidget(language, ctx.codeContent),
          side: 1,
        }).range(node.from),
      );
    }
    if (startMarkRange) decorations.push(Decoration.replace({}).range(...startMarkRange));
    if (endMarkRange) decorations.push(Decoration.replace({}).range(...endMarkRange));
  }
}
