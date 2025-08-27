import type {
  CellRenderComponent,
  FilterRenderComponent,
  GanttInfo,
  HeaderRenderComponent,
  SortRenderComponent,
  TableColumn,
  TableDefaultColumnOptions,
} from "../../ui/Table/types";
import {
  type CELL_CLASSES,
  type FILTER_TYPES,
  type HEADER_CLASSES,
  type SORT_TYPES,
} from "./constants";

export type RowData = {
  id: string;
  firstName: string;
  birth: number;
  age: number;
  startWork: number;
  countWork: number;
  sport: string;
  colors: string[];
  approved: boolean | undefined;
  works: RowWork[];
  lastWork: RowWork;
  children?: RowData[];
};

export type RowWork = {
  address: string;
  duration: number;
};

export type Column = TableColumn<
  GanttInfo<RowData>,
  Record<string, CellRenderComponent<GanttInfo<RowData>>>,
  Record<string, HeaderRenderComponent<GanttInfo<RowData>>>,
  Record<string, FilterRenderComponent<GanttInfo<RowData>>>,
  Record<string, SortRenderComponent<GanttInfo<RowData>>>,
  typeof CELL_CLASSES,
  typeof HEADER_CLASSES,
  typeof FILTER_TYPES,
  typeof SORT_TYPES
>;
export type DefaultColumn = TableDefaultColumnOptions<
  GanttInfo<RowData>,
  Record<string, CellRenderComponent<GanttInfo<RowData>>>,
  Record<string, HeaderRenderComponent<GanttInfo<RowData>>>,
  Record<string, FilterRenderComponent<GanttInfo<RowData>>>,
  Record<string, SortRenderComponent<GanttInfo<RowData>>>,
  typeof CELL_CLASSES,
  typeof HEADER_CLASSES,
  typeof FILTER_TYPES,
  typeof SORT_TYPES
>;
