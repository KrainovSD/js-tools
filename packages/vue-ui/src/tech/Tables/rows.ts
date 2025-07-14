import { randomNumber } from "@krainovsd/js-helpers";
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
const COLORS = [
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
];
const SPORTS = [
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

export function createRows(
  length: number = 1000,
  children: boolean = false,
  maxDepth: number = 2,
  depth: number = 0,
): RowData[] {
  return Array.from<unknown, RowData>({ length }, (_, id) => {
    const age = randomNumber(18, 70);
    const birth = new Date();
    birth.setFullYear(birth.getFullYear() - age);

    return {
      id,
      firstName: NAMES[randomNumber(0, NAMES.length - 1)],
      age,
      approved: BOOLEAN[randomNumber(-1, 1).toString() as keyof typeof BOOLEAN],
      birth: birth.getTime(),
      colors: Array.from(
        { length: randomNumber(0, 4) },
        () => COLORS[randomNumber(0, COLORS.length - 1)],
      ),
      lastWork: {
        address: ADDRESSES[randomNumber(0, ADDRESSES.length - 1)],
        duration: randomNumber(0, 356 * 10),
      },
      sport: SPORTS[randomNumber(0, SPORTS.length - 1)],
      works: Array.from<unknown, RowWork>({ length: randomNumber(0, 4) }, () => ({
        address: ADDRESSES[randomNumber(0, ADDRESSES.length - 1)],
        duration: randomNumber(0, 356 * 10),
      })),
      children:
        children && depth <= maxDepth && id % 10 === 0
          ? createRows(5, true, maxDepth, depth + 1)
          : undefined,
    };
  });
}
