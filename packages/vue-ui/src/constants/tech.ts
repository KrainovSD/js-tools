import type { CloseByClickOutsideEvent } from "../types";
import type { PopperTrigger } from "../ui";

export const DEFAULT_CLOSE_BY_CLICK_OUTSIDE_EVENT: CloseByClickOutsideEvent = "pointerdown";
export const POPPER_SELECTOR = "[ksd-popper]";
export const WATCHER_SELECTOR = "[ksd-watcher]";
export const AVATAR_SHIFT_DEFAULT = 10;
export const AVATAR_COUNT_DEFAULT = 3;
export const COLOR_PICKER_DEFAULT = "#ffffff";
export const DATE_PICKER_DISPLAY_FORMAT = "DD.MM.YYYY";
export const DATE_PICKER_OUTPUT_FORMAT = "YYYY-MM-DD";
export const WEEK_DAY_DATE_MAP = [
  new Date("2026-01-04T00:00:00.000Z").getTime(),
  new Date("2026-01-05T00:00:00.000Z").getTime(),
  new Date("2026-01-06T00:00:00.000Z").getTime(),
  new Date("2026-01-07T00:00:00.000Z").getTime(),
  new Date("2026-01-08T00:00:00.000Z").getTime(),
  new Date("2026-01-09T00:00:00.000Z").getTime(),
  new Date("2026-01-10T00:00:00.000Z").getTime(),
];
export const INPUT_POPPER_TRIGGERS: PopperTrigger[] = [];
