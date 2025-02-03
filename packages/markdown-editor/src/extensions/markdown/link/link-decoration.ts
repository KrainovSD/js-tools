import { utils } from "@/lib";
import { markdownState } from "../markdown-state";
import type { DecorationPlugin, GetSelectionDecorationOptions } from "../markdown-types";
import {
  CODE_OF_END_LINK_TEXT,
  CODE_OF_END_LINK_URL,
  CODE_OF_START_LINK_TEXT,
  CODE_OF_START_LINK_URL,
  NAME_OF_LINK,
} from "./link-constants";
import { getLinkLabelSelectionDecoration } from "./link-label-decoration";
import { LinkWidget } from "./link-widget";

function getLinkSelectionDecorations({
  decorations,
  node,
  view,
  forceActive,
  settings,
}: GetSelectionDecorationOptions) {
  if (node.name !== NAME_OF_LINK) {
    return;
  }

  const content = view.state.doc.sliceString(node.from, node.to);
  const textCoordinates = { from: -1, to: -1 };
  const urlCoordinates = { from: -1, to: -1 };
  let pos = -1;

  while (pos < content.length) {
    pos++;
    const code = content.charCodeAt(pos);

    if (textCoordinates.from === -1 && code === CODE_OF_START_LINK_TEXT)
      textCoordinates.from = pos + 1;
    else if (
      urlCoordinates.from === -1 &&
      textCoordinates.to !== -1 &&
      code === CODE_OF_START_LINK_URL
    )
      urlCoordinates.from = pos + 1;
    else if (
      textCoordinates.from !== -1 &&
      textCoordinates.to === -1 &&
      code === CODE_OF_END_LINK_TEXT
    )
      textCoordinates.to = pos;
    else if (
      urlCoordinates.from !== -1 &&
      urlCoordinates.to === -1 &&
      code === CODE_OF_END_LINK_URL
    )
      urlCoordinates.to = pos;
  }

  if (urlCoordinates.from === -1 || urlCoordinates.to === -1)
    return void getLinkLabelSelectionDecoration({ decorations, forceActive, node, view, settings });

  const text = content.substring(textCoordinates.from, textCoordinates.to);
  const url = content.substring(urlCoordinates.from, urlCoordinates.to);

  const openedLink = view.state.field(markdownState).openedLink;
  const uniqueId = view.state.field(markdownState).uniqueId;
  const key = `${url}:${text}:${uniqueId}:${node.from}:${node.to}`;
  const isOpened = openedLink && openedLink === key;

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
    decorations.push(
      utils.getReplaceDecoration({
        range: [node.from, node.to],
        widget: new LinkWidget(text, url, node.from, node.to, uniqueId, view),
      }),
    );
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

export const linkDecorationPlugin: DecorationPlugin = {
  selectionDecorations: [getLinkSelectionDecorations],
};
