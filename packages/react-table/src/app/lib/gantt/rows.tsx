import { faker } from "@faker-js/faker";
import { getDateByRules } from "@krainovsd/js-helpers";
import type { RowGantt, RowGanttVirtual } from "../../types/gantt";

export const GANTT_ROWS: RowGantt[] = createRowsGantt(false);
export const GANTT_ROWS_VIRTUAL: RowGanttVirtual[] = createRowsGantt(true) as RowGanttVirtual[];

function createRowsGantt(virtual: boolean): (RowGantt | RowGanttVirtual)[] {
  const virtualRowEntries = Array.from({ length: 30 }, (_, index) => [
    `wide${index + 1}`,
    index + 1,
  ]);
  const virtualRow = Object.fromEntries(virtualRowEntries) as Omit<RowGanttVirtual, "children">;

  const rows: (RowGantt | RowGanttVirtual)[] = [];
  const start = faker.date.past({ years: 3 });
  const end = getDateByRules([{ increment: 5, type: "years" }], start);

  rows.push({
    id: `id_-1`,
    name: "Очень длинное имя которое не поместится в две строчки, Очень длинное имя которое не поместится в две строчки",
    start: start.toISOString(),
    end: end.toISOString(),
    children: generateInner(1, "0", start),
    ...(virtual ? virtualRow : {}),
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
        ...(virtual ? virtualRow : {}),
      });

      start = childrenEnd;
    }

    return result;
  }

  return rows;
}
