import { getByPath } from "../lodash/get-by-path";
import { setByPath } from "../lodash/set-by-path";
import { isUndefined } from "../typings";

export function syncObjectValues(
  oldObj: Record<string, unknown>,
  newObj: Record<string, unknown>,
  exception: string[] = [],
) {
  for (const field in newObj) {
    if (exception.includes(field)) continue;

    const oldValue = getByPath(oldObj, field, undefined);
    const newValue = getByPath(newObj, field, undefined);

    if (isUndefined(oldValue) || isUndefined(newValue)) continue;
    if (oldValue === newValue) continue;

    setByPath(oldObj, field, newValue);
  }
}
