<script setup lang="ts">
  import { VCalendarOutlined, VCloseCircleFilled } from "@krainovsd/vue-icons";
  import { computed } from "vue";
  import IconWrapper from "../IconWrapper.vue";
  import Input, { type InputSize, type InputVariant } from "../Input.vue";
  import Text from "../Text.vue";

  type Props = {
    autofocus: boolean;
    inputSize: InputSize;
    inputVariant: InputVariant;
    disabled: boolean;
    multiple: boolean;
    displayedFirstDate: string | undefined;
    displayedSecondDate: string | undefined;
  };
  type Emits = {
    updateFirstInputValue: [string | undefined];
    updateSecondInputValue: [string | undefined];
    actionInputKeyboard: [KeyboardEvent, number];
    close: [];
    open: [number];
    toggle: [];
    clear: [];
  };

  const props = defineProps<Props>();
  defineEmits<Emits>();
  const firstInputValue = defineModel<string | undefined>("firstValue", { default: undefined });
  const secondInputValue = defineModel<string | undefined>("secondValue", { default: undefined });
  const classes = computed(() => ({ disabled: props.disabled }));
</script>

<template>
  <div class="ksd-date-picker">
    <div class="ksd-date-picker__container">
      <Input
        :class-name-root="'ksd-date-picker__input'"
        :class="classes"
        :size="$props.inputSize"
        :autofocus="$props.autofocus"
        :variant="$props.inputVariant"
        :model-value="firstInputValue"
        :disabled="$props.disabled"
        placeholder="Выберите дату"
        @keydown="(event) => $emit('actionInputKeyboard', event, 0)"
        @blur="
          () => {
            firstInputValue = $props.displayedFirstDate;
            $emit('close');
          }
        "
        @focus="() => $emit('open', 0)"
        @click="() => $emit('open', 0)"
        @update:model-value="(value) => $emit('updateFirstInputValue', value)"
      >
        <template #suffix>
          <IconWrapper
            class="ksd-date-picker__input-icon calendar"
            :class="classes"
            tabindex="-1"
            @click.prevent.stop="$emit('toggle')"
            @mousedown.prevent=""
          >
            <VCalendarOutlined />
          </IconWrapper>
          <IconWrapper
            class="ksd-date-picker__input-icon cancel"
            @click.prevent.stop="$emit('clear')"
            @mousedown.prevent=""
          >
            <VCloseCircleFilled />
          </IconWrapper>
        </template>
      </Input>
    </div>

    <Text v-if="$props.multiple"> - </Text>
    <div v-if="$props.multiple" class="ksd-date-picker__container">
      <Input
        :class-name-root="'ksd-date-picker__input'"
        :class="classes"
        :size="$props.inputSize"
        :variant="$props.inputVariant"
        :model-value="secondInputValue"
        :disabled="$props.disabled"
        placeholder="Выберите дату"
        @keydown="(event) => $emit('actionInputKeyboard', event, 1)"
        @blur="
          () => {
            secondInputValue = displayedSecondDate;
            $emit('close');
          }
        "
        @focus="() => $emit('open', 0)"
        @click="() => $emit('open', 0)"
        @update:model-value="(value) => $emit('updateSecondInputValue', value)"
      >
        <template #suffix>
          <IconWrapper
            class="ksd-date-picker__input-icon calendar"
            :class="classes"
            tabindex="-1"
            @click.prevent.stop="$emit('toggle')"
            @mousedown.prevent=""
          >
            <VCalendarOutlined />
          </IconWrapper>
          <IconWrapper
            class="ksd-date-picker__input-icon cancel"
            @click.prevent.stop="$emit('clear')"
            @mousedown.prevent=""
          >
            <VCloseCircleFilled />
          </IconWrapper>
        </template>
      </Input>
    </div>
  </div>
</template>

<style lang="scss">
  .ksd-date-picker {
    display: inline-flex;
    align-items: center;
    gap: var(--ksd-padding-xs);

    &__container {
      display: inline-flex;
      position: relative;
    }

    &__input {
      &:not(.disabled):hover {
        & .calendar {
          display: none;
        }
        & .cancel {
          display: flex;
        }
      }
    }

    &__input-icon {
      color: currentColor;
      transition: color var(--ksd-transition-mid) ease-out;
      &:hover {
        color: var(--ksd-icon-hover-color);
      }

      &.calendar {
        display: flex;
      }
      &.cancel {
        display: none;
      }

      &.disabled {
        cursor: inherit;
        &:hover {
          color: currentColor;
        }
      }
    }
  }
</style>
