import { type EditorView } from "@codemirror/view";
import type { SyntaxNodeRef } from "@lezer/common";
import { utils } from "@/lib";
import { markdownState } from "../markdown-state";
import type {
  DecorationPlugin,
  GetDecorationOptions,
  GetSelectionDecorationOptions,
} from "../markdown-types";
import {
  CODE_OF_END_IMAGE_TEXT,
  CODE_OF_END_IMAGE_URL,
  CODE_OF_START_IMAGE_TEXT,
  CODE_OF_START_IMAGE_URL,
  NAME_OF_IMAGE,
} from "./image-constants";
import { ImageWidget } from "./image-widget";

function getImageDecorations({ decorations, node, view }: GetDecorationOptions) {
  if (node.name !== NAME_OF_IMAGE) {
    return;
  }

  const { text, url } = parseInfo(view, node);
  const imageSrcGetter = view.state.field(markdownState).imageSrcGetter;

  decorations.push(
    utils.getWidgetDecorationOptions({
      range: [node.to],
      widget: new ImageWidget(text, url, node.from, node.to, imageSrcGetter),
    }),
  );
}

function getImageSelectionDecorations({
  decorations,
  node,
  view,
  forceActive,
}: GetSelectionDecorationOptions) {
  if (node.name !== NAME_OF_IMAGE) {
    return;
  }

  const { text, url } = parseInfo(view, node);
  const openedImage = view.state.field(markdownState).openedImage;
  const key = `${url}:${text}:${node.from}:${node.to}`;
  const isOpened = openedImage && openedImage === key;

  if (isOpened) return;

  if (
    forceActive ||
    !view.hasFocus ||
    !utils.isInRange(view.state.selection.ranges, [node.from, node.to])
  ) {
    decorations.push(utils.getHideDecoration({ range: [node.from, node.to] }));
  } else {
    decorations.push(
      utils.getMarkDecoration({
        range: [node.from, node.to],
        attributes: {
          "data-id": key,
        },
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

    if (textCoordinates.from === -1 && code === CODE_OF_START_IMAGE_TEXT)
      textCoordinates.from = pos + 1;
    else if (
      urlCoordinates.from === -1 &&
      textCoordinates.to !== -1 &&
      code === CODE_OF_START_IMAGE_URL
    )
      urlCoordinates.from = pos + 1;
    else if (
      textCoordinates.from !== -1 &&
      textCoordinates.to === -1 &&
      code === CODE_OF_END_IMAGE_TEXT
    )
      textCoordinates.to = pos;
    else if (
      urlCoordinates.from !== -1 &&
      urlCoordinates.to === -1 &&
      code === CODE_OF_END_IMAGE_URL
    )
      urlCoordinates.to = pos;
  }

  const text = content.substring(textCoordinates.from, textCoordinates.to);
  const url = content.substring(urlCoordinates.from, urlCoordinates.to);

  return { text, url };
}

export const imageDecorationPlugin: DecorationPlugin = {
  selectionDecorations: [getImageSelectionDecorations],
  decorations: [getImageDecorations],
};
