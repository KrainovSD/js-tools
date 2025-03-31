import { dateFormat, isArray, isBoolean, isId, isString } from "@krainovsd/js-helpers";
import type { CellContext } from "@tanstack/react-table";
import clsx from "clsx";
import type { ReactNode } from "react";
import { useVisibleCell } from "../hooks/use-visible-cell";
import { getData } from "../lib";
import styles from "./cell-renders.module.scss";

export type TextCellRenderProps = {
  expanded?: boolean;
  pathToLink?: string;
  pathToTooltip?: string;
  booleanMapping?: BooleanMapping;
};

type BooleanMapping = {
  true: string | ReactNode;
  false: string | ReactNode;
};

export function TextCellRender<Row extends Record<string, unknown>>(props: {
  context: CellContext<Row, unknown>;
}): ReactNode {
  const cellRenderProps = props.context.column.columnDef.cellRenderProps as
    | TextCellRenderProps
    | undefined;
  const link = cellRenderProps?.pathToLink
    ? getData(props.context.row.original, cellRenderProps.pathToLink)
    : undefined;
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

  const Container = (
    <>
      {isString(link) && (
        <a
          data-tooltip={isString(tooltip) ? tooltip : undefined}
          href={link}
          className={clsx(styles.container)}
          style={{ width: isExpandable ? "80%" : undefined, paddingLeft: extraPadding }}
        >
          {Node}
        </a>
      )}
      {!isString(link) && (
        <div
          data-tooltip={isString(tooltip) ? tooltip : undefined}
          className={clsx(styles.container)}
          style={{ width: isExpandable ? "80%" : undefined, paddingLeft: extraPadding }}
        >
          {Node}
        </div>
      )}
    </>
  );
  const Expander = props.context.table.options.meta?.renderers?.expander;

  return (
    <>
      {!isString(tooltip) && Container}
      {isString(tooltip) && Container}
      {isExpandable && Expander && <Expander context={props.context} />}
    </>
  );
}

export type DateCellRenderProps = {
  format: string;
  expanded?: boolean;
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
        className={styles.container}
        style={{ width: isExpandable ? "80%" : undefined, paddingLeft: extraPadding }}
      >
        <span className={styles.base}>{date}</span>
      </div>
      {isExpandable && Expander && <Expander context={props.context} />}
    </>
  );
}
