import { Decoration } from "@codemirror/view";
import type { SyntaxNode, SyntaxNodeRef } from "@lezer/common";
import { utils } from "@/lib";
import { CLASSES } from "../classes-constants";
import {
  type ContentDecorationOptions,
  NAME_OF_FOOTNOTE_DEFINITION,
  type SelectionDecorationOptions,
} from "../markdown-model";

function findFootnoteDefinition(node: SyntaxNodeRef): SyntaxNode | null {
  let parent = node.node.parent;
  while (parent) {
    if (parent.name === NAME_OF_FOOTNOTE_DEFINITION) return parent;
    parent = parent.parent;
  }
  return null;
}

function isDefinitionLabel(node: SyntaxNodeRef): boolean {
  const definition = findFootnoteDefinition(node);
  return definition !== null && definition.from === node.from;
}

export function fillFootnoteRefContentDecorations(opts: ContentDecorationOptions) {
  const { node, decorations } = opts;
  decorations.push(
    Decoration.mark({
      class: isDefinitionLabel(node) ? CLASSES.footnoteLabel : CLASSES.footnoteRef,
    }).range(node.from, node.to),
  );
}

export function fillFootnoteRefSelectionDecorations(opts: SelectionDecorationOptions) {
  const { view, node, decorations, readonly } = opts;
  if (
    readonly ||
    !view.hasFocus ||
    !utils.isInRange(view.state.selection.ranges, [node.from, node.to])
  ) {
    decorations.push(Decoration.replace({}).range(node.from, node.from + 2));
    decorations.push(Decoration.replace({}).range(node.to - 1, node.to));
  }
}

export function fillFootnoteDefinitionContentDecorations(opts: ContentDecorationOptions) {
  const { view, node, decorations } = opts;
  const lines = view.viewportLineBlocks.filter((line) =>
    utils.isRangeOverlap([node.from, node.to], [line.from, line.to]),
  );
  lines.forEach((line) => {
    decorations.push(
      Decoration.line({
        class: CLASSES.footnoteDefinition,
      }).range(line.from),
    );
  });
}
