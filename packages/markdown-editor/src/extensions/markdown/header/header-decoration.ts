import clsx from "clsx";
import { utils } from "@/lib";
import type {
  DecorationMap,
  DecorationPlugin,
  GetDecorationOptions,
  GetSelectionDecorationOptions,
  SelectionDecorationMap,
} from "../markdown-types";
import styles from "../styles.module.scss";
import { NAME_OF_HEADER, NAME_OF_HEADER_MARK, NAME_OF_HEADER_UNDER } from "./header-constants";

export function getHeaderDecorations({ decorations, node, view }: GetDecorationOptions) {
  const isHeader = node.name.startsWith(NAME_OF_HEADER);

  let level: string | undefined;

  if (isHeader) {
    level = node.name.replace(NAME_OF_HEADER, "");

    if (view.state.doc.sliceString(node.from + +level).charCodeAt(0) !== 32) return;
  } else {
    level = node.name.replace(NAME_OF_HEADER_UNDER, "");
  }

  if (!level) return;

  decorations.push(
    utils.getLineDecoration({
      style: clsx(styles.header, styles[`level_${level}`]),
      range: [view.lineBlockAt(node.from).from],
    }),
  );
}

export function getHeaderSelectionDecorations({
  decorations,
  node,
  view,
  isReadonly,
}: GetSelectionDecorationOptions) {
  const isHeader = node.name.startsWith(NAME_OF_HEADER);

  const mark = node.node.getChild(NAME_OF_HEADER_MARK);
  if (!mark) return;

  if (isHeader) {
    const line = view.lineBlockAt(mark.from);
    if (line.length < mark.to - mark.from + 1) return;

    if (
      isReadonly ||
      !view.hasFocus ||
      !utils.isInRange(view.state.selection.ranges, [line.from, line.to])
    ) {
      decorations.push(utils.getHideDecoration({ range: [mark.from, mark.to + 1] }));
    }
  } else {
    const lineHeader = view.lineBlockAt(node.from);
    const lineMark = view.lineBlockAt(mark.from);

    if (
      isReadonly ||
      !view.hasFocus ||
      !utils.isInRange(view.state.selection.ranges, [lineHeader.from, lineMark.to])
    ) {
      decorations.push(utils.getHideDecoration({ range: [lineMark.from, lineMark.to] }));
    }
  }
}

const decorations: DecorationMap = {
  [`${NAME_OF_HEADER}1`]: getHeaderDecorations,
  [`${NAME_OF_HEADER}2`]: getHeaderDecorations,
  [`${NAME_OF_HEADER}3`]: getHeaderDecorations,
  [`${NAME_OF_HEADER}4`]: getHeaderDecorations,
  [`${NAME_OF_HEADER}5`]: getHeaderDecorations,
  [`${NAME_OF_HEADER}6`]: getHeaderDecorations,
  [`${NAME_OF_HEADER_UNDER}1`]: getHeaderDecorations,
  [`${NAME_OF_HEADER_UNDER}2`]: getHeaderDecorations,
};
const selectionDecorations: SelectionDecorationMap = {
  [`${NAME_OF_HEADER}1`]: getHeaderSelectionDecorations,
  [`${NAME_OF_HEADER}2`]: getHeaderSelectionDecorations,
  [`${NAME_OF_HEADER}3`]: getHeaderSelectionDecorations,
  [`${NAME_OF_HEADER}4`]: getHeaderSelectionDecorations,
  [`${NAME_OF_HEADER}5`]: getHeaderSelectionDecorations,
  [`${NAME_OF_HEADER}6`]: getHeaderSelectionDecorations,
  [`${NAME_OF_HEADER_UNDER}1`]: getHeaderSelectionDecorations,
  [`${NAME_OF_HEADER_UNDER}2`]: getHeaderSelectionDecorations,
};
export const headerDecorationPlugin: DecorationPlugin = {
  decorations,
  selectionDecorations,
};
