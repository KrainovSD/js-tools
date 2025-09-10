export * from "./errors";
export * from "./environment";

export const COLOR_FORMATS = {
  Hex: "HEX",
  Rgb: "RGB",
  Rgba: "RGBA",
  Hsl: "HSL",
} as const;

export const DATE_TYPES = {
  Days: "days",
  Months: "months",
  Years: "years",
  Seconds: "seconds",
  Minutes: "minutes",
  Hours: "hours",
} as const;

export const FIELD_TYPES = {
  Date: "date",
  Time: "time",
  DateTime: "dateTime",
  String: "string",
  Number: "number",
  Array: "array",
} as const;
