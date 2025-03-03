import { FIELD_TYPES } from "../../constants";
import type { FieldType } from "../../types";
import { dateFormat } from "../date";
import { isArray, isBoolean, isDate, isNumber, isString } from "../typings";
import { transformToNumber } from "./transform-to-number";

export function fieldViewFormat(field: unknown, type: FieldType = "string") {
  switch (type) {
    case FIELD_TYPES.Array: {
      return isArray(field) ? field.join(", ") : "";
    }
    case FIELD_TYPES.Date: {
      return isString(field) || isNumber(field) || isDate(field)
        ? dateFormat(field, "DD.MM.YYYY")
        : "";
    }
    case FIELD_TYPES.DateTime: {
      return isString(field) || isNumber(field) || isDate(field)
        ? dateFormat(field, "DD.MM.YYYY HH:mm")
        : "";
    }
    case FIELD_TYPES.Number: {
      return isString(field) || isNumber(field) || isBoolean(field)
        ? String(transformToNumber(field))
        : "";
    }
    case FIELD_TYPES.String: {
      return isString(field) || isNumber(field) || isBoolean(field) ? String(field) : "";
    }
    case FIELD_TYPES.Time: {
      return isString(field) || isNumber(field) || isDate(field) ? dateFormat(field, "HH:mm") : "";
    }
    default: {
      return isString(field) || isNumber(field) || isBoolean(field) ? String(field) : "";
    }
  }
}
