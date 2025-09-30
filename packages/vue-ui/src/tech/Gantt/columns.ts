import { h } from "vue";
import { VButton } from "../../ui";
import { COLORS, COLORS_MAPPED, SPORTS } from "./rows";
import type { Column, DefaultColumn } from "./types";

export const EXAMPLE_DEFAULT_COLUMN: DefaultColumn = {
  cellRender: "customNumber",
  headerRender: "custom",
  filterRender: "customNumber",
  sortRender: "customDoubleArrow",
  cellClass: ["customRed"],
  headerClass: ["customBlue"],
  filterType: "customFuzzy",
  sortType: "customArrayByLength",
};

export const EXAMPLE_CUSTOM_COLUMN: Column[] = [
  {
    key: "data.age",
    name: "test",
    filterable: true,
    grouping: true,
    cellRender: {
      component: "customArray",
      props: { pathToObject: "path" },
    },
    headerRender: {
      component: "custom",
      props: { withFilter: true },
    },
    filterRender: {
      component: "customNumber",
      props: { max: 0, min: -5 },
    },
    sortRender: {
      component: "customOneArrow",
      props: { field: "CURRENT" },
    },
    cellClass: ["customRed", "customBlack"],
    additionalCellClass: ["customYellow"],
    cellClassProps: { active: true, black: false },
    headerClass: ["customBlue", "customGreen"],
    additionalHeaderClass: ["customWhite"],
    headerClassProps: { active: true, white: false },
    filterType: "equals",
    sortType: "customArrayByLength",
  },
];

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
    id: "select",
    key: "id",
    name: "",
    sortable: false,
    width: 100,
    additionalCellClass: ["hCenter", "wCenter"],
    cellRender: {
      component: "select",
      props: { hover: true },
    },
    additionalHeaderClass: ["hCenter", "wCenter"],
    headerRender: {
      component: "select",
    },
    expandable: true,
    leftFrozen: true,
  },
  {
    key: "data.firstName",
    name: "firstName",
    filterable: true,
    filterType: "includes-string",
    filterRender: {
      component: "string",
      props: { placeholder: "Введите имя", allowClear: true },

      displayValue: "text",
    },
    sortRender: {
      component: "single-arrow",
    },
    cellRender: {
      component: "default",
      props: {},
    },
    width: 150,
    tooltip: {
      auto: true,
    },
    expandedShift: 0,
  },
  {
    key: "data.birth",
    name: "birth",
    filterable: true,
    filterType: "date-in-range",
    filterRender: {
      component: "date-range",
      props: { format: "DD/MM/YYYY" },
      displayValue: "date-range",
    },
    cellRender: {
      component: "default",
      props: { dateFormat: "DD/MM/YYYY" },
    },
    minWidth: 150,
  },
  {
    key: "data.age",
    name: "age",
    filterable: true,
    filterType: "not-number-in-range",
    filterRender: {
      component: "number-range",
      props: { min: 18, max: 100 },
      displayValue: "number-range",
    },
    cellRender: {
      component: "default",
      props: { floatFixed: 2 },
    },
    width: 150,
  },
  {
    key: "data.startWork",
    name: "startWork",
    filterable: true,
    filterType: "date",
    filterRender: [
      {
        component: "date",
        props: { format: "DD/MM/YYYY" },
        operatorLabel: "Равно Дате",
        operatorValue: "date",
        displayValue: "date",
      },
      {
        component: "date-range",
        props: { format: "DD/MM/YYYY" },
        operatorLabel: "Между датами",
        operatorValue: "date-in-range",
        displayValue: "date-range",
        clearTag: "date-range",
      },
      {
        component: "date-range",
        props: { format: "DD/MM/YYYY" },
        operatorLabel: "Не между датами",
        operatorValue: "not-date-in-range",
        displayValue: "date-range",
        clearTag: "date-range",
      },
    ],
    cellRender: {
      component: "default",
      props: { dateFormat: "DD/MM/YYYY" },
    },
    width: 150,
  },
  {
    key: "data.countWork",
    name: "countWork",
    filterable: true,
    filterType: "equals",
    filterRender: {
      component: "number",
      props: { min: 0, max: 5 },
      displayValue: "number",
    },
    cellRender: {
      component: "default",
      props: { floatFixed: 2 },
    },
    width: 150,
  },
  {
    key: "data.sport",
    name: "sport",
    filterable: true,
    filterType: "equals",
    filterRender: {
      component: "select",
      displayValue: "select",
      props: { options: SPORTS.map((sport) => ({ label: sport, value: sport })) },
    },
    cellRender: {
      component: "default",
    },
    width: 150,
  },
  {
    id: "tags",
    key: "data.colors",
    name: "colors_2",
    additionalCellClass: ["nowrap"],
    cellRender: {
      component: "default",
      props: {
        arraySeparator: " | ",
      },
    },
    width: 150,
    tooltip: {
      auto: true,
    },
  },
  {
    key: "data.colors",
    name: "colors",
    additionalCellClass: ["nowrap", "wCenter", "hCenter"],
    filterable: true,
    filterType: "includes-array-some",
    filterRender: [
      {
        component: "select",
        displayValue: "select",
        props: { options: COLORS.map((color) => ({ label: color, value: color })), multiple: true },
        operatorLabel: "==",
        operatorValue: "includes-array-some",
      },
    ],
    cellRender: {
      component: "tag",
      props: {
        bordered: true,
        color: (content) => {
          return COLORS_MAPPED[String(content) as keyof typeof COLORS_MAPPED] ?? "default";
        },
        filterable: true,
        mappings: { Red: "Красный" },
        size: "default",
      },
    },
    width: 150,
    tooltip: {
      auto: false,
    },
  },
  {
    key: "data.approved",
    name: "approved",
    cellRender: {
      component: "default",
      props: { mappings: { true: "Yes", false: "No", undefined: "Not known" } },
    },
    width: 150,
  },
  {
    key: "data.works",
    name: "works",
    additionalCellClass: ["lineClamp"],
    cellRender: {
      component: "default",
      props: { arraySeparator: ", ", objectPath: "address" },
    },
    width: 150,
    tooltip: {
      auto: true,
    },
  },
  {
    key: "data.lastWork",
    name: "lastWork",
    additionalCellClass: ["lineClamp"],
    cellRender: {
      component: "default",
      props: { objectPath: "address" },
    },
    width: 150,
    tooltip: {
      auto: true,
    },
  },
  {
    id: "custom",
    key: "id",
    name: "custom",
    width: 150,
    additionalCellClass: ["hCenter", "wCenter"],
    cellRender: {
      component: "default",
      props: { Content: h(VButton, { size: "small" }, () => "Custom") },
    },
  },
];
