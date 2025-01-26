export type ValueOf<T> = T extends Record<string, string> ? T[keyof T] : unknown;
