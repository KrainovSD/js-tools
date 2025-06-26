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
export type ThemeDividerVariable = "ksd-divider-width";
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
  | "ksd-slider-track-bg-disabled";

export type ThemeSwitchVariable =
  | "ksd-switch-track-height"
  | "ksd-switch-track-height-sm"
  | "ksd-switch-track-min-width"
  | "ksd-switch-track-min-width-sm"
  | "ksd-switch-track-padding"
  | "ksd-switch-handle-bg"
  | "ksd-switch-handle-size"
  | "ksd-switch-handle-size-sm"
  | "ksd-switch-handle-shadow"
  | "ksd-switch-inner-min-margin"
  | "ksd-switch-inner-max-margin"
  | "ksd-switch-inner-min-margin-sm"
  | "ksd-switch-inner-max-margin-sm"
  | "ksd-switch-bg-unchecked-color"
  | "ksd-switch-bg-unchecked-hover-color"
  | "ksd-switch-checked-color"
  | "ksd-switch-unchecked-color";

export type ThemePopperVariable = "ksd-popper-inner-padding";
export type ThemeDropDownVariable =
  | "ksd-dropdown-inner-padding"
  | "ksd-dropdown-inner-padding-lg"
  | "ksd-dropdown-inner-min-width-lg"
  | "ksd-dropdown-bg-item-color";

export type ThemeSelectVariable =
  | "ksd-select-internal_fixed_item_margin"
  | "ksd-select-z-index-popup"
  | "ksd-select-option-selected-color"
  | "ksd-select-option-selected-font-weight"
  | "ksd-select-option-selected-bg"
  | "ksd-select-option-active-bg"
  | "ksd-select-option-padding"
  | "ksd-select-option-font-size"
  | "ksd-select-option-line-height"
  | "ksd-select-option-height"
  | "ksd-select-single-item-height-lg"
  | "ksd-select-multiple-item-bg"
  | "ksd-select-multiple-item-border-color"
  | "ksd-select-multiple-item-height"
  | "ksd-select-multiple-item-height-sm"
  | "ksd-select-multiple-item-height-lg"
  | "ksd-select-show-arrow-padding-inline-end"
  | "ksd-select-selector-padding-sm";

export type ThemePopConfirmVariable = "ksd-pop-confirm-inner-padding";

export type ThemeMessageVariable =
  | "ksd-message-z-index-popup"
  | "ksd-message-content-bg"
  | "ksd-message-content-padding";

export type ThemeNotificationVariable =
  | "ksd-notification-z-index-popup"
  | "ksd-notification-width"
  | "ksd-notification-inline-margin"
  | "ksd-notification-block-margin";

export type ThemeModalVariable =
  | "ksd-modal-footer-bg"
  | "ksd-modal-header-bg"
  | "ksd-modal-title-line-height"
  | "ksd-modal-title-font-size"
  | "ksd-modal-content-bg"
  | "ksd-modal-title-color"
  | "ksd-modal-content-padding"
  | "ksd-modal-header-padding"
  | "ksd-modal-header-border-bottom"
  | "ksd-modal-header-margin-bottom"
  | "ksd-modal-body-padding"
  | "ksd-modal-footer-padding"
  | "ksd-modal-footer-border-top"
  | "ksd-modal-footer-border-radius"
  | "ksd-modal-footer-margin-top"
  | "ksd-modal-margin-block";

export type ThemeTagVariable =
  | "ksd-tag-bg-color-magenta"
  | "ksd-tag-text-color-magenta"
  | "ksd-tag-border-color-magenta"
  | "ksd-tag-bg-color-red"
  | "ksd-tag-text-color-red"
  | "ksd-tag-border-color-red"
  | "ksd-tag-bg-color-volcano"
  | "ksd-tag-text-color-volcano"
  | "ksd-tag-border-color-volcano"
  | "ksd-tag-bg-color-orange"
  | "ksd-tag-text-color-orange"
  | "ksd-tag-border-color-orange"
  | "ksd-tag-bg-color-gold"
  | "ksd-tag-text-color-gold"
  | "ksd-tag-border-color-gold"
  | "ksd-tag-bg-color-lime"
  | "ksd-tag-text-color-lime"
  | "ksd-tag-border-color-lime"
  | "ksd-tag-bg-color-green"
  | "ksd-tag-text-color-green"
  | "ksd-tag-border-color-green"
  | "ksd-tag-bg-color-cyan"
  | "ksd-tag-text-color-cyan"
  | "ksd-tag-border-color-cyan"
  | "ksd-tag-bg-color-blue"
  | "ksd-tag-text-color-blue"
  | "ksd-tag-border-color-blue"
  | "ksd-tag-bg-color-geekblue"
  | "ksd-tag-text-color-geekblue"
  | "ksd-tag-border-color-geekblue"
  | "ksd-tag-bg-color-purple"
  | "ksd-tag-text-color-purple"
  | "ksd-tag-border-color-purple"
  | "ksd-tag-bg-color-success"
  | "ksd-tag-text-color-success"
  | "ksd-tag-border-color-success"
  | "ksd-tag-bg-color-processing"
  | "ksd-tag-text-color-processing"
  | "ksd-tag-border-color-processing"
  | "ksd-tag-bg-color-error"
  | "ksd-tag-text-color-error"
  | "ksd-tag-border-color-error"
  | "ksd-tag-bg-color-warning"
  | "ksd-tag-text-color-warning"
  | "ksd-tag-border-color-warning"
  | "ksd-tag-default-bg"
  | "ksd-tag-default-color";

export type ThemeSkeletonVariable =
  | "ksd-skeleton-gradient-from-color"
  | "ksd-skeleton-gradient-to-color"
  | "ksd-skeleton-title-height"
  | "ksd-skeleton-block-radius";
