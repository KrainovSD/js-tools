<script setup lang="ts">
  import { ref } from "vue";
  import ActionButton from "./ActionButton.vue";

  type Emits = {
    search: [query: string];
    prev: [];
    next: [];
  };

  const emit = defineEmits<Emits>();
  const query = ref("");

  function handleKeydown(event: KeyboardEvent) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    emit("search", query.value);
  }
</script>

<template>
  <div :class="$style.search">
    <input
      v-model="query"
      :class="$style.input"
      type="text"
      placeholder="Поиск (Enter)"
      @keydown="handleKeydown"
    />
    <ActionButton @click="emit('prev')">Назад</ActionButton>
    <ActionButton @click="emit('next')">Вперёд</ActionButton>
  </div>
</template>

<style lang="scss" module>
  .search {
    display: flex;
    gap: 6px;
    align-items: center;
  }

  .input {
    padding: 4px 8px;
    font: inherit;
    border: 1px solid light-dark(#333, #eee);
    border-radius: 4px;
    background: light-dark(#fff, #1e1e1e);
  }
</style>
