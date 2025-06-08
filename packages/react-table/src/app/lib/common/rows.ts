import { faker } from "@faker-js/faker";
import type { CommonRow, CommonRowVirtual } from "../../types/common";

const sports = [
  "Swimming",
  "Gymnastics",
  "Speed Skating",
  "Cross Country Skiing",
  "Short-Track Speed Skating",
  "Diving",
  "Cycling",
  "Biathlon",
  "Alpine Skiing",
  "Ski Jumping",
  "Nordic Combined",
  "Athletics",
  "Table Tennis",
  "Tennis",
  "Synchronized Swimming",
  "Shooting",
  "Rowing",
  "Fencing",
  "Equestrian",
  "Canoeing",
  "Bobsleigh",
  "Badminton",
  "Archery",
  "Wrestling",
  "Weightlifting",
  "Waterpolo",
  "Wrestling",
  "Weightlifting",
];

export const COMMON_ROW: CommonRow[] = createRows(false);
export const COMMON_ROW_VIRTUAL: CommonRowVirtual[] = createRows(true) as CommonRowVirtual[];

function createRows(virtual: boolean): (CommonRow | CommonRowVirtual)[] {
  const virtualRowEntries = Array.from({ length: 30 }, (_, index) => [
    `wide${index + 1}`,
    index + 1,
  ]);
  const virtualRow = Object.fromEntries(virtualRowEntries) as CommonRowVirtual;
  const rows: (CommonRow | CommonRowVirtual)[] = [];

  for (let i = 0; i < 5000; i++) {
    rows.push({
      id: `id_${i}`,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      date: faker.date.past().toString(),
      year: 2015 + faker.number.int(3),
      country: faker.location.country(),
      sport: sports[faker.number.int(sports.length - 1)],
      colors: Array.from({ length: 1 + faker.number.int(3) }, () => faker.color.human()),
      age: faker.number.int({ min: 18, max: 80 }),
      description: "Описание",
      checked: faker.datatype.boolean(),
      ...(virtual ? virtualRow : {}),
      children:
        i % 10 === 0
          ? Array.from({ length: faker.number.int({ min: 1, max: 10 }) }, (_, childId) => {
              return {
                id: `id_${i}_${childId}`,
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                date: faker.date.past().toString(),
                year: 2015 + faker.number.int(3),
                country: faker.location.country(),
                sport: sports[faker.number.int(sports.length - 1)],
                colors: Array.from({ length: 1 + faker.number.int(3) }, () => faker.color.human()),
                age: faker.number.int({ min: 18, max: 80 }),
                checked: faker.datatype.boolean(),
                ...(virtual ? virtualRow : {}),
                children:
                  i === 0
                    ? Array.from(
                        { length: faker.number.int({ min: 1, max: 10 }) },
                        (_, childExtraId) => {
                          return {
                            id: `id_${i}_${childId}_${childExtraId}`,
                            firstName: faker.person.firstName(),
                            lastName: faker.person.lastName(),
                            date: faker.date.past().toString(),
                            year: 2015 + faker.number.int(3),
                            country: faker.location.country(),
                            sport: sports[faker.number.int(sports.length - 1)],
                            age: faker.number.int({ min: 18, max: 80 }),
                            checked: faker.datatype.boolean(),
                            ...(virtual ? virtualRow : {}),
                            colors: Array.from({ length: 1 + faker.number.int(3) }, () =>
                              faker.color.human(),
                            ),
                          };
                        },
                      )
                    : undefined,
              };
            })
          : undefined,
    });
  }

  return rows;
}
