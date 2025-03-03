import { history } from "@codemirror/commands";
import { type Extension } from "@codemirror/state";
import { EditorView, drawSelection } from "@codemirror/view";
import { ReadonlyCompartment, VimModeCompartment } from "../compartments";

export type InitSettingsOptions = {
  readonly?: boolean;
  vimMode?: boolean;
};

export async function initSettings({
  readonly,
  vimMode,
}: InitSettingsOptions): Promise<Extension[]> {
  let vimExtension: Extension = [];
  if (vimMode) {
    const { vim } = await import("@replit/codemirror-vim");
    vimExtension = [vim({ status: true }), drawSelection()];
  }

  return [
    ReadonlyCompartment.of(EditorView.editable.of(!readonly)),
    VimModeCompartment.of(vimExtension),
    history(),
  ];
}
