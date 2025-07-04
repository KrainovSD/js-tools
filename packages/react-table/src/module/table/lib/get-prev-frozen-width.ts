import type { Cell, ColumnPinningPosition, Header } from "@tanstack/react-table";
import type { DefaultRow } from "../../../types";

type GetPrevFrozenWidthCellsOptions<Row extends DefaultRow> = {
  frozenPosition: ColumnPinningPosition;
  index: number;
  cells: Cell<Row, unknown>[];
};

export function getPrevFrozenWidthCell<Row extends DefaultRow>(
  opts: GetPrevFrozenWidthCellsOptions<Row>,
) {
  switch (opts.frozenPosition) {
    case "left": {
      if (opts.index === 0) return 0;
      let sum = 0;

      for (let i = 0; i < opts.index; i++) {
        sum += opts.cells[i].column.getSize();
      }

      return sum;
    }
    case "right": {
      if (opts.index === opts.cells.length - 1) return 0;
      let sum = 0;

      for (let i = opts.index + 1; i < opts.cells.length; i++) {
        sum += opts.cells[i].column.getSize();
      }

      return sum;
    }
    default: {
      return 0;
    }
  }
}

type GetPrevFrozenWidthHeaderOptions<Row extends DefaultRow> = {
  frozenPosition: ColumnPinningPosition;
  index: number;
  headers: Header<Row, unknown>[];
};

export function getPrevFrozenWidthHeader<Row extends DefaultRow>(
  opts: GetPrevFrozenWidthHeaderOptions<Row>,
) {
  switch (opts.frozenPosition) {
    case "left": {
      if (opts.index === 0) return 0;
      let sum = 0;

      for (let i = 0; i < opts.index; i++) {
        sum += opts.headers[i].getSize();
      }

      return sum;
    }
    case "right": {
      if (opts.index === opts.headers.length - 1) return 0;
      let sum = 0;

      for (let i = opts.index + 1; i < opts.headers.length; i++) {
        sum += opts.headers[i].getSize();
      }

      return sum;
    }
    default: {
      return 0;
    }
  }
}
