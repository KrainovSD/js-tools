import type { EditorView } from "@codemirror/view";
import type { MarkdownDecorationSettings } from "../markdown-model";
import { MarkdownState } from "../markdown-state";

export type ImageViewerSettings = Pick<
  MarkdownDecorationSettings,
  "imageSrcGetter" | "imageFullscreenRoot" | "imageTransition"
>;

export function NewImageViewer(settings: ImageViewerSettings) {
  let opened = false;
  return async (view: EditorView, from: number): Promise<void> => {
    if (opened) return;
    const entries = view.state.field(MarkdownState).getImages(view.state, true);
    const startIndex = entries.findIndex((entry) => from >= entry.from && from <= entry.to);
    if (startIndex === -1) return;
    opened = true;
    try {
      const [{ default: Viewer }] = await Promise.all([
        import("viewerjs"),
        import("viewerjs/dist/viewer.css"),
      ]);
      const list = document.createElement("div");
      for (const entry of entries) {
        const image = document.createElement("img");
        image.alt = entry.text;
        image.dataset.url = settings.imageSrcGetter
          ? settings.imageSrcGetter(entry.url)
          : entry.url;
        list.appendChild(image);
      }
      const ref: { current?: InstanceType<typeof Viewer> } = {};
      ref.current = new Viewer(list, {
        container: settings.imageFullscreenRoot ?? document.body,
        url: (image) => image.dataset.url ?? "",
        initialViewIndex: startIndex,
        inline: false,
        toolbar: false,
        autoplay: false,
        transition: settings.imageTransition ?? true,
        navbar: true,
        navigation: true,
        title: true,
        tooltip: true,
        loading: true,
        backdrop: true,
        button: true,
        focus: true,
        fullscreen: true,
        loop: true,
        keyboard: true,
        preload: true,
        movable: true,
        zoomable: true,
        rotatable: true,
        scalable: true,
        zoomOnWheel: true,
        zoomOnGesture: true,
        zoomOnTouch: true,
        slideOnTouch: true,
        toggleOnDblclick: true,
        hidden: () => {
          ref.current?.destroy();
          ref.current = undefined;
          opened = false;
        },
      });
      ref.current.show();
    } catch {
      opened = false;
    }
  };
}
