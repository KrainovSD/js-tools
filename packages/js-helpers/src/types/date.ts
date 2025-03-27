import type { Dayjs } from "dayjs";
import { type DATE_TYPES } from "../constants";
import { type ValueOf } from "./common";

export type DateType = ValueOf<typeof DATE_TYPES>;
export type DateGetterRule = {
  increment: number;
  type: DateType;
};

export type DayJS = Dayjs;
