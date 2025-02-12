import type { EditorState } from "@codemirror/state";

type OverlapMarkOptions = {
  state: EditorState;
  shift: number;
  marks: (number | undefined)[];
  requireMatched: number[];
};

export function overlapMark({ marks, shift, state, requireMatched }: OverlapMarkOptions) {
  const { from, to, shiftAfterInner, shiftAfterOuter, shiftBeforeInner, shiftBeforeOuter, text } =
    processShiftContent(state, shift, marks);

  const startIndex = findMarkIndex(
    text.substring(0, shiftBeforeInner + shiftBeforeOuter),
    marks,
    requireMatched,
    "right",
  );
  const endIndex = findMarkIndex(
    text.substring(text.length - shiftAfterInner - shiftAfterOuter),
    marks,
    requireMatched,
    "left",
  );

  const start = ~startIndex ? from - shiftBeforeOuter + startIndex : -1;
  const end = ~endIndex ? to - shiftAfterInner + endIndex : -1;

  // console.log({
  //   from,
  //   to,
  //   shiftAfterInner,
  //   shiftAfterOuter,
  //   shiftBeforeInner,
  //   shiftBeforeOuter,
  //   text,
  //   textStart: text.substring(0, shiftBeforeInner + shiftBeforeOuter),
  //   textEnd: text.substring(text.length - shiftAfterInner - shiftAfterOuter),
  //   startIndex,
  //   endIndex,
  //   end,
  //   start,
  // });

  return {
    start,
    end,
    marked: Boolean(~start || ~end),
    originalText: text.substring(shiftBeforeOuter, text.length - shiftAfterOuter),
  };
}

function findMarkIndex(
  text: string,
  marks: (number | undefined)[],
  requireMatched: number[],
  direction: "right" | "left" = "right",
) {
  if (text.length === 0) return -1;

  const maxRequired = Math.max(...requireMatched);
  const minRequired = Math.min(...requireMatched);

  let pos = 0;
  let matched = 0;
  let start = -1;

  for (const mark of marks) {
    if (!mark) continue;

    while (pos < text.length) {
      if (text.codePointAt(pos) === mark) matched++;
      else {
        if (
          // eslint-disable-next-line no-loop-func --  https://eslint.org/docs/latest/rules/no-loop-func#known-limitations
          requireMatched.some((rm) => rm === matched) &&
          ((direction === "right" && pos - matched > start) ||
            (direction === "left" && (pos - matched < start || start === -1)))
        ) {
          start = direction === "right" ? pos - minRequired : pos - matched;
          // console.log({ pos, matched, start, minRequired, maxRequired, direction });
        } else if (maxRequired < matched) {
          const posMin = pos - minRequired;
          const posMax = pos - 1 - maxRequired;

          // console.log({ posMin, posMax, pos, minRequired, maxRequired, direction });

          if (direction === "right" && posMin > start) start = posMin;
          if (direction === "left" && (posMax < start || start === -1)) start = posMax;
        }
        matched = 0;
      }
      pos++;
    }

    if (
      // eslint-disable-next-line no-loop-func --  https://eslint.org/docs/latest/rules/no-loop-func#known-limitations
      requireMatched.some((rm) => rm === matched) &&
      ((direction === "right" && pos - matched > start) ||
        (direction === "left" && (pos - matched < start || start === -1)))
    ) {
      start = direction === "right" ? pos - minRequired : pos - matched;
      // console.log({ pos, matched, start, minRequired, maxRequired, direction });
    } else if (maxRequired < matched) {
      const posMin = pos - minRequired;
      const posMax = pos - 1 - maxRequired;

      // console.log({ posMin, posMax, pos, minRequired, maxRequired, direction });

      if (direction === "right" && posMin > start) start = posMin;
      if (direction === "left" && (posMax < start || start === -1)) start = posMax;
    }

    pos = 0;
    matched = 0;
  }

  return start;
}

function processShiftContent(state: EditorState, shift: number, marks: (number | undefined)[]) {
  const { from, to } = state.selection.ranges[0];
  const linePoint = state.lineBreak.codePointAt(0);
  let pos = 0;

  /** processing outer shifts */
  const initialTextBefore = state.sliceDoc(from - shift, from);
  let shiftBeforeOuter = 0;
  pos = initialTextBefore.length - 1;

  while (pos > -1) {
    if (initialTextBefore.codePointAt(pos) === linePoint) break;
    shiftBeforeOuter++;
    pos--;
  }

  const initialTextAfter = state.sliceDoc(to, to + shift);
  let shiftAfterOuter = 0;
  pos = 0;

  while (pos < initialTextAfter.length) {
    if (initialTextAfter.codePointAt(pos) === linePoint) break;
    shiftAfterOuter++;
    pos++;
  }

  /** processing inner shifts */
  const initialText = state.sliceDoc(from, to);
  let shiftBeforeInner = 0;
  pos = 0;

  while (pos < initialText.length) {
    // eslint-disable-next-line no-loop-func --  https://eslint.org/docs/latest/rules/no-loop-func#known-limitations
    if (marks.some((m) => m === initialText.codePointAt(pos))) shiftBeforeInner++;
    else break;

    pos++;
  }

  const initialTextWithoutBeforeShift = initialText.substring(shiftBeforeInner + 1);
  let shiftAfterInner = 0;
  pos = initialTextWithoutBeforeShift.length - 1;

  while (pos > -1) {
    // eslint-disable-next-line no-loop-func --  https://eslint.org/docs/latest/rules/no-loop-func#known-limitations
    if (marks.some((m) => m === initialTextWithoutBeforeShift.codePointAt(pos))) shiftAfterInner++;
    else break;

    pos--;
  }

  const text = state.sliceDoc(from - shiftBeforeOuter, to + shiftAfterOuter);

  return {
    from,
    to,
    shiftBeforeOuter,
    shiftBeforeInner,
    shiftAfterOuter,
    shiftAfterInner,
    text,
  };
}
