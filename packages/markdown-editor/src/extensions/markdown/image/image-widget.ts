/* eslint-disable max-params */
import { type EditorView, WidgetType } from "@codemirror/view";
import { saveDispatch } from "@/lib/utils";
import { openedImageEffect } from "../markdown-state";
import styles from "../styles.module.scss";
import { CODE_OF_START_IMAGE_URL } from "./image-constants";

const IMAGE_NODES: Record<string, ImageContainerElement | undefined> = {};
const INTERVAL_DELAY = 10000;
const EXISTING_WIDGETS = new Set<string>();
let interval: NodeJS.Timeout | null = null;
interface ImageContainerElement extends HTMLSpanElement {
  clearListeners?: () => void;
  destroy?: () => void;
  image?: HTMLImageElement;
}

export class ImageWidget extends WidgetType {
  constructor(
    private text: string,
    private link: string,
    private from: number,
    private to: number,
    private uniqueId: string,
    private fullLine: boolean,
    private imageSrcGetter: ((src: string) => string) | undefined,
    private view: EditorView,
  ) {
    super();
  }

  get key() {
    return `${this.link}:${this.text}:${this.uniqueId}:${this.from}:${this.to}`;
  }

  get src() {
    return this.imageSrcGetter ? this.imageSrcGetter(this.link) : this.link;
  }

  eq(widget: ImageWidget): boolean {
    const container = IMAGE_NODES[this.key];
    const image = container?.image;

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
    IMAGE_NODES[this.key] = container;
    EXISTING_WIDGETS.add(this.key);

    return true;
  }

  updateDOM(): boolean {
    return true;
  }

  toDOM(): HTMLElement {
    EXISTING_WIDGETS.add(this.key);
    let container = IMAGE_NODES[this.key];
    let image = container?.image;

    if (image && container) {
      if (image.src !== this.src) {
        image.src = this.src;
      }
      if (image.alt !== this.text) image.alt = this.text;

      return container;
    }

    image = document.createElement("img");
    image.classList.add(styles.image);
    image.alt = this.text;
    image.src = this.src;
    image.style.maxWidth = "100%";

    container = document.createElement("span") as ImageContainerElement;
    container.appendChild(image);
    container.image = image;
    if (this.fullLine) {
      container.style.width = "100%";
      container.style.display = "inline-block";
    }

    this.registerListeners(container);
    IMAGE_NODES[this.key] = container;

    if (!interval) interval = setInterval(garbageCollectorInterval, INTERVAL_DELAY);

    return container;
  }

  destroy(): void {
    EXISTING_WIDGETS.delete(this.key);
  }

  registerListeners(image: ImageContainerElement) {
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

/** for disable cache */
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
  const textNodeContainer = getTextNodeContainer(text, link, key, line);
  if (!textNodeContainer) return null;

  for (const node of Array.from(textNodeContainer.childNodes)) {
    if (isCorrectNode(text, link, node)) {
      return node;
    }
  }

  return null;
}

function getTextNodeContainer(
  text: string,
  link: string,
  key: string,
  line: ChildNode | Node | null | undefined,
): HTMLElement | null {
  if (!line) return null;

  for (const node of Array.from(line.childNodes)) {
    if (node instanceof HTMLElement && node.getAttribute("data-id") === key) {
      return node;
    }

    if (node.nodeType !== 3) {
      const inner = getTextNodeContainer(text, link, key, node);
      if (inner) return inner;
    }
  }

  return null;
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
  const startPosition = start ?? node.textContent?.indexOf?.(link) ?? 0;
  const endPosition = startPosition + link.length;

  if (startPosition === 0 && endPosition === 0) {
    const content = node.textContent;
    if (!content) return;
    let startPosition = 0;
    let pos = 0;

    while (pos < content.length) {
      if (content.codePointAt(pos) !== CODE_OF_START_IMAGE_URL) {
        pos++;
      } else {
        startPosition = pos + 1;
        break;
      }
    }

    const range = document.createRange();
    range.setStart(node, startPosition);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);

    return;
  }

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
