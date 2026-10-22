import type { Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { CLASSES } from "./classes-constants";

export const markdownSkin: Extension = EditorView.theme({
  [`.${CLASSES.code}`]: {
    color: "var(--ksd-md-code-color, currentColor)",
    background: "var(--ksd-md-code-bg, color-mix(in srgb, currentColor 8%, transparent))",
    fontFamily: "var(--ksd-md-code-font, monospace)",
  },
  [`.${CLASSES.codeBlock}`]: {
    color: "var(--ksd-md-code-block-color, currentColor)",
    background: "var(--ksd-md-code-block-bg, color-mix(in srgb, currentColor 5%, transparent))",
    fontFamily: "var(--ksd-md-code-block-font, var(--ksd-md-code-font, monospace))",
  },
  [`.${CLASSES.codeBlockLine}`]: {
    color: "var(--ksd-md-code-block-line-color, currentColor)",
    borderColor:
      "var(--ksd-md-code-block-border, color-mix(in srgb, currentColor 20%, transparent))",
  },
  [`.${CLASSES.codeButton}`]: {
    color: "var(--ksd-md-code-button-color, currentColor)",
  },
  [`.${CLASSES.codeButton}:hover`]: {
    background:
      "var(--ksd-md-code-button-hover, color-mix(in srgb, currentColor 12%, transparent))",
  },
  [`.${CLASSES.codeButtonSuccess}`]: {
    color: "var(--ksd-md-code-button-success-color, currentColor)",
  },
  [`.${CLASSES.codeButtonSuccess}:after`]: {
    borderColor: "currentColor",
  },
  [`.${CLASSES.codeButtonFail}`]: {
    color: "var(--ksd-md-code-button-fail-color, currentColor)",
  },
  [`.${CLASSES.codeButtonFail}:before`]: {
    background: "currentColor",
  },
  [`.${CLASSES.codeButtonFail}:after`]: {
    background: "currentColor",
  },
  [`.${CLASSES.codeButtonPending}`]: {
    color: "var(--ksd-md-code-button-pending-color, currentColor)",
  },
  [`.${CLASSES.codeButtonSpan}`]: {
    color: "var(--ksd-md-code-span-color, currentColor)",
  },
  [`.${CLASSES.listCommon}`]: {
    color: "var(--ksd-md-list-common-color, currentColor)",
  },
  [`.${CLASSES.listCommon}:after`]: {
    background: "currentColor",
  },
  [`.${CLASSES.listOrdered}`]: {
    color: "var(--ksd-md-list-mark-color, color-mix(in srgb, currentColor 60%, #b180ff))",
  },
  [`.${CLASSES.horizontal}`]: {
    color: "var(--ksd-md-horizontal-color, currentColor)",
  },
  [`.${CLASSES.blockquote}`]: {
    color: "var(--ksd-md-blockquote-color, currentColor)",
    borderLeftColor: "var(--ksd-md-blockquote, currentColor)",
  },
  [`.${CLASSES.blockquoteInner}`]: {
    color: "var(--ksd-md-blockquote-inner-color, currentColor)",
  },
  [`.${CLASSES.blockquoteInner}:before`]: {
    borderLeftColor: "var(--ksd-md-blockquote, currentColor)",
  },
  [`.${CLASSES.bold}`]: {
    color: "var(--ksd-md-bold-color, currentColor)",
  },
  [`.${CLASSES.italic}`]: {
    color: "var(--ksd-md-italic-color, currentColor)",
  },
  [`.${CLASSES.strikeThrough}`]: {
    color: "var(--ksd-md-strike-through-color, currentColor)",
  },
  [`.${CLASSES.underline}`]: {
    color: "var(--ksd-md-underline-color, currentColor)",
  },
  [`.${CLASSES.header}`]: {
    color: "var(--ksd-md-header-color, currentColor)",
  },
  ...Object.fromEntries(
    CLASSES.headerLevels.map((className, index) => [
      `.${className}`,
      { color: `var(--ksd-md-header-${index + 1}-color, currentColor)` },
    ]),
  ),
  [`.${CLASSES.todo}`]: {
    color: "var(--ksd-md-todo-color, currentColor)",
  },
  [`.${CLASSES.todoChecked}`]: {
    color: "var(--ksd-md-todo-checked-color, currentColor)",
  },
  [`.${CLASSES.image}`]: {
    color: "var(--ksd-md-image-color, currentColor)",
  },
  [`.${CLASSES.link}`]: {
    color: "var(--ksd-md-link-color, color-mix(in srgb, currentColor 60%, #4da3ff))",
    textDecoration: "underline",
  },
  [`.${CLASSES.shortLink}`]: {
    color: "var(--ksd-md-short-link-color, color-mix(in srgb, currentColor 60%, #4da3ff))",
  },
  [`.${CLASSES.mention}`]: {
    color: "var(--ksd-md-mention-color, color-mix(in srgb, currentColor 60%, #4da3ff))",
  },
  [`.${CLASSES.table}`]: {
    color: "var(--ksd-md-table-color, currentColor)",
  },
  [`.${CLASSES.tableEditor}`]: {
    borderColor: "var(--ksd-md-table-border, color-mix(in srgb, currentColor 25%, transparent))",
  },
  [`.${CLASSES.tableEditor} th`]: {
    background: "var(--ksd-md-table-header-bg, color-mix(in srgb, currentColor 7%, transparent))",
    fontWeight: "var(--ksd-md-table-header-weight, 600)",
    border:
      "1px solid var(--ksd-md-table-border, color-mix(in srgb, currentColor 25%, transparent))",
  },
  [`.${CLASSES.tableEditor} td`]: {
    border:
      "1px solid var(--ksd-md-table-border, color-mix(in srgb, currentColor 25%, transparent))",
  },
  [`.${CLASSES.tableCell}`]: {
    color: "var(--ksd-md-table-cell-color, currentColor)",
  },
  [`.${CLASSES.tableRowButton}, .${CLASSES.tableColButton}`]: {
    color: "var(--ksd-md-table-button-color, currentColor)",
    background: "var(--ksd-md-table-button-bg, color-mix(in srgb, currentColor 10%, transparent))",
  },
  [`.${CLASSES.tableRowButton}:hover, .${CLASSES.tableColButton}:hover`]: {
    background:
      "var(--ksd-md-table-button-hover, color-mix(in srgb, currentColor 20%, transparent))",
  },
});
