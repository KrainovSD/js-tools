import { type EditorView, WidgetType } from "@codemirror/view";
import { CLASSES } from "@/extensions/theme";
import { saveDispatch } from "@/lib/utils";
import { openedLinkEffect } from "../markdown-state";
import styles from "../styles.module.scss";
import { CODE_OF_START_LINK_URL } from "./link-constants";

const LINK_NODES: Record<string, AnchorElement | undefined> = {};

interface AnchorElement extends HTMLAnchorElement {
  clearListeners?: () => void;
  destroy?: () => void;
}
export class LinkWidget extends WidgetType {
  constructor(
    private text: string,
    private link: string,
    private from: number,
    private to: number,
    private uniqueId: string,
    private view: EditorView,
  ) {
    super();
  }

  get key() {
    return `${this.link}:${this.text}:${this.uniqueId}:${this.from}:${this.to}`;
  }

  eq(widget: LinkWidget): boolean {
    const anchor = LINK_NODES[this.key];
    if (!anchor) return false;
    delete LINK_NODES[this.key];

    if (anchor.href !== widget.link) anchor.href = widget.link;
    if (anchor.textContent !== widget.text) anchor.textContent = widget.text;

    this.link = widget.link;
    this.text = widget.text;
    this.from = widget.from;
    this.to = widget.to;

    this.registerListeners(anchor);
    LINK_NODES[this.key] = anchor;

    return true;
  }

  toDOM(): HTMLElement {
    const anchor = document.createElement("a") as AnchorElement;
    anchor.classList.add(styles.link);
    anchor.classList.add(CLASSES.link);

    anchor.target = "_blank";
    anchor.textContent = this.text;
    anchor.href = this.link;

    this.registerListeners(anchor);

    LINK_NODES[this.key] = anchor;

    return anchor;
  }

  destroy(dom: AnchorElement): void {
    delete LINK_NODES[this.key];
    dom.destroy?.();
  }

  registerListeners(anchor: AnchorElement) {
    anchor.clearListeners?.();
    const abortController = new AbortController();
    anchor.addEventListener(
      "mousedown",
      (event) => handleClick(this.view, this.text, this.link, this.key, event),
      { signal: abortController.signal },
    );
    anchor.addEventListener("click", (e) => e.preventDefault(), { signal: abortController.signal });
    anchor.clearListeners = () => {
      abortController.abort();
    };
    anchor.destroy = () => {
      anchor.clearListeners?.();
      anchor.remove();
    };
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
  const startPosition = start ?? (node.textContent?.indexOf?.(link) || 0);
  const endPosition = startPosition + link.length;

  if (startPosition === 0 && endPosition === 0) {
    const content = node.textContent;
    if (!content) return;
    let startPosition = 0;
    let pos = 0;

    while (pos < content.length) {
      if (content.codePointAt(pos) !== CODE_OF_START_LINK_URL) {
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

function handleClick(view: EditorView, text: string, link: string, key: string, event: MouseEvent) {
  /** open the link if has special key or the view is readonly */
  const contentEditable = view.contentDOM.getAttribute("contenteditable");
  const forceActive = !contentEditable || contentEditable === "false";

  if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey || forceActive) {
    if (event.type === "mousedown") {
      const target = event.target as HTMLAnchorElement;
      window.open(target.href, "_blank");
    }

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
  const selection = window.getSelection();

  if (!selection || !editor || !parent) return;

  const textNode = getTextNode(text, link, key, line);

  if (textNode) {
    return void selectLink({ selection, link, node: textNode });
  }

  saveDispatch(() => {
    if (!view) return;

    view.dispatch(view.state.update({ effects: openedLinkEffect.of(key) }));

    const textNode = getTextNode(text, link, key, line);
    if (textNode) {
      selectLink({ selection, link, node: textNode });
    }

    requestAnimationFrame(() => {
      saveDispatch(() => {
        if (view) view.dispatch(view.state.update({ effects: openedLinkEffect.of(undefined) }));
      });
    });
  });

  return false;
}
