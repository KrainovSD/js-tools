/* eslint-disable max-depth */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { isArray, isObject, isString } from "../typings";

const startArray = "[".codePointAt(0)!;
const endArray = "]".codePointAt(0)!;
const separator = ".".codePointAt(0)!;
const numbers = new Set(
  ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].map((n) => n.codePointAt(0)!),
);
export function getByPath<T, D = undefined>(
  data: unknown,
  path: string | undefined,
  defaultValue?: D,
): T | D {
  if (!isString(path) || (!isObject(data) && !isArray(data))) return defaultValue as D;

  let cursor = 0;
  let pathStart = 0;
  let arrayPathStart = -1;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let extractedData: any = data;

  try {
    while (cursor < path.length) {
      const char = path.codePointAt(cursor)!;

      if (char === separator) {
        arrayPathStart = -1;
        if (pathStart === cursor) {
          pathStart++;
        } else {
          if (extractedData == undefined || typeof extractedData !== "object")
            return defaultValue as D;
          extractedData = extractedData[path.slice(pathStart, cursor)];

          pathStart = cursor + 1;
        }
        /** start array path if not started yet */
      } else if (char === startArray && arrayPathStart === -1) {
        arrayPathStart = cursor;
        /** end array if its started min 2 char ago */
      } else if (char === endArray && arrayPathStart !== -1 && cursor - arrayPathStart > 1) {
        /** before array was an object path */
        if (pathStart < arrayPathStart) {
          if (extractedData == undefined || typeof extractedData !== "object")
            return defaultValue as D;
          extractedData = extractedData[path.slice(pathStart, arrayPathStart)];
        }

        const index = +path.slice(arrayPathStart + 1, cursor);
        if (!Array.isArray(extractedData)) return defaultValue as D;
        extractedData = extractedData[index];

        arrayPathStart = -1;
        pathStart = cursor + 1;

        /** if array started but char is not number */
      } else if (arrayPathStart !== -1 && !numbers.has(char)) {
        arrayPathStart = -1;
      }
      cursor++;
    }

    if (pathStart < path.length) {
      if (extractedData == undefined || typeof extractedData !== "object") return defaultValue as D;
      extractedData = extractedData[path.slice(pathStart, cursor)];
    }
  } catch {
    return defaultValue as D;
  }

  if (extractedData === undefined) {
    return defaultValue as D;
  }

  return extractedData as T;
}
