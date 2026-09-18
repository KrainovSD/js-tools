import { EditorView } from "@codemirror/view";
import { saveDispatch } from "@/lib/utils";

const URL_LIKE = /^https?:\/\//i;

export const pasteLink = EditorView.domEventHandlers({
  paste: (event, view) => {
    const { main } = view.state.selection;
    if (main.empty || view.state.selection.ranges.length > 1) return false;
    const clipboard = event.clipboardData?.getData("text/plain")?.trim();
    if (!clipboard || !URL_LIKE.test(clipboard)) return false;
    const selected = view.state.sliceDoc(main.from, main.to);

    if (/[\n\r]/.test(selected)) return false;
    saveDispatch(() => {
      view.dispatch({
        changes: [
          { from: main.from, insert: "[" },
          { from: main.to, insert: `](${clipboard})` },
        ],
        selection: { anchor: main.to + 3, head: main.to + 3 + clipboard.length },
        userEvent: "input.paste",
        scrollIntoView: true,
      });
    });
    return true;
  },
});
