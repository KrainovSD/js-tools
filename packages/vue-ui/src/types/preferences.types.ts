import type {
  ThemeBorderVariable,
  ThemeColorVariable,
  ThemeFontVariable,
  ThemeMarginVariable,
  ThemeOther,
  ThemePaddingVariable,
  ThemeShadowVariable,
  ThemeSizes,
  ThemeTransitionVariable,
} from "./preference-common";
import type {
  ThemeButtonVariable,
  ThemeCollapseVariable,
  ThemeDividerVariable,
  ThemeDropDownVariable,
  ThemeInputVariable,
  ThemeMessageVariable,
  ThemeNotificationVariable,
  ThemePopConfirmVariable,
  ThemePopperVariable,
  ThemeRadioVariable,
  ThemeSelectVariable,
  ThemeSliderVariable,
  ThemeSwitchVariable,
} from "./preference-components";

export type ThemeName = "light";

export type ThemeVariableConfig = {
  common: {
    transition: Record<ThemeTransitionVariable, string>;
    shadow: Record<ThemeShadowVariable, string>;
    font: Record<ThemeFontVariable, string>;
    border: Record<ThemeBorderVariable, string>;
    padding: Record<ThemePaddingVariable, string>;
    margin: Record<ThemeMarginVariable, string>;
    colors: Record<ThemeColorVariable, string>;
    sizes: Record<ThemeSizes, string>;
    other: Record<ThemeOther, string>;
  };
  components: {
    collapse: Record<ThemeCollapseVariable, string>;
    button: Record<ThemeButtonVariable, string>;
    divider: Record<ThemeDividerVariable, string>;
    input: Record<ThemeInputVariable, string>;
    radio: ThemeRadioVariable;
    slider: Record<ThemeSliderVariable, string>;
    switch: Record<ThemeSwitchVariable, string>;
    popper: Record<ThemePopperVariable, string>;
    dropdown: Record<ThemeDropDownVariable, string>;
    select: Record<ThemeSelectVariable, string>;
    popconfirm: Record<ThemePopConfirmVariable, string>;
    message: Record<ThemeMessageVariable, string>;
    notification: Record<ThemeNotificationVariable, string>;
  };
};
