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

export function TextCellRender<Row extends Record<string, unknown>>(
  props: CellContext<Row, unknown>,
): ReactNode {
  const cellRenderProps = props.column.columnDef.cellRenderProps as TextCellRenderProps | undefined;
  const link = cellRenderProps?.pathToLink
    ? getData(props.row.original, cellRenderProps.pathToLink)
    : undefined;
  const tooltip = cellRenderProps?.pathToTooltip
    ? getData(props.row.original, cellRenderProps.pathToTooltip)
    : undefined;
  const booleanMapping: BooleanMapping = cellRenderProps?.booleanMapping ?? {
    false: "Нет",
    true: "Да",
  };

  const content = getData(props.row.original, props.column.id);
  const isExpandable = cellRenderProps?.expanded && props.row.getCanExpand();

  const { isVisible, extraPadding } = useVisibleCell(props);
  if (!isVisible) return;

  const node = (
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

  const container = (
    <>
      {isString(link) && (
        <a
          data-tooltip={isString(tooltip) ? tooltip : undefined}
          href={link}
          className={clsx(styles.container)}
          style={{ width: isExpandable ? "80%" : undefined, paddingLeft: extraPadding }}
        >
          {node}
        </a>
      )}
      {!isString(link) && (
        <div
          data-tooltip={isString(tooltip) ? tooltip : undefined}
          className={clsx(styles.container)}
          style={{ width: isExpandable ? "80%" : undefined, paddingLeft: extraPadding }}
        >
          <span className={styles.base}>{node}</span>
        </div>
      )}
    </>
  );

  return (
    <>
      {!isString(tooltip) && container}
      {isString(tooltip) && container}
      {isExpandable && props.table.options.meta?.renderers?.expander?.(props)}
    </>
  );
}

export type DateCellRenderProps = {
  format: string;
  expanded?: boolean;
};

export function DateCellRender<Row extends Record<string, unknown>>(
  props: CellContext<Row, unknown>,
): ReactNode {
  const cellRenderProps = props.column.columnDef.cellRenderProps as DateCellRenderProps | undefined;
  if (!cellRenderProps) return;

  const content = getData(props.row.original, props.column.id);
  const date = isId(content) ? dateFormat(content, cellRenderProps.format) : null;
  const isExpandable = cellRenderProps?.expanded && props.row.getCanExpand();

  const { isVisible, extraPadding } = useVisibleCell(props);
  if (!isVisible) return;

  return (
    <>
      <div
        className={styles.container}
        style={{ width: isExpandable ? "80%" : undefined, paddingLeft: extraPadding }}
      >
        <span className={styles.base}>{date}</span>
      </div>
      {isExpandable && props.table.options.meta?.renderers?.expander?.(props)}
    </>
  );
}
