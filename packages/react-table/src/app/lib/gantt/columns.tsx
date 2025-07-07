import type { TableColumn } from "../../../types";
import type { RowGantt, RowGanttVirtual } from "../../types/gantt";

export const COLUMNS_GANTT: TableColumn<RowGantt, "test">[] = [
  {
    key: "_select",
    name: "",
    width: 50,
    resizable: false,
    draggable: false,
    leftFrozen: true,
    sortable: false,
    filterable: false,
    cellRender: "select",
    cellRenderProps: {
      hover: true,
    },
    additionalCellClass: ["wCenter", "hCenter"],
    headerRender: "select",
    additionalHeaderClass: ["wCenter", "hCenter"],
  },
  {
    key: "name",
    name: "Название",
    resizable: true,
    draggable: false,
    expandable: true,
    width: 300,
    minWidth: 200,
    cellRender: "default",
    additionalCellClass: ["common", "empty", "nowrap"],
    tooltip: {
      auto: true,
      pathToContent: "name",
    },
    expandedShift: 8,
    headerRender: "default",
  },
  {
    key: "start",
    name: "Начало",
    width: 150,
    minWidth: 150,
    additionalCellClass: ["common", "empty", "nowrap"],
    resizable: true,
    cellRender: "default",
    draggable: false,
    cellRenderProps: {
      dateFormat: "DD/MM/YYYY",
    },
  },
  {
    key: "end",
    name: "Окончание",
    width: 150,
    minWidth: 150,
    additionalCellClass: ["common", "empty", "nowrap"],
    resizable: true,
    draggable: false,
    cellRender: "default",
    cellRenderProps: {
      dateFormat: "DD/MM/YYYY",
    },
  },
];

export const COLUMNS_GANTT_VIRTUAL: TableColumn<RowGanttVirtual, "test">[] = [
  ...(COLUMNS_GANTT as TableColumn<RowGanttVirtual, "test">[]),
  ...Array.from<unknown, TableColumn<RowGanttVirtual, "test">>({ length: 30 }, (_, index) => ({
    key: `wide${index + 1}`,
    name: `wide${index + 1}`,
    draggable: false,
    resizable: true,
  })),
];
