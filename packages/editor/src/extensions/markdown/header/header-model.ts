export const NAME_OF_HEADER = "ATXHeading";
export const NAME_OF_HEADER_UNDER = "SetextHeading";
export const NAME_OF_HEADER_MARK = "HeaderMark";

export type HeaderEntry = {
  lineStart: number;
  from: number;
  to: number;
  id: string;
  slug: string;
  level: number;
};
