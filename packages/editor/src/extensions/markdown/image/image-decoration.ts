import { Decoration } from "@codemirror/view";
import { utils } from "@/lib";
import type { ContentDecorationOptions, SelectionDecorationOptions } from "../markdown-model";
import { MarkdownState } from "../markdown-state";
import { ImageWidget } from "./image-widget";

export function fillImageContentDecorations(opts: ContentDecorationOptions) {
  const { view, node, decorations, settings } = opts;
  const mstate = view.state.field(MarkdownState);
  const image = mstate.getImageAt(view.state, node.from);
  if (!image) return;
  const line = view.lineBlockAt(node.from);
  const fullLine = line.from === node.from && line.to === node.to;
  decorations.push(
    Decoration.widget({
      widget: new ImageWidget(
        image.text,
        image.url,
        node.from,
        node.to,
        mstate.uniqueId,
        fullLine,
        settings,
        view,
      ),
      side: 1,
    }).range(node.to),
  );
}

export function fillImageSelectionDecorations(opts: SelectionDecorationOptions) {
  const { view, node, decorations, readonly } = opts;
  if (
    readonly ||
    !view.hasFocus ||
    !utils.isInRange(view.state.selection.ranges, [node.from, node.to])
  ) {
    decorations.push(Decoration.replace({}).range(node.from, node.to));
  }
}
