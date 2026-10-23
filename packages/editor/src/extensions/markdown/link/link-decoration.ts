import { Decoration } from "@codemirror/view";
import { utils } from "@/lib";
import type { SelectionDecorationOptions } from "../markdown-model";
import { MarkdownState } from "../markdown-state";
import styles from "../styles.module.scss";
import {
  CODE_OF_END_LINK_TEXT,
  CODE_OF_END_LINK_URL,
  CODE_OF_LINK_LABEL_END,
  CODE_OF_START_LINK_TEXT,
  CODE_OF_START_LINK_URL,
} from "./link-model";
import { LinkWidget } from "./link-widget";

export function fillLinkSelectionDecorations(opts: SelectionDecorationOptions) {
  const { view, node, decorations, readonly } = opts;
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
  if (urlCoordinates.from === -1 || urlCoordinates.to === -1) {
    return void fillLinkLabelSelectionDecorations(opts);
  }

  const text = content.substring(textCoordinates.from, textCoordinates.to);
  const url = content.substring(urlCoordinates.from, urlCoordinates.to);
  const uniqueId = view.state.field(MarkdownState).uniqueId;

  if (
    readonly ||
    !view.hasFocus ||
    !utils.isInRange(view.state.selection.ranges, [node.from, node.to])
  ) {
    decorations.push(
      Decoration.replace({
        widget: new LinkWidget(text, url, node.from, node.to, uniqueId, view, false),
      }).range(node.from, node.to),
    );
  }
}

export function fillShortLinkSelectionDecorations(opts: SelectionDecorationOptions) {
  const { view, node, decorations, readonly } = opts;
  const text = view.state.doc.sliceString(node.from + 2, node.to - 2);
  const url = text;
  const uniqueId = view.state.field(MarkdownState).uniqueId;

  if (
    readonly ||
    !view.hasFocus ||
    !utils.isInRange(view.state.selection.ranges, [node.from, node.to])
  ) {
    decorations.push(
      Decoration.replace({
        widget: new LinkWidget(text, url, node.from, node.to, uniqueId, view, true),
      }).range(node.from, node.to),
    );
  }
}

function fillLinkLabelSelectionDecorations(opts: SelectionDecorationOptions) {
  const { view, node, decorations, readonly } = opts;
  if (view.state.doc.sliceString(node.to, node.to + 1).charCodeAt(0) !== CODE_OF_LINK_LABEL_END)
    return;

  if (
    readonly ||
    !view.hasFocus ||
    !utils.isInRange(view.state.selection.ranges, [node.from, node.to + 1])
  ) {
    decorations.push(
      Decoration.mark({
        class: styles.link__label,
      }).range(node.from, node.to + 1),
    );
    decorations.push(Decoration.replace({}).range(node.from, node.from + 1));
    decorations.push(Decoration.replace({}).range(node.to - 1, node.to + 1));
  }
}
