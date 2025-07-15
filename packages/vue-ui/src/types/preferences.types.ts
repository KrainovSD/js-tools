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
  ThemeFilterVariable,
  ThemeInputVariable,
  ThemeMessageVariable,
  ThemeModalVariable,
  ThemeNotificationVariable,
  ThemePopConfirmVariable,
  ThemePopoverVariable,
  ThemePopperVariable,
  ThemeRadioVariable,
  ThemeSelectVariable,
  ThemeSkeletonVariable,
  ThemeSliderVariable,
  ThemeSwitchVariable,
  ThemeTableVariable,
  ThemeTagVariable,
} from "./preference-components";

export type ThemeName = "light" | "dark";

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
    popover: Record<ThemePopoverVariable, string>;
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
    modal: Record<ThemeModalVariable, string>;
    tag: Record<ThemeTagVariable, string>;
    skeleton: Record<ThemeSkeletonVariable, string>;
    table: Record<ThemeTableVariable, string>;
    filter: Record<ThemeFilterVariable, string>;
  };
};
