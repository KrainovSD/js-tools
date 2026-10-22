import { type EditorView, WidgetType } from "@codemirror/view";
import { CLASSES } from "../classes-constants";
import type { MarkdownDecorationSettings } from "../markdown-types";
import styles from "../styles.module.scss";

const IMAGE_NODES: Record<string, ImageContainerElement | undefined> = {};
const INTERVAL_DELAY = 10000;
const EXISTING_WIDGETS = new Set<string>();
const DEFAULT_PREVIEW_SIZE = 150;
let interval: NodeJS.Timeout | null = null;
interface ImageContainerElement extends HTMLSpanElement {
  clearListeners?: () => void;
  destroy?: () => void;
  image?: HTMLImageElement;
}

export type ImageWidgetSettings = Pick<
  MarkdownDecorationSettings,
  "imageSrcGetter" | "imageFullscreen" | "imagePreviewSize" | "openImageFullscreen"
>;

export class ImageWidget extends WidgetType {
  constructor(
    private text: string,
    private link: string,
    private from: number,
    private to: number,
    private uniqueId: string,
    private fullLine: boolean,
    private settings: ImageWidgetSettings,
    private view: EditorView,
  ) {
    super();
  }

  get key() {
    return `${this.link}:${this.text}:${this.uniqueId}:${this.from}:${this.to}`;
  }

  get src() {
    return this.settings.imageSrcGetter ? this.settings.imageSrcGetter(this.link) : this.link;
  }

  get previewSize() {
    return this.settings.imagePreviewSize ?? DEFAULT_PREVIEW_SIZE;
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

    this.registerListeners(container);
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
    this.applyPreviewStyles(image);

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

  applyPreviewStyles(image: HTMLImageElement) {
    image.style.maxWidth = "100%";
    image.style.height = `${this.previewSize}px`;
    image.style.width = "auto";
    image.style.objectFit = "contain";
    if (this.settings.imageFullscreen) image.style.cursor = "zoom-in";
  }

  registerListeners(element: ImageContainerElement) {
    element.clearListeners?.();
    const abortController = new AbortController();
    element.addEventListener(
      "mousedown",
      (event) => handleClick(this.view, this.link, this.from, this.to, event, this.settings),
      { signal: abortController.signal },
    );
    element.clearListeners = () => {
      abortController.abort();
    };
    element.destroy = () => {
      element.clearListeners?.();
      element.remove();
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
  settings: ImageWidgetSettings,
) {
  if (!view) return;
  const contentEditable = view.contentDOM.getAttribute("contenteditable");
  const isReadonly = !contentEditable || contentEditable === "false";
  const isViewerClick = settings.imageFullscreen && (isReadonly || event.ctrlKey);
  if (isViewerClick && settings.openImageFullscreen) {
    event.stopPropagation();
    event.preventDefault();
    void settings.openImageFullscreen(view, from);
    return;
  }
  event.stopPropagation();
  event.preventDefault();
  const content = view.state.doc.sliceString(from, to);
  const start = content.indexOf(link);
  const anchor = start === -1 ? from + 1 : from + start;
  view.dispatch({ selection: { anchor, head: anchor + link.length }, userEvent: "select" });
  view.focus();
}
