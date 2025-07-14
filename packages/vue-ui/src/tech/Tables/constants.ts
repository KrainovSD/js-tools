import type { CellClassFn, FilterFn, HeaderClassFn, SortFn } from "../../ui/Table/types";
import ArrayCellRender from "./CellRenders/ArrayCellRender.vue";
import NumberCellRender from "./CellRenders/NumberCellRender.vue";
import NumberFilterRender from "./FilterRenders/NumberFilterRender.vue";
import SelectFilterRender from "./FilterRenders/SelectFilterRender.vue";
import CustomHeaderRender from "./HeaderRenders/CustomHeaderRender.vue";
import DoubleArrowSortRender from "./SortRenders/DoubleArrowSortRender.vue";
import OneArrowSortRender from "./SortRenders/OneArrowSortRender.vue";
import styles from "./styles.module.scss";
import type { RowData } from "./types";

export const CELL_RENDERS = {
  customNumber: NumberCellRender,
  customArray: ArrayCellRender,
} as const;

export const HEADER_RENDERS = {
  custom: CustomHeaderRender,
} as const;

export const FILTER_RENDERS = {
  customNumber: NumberFilterRender,
  customSelect: SelectFilterRender,
} as const;

export const SORT_RENDERS = {
  customOneArrow: OneArrowSortRender,
  customDoubleArrow: DoubleArrowSortRender,
} as const;

const redCellClass: CellClassFn<RowData, { active?: boolean }> = (context, settings) => {
  if (settings?.active) {
    return styles["cell-red"];
  }
};
const blackCellClass: CellClassFn<RowData, { black?: boolean }> = (context, settings) => {
  if (settings?.black) {
    return styles["cell-black"];
  }
};

export const CELL_CLASSES = {
  customRed: redCellClass,
  customBlack: blackCellClass,
  customYellow: styles["cell-yellow"],
} as const;

const blueHeaderClass: HeaderClassFn<RowData, { active: boolean }> = (context, settings) => {
  if (settings?.active) {
    return styles["header-blue"];
  }
};
const whiteHeaderClass: HeaderClassFn<RowData, { white: boolean }> = (context, settings) => {
  if (settings?.white) {
    return styles["header-white"];
  }
};

export const HEADER_CLASSES = {
  customGreen: styles["header-green"],
  customWhite: whiteHeaderClass,
  customBlue: blueHeaderClass,
} as const;

const fuzzySearch: FilterFn<RowData> = () => true;

export const FILTER_TYPES = {
  customFuzzy: fuzzySearch,
} as const;

const sortArrayByLength: SortFn<RowData> = () => 0;

export const SORT_TYPES = {
  customArrayByLength: sortArrayByLength,
} as const;
