import type {
  Editor,
  EditorTheme,
  HandleBlurEditorFunction,
  HandleChangeEditorFunction,
  HandleEnterKeyMapEditorFunction,
  HandleEscapeKeyMapEditorFunction,
  HandleFocusEditorFunction,
  MultiCursorOptions,
  ThemeOptions,
} from "@krainovsd/markdown-editor";
import clsx from "clsx";
import React from "react";
import { Text } from "../typography";
import styles from "./markdown-editor.module.scss";

type Props = {
  setEditorInstance?: (editor: Editor | null) => void;
  initialText?: string;
  className?: string;
  placeholderClassName?: string;
  readonly?: boolean;
  vimMode?: boolean;
  onBlur?: HandleBlurEditorFunction;
  onFocus?: HandleFocusEditorFunction;
  onChange?: HandleChangeEditorFunction;
  onEnter?: HandleEnterKeyMapEditorFunction;
  onEscape?: HandleEscapeKeyMapEditorFunction;
  placeholder?: string;
  roomId?: number;
  dark?: ThemeOptions;
  light?: ThemeOptions;
  theme?: EditorTheme;
  multiCursor?: MultiCursorOptions;
};

export const MarkdownEditor = React.memo(function MarkdownEditor(props: Props) {
  const [placeholder, setPlaceholder] = React.useState(false);
  const placeholderRef = React.useRef(false);
  const editorInstance = React.useRef<Editor | null>(null);
  const loadingRef = React.useRef(false);
  const mountRef = React.useRef<HTMLDivElement | null>(null);

  function initEditor() {
    loadingRef.current = true;

    void import("@krainovsd/markdown-editor").then((module) => {
      if (editorInstance.current) editorInstance.current.destroy();
      if (!mountRef.current) return;

      editorInstance.current = new module.Editor({
        root: mountRef.current,
        initialText: props.initialText,
        readonly: props.readonly,
        vimMode: props.vimMode,
        theme: props.theme,
        dark: props.dark,
        light: props.light,
        onBlur: props.onBlur,
        onChange: (view) => {
          if (!placeholderRef.current && view.state.doc.length === 0) {
            setPlaceholder(true);
            placeholderRef.current = true;
          }
          if (placeholderRef.current && view.state.doc.length !== 0) {
            setPlaceholder(false);
            placeholderRef.current = false;
          }

          return props.onChange?.(view);
        },
        onEnter: props.onEnter,
        onFocus: props.onFocus,
        languages: [],
        multiCursor: props.multiCursor,
        defaultKeyMaps: {
          vim: true,
        },
        keyMaps: [
          {
            key: "Escape",
            preventDefault: true,
            stopPropagation: true,
            run: props.onEscape,
          },
        ],
      });

      props.setEditorInstance?.(editorInstance.current);

      loadingRef.current = false;
    });
  }

  React.useEffect(() => {
    if (!mountRef.current || editorInstance.current || loadingRef.current) return;
    initEditor();

    return () => {
      if (editorInstance.current) {
        editorInstance.current.destroy();
        editorInstance.current = null;
        props.setEditorInstance?.(null);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (!editorInstance.current) return;

    editorInstance.current.setTheme(props.theme);
  }, [props.theme]);

  React.useEffect(() => {
    if (!editorInstance.current || !props.multiCursor) return;

    editorInstance.current.setUserProvider(props.multiCursor.userName, props.multiCursor.userColor);
  }, [props.multiCursor]);

  React.useEffect(() => {
    if (!editorInstance.current) return;

    editorInstance.current.setReadonly(Boolean(props.readonly));
  }, [props.readonly]);

  React.useEffect(() => {
    if (!editorInstance.current) return;

    void editorInstance.current.setVimMode(Boolean(props.vimMode));
  }, [props.vimMode]);

  return (
    <div ref={mountRef} className={clsx(styles.base, props.className)}>
      {placeholder && (
        <Text className={styles.placeholder}>
          {clsx(props.placeholder, props.placeholderClassName)}
        </Text>
      )}
    </div>
  );
});
