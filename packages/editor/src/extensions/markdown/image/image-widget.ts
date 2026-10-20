import { type EditorView, WidgetType } from "@codemirror/view";
import { CLASSES } from "../classes-constants";
import styles from "../styles.module.scss";

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
    image.classList.add(styles.image, CLASSES.image);
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

    interval ??= setInterval(garbageCollectorInterval, INTERVAL_DELAY);

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
      (event) => handleClick(this.view, this.link, this.from, this.to, event),
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

function handleClick(
  view: EditorView | undefined,
  link: string,
  from: number,
  to: number,
  event: MouseEvent,
) {
  if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) {
    return;
  }
  if (!view) return;
  event.stopPropagation();
  event.preventDefault();
  const content = view.state.doc.sliceString(from, to);
  const start = content.indexOf(link);
  const anchor = start === -1 ? from + 1 : from + start;
  view.dispatch({ selection: { anchor, head: anchor + link.length }, userEvent: "select" });
  view.focus();
}
