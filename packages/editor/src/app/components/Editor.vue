<script setup lang="ts">
  import type { EditorState, Extension } from "@codemirror/state";
  import { type ViewUpdate } from "@codemirror/view";
  import { computed, ref, useTemplateRef, watch } from "vue";
  import type { WebsocketProvider } from "y-websocket";
  import type { Text } from "yjs";
  import type { AutoCompleteOptions } from "@/extensions/auto-complete";
  import type { LanguageOptions } from "@/extensions/language";
  import type { VimOptions } from "@/extensions/vim";
  import { Editor } from "@/module";
  import type {
    HandleEnterKeyMapEditorFunction,
    HandleEscapeKeyMapEditorFunction,
    KeyMapsOptions,
    MultiCursorOptions,
    ProviderStatusEvent,
    YText,
    YWebsocketProvider,
  } from "@/module";

  export type EditorMultiCursor = Omit<
    MultiCursorOptions,
    "onChangeStatusProvider" | "onSyncProvider"
  >;

  export type EditorKeymaps = Omit<KeyMapsOptions, "onEnter" | "onEscape">;

  export type EditorProps = {
    readonly?: boolean;
    vimMode?: boolean;
    placeholder?: string;
    multiCursor?: EditorMultiCursor;
    vim?: VimOptions;
    autocomplete?: AutoCompleteOptions;
    keymaps?: EditorKeymaps;
    language?: LanguageOptions;
    formatOnOpen?: boolean;
    theme?: Extension[] | Extension;
    font?: string;
    fontCode?: string;
    handleEnter?: HandleEnterKeyMapEditorFunction;
    handleEscape?: HandleEscapeKeyMapEditorFunction;
  };
  type Emits = {
    blur: [state: EditorState];
    focus: [state: EditorState];
    change: [view: ViewUpdate];
    changeView: [view: ViewUpdate];
    connectError: [first: boolean];
    disconnect: [];
    connect: [first: boolean];
    changeProviderStatus: [event: ProviderStatusEvent, provider: YWebsocketProvider, doc: YText];
    syncProvider: [synced: boolean, provider: WebsocketProvider, doc: Text];
    mounted: [];
    unmounted: [];
  };

  const props = defineProps<EditorProps>();
  const emit = defineEmits<Emits>();
  const editor = defineModel<Editor | undefined>("editor");
  const model = defineModel<string | undefined>();
  const mountRef = useTemplateRef("mount");
  const mounted = ref(false);
  const empty = ref(false);
  const focus = ref(false);
  const classes = computed(() => ({
    hidden: !mounted.value,
    focus: focus.value,
    disabled: props.readonly,
  }));
  const styles = computed(() => ({
    "--ksd-md-code-font": props.fontCode ?? "monospace",
    "--ksd-editor-font": props.font ?? "inherit",
  }));

  function clickPlaceholder() {
    editor.value?.focus?.();
  }

  watch(
    () => [mountRef.value, props.multiCursor, props.keymaps] as const,
    ([mountRef, multiCursor, keymaps], _, clean) => {
      if (!mountRef) return;
      let connectingCount = 0;
      let firstConnecting = true;
      let disposed = false;
      if (!multiCursor) {
        mounted.value = true;
      }

      function onChangeStatusProvider(
        event: ProviderStatusEvent,
        provider: YWebsocketProvider,
        text: YText,
      ) {
        emit("changeProviderStatus", event, provider, text);
        switch (event.status) {
          case "connected": {
            mounted.value = true;
            emit("connect", firstConnecting);
            connectingCount = 0;
            firstConnecting = false;
            break;
          }
          case "connecting": {
            connectingCount++;
            if (connectingCount > 5) {
              connectingCount = 0;
              emit("connectError", firstConnecting);
            }
            break;
          }
          case "disconnected": {
            connectingCount = 0;
            if (disposed) return;
            emit("disconnect");
            break;
          }
          default: {
            break;
          }
        }
      }

      const instance = new Editor({
        root: mountRef,
        initialText: model.value,
        formatOnOpen: props.formatOnOpen,
        theme: props.theme,
        settings: {
          readonly: props.readonly,
          vim: props.vimMode,
        },
        vim: props.vim,
        autocomplete: props.autocomplete,
        language: props.language,
        multiCursor: multiCursor ? { ...multiCursor, onChangeStatusProvider } : undefined,
        keymaps: {
          ...(keymaps ?? {}),
          onEnter: props.handleEnter,
          onEscape: props.handleEscape,
        },
        listeners: {
          onBlur: (state) => {
            focus.value = false;
            emit("blur", state);
          },
          onViewChange: (view) => {
            if (view.docChanged) {
              if (!empty.value && view.state.doc.length === 0) {
                empty.value = true;
              } else if (empty.value && view.state.doc.length !== 0) {
                empty.value = false;
              }
              model.value = view.state.doc.toString();
              emit("change", view);
            }
            emit("changeView", view);
          },
          onFocus: (state) => {
            focus.value = true;
            emit("focus", state);
          },
        },
      });
      void instance.init().then(() => {
        if (disposed) return;
        empty.value = instance.view?.state.doc.length === 0;
      });
      editor.value = instance;
      emit("mounted");
      clean(() => {
        disposed = true;
        void instance.destroy();
        editor.value = undefined;
        emit("unmounted");
      });
    },
    { immediate: true },
  );

  watch(
    () => props.vimMode,
    (vimMode) => {
      if (editor.value) {
        void editor.value.setVimMode(vimMode);
      }
    },
    { immediate: false },
  );

  watch(
    () => props.readonly,
    (readonly) => {
      if (editor.value) {
        void editor.value.setReadonly(readonly);
      }
    },
    { immediate: false },
  );

  watch(
    () => props.language,
    (language) => {
      if (!editor.value || !language) return;
      void editor.value.setLanguage(language);
    },
    { immediate: false },
  );

  watch(
    () => props.autocomplete,
    (autocomplete) => {
      if (!editor.value || !autocomplete) return;
      void editor.value.setAutocomplete(autocomplete);
    },
    { immediate: false },
  );

  watch(
    () => props.theme,
    (theme) => {
      if (!editor.value || !theme) return;
      void editor.value.setTheme(theme);
    },
    { immediate: false },
  );

  defineExpose({ element: mountRef, editor });
</script>

<template>
  <div ref="mount" class="ksd-markdown-editor" :class="classes" :style="styles">
    <span
      v-if="mounted && empty"
      class="ksd-markdown-editor__placeholder"
      :class="classes"
      @click="clickPlaceholder"
    >
      {{ placeholder }}
    </span>
    <slot></slot>
  </div>
</template>

<style lang="scss">
  .ksd-markdown-editor {
    width: 100%;
    min-height: 100px;
    height: fit-content;
    display: flex;
    position: relative;
    overflow: hidden;
    border: 1px solid currentColor;

    & .cm-editor.cm-editor {
      background: transparent;
    }

    & .cm-content {
      padding-block: 0;
    }

    &.hidden * {
      display: none;
    }

    &.disabled {
      cursor: not-allowed;
      box-shadow: none;
    }

    &__placeholder {
      position: absolute;
      z-index: 1;
    }
  }
</style>
