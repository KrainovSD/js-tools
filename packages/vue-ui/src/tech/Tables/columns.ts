import type { Column, DefaultColumn } from "./types";

// export const DEFAULT_COLUMN: DefaultColumn = {
//   cellRender: "customNumber",
//   headerRender: "custom",
//   filterRender: "customNumber",
//   sortRender: "customDoubleArrow",
//   cellClass: ["customRed"],
//   headerClass: ["customBlue"],
//   filterType: "customFuzzy",
//   sortType: "customArrayByLength",
// };

// export const COLUMNS: Column[] = [
//   {
//     key: "test",
//     name: "test",
//     filterable: true,
//     grouping: true,
//     cellRender: {
//       component: "customArray",
//       props: { pathToObject: "path" },
//     },
//     headerRender: {
//       component: "custom",
//       props: { withFilter: true },
//     },
//     filterRender: {
//       component: "customNumber",
//       props: { max: 0, min: -5 },
//     },
//     sortRender: {
//       component: "customOneArrow",
//       props: { field: "CURRENT" },
//     },
//     cellClass: ["customRed", "customBlack"],
//     additionalCellClass: ["customYellow"],
//     cellClassProps: { active: true, black: false },
//     headerClass: ["customBlue", "customGreen"],
//     additionalHeaderClass: ["customWhite"],
//     headerClassProps: { active: true, white: false },
//     filterType: "equals",
//     sortType: "customArrayByLength",
//   },
// ];

export const DEFAULT_COLUMN: DefaultColumn = {
  cellRender: "default",
  headerRender: "default",
  filterRender: "string",
  sortRender: "double-arrow",
  cellClass: ["common", "lineClamp"],
  headerClass: ["common", "lineClamp"],
  filterType: "equals",
  sortType: "string",
  filterable: false,
  sortable: true,
  draggable: true,
  resizable: true,
  sortDirectionFirst: "asc",
};

export const COLUMNS: Column[] = [
  {
    key: "id",
    name: "id",
    cellRender: {
      component: "default",
    },
  },
];
