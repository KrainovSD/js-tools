import { type EditorView, WidgetType } from "@codemirror/view";
import { utils } from "@/lib";
import styles from "../styles.module.scss";

const INTERVAL_DELAY = 10000;
const IMAGE_NODES: Record<string, HTMLImageElement> = {};
const EXISTING_WIDGETS: Set<string> = new Set();
let interval: NodeJS.Timeout | null = null;

export class ImageWidget extends WidgetType {
  view: EditorView | undefined;

  constructor(
    private text: string,
    private link: string,
    private from: number,
    private to: number,
  ) {
    super();
  }

  get key() {
    return `${this.link}:${this.text}:${this.from}:${this.to}`;
  }

  eq(widget: ImageWidget): boolean {
    const image = IMAGE_NODES[this.key];

    delete IMAGE_NODES[this.key];
    EXISTING_WIDGETS.delete(this.key);

    if (image.src !== widget.link) image.src = widget.link;
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

    if (IMAGE_NODES[this.key]) {
      const image = IMAGE_NODES[this.key];
      if (image.src !== this.link) {
        image.src = this.link;
      }
      if (image.alt !== this.text) image.alt = this.text;

      return image;
    }

    this.view = view;
    const image = document.createElement("img");
    image.classList.add(styles.image);
    image.alt = this.text;
    image.src = this.link;

    image.addEventListener("mousedown", handleClick);
    image.addEventListener("click", handleClick);

    IMAGE_NODES[this.key] = image;

    if (!interval) interval = setInterval(garbageCollectorInterval, INTERVAL_DELAY);

    return image;
  }

  destroy(): void {
    EXISTING_WIDGETS.delete(this.key);
  }
}

function garbageCollectorInterval() {
  for (const [key, node] of Object.entries(IMAGE_NODES)) {
    if (EXISTING_WIDGETS.has(key)) continue;

    delete IMAGE_NODES[key];
    node.removeEventListener("mousedown", handleClick);
    node.removeEventListener("click", handleClick);
    node.remove();
  }

  if (Object.keys(IMAGE_NODES).length === 0 && interval) {
    clearInterval(interval);
    interval = null;
  }
}

/** recursively find the link text node in line */
function getTextNode(
  imageNode: HTMLImageElement,
  line: ChildNode | Node | null | undefined,
): ChildNode | null {
  if (!line) return null;
  const link = imageNode.src;
  let textNode: ChildNode | null = null;

  for (const node of Array.from(line.childNodes)) {
    if (node.nodeType !== 3) {
      const innerNode = getTextNode(imageNode, node);
      if (innerNode) {
        textNode = innerNode;
        break;
      }

      continue;
    }

    const textContent = node.textContent;
    if (textContent && textContent.includes(link)) {
      textNode = node;
      break;
    }
  }

  return textNode;
}

function getMinLength(imageNode: HTMLImageElement) {
  const text = imageNode.alt || "";
  const link = imageNode.src;

  const startPosition = 4 + text.length;
  const endPosition = startPosition + link.length + 1;

  return endPosition;
}

function isCorrectNode(
  imageNode: HTMLImageElement,
  node: ChildNode | Node | null | undefined,
): node is ChildNode | Node {
  if (!node) return false;

  const textContent = node?.textContent;
  const minLength = getMinLength(imageNode);

  return Boolean(node && textContent && node.nodeType === 3 && textContent.length >= minLength);
}

type SelectLinkOptions = {
  node: ChildNode | Node;
  selection: Selection;
  start?: number;
  imageNode: HTMLImageElement;
};
function selectLink({ imageNode, node, selection, start }: SelectLinkOptions) {
  const link = imageNode.src;
  const startPosition = start ?? (node.textContent?.indexOf?.(link) || 0);
  const endPosition = startPosition + link.length;

  const range = document.createRange();
  range.setStart(node, startPosition);
  range.setEnd(node, endPosition);
  selection.removeAllRanges();
  selection.addRange(range);
}

function handleClick(event: MouseEvent) {
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

  const prevLine = parent.previousSibling;
  let textNode = getTextNode(target, prevLine);
  if (!textNode) textNode = getTextNode(target, parent);
  if (textNode) {
    if (isCorrectNode(target, textNode))
      selectLink({ selection, imageNode: target, node: textNode });

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
        const textNode = getTextNode(target, line);

        return isCorrectNode(target, textNode);
      },
    })
    .then(() => {
      const textNode = getTextNode(target, line);
      if (isCorrectNode(target, textNode))
        selectLink({ selection, imageNode: target, node: textNode });
    });

  return false;
}
