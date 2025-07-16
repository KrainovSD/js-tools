import type { TableColumn, TableDefaultColumnOptions } from "../../ui/Table/types";
import {
  type CELL_CLASSES,
  type CELL_RENDERS,
  type FILTER_RENDERS,
  type FILTER_TYPES,
  type HEADER_CLASSES,
  type HEADER_RENDERS,
  type SORT_RENDERS,
  type SORT_TYPES,
} from "./constants";

export type RowData = {
  id: number;
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
  RowData,
  typeof CELL_RENDERS,
  typeof HEADER_RENDERS,
  typeof FILTER_RENDERS,
  typeof SORT_RENDERS,
  typeof CELL_CLASSES,
  typeof HEADER_CLASSES,
  typeof FILTER_TYPES,
  typeof SORT_TYPES
>;
export type DefaultColumn = TableDefaultColumnOptions<
  RowData,
  typeof CELL_RENDERS,
  typeof HEADER_RENDERS,
  typeof FILTER_RENDERS,
  typeof SORT_RENDERS,
  typeof CELL_CLASSES,
  typeof HEADER_CLASSES,
  typeof FILTER_TYPES,
  typeof SORT_TYPES
>;
