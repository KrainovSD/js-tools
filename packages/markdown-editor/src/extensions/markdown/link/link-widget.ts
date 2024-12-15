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
    let startPosition: number = 0;
    if (this.type === "link") startPosition = 3 + this.text.length;
    if (this.type === "auto") startPosition = 1;
    const endPosition = startPosition + this.link.length;

    return endPosition;
  }

  /** check that the text node is correct node */
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

    /** open the link if has special key or the view is readonly */
    const contentEditable = this.view.contentDOM.getAttribute("contenteditable");
    const isReadonly = !contentEditable || contentEditable === "false";
    if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey || isReadonly) {
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
    let line: HTMLElement | null = parent as HTMLElement | null;

    /** recursively find line that contains link */
    while (line && !line.classList.contains("cm-line")) {
      line = line.parentNode as HTMLElement | null;
    }

    const editor = this.view.dom.querySelector(".cm-content");
    const selection = window.getSelection();

    if (!selection || !editor || !parent) return;

    const range = document.createRange();
    range.selectNode(target);
    range.collapse(true);

    selection.removeAllRanges();
    selection.addRange(range);

    /** trick for correct select the link by click when the view is not focused */
    void utils.tick({ delay: 0 }).then(() => {
      if (selection && selection.anchorNode?.nodeType !== 3) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    });

    /** wait for the widget to disappear and link will be visible */
    void utils
      .tick({
        delay: 0,
        maxDeep: 5,
        delayGetter: (deep) => {
          return deep > 1 ? 10 : 5;
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
