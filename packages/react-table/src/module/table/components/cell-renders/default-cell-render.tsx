import {
  dateFormat,
  isArray,
  isBoolean,
  isId,
  isNullable,
  isNumber,
  isObject,
} from "@krainovsd/js-helpers";
import type { CellContext, CellRenderProps, DefaultRow } from "../../../../types";
import { useVisibleCell } from "../../hooks";
import { getData } from "../../lib";
import { CellRenderLink } from "../cell-render-link";
import { CellRenderTooltip } from "../cell-render-tooltip";
import { CellRenderWrapper } from "../cell-render-wrapper";
import styles from "./default-cell-render.module.scss";

export type DefaultCellRenderProps<RowData extends DefaultRow> = {
  arraySeparator?: string;
  objectPath?: string;
  mappings?: Record<string, string | number | React.ReactNode>;
  Link?: (props: {
    children?: React.ReactNode;
    context: CellContext<RowData>;
  }) => React.ReactNode | null;
  floatRound?: boolean;
  floatFixed?: number;
  dateFormat?: string;
  customContent?: (context: CellContext<RowData>) => string | number | boolean;
};

export function DefaultCellRender<RowData extends DefaultRow>(props: CellRenderProps<RowData>) {
  const column = props.context.column.columnDef;
  const cellRenderProps = (column.cellRenderProps as DefaultCellRenderProps<RowData>) ?? {};

  const { isVisible, level } = useVisibleCell(props.context);
  const isExpandable =
    props.context.column?.columnDef?.expandable && props.context.row.getCanExpand();

  const Expander = props.context.table.options.meta?.renderers?.expander;

  const initialContent: unknown = getData(props.context.row.original, props.context.column.id);
  let content = initialContent;
  if (isObject(initialContent) && cellRenderProps.objectPath) {
    content = getData(initialContent, cellRenderProps.objectPath);
  }
  if (isArray(initialContent) && cellRenderProps.arraySeparator) {
    if (isObject(initialContent[0]) && cellRenderProps.objectPath) {
      content = initialContent
        .reduce((acc: string[], item) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const innerContent = getData(item, cellRenderProps.objectPath!);
          if (!isNullable(innerContent)) acc.push(String(innerContent));

          return acc;
        }, [])
        .join(cellRenderProps.arraySeparator);
    } else {
      content = initialContent.join(cellRenderProps.arraySeparator);
    }
  }
  if (isNumber(initialContent)) {
    if (cellRenderProps.floatRound) {
      content = Math.round(initialContent);
    }
    if (cellRenderProps.floatFixed != undefined) {
      content = initialContent.toFixed(cellRenderProps.floatFixed);
    }
  }
  if (isObject(cellRenderProps.mappings)) {
    content = cellRenderProps.mappings[String(initialContent)];
  }
  if (isId(initialContent) && cellRenderProps.dateFormat) {
    content = dateFormat(initialContent, cellRenderProps.dateFormat);
  }
  if (cellRenderProps.customContent) {
    content = cellRenderProps.customContent(props.context);
  }

  if (!isVisible || (!isId(content) && !isBoolean(content))) return null;

  return (
    <CellRenderWrapper column={column} context={props.context} level={level}>
      {isExpandable && Expander && <Expander context={props.context} />}
      <CellRenderTooltip
        content={content}
        row={props.context.row.original}
        tooltip={column.tooltip}
      >
        <CellRenderLink context={props.context} Link={cellRenderProps.Link}>
          <span className={styles.text}>{content}</span>
        </CellRenderLink>
      </CellRenderTooltip>
    </CellRenderWrapper>
  );
}
