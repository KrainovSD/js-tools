<script setup lang="ts">
  import type { EditorState, Extension } from "@codemirror/state";
  import { type ViewUpdate } from "@codemirror/view";
  import type {
    AutoCompleteOptions,
    Editor,
    HandleEnterKeyMapEditorFunction,
    HandleEscapeKeyMapEditorFunction,
    KeyMapsOptions,
    LanguageOptions,
    MultiCursorOptions,
    ProviderStatusEvent,
    VimOptions,
    YText,
    YWebsocketProvider,
  } from "@krainovsd/editor";
  import { computed, onMounted, ref, useTemplateRef, watch } from "vue";
  import type { WebsocketProvider } from "y-websocket";
  import type { Text } from "yjs";
  import { VText } from ".";
  import type { InputVariant } from "./Input.vue";

  export type EditorMultiCursor = Omit<
    MultiCursorOptions,
    "onChangeStatusProvider" | "onSyncProvider"
  >;
  export type EditorKeymaps = Omit<KeyMapsOptions, "onEnter" | "onEscape">;

  export type EditorProps = {
    variant?: Exclude<InputVariant, "borderless" | "underline">;
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
  const Factory = ref<typeof Editor | undefined>();
  const editor = defineModel<Editor | undefined>("editor");
  const model = defineModel<string | undefined>();
  const mountRef = useTemplateRef("mount");
  const mounted = ref(false);
  const empty = ref(false);
  const variant = computed(() => props.variant ?? "outlined");
  const focus = ref(false);
  const classes = computed(() => ({
    hidden: !mounted.value,
    [`variant-${variant.value}`]: true,
    focus: focus.value,
    disabled: props.readonly,
  }));
  const styles = computed(() => ({
    "--ksd-cm-code-font": props.fontCode ?? "monospace",
    "--ksd-cm-font": props.font ?? "inherit",
  }));

  function clickPlaceholder() {
    editor.value?.focus?.();
  }

  watch(
    () => [Factory.value, mountRef.value, props.multiCursor, props.keymaps] as const,
    ([Factory, mountRef, multiCursor, keymaps], _, clean) => {
      if (!mountRef || !Factory) return;
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

      const instance = new Factory({
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

  onMounted(() => {
    void import("@krainovsd/editor/styles.css");
    void import("@krainovsd/editor").then((module) => {
      Factory.value = module.Editor;
    });
  });

  defineExpose({ element: mountRef, editor });
</script>

<template>
  <div ref="mount" class="ksd-markdown-editor" :class="classes" :style="styles">
    <VText
      v-if="mounted && empty"
      ref="placeholder"
      type="secondary"
      class="ksd-markdown-editor__placeholder"
      :class="classes"
      @click="clickPlaceholder"
    >
      {{ placeholder }}
    </VText>
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
    transition:
      border var(--ksd-transition-mid),
      background var(--ksd-transition-mid);
    padding-inline: calc(var(--ksd-input-padding-inline) - 6px);

    & .cm-editor.cm-editor {
      background: transparent;
    }

    & .cm-scroller {
      padding-block: calc(var(--ksd-input-padding-block-lg));
      line-height: var(--ksd-line-height);
    }
    & .cm-content {
      padding-block: 0;
    }

    &.hidden * {
      display: none;
    }

    &.variant-outlined {
      border-radius: var(--ksd-border-radius-lg);
      background: var(--ksd-bg-container-color);
      border-width: 1px;
      border-style: solid;
      border-color: var(--ksd-border-color);

      &:not(.disabled) {
        &.focus {
          border-color: var(--ksd-accent-color);
          box-shadow: var(--ksd-input-active-shadow);
        }
        &:hover {
          border-color: var(--ksd-accent-hover-color);
        }
      }
    }
    &.variant-filled {
      border-radius: var(--ksd-border-radius-lg);
      background: var(--ksd-bg-fill-color);
      border-width: 1px;
      border-style: solid;
      border-color: transparent;

      &:not(.disabled) {
        &:hover {
          background: var(--ksd-bg-fill-hover-color);
        }

        &.focus {
          border-color: var(--ksd-accent-color);
          background: var(--ksd-bg-container-color);
        }
      }
    }

    &.disabled {
      cursor: not-allowed;
      color: var(--ksd-text-main-disabled-color);
      background-color: var(--ksd-bg-disabled-color);
      border-color: var(--ksd-border-color);
      box-shadow: none;
    }

    &__placeholder {
      position: absolute;
      z-index: 1;
      left: var(--ksd-input-padding-inline);
      top: calc(
        var(--ksd-input-padding-block-lg) +
          (
            (
              (
                  var(--ksd-font-size) * var(--ksd-line-height) - var(--ksd-font-size) *
                    var(--ksd-line-height)
                ) /
                2
            )
          )
      );

      &.disabled {
        color: var(--ksd-text-main-disabled-color);
      }
    }
  }
</style>
