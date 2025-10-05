import type { CloseByClickOutsideEvent } from "../types";
import type { PopperTrigger } from "../ui";

export const DEFAULT_CLOSE_BY_CLICK_OUTSIDE_EVENT: CloseByClickOutsideEvent = "pointerdown";
export const POPPER_SELECTOR = "[ksd-popper]";
export const WATCHER_SELECTOR = "[ksd-watcher]";
export const AVATAR_SHIFT_DEFAULT = 10;
export const AVATAR_COUNT_DEFAULT = 3;
export const COLOR_PICKER_DEFAULT = "#ffffff";
export const NUMBER_KEYS = new Set(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);
export const INPUT_POPPER_TRIGGERS: PopperTrigger[] = [];
