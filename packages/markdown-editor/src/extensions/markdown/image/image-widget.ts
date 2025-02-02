import { type EditorView, WidgetType } from "@codemirror/view";
import { saveDispatch } from "@/lib/utils";
import { openedImageEffect } from "../markdown-state";
import styles from "../styles.module.scss";

const INTERVAL_DELAY = 10000;
const IMAGE_NODES: Record<string, ImageElement | undefined> = {};
const EXISTING_WIDGETS: Set<string> = new Set();
let interval: NodeJS.Timeout | null = null;

interface ImageElement extends HTMLImageElement {
  destroy?: () => void;
}

export class ImageWidget extends WidgetType {
  view: EditorView | undefined;

  constructor(
    private text: string,
    private link: string,
    private from: number,
    private to: number,
    private imageSrcGetter: ((src: string) => string) | undefined,
  ) {
    super();
  }

  get key() {
    return `${this.link}:${this.text}:${this.from}:${this.to}`;
  }

  get src() {
    return this.imageSrcGetter ? this.imageSrcGetter(this.link) : this.link;
  }

  eq(widget: ImageWidget): boolean {
    const image = IMAGE_NODES[this.key];

    if (!image) return false;

    delete IMAGE_NODES[this.key];
    EXISTING_WIDGETS.delete(this.key);

    if (image.src !== widget.src) image.src = widget.src;
    if (image.alt !== widget.text) image.alt = widget.text;

    this.link = widget.link;
    this.text = widget.text;
    this.from = widget.from;
    this.to = widget.to;

    IMAGE_NODES[this.key] = image;
    EXISTING_WIDGETS.add(this.key);

    return true;
  }

  updateDOM(): boolean {
    return true;
  }

  toDOM(view: EditorView): HTMLElement {
    EXISTING_WIDGETS.add(this.key);

    let image = IMAGE_NODES[this.key];
    if (image) {
      if (image.src !== this.src) {
        image.src = this.src;
      }
      if (image.alt !== this.text) image.alt = this.text;

      return image;
    }

    this.view = view;
    image = document.createElement("img");
    image.classList.add(styles.image);
    image.alt = this.text;
    image.src = this.src;
    image.style.maxWidth = "100%";

    image.addEventListener("mousedown", this.handleClick.bind(this));

    IMAGE_NODES[this.key] = image;

    if (!interval) interval = setInterval(this.garbageCollectorInterval.bind(this), INTERVAL_DELAY);

    return image;
  }

  destroy(): void {
    EXISTING_WIDGETS.delete(this.key);
  }

  handleClick(this: ImageWidget, event: MouseEvent) {
    const selection = window.getSelection();

    if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) {
      return;
    }

    event.stopPropagation();
    event.preventDefault();
    const target = event.target as HTMLImageElement;
    const parent = target.parentNode;
    let line: HTMLElement | null = parent as HTMLElement | null;

    /** recursively find line that contains link */
    while (line && !line.classList.contains("cm-line")) {
      line = line.parentNode as HTMLElement | null;
    }

    const editor = Array.from(document.querySelectorAll(".cm-editor")).find((element) =>
      element.contains(target),
    );

    if (!selection || !editor || !parent) return;

    const textNode = getTextNode(this.text, this.link, this.key, line);

    if (textNode) {
      return void selectLink({ selection, link: this.link, node: textNode });
    }

    saveDispatch(() => {
      if (!this.view) return;

      this.view.dispatch(this.view.state.update({ effects: openedImageEffect.of(this.key) }));

      const textNode = getTextNode(this.text, this.link, this.key, line);
      if (textNode) {
        selectLink({ selection, link: this.link, node: textNode });
      }

      requestAnimationFrame(() => {
        saveDispatch(() => {
          if (this.view)
            this.view.dispatch(
              this.view.state.update({ effects: openedImageEffect.of(undefined) }),
            );
        });
      });
    });

    return false;
  }

  garbageCollectorInterval(this: ImageWidget) {
    for (const [key, node] of Object.entries(IMAGE_NODES)) {
      if (EXISTING_WIDGETS.has(key) || !node) continue;

      delete IMAGE_NODES[key];
      node.removeEventListener("mousedown", this.handleClick.bind(this));
      node.remove();
    }

    if (Object.keys(IMAGE_NODES).length === 0 && interval) {
      clearInterval(interval);
      interval = null;
    }
  }
}

/** recursively find the link text node in line */
function getTextNode(
  text: string,
  link: string,
  key: string,
  line: ChildNode | Node | null | undefined,
): ChildNode | null {
  if (!line) return null;
  let textNode: ChildNode | null = null;

  for (const node of Array.from(line.childNodes)) {
    if (node.nodeType !== 3 && node instanceof HTMLElement) {
      const innerNode = getTextNode(text, link, key, node);
      if (innerNode && node.getAttribute("data-id") === key) {
        textNode = innerNode;
        break;
      }

      continue;
    }

    if (isCorrectNode(text, link, node)) {
      textNode = node;
      break;
    }
  }

  return textNode;
}

function isCorrectNode(
  text: string,
  link: string,
  node: ChildNode | Node | null | undefined,
): node is ChildNode | Node {
  if (!node) return false;

  const textContent = node?.textContent;

  return Boolean(
    node &&
      textContent &&
      node.nodeType === 3 &&
      textContent.includes(link) &&
      textContent.includes(text),
  );
}

type SelectLinkOptions = {
  node: ChildNode | Node;
  selection: Selection;
  start?: number;
  link: string;
};
function selectLink({ link, node, selection, start }: SelectLinkOptions) {
  const startPosition = start ?? (node.textContent?.indexOf?.(link) || 0);
  const endPosition = startPosition + link.length;

  const range = document.createRange();
  range.setStart(node, startPosition);
  range.setEnd(node, endPosition);
  selection.removeAllRanges();
  selection.addRange(range);
}
