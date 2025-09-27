<script
  setup
  lang="ts"
  generic="F extends string | number, O extends string | number, C extends string | number"
>
  import { isString } from "@krainovsd/js-helpers";
  import { VDeleteOutlined } from "@krainovsd/vue-icons";
  import { computed } from "vue";
  import Button, { type ButtonSize } from "../Button.vue";
  import Control from "../Control.vue";
  import type { InputSize, InputVariant } from "../Input.vue";
  import Select, { type SelectItem } from "../Select.vue";
  import type { QueryCombinator, QueryConditionRule, QueryField } from "./QueryBuilder.vue";

  type Props = {
    fields: QueryField<F, O>[];
    combinators: QueryCombinator<C>[];
    rule: QueryConditionRule<F, O>;
    fieldVariants: SelectItem[];
    buttonSize?: ButtonSize;
    controlSize?: InputSize;
    controlVariant?: InputVariant;
  };
  type Emits = {
    updateRule: [rule: QueryConditionRule<F, O>];
    deleteRule: [];
  };

  const props = defineProps<Props>();
  defineEmits<Emits>();

  const currentField = computed(() => props.fields.find((f) => f.field === props.rule.field));
  const operatorVariants = computed<SelectItem[]>(() => {
    if (!currentField.value) return [];

    return currentField.value.components.map<SelectItem>((c) => ({
      label: c.operatorLabel,
      value: c.operatorValue,
    }));
  });
  const componentInfo = computed(() => {
    if (!currentField.value) return null;

    return currentField.value.components.find((c) => c.operatorValue === props.rule.operator);
  });
</script>

<template>
  <div class="ksd-query-builder__rule">
    <Select
      class="ksd-query-builder__field"
      :model-value="$props.rule.field"
      :options="$props.fieldVariants"
      :clear="false"
      :size="$props.controlSize"
      :variant="$props.controlVariant"
      @update:model-value="
        (value) =>
          $emit('updateRule', {
            ...props.rule,
            field: value as F,
            operator: props.fields.find((f) => f.field === value)?.components?.[0]
              ?.operatorValue as O,
            value: null,
          })
      "
    />
    <Select
      class="ksd-query-builder__operator"
      :model-value="$props.rule.operator"
      :options="operatorVariants"
      :clear="false"
      :size="$props.controlSize"
      :variant="$props.controlVariant"
      @update:model-value="
        (value) => {
          const newComponentTag = currentField?.components?.find?.(
            (c) => c.operatorValue === value,
          )?.clearTag;

          $emit('updateRule', {
            ...props.rule,
            operator: value as O,
            value:
              newComponentTag == undefined || newComponentTag === componentInfo?.clearTag
                ? props.rule.value
                : null,
          });
        }
      "
    />

    <template v-if="componentInfo">
      <Control
        v-if="isString(componentInfo.component)"
        class="ksd-query-builder__component"
        :component="componentInfo.component"
        :props="componentInfo.props"
        :model-value="props.rule.value"
        :control-size="$props.controlSize"
        :control-variant="$props.controlVariant"
        @update:model-value="
          (value) =>
            $emit('updateRule', {
              ...props.rule,
              value,
            })
        "
      />
      <component
        :is="componentInfo.component"
        v-else
        :props="componentInfo.props"
        :model-value="props.rule.value"
        :control-size="$props.controlSize"
        :control-variant="$props.controlVariant"
        @update:model-value="
          (value: unknown) =>
            $emit('updateRule', {
              ...props.rule,
              value,
            })
        "
      />
    </template>
    <Button
      :size="$props.buttonSize"
      type="text"
      class="ksd-query-builder__rule-delete"
      @click="$emit('deleteRule')"
    >
      <template #icon>
        <VDeleteOutlined />
      </template>
    </Button>
  </div>
</template>

<style lang="scss">
  .ksd-query-builder {
    &__rule {
      display: flex;
      align-items: center;
      gap: var(--ksd-padding-sm);
      padding: var(--ksd-padding-xs) var(--ksd-padding) var(--ksd-padding-xs) var(--ksd-padding);
    }

    &__field {
      width: 100%;
    }
    &__operator {
      width: 100%;
    }
    &__component {
      width: 100%;
    }
    &__rule-delete {
      min-width: var(--ksd-control-height);
    }
  }
</style>
