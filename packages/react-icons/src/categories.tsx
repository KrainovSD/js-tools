import { arrows, others } from "./components";
import type { IconCategory } from "./types";

export const ICON_CATEGORIES: IconCategory[] = [
  { icon: "Arrow", text: "Стрелки", icons: Object.keys(arrows), id: "Arrow" },
  { icon: "InfinityI", text: "Другие", icons: Object.keys(others), id: "Other" },
];
