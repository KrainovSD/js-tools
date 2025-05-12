import { faker } from "@faker-js/faker";
import type { TableColumn } from "../types";

export const columns: TableColumn<Row, "test">[] = [
  //   SelectColumn,

  {
    key: "id",
    name: "ID",
    width: 120,
    resizable: true,
    sortType: "string-with-number",
    draggable: false,
    leftFrozen: true,
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
    headerClass: ["common"],
    leftFrozen: true,
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
    name: "Очень длинное название колонки для тестов переноса строк",
    width: 234,
    filterable: true,
    filterRender: "string",
    filterType: "includes-string",
    resizable: true,
    draggable: true,
    sortable: true,
    cellClass: ["common", "empty", "lineClamp"],
    headerClass: ["common", "lineClamp"],
    cellRender: "text",
    cellRenderProps: {
      pathToTooltip: "description",
      autoTooltip: true,
      Link: (props) => {
        // eslint-disable-next-line react/prop-types
        return <a href={props.row.country}>{props.children}</a>;
      },
    },
    // leftFrozen: true,
  },
  {
    key: "colors",
    name: "Colors",
    width: 200,
    resizable: true,
    draggable: false,
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
    draggable: false,
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
    draggable: false,
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
    draggable: false,
    sortType: "boolean",
  },
  {
    key: "country",
    name: "Country",
    width: 200,
    draggable: false,
    resizable: true,
    // grouping: true,
  },
  {
    key: "sport",
    name: "Sport",
    width: 200,
    draggable: false,
    resizable: true,
  },
  {
    key: "date",
    name: "Date",
    width: 500,
    sortType: "date",
    resizable: false,
    draggable: false,
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
    key: "checked1",
    name: "Checked",
    width: 200,
    resizable: true,
    draggable: false,
    sortType: "boolean",
  },
  {
    key: "checked2",
    name: "Checked",
    width: 200,
    resizable: true,
    draggable: false,
    sortType: "boolean",
  },
  {
    key: "checked3",
    name: "Checked",
    width: 200,
    resizable: true,
    draggable: false,
    sortType: "boolean",
  },
  {
    key: "checked4",
    name: "Checked",
    width: 200,
    resizable: true,
    draggable: false,
    sortType: "boolean",
  },
  {
    key: "checked5",
    name: "Checked",
    width: 200,
    resizable: true,
    draggable: false,
    sortType: "boolean",
  },
  {
    key: "checked6",
    name: "Checked",
    width: 200,
    resizable: true,
    draggable: false,
    sortType: "boolean",
  },
  {
    key: "checked7",
    name: "Checked",
    width: 200,
    resizable: true,
    draggable: false,
    sortType: "boolean",
  },
  {
    key: "checked8",
    name: "Checked",
    width: 200,
    resizable: true,
    draggable: false,
    sortType: "boolean",
  },
  {
    key: "checked9",
    name: "Checked",
    width: 200,
    resizable: true,
    draggable: false,
    sortType: "boolean",
    rightFrozen: true,
  },
];

export type Row = {
  id: string;
  country: string;
  firstName: string;
  lastName: string;
  description?: string;
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
      description: "Описание",
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
