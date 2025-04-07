import { dateFormat, isArray, isBoolean, isId, isString } from "@krainovsd/js-helpers";
import { Tooltip } from "@krainovsd/react-ui";
import type { CellContext } from "@tanstack/react-table";
import clsx from "clsx";
import type { ReactNode } from "react";
import { useVisibleCell } from "../hooks/use-visible-cell";
import { getData } from "../lib";
import styles from "./cell-renders.module.scss";

export type CellRenderClasses = "center";

export type TextCellRenderProps<RowData extends Record<string, unknown>> = {
  expanded?: boolean;
  pathToTooltip?: string;
  linkGetter?: (row: RowData) => string;
  autoTooltip?: boolean;
  booleanMapping?: BooleanMapping;
  classes?: Record<CellRenderClasses, boolean>;
};

type BooleanMapping = {
  true: string | ReactNode;
  false: string | ReactNode;
};

export function TextCellRender<Row extends Record<string, unknown>>(props: {
  context: CellContext<Row, unknown>;
}): ReactNode {
  const cellRenderProps = props.context.column.columnDef.cellRenderProps as
    | TextCellRenderProps<Row>
    | undefined;
  const link = cellRenderProps?.linkGetter?.(props.context.row.original);
  const tooltip = cellRenderProps?.pathToTooltip
    ? getData(props.context.row.original, cellRenderProps.pathToTooltip)
    : undefined;
  const booleanMapping: BooleanMapping = cellRenderProps?.booleanMapping ?? {
    false: "Нет",
    true: "Да",
  };

  const content = getData(props.context.row.original, props.context.column.id);
  const isExpandable = cellRenderProps?.expanded && props.context.row.getCanExpand();

  const { isVisible, extraPadding } = useVisibleCell(props.context);
  if (!isVisible) return;

  const Node = (
    <span className={styles.base}>
      {isId(content)
        ? content
        : isBoolean(content)
          ? booleanMapping[String(content) as "true" | "false"]
          : isArray(content)
            ? content.join(", ")
            : ""}
    </span>
  );

  const Expander = props.context.table.options.meta?.renderers?.expander;

  return (
    <>
      {isString(link) && (
        <div
          data-tooltip={isString(tooltip) ? tooltip : undefined}
          className={clsx(
            styles.container,
            cellRenderProps?.classes?.center && styles.container__center,
          )}
          style={{ paddingLeft: extraPadding }}
        >
          {isExpandable && Expander && <Expander context={props.context} />}
          <a href={link} className={clsx(styles.text__link)}>
            {isString(tooltip) && (
              <Tooltip
                classNameContent={styles.text__tooltip}
                text={tooltip}
                autoTooltip={cellRenderProps?.autoTooltip}
              >
                {Node}
              </Tooltip>
            )}
            {!isString(tooltip) && Node}
          </a>
        </div>
      )}
      {!isString(link) && (
        <div
          data-tooltip={isString(tooltip) ? tooltip : undefined}
          className={clsx(
            styles.container,
            cellRenderProps?.classes?.center && styles.container__center,
          )}
          style={{ paddingLeft: extraPadding }}
        >
          {isExpandable && Expander && <Expander context={props.context} />}
          {isString(tooltip) && (
            <Tooltip
              classNameContent={styles.text__tooltip}
              text={tooltip}
              autoTooltip={cellRenderProps?.autoTooltip}
            >
              {Node}
            </Tooltip>
          )}
          {!isString(tooltip) && Node}
        </div>
      )}
    </>
  );
}

export type DateCellRenderProps = {
  format: string;
  expanded?: boolean;
  classes?: Record<CellRenderClasses, boolean>;
};

export function DateCellRender<Row extends Record<string, unknown>>(props: {
  context: CellContext<Row, unknown>;
}): ReactNode {
  const cellRenderProps = props.context.column.columnDef.cellRenderProps as
    | DateCellRenderProps
    | undefined;
  const { isVisible, extraPadding } = useVisibleCell(props.context);
  if (!cellRenderProps) return;

  const content = getData(props.context.row.original, props.context.column.id);
  const date = isId(content) ? dateFormat(content, cellRenderProps.format) : null;
  const isExpandable = cellRenderProps?.expanded && props.context.row.getCanExpand();

  if (!isVisible) return;

  const Expander = props.context.table.options.meta?.renderers?.expander;

  return (
    <>
      <div
        className={clsx(
          styles.container,
          cellRenderProps?.classes?.center && styles.container__center,
        )}
        style={{ paddingLeft: extraPadding }}
      >
        {isExpandable && Expander && <Expander context={props.context} />}
        <span className={styles.base}>{date}</span>
      </div>
    </>
  );
}

export type TagCellRenderProps = {
  color?: string;
  filterable?: boolean;
  classes?: Record<CellRenderClasses, boolean>;
};

export function TagCellRender<Row extends Record<string, unknown>>(props: {
  context: CellContext<Row, unknown>;
}): ReactNode {
  const cellRenderProps = props.context.column.columnDef.cellRenderProps as
    | DateCellRenderProps
    | undefined;
  const { isVisible, extraPadding } = useVisibleCell(props.context);
  if (!cellRenderProps) return;

  const content = getData(props.context.row.original, props.context.column.id);
  const date = isId(content) ? dateFormat(content, cellRenderProps.format) : null;
  const isExpandable = cellRenderProps?.expanded && props.context.row.getCanExpand();

  if (!isVisible) return;

  const Expander = props.context.table.options.meta?.renderers?.expander;

  return (
    <>
      <div
        className={clsx(
          styles.container,
          cellRenderProps?.classes?.center && styles.container__center,
        )}
        style={{ paddingLeft: extraPadding }}
      >
        {isExpandable && Expander && <Expander context={props.context} />}
        <span className={styles.base}>{date}</span>
      </div>
    </>
  );
}
