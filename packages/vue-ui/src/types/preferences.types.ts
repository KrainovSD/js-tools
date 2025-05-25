export type ThemeName = "light";

export type ThemeTransitionVariable =
  | "ksd-transition-fast"
  | "ksd-transition-mid"
  | "ksd-transition-slow";

export type ThemeControlHeight =
  | "ksd-control-height"
  | "ksd-control-height-sm"
  | "ksd-control-height-lg"
  | "ksd-control-interactive-size";

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

export type ThemeMarginVariable =
  | "ksd-margin-xxs"
  | "ksd-margin-xs"
  | "ksd-margin-sm"
  | "ksd-margin-md"
  | "ksd-margin-lg"
  | "ksd-margin-xl"
  | "ksd-margin-xxl"
  | "ksd-margin";

export type ThemeColorVariable =
  | "ksd-bg-color"
  | "ksd-bg-container-color"
  | "ksd-bg-mask-color"
  | "ksd-bg-sidebar-color"
  | "ksd-bg-header-color"
  | "ksd-bg-modal-color"
  | "ksd-text-bg-hover-color"
  | "ksd-text-bg-active-color"
  | "ksd-text-bg-disabled-color"
  | "ksd-text-main-color"
  | "ksd-text-main-disabled-color"
  | "ksd-text-main-hover-color"
  | "ksd-text-secondary-color"
  | "ksd-text-secondary-disabled-color"
  | "ksd-text-secondary-hover-color"
  | "ksd-text-reverse-color"
  | "ksd-text-reverse-secondary-color"
  | "ksd-border-split-color"
  | "ksd-border-color"
  | "ksd-border-hover-color"
  | "ksd-outline-color"
  | "ksd-accent-color"
  | "ksd-accent-hover-color"
  | "ksd-accent-active-color"
  | "ksd-accent-bg-color"
  | "ksd-accent-bg-hover-color"
  | "ksd-error-color"
  | "ksd-error-active-color"
  | "ksd-error-hover-color"
  | "ksd-error-bg-color"
  | "ksd-error-bg-active-color"
  | "ksd-error-bg-hover-color"
  | "ksd-warning-color"
  | "ksd-warning-active-color"
  | "ksd-warning-hover-color"
  | "ksd-warning-bg-color"
  | "ksd-warning-bg-active-color"
  | "ksd-warning-bg-hover-color"
  | "ksd-success-color"
  | "ksd-success-active-color"
  | "ksd-success-hover-color"
  | "ksd-success-bg-color"
  | "ksd-success-bg-active-color"
  | "ksd-success-bg-hover-color"
  | "ksd-info-color"
  | "ksd-info-active-color"
  | "ksd-info-hover-color"
  | "ksd-info-bg-color"
  | "ksd-info-bg-active-color"
  | "ksd-info-bg-hover-color";

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
export type ThemeDividerVariable = "ksd-divider-color" | "ksd-divider-width";

export type ThemeVariableConfig = {
  common: {
    transition: Record<ThemeTransitionVariable, string>;
    shadow: Record<ThemeShadowVariable, string>;
    font: Record<ThemeFontVariable, string>;
    border: Record<ThemeBorderVariable, string>;
    padding: Record<ThemePaddingVariable, string>;
    margin: Record<ThemeMarginVariable, string>;
    colors: Record<ThemeColorVariable, string>;
    controlHeight: Record<ThemeControlHeight, string>;
  };
  components: {
    collapse: Record<ThemeCollapseVariable, string>;
    button: Record<ThemeButtonVariable, string>;
    divider: Record<ThemeDividerVariable, string>;
  };
};
