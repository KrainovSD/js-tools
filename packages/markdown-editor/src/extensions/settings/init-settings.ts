import { history } from "@codemirror/commands";
import { type Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { vim } from "@replit/codemirror-vim";
import { ReadonlyCompartment, VimModeCompartment } from "../compartments";

export type InitSettingsOptions = {
  readonly?: boolean;
  vimMode?: boolean;
};

export function InitSettings({ readonly, vimMode }: InitSettingsOptions): Extension[] {
  return [
    ReadonlyCompartment.of(EditorView.editable.of(!readonly)),
    VimModeCompartment.of(vimMode ? vim({ status: true }) : []),
    history(),
  ];
}
