<script setup lang="ts">
  import Button from "./Button.vue";

  export type Tab = {
    id: number;
    label: string;
  };
  export type TabsProps = {
    tabs: Tab[];
  };

  defineProps<TabsProps>();
  const selectedTab = defineModel<number>({ default: 0 });
</script>

<template>
  <div class="ksd-tabs">
    <Button
      v-for="tab in $props.tabs"
      :key="tab.id"
      type="text"
      size="default"
      class="ksd-tabs__button"
      :class="{ active: selectedTab === tab.id }"
      @click="selectedTab = tab.id"
    >
      {{ tab.label }}
    </Button>
  </div>
</template>

<style lang="scss">
  .ksd-tabs {
    display: flex;
    gap: var(--ksd-padding-xs);
    align-items: center;

    & > button.ksd-tabs__button {
      padding: 0px var(--ksd-padding-xs);
      min-height: var(--ksd-control-height-sm);
      height: var(--ksd-control-height-sm);

      &.active {
        color: var(--ksd-text-main-color);
        font-weight: var(--ksd-font-weight-strong);
        background-color: var(--ksd-bg-hover-color);
        &:hover {
          background-color: var(--ksd-bg-active-color);
        }
      }
    }
  }
</style>
