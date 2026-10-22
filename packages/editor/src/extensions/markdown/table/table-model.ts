import { StateEffect } from "@codemirror/state";
import type { SyntaxNode } from "@lezer/common";

export const setTableModeEffect = StateEffect.define<TableMode>();
export const setFocusEffect = StateEffect.define<boolean>();

export const NAME_OF_TABLE = "Table";
export const NAME_OF_TABLE_HEADER = "TableHeader";
export const NAME_OF_TABLE_ROW = "TableRow";
export const NAME_OF_TABLE_CELL = "TableCell";
export const NAME_OF_TABLE_DELIMITER = "TableDelimiter";
export const MIN_COLUMN_WIDTH = 3;

export type TableMode = "source" | "editor";
export type TableAlignment = "left" | "center" | "right";
export type TableCellModel = {
  row: number;
  col: number;
  from: number;
  to: number;
  text: string;
  node: SyntaxNode | null;
};
export type TableModel = {
  from: number;
  to: number;
  rowCount: number;
  colCount: number;
  alignments: (TableAlignment | undefined)[];
  delimiterWidths: number[];
  cells: TableCellModel[];
  replaceable: boolean;
  triggerFrom: number;
  triggerTo: number;
};
export type TableRow = {
  cells: TableCellModel[];
  lineTo: number;
};
export type TableMatrix = {
  alignments: (TableAlignment | undefined)[];
  widths: number[];
  rows: string[][];
};
