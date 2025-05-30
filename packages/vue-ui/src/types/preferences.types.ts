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
  | "ksd-border-radius-outer"
  | "ksd-line-width"
  | "ksd-line-type";

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
  | "ksd-bg-fill-color"
  | "ksd-bg-fill-hover-color"
  | "ksd-bg-sidebar-color"
  | "ksd-bg-header-color"
  | "ksd-bg-modal-color"
  | "ksd-bg-hover-color"
  | "ksd-bg-active-color"
  | "ksd-bg-disabled-color"
  | "ksd-text-main-color"
  | "ksd-text-main-disabled-color"
  | "ksd-text-main-hover-color"
  | "ksd-text-secondary-color"
  | "ksd-text-secondary-disabled-color"
  | "ksd-text-secondary-hover-color"
  | "ksd-text-reverse-color"
  | "ksd-text-reverse-secondary-color"
  | "ksd-text-placeholder-color"
  | "ksd-border-split-color"
  | "ksd-border-color"
  | "ksd-border-hover-color"
  | "ksd-icon-color"
  | "ksd-icon-hover-color"
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
export type ThemeInputVariable =
  | "ksd-input-padding-block"
  | "ksd-input-padding-inline"
  | "ksd-input-padding-block-lg"
  | "ksd-input-padding-inline-lg"
  | "ksd-input-padding-block-sm"
  | "ksd-input-padding-inline-sm"
  | "ksd-input-active-shadow";

export type ThemeRadioVariable = {
  "ksd-radio-dot-size": number;
  "ksd-radio-size": number;
  "ksd-radio-dot-color": string;
  "ksd-radio-button-padding-inline": string;
};

export type ThemeSliderVariable =
  | "ksd-slider-control-size"
  | "ksd-slider-rail-size"
  | "ksd-slider-handle-size"
  | "ksd-slider-handle-size-hover"
  | "ksd-slider-dot-size"
  | "ksd-slider-handle-line-width"
  | "ksd-slider-handle-line-width-hover"
  | "ksd-slider-rail-bg"
  | "ksd-slider-rail-hover-bg"
  | "ksd-slider-track-bg"
  | "ksd-slider-track-hover-bg"
  | "ksd-slider-handle-color"
  | "ksd-slider-handle-active-color"
  | "ksd-slider-handle-active-outline-color"
  | "ksd-slider-handle-color-disabled"
  | "ksd-slider-dot-border-color"
  | "ksd-slider-dot-active-border-color"
  | "ksd-slider-track-bg-disabled";

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
    input: Record<ThemeInputVariable, string>;
    radio: ThemeRadioVariable;
    slider: Record<ThemeSliderVariable, string>;
  };
};
