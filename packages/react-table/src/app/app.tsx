/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unnecessary-type-arguments */
import { ConfigProvider } from "antd";
import { Table } from "../table";
import type { TableColumn } from "../types";
import { type Row, createRows } from "./lib";

const columns: TableColumn<Row, "test">[] = [
  //   SelectColumn,
  {
    key: "id",
    name: "ID",
    width: 120,
    resizable: true,

    sortType: "string-with-number",
    // leftFrozen: true,
  },
  {
    key: "id",
    name: "ID",
    width: 120,
    resizable: true,
    sortType: "string-with-number",
    // leftFrozen: true,
  },
  {
    key: "firstName",
    name: "First Name",
    resizable: true,
    draggable: true,
    sortable: true,
    cellRender: "text",
    filterRender: "string",
    filterable: true,
    filterType: "includes-string",
    cellRenderProps: {
      expanded: true,
      // pathToLink: "country",
      pathToTooltip: "lastName",
    },
  },
  {
    key: "lastName",
    name: "Last Name",
    width: 200,
    filterable: true,
    filterRender: "string",
    filterType: "includes-string",
    cellRender: "text",
    cellRenderProps: {
      classes: {
        center: true,
      },
    },
    resizable: true,
    draggable: true,
    sortable: true,
    // leftFrozen: true,
  },
  {
    key: "description",
    name: "Description",
    width: 234,
    filterable: true,
    filterRender: "string",
    filterType: "includes-string",
    resizable: true,
    draggable: true,
    sortable: true,
    cellClass: ["common", "empty", "lineClamp"],
    cellRender: "text",
    cellRenderProps: {
      pathToTooltip: "description",
      autoTooltip: true,
      linkGetter: (row) => row.country,
    },
    // leftFrozen: true,
  },
  {
    key: "colors",
    name: "Colors",
    width: 200,
    resizable: true,
    sortType: "array",
    filterable: true,
    filterType: "includes-array-all",
    filterRender: "select",
    filterRenderProps: {
      multiple: true,
      options: [
        { label: "gold", value: "gold" },
        { label: "pink", value: "pink" },
        { label: "white", value: "white" },
        { label: "teal", value: "teal" },
      ],
    },
  },
  {
    key: "year",
    name: "Year",
    width: 200,
    resizable: true,
    filterable: true,
    filterType: "includes-string-one-of-array",
    filterRender: "select",
    filterRenderProps: {
      multiple: true,
      options: [
        { label: "2018", value: 2018 },
        { label: "2017", value: 2017 },
        { label: "2016", value: 2016 },
        { label: "2015", value: 2015 },
      ],
    },
    // grouping: true,
  },
  {
    key: "age",
    name: "Age",
    width: 200,
    resizable: true,
    sortType: "number",
    filterable: true,
    filterRender: "number-range",
    filterType: "equals",
  },
  {
    key: "checked",
    name: "Checked",
    width: 200,
    resizable: true,
    sortType: "boolean",
  },
  {
    key: "country",
    name: "Country",
    width: 200,
    resizable: true,
    // grouping: true,
  },
  {
    key: "sport",
    name: "Sport",
    width: 200,
    resizable: true,
  },
  {
    key: "date",
    name: "Date",
    width: 500,
    sortType: "date",
    resizable: false,
    cellRender: "date",
    cellRenderProps: {
      format: "DD/MM/YYYY",
    },
    filterable: true,
    filterRender: "date-range",
    filterType: "date-in-range",
    filterRenderProps: {
      format: "DD/MM/YYYY",
    },
  },
];

const rows: Row[] = createRows();

type CellRenderKeys = "test";
type HeaderRenderKeys = undefined;
type FilterRenderKeys = undefined;
type SortRenderKeys = undefined;
type CellClassKeys = undefined;
type HeaderClassKeys = undefined;
type FilterTypeKeys = undefined;
type SortTypeKeys = undefined;

export function App() {
  return (
    <ConfigProvider
      theme={{
        cssVar: true,
        token: {
          fontFamily: "Nunito",
        },
        components: {
          Button: {
            defaultBg: "white",
          },
        },
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: "24px",
          overflow: "hidden",
          background: "#F0F0F0",
        }}
      >
        <Table<
          Row,
          CellRenderKeys,
          HeaderRenderKeys,
          FilterRenderKeys,
          SortRenderKeys,
          CellClassKeys,
          HeaderClassKeys,
          FilterTypeKeys,
          SortTypeKeys
        >
          columns={columns}
          rows={rows}
          cellRenders={{ test: () => "" }}
          getSubRows={(row) => row.children}
          // onSortingChange={onSortingChange}
          // sorting={sorting}
          // manualSorting
          withPagination
          initialPageSize={150}
          onClickRow={(row) => {
            console.log(row, "click");
          }}
          onDoubleClickRow={(row) => {
            console.log(row, "dbClick");
          }}
          pageSizes={[25, 50, 100, 150, 250]}
          withFilters={true}
          virtualRows={true}
          virtualRowSize={69}
          virtualColumn={false}
        />
      </div>
    </ConfigProvider>
  );
}
