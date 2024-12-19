export type Maybe<T> = T | undefined | null;
export type ValueOf<T> = T extends {} ? T[keyof T] : unknown;
