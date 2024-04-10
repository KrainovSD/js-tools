export type Maybe<T> = T | undefined | null;
export type ValueOf<T> = T extends {} ? T[keyof T] : unknown;

export const DATE_TYPES = {
  days: 'days',
  months: 'months',
  years: 'years',
  seconds: 'seconds',
  minutes: 'minutes',
  hours: 'hours',
} as const;
export type DateType = ValueOf<typeof DATE_TYPES>;
export type DateGetterRule = {
  increment: number;
  type: DateType;
};
