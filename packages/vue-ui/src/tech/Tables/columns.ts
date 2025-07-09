import type { Column, DefaultColumn } from "./types";

export const DEFAULT_COLUMN: DefaultColumn = {
  cellRender: "customNumber",
  headerRender: "custom",
  filterRender: "customNumber",
  sortRender: "customDoubleArrow",
  cellClass: ["customRed"],
  headerClass: ["customBlue"],
  filterType: "customFuzzy",
  sortType: "customArrayByLength",
};

export const COLUMNS: Column[] = [
  {
    key: "test",
    name: "test",
    cellRender: "customArray",
    cellRenderProps: { pathToObject: "path" },
    headerRender: "custom",
    headerRenderProps: { withFilter: true },
    filterRender: "customNumber",
    filterRenderProps: { max: 0, min: -5 },
    sortRender: "customOneArrow",
    sortRenderProps: { field: "CURRENT" },
    cellClass: ["customRed", "customBlack"],
    additionalCellClass: ["customYellow"],
    cellClassProps: { active: true, black: false },
    headerClass: ["customBlue", "customGreen"],
    additionalHeaderClass: ["customWhite"],
    headerClassProps: { active: true, white: false },
    filterType: "customFuzzy",
    sortType: "customArrayByLength",
  },
];
