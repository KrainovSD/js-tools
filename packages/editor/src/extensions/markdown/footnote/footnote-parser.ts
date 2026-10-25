import type { BlockContext, LeafBlock, LeafBlockParser, MarkdownConfig } from "@lezer/markdown";
import { isFootnoteDefinitionStart } from "./footnote-lib";
import {
  CODE_OF_FOOTNOTE_CARET,
  CODE_OF_FOOTNOTE_END,
  CODE_OF_FOOTNOTE_START,
  CODE_OF_LINE_BREAK,
  NAME_OF_FOOTNOTE_DEFINITION,
  NAME_OF_FOOTNOTE_REF,
} from "./footnote-model";

class FootnoteDefLeafParser implements LeafBlockParser {
  nextLine() {
    return false;
  }

  finish(cx: BlockContext, leaf: LeafBlock) {
    cx.addLeafElement(
      leaf,
      cx.elt(
        NAME_OF_FOOTNOTE_DEFINITION,
        leaf.start,
        leaf.start + leaf.content.length,
        cx.parser.parseInline(leaf.content, leaf.start),
      ),
    );
    return true;
  }
}

export const footnoteParser: MarkdownConfig = {
  defineNodes: [{ name: NAME_OF_FOOTNOTE_REF }, { name: NAME_OF_FOOTNOTE_DEFINITION, block: true }],
  parseInline: [
    {
      name: NAME_OF_FOOTNOTE_REF,
      before: "Link",
      parse(cx, code, pos) {
        if (code !== CODE_OF_FOOTNOTE_START || cx.char(pos + 1) !== CODE_OF_FOOTNOTE_CARET) {
          return -1;
        }
        for (let i = pos + 2; i < cx.end; i++) {
          const charCode = cx.char(i);
          if (charCode === CODE_OF_FOOTNOTE_END) {
            if (i === pos + 2) return -1;
            return cx.addElement(cx.elt(NAME_OF_FOOTNOTE_REF, pos, i + 1));
          }
          if (charCode === CODE_OF_FOOTNOTE_START || charCode === CODE_OF_LINE_BREAK) return -1;
        }
        return -1;
      },
    },
  ],
  parseBlock: [
    {
      name: NAME_OF_FOOTNOTE_DEFINITION,
      before: "LinkReference",
      leaf(_, leaf) {
        return isFootnoteDefinitionStart(leaf.content) ? new FootnoteDefLeafParser() : null;
      },
      endLeaf(_, line) {
        return isFootnoteDefinitionStart(line.text, line.pos);
      },
    },
  ],
};
