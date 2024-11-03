import { DATE_TYPES } from "../../constants";
import { type DateGetterRule, type DateType } from "../../types";

export function getDateByRules(rules: DateGetterRule[], date: Date = new Date()) {
  let result = new Date(date);
  for (const rule of rules) {
    result = getDate(rule.increment, rule.type, result);
  }

  return result;
}

function getDate(increment: number, type: DateType, date: Date = new Date()) {
  const result = new Date(date);
  switch (type) {
    case DATE_TYPES.Days: {
      result.setDate(result.getDate() + increment);

      return result;
    }
    case DATE_TYPES.Months: {
      result.setMonth(result.getMonth() + increment);

      return result;
    }
    case DATE_TYPES.Years: {
      result.setFullYear(result.getFullYear() + increment);

      return result;
    }
    case DATE_TYPES.Seconds: {
      result.setSeconds(result.getSeconds() + increment);

      return result;
    }
    case DATE_TYPES.Minutes: {
      result.setMinutes(result.getMinutes() + increment);

      return result;
    }
    case DATE_TYPES.Hours: {
      result.setHours(result.getHours() + increment);

      return result;
    }
    default:
      return result;
  }
}
