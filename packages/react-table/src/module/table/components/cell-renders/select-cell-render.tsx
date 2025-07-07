import { CheckBox } from "@krainovsd/react-ui";
import clsx from "clsx";
import type { ReactNode } from "react";
import type { CellContext, CellRenderProps, DefaultRow, RowInterface } from "../../../../types";
import { useVisibleCell } from "../../hooks";
import { CellRenderWrapper } from "../cell-render-wrapper";
import styles from "./select-cell-render.module.scss";

type CheckProps = (props: {
  checked: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}) => ReactNode;
export type SelectCellRenderProps = {
  Check?: CheckProps;
  hover?: boolean;
};

export function SelectCellRender<Row extends DefaultRow>(props: CellRenderProps<Row>): ReactNode {
  const column = props.context.column.columnDef;
  const cellRenderProps = (column.cellRenderProps as SelectCellRenderProps) ?? {};

  const { isVisible, level } = useVisibleCell(props.context);
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
    <CellRenderWrapper
      column={column}
      context={props.context}
      level={level}
      className={styles.select}
      onClick={(event) => event.stopPropagation()}
      onDoubleClick={(event) => event.stopPropagation()}
    >
      {hover && <span className={clsx(hover && styles.number)}>{number}</span>}
      <span className={clsx(hover && styles.check)}>
        <Check
          checked={checked}
          onChange={(event) => {
            props.context.row.toggleSelected(event.target.checked);
          }}
        />
      </span>
    </CellRenderWrapper>
  );
}

function collectNumberRecursively<Row extends DefaultRow>(
  context: CellContext<Row>,
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
