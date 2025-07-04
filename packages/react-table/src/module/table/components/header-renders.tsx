import { CheckBox } from "@krainovsd/react-ui";
import type { HeaderContext } from "@tanstack/react-table";
import clsx from "clsx";
import type { DefaultRow } from "../../../types";
import styles from "./header-renders.module.scss";

export type HeaderRenderClasses = "hCenter" | "wCenter";

export type CommonHeaderRenderProps<RowData extends DefaultRow> = {
  classes?: HeaderRenderClasses[];
  className?: ((context: HeaderContext<RowData, unknown>) => string) | string;
};
export function CommonHeaderRender<RowData extends DefaultRow>(props: {
  context: HeaderContext<RowData, unknown>;
}) {
  const headerRenderProps = props.context.column.columnDef.headerRenderProps as
    | CommonHeaderRenderProps<RowData>
    | undefined;
  const SortRender = props.context.column.columnDef.sortRender;
  const canSort = props.context.column.getCanSort();

  return (
    <div
      className={clsx(
        styles.container,
        headerRenderProps?.classes?.map?.((style) => styles[`container__${style}`]),
        typeof headerRenderProps?.className === "function"
          ? headerRenderProps.className(props.context)
          : headerRenderProps?.className,
      )}
    >
      <span className={styles.base}>{props.context.column.columnDef.name}</span>
      {canSort && SortRender && <SortRender context={props.context} />}
    </div>
  );
}

type CheckProps = (props: {
  checked: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}) => React.ReactNode;
export type SelectHeaderRenderProps<RowData extends DefaultRow> = {
  Check?: CheckProps;
  classes?: HeaderRenderClasses[];
  className?: ((context: HeaderContext<RowData, unknown>) => string) | string;
};
export function SelectHeaderRender<RowData extends DefaultRow>(props: {
  context: HeaderContext<RowData, unknown>;
}) {
  const headerRenderProps = props.context.column.columnDef.headerRenderProps as
    | SelectHeaderRenderProps<RowData>
    | undefined;
  const Check = headerRenderProps?.Check ?? CheckBox;
  const checked = props.context.table.getIsAllPageRowsSelected();

  return (
    <div
      className={clsx(
        styles.container,
        headerRenderProps?.classes?.map?.((style) => styles[`container__${style}`]),
        typeof headerRenderProps?.className === "function"
          ? headerRenderProps.className(props.context)
          : headerRenderProps?.className,
      )}
    >
      <Check
        checked={checked}
        onChange={() => {
          props.context.table.toggleAllPageRowsSelected();
        }}
      />
    </div>
  );
}
