import { foldedRanges, syntaxTree } from "@codemirror/language";
import type { EditorState, Line } from "@codemirror/state";
import type { SyntaxNode } from "@lezer/common";
import type { DocRange } from "@/module";
import {
  CODE_OF_DIGIT_END,
  CODE_OF_DIGIT_START,
  NAME_OF_HEADER,
  NAME_OF_HEADER_UNDER,
} from "../markdown-model";

export function isHeadingNodeName(name: string): boolean {
  return hasLevelSuffix(name, NAME_OF_HEADER) || hasLevelSuffix(name, NAME_OF_HEADER_UNDER);
}

function hasLevelSuffix(name: string, prefix: string): boolean {
  if (!name.startsWith(prefix)) return false;
  const code = name.charCodeAt(prefix.length);
  return code >= CODE_OF_DIGIT_START && code <= CODE_OF_DIGIT_END;
}

export function getHeadingAnchorLine(state: EditorState, pos: number): Line | undefined {
  let node: SyntaxNode | null = syntaxTree(state).resolveInner(pos, 1);
  while (node && !isHeadingNodeName(node.name)) {
    node = node.parent;
  }
  return node ? state.doc.lineAt(node.from) : undefined;
}

export function isFoldedFrom(state: EditorState, foldFrom: number): boolean {
  let folded = false;
  foldedRanges(state).between(foldFrom, foldFrom + 1, (from) => {
    if (from === foldFrom) {
      folded = true;
      return false;
    }
  });
  return folded;
}

export function NewFoldCoverage(state: EditorState): (from: number, to: number) => boolean {
  const folds: DocRange[] = [];
  const iter = foldedRanges(state).iter();
  while (iter.value) {
    folds.push({ from: iter.from, to: iter.to });
    iter.next();
  }
  let cursor = 0;
  return (from, to) => {
    while (cursor < folds.length && folds[cursor].to < from) cursor++;
    const fold = folds[cursor];
    return fold !== undefined && fold.from <= from && fold.to >= to;
  };
}
