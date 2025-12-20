<script setup lang="ts">
  import type { EditorState } from "@codemirror/state";
  import type { ViewUpdate } from "@codemirror/view";
  import { getByPath, waitUntil } from "@krainovsd/js-helpers";
  import type {
    Editor,
    EditorAutoCompleteConfig,
    EditorLanguages,
    EditorTheme,
    HandleEnterKeyMapEditorFunction,
    HandleEscapeKeyMapEditorFunction,
    MultiCursorOptions,
    ProviderStatusEvent,
    ThemeOptions,
  } from "@krainovsd/markdown-editor";
  import { computed, onMounted, ref, useTemplateRef, watch } from "vue";
  import type { WebsocketProvider } from "y-websocket";
  import type { Text } from "yjs";
  import { VText } from ".";
  import type { InputVariant } from "./Input.vue";

  export type MarkdownEditorProps = {
    variant?: Exclude<InputVariant, "borderless" | "underline">;
    readonly?: boolean;
    vimMode?: boolean;
    languages?: EditorLanguages[];
    placeholder?: string;
    dark?: ThemeOptions;
    light?: ThemeOptions;
    theme?: EditorTheme;
    collabSettings?: Omit<MultiCursorOptions, "onChangeStatusProvider" | "onSyncProvider">;
    imageSrcGetter?: (src: string) => string;
    autoCompleteTagOptions?: string[];
    autoCompleteConfig?: EditorAutoCompleteConfig;
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
    changeProviderStatus: [event: ProviderStatusEvent, provider: WebsocketProvider, doc: Text];
    syncProvider: [synced: boolean, provider: WebsocketProvider, doc: Text];
    mounted: [];
    unmounted: [];
  };

  const props = defineProps<MarkdownEditorProps>();
  const emit = defineEmits<Emits>();
  const Factory = ref<typeof Editor | undefined>();
  const editor = defineModel<Editor | undefined>("editor");
  const model = defineModel<string | undefined>();
  const mountRef = useTemplateRef("mount");
  const mounted = ref(false);
  const empty = ref(false);
  const variant = computed(() => props.variant ?? "outlined");
  const focus = ref(false);
  const darkTheme = computed<ThemeOptions>(() => ({
    highlightConfig: { ...props.dark?.highlightConfig },
    themeConfig: {
      fontFamily: "Nunito",
      codeFontFamily: "FiraCode",
      background: "transparent",
      color: "var(--ksd-text-main-color)",
      ...props.dark?.themeConfig,
    },
  }));
  const lightTheme = computed<ThemeOptions>(() => ({
    highlightConfig: { ...props.light?.highlightConfig },
    themeConfig: {
      fontFamily: "Nunito",
      codeFontFamily: "FiraCode",
      background: "transparent",
      color: "var(--ksd-text-main-color)",
      ...props.light?.themeConfig,
    },
  }));
  const classes = computed(() => ({
    hidden: !mounted.value,
    [`variant-${variant.value}`]: true,
    focus: focus.value,
    disabled: props.readonly,
  }));

  function clickPlaceholder() {
    editor.value?.focus?.();
  }

  /** Init Editor instance */
  watch(
    () =>
      [
        Factory.value,
        mountRef.value,
        props.collabSettings,
        darkTheme.value,
        lightTheme.value,
        props.languages,
        props.imageSrcGetter,
        props.autoCompleteConfig,
        props.autoCompleteTagOptions,
      ] as const,
    (
      [
        Factory,
        mountRef,
        collabSettings,
        dark,
        light,
        languages,
        imageSrcGetter,
        autoCompleteConfig,
        autoCompleteTagOptions,
      ],
      _,
      clean,
    ) => {
      if (!mountRef || !Factory) return;

      let connectingCount = 0;
      let firstConnecting = true;

      if (!collabSettings) {
        mounted.value = true;
      }

      const instance = new Factory({
        root: mountRef,
        initialText: model.value,
        readonly: props.readonly,
        vimMode: props.vimMode,
        theme: props.theme,
        dark,
        light,
        autoCompleteTagOptions,
        autoCompleteConfig,
        languages,
        imageSrcGetter,
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
        onEnter: props.handleEnter,
        onFocus: (state) => {
          focus.value = true;
          emit("focus", state);
        },
        multiCursor: collabSettings
          ? {
              ...collabSettings,
              onChangeStatusProvider: (event, provider, text) => {
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
                    if (instance.view && "destroyed" in instance.view) {
                      const destroyed = getByPath(
                        instance.view,
                        "destroyed" as keyof typeof instance.view,
                      );

                      if (destroyed) {
                        return;
                      }
                    }

                    emit("disconnect");
                    break;
                  }
                  default: {
                    break;
                  }
                }
              },
            }
          : undefined,
        defaultKeyMaps: {
          vim: true,
        },
        keyMaps: [
          {
            key: "Escape",
            preventDefault: true,
            stopPropagation: true,
            run: props.handleEscape,
          },
        ],
      });
      editor.value = instance;

      if (!props.placeholder) return;

      let waiting = true;

      void waitUntil(() => !instance?.view?.dom && waiting).then(() => {
        if (!empty.value && instance?.view?.state.doc.length === 0) {
          empty.value = true;
        }
        if (empty.value && instance?.view?.state.doc.length !== 0) {
          empty.value = false;
        }
      });
      setTimeout(() => {
        waiting = false;
      }, 1000);

      emit("mounted");

      clean(() => {
        if (instance) {
          instance.destroy();
        }
        editor.value = undefined;
        emit("unmounted");
      });
    },
    { immediate: true },
  );

  /** Change vim mode */
  watch(
    () => props.vimMode,
    (vimMode) => {
      if (editor.value) {
        void editor.value.setVimMode(vimMode);
      }
    },
    { immediate: true },
  );
  /** Change readonly mode */
  watch(
    () => props.readonly,
    (readonly) => {
      if (editor.value) {
        void editor.value.setReadonly(readonly);
      }
    },
    { immediate: true },
  );
  /** Change theme mode */
  watch(
    () => props.theme,
    (theme) => {
      if (editor.value) {
        void editor.value.setTheme(theme);
      }
    },
    { immediate: true },
  );

  /** Dynamic import Editor Factory */
  onMounted(() => {
    void import("@krainovsd/markdown-editor").then((module) => {
      Factory.value = module.Editor;
    });
  });

  defineExpose({ element: mountRef, editor });
</script>

<template>
  <div ref="mount" class="ksd-markdown-editor" :class="classes">
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
