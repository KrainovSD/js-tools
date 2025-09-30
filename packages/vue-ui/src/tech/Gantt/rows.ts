import { getDateByRules, randomNumber, randomString } from "@krainovsd/js-helpers";
import type { GanttInfo, TagColor } from "../../ui";
import type { RowData, RowWork } from "./types";

const NAMES: string[] = [
  "Liam",
  "Noah",
  "Oliver",
  "Elijah",
  "James",
  "William",
  "Benjamin",
  "Lucas",
  "Henry",
  "Alexander",
  "Emma",
  "Olivia",
  "Ava",
  "Isabella",
  "Sophia",
  "Charlotte",
  "Mia",
  "Amelia",
  "Harper",
  "Evelyn",
];
export const COLORS = [
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Black",
  "White",
  "Orange",
  "Purple",
  "Pink",
  "Brown",
] as const;
export const COLORS_MAPPED: Record<(typeof COLORS)[number], TagColor> = {
  Black: "default",
  Blue: "blue",
  Brown: "default",
  Green: "green",
  Orange: "orange",
  Pink: "magenta",
  Purple: "purple",
  Red: "red",
  White: "default",
  Yellow: "gold",
};
export const SPORTS = [
  "Soccer",
  "Basketball",
  "Tennis",
  "Swimming",
  "Cycling",
  "Running",
  "Volleyball",
  "Golf",
  "Baseball",
  "Boxing",
];
const ADDRESSES = [
  "123 Main St, New York, NY 10001",
  "456 Oak Ave, Los Angeles, CA 90001",
  "789 Pine Rd, Chicago, IL 60601",
  "101 Elm Blvd, Houston, TX 77001",
  "202 Maple Dr, Phoenix, AZ 85001",
  "303 Cedar Ln, Philadelphia, PA 19101",
  "404 Birch Ct, San Antonio, TX 78201",
  "505 Spruce Way, San Diego, CA 92101",
  "606 Willow Pl, Dallas, TX 75201",
  "707 Aspen St, San Jose, CA 95101",
];
const BOOLEAN = {
  "-1": undefined,
  "0": false,
  "1": true,
};

export function createRow(id: string): RowData {
  const age = randomNumber(18, 70);
  const birth = new Date();
  birth.setFullYear(birth.getFullYear() - age);
  const startWork = new Date();
  startWork.setFullYear(startWork.getFullYear() - randomNumber(1, 10));
  const countWork = randomNumber(0, 4);

  return {
    id,
    firstName: NAMES[randomNumber(0, NAMES.length - 1)],
    age,
    approved: BOOLEAN[randomNumber(-1, 1).toString() as keyof typeof BOOLEAN],
    birth: birth.getTime(),
    colors: [
      ...new Set(
        Array.from(
          { length: randomNumber(0, 4) },
          () => COLORS[randomNumber(0, COLORS.length - 1)],
        ),
      ),
    ],
    lastWork: {
      address: ADDRESSES[randomNumber(0, ADDRESSES.length - 1)],
      duration: randomNumber(0, 356 * 10),
    },
    sport: SPORTS[randomNumber(0, SPORTS.length - 1)],
    works: Array.from<unknown, RowWork>({ length: countWork }, () => ({
      address: ADDRESSES[randomNumber(0, ADDRESSES.length - 1)],
      duration: randomNumber(0, 356 * 10),
    })),
    countWork,
    startWork: startWork.getTime(),
  };
}

export function createGanttRows(maxDeep: number = 10): GanttInfo<RowData>[] {
  const rows: GanttInfo<RowData>[] = [];
  const start = getDateByRules([{ increment: -1, type: "years" }]);
  const end = getDateByRules([{ increment: 3, type: "years" }], start);

  rows.push({
    id: `id_-1`,
    name: "Очень длинное имя которое не поместится в две строчки, Очень длинное имя которое не поместится в две строчки",
    start: start.toISOString(),
    end: end.toISOString(),
    children: generateInner(1, "0", start),
    data: createRow("id_-1"),
  });

  function generateInner(deep: number, parentId: string, start: Date) {
    const result: GanttInfo<RowData>[] = [];
    if (deep === maxDeep) return result;

    for (let i = 0; i < randomNumber(1, 4); i++) {
      const id = `${parentId}.${deep}.${i}`;
      const children = generateInner(deep + 1, id, start);
      const childrenEnd =
        children.length > 0
          ? new Date(children[children.length - 1].end)
          : getDateByRules([{ increment: randomNumber(5, 61), type: "days" }], start);

      result.push({
        id: `${parentId}.${deep}.${i}`,
        data: createRow(`${parentId}.${deep}.${i}`),
        name: randomString(10),
        start: start.toISOString(),
        end: childrenEnd.toISOString(),
        children,
        links: [`${parentId}.${deep}.${i + 1}`],
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
    type: "group",
    links: ["2.2.12"],
    children: [
      {
        id: "1.1",
        name: "Johnson's house",
        type: "group",
        start: "2025-05-01",
        end: "2025-10-08",
        children: [
          {
            id: "1.1.0",
            name: "Contract and very very long text in the end of table for test",
            start: "2027-11-25",
            end: "2025-12-01",
            type: "task",
            children: [],
          },
          {
            id: "1.1.1",
            name: "Contract",
            start: "2025-05-01",
            end: "2025-06-02",
            links: ["1.1"],
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
                links: ["1.1.2.2", "1.1.3", "1.2"],
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
            links: ["1.2", "1.1.3"],
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
            links: ["1.2.2", "1.2.1", "1.2.5"],
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
            links: ["1.2.8"],
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
            links: ["1.2.11"],
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
                links: ["2.1.2.2", "2.1.3", "2.2"],
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
            links: ["2.2.2"],
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
            links: ["2.2.5"],
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
            links: ["2.2.8"],
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
            links: ["2.2.11"],
          },
          {
            id: "2.2.11",
            name: "Contract",
            start: "2025-12-31",
            end: "2025-10-01",
          },
          {
            id: "2.2.12",
            name: "Finish",
            start: "2025-12-09",
            end: "2025-12-09",
            type: "milestone",
          },
        ],
      },
    ],
  },
].map<GanttInfo<RowData>>((row) =>
  recursiveAddData(row as GanttInfo<unknown>),
) as GanttInfo<RowData>[];

function recursiveAddData(row: GanttInfo<unknown>): GanttInfo<RowData> {
  return {
    id: row.id,
    start: row.start,
    end: row.end,
    children: row.children?.map?.(recursiveAddData),
    name: row.name,
    links: row.links,
    type: row.type,
    data: createRow(String(row.id)),
  };
}
