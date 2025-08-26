import type { GanttTypeShapes, TableColumn } from "../../types";

export type RowGantt = {
  id: string;
  name: string;
  start: string;
  type?: GanttTypeShapes;
  end: string;
  dependents?: string[];
  children?: RowGantt[];
};

export type GanttMeta = {};

export type GanttColumn = TableColumn<RowGantt>;
