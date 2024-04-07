export type Maybe<T> = T | undefined | null;
export type ValueOf<T> = T extends {} ? T[keyof T] : unknown;

export const _DateTypes = {
  days: "days",
  months: "months",
  years: "years",
  seconds: "seconds",
  minutes: "minutes",
  hours: "hours",
} as const;
export type DateType = ValueOf<typeof _DateTypes>;
export type DateGetterRule = {
  increment: number;
  type: DateType;
};
