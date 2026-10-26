import { foldEffect, syntaxTree, unfoldEffect } from "@codemirror/language";
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
  fillCalloutContentDecorations,
  fillCalloutSelectionDecorations,
} from "./callout/callout-decoration";
import {
  fillCodeBlockContentDecorations,
  fillFencedCodeSelectionDecorations,
  fillInlineCodeSelectionDecorations,
} from "./code/code-decoration";
import {
  fillFootnoteDefinitionContentDecorations,
  fillFootnoteRefContentDecorations,
  fillFootnoteRefSelectionDecorations,
} from "./footnote/footnote-decoration";
import {
  fillHashtagContentDecorations,
  fillHashtagSelectionDecorations,
} from "./hashtag/hashtag-decoration";
import {
  fillATXHeadingContentDecorations,
  fillATXHeadingSelectionDecorations,
  fillSetextHeadingContentDecorations,
  fillSetextHeadingSelectionDecorations,
} from "./header/header-decoration";
import {
  fillHighlightContentDecorations,
  fillHighlightSelectionDecorations,
} from "./highlight/highlight-decoration";
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
import {
  type MarkdownDecorationSettings,
  NAME_OF_AUTO_LINK,
  NAME_OF_BLOCKQUOTE,
  NAME_OF_BOLD,
  NAME_OF_CODE_BLOCK,
  NAME_OF_FENCED_CODE,
  NAME_OF_FOOTNOTE_DEFINITION,
  NAME_OF_FOOTNOTE_REF,
  NAME_OF_HASHTAG,
  NAME_OF_HEADER,
  NAME_OF_HEADER_UNDER,
  NAME_OF_HIGHLIGHT,
  NAME_OF_HORIZONTAL_RULE,
  NAME_OF_IMAGE,
  NAME_OF_INLINE_CODE,
  NAME_OF_ITALIC,
  NAME_OF_LINK,
  NAME_OF_LIST_MARK,
  NAME_OF_MENTION,
  NAME_OF_QUOTE_MARK,
  NAME_OF_SHORT_LINK,
  NAME_OF_STRIKE_THROUGH,
  NAME_OF_TODO,
  NAME_OF_UNDERLINE,
  NAME_OF_URL,
} from "./markdown-model";
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
  [NAME_OF_BOLD]: fillBoldContentDecorations,
  [NAME_OF_ITALIC]: fillItalicContentDecorations,
  [NAME_OF_STRIKE_THROUGH]: fillStrikeThroughContentDecorations,
  [NAME_OF_UNDERLINE]: fillUnderlineContentDecorations,
  [NAME_OF_CODE_BLOCK]: fillCodeBlockContentDecorations,
  [NAME_OF_IMAGE]: fillImageContentDecorations,
  [NAME_OF_URL]: fillURLContentDecorations,
  [NAME_OF_MENTION]: fillMentionContentDecorations,
  [NAME_OF_HIGHLIGHT]: fillHighlightContentDecorations,
  [NAME_OF_HASHTAG]: fillHashtagContentDecorations,
  [NAME_OF_FOOTNOTE_REF]: fillFootnoteRefContentDecorations,
  [NAME_OF_FOOTNOTE_DEFINITION]: fillFootnoteDefinitionContentDecorations,
  [NAME_OF_QUOTE_MARK]: fillBlockquoteContentDecorations,
  [NAME_OF_BLOCKQUOTE]: fillCalloutContentDecorations,
  [`${NAME_OF_HEADER}1`]: fillATXHeadingContentDecorations,
  [`${NAME_OF_HEADER}2`]: fillATXHeadingContentDecorations,
  [`${NAME_OF_HEADER}3`]: fillATXHeadingContentDecorations,
  [`${NAME_OF_HEADER}4`]: fillATXHeadingContentDecorations,
  [`${NAME_OF_HEADER}5`]: fillATXHeadingContentDecorations,
  [`${NAME_OF_HEADER}6`]: fillATXHeadingContentDecorations,
  [`${NAME_OF_HEADER_UNDER}1`]: fillSetextHeadingContentDecorations,
  [`${NAME_OF_HEADER_UNDER}2`]: fillSetextHeadingContentDecorations,
} as const;

const SelectionDecorationFns = {
  [NAME_OF_BOLD]: fillBoldSelectionDecorations,
  [NAME_OF_ITALIC]: fillItalicSelectionDecorations,
  [NAME_OF_STRIKE_THROUGH]: fillStrikeThroughSelectionDecorations,
  [NAME_OF_UNDERLINE]: fillUnderlineSelectionDecorations,
  [NAME_OF_FENCED_CODE]: fillFencedCodeSelectionDecorations,
  [NAME_OF_INLINE_CODE]: fillInlineCodeSelectionDecorations,
  [NAME_OF_HORIZONTAL_RULE]: fillHorizontalSelectionDecorations,
  [NAME_OF_IMAGE]: fillImageSelectionDecorations,
  [NAME_OF_LINK]: fillLinkSelectionDecorations,
  [NAME_OF_SHORT_LINK]: fillShortLinkSelectionDecorations,
  [NAME_OF_URL]: fillURLSelectionDecorations,
  [NAME_OF_AUTO_LINK]: fillAutolinkSelectionDecorations,
  [NAME_OF_LIST_MARK]: fillListMarkSelectionDecorations,
  [NAME_OF_MENTION]: fillMentionSelectionDecorations,
  [NAME_OF_HIGHLIGHT]: fillHighlightSelectionDecorations,
  [NAME_OF_HASHTAG]: fillHashtagSelectionDecorations,
  [NAME_OF_FOOTNOTE_REF]: fillFootnoteRefSelectionDecorations,
  [NAME_OF_QUOTE_MARK]: fillBlockquoteSelectionDecorations,
  [NAME_OF_BLOCKQUOTE]: fillCalloutSelectionDecorations,
  [NAME_OF_TODO]: fillTodoSelectionDecorations,
  [`${NAME_OF_HEADER}1`]: fillATXHeadingSelectionDecorations,
  [`${NAME_OF_HEADER}2`]: fillATXHeadingSelectionDecorations,
  [`${NAME_OF_HEADER}3`]: fillATXHeadingSelectionDecorations,
  [`${NAME_OF_HEADER}4`]: fillATXHeadingSelectionDecorations,
  [`${NAME_OF_HEADER}5`]: fillATXHeadingSelectionDecorations,
  [`${NAME_OF_HEADER}6`]: fillATXHeadingSelectionDecorations,
  [`${NAME_OF_HEADER_UNDER}1`]: fillSetextHeadingSelectionDecorations,
  [`${NAME_OF_HEADER_UNDER}2`]: fillSetextHeadingSelectionDecorations,
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
        const foldChanged = update.transactions.some((transaction) =>
          transaction.effects.some((effect) => effect.is(foldEffect) || effect.is(unfoldEffect)),
        );
        const contentChanged =
          update.docChanged || update.viewportChanged || treeChanged || foldChanged;
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
