/* eslint-disable no-console */
import { faker } from "@faker-js/faker";
import type { ColumnOrderState, ExpandedState, RowSelectionState } from "@tanstack/react-table";
import React from "react";
import { Link } from "react-router";
import { Table } from "../../table";
import type { RowInterface, TableColumn } from "../../types";
import styles from "./common-formatters.module.scss";

type CommonRow = {
  string: string;
  number: number;
  boolean: boolean | undefined;
  array: string[];
  date: number;
  object: Pick<CommonRow, "string">;
  arrayOfObjects: Pick<CommonRow, "string">[];
  enums: string[];
};

const COMMON_COLUMNS: TableColumn<CommonRow>[] = [
  {
    id: "_select",
    key: "string",
    name: "",
    width: 50,
    resizable: false,
    draggable: false,
    sortable: false,
    filterable: false,
    cellRender: {
      component: "select",
      props: {
        hover: true,
      },
    },
    additionalCellClass: ["hCenter", "wCenter"],
    headerRender: {
      component: "select",
    },
    additionalHeaderClass: ["wCenter", "hCenter"],
  },
  {
    key: "string",
    name: "String",
    width: 250,
    cellRender: {
      component: "default",
      props: {
        Link: (props) => {
          // eslint-disable-next-line react/prop-types
          return <Link to={"/common-formatters"}>{props.children}</Link>;
        },
      },
    },
    additionalCellClass: ["hCenter", "wCenter", "nowrap"],
    additionalHeaderClass: ["wCenter", "hCenter"],
    tooltip: {
      auto: true,
    },
  },
  {
    key: "date",
    name: "date",
    width: 150,
    cellRender: {
      component: "default",
      props: {
        dateFormat: "DD/MM/YYYY",
      },
    },
    tooltip: {
      auto: true,
    },
  },
  {
    key: "number",
    name: "number",
    width: 100,
    cellRender: {
      component: "default",
      props: {
        floatFixed: 2,
      },
    },
    additionalCellClass: ["hCenter", "wCenter", "nowrap"],
    className: (context) => {
      const number = Math.round(context.row.original.number);
      if (number < 1) return styles.red;
    },
  },
  {
    key: "boolean",
    name: "boolean",
    width: 100,
    cellRender: {
      component: "default",
      props: {
        mappings: {
          true: "Yes",
          false: "No",
          undefined: "Maybe",
        },
      },
    },
    additionalCellClass: ["hCenter", "wCenter", "nowrap"],
  },
  {
    id: "number-2",
    key: "enums",
    name: "enums",
    width: 250,
    cellRender: {
      component: "tag",
      props: {
        mappings: {
          red: "Красный",
          blue: "Синий",
          green: "Зеленый",
          black: "Черный",
        },
        bordered: true,
        color: (item) => {
          if (item === "red") return "red";
          if (item === "black") return "pink";
          if (item === "blue") return "blue";
          if (item === "green") return "green";

          return "default";
        },
        filterable: true,
      },
    },
    filterRender: {
      component: "select",
      props: {
        multiple: true,
        options: [
          { label: "Красный", value: "red" },
          { label: "Синий", value: "blue" },
          { label: "Зеленый", value: "green" },
          { label: "Черный", value: "black" },
        ],
      },
    },
    filterable: true,
    filterType: "array-equals",
    tooltip: {
      auto: true,
    },
    additionalCellClass: ["wCenter", "hCenter"],
  },
  {
    key: "object",
    name: "object",
    width: 250,
    cellRender: {
      component: "default",
      props: {
        objectPath: "string",
      },
    },
    additionalCellClass: ["lineClamp"],
  },
  {
    key: "arrayOfObjects",
    name: "arrayOfObjects",
    width: 250,
    cellRender: {
      component: "default",
      props: {
        objectPath: "string",
        arraySeparator: " | ",
      },
    },
    additionalCellClass: ["lineClamp"],
    tooltip: {
      auto: true,
    },
  },
];

const COMMON_ROW: CommonRow[] = createRows();

function createRows(): CommonRow[] {
  const rows: CommonRow[] = [];

  for (let i = 0; i < 500; i++) {
    const bool = faker.number.int({ min: -1, max: 1 });

    rows.push({
      array: Array.from({ length: 5 }, () => faker.word.noun()),
      boolean: bool === -1 ? undefined : Boolean(bool),
      number: faker.number.float(),
      string: faker.word.words(10),
      date: faker.date.anytime().getTime(),
      object: {
        string: faker.word.words(10),
      },
      arrayOfObjects: Array.from({ length: 5 }, () => ({
        string: faker.word.words(10),
      })),
      enums: faker.helpers.arrayElements(["red", "blue", "green", "black"]),
    });
  }

  return rows;
}

export function CommonFormatters() {
  const [expanded, setExpanded] = React.useState<ExpandedState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [tableColumns, setTableColumns] = React.useState<ColumnOrderState>(
    COMMON_COLUMNS.map((col) => col.id ?? col.key),
  );

  function onClick(row: RowInterface<CommonRow>) {
    console.log(row, "click");
  }
  function onDoubleClick(row: RowInterface<CommonRow>) {
    console.log(row, "dbClick");
  }

  return (
    <Table<CommonRow, Record<string, unknown>>
      columns={COMMON_COLUMNS}
      rows={COMMON_ROW}
      withTotal
      initialPageSize={150}
      onClickRow={onClick}
      onDoubleClickRow={onDoubleClick}
      virtualRows={true}
      virtualRowSize={69}
      virtualColumn={false}
      fullSize={true}
      loading={false}
      withFilters
      columnOrder={tableColumns}
      onColumnOrderChange={setTableColumns}
      rowSelection={rowSelection}
      onRowSelectionChange={setRowSelection}
      expanded={expanded}
      onExpandedChange={setExpanded}
    />
  );
}
