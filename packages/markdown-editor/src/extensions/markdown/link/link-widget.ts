import { type EditorView, WidgetType } from "@codemirror/view";
import { CLASSES } from "@/extensions/theme";
import { utils } from "@/lib";
import styles from "../styles.module.scss";

export class LinkWidget extends WidgetType {
  view: EditorView | undefined;

  constructor(
    private readonly text: string,
    private readonly link: string,
    private readonly type: "link" | "auto",
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
    let startPosition: number = 0;
    if (this.type === "link") startPosition = 3 + this.text.length;
    if (this.type === "auto") startPosition = 1;
    const endPosition = startPosition + this.link.length;

    return endPosition;
  }

  isCorrectNode(node: ChildNode | Node | null | undefined): node is ChildNode | Node {
    if (!node) return false;

    const textContent = node.textContent;
    const minLength = this.getMinLength();

    return Boolean(textContent && node.nodeType === 3 && textContent.length >= minLength);
  }

  selectLink(node: ChildNode | Node, selection: Selection) {
    const startPosition = node.textContent?.indexOf?.(this.link) || 0;
    const endPosition = startPosition + this.link.length;

    const range = document.createRange();
    range.setStart(node, startPosition);
    range.setEnd(node, endPosition);
    selection.removeAllRanges();
    selection.addRange(range);
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
    const anchor = document.createElement("a");
    anchor.classList.add(styles.link);
    anchor.classList.add(CLASSES.link);

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
