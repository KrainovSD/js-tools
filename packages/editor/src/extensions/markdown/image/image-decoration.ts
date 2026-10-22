import { utils } from "@/lib";
import { markdownState } from "../markdown-state";
import type {
  DecorationPlugin,
  GetDecorationOptions,
  GetSelectionDecorationOptions,
} from "../markdown-types";
import { NAME_OF_IMAGE } from "./image-constants";
import { parseImageInfo } from "./image-lib";
import { ImageWidget } from "./image-widget";

function getImageDecorations({ decorations, node, view, settings }: GetDecorationOptions) {
  if (node.name !== NAME_OF_IMAGE) {
    return;
  }

  const { text, url } = parseImageInfo(view, node);
  const uniqueId = view.state.field(markdownState).uniqueId;
  const line = view.lineBlockAt(node.from);
  const fullLine = line.from === node.from && line.to === node.to;

  decorations.push(
    utils.getWidgetDecorationOptions({
      range: [node.to],
      widget: new ImageWidget(text, url, node.from, node.to, uniqueId, fullLine, settings, view),
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

  const { text, url } = parseImageInfo(view, node);
  const openedImage = view.state.field(markdownState).openedImage;
  const uniqueId = view.state.field(markdownState).uniqueId;
  const key = `${url}:${text}:${uniqueId}:${node.from}:${node.to}`;
  const isOpened = openedImage && openedImage === key;

  if (isOpened) {
    return void decorations.push(
      utils.getMarkDecoration({
        range: [node.from, node.to],
        attributes: {
          "data-id": key,
        },
      }),
    );
  }

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

export const imageDecorationPlugin: DecorationPlugin = {
  selectionDecorations: [getImageSelectionDecorations],
  decorations: [getImageDecorations],
};
