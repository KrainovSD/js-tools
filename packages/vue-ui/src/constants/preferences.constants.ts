import type { ThemeName, ThemeVariableConfig } from "../types";
import { DARK_THEME } from "./dark";
import { LIGHT_THEME } from "./light";

/**
Z-index:

Modal - 100
Popper - 110
DropDown - 120
PopConfirm - 130
Select - 140
Search - 140
Notification - 150
Message - 160
Tooltip - 170
 */

export const THEME_CONFIG: Record<ThemeName, ThemeVariableConfig> = {
  light: LIGHT_THEME,
  dark: DARK_THEME,
};
