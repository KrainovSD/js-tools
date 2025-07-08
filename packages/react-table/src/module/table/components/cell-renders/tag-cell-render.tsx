import { isArray, isBoolean, isId, isObject } from "@krainovsd/js-helpers";
import { Tag } from "@krainovsd/react-ui";
import type { PresetColorType } from "antd/es/theme/internal";
import type { CellRenderProps, DefaultRow } from "../../../../types";
import { useVisibleCell } from "../../hooks";
import { CellRenderTooltip } from "../cell-render-tooltip";
import { CellRenderWrapper } from "../cell-render-wrapper";
import styles from "./tag-cell-render.module.scss";

export type TagColor = keyof PresetColorType | "default";

export type TagCellRenderProps = {
  color?: TagColor | ((content: unknown) => TagColor);
  mappings?: Record<string, string>;
  bordered?: boolean;
  filterable?: boolean;
};

export type TagContent = {
  label: string;
  value: string | number | boolean;
  color: TagColor;
};

export function TagCellRender<RowData extends DefaultRow>(props: CellRenderProps<RowData>) {
  const column = props.context.column.columnDef;
  const cellRenderProps = (column.cellRenderProps as TagCellRenderProps) ?? {};

  const { isVisible, level } = useVisibleCell(props.context);
  const isExpandable =
    props.context.column?.columnDef?.expandable && props.context.row.getCanExpand();
  const Expander = props.context.table.options.meta?.renderers?.expander;
  const filterable =
    props.context.column.columnDef.enableColumnFilter && cellRenderProps.filterable;

  let initialContent: unknown[] = props.context.column.accessorFn?.(
    props.context.row.original,
    props.context.row.index,
  ) as unknown[];
  if (!isArray(initialContent)) {
    initialContent = [initialContent];
  }
  const content: TagContent[] = initialContent.reduce((acc: TagContent[], content) => {
    if (isId(content) || isBoolean(content)) {
      let color: TagColor = "default";
      let label = String(content);

      if (cellRenderProps.color) {
        if (typeof cellRenderProps.color === "function") {
          color = cellRenderProps.color(content);
        } else {
          color = cellRenderProps.color;
        }
      }
      if (isObject(cellRenderProps.mappings)) {
        label = cellRenderProps.mappings[label] ?? content;
      }

      acc.push({ color, value: content, label });
    }

    return acc;
  }, []);

  if (!isVisible) return null;

  return (
    <CellRenderWrapper
      column={column}
      context={props.context}
      level={level}
      className={styles.base}
    >
      <CellRenderTooltip
        content={content
          .map((item) => item.label)
          .join(isObject(column.tooltip) ? (column.tooltip.arraySeparator ?? ", ") : ", ")}
        row={props.context.row.original}
        tooltip={column.tooltip}
      >
        {isExpandable && Expander && <Expander context={props.context} />}
        {content.map((tag, index) => {
          return (
            <Tag
              key={index}
              className={styles.tag}
              bordered={cellRenderProps.bordered}
              color={tag.color}
              style={{ cursor: filterable ? "pointer" : "inherit" }}
              onClick={(event) => {
                if (!filterable) return;

                event.stopPropagation();

                const filterRenderProps = props.context.column.columnDef.filterRenderProps;
                const multiple =
                  isObject(filterRenderProps) && "multiple" in filterRenderProps
                    ? filterRenderProps.multiple
                    : false;

                const filterValue = props.context.column.getFilterValue();

                if (multiple) {
                  const checkedFilterValue = isArray(filterValue) ? [...filterValue] : [];

                  const oldIndex = checkedFilterValue.findIndex((fv) => fv === tag.value);
                  if (oldIndex != -1) {
                    checkedFilterValue.splice(oldIndex, 1);
                  } else {
                    checkedFilterValue.push(tag.value);
                  }

                  if (checkedFilterValue.length === 0) {
                    props.context.column.setFilterValue(undefined);
                  } else {
                    props.context.column.setFilterValue(checkedFilterValue);
                  }
                } else {
                  props.context.column.setFilterValue(tag.value);
                }
              }}
            >
              {tag.label}
            </Tag>
          );
        })}
      </CellRenderTooltip>
    </CellRenderWrapper>
  );
}
