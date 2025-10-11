import type { GanttColumn } from "../../types/gantt";

export const COLUMNS_GANTT: GanttColumn[] = [
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
      props: {
        hover: true,
      },
    },
    headerRender: {
      component: "select",
    },
    additionalCellClass: ["wCenter", "hCenter"],
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
    additionalCellClass: ["common", "empty", "nowrap"],
    tooltip: {
      auto: true,
      pathToContent: "name",
    },
    expandedShift: 8,
  },
  {
    key: "start",
    name: "Начало",
    width: 150,
    minWidth: 150,
    additionalCellClass: ["common", "empty", "nowrap"],
    resizable: true,
    cellRender: {
      component: "default",
      props: {
        dateFormat: "DD/MM/YYYY",
      },
    },
    draggable: false,
  },
  {
    key: "end",
    name: "Окончание",
    width: 150,
    minWidth: 150,
    additionalCellClass: ["common", "empty", "nowrap"],
    resizable: true,
    draggable: false,
    cellRender: {
      component: "default",
      props: {
        dateFormat: "DD/MM/YYYY",
      },
    },
  },
];

export const COLUMNS_GANTT_VIRTUAL: GanttColumn[] = [
  ...COLUMNS_GANTT,
  ...Array.from<unknown, GanttColumn>({ length: 30 }, (_, index) => ({
    id: `wide-${index}`,
    key: "id",
    name: `wide${index + 1}`,
    draggable: false,
    resizable: true,
  })),
];
