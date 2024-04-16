type DefaultLogOptions = {
    info?: Record<string, unknown>;
    message?: string;
};
export type DebugOptions = {
    error?: unknown;
} & DefaultLogOptions;
export type InfoOptions = {} & DefaultLogOptions;
export type WarnOptions = {
    error?: unknown;
} & DefaultLogOptions;
export type ErrorOptions = {
    error?: unknown;
} & DefaultLogOptions;
export {};
