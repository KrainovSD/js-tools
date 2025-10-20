import type { Component } from "vue";
import type { ButtonSize } from "../Button.vue";
import type { ControlComponents } from "../Control.vue";
import type { InputVariant } from "../Input.vue";
import type { SelectItem } from "../Select.vue";

export type FilterDirection = "left" | "right";
export type FilterComponent<O extends string | number> =
  | {
      [K in keyof ControlComponents]: {
        props?: ControlComponents[K];
        component: K;
        operatorValue?: O;
        operatorLabel?: string;
        operatorShortLabel?: string;
        /** When the operator is changed, the tags of the old and new components are compared. If they differ or are missing, the previous filter value will be cleared. */
        clearTag?: string;
      };
    }[keyof ControlComponents]
  | {
      operatorValue?: O;
      operatorLabel?: string;
      operatorShortLabel?: string;
      component: Component;
      displayValue?: keyof ControlComponents;
      props?: Record<string, unknown>;
      /** When the operator is changed, the tags of the old and new components are compared. If they differ or are missing, the previous filter value will be cleared. */
      clearTag?: string;
    };

export type FilterField<F extends string | number, O extends string | number> = {
  field: F;
  label: string;
  icon?: Component;
  components: FilterComponent<O>[];
};

export type FilterItem<F extends string | number, O extends string | number> = {
  field: F;
  operator?: O | undefined;
  value: unknown;
};

export type FilterItemFlat<F extends string | number, O extends string | number> =
  | {
      [K in keyof ControlComponents]: {
        field: F;
        label: string;
        icon?: Component;
        props?: ControlComponents[K];
        component: K;
        operatorValue?: O;
        operatorLabel?: string;
        operatorShortLabel?: string;
        operators: SelectItem<O>[];
        /** When the operator is changed, the tags of the old and new components are compared. If they differ or are missing, the previous filter value will be cleared. */
        clearTag?: string;
      };
    }[keyof ControlComponents]
  | {
      field: F;
      label: string;
      icon?: Component;
      operatorValue?: O;
      operatorLabel?: string;
      operatorShortLabel?: string;
      component: Component;
      displayValue?: keyof ControlComponents;
      props?: Record<string, unknown>;
      operators: SelectItem<O>[];
      /** When the operator is changed, the tags of the old and new components are compared. If they differ or are missing, the previous filter value will be cleared. */
      clearTag?: string;
    };

export type FilterProps<
  F extends string | number = string | number,
  O extends string | number = string | number,
> = {
  /** the common list of fields with operators */
  filters: FilterField<F, O>[];
  /** the label of button that add filters */
  label?: string;
  /** the icon of button that add filters */
  icon?: Component;
  /** the size of all buttons */
  buttonSize?: ButtonSize;
  /** the size of all controls */
  controlSize?: ButtonSize;
  /** the variant of all controls */
  controlVariant?: InputVariant;
  /** the direction of appear new filters */
  direction?: FilterDirection;
  /** the common date displayed format */
  displayedDateFormat?: string;
  /** the flag for wrap filter in flex-wrap container */
  wrap?: boolean;
};
