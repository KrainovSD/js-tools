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

export type FilterItem<F extends string | number, O extends string | number> = {
  field: F;
  label: string;
  icon?: Component;
  components: FilterComponent<O>[];
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
  filters: FilterItem<F, O>[];
  label?: string;
  icon?: Component;
  buttonSize?: ButtonSize;
  controlSize?: ButtonSize;
  controlVariant?: InputVariant;
  direction?: FilterDirection;
  displayedDateFormat?: string;
  wrap?: boolean;
};
