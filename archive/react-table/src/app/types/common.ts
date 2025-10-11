import type { TableColumn } from "../../types";
import type {
  CELL_CLASSES,
  CELL_RENDERS,
  FILTER_RENDERS,
  FILTER_TYPES,
  HEADER_CLASSES,
  HEADER_RENDERS,
  SORT_RENDERS,
  SORT_TYPES,
} from "../lib/common/columns";

export type CommonRow = {
  id: string;
  country: string;
  firstName: string;
  lastName: string;
  description?: string;
  date: string;
  colors: string[];
  age: number;
  year: number;
  sport: string;
  checked: boolean;
  children?: CommonRow[];
  _EXPANDED_ROW?: boolean;
};

export type Column = TableColumn<
  CommonRow,
  typeof CELL_RENDERS,
  typeof HEADER_RENDERS,
  typeof FILTER_RENDERS,
  typeof SORT_RENDERS,
  typeof CELL_CLASSES,
  typeof HEADER_CLASSES,
  typeof FILTER_TYPES,
  typeof SORT_TYPES
>;
