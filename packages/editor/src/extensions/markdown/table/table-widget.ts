import type { ChangeSpec, EditorState } from "@codemirror/state";
import { type EditorView, WidgetType } from "@codemirror/view";
import type { SyntaxNode } from "@lezer/common";
import clsx from "clsx";
import { normalizeUrl, saveDispatch } from "@/lib/utils";
import { NAME_OF_BOLD } from "../bold/bold-decoration";
import { CLASSES } from "../classes-constants";
import { NAME_OF_INLINE_CODE } from "../code/code-decoration";
import { NAME_OF_ITALIC } from "../italic/italic-decoration";
import { NAME_OF_AUTO_LINK, NAME_OF_LINK, NAME_OF_URL } from "../link/link-model";
import { NAME_OF_STRIKE_THROUGH } from "../strike-through/strike-through-decoration";
import styles from "../styles.module.scss";
import { NAME_OF_UNDERLINE } from "../underline/underline-model";
import { getTableAt, matrixToSource, modelToMatrix, rowSource, withExtraColumn } from "./table-lib";
import type { TableCellModel, TableModel } from "./table-model";

export class TableWidget extends WidgetType {
  private controller: AbortController | undefined;
  private dom: HTMLElement | undefined;

  readonly key: string;

  constructor(
    private readonly model: TableModel,
    private readonly isReadonly: boolean,
  ) {
    super();
    this.key = [
      model.rowCount,
      model.colCount,
      model.alignments.map((alignment) => alignment ?? "").join(","),
      model.cells.map((cell) => cell.text).join(""),
      isReadonly ? "ro" : "rw",
    ].join(":");
  }

  eq(other: TableWidget) {
    return this.key === other.key;
  }

  toDOM(view: EditorView): HTMLElement {
    this.controller = new AbortController();
    const { signal } = this.controller;
    const root = document.createElement("div");
    root.classList.add(styles.table, CLASSES.table);
    const wrapper = document.createElement("div");
    wrapper.classList.add(styles.table__wrapper, CLASSES.tableWrapper);
    const table = document.createElement("table");
    table.classList.add(styles.table__editor, CLASSES.tableEditor);
    table.tabIndex = -1;
    const head = document.createElement("thead");
    const headRow = document.createElement("tr");
    for (let col = 0; col < this.model.colCount; col++) {
      headRow.appendChild(this.createCellElement(view.state, this.getCell(0, col), "th"));
    }
    head.appendChild(headRow);

    const body = document.createElement("tbody");
    for (let row = 1; row < this.model.rowCount; row++) {
      const bodyRow = document.createElement("tr");
      for (let col = 0; col < this.model.colCount; col++) {
        bodyRow.appendChild(this.createCellElement(view.state, this.getCell(row, col), "td"));
      }
      body.appendChild(bodyRow);
    }
    table.append(head, body);
    table.addEventListener("click", this.getClickListener(view), { signal });
    wrapper.appendChild(table);

    if (!this.isReadonly) {
      table.appendChild(this.createPlusButton(view, "row"));
      table.appendChild(this.createPlusButton(view, "col"));
    }
    root.appendChild(wrapper);
    this.dom = root;
    return root;
  }

  updateDOM(dom: HTMLElement, view: EditorView, from: TableWidget): boolean {
    if (from.isReadonly !== this.isReadonly) return false;
    if (!this.isStructureMatching(dom)) return false;

    try {
      this.dom = dom;
      this.controller = from.controller;
      from.controller = undefined;

      for (const cellDom of dom.querySelectorAll<HTMLElement>("[data-row]")) {
        const row = Number(cellDom.dataset.row);
        const col = Number(cellDom.dataset.col);
        const cell = this.model.cells[row * this.model.colCount + col];
        if (!cell) continue;
        this.fillCellElement(view.state, cellDom, cell);
      }

      return true;
    } catch {
      return false;
    }
  }

  destroy() {
    this.controller?.abort();
    this.controller = undefined;
    this.dom = undefined;
  }

  private getCell(row: number, col: number): TableCellModel {
    return this.model.cells[row * this.model.colCount + col];
  }

  private isStructureMatching(dom: HTMLElement): boolean {
    if (dom.querySelectorAll("thead th").length !== this.model.colCount) return false;
    const bodyRows = dom.querySelectorAll("tbody tr");
    if (bodyRows.length !== this.model.rowCount - 1) return false;
    for (const row of bodyRows) {
      if (row.querySelectorAll("td").length !== this.model.colCount) return false;
    }
    return true;
  }

  private createCellElement(state: EditorState, cell: TableCellModel, tag: "th" | "td") {
    const element = document.createElement(tag);
    element.classList.add(styles.table__cell, CLASSES.tableCell);
    this.fillCellElement(state, element, cell);
    return element;
  }

  private fillCellElement(state: EditorState, element: HTMLElement, cell: TableCellModel) {
    element.textContent = "";
    element.dataset.row = String(cell.row);
    element.dataset.col = String(cell.col);
    const alignment = this.model.alignments[cell.col];
    if (alignment) {
      element.style.textAlign = alignment;
    }
    const content = document.createElement("div");
    content.classList.add(styles["table__cell-content"]);
    content.appendChild(renderCellContent(state, cell));
    element.appendChild(content);
  }

  private getClickListener(view: EditorView) {
    return (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest(
        "[data-row]",
      ) as HTMLElement | null;
      if (!target) return;
      const anchor = (event.target as HTMLElement | null)?.closest("a") as HTMLAnchorElement | null;
      const openLink =
        this.isReadonly || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey;
      if (anchor && openLink) {
        event.preventDefault();
        event.stopPropagation();
        window.open(anchor.href, "_blank");
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      if (this.isReadonly) return;
      const row = Number(target.dataset.row);
      const col = Number(target.dataset.col);
      const freshModel = this.getFreshModel(view);
      const cell = freshModel.cells[row * freshModel.colCount + col];
      if (!cell) return;
      saveDispatch(() => {
        view.dispatch({ selection: { anchor: cell.from, head: cell.from }, userEvent: "select" });
        view.focus();
      });
    };
  }

  private createPlusButton(view: EditorView, kind: "row" | "col") {
    const button = document.createElement("button");
    button.type = "button";
    button.classList.add(
      kind === "row" ? styles["table__row-btn"] : styles["table__col-btn"],
      kind === "row" ? CLASSES.tableRowButton : CLASSES.tableColButton,
    );
    button.textContent = "+";
    button.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        event.stopPropagation();
        const model = this.getFreshModel(view);
        const changes =
          kind === "row" ? this.buildInsertRowChange(model) : this.buildInsertColumnChange(model);
        saveDispatch(() => view.dispatch({ changes, userEvent: "input" }));
      },
      { signal: this.controller?.signal },
    );
    return button;
  }

  private buildInsertRowChange(model: TableModel): ChangeSpec {
    const matrix = modelToMatrix(model);
    const line = rowSource(
      matrix.widths,
      matrix.alignments,
      Array.from<string>({ length: model.colCount }).fill(""),
    );
    return { from: model.to, to: model.to, insert: `\n${line}` };
  }

  private buildInsertColumnChange(model: TableModel): ChangeSpec {
    return {
      from: model.from,
      to: model.to,
      insert: matrixToSource(withExtraColumn(modelToMatrix(model))),
    };
  }

  private getFreshModel(view: EditorView): TableModel {
    if (!this.dom) return this.model;
    const fresh = getTableAt(view.state, view.posAtDOM(this.dom));
    return fresh ?? this.model;
  }
}

const NAME_OF_ESCAPE = "Escape";
const NAME_OF_HTML_TAG = "HTMLTag";

const SKIP_NODES = new Set([
  "EmphasisMark",
  "StrikethroughMark",
  "CodeMark",
  "LinkMark",
  "UnderlineMark",
  NAME_OF_URL,
]);

function renderCellContent(state: EditorState, cell: TableCellModel): DocumentFragment {
  const fragment = document.createDocumentFragment();
  if (cell.node) renderNode(fragment, state, cell.node);
  return fragment;
}

function renderNode(target: Node, state: EditorState, node: SyntaxNode) {
  if (node.name === NAME_OF_ESCAPE) {
    target.appendChild(document.createTextNode(state.doc.sliceString(node.from + 1, node.to)));
    return;
  }

  const element = createElementFor(state, node);
  const container: Node = element ?? target;
  let pos = node.from;
  let child = node.firstChild;
  while (child) {
    if (child.from > pos) {
      container.appendChild(document.createTextNode(state.doc.sliceString(pos, child.from)));
    }
    if (!SKIP_NODES.has(child.name)) {
      renderNode(container, state, child);
    }
    pos = child.to;
    child = child.nextSibling;
  }
  if (pos < node.to) {
    container.appendChild(document.createTextNode(state.doc.sliceString(pos, node.to)));
  }

  if (element) target.appendChild(element);
}

function createElementFor(state: EditorState, node: SyntaxNode): HTMLElement | null {
  switch (node.name) {
    case NAME_OF_BOLD:
      return createStyledElement("strong", clsx(styles.bold, CLASSES.bold));
    case NAME_OF_ITALIC:
      return createStyledElement("em", clsx(styles.italic, CLASSES.italic));
    case NAME_OF_STRIKE_THROUGH:
      return createStyledElement("span", clsx(styles["strike-through"], CLASSES.strikeThrough));
    case NAME_OF_UNDERLINE:
      return createStyledElement("span", clsx(styles.underline, CLASSES.underline));
    case NAME_OF_INLINE_CODE:
      return createStyledElement("code", clsx(styles.code, CLASSES.code));
    case NAME_OF_LINK: {
      const anchor = document.createElement("a");
      anchor.className = clsx(styles.link, CLASSES.link);
      const url = node.getChild(NAME_OF_URL);
      if (url) {
        anchor.href = normalizeUrl(state.doc.sliceString(url.from, url.to));
        anchor.target = "_blank";
      }
      return anchor;
    }
    case NAME_OF_AUTO_LINK: {
      const anchor = document.createElement("a");
      anchor.className = clsx(styles.link, CLASSES.link);
      const url = state.doc.sliceString(node.from + 1, node.to - 1);
      anchor.href = normalizeUrl(url);
      anchor.target = "_blank";
      anchor.textContent = url;
      return anchor;
    }
    case NAME_OF_HTML_TAG: {
      if (isBrTag(state.doc.sliceString(node.from, node.to))) {
        return document.createElement("br");
      }
      return null;
    }
    default:
      return null;
  }
}

function createStyledElement(tag: string, className: string) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

const LT = 60; // "<"
const GT = 62; // ">"
const SLASH = 47; // "/"
const LETTER_B = 98; // "b"
const LETTER_R = 114; // "r"
function isBrTag(text: string): boolean {
  if (text.length < 4) return false;
  if (text.charCodeAt(0) !== LT) return false;
  // | 32 — is to lower case
  if ((text.charCodeAt(1) | 32) !== LETTER_B) return false;
  if ((text.charCodeAt(2) | 32) !== LETTER_R) return false;
  let index = 3;
  while (index < text.length && isSpaceCode(text.charCodeAt(index))) index++;
  if (index < text.length && text.charCodeAt(index) === SLASH) index++;
  return index === text.length - 1 && text.charCodeAt(index) === GT;
}

function isSpaceCode(code: number): boolean {
  return code === 32 || (code >= 9 && code <= 13);
}
