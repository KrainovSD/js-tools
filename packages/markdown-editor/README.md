# @krainovsd/markdown-editor

## Download

```
pnpm i @krainovsd/markdown-editor
```

## Usage


```ts
import { Editor } from "@krainovsd/markdown-editor";

const root = document.querySelector<HTMLElement>("#root");

const editor = new Editor({
    root,
    initialText: "",
  });
```

## API

### root

Type: `HTMLElement`<br>
Required: `true`

The node for mounting the editor.

### initialText

Type: `string | undefined`

Initial text after mounting the editor.

### multiCursor 

Type: `object | undefined`<br>
Properties:
- url (`string`) - path to yjs ws provider.
- roomId (`string`) - id for yjs ws provider.
- userName (`string | undefined`) - username to display above cursor. 
- userColor (`string | undefined`) - cursor's color.
- onStartProvider: (`(status?: string) => void`) - execute by change provider's status.
  
Options for multi cursor mode.

### readonly

Type: `boolean`<br>
Default: `false`

### vimMode

Type: `boolean`<br>
Default: `false`

### theme

Type: `"dark" | "light"`<br>
Default: `"light"`

### dark, light

Type: `ThemeOptions`

Color configs to change default dark or light theme.

### languages

Type: `LanguageDescription[] | undefined`

List of languages for markdown code section. Provided by [@codemirror/language-data](https://github.com/codemirror/language-data)

### keyMaps

Type: `KeyBinding[]`

Array of custom key map combination. Mod is Cmd on mac and Ctrl on other platforms. [More information](https://codemirror.net/docs/ref/#view.keymap) 

### defaultKeyMaps

Type: `object`<br>
Properties: 
- theme (`boolean`) - switch theme `Mod-Alt-a`
- vim (`boolean`) - switch vim mode `Mod-Alt-v`


### onBlur

Type: `((state: EditorState) => void) | undefined` 

Execute by blur root node of editor.

### onFocus

Type: `((state: EditorState) => void) | undefined` 

Execute by focus root node of editor.

### onChange

Type: `((view: ViewUpdate) => void) | undefined` 

Execute by change text in editor.

### onEnter

Type: `((view: EditorView) => boolean) | undefined` 

Execute by keydown event in root node of editor. <br>
**Warning!!!** Line break will be canceled If set `true` by return of function. Only `shift + Enter` will be worked.

### onEscape

Type: `((view: EditorView) => boolean) | undefined` 

Execute by keydown event in root node of editor.
