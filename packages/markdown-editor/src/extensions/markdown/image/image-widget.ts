import { type EditorView, WidgetType } from "@codemirror/view";
import { utils } from "@/lib";
import styles from "../styles.module.scss";

export class ImageWidget extends WidgetType {
  view: EditorView | undefined;

  constructor(
    private readonly text: string,
    private readonly link: string,
  ) {
    super();
  }

  getTextNode(parent: ChildNode | Node | null | undefined) {
    if (!parent) return null;

    return Array.from(parent.childNodes).find((node) => {
      if (node.nodeType !== 3) return false;

      const textContent = node.textContent;

      return textContent && textContent.includes(this.link);
    });
  }

  getMinLength() {
    const startPosition = 4 + this.text.length;
    const endPosition = startPosition + this.link.length + 1;

    return endPosition;
  }

  isCorrectNode(node: ChildNode | Node | null | undefined): node is ChildNode | Node {
    if (!node) return false;

    const textContent = node?.textContent;
    const minLength = this.getMinLength();

    return Boolean(node && textContent && node.nodeType === 3 && textContent.length >= minLength);
  }

  selectLink(node: ChildNode | Node, selection: Selection, start?: number) {
    const startPosition = start ?? (node.textContent?.indexOf?.(this.link) || 0);
    const endPosition = startPosition + this.link.length;

    const range = document.createRange();
    range.setStart(node, startPosition);
    range.setEnd(node, endPosition);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  handleClick(event: MouseEvent) {
    const selection = window.getSelection();

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
    const prevLine = parent.previousSibling;
    if (this.getTextNode(prevLine)) return;
    if (this.getTextNode(parent)) return;

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
          const textNode = this.getTextNode(parent);

          return this.isCorrectNode(textNode);
        },
      })
      .then(() => {
        const textNode = this.getTextNode(parent);
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
