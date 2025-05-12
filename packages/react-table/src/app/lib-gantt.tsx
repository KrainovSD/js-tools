import { faker } from "@faker-js/faker";
import { getDateByRules } from "@krainovsd/js-helpers";
import type { GanttTypeShapes, TableColumn } from "../types";

export const columnsGantt: TableColumn<RowGantt, "test">[] = [
  {
    key: "name",
    name: "Название",
    resizable: true,
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
    cellRender: "date",
    cellRenderProps: {
      format: "DD/MM/YYYY",
    },
  },
  {
    key: "start1",
    name: "Начало",
    width: 150,
    minWidth: 150,
    cellClass: ["common", "empty", "nowrap"],
    resizable: true,
    cellRender: "date",
    cellRenderProps: {
      format: "DD/MM/YYYY",
    },
  },
  {
    key: "end1",
    name: "Окончание",
    width: 150,
    minWidth: 150,
    cellClass: ["common", "empty", "nowrap"],
    resizable: true,
    cellRender: "date",
    cellRenderProps: {
      format: "DD/MM/YYYY",
    },
  },
  {
    key: "start2",
    name: "Начало",
    width: 150,
    minWidth: 150,
    cellClass: ["common", "empty", "nowrap"],
    resizable: true,
    cellRender: "date",
    cellRenderProps: {
      format: "DD/MM/YYYY",
    },
  },
  {
    key: "end2",
    name: "Окончание",
    width: 150,
    minWidth: 150,
    cellClass: ["common", "empty", "nowrap"],
    resizable: true,
    cellRender: "date",
    cellRenderProps: {
      format: "DD/MM/YYYY",
    },
  },
  {
    key: "start3",
    name: "Начало",
    width: 150,
    minWidth: 150,
    cellClass: ["common", "empty", "nowrap"],
    resizable: true,
    cellRender: "date",
    cellRenderProps: {
      format: "DD/MM/YYYY",
    },
  },
  {
    key: "end3",
    name: "Окончание",
    width: 150,
    minWidth: 150,
    cellClass: ["common", "empty", "nowrap"],
    resizable: true,
    cellRender: "date",
    cellRenderProps: {
      format: "DD/MM/YYYY",
    },
  },
  {
    key: "start4",
    name: "Начало",
    width: 150,
    minWidth: 150,
    cellClass: ["common", "empty", "nowrap"],
    resizable: true,
    cellRender: "date",
    cellRenderProps: {
      format: "DD/MM/YYYY",
    },
  },
  {
    key: "end4",
    name: "Окончание",
    width: 150,
    minWidth: 150,
    cellClass: ["common", "empty", "nowrap"],
    resizable: true,
    cellRender: "date",
    cellRenderProps: {
      format: "DD/MM/YYYY",
    },
  },
  {
    key: "start5",
    name: "Начало",
    width: 150,
    minWidth: 150,
    cellClass: ["common", "empty", "nowrap"],
    resizable: true,
    cellRender: "date",
    cellRenderProps: {
      format: "DD/MM/YYYY",
    },
  },
  {
    key: "end5",
    name: "Окончание",
    width: 150,
    minWidth: 150,
    cellClass: ["common", "empty", "nowrap"],
    resizable: true,
    cellRender: "date",
    cellRenderProps: {
      format: "DD/MM/YYYY",
    },
  },
  {
    key: "start6",
    name: "Начало",
    width: 150,
    minWidth: 150,
    cellClass: ["common", "empty", "nowrap"],
    resizable: true,
    cellRender: "date",
    cellRenderProps: {
      format: "DD/MM/YYYY",
    },
  },
  {
    key: "end6",
    name: "Окончание",
    width: 150,
    minWidth: 150,
    cellClass: ["common", "empty", "nowrap"],
    resizable: true,
    cellRender: "date",
    cellRenderProps: {
      format: "DD/MM/YYYY",
    },
  },
  {
    key: "start7",
    name: "Начало",
    width: 150,
    minWidth: 150,
    cellClass: ["common", "empty", "nowrap"],
    resizable: true,
    cellRender: "date",
    cellRenderProps: {
      format: "DD/MM/YYYY",
    },
  },
  {
    key: "end7",
    name: "Окончание",
    width: 150,
    minWidth: 150,
    cellClass: ["common", "empty", "nowrap"],
    resizable: true,
    cellRender: "date",
    cellRenderProps: {
      format: "DD/MM/YYYY",
    },
  },
  {
    key: "start8",
    name: "Начало",
    width: 150,
    minWidth: 150,
    cellClass: ["common", "empty", "nowrap"],
    resizable: true,
    cellRender: "date",
    cellRenderProps: {
      format: "DD/MM/YYYY",
    },
  },
  {
    key: "end8",
    name: "Окончание",
    width: 150,
    minWidth: 150,
    cellClass: ["common", "empty", "nowrap"],
    resizable: true,
    cellRender: "date",
    cellRenderProps: {
      format: "DD/MM/YYYY",
    },
  },
  {
    key: "start9",
    name: "Начало",
    width: 150,
    minWidth: 150,
    cellClass: ["common", "empty", "nowrap"],
    resizable: true,
    cellRender: "date",
    cellRenderProps: {
      format: "DD/MM/YYYY",
    },
  },
  {
    key: "end9",
    name: "Окончание",
    width: 150,
    minWidth: 150,
    cellClass: ["common", "empty", "nowrap"],
    resizable: true,
    cellRender: "date",
    cellRenderProps: {
      format: "DD/MM/YYYY",
    },
  },
  {
    key: "start10",
    name: "Начало",
    width: 150,
    minWidth: 150,
    cellClass: ["common", "empty", "nowrap"],
    resizable: true,
    cellRender: "date",
    cellRenderProps: {
      format: "DD/MM/YYYY",
    },
  },
  {
    key: "end10",
    name: "Окончание",
    width: 150,
    minWidth: 150,
    cellClass: ["common", "empty", "nowrap"],
    resizable: true,
    cellRender: "date",
    cellRenderProps: {
      format: "DD/MM/YYYY",
    },
  },
];

export type RowGantt = {
  id: string;
  name: string;
  start: string;
  type?: GanttTypeShapes;
  end: string;
  dependents?: string[];
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

  for (let i = 0; i < 10000; i++) {
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

  // return rows;

  return [
    {
      id: "1",
      name: "Construction plans",
      start: "2025-05-01",
      end: "2027-12-07",
      children: [
        {
          id: "1.1",
          name: "Johnson's house",
          start: "2025-05-01",
          end: "2025-10-08",
          children: [
            {
              id: "1.1.0",
              name: "Contract and very very long text in the end of table for test",
              start: "2027-11-25",
              end: "2025-12-01",
              children: [],
            },
            {
              id: "1.1.1",
              name: "Contract",
              start: "2025-05-01",
              end: "2025-06-02",
              children: [],
            },
            {
              id: "1.1.2",
              name: "Design",
              start: "2025-05-30",
              end: "2025-07-01",
              children: [
                {
                  id: "1.1.2.1",
                  name: "Outline Design",
                  start: "2025-05-30",
                  end: "2025-06-15",
                  dependents: ["1.1.2.2", "1.1.3", "1.2"],
                },
                {
                  id: "1.1.2.2",
                  name: "Outline Design",
                  start: "2025-06-15",
                  end: "2025-07-01",
                },
              ],
            },
            {
              id: "1.1.3",
              name: "Obtain permits",
              start: "2025-06-30",
              end: "2025-07-10",
              children: [],
            },
          ],
        },
        {
          id: "1.2",
          name: "Joplin's house",
          start: "2025-10-08",
          end: "2025-12-07",
          children: [
            {
              id: "1.2.1",
              name: "Tender",
              start: "2025-10-08",
              end: "2025-10-30",
              dependents: ["1.2.2"],
            },
            {
              id: "1.2.2",
              name: "Contract",
              start: "2025-11-31",
              end: "2025-12-30",
            },
            {
              id: "1.2.3",
              name: "Finish",
              start: "2025-12-07",
              end: "2025-12-07",
              type: "milestone",
            },
            {
              id: "1.2.4",
              name: "Tender",
              start: "2025-10-08",
              end: "2025-10-30",
              dependents: ["1.2.5"],
            },
            {
              id: "1.2.5",
              name: "Contract",
              start: "2025-11-31",
              end: "2025-12-30",
            },
            {
              id: "1.2.6",
              name: "Finish",
              start: "2025-12-07",
              end: "2025-12-07",
              type: "milestone",
            },
            {
              id: "1.2.7",
              name: "Tender",
              start: "2025-10-08",
              end: "2025-10-30",
              dependents: ["1.2.8"],
            },
            {
              id: "1.2.8",
              name: "Contract",
              start: "2025-11-31",
              end: "2025-12-30",
            },
            {
              id: "1.2.9",
              name: "Finish",
              start: "2025-12-07",
              end: "2025-12-07",
              type: "milestone",
            },
            {
              id: "1.2.10",
              name: "Tender",
              start: "2025-10-08",
              end: "2025-10-30",
              dependents: ["1.2.11"],
            },
            {
              id: "1.2.11",
              name: "Contract",
              start: "2025-11-31",
              end: "2025-12-30",
            },
            {
              id: "1.2.12",
              name: "Finish",
              start: "2025-12-07",
              end: "2025-12-07",
              type: "milestone",
            },
          ],
        },
      ],
    },
    {
      id: "2",
      name: "Construction plans",
      start: "2025-05-01",
      end: "2025-12-07",
      children: [
        {
          id: "2.1",
          name: "Johnson's house",
          start: "2025-05-01",
          end: "2025-10-08",
          children: [
            {
              id: "2.1.1",
              name: "Contract",
              start: "2025-05-01",
              end: "2025-06-02",
              children: [],
            },
            {
              id: "2.1.2",
              name: "Design",
              start: "2025-05-30",
              end: "2025-07-01",
              children: [
                {
                  id: "2.1.2.1",
                  name: "Outline Design",
                  start: "2025-05-30",
                  end: "2025-06-15",
                  dependents: ["2.1.2.2", "2.1.3", "2.2"],
                },
                {
                  id: "2.1.2.2",
                  name: "Outline Design",
                  start: "2025-06-15",
                  end: "2025-07-01",
                },
              ],
            },
            {
              id: "2.1.3",
              name: "Obtain permits",
              start: "2025-06-30",
              end: "2025-07-10",
              children: [],
            },
          ],
        },
        {
          id: "2.2",
          name: "Joplin's house",
          start: "2025-10-08",
          end: "2025-12-07",
          children: [
            {
              id: "2.2.1",
              name: "Tender",
              start: "2025-10-08",
              end: "2025-10-30",
              dependents: ["2.2.2"],
            },
            {
              id: "2.2.2",
              name: "Contract",
              start: "2025-11-31",
              end: "2025-12-30",
            },
            {
              id: "2.2.3",
              name: "Finish",
              start: "2025-12-07",
              end: "2025-12-07",
              type: "milestone",
            },
            {
              id: "2.2.4",
              name: "Tender",
              start: "2025-10-08",
              end: "2025-10-30",
              dependents: ["2.2.5"],
            },
            {
              id: "2.2.5",
              name: "Contract",
              start: "2025-11-31",
              end: "2025-12-30",
            },
            {
              id: "2.2.6",
              name: "Finish",
              start: "2025-12-07",
              end: "2025-12-07",
              type: "milestone",
            },
            {
              id: "2.2.7",
              name: "Tender",
              start: "2025-10-08",
              end: "2025-10-30",
              dependents: ["2.2.8"],
            },
            {
              id: "2.2.8",
              name: "Contract",
              start: "2025-11-31",
              end: "2025-12-30",
            },
            {
              id: "2.2.9",
              name: "Finish",
              start: "2025-12-07",
              end: "2025-12-07",
              type: "milestone",
            },
            {
              id: "2.2.10",
              name: "Tender",
              start: "2025-10-08",
              end: "2025-10-30",
              dependents: ["2.2.11"],
            },
            {
              id: "2.2.11",
              name: "Contract",
              start: "2025-11-31",
              end: "2025-12-30",
            },
            {
              id: "2.2.12",
              name: "Finish",
              start: "2025-12-07",
              end: "2025-12-07",
              type: "milestone",
            },
          ],
        },
      ],
    },
  ];
}

// export const cellRenders = {
//   test: ({ column }: DataGridProps["cellRenderPropsType"]) => {
//     console.log(column);

//     return <div></div>;
//   },
// } as const;

// type CellRender = keyof typeof cellRenders;
