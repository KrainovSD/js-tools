import { faker } from "@faker-js/faker";
import { getDateByRules } from "@krainovsd/js-helpers";
import type { RowGantt } from "../../types/gantt";

export const GANTT_ROWS: RowGantt[] = createRowsGantt();

function createRowsGantt(): RowGantt[] {
  const rows: RowGantt[] = [];
  const start = faker.date.past({ years: 3 });
  const end = getDateByRules([{ increment: 5, type: "years" }], start);

  rows.push({
    id: `id_-1`,
    name: "Очень длинное имя которое не поместится в две строчки, Очень длинное имя которое не поместится в две строчки",
    start: start.toISOString(),
    end: end.toISOString(),
    children: generateInner(1, "0", start),
  });

  function generateInner(deep: number, parentId: string, start: Date) {
    const result: RowGantt[] = [];
    if (deep === 10) return result;

    for (let i = 0; i < faker.number.int({ min: 1, max: 3 }); i++) {
      const id = `${parentId}.${deep}.${i}`;
      const children = generateInner(deep + 1, id, start);
      const childrenEnd =
        children.length > 0
          ? new Date(children[children.length - 1].end)
          : getDateByRules(
              [{ increment: faker.number.int({ min: 5, max: 60 }), type: "days" }],
              start,
            );

      result.push({
        id: `${parentId}.${deep}.${i}`,
        name: faker.word.words({ count: faker.number.int({ min: 2, max: 10 }) }),
        start: start.toISOString(),
        end: childrenEnd.toISOString(),
        children,
        dependents: [`${parentId}.${deep}.${i + 1}`],
      });

      start = childrenEnd;
    }

    return result;
  }

  return rows;
}

export const GANTT_EASY_ROWS = [
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
            start: "2025-01-30",
            end: "2025-02-10",
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
            start: "2025-4-08",
            end: "2025-5-30",
            dependents: ["1.2"],
          },
          {
            id: "1.2.2",
            name: "Contract",
            start: "2026-2-30",
            end: "2026-3-30",
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
            dependents: ["1.2.2", "1.2.1", "1.2.5"],
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
] as RowGantt[];
