import type { Dayjs } from "dayjs";
import type { COLOR_FORMATS, DATE_TYPES, FIELD_TYPES } from "./constants";

export type Maybe<T> = T | undefined | null;
export type ValueOf<T> = T extends {} ? T[keyof T] : unknown;
export type IsEqual<T, U> = [T] extends [U] ? ([U] extends [T] ? true : false) : false;

export type ColorFormat = ValueOf<typeof COLOR_FORMATS>;

export type DateType = ValueOf<typeof DATE_TYPES>;
export type DateGetterRule = {
  increment: number;
  type: DateType;
};

export type DayJS = Dayjs;
export type FieldType = ValueOf<typeof FIELD_TYPES>;
