import { dateFormat, isArray, isBoolean, isId, isObject, isString } from "@krainovsd/js-helpers";
import { CheckBox, Tag, Tooltip } from "@krainovsd/react-ui";
import type { CellContext } from "@tanstack/react-table";
import type { PresetColorType } from "antd/es/theme/internal";
import clsx from "clsx";
import type { ReactNode } from "react";
import type React from "react";
import { useVisibleCell } from "../hooks/use-visible-cell";
import { getData } from "../lib";
import styles from "./cell-renders.module.scss";

export type CellRenderClasses = "hCenter" | "wCenter";

export type TextCellRenderProps<RowData extends Record<string, unknown>> = {
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

export function TextCellRender<Row extends Record<string, unknown>>(props: {
  context: CellContext<Row, unknown>;
}): ReactNode {
  const cellRenderProps = props.context.column.columnDef.cellRenderProps as
    | TextCellRenderProps<Row>
    | undefined;
  const Link = cellRenderProps?.Link;
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
            paddingLeft: cellRenderProps?.shift ? extraPadding * cellRenderProps.shift : undefined,
          }}
        >
          {isExpandable && Expander && <Expander context={props.context} />}
          <Link context={props.context}>
            {isString(tooltip) && (
              <Tooltip
                classNameContent={styles.tooltip}
                text={tooltip}
                autoTooltip={cellRenderProps?.autoTooltip}
                zIndex={cellRenderProps?.tooltipZ}
              >
                {Node}
              </Tooltip>
            )}
            {!isString(tooltip) && Node}
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
            paddingLeft: cellRenderProps?.shift ? extraPadding * cellRenderProps.shift : undefined,
          }}
        >
          {isExpandable && Expander && <Expander context={props.context} />}
          {isString(tooltip) && (
            <Tooltip
              classNameContent={styles.tooltip}
              text={tooltip}
              autoTooltip={cellRenderProps?.autoTooltip}
              zIndex={cellRenderProps?.tooltipZ}
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

export type DateCellRenderProps<RowData extends Record<string, unknown>> = {
  format: string;
  expanded?: boolean;
  shift?: number;
  classes?: CellRenderClasses[];
  className?: ((context: CellContext<RowData, unknown>) => string) | string;
};

export function DateCellRender<Row extends Record<string, unknown>>(props: {
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
          paddingLeft: cellRenderProps.shift ? extraPadding * cellRenderProps.shift : undefined,
        }}
      >
        {isExpandable && Expander && <Expander context={props.context} />}
        <span className={styles.base}>{date}</span>
      </div>
    </>
  );
}

export type TagCellRenderProps<Row extends Record<string, unknown>> = {
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

export function TagCellRender<Row extends Record<string, unknown>>(props: {
  context: CellContext<Row, unknown>;
}): ReactNode {
  const cellRenderProps = props.context.column.columnDef.cellRenderProps as
    | TagCellRenderProps<Row>
    | undefined;
  const { isVisible } = useVisibleCell(props.context);
  if (!cellRenderProps) return;

  const tooltip = cellRenderProps?.pathToTooltip
    ? getData(props.context.row.original, cellRenderProps.pathToTooltip)
    : undefined;
  const renderTooltip = tooltip != undefined ? (isArray(tooltip) ? tooltip : [tooltip]) : undefined;
  const rowValue = getData(props.context.row.original, props.context.column.id);
  const rowContent =
    cellRenderProps?.content?.(props.context) ??
    getData(props.context.row.original, props.context.column.id);
  const renderContent = isArray(rowContent) ? rowContent : [rowContent];
  const renderValue = isArray(rowValue) ? rowValue : [rowValue];

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
export type SelectCellRenderProps<RowData extends Record<string, unknown>> = {
  Check?: CheckProps;
  shift?: number;
  classes?: CellRenderClasses[];
  hover?: boolean;
  className?: ((context: CellContext<RowData, unknown>) => string) | string;
};

export function SelectCellRender<Row extends Record<string, unknown>>(props: {
  context: CellContext<Row, unknown>;
}): ReactNode {
  const cellRenderProps = props.context.column.columnDef.cellRenderProps as
    | SelectCellRenderProps<Row>
    | undefined;
  const { isVisible, extraPadding } = useVisibleCell(props.context);
  const Check = cellRenderProps?.Check ?? CheckBox;

  const number = cellRenderProps?.hover
    ? props.context.row.id
        .split(".")
        .map((id) => +id + 1)
        .join(".")
    : 0;

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
          paddingLeft: cellRenderProps?.shift ? extraPadding * cellRenderProps.shift : undefined,
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
