import set from "lodash/set";

export function setByPath(data: Record<string, unknown>, path: string, value: unknown) {
  try {
    set(data, path, value);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error);
  }
}
