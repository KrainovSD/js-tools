import { faker } from "@faker-js/faker";
import { getDateByRules } from "@krainovsd/js-helpers";
import type { TableColumn } from "../types";

export const columnsGantt: TableColumn<RowGantt, "test">[] = [
  {
    key: "name",
    name: "name",
    resizable: true,
    draggable: true,
    sortable: false,
    width: 300,
    cellRender: "text",
    cellClass: ["common", "empty", "lineClamp"],
    filterRender: "string",
    filterable: false,
    filterType: "includes-string",
    cellRenderProps: {
      expanded: true,
      pathToTooltip: "lastName",
    },
  },
  {
    key: "start",
    name: "Start",
    width: 150,
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
  {
    key: "end",
    name: "End",
    width: 150,
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

export type RowGantt = {
  id: string;
  name: string;
  start: string;
  end: string;
  children?: RowGantt[];
};

export function createRowsGantt(): RowGantt[] {
  const rows: RowGantt[] = [];
  const start = faker.date.past({ years: 2 });
  const end = getDateByRules(
    [{ increment: faker.number.int({ min: 1, max: 4 }), type: "months" }],
    start,
  );
  rows.push({
    id: `id_-1`,
    name: "Очень длинное имя которое не поместится в две строчки даже",
    start: start.toISOString(),
    end: end.toISOString(),
    children: [],
  });

  for (let i = 0; i < 1000; i++) {
    const start = faker.date.past({ years: 2 });
    const end = getDateByRules(
      [{ increment: faker.number.int({ min: 1, max: 4 }), type: "months" }],
      start,
    );

    rows[0].children?.push?.({
      id: `id_${i}`,
      name: faker.person.firstName("male"),
      start: start.toISOString(),
      end: end.toISOString(),
      children:
        i % 10 === 0
          ? Array.from({ length: 10 }, (_, index) => {
              const start = faker.date.past({ years: 2 });
              const end = getDateByRules(
                [{ increment: faker.number.int({ min: 1, max: 4 }), type: "months" }],
                start,
              );

              return {
                id: `id_${i}_${index}`,
                name: faker.person.firstName("male"),
                start: start.toISOString(),
                end: end.toISOString(),
              };
            })
          : undefined,
    });
  }

  return rows;
}

// export const cellRenders = {
//   test: ({ column }: DataGridProps["cellRenderPropsType"]) => {
//     console.log(column);

//     return <div></div>;
//   },
// } as const;

// type CellRender = keyof typeof cellRenders;
