import { h } from "vue";
import { VButton } from "../../ui";
import Link from "./components/Link.vue";
import { COLORS_MAPPED, SPORTS } from "./rows";
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
    key: "age",
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
    id: "drag",
    key: "id",
    sortable: false,
    name: "",
    width: 50,
    additionalCellClass: ["hCenter", "wCenter"],
    cellRender: { component: "drag" },
    leftFrozen: true,
  },
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
    expandedShift: 10,
    leftFrozen: true,
  },
  {
    key: "firstName",
    name: "firstName",
    filterable: true,
    filterType: "includes-string",
    filterRender: {
      component: "string",
      props: { placeholder: "Введите имя", allowClear: true },
      operators: [
        { label: "==", value: "includes-string" },
        { label: "!=", value: "includes-string" },
      ],
      displayValue: "text",
    },
    sortRender: {
      component: "single-arrow",
    },
    cellRender: {
      component: "default",
      props: {
        Link,
      },
    },
    width: 150,
    tooltip: {
      auto: true,
    },
  },
  {
    key: "birth",
    name: "birth",
    filterable: true,
    filterType: "date-in-range",
    filterRender: {
      component: "date-range",
      props: { format: "DD/MM/YYYY" },
      operators: [
        { label: "==", value: "date-in-range" },
        { label: "!=", value: "date-in-range" },
      ],
      displayValue: "date-range",
    },
    cellRender: {
      component: "default",
      props: { dateFormat: "DD/MM/YYYY" },
    },
    width: 150,
  },

  {
    key: "age",
    name: "age",
    filterable: true,
    filterType: "number-in-range",
    filterRender: {
      component: "number-range",
      props: { min: 18, max: 100 },
      operators: [
        { label: "==", value: "number-in-range" },
        { label: "!=", value: "number-in-range" },
      ],
      displayValue: "number-range",
    },
    cellRender: {
      component: "default",
      props: { floatFixed: 2 },
    },
    width: 150,
  },
  {
    key: "startWork",
    name: "startWork",
    filterable: true,
    filterType: "date",
    filterRender: {
      component: "date",
      props: { format: "DD/MM/YYYY" },
      operators: [
        { label: "==", value: "date" },
        { label: "!=", value: "date" },
      ],
      displayValue: "date",
    },
    cellRender: {
      component: "default",
      props: { dateFormat: "DD/MM/YYYY" },
    },
    width: 150,
  },
  {
    key: "countWork",
    name: "countWork",
    filterable: true,
    filterType: "equals",
    filterRender: {
      component: "number",
      props: { min: 0, max: 5 },
      operators: [
        { label: "==", value: "equals" },
        { label: "!=", value: "equals" },
      ],
      displayValue: "number",
    },
    cellRender: {
      component: "default",
      props: { floatFixed: 2 },
    },
    width: 150,
  },
  {
    key: "sport",
    name: "sport",
    filterable: true,
    filterType: "equals",
    filterRender: {
      component: "select",
      displayValue: "select",
      props: { options: SPORTS.map((sport) => ({ label: sport, value: sport })) },
      operators: [
        { label: "==", value: "equals" },
        { label: "!=", value: "equals" },
      ],
    },
    cellRender: {
      component: "default",
    },
    width: 150,
  },
  {
    key: "colors",
    name: "colors",
    filterable: true,
    filterType: "array-some-in-array",
    filterRender: {
      component: "select",
      displayValue: "select",
      props: { options: SPORTS.map((sport) => ({ label: sport, value: sport })), multiple: true },
      operators: [
        { label: "==", value: "array-some-in-array" },
        { label: "!=", value: "array-some-in-array" },
      ],
    },
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
    id: "tags",
    key: "colors",
    name: "tags",
    additionalCellClass: ["nowrap", "wCenter", "hCenter"],
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
    key: "approved",
    name: "approved",
    cellRender: {
      component: "default",
      props: { mappings: { true: "Yes", false: "No", undefined: "Not known" } },
    },
    width: 150,
  },
  {
    key: "works",
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
    key: "lastWork",
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
