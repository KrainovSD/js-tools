import { faker } from "@faker-js/faker";
import { getDateByRules } from "@krainovsd/js-helpers";
import type { GanttTypeShapes, TableColumn } from "../types";

export const columnsGantt: TableColumn<RowGantt, "test">[] = [
  {
    key: "name",
    name: "Название",
    resizable: false,
    width: 300,
    minWidth: 200,
    cellRender: "text",
    cellClass: ["common", "empty", "lineClamp"],
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
    resizable: false,
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
    resizable: false,
    cellRender: "date",
    cellRenderProps: {
      format: "DD/MM/YYYY",
    },
  },
  {
    key: "deviations",
    name: "Отклонения",
    width: 100,
    cellClass: ["common", "empty", "nowrap"],
    resizable: true,
    cellRender: "tag",
    cellRenderProps: {
      bordered: true,
      color: "red",
      tooltip: true,
      autoTooltip: true,
    },
  },
  {
    key: "risks",
    name: "Риски",
    width: 100,
    cellClass: ["common", "empty", "nowrap"],
    resizable: false,
    cellRender: "tag",
    cellRenderProps: {
      bordered: true,
      color: "purple",
    },
  },
];

export type RowGantt = {
  id: string;
  name: string;
  start: string;
  type?: GanttTypeShapes;
  end: string;
  risks?: number;
  deviations?: number;
  dependencies?: string[];
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
          risks: 4,
          deviations: 5,
          children: [
            {
              id: "1.1.1",
              name: "Contract",
              start: "2025-05-01",
              end: "2025-06-02",
              risks: 2,
              children: [],
            },
            {
              id: "1.1.2",
              name: "Design",
              start: "2025-05-30",
              end: "2025-07-01",
              risks: 2,
              deviations: 3,
              children: [
                {
                  id: "1.1.2.1",
                  name: "Outline Design",
                  start: "2025-05-30",
                  end: "2025-06-15",
                  dependencies: ["1.1.2.2", "1.1.3", "1.2"],
                  risks: 2,
                },
                {
                  id: "1.1.2.2",
                  name: "Outline Design",
                  start: "2025-06-15",
                  deviations: 2,
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
              dependencies: ["1.2.2"],
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
              dependencies: ["1.2.5"],
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
              dependencies: ["1.2.8"],
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
              dependencies: ["1.2.11"],
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
                  dependencies: ["2.1.2.2", "2.1.3", "2.2"],
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
              dependencies: ["2.2.2"],
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
              dependencies: ["2.2.5"],
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
              dependencies: ["2.2.8"],
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
              dependencies: ["2.2.11"],
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
