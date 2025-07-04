import { dateFormat, isArray, isBoolean, isId, isObject } from "@krainovsd/js-helpers";
import { CheckBox, Tag, Tooltip } from "@krainovsd/react-ui";
import type { CellContext } from "@tanstack/react-table";
import type { PresetColorType } from "antd/es/theme/internal";
import clsx from "clsx";
import type { ReactNode } from "react";
import type React from "react";
import type { DefaultRow, RowInterface } from "../../../types";
import { useVisibleCell } from "../hooks/use-visible-cell";
import { getData } from "../lib";
import styles from "./cell-renders.module.scss";

export type CellRenderClasses = "hCenter" | "wCenter";

export type TextCellRenderProps<RowData extends DefaultRow> = {
  expanded?: boolean;
  shift?: number;
  pathToTooltip?: string;
  Link?: (props: {
    children?: React.ReactNode;
    context: CellContext<RowData, unknown>;
  }) => ReactNode;
  autoTooltip?: boolean;
  booleanMapping?: BooleanMapping;
  classes?: CellRenderClasses[];
  className?: ((context: CellContext<RowData, unknown>) => string) | string;
  tooltipZ?: number;
};

type BooleanMapping = {
  true: string | ReactNode;
  false: string | ReactNode;
};

export function TextCellRender<Row extends DefaultRow>(props: {
  context: CellContext<Row, unknown>;
}): ReactNode {
  const cellRenderProps = props.context.column.columnDef.cellRenderProps as
    | TextCellRenderProps<Row>
    | undefined;
  const Link = cellRenderProps?.Link;

  const booleanMapping: BooleanMapping = cellRenderProps?.booleanMapping ?? {
    false: "Нет",
    true: "Да",
  };

  const content = getData(props.context.row.original, props.context.column.id);
  const tooltip = cellRenderProps?.pathToTooltip
    ? getData(props.context.row.original, cellRenderProps.pathToTooltip)
    : content;
  const hasTooltip =
    (isId(tooltip) || isBoolean(tooltip)) && isBoolean(cellRenderProps?.autoTooltip);

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
      {Link && (
        <div
          className={clsx(
            styles.container,
            cellRenderProps?.classes?.map?.((style) => styles[`container__${style}`]),
            typeof cellRenderProps?.className === "function"
              ? cellRenderProps.className(props.context)
              : cellRenderProps?.className,
          )}
          style={{
            paddingLeft:
              cellRenderProps?.shift != undefined
                ? extraPadding * cellRenderProps.shift
                : undefined,
          }}
        >
          {isExpandable && Expander && <Expander context={props.context} />}
          <Link context={props.context}>
            {hasTooltip && (
              <Tooltip
                classNameContent={styles.tooltip}
                text={tooltip}
                autoTooltip={cellRenderProps?.autoTooltip}
                zIndex={cellRenderProps?.tooltipZ}
              >
                {Node}
              </Tooltip>
            )}
            {!hasTooltip && Node}
          </Link>
        </div>
      )}
      {!Link && (
        <div
          className={clsx(
            styles.container,
            cellRenderProps?.classes?.map?.((style) => styles[`container__${style}`]),
            typeof cellRenderProps?.className === "function"
              ? cellRenderProps.className(props.context)
              : cellRenderProps?.className,
          )}
          style={{
            paddingLeft:
              cellRenderProps?.shift != undefined
                ? extraPadding * cellRenderProps.shift
                : undefined,
          }}
        >
          {isExpandable && Expander && <Expander context={props.context} />}
          {hasTooltip && (
            <Tooltip
              classNameContent={styles.tooltip}
              text={tooltip}
              autoTooltip={cellRenderProps?.autoTooltip}
              zIndex={cellRenderProps?.tooltipZ}
            >
              {Node}
            </Tooltip>
          )}
          {!hasTooltip && Node}
        </div>
      )}
    </>
  );
}

export type DateCellRenderProps<RowData extends DefaultRow> = {
  format: string;
  expanded?: boolean;
  shift?: number;
  classes?: CellRenderClasses[];
  className?: ((context: CellContext<RowData, unknown>) => string) | string;
};

export function DateCellRender<Row extends DefaultRow>(props: {
  context: CellContext<Row, unknown>;
}): ReactNode {
  const cellRenderProps = props.context.column.columnDef.cellRenderProps as
    | DateCellRenderProps<Row>
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
          cellRenderProps?.classes?.map?.((style) => styles[`container__${style}`]),
          typeof cellRenderProps?.className === "function"
            ? cellRenderProps.className(props.context)
            : cellRenderProps?.className,
        )}
        style={{
          paddingLeft:
            cellRenderProps.shift != undefined ? extraPadding * cellRenderProps.shift : undefined,
        }}
      >
        {isExpandable && Expander && <Expander context={props.context} />}
        <span className={styles.base}>{date}</span>
      </div>
    </>
  );
}

export type TagCellRenderProps<Row extends DefaultRow> = {
  color?:
    | ((context: CellContext<Row, unknown>) => keyof PresetColorType | undefined)
    | keyof PresetColorType
    | undefined;
  content?: (context: CellContext<Row, unknown>) => string | string[] | undefined;
  bordered?: boolean;
  filterable?: boolean;
  classes?: CellRenderClasses[];
  pathToTooltip?: string;
  autoTooltip?: boolean;
  tooltipZ?: number;
  className?: ((context: CellContext<Row, unknown>) => string) | string;
};

export function TagCellRender<Row extends DefaultRow>(props: {
  context: CellContext<Row, unknown>;
}): ReactNode {
  const cellRenderProps = props.context.column.columnDef.cellRenderProps as
    | TagCellRenderProps<Row>
    | undefined;
  const { isVisible } = useVisibleCell(props.context);
  if (!cellRenderProps) return;

  const rowValue = getData(props.context.row.original, props.context.column.id);
  const rowContent =
    cellRenderProps?.content?.(props.context) ??
    getData(props.context.row.original, props.context.column.id);
  const renderContent = isArray(rowContent) ? rowContent : [rowContent];
  const renderValue = isArray(rowValue) ? rowValue : [rowValue];

  const tooltip = cellRenderProps?.pathToTooltip
    ? getData(props.context.row.original, cellRenderProps.pathToTooltip)
    : rowValue;
  const renderTooltip =
    tooltip != undefined && isBoolean(cellRenderProps?.autoTooltip)
      ? isArray(tooltip)
        ? tooltip
        : [tooltip]
      : undefined;

  if (!isVisible || !isArray(renderContent) || !isArray(renderValue)) return null;

  const Node = renderContent.map((content, index) => {
    if (!isId(content)) return null;

    return (
      <Tag
        key={`${content}${index}`}
        className={styles.tag}
        bordered={cellRenderProps?.bordered}
        color={
          typeof cellRenderProps?.color === "function"
            ? cellRenderProps.color(props.context)
            : cellRenderProps?.color
        }
        style={{
          cursor:
            !props.context.column.columnDef.enableColumnFilter || !cellRenderProps.filterable
              ? "inherit"
              : "pointer",
        }}
        onClick={(event) => {
          if (!props.context.column.columnDef.enableColumnFilter || !cellRenderProps.filterable)
            return;

          event.stopPropagation();

          const filterRenderProps = props.context.column.columnDef.filterRenderProps;
          const multiple =
            isObject(filterRenderProps) && "multiple" in filterRenderProps
              ? filterRenderProps.multiple
              : false;
          const value = renderValue[index];
          if (multiple) {
            const values: unknown[] = [];
            values.push(value);

            if (values.length > 0) props.context.column.setFilterValue(values);
          } else {
            props.context.column.setFilterValue(value);
          }
        }}
      >
        {content}
      </Tag>
    );
  });

  return (
    <>
      <div
        className={clsx(
          styles.container,
          styles.tag__container,
          cellRenderProps?.classes?.map?.((style) => styles[`container__${style}`]),
          typeof cellRenderProps?.className === "function"
            ? cellRenderProps.className(props.context)
            : cellRenderProps?.className,
        )}
      >
        {renderTooltip != undefined && (
          <Tooltip
            classNameContent={styles.tooltip}
            text={renderTooltip.join(", ")}
            autoTooltip={cellRenderProps?.autoTooltip}
            zIndex={cellRenderProps?.tooltipZ}
          >
            {Node}
          </Tooltip>
        )}
        {renderTooltip == undefined && Node}
      </div>
    </>
  );
}

type CheckProps = (props: {
  checked: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}) => ReactNode;
export type SelectCellRenderProps<RowData extends DefaultRow> = {
  Check?: CheckProps;
  shift?: number;
  classes?: CellRenderClasses[];
  hover?: boolean;
  className?: ((context: CellContext<RowData, unknown>) => string) | string;
};

function collectNumberRecursively<Row extends DefaultRow>(
  context: CellContext<Row, unknown>,
  row: RowInterface<Row>,
) {
  let number: number[] = [];

  if (row.parentId != undefined) {
    const parent = context.table.getRow(row.parentId);
    if (parent != undefined) {
      const parentNumber = parent.index + 1;
      number.push(parentNumber);

      const deepParentNumber = collectNumberRecursively(context, parent);
      number = deepParentNumber.concat(number);
    }
  }

  return number;
}

export function SelectCellRender<Row extends DefaultRow>(props: {
  context: CellContext<Row, unknown>;
}): ReactNode {
  const cellRenderProps = props.context.column.columnDef.cellRenderProps as
    | SelectCellRenderProps<Row>
    | undefined;
  const { isVisible, extraPadding } = useVisibleCell(props.context);
  const Check = cellRenderProps?.Check ?? CheckBox;

  let number: string | number = cellRenderProps?.hover ? props.context.row.index + 1 : 0;

  if (props.context.row.parentId != undefined) {
    const parentNumbers = collectNumberRecursively(props.context, props.context.row);
    parentNumbers.push(number);
    number = parentNumbers.join(".");
  }

  const checked = props.context.row.getIsSelected();
  const hover = !checked && cellRenderProps?.hover;

  if (!isVisible) return;

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        className={clsx(
          styles.container,
          hover && styles.select__container,
          cellRenderProps?.classes?.map?.((style) => styles[`container__${style}`]),
          typeof cellRenderProps?.className === "function"
            ? cellRenderProps.className(props.context)
            : cellRenderProps?.className,
        )}
        style={{
          paddingLeft:
            cellRenderProps?.shift != undefined ? extraPadding * cellRenderProps.shift : undefined,
        }}
        onClick={(event) => event.stopPropagation()}
        onDoubleClick={(event) => event.stopPropagation()}
      >
        {hover && <span className={clsx(hover && styles.select__number)}>{number}</span>}
        <span className={clsx(hover && styles.select__check)}>
          <Check
            checked={checked}
            onChange={(event) => {
              props.context.row.toggleSelected(event.target.checked);
            }}
          />
        </span>
      </div>
    </>
  );
}
