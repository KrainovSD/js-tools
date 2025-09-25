<script
  setup
  lang="ts"
  generic="F extends string | number, O extends string | number, C extends string | number"
>
  import { VDeleteOutlined } from "@krainovsd/vue-icons";
  import { computed } from "vue";
  import Button from "../Button.vue";
  import DropDown, { type DropDownMenuItem } from "../DropDown.vue";
  import type { FilterItem } from "../Filter.vue";
  import Tag from "../Tag.vue";
  import type { QueryCombinator, QueryConditionGroup } from "./QueryBuilder.vue";

  type Props = {
    fields: FilterItem<F, O>[];
    combinators: QueryCombinator<C>[];
    group: QueryConditionGroup<F, O, C>;
    root?: boolean;
  };

  type Emits = {
    addRule: [];
    addGroup: [];
    deleteGroup: [];
    changeGroup: [combinator: C];
  };

  const props = defineProps<Props>();
  const emit = defineEmits<Emits>();
  const menu = computed<DropDownMenuItem[]>(() =>
    props.combinators.map<DropDownMenuItem>((c) => ({
      key: c.value.toString(),
      label: c.label,
      onClick: () => {
        emit("changeGroup", c.value);
      },
    })),
  );
  const combinator = computed(() =>
    props.combinators.find((c) => c.value === props.group.combinator),
  );
</script>

<template>
  <div v-if="combinator" class="ksd-query-builder__group">
    <div class="ksd-query-builder__group-header">
      <DropDown :menu="menu">
        <Tag :color="combinator.color" :size="'extra-large'" class="ksd-query-builder__combinator">
          {{ combinator.label }}
        </Tag>
      </DropDown>
      <Button type="text" @click="$emit('addRule')">Добавить правило</Button>
      <Button type="text" @click="$emit('addGroup')">Добавить группу</Button>
      <Button v-if="!$props.root" type="text" @click="$emit('deleteGroup')">
        <template #icon>
          <VDeleteOutlined />
        </template>
      </Button>
    </div>
    <div class="ksd-query-builder__group-body"></div>
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
    }
    &__group-body {
    }
    &__combinator {
      cursor: pointer;
      margin-right: auto;
    }
  }
</style>
