import type { CellClassFn, FilterFn, GanttInfo, HeaderClassFn, SortFn } from "../../ui/Table/types";
import styles from "./styles.module.scss";
import type { RowData } from "./types";

const redCellClass: CellClassFn<GanttInfo<RowData>, { active?: boolean }> = (context, settings) => {
  if (settings?.active) {
    return styles["cell-red"];
  }
};
const blackCellClass: CellClassFn<GanttInfo<RowData>, { black?: boolean }> = (
  context,
  settings,
) => {
  if (settings?.black) {
    return styles["cell-black"];
  }
};

export const CELL_CLASSES = {
  customRed: redCellClass,
  customBlack: blackCellClass,
  customYellow: styles["cell-yellow"],
} as const;

const blueHeaderClass: HeaderClassFn<GanttInfo<RowData>, { active: boolean }> = (
  context,
  settings,
) => {
  if (settings?.active) {
    return styles["header-blue"];
  }
};
const whiteHeaderClass: HeaderClassFn<GanttInfo<RowData>, { white: boolean }> = (
  context,
  settings,
) => {
  if (settings?.white) {
    return styles["header-white"];
  }
};

export const HEADER_CLASSES = {
  customGreen: styles["header-green"],
  customWhite: whiteHeaderClass,
  customBlue: blueHeaderClass,
} as const;

const fuzzySearch: FilterFn<GanttInfo<RowData>> = () => true;

export const FILTER_TYPES = {
  customFuzzy: fuzzySearch,
} as const;

const sortArrayByLength: SortFn<GanttInfo<RowData>> = () => 0;

export const SORT_TYPES = {
  customArrayByLength: sortArrayByLength,
} as const;
