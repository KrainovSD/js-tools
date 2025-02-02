import { type EditorView, WidgetType } from "@codemirror/view";
import { saveDispatch } from "@/lib/utils";
import { openedImageEffect } from "../markdown-state";
import styles from "../styles.module.scss";

const INTERVAL_DELAY = 10000;
const IMAGE_NODES: Record<string, ImageElement | undefined> = {};
const EXISTING_WIDGETS: Set<string> = new Set();
let interval: NodeJS.Timeout | null = null;

interface ImageElement extends HTMLImageElement {
  clearListeners?: () => void;
  destroy?: () => void;
}

export class ImageWidget extends WidgetType {
  constructor(
    private text: string,
    private link: string,
    private from: number,
    private to: number,
    private imageSrcGetter: ((src: string) => string) | undefined,
    private view: EditorView,
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

    this.registerListeners(image);
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

    this.registerListeners(image);
    IMAGE_NODES[this.key] = image;

    if (!interval) interval = setInterval(garbageCollectorInterval, INTERVAL_DELAY);

    return image;
  }

  destroy(): void {
    EXISTING_WIDGETS.delete(this.key);
  }

  registerListeners(image: ImageElement) {
    image.clearListeners?.();
    const abortController = new AbortController();
    image.addEventListener(
      "mousedown",
      (event) => handleClick(this.view, this.text, this.link, this.key, event),
      { signal: abortController.signal },
    );
    image.clearListeners = () => {
      abortController.abort();
    };
    image.destroy = () => {
      image.clearListeners?.();
      image.remove();
    };
  }
}

function garbageCollectorInterval() {
  for (const [key, node] of Object.entries(IMAGE_NODES)) {
    if (EXISTING_WIDGETS.has(key) || !node) continue;

    delete IMAGE_NODES[key];
    node.destroy?.();
  }

  if (Object.keys(IMAGE_NODES).length === 0 && interval) {
    clearInterval(interval);
    interval = null;
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

function handleClick(
  view: EditorView | undefined,
  text: string,
  link: string,
  key: string,
  event: MouseEvent,
) {
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

  const textNode = getTextNode(text, link, key, line);

  if (textNode) {
    return void selectLink({ selection, link, node: textNode });
  }

  saveDispatch(() => {
    if (!view) return;
    view.dispatch(view.state.update({ effects: openedImageEffect.of(key) }));

    const textNode = getTextNode(text, link, key, line);
    if (textNode) {
      selectLink({ selection, link, node: textNode });
    }

    requestAnimationFrame(() => {
      saveDispatch(() => {
        if (view) view.dispatch(view.state.update({ effects: openedImageEffect.of(undefined) }));
      });
    });
  });

  return false;
}
