import { type EditorView, WidgetType } from "@codemirror/view";
import { utils } from "@/lib";
import type { GetSelectionDecorationOptions } from "../markdown-types";
import styles from "../styles.module.scss";

const MARK_FULL = "Link";
const CODE_OF_START_TEXT = 91;
const CODE_OF_END_TEXT = 93;
const CODE_OF_START_URL = 40;
const CODE_OF_END_URL = 41;

export function getLinkSelectionDecorations({
  decorations,
  node,
  view,
  isReadonly,
}: GetSelectionDecorationOptions) {
  if (node.name !== MARK_FULL) {
    return;
  }

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

  if (
    isReadonly ||
    !view.hasFocus ||
    !utils.isInRange(view.state.selection.ranges, [node.from, node.to])
  ) {
    decorations.push(
      utils.getReplaceDecoration({
        range: [node.from, node.to],
        widget: new LinkWidget(text, url),
      }),
    );
  }
}

class LinkWidget extends WidgetType {
  view: EditorView | undefined;

  constructor(
    private readonly text: string,
    private readonly link: string,
  ) {
    super();
  }

  handleClick(event: MouseEvent) {
    if (!this.view) return;

    if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey || !this.view.hasFocus) {
      if (event.type === "mousedown") {
        const target = event.target as HTMLAnchorElement;
        window.open(target.href, "_blank");
      }

      return;
    }

    event.stopPropagation();
    event.preventDefault();
    const target = event.target as HTMLAnchorElement;
    const parent = target.parentNode;
    const editor = this.view.dom.querySelector(".cm-content");
    const selection = window.getSelection();

    if (!selection || !editor || !parent) return;
    const targetIndex = Array.from(parent.childNodes).findIndex((element) => element === target);

    const range = document.createRange();
    range.setStart(parent, targetIndex);

    range.collapse(true);

    selection.removeAllRanges();
    selection.addRange(range);

    return false;
  }

  toDOM(view: EditorView): HTMLElement {
    this.view = view;
    const anchor = document.createElement("a");
    anchor.classList.add(styles.link);
    anchor.target = "_blank";
    anchor.textContent = this.text;
    anchor.href = this.link;

    anchor.addEventListener("mousedown", this.handleClick.bind(this));
    anchor.addEventListener("click", this.handleClick.bind(this));

    return anchor;
  }

  destroy(dom: HTMLElement): void {
    dom.removeEventListener("mousedown", this.handleClick.bind(this));
    dom.removeEventListener("click", this.handleClick.bind(this));
  }
}
