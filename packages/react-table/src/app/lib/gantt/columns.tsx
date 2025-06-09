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
      classes: ["hCenter", "wCenter"],
      hover: true,
    },
    headerRender: "select",
    headerRenderProps: {
      classes: ["hCenter", "wCenter"],
    },
  },
  {
    key: "name",
    name: "Название",
    resizable: true,
    draggable: false,
    width: 300,
    minWidth: 200,
    cellRender: "text",
    cellClass: ["common", "empty", "nowrap"],
    cellRenderProps: {
      expanded: true,
      pathToTooltip: "lastName",
      shift: 15,
      // Link: (props) => {
      //   // eslint-disable-next-line react/prop-types
      //   return <a href={props.row.id}>{props.children}</a>;
      // },
    },
  },
  {
    key: "start",
    name: "Начало",
    width: 150,
    minWidth: 150,
    cellClass: ["common", "empty", "nowrap"],
    resizable: true,
    cellRender: "date",
    draggable: false,

    cellRenderProps: {
      format: "DD/MM/YYYY",
    },
  },
  {
    key: "end",
    name: "Окончание",
    width: 150,
    minWidth: 150,
    cellClass: ["common", "empty", "nowrap"],
    resizable: true,
    draggable: false,

    cellRender: "date",
    cellRenderProps: {
      format: "DD/MM/YYYY",
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
