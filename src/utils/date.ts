import dayjs from "dayjs";
import todayPlugin from "dayjs/plugin/isToday";
import tomorrowPlugin from "dayjs/plugin/isTomorrow";
import yesterdayPlugin from "dayjs/plugin/isYesterday";
import { DATE_TYPES, DateGetterRule, DateType, Maybe } from "../types";

dayjs.extend(todayPlugin);
dayjs.extend(yesterdayPlugin);
dayjs.extend(tomorrowPlugin);

function isToday(date: Maybe<string | Date | number>) {
  try {
    return dayjs(date).isToday();
  } catch {
    return false;
  }
}
function isYesterday(date: Maybe<string | Date | number>) {
  try {
    return dayjs(date).isYesterday();
  } catch {
    return false;
  }
}
function isTomorrow(date: Maybe<string | Date | number>) {
  try {
    return dayjs(date).isTomorrow();
  } catch {
    return false;
  }
}

function getDate(increment: number, type: DateType, date: Date = new Date()) {
  const result = new Date(date);
  switch (type) {
    case DATE_TYPES.days: {
      result.setDate(result.getDate() + increment);

      return result;
    }
    case DATE_TYPES.months: {
      result.setMonth(result.getMonth() + increment);

      return result;
    }
    case DATE_TYPES.years: {
      result.setFullYear(result.getFullYear() + increment);

      return result;
    }
    case DATE_TYPES.seconds: {
      result.setSeconds(result.getSeconds() + increment);

      return result;
    }
    case DATE_TYPES.minutes: {
      result.setMinutes(result.getMinutes() + increment);

      return result;
    }
    case DATE_TYPES.hours: {
      result.setHours(result.getHours() + increment);

      return result;
    }
    default:
      return result;
  }
}

function getDateByMultipleRule(rules: DateGetterRule[], date: Date = new Date()) {
  let result = new Date(date);
  for (const rule of rules) {
    result = getDate(rule.increment, rule.type, result);
  }

  return result;
}

function differenceDate(
  type: DateType,
  firstDate: Date,
  secondDate: Date = new Date(),
  float: boolean = false,
) {
  const first = dayjs(firstDate);

  return first.diff(secondDate, type, float);
}

function getTomorrow() {
  const tomorrow = new Date();
  tomorrow.setHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return tomorrow;
}
function getYesterday() {
  const yesterday = new Date();
  yesterday.setHours(0, 0, 0, 0);
  yesterday.setDate(yesterday.getDate() - 1);

  return yesterday;
}
function getToday() {
  const startToday = new Date();
  startToday.setHours(0, 0, 0, 0);
  const endToday = new Date();
  endToday.setHours(23, 59, 59, 999);

  return { startToday, endToday };
}

export default {
  isToday,
  isTomorrow,
  isYesterday,
  getDate,
  getDateByMultipleRule,
  differenceDate,
  getToday,
  getYesterday,
  getTomorrow,
};
