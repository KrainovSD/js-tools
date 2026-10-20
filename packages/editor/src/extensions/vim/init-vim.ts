import { type Extension } from "@codemirror/state";
import { drawSelection } from "@codemirror/view";

type VimApi = {
  map: (lhs: string, rhs: string, ctx: "normal" | "insert" | "visual") => void;
  unmap: (lhs: string, ctx: "normal" | "insert" | "visual") => void;
};
export type VimMode = "normal" | "insert" | "visual";
export type VimMapping = [string, string, VimMode];
export type VimUnMapping = [string, VimMode];
export type VimOptions = {
  mappings?: VimMapping[];
  unMappings?: VimUnMapping[];
};
export type VimGetter = (enabled: boolean) => Promise<Extension>;

export function NewVim(opts: VimOptions | undefined): VimGetter {
  const mergedSettings: VimOptions = {
    mappings: [...(DefaultOptions.mappings ?? []), ...(opts?.mappings ?? [])],
    unMappings: [...(DefaultOptions.unMappings ?? []), ...(opts?.unMappings ?? [])],
  };
  return async (enabled) => {
    if (!enabled) return [];
    const { vim, Vim } = await import("@replit/codemirror-vim");
    registerVimMappings(Vim as VimApi, mergedSettings);
    return [vim({ status: true }), drawSelection()];
  };
}

let vimMappingsRegistered = false;

const DefaultOptions: VimOptions = {
  mappings: [
    ["H", "4h", "normal"],
    ["L", "4l", "normal"],
    ["J", "4j", "normal"],
    ["K", "4k", "normal"],
    ["H", "4h", "visual"],
    ["L", "4l", "visual"],
    ["J", "4j", "visual"],
    ["K", "4k", "visual"],
    ["jk", "<Esc>", "insert"],
  ],
};

function registerVimMappings(vimApi: VimApi, settings: VimOptions) {
  if (vimMappingsRegistered) return;
  vimMappingsRegistered = true;

  for (const r of settings?.mappings ?? []) {
    vimApi.map(r[0], r[1], r[2]);
  }
  for (const r of settings?.unMappings ?? []) {
    vimApi.unmap(r[0], r[1]);
  }
}
