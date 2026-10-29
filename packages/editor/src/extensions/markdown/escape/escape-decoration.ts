import { Decoration } from "@codemirror/view";
import { utils } from "@/lib";
import { CLASSES } from "../classes-constants";
import {
  type ContentDecorationOptions,
  NAME_OF_AUTO_LINK,
  NAME_OF_IMAGE,
  NAME_OF_LINK,
  NAME_OF_SHORT_LINK,
  type SelectionDecorationOptions,
} from "../markdown-model";

const LINK_LIKE_PARENTS = new Set([
  NAME_OF_LINK,
  NAME_OF_IMAGE,
  NAME_OF_AUTO_LINK,
  NAME_OF_SHORT_LINK,
]);

export function fillEscapeContentDecorations(opts: ContentDecorationOptions) {
  opts.decorations.push(
    Decoration.mark({
      class: CLASSES.escape,
    }).range(opts.node.from, opts.node.from + 1),
  );
}

export function fillEscapeSelectionDecorations(opts: SelectionDecorationOptions) {
  const { view, node, decorations, readonly } = opts;
  if (LINK_LIKE_PARENTS.has(node.node.parent?.name ?? "")) return;
  if (
    readonly ||
    !view.hasFocus ||
    !utils.isInRange(view.state.selection.ranges, [node.from, node.to])
  ) {
    decorations.push(Decoration.replace({}).range(node.from, node.from + 1));
  }
}
