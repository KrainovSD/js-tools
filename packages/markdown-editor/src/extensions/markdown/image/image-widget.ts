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

  /** recursively find the link text node in line */
  getTextNode(line: ChildNode | Node | null | undefined): ChildNode | null {
    if (!line) return null;

    let textNode: ChildNode | null = null;

    for (const node of Array.from(line.childNodes)) {
      if (node.nodeType !== 3) {
        const innerNode = this.getTextNode(node);
        if (innerNode) {
          textNode = innerNode;
          break;
        }

        continue;
      }

      const textContent = node.textContent;
      if (textContent && textContent.includes(this.link)) {
        textNode = node;
        break;
      }
    }

    return textNode;
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
    let line: HTMLElement | null = parent as HTMLElement | null;

    /** recursively find line that contains link */
    while (line && !line.classList.contains("cm-line")) {
      line = line.parentNode as HTMLElement | null;
    }

    const editor = this.view.dom.querySelector(".cm-content");

    if (!selection || !editor || !parent) return;

    const prevLine = parent.previousSibling;
    let textNode = this.getTextNode(prevLine);
    if (!textNode) textNode = this.getTextNode(parent);
    if (textNode) {
      if (this.isCorrectNode(textNode)) this.selectLink(textNode, selection);

      return;
    }

    const range = document.createRange();
    range.selectNode(target);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);

    /** wait for the widget to disappear and link will be visible */
    void utils
      .tick({
        delay: 0,
        maxDeep: 5,
        delayGetter: (deep) => {
          return deep > 1 ? 10 : 0;
        },
        recursiveCondition: () => {
          const textNode = this.getTextNode(line);

          return this.isCorrectNode(textNode);
        },
      })
      .then(() => {
        const textNode = this.getTextNode(line);
        if (this.isCorrectNode(textNode)) this.selectLink(textNode, selection);
      });

    return false;
  }

  toDOM(view: EditorView): HTMLElement {
    this.view = view;
    const image = document.createElement("img");
    image.classList.add(styles.image);
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
