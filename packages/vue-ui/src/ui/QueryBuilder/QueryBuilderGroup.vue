<script
  setup
  lang="ts"
  generic="F extends string | number, O extends string | number, C extends string | number"
>
  import { VDeleteOutlined } from "@krainovsd/vue-icons";
  import { computed } from "vue";
  import Button, { type ButtonSize } from "../Button.vue";
  import DropDown, { type DropDownMenuItem } from "../DropDown.vue";
  import Tag from "../Tag.vue";
  import type { QueryCombinator, QueryConditionGroup, QueryField } from "./QueryBuilder.vue";

  type Props = {
    fields: QueryField<F, O>[];
    combinators: QueryCombinator<C>[];
    group: QueryConditionGroup<F, O, C>;
    level: number;
    root?: boolean;
    buttonSize?: ButtonSize;
  };

  type Emits = {
    addRule: [];
    addGroup: [];
    deleteGroup: [];
    changeGroupCombinator: [combinator: C];
  };

  const props = defineProps<Props>();
  const emit = defineEmits<Emits>();
  const menu = computed<DropDownMenuItem[]>(() =>
    props.combinators.map<DropDownMenuItem>((c) => ({
      key: c.value.toString(),
      label: c.label,
      onClick: () => {
        emit("changeGroupCombinator", c.value);
      },
    })),
  );
  const combinator = computed(() =>
    props.combinators.find((c) => c.value === props.group.combinator),
  );
</script>

<template>
  <div v-if="combinator" class="ksd-query-builder__group" :style="{ '--level': $props.level }">
    <div class="ksd-query-builder__group-header" :class="{ root: $props.root }">
      <DropDown :menu="menu">
        <Tag :color="combinator.color" :size="'extra-large'" class="ksd-query-builder__combinator">
          {{ combinator.label }}
        </Tag>
      </DropDown>
      <Button :size="$props.buttonSize" type="text" @click="$emit('addRule')">
        Добавить правило
      </Button>
      <Button :size="$props.buttonSize" type="text" @click="$emit('addGroup')">
        Добавить группу</Button
      >
      <Button
        v-if="!$props.root"
        :size="$props.buttonSize"
        type="text"
        @click="$emit('deleteGroup')"
      >
        <template #icon>
          <VDeleteOutlined />
        </template>
      </Button>
    </div>
    <div class="ksd-query-builder__group-body">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss">
  .ksd-query-builder {
    &__group {
      display: flex;
      width: 100%;
      flex-direction: column;
    }
    &__group-header {
      display: flex;
      width: 100%;
      align-items: center;
      gap: var(--ksd-padding-sm);
      padding: var(--ksd-padding) var(--ksd-padding) var(--ksd-padding) var(--ksd-padding-xxs);
      /* because of full borders */
      padding-left: calc(calc(48px * var(--level)) + 16px);
      border-bottom: 0.5px solid var(--ksd-border-color);
      border-top: 0.5px solid var(--ksd-border-color);
      &.root {
        border-top: none;
      }
    }

    &__combinator {
      cursor: pointer;
      margin-right: auto;
      min-width: 52px;
      justify-content: center;
    }
  }
</style>
