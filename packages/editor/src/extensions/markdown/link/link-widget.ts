import { EditorView, WidgetType } from "@codemirror/view";
import { normalizeUrl } from "@/lib/utils";
import { CLASSES } from "../classes-constants";
import { getHeaderId } from "../header/header-lib";
import { CODE_OF_HASH } from "../markdown-model";
import { MarkdownState } from "../markdown-state";
import styles from "../styles.module.scss";

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
    private readonly short: boolean = false,
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

    if (anchor.href !== normalizeUrl(widget.link)) anchor.href = normalizeUrl(widget.link);
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

    if (this.short) {
      anchor.classList.add(styles.short);
      anchor.classList.add(CLASSES.shortLink);
    }

    anchor.target = "_blank";
    anchor.textContent = this.text;
    anchor.href = normalizeUrl(this.link);

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
      (event) =>
        handleClick(this.view, this.text, this.link, this.from, this.to, this.short, event),
      { signal: abortController.signal },
    );
    anchor.addEventListener("click", (event) => event.preventDefault(), {
      signal: abortController.signal,
    });
    anchor.clearListeners = () => {
      abortController.abort();
    };
    anchor.destroy = () => {
      anchor.clearListeners?.();
      anchor.remove();
    };
  }
}

function navigateToHeader(view: EditorView, link: string, from: number, to: number) {
  const position = view.state
    .field(MarkdownState)
    .getHeaders(view.state, true)
    .find((h) => h.id === getHeaderId(link))?.lineStart;
  if (position == undefined) {
    view.dispatch({ selection: { anchor: from, head: to }, userEvent: "select" });
    view.focus();
    return;
  }
  view.dispatch({
    selection: { anchor: position, head: position },
    effects: EditorView.scrollIntoView(position, { y: "center" }),
  });
  view.focus();
}

function selectLinkUrl(view: EditorView, link: string, from: number, to: number) {
  const content = view.state.doc.sliceString(from, to);
  const start = content.indexOf(link);
  const anchor = start === -1 ? from + 1 : from + start;
  view.dispatch({ selection: { anchor, head: anchor + link.length }, userEvent: "select" });
  view.focus();
}

function handleClick(
  view: EditorView,
  text: string,
  link: string,
  from: number,
  to: number,
  short: boolean,
  event: MouseEvent,
) {
  event.preventDefault();
  const contentEditable = view.contentDOM.getAttribute("contenteditable");
  const forceActive = !contentEditable || contentEditable === "false";
  if (!event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey && !forceActive) {
    event.stopPropagation();
    selectLinkUrl(view, link, from, to);
    return;
  }
  if (link.charCodeAt(0) === CODE_OF_HASH) {
    const textFrom = short ? from + 2 : from + 1;
    const textTo = short ? to - 2 : from + 1 + text.length;
    navigateToHeader(view, link, textFrom, textTo);
    return;
  }
  const target = event.target as HTMLAnchorElement;
  window.open(target.href, "_blank");
}
