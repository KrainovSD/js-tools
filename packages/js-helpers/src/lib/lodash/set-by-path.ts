/* eslint-disable max-depth */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { isArray, isObject } from "../typings";
import { isString } from "../typings";

const startArray = "[".codePointAt(0)!;
const endArray = "]".codePointAt(0)!;
const separator = ".".codePointAt(0)!;
const numbers = new Set(
  ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].map((n) => n.codePointAt(0)!),
);
export function setByPath(data: unknown, path: string | undefined, settableValue: unknown) {
  if (!isString(path) || (!isObject(data) && !isArray(data))) return false;

  let cursor = 0;
  let pathStart = 0;
  let arrayPathStart = -1;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let extractedData: any = data;
  let prevPath: string | number | undefined;

  try {
    while (cursor < path.length) {
      const char = path.codePointAt(cursor)!;
      /** get */
      if (char === separator) {
        arrayPathStart = -1;
        if (pathStart === cursor) {
          pathStart++;
        } else {
          if (prevPath) {
            const object = {};
            extractedData[prevPath] = object;
            extractedData = object;
          }

          if (cursor === path.length - 1) {
            extractedData[path.slice(pathStart, cursor)] = settableValue;
          } else {
            const currentPath = path.slice(pathStart, cursor);
            const extractedValue = extractedData[currentPath];
            if (extractedValue == undefined) {
              prevPath = currentPath;
            } else {
              extractedData = extractedValue;
            }
            pathStart = cursor + 1;
          }
        }

        /** start array path if not started yet */
      } else if (char === startArray && arrayPathStart === -1) {
        arrayPathStart = cursor;
        /** end array if its started min 2 char ago */
      } else if (char === endArray && arrayPathStart !== -1 && cursor - arrayPathStart > 1) {
        /** before array was an object path */
        if (pathStart < arrayPathStart) {
          if (prevPath) {
            const object = {};
            extractedData[prevPath] = object;
            extractedData = object;
          }
          const currentPath = path.slice(pathStart, arrayPathStart);
          const extractedValue = extractedData[currentPath];
          if (extractedValue == undefined) {
            prevPath = currentPath;
          } else {
            extractedData = extractedValue;
          }
        }

        if (prevPath) {
          const array: unknown[] = [];
          extractedData[prevPath] = array;
          extractedData = array;
        }
        const index = +path.slice(arrayPathStart + 1, cursor);
        if (cursor === path.length - 1) {
          extractedData[index] = settableValue;
        } else {
          const extractedValue = extractedData[index];
          if (extractedValue == undefined) {
            prevPath = index;
          } else {
            extractedData = extractedValue;
          }
        }
        arrayPathStart = -1;
        pathStart = cursor + 1;

        /** if array started but char is not number */
      } else if (arrayPathStart !== -1 && !numbers.has(char)) {
        arrayPathStart = -1;
      }
      cursor++;
    }

    if (pathStart < path.length) {
      if (prevPath) {
        const object = {};
        extractedData[prevPath] = object;
        extractedData = object;
      }
      extractedData[path.slice(pathStart, cursor)] = settableValue;
    }
  } catch {
    return false;
  }

  return true;
}
