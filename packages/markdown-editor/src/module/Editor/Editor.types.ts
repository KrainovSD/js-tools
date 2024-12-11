import { type ExtensionsOptions } from "@/extensions";

export type EditorArguments = {
  root: HTMLElement;
  initialText?: string;
  multiCursor?: MultiCursorOptions;
} & ExtensionsOptions;

export type MultiCursorOptions = {
  url: string;
  userName?: string;
  userColor?: string;
  roomId: string;
  logger?: boolean;
};
