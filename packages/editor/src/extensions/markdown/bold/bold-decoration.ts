import { syntaxTree } from "@codemirror/language";
import { Decoration } from "@codemirror/view";
import clsx from "clsx";
import { utils } from "@/lib";
import { CLASSES } from "../classes-constants";
import {
  CODE_OF_ASTERISK,
  CODE_OF_UNDERSCORE,
  type ContentDecorationOptions,
  NAME_OF_ITALIC,
  type SelectionDecorationOptions,
} from "../markdown-model";
import styles from "../styles.module.scss";

export const LIST_OF_BOLD_MARKS = new Set([CODE_OF_UNDERSCORE, CODE_OF_ASTERISK]);

export function fillBoldContentDecorations(opts: ContentDecorationOptions) {
  const step =
    LIST_OF_BOLD_MARKS.has(
      opts.view.state.doc.sliceString(opts.node.from - 1, opts.node.from).charCodeAt(0),
    ) && syntaxTree(opts.view.state).resolve(opts.node.from - 1).type.name !== NAME_OF_ITALIC
      ? 1
      : 0;
  opts.decorations.push(
    Decoration.mark({
      class: clsx(styles.bold, CLASSES.bold),
    }).range(opts.node.from - step, opts.node.to + step),
  );
}

export function fillBoldSelectionDecorations(opts: SelectionDecorationOptions) {
  if (
    LIST_OF_BOLD_MARKS.has(
      opts.view.state.doc.sliceString(opts.node.from - 1, opts.node.from).charCodeAt(0),
    ) &&
    syntaxTree(opts.view.state).resolve(opts.node.from - 1).type.name !== NAME_OF_ITALIC
  ) {
    return;
  }

  if (
    opts.readonly ||
    !opts.view.hasFocus ||
    !utils.isInRange(opts.view.state.selection.ranges, [opts.node.from, opts.node.to])
  ) {
    opts.decorations.push(Decoration.replace({}).range(opts.node.from, opts.node.from + 2));
    opts.decorations.push(Decoration.replace({}).range(opts.node.to - 2, opts.node.to));
  }
}
