import { type EditorView, WidgetType } from "@codemirror/view";
import type { SyntaxNodeRef } from "@lezer/common";
import { utils } from "@/lib";
import type { GetSelectionDecorationOptions } from "../markdown-types";
import styles from "../styles.module.scss";

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

class ImageWidget extends WidgetType {
  view: EditorView | undefined;

  constructor(
    private readonly text: string,
    private readonly link: string,
  ) {
    super();
  }

  selectLink(node: ChildNode | Node, selection: Selection) {
    const startPosition = 4 + this.text.length;
    const endPosition = startPosition + this.link.length;

    const range = document.createRange();
    range.setStart(node, startPosition);
    range.setEnd(node, endPosition);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  isCorrectNode(node: ChildNode | Node | null | undefined): node is ChildNode | Node {
    const textContent = node?.textContent;
    const startPosition = 4 + this.text.length;
    const endPosition = startPosition + this.link.length;

    return Boolean(
      node && textContent && node.nodeType === 3 && textContent.length === endPosition + 1,
    );
  }

  handleClick(event: MouseEvent) {
    const selection = window.getSelection();

    const textNode = selection?.anchorNode;
    const startPosition = 4 + this.text.length;
    const endPosition = startPosition + this.link.length;

    if (this.isCorrectNode(textNode)) {
      if (
        selection &&
        (selection.anchorOffset !== startPosition || selection.focusOffset !== endPosition)
      ) {
        this.selectLink(textNode, selection);
      }

      return;
    }

    if (!this.view) return;

    if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) {
      return;
    }

    event.stopPropagation();
    event.preventDefault();
    const target = event.target as HTMLElement;
    const parent = target.parentNode;
    const editor = this.view.dom.querySelector(".cm-content");

    if (!selection || !editor || !parent) return;
    const targetIndex = Array.from(parent.childNodes).findIndex((element) => element === target);

    const range = document.createRange();
    range.setStart(parent, targetIndex);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);

    void utils
      .tick({
        delay: 0,
        maxDeep: 5,
        delayGetter: (deep) => {
          return deep > 1 ? 10 : 0;
        },
        recursiveCondition: () => {
          const textNode = parent.childNodes[0];

          return this.isCorrectNode(textNode);
        },
      })
      .then(() => {
        const textNode = parent.childNodes[0];
        if (this.isCorrectNode(textNode)) this.selectLink(textNode, selection);
      });

    return false;
  }

  toDOM(view: EditorView): HTMLElement {
    this.view = view;
    const image = document.createElement("img");
    image.classList.add(styles.link);
    image.alt = this.text;
    image.src = this.link;

    image.addEventListener("mousedown", this.handleClick.bind(this));
    image.addEventListener("click", this.handleClick.bind(this));

    return image;
  }

  destroy(dom: HTMLElement): void {
    dom.removeEventListener("mousedown", this.handleClick.bind(this));
    dom.removeEventListener("click", this.handleClick.bind(this));
  }
}

function parseInfo(view: EditorView, node: SyntaxNodeRef) {
  const content = view.state.doc.sliceString(node.from, node.to);
  const textCoordinates = { from: 0, to: 0 };
  const urlCoordinates = { from: 0, to: 0 };
  let pos = -1;

  while (pos < content.length) {
    pos++;
    const code = content.charCodeAt(pos);

    if (textCoordinates.from === 0 && code === CODE_OF_START_TEXT) textCoordinates.from = pos + 1;
    else if (urlCoordinates.from === 0 && textCoordinates.to !== 0 && code === CODE_OF_START_URL)
      urlCoordinates.from = pos + 1;
    else if (textCoordinates.from !== 0 && textCoordinates.to === 0 && code === CODE_OF_END_TEXT)
      textCoordinates.to = pos;
    else if (urlCoordinates.from !== 0 && urlCoordinates.to === 0 && code === CODE_OF_END_URL)
      urlCoordinates.to = pos;
  }

  const text = content.substring(textCoordinates.from, textCoordinates.to);
  const url = content.substring(urlCoordinates.from, urlCoordinates.to);

  return { text, url };
}
