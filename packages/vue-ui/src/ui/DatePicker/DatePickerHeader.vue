<script setup lang="ts">
  import {
    VDoubleLeftOutlined,
    VDoubleRightOutlined,
    VLeftOutlined,
    VRightOutlined,
  } from "@krainovsd/vue-icons";
  import { computed } from "vue";
  import { type DatePickerSize, type DatePickerView } from "..";
  import Button, { type ButtonSize } from "../Button.vue";
  import Text from "../Text.vue";

  type Props = {
    locale: string;
    size: DatePickerSize;
  };

  const props = defineProps<Props>();
  const decade = defineModel<number>("decade", { default: 200 });
  const year = defineModel<number>("year", { default: 2000 });
  const month = defineModel<number>("month", { default: 0 });
  const century = computed<number>(() => Math.floor(decade.value / 10));
  const view = defineModel<DatePickerView>("view", { default: "days" });
  const withMonth = computed(() => view.value === "days");
  const arrowButtonSize = computed<ButtonSize>(() =>
    props.size === "large" ? "default" : "small",
  );
  const classes = computed(() => ({ [`size-${props.size}`]: true }));

  const monthLabel = computed(() =>
    new Intl.DateTimeFormat(props.locale, { month: "short" }).format(new Date(2000, month.value)),
  );

  function prev() {}
  function prevMonth() {}

  function next() {}
  function nextMonth() {}

  function changeView() {
    if (view.value === "days") {
      view.value = "years";
    } else if (view.value === "months") {
      view.value = "years";
    } else if (view.value === "years") {
      view.value = "decades";
    }
  }
</script>

<template>
  <div class="ksd-date-picker__header" :class="classes">
    <div class="ksd-date-picker__header-left">
      <Button type="text" :size="arrowButtonSize" @click="prev">
        <template #icon>
          <VDoubleLeftOutlined />
        </template>
      </Button>
      <Button v-if="withMonth" type="text" :size="arrowButtonSize" @click="prevMonth">
        <template #icon>
          <VLeftOutlined />
        </template>
      </Button>
    </div>
    <div class="ksd-date-picker__header-view">
      <Button
        v-if="withMonth"
        class="ksd-date-picker__header-month"
        :size="$props.size"
        @click="view = 'months'"
      >
        {{ monthLabel }}
      </Button>
      <Button
        v-if="view !== 'decades'"
        :size="$props.size"
        class="ksd-date-picker__header-view-mode"
        @click="changeView"
      >
        {{ view === "years" ? `${decade * 10}-${decade * 10 + 9}` : year }}
      </Button>
      <Text v-else class="ksd-date-picker__header-view-text" :class="classes">{{
        `${century * 100}-${century * 100 + 99}`
      }}</Text>
    </div>

    <div class="ksd-date-picker__header-right">
      <Button v-if="withMonth" type="text" :size="arrowButtonSize" @click="nextMonth">
        <template #icon>
          <VRightOutlined />
        </template>
      </Button>
      <Button type="text" :size="arrowButtonSize" @click="next">
        <template #icon>
          <VDoubleRightOutlined />
        </template>
      </Button>
    </div>
  </div>
</template>

<style lang="scss">
  .ksd-date-picker {
    &__header {
      display: flex;
      align-items: center;
      padding: var(--ksd-padding-xs);
      border-bottom: 1px solid var(--ksd-border-color);
      min-height: calc(var(--ksd-control-height) + 2 * var(--ksd-padding-xs) + 1px);

      &.size-small {
        min-height: calc(var(--ksd-control-height-sm) + 2 * var(--ksd-padding-xs) + 1px);
      }

      &.size-large {
        min-height: calc(var(--ksd-control-height-lg) + 2 * var(--ksd-padding-xs) + 1px);
      }
    }
    &__header-left {
      display: flex;
      gap: var(--ksd-padding-xxs);
      align-items: center;
    }
    &__header-right {
      display: flex;
      gap: var(--ksd-padding-xxs);
      align-items: center;
    }
    &__header-view {
      display: flex;
      flex: 1;
      padding-inline: var(--ksd-padding-xs);
      justify-content: center;
      gap: var(--ksd-padding-xs);
    }

    &__header-view-text {
      font-size: var(--ksd-font-size);

      &.size-large {
        font-size: var(--ksd-font-size-lg);
      }
    }
  }

  button.ksd-date-picker__header-month {
    padding: 0;
    border: none;
  }
  button.ksd-date-picker__header-view-mode {
    padding: 0;
    border: none;
  }
</style>
