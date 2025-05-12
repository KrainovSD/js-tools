import type { VirtualItem } from "@tanstack/react-virtual";
import type { RowInterface } from "../../types";
import { TableCell } from "./table-cell";
import styles from "./table-row.module.scss";

type Props<RowData extends Record<string, unknown>> = {
  row: RowInterface<RowData>;
  columnsVirtual: VirtualItem[];
  columnVirtualEnabled: boolean;
};

export function TableRow<RowData extends Record<string, unknown>>(props: Props<RowData>) {
  const centerVisibleCells = props.row.getCenterVisibleCells();

  return (
    <>
      {props.columnVirtualEnabled && (
        <>
          {props.row.getLeftVisibleCells().map((cell, index, cells) => {
            /** CELL */

            return (
              <TableCell
                key={`${cell.id}-cell`}
                cell={cell}
                index={index}
                cells={cells}
                semanticTag
              />
            );
          })}
          {props.columnsVirtual.map((virtualColumn) => {
            /** CELL */

            const cell = centerVisibleCells[virtualColumn.index];

            return (
              <TableCell
                key={`${cell.id}-cell`}
                cell={cell}
                index={virtualColumn.index}
                cells={centerVisibleCells}
                virtualLeft={virtualColumn.start}
                semanticTag
              />
            );
          })}
          {props.row.getRightVisibleCells().length > 0 && <div className={styles.ghost}></div>}
          {props.row.getRightVisibleCells().map((cell, index, cells) => {
            /** CELL */

            return (
              <TableCell
                key={`${cell.id}-cell`}
                cell={cell}
                index={index}
                cells={cells}
                semanticTag
              />
            );
          })}
        </>
      )}
      {!props.columnVirtualEnabled &&
        props.row.getVisibleCells().map((cell, index, cells) => {
          /** CELL */

          return (
            <TableCell
              key={`${cell.id}-cell`}
              cell={cell}
              index={index}
              cells={cells}
              semanticTag
            />
          );
        })}
    </>
  );
}
