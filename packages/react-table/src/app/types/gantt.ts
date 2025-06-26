import type { GanttTypeShapes } from "../../types";

export type GanttCellRenderKeys = "test";
export type GanttHeaderRenderKeys = undefined;
export type GanttFilterRenderKeys = undefined;
export type GanttSortRenderKeys = undefined;
export type GanttCellClassKeys = undefined;
export type GanttHeaderClassKeys = undefined;
export type GanttFilterTypeKeys = undefined;
export type GanttSortTypeKeys = undefined;

export type RowGantt = {
  id: string;
  name: string;
  start: string;
  type?: GanttTypeShapes;
  end: string;
  dependents?: string[];
  children?: RowGantt[];
};

export type RowGanttVirtual = Omit<RowGantt, "children"> & {
  wide1: number;
  wide2: number;
  wide3: number;
  wide4: number;
  wide5: number;
  wide6: number;
  wide7: number;
  wide8: number;
  wide9: number;
  wide10: number;
  wide11: number;
  wide12: number;
  wide13: number;
  wide14: number;
  wide15: number;
  wide16: number;
  wide17: number;
  wide18: number;
  wide19: number;
  wide20: number;
  wide21: number;
  wide22: number;
  wide23: number;
  wide24: number;
  wide25: number;
  wide26: number;
  wide27: number;
  wide28: number;
  wide29: number;
  wide30: number;
  children?: RowGanttVirtual[];
};

export type GanttMeta = {};
