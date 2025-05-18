export type ThemeName = "light";

export type ThemeTransitionVariable =
  | "ksd-transition-fast"
  | "ksd-transition-mid"
  | "ksd-transition-slow";

export type ThemeControlHeight =
  | "ksd-control-height"
  | "ksd-control-height-sm"
  | "ksd-control-height-lg";

export type ThemeShadowVariable =
  | "ksd-shadow"
  | "ksd-shadow-secondary"
  | "ksd-shadow-tertiary"
  | "ksd-shadow-accent"
  | "ksd-shadow-right"
  | "ksd-shadow-left"
  | "ksd-shadow-top"
  | "ksd-shadow-bottom";

export type ThemeFontVariable =
  | "ksd-font-size-sm"
  | "ksd-font-size-lg"
  | "ksd-font-size-xl"
  | "ksd-font-family"
  | "ksd-line-height"
  | "ksd-font-weight";

export type ThemeBorderVariable =
  | "ksd-border-radius-xs"
  | "ksd-border-radius-sm"
  | "ksd-border-radius"
  | "ksd-border-radius-lg"
  | "ksd-border-radius-outer";

export type ThemePaddingVariable =
  | "ksd-padding-xxs"
  | "ksd-padding-xs"
  | "ksd-padding-sm"
  | "ksd-padding-md"
  | "ksd-padding-lg"
  | "ksd-padding-xl"
  | "ksd-padding";

export type ThemeColorVariable =
  | "ksd-bg-color"
  | "ksd-text-bg-hover-color"
  | "ksd-text-bg-active-color"
  | "ksd-text-bg-disabled-color"
  | "ksd-bg-sidebar-color"
  | "ksd-bg-header-color"
  | "ksd-bg-modal-color"
  | "ksd-text-main-color"
  | "ksd-text-main-disabled-color"
  | "ksd-text-main-hover-color"
  | "ksd-text-secondary-color"
  | "ksd-text-secondary-disabled-color"
  | "ksd-text-secondary-hover-color"
  | "ksd-text-accent-hover-color"
  | "ksd-text-accent-color"
  | "ksd-text-accent-active-color"
  | "ksd-text-reverse-color"
  | "ksd-text-reverse-secondary-color"
  | "ksd-border-accent-hover-color"
  | "ksd-border-accent-color"
  | "ksd-border-accent-active-color"
  | "ksd-border-color"
  | "ksd-border-hover-color"
  | "ksd-accent-color"
  | "ksd-accent-hover-color"
  | "ksd-accent-active-color"
  | "ksd-error-color"
  | "ksd-error-active-color"
  | "ksd-error-hover-color"
  | "ksd-error-bg-color"
  | "ksd-error-bg-active-color"
  | "ksd-error-bg-hover-color";

export type ThemeCollapseVariable = "ksd-collapse-header-bg" | "ksd-collapse-body-bg";
export type ThemeButtonVariable =
  | "ksd-button-border"
  | "ksd-button-bg"
  | "ksd-button-padding"
  | "ksd-button-padding-lg"
  | "ksd-button-padding-sm"
  | "ksd-button-border-disabled-color"
  | "ksd-button-text-disabled-color"
  | "ksd-button-bg-disabled-color";

export type ThemeVariableConfig = {
  common: {
    transition: Record<ThemeTransitionVariable, string>;
    shadow: Record<ThemeShadowVariable, string>;
    font: Record<ThemeFontVariable, string>;
    border: Record<ThemeBorderVariable, string>;
    padding: Record<ThemePaddingVariable, string>;
    colors: Record<ThemeColorVariable, string>;
    controlHeight: Record<ThemeControlHeight, string>;
  };
  components: {
    collapse: Record<ThemeCollapseVariable, string>;
    button: Record<ThemeButtonVariable, string>;
  };
};
