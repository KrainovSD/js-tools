import { type EditorView } from "@codemirror/view";
import type { SyntaxNodeRef } from "@lezer/common";
import { utils } from "@/lib";
import type { GetSelectionDecorationOptions } from "../markdown-types";
import { ImageWidget } from "./image-widget";

const MARK_FULL = "Image";
const CODE_OF_START_TEXT = 91;
const CODE_OF_END_TEXT = 93;
const CODE_OF_START_URL = 40;
const CODE_OF_END_URL = 41;

export function getImageSelectionDecorations({
  decorations,
  node,
  view,
  isReadonly,
}: GetSelectionDecorationOptions) {
  if (node.name !== MARK_FULL) {
    return;
  }

  const { text, url } = parseInfo(view, node);
  const line = view.lineBlockAt(node.from);

  if (
    isReadonly ||
    !view.hasFocus ||
    !utils.isInRange(view.state.selection.ranges, [node.from, node.to])
  ) {
    decorations.push(
      utils.getReplaceDecoration({
        range: [line.from, line.to],
        widget: new ImageWidget(text, url),
      }),
    );
  } else {
    decorations.push(
      utils.getWidgetDecorationOptions({
        range: [node.to + 1],
        widget: new ImageWidget(text, url),
      }),
    );
  }
}

function parseInfo(view: EditorView, node: SyntaxNodeRef) {
  const content = view.state.doc.sliceString(node.from, node.to);
  const textCoordinates = { from: -1, to: -1 };
  const urlCoordinates = { from: -1, to: -1 };
  let pos = -1;

  while (pos < content.length) {
    pos++;
    const code = content.charCodeAt(pos);

    if (textCoordinates.from === -1 && code === CODE_OF_START_TEXT) textCoordinates.from = pos + 1;
    else if (urlCoordinates.from === -1 && textCoordinates.to !== -1 && code === CODE_OF_START_URL)
      urlCoordinates.from = pos + 1;
    else if (textCoordinates.from !== -1 && textCoordinates.to === -1 && code === CODE_OF_END_TEXT)
      textCoordinates.to = pos;
    else if (urlCoordinates.from !== -1 && urlCoordinates.to === -1 && code === CODE_OF_END_URL)
      urlCoordinates.to = pos;
  }

  const text = content.substring(textCoordinates.from, textCoordinates.to);
  const url = content.substring(urlCoordinates.from, urlCoordinates.to);

  return { text, url };
}
