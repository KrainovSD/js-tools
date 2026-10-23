import { syntaxTree } from "@codemirror/language";
import { type Range } from "@codemirror/state";
import {
  Decoration,
  type DecorationSet,
  EditorView,
  ViewPlugin,
  type ViewUpdate,
} from "@codemirror/view";
import {
  fillBlockquoteContentDecorations,
  fillBlockquoteSelectionDecorations,
} from "./blockquote/blockquote-decoration";
import { fillBoldContentDecorations, fillBoldSelectionDecorations } from "./bold/bold-decoration";
import {
  fillCodeBlockContentDecorations,
  fillFencedCodeSelectionDecorations,
  fillInlineCodeSelectionDecorations,
} from "./code/code-decoration";
import {
  fillATXHeadingContentDecorations,
  fillATXHeadingSelectionDecorations,
  fillSetextHeadingContentDecorations,
  fillSetextHeadingSelectionDecorations,
} from "./header/header-decoration";
import { fillHorizontalSelectionDecorations } from "./horizontal/horizontal-decoration";
import {
  fillImageContentDecorations,
  fillImageSelectionDecorations,
} from "./image/image-decoration";
import {
  fillItalicContentDecorations,
  fillItalicSelectionDecorations,
} from "./italic/italic-decoration";
import {
  fillAutolinkSelectionDecorations,
  fillURLContentDecorations,
  fillURLSelectionDecorations,
} from "./link/auto-link-decoration";
import {
  fillLinkSelectionDecorations,
  fillShortLinkSelectionDecorations,
} from "./link/link-decoration";
import { fillListMarkSelectionDecorations } from "./list/list-decoration";
import type { MarkdownDecorationSettings } from "./markdown-model";
import {
  fillMentionContentDecorations,
  fillMentionSelectionDecorations,
} from "./mention/mention-decoration";
import {
  fillStrikeThroughContentDecorations,
  fillStrikeThroughSelectionDecorations,
} from "./strike-through/strike-through-decoration";
import { fillTodoSelectionDecorations } from "./todo/todo-decoration";
import {
  fillUnderlineContentDecorations,
  fillUnderlineSelectionDecorations,
} from "./underline/underline-decoration";

const ContentDecorationFns = {
  StrongEmphasis: fillBoldContentDecorations,
  Emphasis: fillItalicContentDecorations,
  Strikethrough: fillStrikeThroughContentDecorations,
  Underline: fillUnderlineContentDecorations,
  CodeBlock: fillCodeBlockContentDecorations,
  Image: fillImageContentDecorations,
  URL: fillURLContentDecorations,
  Mention: fillMentionContentDecorations,
  QuoteMark: fillBlockquoteContentDecorations,
  ATXHeading1: fillATXHeadingContentDecorations,
  ATXHeading2: fillATXHeadingContentDecorations,
  ATXHeading3: fillATXHeadingContentDecorations,
  ATXHeading4: fillATXHeadingContentDecorations,
  ATXHeading5: fillATXHeadingContentDecorations,
  ATXHeading6: fillATXHeadingContentDecorations,
  SetextHeading1: fillSetextHeadingContentDecorations,
  SetextHeading2: fillSetextHeadingContentDecorations,
} as const;

const SelectionDecorationFns = {
  StrongEmphasis: fillBoldSelectionDecorations,
  Emphasis: fillItalicSelectionDecorations,
  Strikethrough: fillStrikeThroughSelectionDecorations,
  Underline: fillUnderlineSelectionDecorations,
  FencedCode: fillFencedCodeSelectionDecorations,
  InlineCode: fillInlineCodeSelectionDecorations,
  HorizontalRule: fillHorizontalSelectionDecorations,
  Image: fillImageSelectionDecorations,
  Link: fillLinkSelectionDecorations,
  ShortLink: fillShortLinkSelectionDecorations,
  URL: fillURLSelectionDecorations,
  Autolink: fillAutolinkSelectionDecorations,
  ListMark: fillListMarkSelectionDecorations,
  Mention: fillMentionSelectionDecorations,
  QuoteMark: fillBlockquoteSelectionDecorations,
  Task: fillTodoSelectionDecorations,
  ATXHeading1: fillATXHeadingSelectionDecorations,
  ATXHeading2: fillATXHeadingSelectionDecorations,
  ATXHeading3: fillATXHeadingSelectionDecorations,
  ATXHeading4: fillATXHeadingSelectionDecorations,
  ATXHeading5: fillATXHeadingSelectionDecorations,
  ATXHeading6: fillATXHeadingSelectionDecorations,
  SetextHeading1: fillSetextHeadingSelectionDecorations,
  SetextHeading2: fillSetextHeadingSelectionDecorations,
} as const;

export function NewViewDecorations(settings: MarkdownDecorationSettings) {
  let contentDecorationsCache: Range<Decoration>[] = [];
  let selectionDecorationsCache: Range<Decoration>[] = [];
  let decorationsCache: DecorationSet | undefined;
  function buildDecorations(view: EditorView, contentChanged: boolean, selectionChanged: boolean) {
    if (!contentChanged && !selectionChanged && decorationsCache) {
      return decorationsCache;
    }
    const contentDecorations: Range<Decoration>[] = contentChanged ? [] : contentDecorationsCache;
    const selectionDecorations: Range<Decoration>[] = selectionChanged
      ? []
      : selectionDecorationsCache;
    const readonly = !view.state.facet(EditorView.editable);
    for (const { from: fromVisible, to: toVisible } of view.visibleRanges) {
      syntaxTree(view.state).iterate({
        from: fromVisible,
        to: toVisible,
        enter: (node) => {
          if (contentChanged) {
            ContentDecorationFns[node.name as keyof typeof ContentDecorationFns]?.({
              view,
              node,
              decorations: contentDecorations,
              settings,
            });
          }
          if (selectionChanged) {
            SelectionDecorationFns[node.name as keyof typeof SelectionDecorationFns]?.({
              view,
              node,
              decorations: selectionDecorations,
              readonly,
              settings,
            });
          }
        },
      });
    }
    contentDecorationsCache = contentDecorations;
    selectionDecorationsCache = selectionDecorations;
    decorationsCache = Decoration.set([...contentDecorations, ...selectionDecorations], true);
    return decorationsCache;
  }

  return ViewPlugin.fromClass(
    class DecorationMarkdown {
      decorations: DecorationSet;
      dom: HTMLElement;
      view: EditorView;
      controller = new AbortController();

      constructor(view: EditorView) {
        this.decorations = buildDecorations(view, true, true);
        this.dom = view.dom;
        this.view = view;
      }

      update(update: ViewUpdate) {
        const treeChanged = syntaxTree(update.startState) !== syntaxTree(update.state);
        const editableChanged =
          update.startState.facet(EditorView.editable) !== update.state.facet(EditorView.editable);
        const contentChanged = update.docChanged || update.viewportChanged || treeChanged;
        const selectionChanged =
          contentChanged || update.focusChanged || update.selectionSet || editableChanged;
        this.decorations = buildDecorations(update.view, contentChanged, selectionChanged);
      }

      destroy() {
        this.controller.abort();
      }
    },
    {
      decorations: (plugin) => plugin.decorations,
    },
  );
}
