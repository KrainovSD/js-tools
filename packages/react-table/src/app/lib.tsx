import { faker } from "@faker-js/faker";

export type Row = {
  id: string;
  country: string;
  firstName: string;
  lastName: string;
  date: string;
  colors: string[];
  age: number;
  year: number;
  sport: string;
  checked: boolean;
  children?: Row[];
};

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

export function createRows(): Row[] {
  const rows: Row[] = [];

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
      checked: faker.datatype.boolean(),
      children:
        i % 10 === 0
          ? Array.from({ length: 5 }, (_, childId) => {
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
                children:
                  i === 0
                    ? Array.from({ length: 5 }, (_, childExtraId) => {
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
                          colors: Array.from({ length: 1 + faker.number.int(3) }, () =>
                            faker.color.human(),
                          ),
                        };
                      })
                    : undefined,
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
