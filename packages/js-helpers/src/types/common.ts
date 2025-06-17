export type Maybe<T> = T | undefined | null;
export type ValueOf<T> = T extends {} ? T[keyof T] : unknown;
export type IsEqual<T, U> = [T] extends [U] ? ([U] extends [T] ? true : false) : false;
