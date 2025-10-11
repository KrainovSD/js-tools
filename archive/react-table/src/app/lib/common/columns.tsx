import type { CellClassFn, FilterFn, HeaderClassFn, SortFn } from "../../../types";
import { TestCellRender } from "../../components/test-cell-render";
import { TestFilterRender } from "../../components/test-filter-render";
import { TestHeaderRender } from "../../components/test-header-render";
import { TestSortRender } from "../../components/test-sort-render";
import type { Column, CommonRow } from "../../types/common";

export const CELL_RENDERS = {
  test: TestCellRender,
} as const;
export const HEADER_RENDERS = {
  test: TestHeaderRender,
} as const;
export const FILTER_RENDERS = {
  test: TestFilterRender,
} as const;
export const SORT_RENDERS = {
  test: TestSortRender,
} as const;

const redCellClass: CellClassFn<CommonRow, { active?: boolean }> = (context, settings) => {
  if (settings?.active) {
    return "cell-red";
  }
};
const blackCellClass: CellClassFn<CommonRow, { black?: boolean }> = (context, settings) => {
  if (settings?.black) {
    return "cell-black";
  }
};
export const CELL_CLASSES = {
  customRed: redCellClass,
  customBlack: blackCellClass,
  customYellow: "cell-yellow",
} as const;

const blueHeaderClass: HeaderClassFn<CommonRow, { active: boolean }> = (context, settings) => {
  if (settings?.active) {
    return "header-blue";
  }
};
const whiteHeaderClass: HeaderClassFn<CommonRow, { white: boolean }> = (context, settings) => {
  if (settings?.white) {
    return "header-white";
  }
};
export const HEADER_CLASSES = {
  customGreen: "header-green",
  customWhite: whiteHeaderClass,
  customBlue: blueHeaderClass,
} as const;

const fuzzySearch: FilterFn<CommonRow> = () => true;
export const FILTER_TYPES = {
  customFuzzy: fuzzySearch,
} as const;

const sortArrayByLength: SortFn<CommonRow> = () => 0;
export const SORT_TYPES = {
  customArrayByLength: sortArrayByLength,
} as const;

export const testTypesColumns: Column[] = [
  {
    key: "description",
    name: "test",
    cellRender: { component: "test", props: {} },
    headerRender: { component: "test", props: {} },
    filterRender: { component: "test", props: {} },
    sortRender: { component: "test", props: {} },
    cellClass: ["customBlack", "customRed"],
    additionalCellClass: ["customYellow"],
    cellClassProps: { active: true },
    headerClass: ["customBlue", "customGreen"],
    additionalHeaderClass: ["customWhite"],
    headerClassProps: { active: false },
    filterType: "customFuzzy",
    sortType: "customArrayByLength",
  },
];

export const COMMON_COLUMNS: Column[] = [
  //   SelectColumn,
  {
    id: "_select",
    key: "id",
    name: "",
    width: 50,
    resizable: false,
    draggable: false,
    leftFrozen: true,
    sortable: false,
    filterable: false,
    cellRender: {
      component: "select",
      props: { hover: true },
    },
    headerRender: {
      component: "select",
    },
    additionalCellClass: ["wCenter", "hCenter"],
    additionalHeaderClass: ["hCenter", "wCenter"],
  },
  {
    key: "id",
    name: "ID",
    width: 100,
    resizable: true,
    sortType: "string-with-number",
    draggable: false,
    additionalCellClass: ["hCenter"],
    additionalHeaderClass: ["hCenter"],
    leftFrozen: true,
  },
  {
    key: "firstName",
    name: "First Name",
    resizable: true,
    draggable: true,
    sortable: true,
    expandable: true,
    expandedShift: 8,
    filterRender: {
      component: "string",
    },
    filterable: true,
    filterType: "includes-string",
    additionalCellClass: ["lineClamp", "hCenter"],
    additionalHeaderClass: ["hCenter", "nowrap"],
    tooltip: {
      auto: true,
    },
  },
  {
    key: "lastName",
    name: "Last Name",
    width: 200,
    filterable: true,
    filterRender: {
      component: "string",
    },
    filterType: "includes-string",
    resizable: true,
    draggable: true,
    sortable: true,
    additionalCellClass: ["hCenter"],
    // leftFrozen: true,
  },
  {
    key: "description",
    name: "Очень длинное название колонки для тестов переноса строк",
    width: 234,
    filterable: true,
    filterRender: {
      component: "string",
    },
    filterType: "includes-string",
    resizable: true,
    draggable: true,
    sortable: true,
    additionalCellClass: ["lineClamp"],
    headerClass: ["common", "lineClamp"],
    tooltip: {
      auto: true,
      pathToContent: "description",
    },
    cellRender: {
      component: "default",
      props: {
        Link: (props) => {
          // eslint-disable-next-line react/prop-types
          return <a href={props.context.row.original.country}>{props.children}</a>;
        },
      },
    },
    // leftFrozen: true,
  },
  {
    key: "colors",
    name: "Colors",
    width: 200,
    resizable: true,
    draggable: false,
    sortType: "array",
    filterable: true,
    filterType: "array-every-in-array",
    filterRender: {
      component: "select",
      props: {
        multiple: true,
        options: [
          { label: "gold", value: "gold" },
          { label: "pink", value: "pink" },
          { label: "white", value: "white" },
          { label: "teal", value: "teal" },
        ],
      },
    },

    additionalCellClass: ["empty", "lineClamp"],
    cellRender: {
      component: "tag",
      props: { filterable: true },
    },
    tooltip: {
      auto: true,
    },
  },
  {
    key: "year",
    name: "Year",
    width: 200,
    resizable: true,
    filterable: true,
    draggable: false,
    filterType: "array-some-in-primitive",
    filterRender: {
      component: "select",
      props: {
        multiple: true,
        options: [
          { label: "2018", value: 2018 },
          { label: "2017", value: 2017 },
          { label: "2016", value: 2016 },
          { label: "2015", value: 2015 },
        ],
      },
    },
    // grouping: true,
  },
  {
    key: "age",
    name: "Age",
    width: 100,
    resizable: true,
    draggable: false,
    sortType: "number",
    filterable: true,
    filterRender: {
      component: "number-range",
    },
    filterType: "equals",
    rightFrozen: true,
  },
  {
    key: "checked",
    name: "Checked",
    width: 100,
    resizable: true,
    draggable: false,
    sortType: "boolean",
    rightFrozen: true,
  },
  {
    key: "country",
    name: "Country",
    width: 200,
    draggable: false,
    resizable: true,
    // grouping: true,
  },
  {
    key: "sport",
    name: "Sport",
    width: 200,
    draggable: false,
    resizable: true,
  },
  {
    key: "date",
    name: "Date",
    width: 500,
    sortType: "date",
    resizable: false,
    draggable: false,
    cellRender: {
      component: "default",
      props: {
        dateFormat: "DD/MM/YYYY",
      },
    },

    filterable: true,
    filterRender: {
      component: "date-range",
      props: {
        format: "DD/MM/YYYY",
      },
    },
    filterType: "date-in-range",
  },
];

export const COMMON_COLUMNS_VIRTUAL: Column[] = [
  ...COMMON_COLUMNS,
  ...Array.from<unknown, Column>({ length: 30 }, (_, index) => ({
    id: `wide${index + 1}`,
    key: "id",
    name: `wide${index + 1}`,
    draggable: false,
    resizable: true,
  })),
];
