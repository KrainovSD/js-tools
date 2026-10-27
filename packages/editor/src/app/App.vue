<script setup lang="ts">
  import { languages } from "@codemirror/language-data";
  import { computed, ref } from "vue";
  import type { AutoCompleteOptions } from "@/extensions/auto-complete";
  import type { MarkdownOptions } from "@/extensions/markdown";
  import type { Editor, ProviderStatusEvent } from "@/module";
  import ActionButton from "./components/ActionButton.vue";
  import VEditor, { type EditorKeymaps, type EditorMultiCursor } from "./components/Editor.vue";
  import LanguageSelect from "./components/LanguageSelect.vue";
  import SearchControls from "./components/SearchControls.vue";
  import ThemeSwitcher from "./components/ThemeSwitcher.vue";
  import { EDITOR_THEMES, useTheme } from "./composables/use-theme";
  import { COMMON_TEST, JSON_TEST, randomColor, randomString } from "./helpers";

  type IPlaygroundLanguage = "markdown" | "json";

  const editor = ref<Editor | undefined>();
  const content = ref(COMMON_TEST);
  const { theme } = useTheme();

  const PLAYGROUND_KEYMAPS: EditorKeymaps = {
    custom: [],
    vim: true,
  };
  const PLAYGROUND_AUTOCOMPLETE: AutoCompleteOptions = {
    tags: Array.from({ length: 100 }, () => randomString(10)),
    config: {
      closeOnBlur: false,
    },
  };
  function getRoomId() {
    return window.location.href.replace(window.location.origin, "").replace("/", "");
  }
  const multiCursorEnabled = ref(Boolean(getRoomId()));
  const multiCursorOptions = computed((): EditorMultiCursor | undefined => {
    if (!multiCursorEnabled.value) return undefined;

    return {
      roomId: getRoomId() || randomString(10),
      url: "ws://192.168.135.198:3000/ws/v1/editor/2/137",
      userName: randomString(5),
      userColor: randomColor(),
    };
  });

  const language = ref<IPlaygroundLanguage>("markdown");
  const readonly = ref(false);
  const created = ref(true);
  const resetKey = ref(0);

  const languageOptions = computed(() => ({
    name: language.value,
    ...(language.value === "markdown"
      ? ({
          languages,
          imageSrcGetter: (url: string) => url,
        } as MarkdownOptions)
      : {}),
  }));

  function pushRoomState(enabled: boolean) {
    const roomId = multiCursorOptions.value?.roomId ?? randomString(10);
    const url = enabled ? `${window.location.origin}/${roomId}` : window.location.origin;
    window.history.pushState({}, "", url);
  }

  function handleProviderStatus(event: ProviderStatusEvent) {
    // eslint-disable-next-line no-console
    console.log(event);
  }

  function handleLanguageChange(next: IPlaygroundLanguage) {
    if (next === language.value) return;

    language.value = next;
    editor.value?.replaceContent(next === "json" ? JSON_TEST : COMMON_TEST);
  }

  function handleEditModeToggle() {
    readonly.value = !readonly.value;
  }

  function handleReset() {
    resetKey.value += 1;
  }

  function handleStateToggle() {
    created.value = !created.value;
  }

  function handleMultiModeToggle() {
    multiCursorEnabled.value = !multiCursorEnabled.value;
    pushRoomState(multiCursorEnabled.value);
  }

  function handleReplace() {
    const content = Array.from({ length: 20 }, () => randomString(20)).join("\n");
    editor.value?.replaceContent(content);
  }

  function handleSearch(query: string) {
    void editor.value?.search(query);
  }

  function handleSearchPrev() {
    editor.value?.prevSearch();
  }

  function handleSearchNext() {
    editor.value?.nextSearch();
  }
</script>

<template>
  <div :class="$style.app">
    <div :class="$style.toolbar">
      <ThemeSwitcher v-model="theme" />
      <ActionButton @click="handleStateToggle">
        {{ created ? "Очистить редактор" : "Создать редактор" }}
      </ActionButton>
      <ActionButton @click="handleReplace">Вставить текст</ActionButton>
      <ActionButton @click="handleReset">Пересоздать редактор</ActionButton>
      <ActionButton @click="handleEditModeToggle">
        {{ readonly ? "Включить режим редактирования" : "Выключить режим редактирования" }}
      </ActionButton>
      <ActionButton @click="handleMultiModeToggle">
        {{ multiCursorEnabled ? "Выключить совместный режим" : "Включить совместный режим" }}
      </ActionButton>
      <LanguageSelect
        :model-value="language"
        @update:model-value="handleLanguageChange($event as IPlaygroundLanguage)"
      />
      <SearchControls @search="handleSearch" @prev="handleSearchPrev" @next="handleSearchNext" />
    </div>

    <div :class="$style.hints">
      <span>Переключить vim mode: Mod-Alt-v</span>
      <span>Форматировать: Shift-Alt-F</span>
    </div>

    <VEditor
      v-if="created"
      :key="resetKey"
      v-model:editor="editor"
      v-model="content"
      :class="$style.editor"
      :theme="EDITOR_THEMES[theme]"
      :language="languageOptions"
      :multi-cursor="multiCursorOptions"
      :readonly="readonly"
      format-on-open
      :autocomplete="PLAYGROUND_AUTOCOMPLETE"
      :keymaps="PLAYGROUND_KEYMAPS"
      @change-provider-status="handleProviderStatus"
    />
  </div>
</template>

<style lang="scss" module>
  .app {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-height: 0;
    padding: 10px;
  }

  .toolbar {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
  }

  .hints {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 20px;
  }

  .editor {
    flex: 1 1 auto;
    min-height: 0;
    margin-top: 20px;
    overflow: hidden;
  }
</style>
